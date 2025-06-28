import { useEffect, useCallback } from "react";
import { useAuthState } from "./auth/useAuthState";
import { useProfile } from "./auth/useProfile";
import { usePendingListing } from "./auth/usePendingListing";
import { clearAllAppData } from "@/utils/storageUtils";
import { toast } from "sonner";

// Optimized auth hook with better state management
export const useAuth = () => {
  const { user, session, loading: authLoading, signOut } = useAuthState();
  const { 
    profile, 
    isLoading: profileLoading, 
    error: profileError,
    fetchProfile, 
    updateProfile,
    clearProfile 
  } = useProfile();
  const { isPublishingPending, publishPendingListing } = usePendingListing();

  // Memoized cleanup function
  const clearAllPendingData = useCallback(() => {
    const cleared = clearAllAppData();
    if (cleared) {
      toast.success("All pending data has been cleared");
    } else {
      toast.error("Failed to clear pending data");
    }
    return cleared;
  }, []);

  // Optimized effect for handling auth state changes
  useEffect(() => {
    if (authLoading) return; // Wait for auth to load

    if (session?.user) {
      // User is authenticated - fetch profile
      const userId = session.user.id;
      
      // Debounce profile fetching to avoid multiple calls
      const timeoutId = setTimeout(() => {
        fetchProfile(userId);
      }, 100);

      // Handle pending listing publication
      if (session && user && !isPublishingPending) {
        const publishTimeoutId = setTimeout(() => {
          publishPendingListing(userId);
        }, 1000);

        return () => {
          clearTimeout(timeoutId);
          clearTimeout(publishTimeoutId);
        };
      }

      return () => clearTimeout(timeoutId);
    } else {
      // User is not authenticated - clear profile
      clearProfile();
    }
  }, [session?.user?.id, authLoading, fetchProfile, clearProfile, publishPendingListing, isPublishingPending]);

  // Handle profile errors
  useEffect(() => {
    if (profileError) {
      console.error('Profile error:', profileError);
      // Don't show toast for common errors to avoid spam
      if (!profileError.includes('not found') && !profileError.includes('PGRST116')) {
        toast.error(`Profile error: ${profileError}`);
      }
    }
  }, [profileError]);

  // Memoized enhanced sign out
  const enhancedSignOut = useCallback(async () => {
    try {
      clearProfile();
      await signOut();
    } catch (error) {
      console.error('Error during enhanced sign out:', error);
    }
  }, [signOut, clearProfile]);

  return {
    // Auth state
    user,
    session,
    profile,
    
    // Loading states
    loading: authLoading,
    profileLoading,
    isPublishingPending,
    
    // Computed state
    isAuthenticated: !!user && !!session,
    
    // Actions
    signOut: enhancedSignOut,
    updateProfile: user ? (updates: any) => updateProfile(user.id, updates) : undefined,
    clearAllPendingData,
    
    // Error state
    profileError,
  };
};