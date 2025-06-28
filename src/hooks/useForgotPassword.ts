import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UseForgotPasswordProps {
  onSuccess?: () => void;
}

export const useForgotPassword = ({ onSuccess }: UseForgotPasswordProps = {}) => {
  const [isLoading, setIsLoading] = useState(false);

  const sendResetEmail = async (email: string) => {
    if (!email) {
      toast.error("Please enter your email address");
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    setIsLoading(true);
    
    try {
      console.log('Sending password reset email to:', email);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?mode=reset-password`,
      });

      if (error) {
        console.error('Password reset error:', error);
        
        // Handle specific error cases
        if (error.message.includes('User not found')) {
          toast.error("No account found with this email address. Please check your email or sign up for a new account.");
        } else if (error.message.includes('Email rate limit exceeded')) {
          toast.error("Too many reset attempts. Please wait a few minutes before trying again.");
        } else if (error.message.includes('Invalid email')) {
          toast.error("Please enter a valid email address.");
        } else {
          toast.error(`Failed to send reset email: ${error.message}`);
        }
        return false;
      }

      console.log('Password reset email sent successfully');
      toast.success("Password reset email sent! Please check your inbox and follow the instructions.");
      
      if (onSuccess) {
        onSuccess();
      }
      
      return true;
    } catch (error: any) {
      console.error('Unexpected error during password reset:', error);
      toast.error("An unexpected error occurred. Please try again later.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (newPassword: string, accessToken: string) => {
    if (!newPassword) {
      toast.error("Please enter a new password");
      return false;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }

    setIsLoading(true);

    try {
      console.log('Updating password with access token');
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('Password update error:', error);
        toast.error(`Failed to update password: ${error.message}`);
        return false;
      }

      console.log('Password updated successfully');
      toast.success("Password updated successfully! You can now sign in with your new password.");
      return true;
    } catch (error: any) {
      console.error('Unexpected error during password update:', error);
      toast.error("An unexpected error occurred. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendResetEmail,
    resetPassword,
    isLoading
  };
};