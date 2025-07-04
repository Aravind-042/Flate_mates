
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface UseSigninProps {
  onSuccess?: () => void;
}

export const useSignin = ({ onSuccess }: UseSigninProps = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const signIn = async (email: string, password: string) => {
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    try {
      console.log('Attempting sign in for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }
      
      console.log('Sign in successful:', data.user?.id);
      toast.success("Welcome back!");
      
      // Handle successful sign in
      if (onSuccess) {
        onSuccess();
      } else {
        // If no onSuccess callback, navigate to home
        navigate('/');
      }
    } catch (error: any) {
      console.error('Error signing in:', error);
      
      // Provide more specific error messages
      if (error.message?.includes('Invalid login credentials')) {
        toast.error("Invalid email or password. Please check your credentials and try again.");
      } else if (error.message?.includes('Email not confirmed')) {
        toast.error("Please verify your email address before signing in.");
      } else if (error.message?.includes('Too many requests')) {
        toast.error("Too many login attempts. Please wait a moment and try again.");
      } else {
        toast.error(error.message || "Failed to sign in");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { signIn, isLoading };
};
