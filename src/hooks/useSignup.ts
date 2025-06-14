
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UseSignupProps {
  onSuccess?: () => void;
}

export const useSignup = ({ onSuccess }: UseSignupProps = {}) => {
  const [isLoading, setIsLoading] = useState(false);

  const signUp = async (email: string, password: string, fullName: string, role: 'flat_seeker' | 'flat_owner') => {
    if (!email || !password || !fullName) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    try {
      console.log('Attempting sign up with data:', {
        email,
        full_name: fullName,
        role: role
      });

      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            role: role
          }
        }
      });

      if (error) {
        console.error('Sign up error details:', {
          message: error.message,
          status: error.status,
          name: error.name
        });
        throw error;
      }
      
      console.log('Sign up response:', {
        user_id: data.user?.id,
        user_email: data.user?.email,
        session_exists: !!data.session
      });
      
      toast.success("Account created successfully! Please check your email to verify your account.");
      
      // Handle successful sign up
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error signing up:', error);
      
      // Provide more specific error messages
      if (error.message?.includes('User already registered')) {
        toast.error("An account with this email already exists. Please sign in instead.");
      } else if (error.message?.includes('Invalid email')) {
        toast.error("Please enter a valid email address.");
      } else if (error.message?.includes('Password')) {
        toast.error("Password must be at least 6 characters long.");
      } else {
        toast.error(error.message || "Failed to create account. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { signUp, isLoading };
};
