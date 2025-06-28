import { useState, useEffect, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { clearPendingListingData } from "@/utils/storageUtils";

// Optimized auth state management with better caching
export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Memoized sign out function
  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      
      // Clear auth state immediately for better UX
      setUser(null);
      setSession(null);
      
      await supabase.auth.signOut();
      
      // Clear all session data
      localStorage.clear();
      sessionStorage.clear();
      
      // Force a reload to ensure clean state
      window.location.replace("/");
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    // Clear any pending data on mount
    clearPendingListingData();

    // Optimized session initialization
    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
        }
        
        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Set up optimized auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (!mounted) return;

        // Batch state updates for better performance
        setSession(session);
        setUser(session?.user ?? null);
        
        // Only set loading to false after initial load
        if (loading) {
          setLoading(false);
        }

        // Handle specific auth events
        switch (event) {
          case 'SIGNED_IN':
            console.log('User signed in:', session?.user?.id);
            break;
          case 'SIGNED_OUT':
            console.log('User signed out');
            // Clear any cached data
            localStorage.removeItem('pendingListingData');
            break;
          case 'TOKEN_REFRESHED':
            console.log('Token refreshed for user:', session?.user?.id);
            break;
        }
      }
    );

    // Initialize auth state
    initializeAuth();

    // Cleanup function
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array for mount-only effect

  return {
    user,
    session,
    loading,
    signOut
  };
};