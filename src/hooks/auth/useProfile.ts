import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "./types";

// Optimized profile management with better error handling
export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoized fetch function with retry logic
  const fetchProfile = useCallback(async (userId: string, retryCount = 0) => {
    if (!userId) {
      setError('User ID is required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Fetching profile for user:', userId);
      
      const { data: profileData, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (fetchError) {
        console.error('Error fetching profile:', fetchError);
        
        // Retry logic for new users
        if (fetchError.code === 'PGRST116' && retryCount < 3) {
          console.log(`Profile not found, retrying in ${(retryCount + 1) * 1000}ms...`);
          setTimeout(() => fetchProfile(userId, retryCount + 1), (retryCount + 1) * 1000);
          return;
        }
        
        setError(fetchError.message);
        return;
      }
      
      if (profileData) {
        console.log('Profile loaded successfully:', profileData.id);
        setProfile(profileData as Profile);
      } else {
        console.log('No profile found for user, may be a new user');
        setProfile(null);
      }
    } catch (error: any) {
      console.error('Error in fetchProfile:', error);
      setError(error.message || 'Failed to fetch profile');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Memoized update function
  const updateProfile = useCallback(async (userId: string, updates: Partial<Profile>) => {
    if (!userId) {
      setError('User ID is required');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating profile:', updateError);
        setError(updateError.message);
        return false;
      }

      if (data) {
        setProfile(data as Profile);
        console.log('Profile updated successfully');
        return true;
      }

      return false;
    } catch (error: any) {
      console.error('Error in updateProfile:', error);
      setError(error.message || 'Failed to update profile');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Clear profile data
  const clearProfile = useCallback(() => {
    setProfile(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    profile,
    isLoading,
    error,
    setProfile,
    fetchProfile,
    updateProfile,
    clearProfile
  };
};