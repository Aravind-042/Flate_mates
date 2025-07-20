import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type OAuthProvider = 'google' | 'github';

interface UseOAuthProps {
  onSuccess?: () => void;
}

export const useOAuth = ({ onSuccess }: UseOAuthProps = {}) => {
  const [isLoading, setIsLoading] = useState<Record<OAuthProvider, boolean>>({
    google: false,
    github: false
  });
  const navigate = useNavigate();

  const signInWithProvider = async (provider: OAuthProvider) => {
    setIsLoading(prev => ({ ...prev, [provider]: true }));
    
    try {
      console.log(`Attempting OAuth sign in with ${provider}`);
      
      // Get the current URL for redirect
      const currentUrl = window.location.origin;
      const redirectTo = currentUrl.includes('localhost') 
        ? 'http://localhost:8080/' 
        : currentUrl + '/';
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        console.error(`${provider} OAuth error:`, error);
        throw error;
      }

      console.log(`${provider} OAuth initiated successfully`);
      
      // Note: The actual sign-in completion will be handled by the auth state change listener
      // We don't need to handle success here as the redirect will take care of it
      
    } catch (error: any) {
      console.error(`Error signing in with ${provider}:`, error);
      
      // Provide specific error messages
      if (error.message?.includes('refused to connect') || error.message?.includes('CORS')) {
        toast.error(`${provider} OAuth is not configured yet. Please contact support or use email/password sign-in.`);
      } else if (error.message?.includes('popup')) {
        toast.error(`Please allow popups for ${provider} sign-in to work properly.`);
      } else if (error.message?.includes('cancelled')) {
        toast.info(`${provider} sign-in was cancelled.`);
      } else if (error.message?.includes('network')) {
        toast.error("Network error. Please check your connection and try again.");
      } else {
        toast.error(`${provider} OAuth is not available yet. Please use email/password sign-in.`);
      }
    } finally {
      setIsLoading(prev => ({ ...prev, [provider]: false }));
    }
  };

  return {
    signInWithProvider,
    isLoading
  };
};