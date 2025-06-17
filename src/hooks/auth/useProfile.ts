
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "./types";

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);

  const fetchProfile = async (userId: string, retryCount = 0) => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching profile:', error);
        
        // If profile doesn't exist and this is a new user, try to create it
        if (error.code === 'PGRST116' && retryCount === 0) {
          console.log('Profile not found, user might be new. Waiting for trigger...');
          // Wait a bit for the trigger to create the profile
          setTimeout(() => fetchProfile(userId, 1), 2000);
          return;
        }
        return;
      }
      
      if (profileData) {
        console.log('Profile loaded successfully:', profileData);
        setProfile(profileData as Profile);
      } else {
        console.log('No profile found for user');
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    }
  };

  return {
    profile,
    setProfile,
    fetchProfile
  };
};
