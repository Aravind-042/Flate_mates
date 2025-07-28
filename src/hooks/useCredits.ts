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

export const useCredits = () => {
  const queryClient = useQueryClient();

  // Fetch user credits
  const { data: credits, isLoading: creditsLoading } = useQuery({
    queryKey: ['user-credits'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_credits')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw error;
      }

      // If no credits record exists, create one with default 10 credits
      if (!data) {
        const { data: newCredits, error: insertError } = await supabase
          .from('user_credits')
          .insert({ user_id: user.id, credits: 10 })
          .select('*')
          .single();

        if (insertError) throw insertError;
        return newCredits;
      }

      return data;
    },
    enabled: true,
  });

  // Fetch user referrals
  const { data: referrals } = useQuery({
    queryKey: ['user-referrals'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Check if user can access contact
  const checkContactAccess = async (listingId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('consume_credit_for_contact', {
        listing_id: listingId,
      });

      if (error) {
        console.error('Error checking contact access:', error);
        return false;
      }

      // Refetch credits after consuming
      queryClient.invalidateQueries({ queryKey: ['user-credits'] });
      
      return data;
    } catch (error) {
      console.error('Error checking contact access:', error);
      return false;
    }
  };

  // Create referral
  const createReferralMutation = useMutation({
    mutationFn: async (referredEmail: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Generate referral code
      const { data: referralCode, error: codeError } = await supabase.rpc('generate_referral_code');
      if (codeError) throw codeError;

      const { data, error } = await supabase
        .from('referrals')
        .insert({
          referrer_id: user.id,
          referred_email: referredEmail,
          referral_code: referralCode,
        })
        .select('*')
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-referrals'] });
      toast.success('Referral created successfully!');
    },
    onError: (error) => {
      console.error('Error creating referral:', error);
      toast.error('Failed to create referral');
    },
  });

  // Generate referral link
  const generateReferralLink = (referralCode: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/auth?ref=${referralCode}`;
  };

  return {
    credits: credits?.credits || 0,
    creditsLoading,
    referrals: referrals || [],
    checkContactAccess,
    createReferral: createReferralMutation.mutate,
    isCreatingReferral: createReferralMutation.isPending,
    generateReferralLink,
  };
};