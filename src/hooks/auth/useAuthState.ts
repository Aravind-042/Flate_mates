
import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { clearPendingListingData } from "@/utils/storageUtils";

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      // Force clear all session data in localStorage & cookies for extra safety
      localStorage.clear();
      sessionStorage.clear();
      setUser(null);
      setSession(null);
      // Force a reload to ensure state is correct everywhere
      window.location.replace("/");
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    clearPendingListingData();
    // Set up auth state listener - must be synchronous
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Initial session fetch
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
      }
      console.log('Initial session check:', session?.user?.id, session);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // DEBUG: Show the current computed value of user and return value
  useEffect(() => {
    console.log("[useAuth Hook] Current user:", user, "session:", session);
  }, [user, session]);

  return {
    user,
    session,
    loading,
    signOut
  };
};
