import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useRateLimit = () => {
  const checkRateLimit = async (actionType: string, maxAttempts = 10, windowMinutes = 60): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('check_rate_limit', {
        action_type: actionType,
        max_attempts: maxAttempts,
        window_minutes: windowMinutes
      });

      if (error) {
        console.error('Rate limit check error:', error);
        return true; // Allow on error to not block legitimate users
      }

      if (!data) {
        toast.error(`Too many attempts. Please wait ${windowMinutes} minutes before trying again.`);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Rate limit check failed:', error);
      return true; // Allow on error
    }
  };

  const logSecurityEvent = async (action: string, resourceType?: string, resourceId?: string, details?: any) => {
    try {
      await supabase.rpc('log_security_event', {
        action_type: action,
        resource_type: resourceType,
        resource_id: resourceId,
        details: details
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  };

  return {
    checkRateLimit,
    logSecurityEvent
  };
};