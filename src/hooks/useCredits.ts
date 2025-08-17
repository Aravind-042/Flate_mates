import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface UserCredits {
  id: string;
  user_id: string;
  credits: number;
  created_at: string;
  updated_at: string;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referred_email: string;
  referred_user_id?: string;
  status: 'pending' | 'completed' | 'expired';
  referral_code: string;
  credits_awarded: number;
  created_at: string;
  updated_at: string;
}

export interface ContactAccessLog {
  id: string;
  user_id: string;
  listing_id: string;
  accessed_at: string;
  credits_used: number;
}

export const useCredits = () => {
  const queryClient = useQueryClient();
  const [optimisticCredits, setOptimisticCredits] = useState<number | null>(null);

  // Fetch user credits with better error handling
  const { data: credits, isLoading: creditsLoading, error: creditsError } = useQuery({
    queryKey: ['user-credits'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      console.log('Fetching credits for user:', user.id);

      const { data, error } = await supabase
        .from('user_credits')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching credits:', error);
        throw error;
      }

      // If no credits record exists, create one with default 10 credits
      if (!data) {
        console.log('No credits record found, creating default record with 10 credits');
        
        // First try using the database function
        const { data: functionResult, error: functionError } = await supabase
          .rpc('get_user_credit_balance', { target_user_id: user.id });

        if (!functionError && functionResult !== null) {
          console.log('Credits initialized via function, balance:', functionResult);
          
          // Fetch the created record
          const { data: newData, error: fetchError } = await supabase
            .from('user_credits')
            .select('*')
            .eq('user_id', user.id)
            .single();
            
          if (!fetchError && newData) {
            return newData;
          }
        }

        // Fallback to direct insert if function fails
        console.log('Function approach failed, trying direct insert');
        const { data: newCredits, error: insertError } = await supabase
          .from('user_credits')
          .insert({ user_id: user.id, credits: 10 })
          .select('*')
          .single();

        if (insertError) {
          console.error('Error creating default credits:', insertError);
          throw insertError;
        }
        
        console.log('Created default credits record:', newCredits);
        return newCredits;
      }

      console.log('Found existing credits record:', data);
      return data;
    },
    enabled: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Fetch user referrals
  const { data: referrals, isLoading: referralsLoading } = useQuery({
    queryKey: ['user-referrals'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching referrals:', error);
        throw error;
      }
      
      return data || [];
    },
    enabled: true,
  });

  // Fetch contact access history
  const { data: contactHistory } = useQuery({
    queryKey: ['contact-access-history'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('contact_access_log')
        .select(`
          *,
          flat_listings (
            title,
            monthly_rent
          )
        `)
        .eq('user_id', user.id)
        .order('accessed_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching contact history:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: true,
  });

  // Enhanced contact access with optimistic updates and rate limiting
  const checkContactAccess = async (listingId: string): Promise<boolean> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Please sign in to access contact information');
      return false;
    }

    // First check if user already accessed this contact (no rate limiting needed)
    try {
      const { data: existingAccess } = await supabase
        .from('contact_access_log')
        .select('id')
        .eq('user_id', user.id)
        .eq('listing_id', listingId)
        .maybeSingle();

      if (existingAccess) {
        // User already has access, don't charge again
        toast.success('Contact information already unlocked!');
        return true;
      }
    } catch (error) {
      console.error('Error checking existing access:', error);
    }

    // Check rate limit only for new contact access attempts
    try {
      const { data: rateLimitOk } = await supabase.rpc('check_rate_limit', {
        action_type: 'contact_access',
        max_attempts: 20,
        window_minutes: 60
      });

      if (!rateLimitOk) {
        toast.error('Too many contact access attempts. Please wait before trying again.');
        return false;
      }
    } catch (error) {
      console.error('Rate limit check failed:', error);
    }

    const currentCredits = optimisticCredits ?? credits?.credits ?? 0;
    
    if (currentCredits <= 0) {
      toast.error('Insufficient credits. Refer friends to earn more!');
      return false;
    }

    try {
      // Optimistic update - immediately reduce credits in UI
      setOptimisticCredits(currentCredits - 1);

      // Use RPC function to consume credit atomically
      const { data: success, error } = await supabase.rpc('consume_credit_for_contact', {
        listing_id: listingId,
      });

      if (error) {
        console.error('Error consuming credit:', error);
        setOptimisticCredits(null); // Reset optimistic update
        
        if (error.message?.includes('insufficient credits')) {
          toast.error('Insufficient credits. Refer friends to earn more!');
        } else {
          toast.error('Failed to access contact information. Please try again.');
        }
        return false;
      }

      if (!success) {
        setOptimisticCredits(null); // Reset optimistic update
        toast.error('Unable to access contact information. You may have insufficient credits.');
        return false;
      }

      // Success - invalidate queries to get fresh data
      queryClient.invalidateQueries({ queryKey: ['user-credits'] });
      queryClient.invalidateQueries({ queryKey: ['contact-access-history'] });
      
      // Clear optimistic update after a delay to show smooth transition
      setTimeout(() => setOptimisticCredits(null), 1000);
      
      toast.success('Contact information unlocked! 1 credit used.');
      return true;
    } catch (error) {
      console.error('Unexpected error accessing contact:', error);
      setOptimisticCredits(null); // Reset optimistic update
      toast.error('An unexpected error occurred. Please try again.');
      return false;
    }
  };

  // Enhanced referral creation with validation
  const createReferralMutation = useMutation({
    mutationFn: async (referredEmail: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(referredEmail)) {
        throw new Error('Please enter a valid email address');
      }

      // Check if email is already referred by this user
      const { data: existingReferral } = await supabase
        .from('referrals')
        .select('id')
        .eq('referrer_id', user.id)
        .eq('referred_email', referredEmail)
        .maybeSingle();

      if (existingReferral) {
        throw new Error('You have already referred this email address');
      }

      // Check if user is trying to refer themselves
      if (referredEmail.toLowerCase() === user.email?.toLowerCase()) {
        throw new Error('You cannot refer yourself');
      }

      // Generate referral code
      const { data: referralCode, error: codeError } = await supabase.rpc('generate_referral_code');
      if (codeError) {
        console.error('Error generating referral code:', codeError);
        throw new Error('Failed to generate referral code');
      }

      const { data, error } = await supabase
        .from('referrals')
        .insert({
          referrer_id: user.id,
          referred_email: referredEmail,
          referral_code: referralCode,
        })
        .select('*')
        .single();

      if (error) {
        console.error('Error creating referral:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user-referrals'] });
      toast.success(`Referral created! Share this link: ${generateReferralLink(data.referral_code)}`);
    },
    onError: (error: any) => {
      console.error('Error creating referral:', error);
      toast.error(error.message || 'Failed to create referral');
    },
  });

  // Enhanced credit purchase simulation (for future payment integration)
  const purchaseCreditsMutation = useMutation({
    mutationFn: async (creditPackage: { credits: number; price: number }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // This would integrate with payment gateway in production
      // For now, simulate successful purchase
      const { data, error } = await supabase
        .from('user_credits')
        .update({ 
          credits: (credits?.credits || 0) + creditPackage.credits 
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user-credits'] });
      toast.success(`Successfully purchased ${variables.credits} credits!`);
    },
    onError: (error) => {
      console.error('Error purchasing credits:', error);
      toast.error('Failed to purchase credits');
    },
  });

  // Generate referral link with better formatting
  const generateReferralLink = (referralCode: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/auth?ref=${referralCode}&utm_source=referral&utm_medium=link`;
  };

  // Get credit status with helpful messaging
  const getCreditStatus = () => {
    const currentCredits = optimisticCredits ?? credits?.credits ?? 0;
    
    if (currentCredits === 0) {
      return {
        status: 'empty',
        message: 'No credits remaining',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      };
    } else if (currentCredits <= 3) {
      return {
        status: 'low',
        message: 'Running low on credits',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200'
      };
    } else if (currentCredits <= 10) {
      return {
        status: 'medium',
        message: 'Good credit balance',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
      };
    } else {
      return {
        status: 'high',
        message: 'Excellent credit balance',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      };
    }
  };

  // Calculate referral earnings
  const getTotalReferralEarnings = () => {
    return referrals?.reduce((total, referral) => total + (referral.credits_awarded || 0), 0) || 0;
  };

  // Get pending referrals count
  const getPendingReferralsCount = () => {
    return referrals?.filter(referral => referral.status === 'pending').length || 0;
  };

  // Check if user has accessed a specific listing's contact
  const hasAccessedContact = (listingId: string): boolean => {
    return contactHistory?.some(access => access.listing_id === listingId) || false;
  };

  return {
    // Core data
    credits: optimisticCredits ?? credits?.credits ?? 0,
    creditsLoading: creditsLoading || optimisticCredits !== null,
    creditsError,
    referrals: referrals || [],
    referralsLoading,
    contactHistory: contactHistory || [],
    
    // Actions
    checkContactAccess,
    createReferral: createReferralMutation.mutate,
    isCreatingReferral: createReferralMutation.isPending,
    purchaseCredits: purchaseCreditsMutation.mutate,
    isPurchasingCredits: purchaseCreditsMutation.isPending,
    
    // Utilities
    generateReferralLink,
    getCreditStatus,
    getTotalReferralEarnings,
    getPendingReferralsCount,
    hasAccessedContact,
    
    // Computed values
    isLowOnCredits: (optimisticCredits ?? credits?.credits ?? 0) <= 3,
    hasNoCredits: (optimisticCredits ?? credits?.credits ?? 0) === 0,
    canAccessContact: (optimisticCredits ?? credits?.credits ?? 0) > 0,
  };
};