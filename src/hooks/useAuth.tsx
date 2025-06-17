
import { useEffect } from "react";
import { useAuthState } from "./auth/useAuthState";
import { useProfile } from "./auth/useProfile";
import { usePendingListing } from "./auth/usePendingListing";
import { clearAllAppData } from "@/utils/storageUtils";
import { toast } from "sonner";

export const useAuth = () => {
  const { user, session, loading, signOut } = useAuthState();
  const { profile, setProfile, fetchProfile } = useProfile();
  const { isPublishingPending, publishPendingListing } = usePendingListing();

  // Manual cleanup function
  const clearAllPendingData = () => {
    const cleared = clearAllAppData();
    if (cleared) {
      toast.success("All pending data has been cleared");
    } else {
      toast.error("Failed to clear pending data");
    }
    return cleared;
  };

  // Handle auth state changes and fetch profile/publish pending listings
  useEffect(() => {
    if (session?.user) {
      setTimeout(() => {
        fetchProfile(session.user.id);
      }, 100);

      // Only publish pending listing on sign in events
      const shouldPublishPending = session && user;
      if (shouldPublishPending) {
        setTimeout(() => publishPendingListing(session.user.id), 1000);
      }
    } else {
      setProfile(null);
    }
  }, [session?.user, user, fetchProfile, publishPendingListing, setProfile]);

  return {
    user,
    session,
    profile,
    loading,
    signOut,
    isAuthenticated: !!user,
    clearAllPendingData
  };
};
