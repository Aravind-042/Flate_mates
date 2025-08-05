import { useEffect, useCallback } from "react";
import { useAuthState } from "./useAuthState";
import { useProfile } from "./useProfile";
import { usePendingListing } from "./usePendingListing";
import { useFavoritesStore } from "@/store/favoritesStore";
import { clearAllAppData } from "@/utils/storageUtils";
import { toast } from "sonner";

export const useOptimizedAuth = () => {
  const { user, session, loading, signOut } = useAuthState();
  const { profile, setProfile, fetchProfile } = useProfile();
  const { isPublishingPending, publishPendingListing } = usePendingListing();
  const { loadFavorites } = useFavoritesStore();

  // Optimized profile and favorites loading
  const loadUserData = useCallback(async (userId: string) => {
    try {
      // Load profile and favorites in parallel for better performance
      await Promise.all([
        fetchProfile(userId),
        loadFavorites(userId)
      ]);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }, [fetchProfile, loadFavorites]);

  // Manual cleanup function
  const clearAllPendingData = useCallback(() => {
    const cleared = clearAllAppData();
    if (cleared) {
      toast.success("All pending data has been cleared");
    } else {
      toast.error("Failed to clear pending data");
    }
    return cleared;
  }, []);

  // Handle auth state changes and fetch profile/publish pending listings
  useEffect(() => {
    if (session?.user) {
      // Use a small delay to ensure proper initialization
      const timer = setTimeout(() => {
        loadUserData(session.user.id);
      }, 100);

      // Handle pending listing publication
      if (session && user) {
        const publishTimer = setTimeout(() => {
          publishPendingListing(session.user.id);
        }, 1000);
        
        return () => {
          clearTimeout(timer);
          clearTimeout(publishTimer);
        };
      }

      return () => clearTimeout(timer);
    } else {
      setProfile(null);
    }
  }, [session?.user, user, loadUserData, publishPendingListing, setProfile]);

  return {
    user,
    session,
    profile,
    loading,
    signOut,
    isAuthenticated: !!user,
    clearAllPendingData,
    isPublishingPending,
    loadUserData
  };
};