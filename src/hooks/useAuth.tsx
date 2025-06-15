import { useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { FlatListing } from "@/types/flat";
import { clearPendingListingData, clearAllAppData } from "@/utils/storageUtils";

// --- Profile types
interface Profile {
  id: string;
  email: string;
  phone_number: string;
  full_name: string | null;
  city: string | null;
  profile_picture_url: string | null;
  bio: string | null;
  age: number | null;
  profession: string | null;
  is_verified: boolean | null;
  created_at: string;
  updated_at: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPublishingPending, setIsPublishingPending] = useState(false);
  const navigate = useNavigate();

  // Fetch user profile data with better error handling
  const fetchProfile = async (userId: string, retryCount = 0) => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching profile:', error);
        
        // If profile doesn't exist and this is a new user, try to create it
        if (error.code === 'PGRST116' && retryCount === 0) {
          console.log('Profile not found, user might be new. Waiting for trigger...');
          // Wait a bit for the trigger to create the profile
          setTimeout(() => fetchProfile(userId, 1), 2000);
          return;
        }
        return;
      }
      
      if (profileData) {
        console.log('Profile loaded successfully:', profileData);
        setProfile(profileData as Profile);
      } else {
        console.log('No profile found for user');
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    }
  };

  // Validate listing data before submission
  const validateListingData = (listingData: FlatListing): boolean => {
    console.log('Validating listing data:', listingData);
    
    if (!listingData.title?.trim()) {
      console.error('Validation failed: Title is required');
      return false;
    }
    
    if (!listingData.description?.trim()) {
      console.error('Validation failed: Description is required');
      return false;
    }
    
    if (!listingData.location?.city?.trim()) {
      console.error('Validation failed: City is required');
      return false;
    }
    
    if (!listingData.location?.area?.trim()) {
      console.error('Validation failed: Area is required');
      return false;
    }
    
    if (!listingData.rent?.amount || listingData.rent.amount <= 0) {
      console.error('Validation failed: Rent amount must be greater than 0, got:', listingData.rent?.amount);
      return false;
    }
    
    return true;
  };

  // Publish any pending listing after sign up
  const publishPendingListing = async (userId: string) => {
    if (isPublishingPending) {
      console.log('Already publishing pending listing, skipping...');
      return;
    }

    try {
      setIsPublishingPending(true);
      const pendingData = localStorage.getItem('pendingListingData');
      if (!pendingData) {
        console.log('No pending listing data found');
        return;
      }

      console.log('Found pending listing data, attempting to parse...');
      const listingData: FlatListing = JSON.parse(pendingData);
      
      // Validate the data before attempting to submit
      if (!validateListingData(listingData)) {
        console.error('Pending listing data is invalid, clearing localStorage');
        clearPendingListingData();
        toast.error("Invalid listing data found. Please create your listing again.");
        return;
      }

      const dbListingData = {
        owner_id: userId,
        title: listingData.title,
        description: listingData.description,
        property_type: listingData.property.type as 'apartment' | 'independent_house' | 'villa' | 'pg' | 'shared_room' | 'studio',
        bedrooms: listingData.property.bedrooms,
        bathrooms: listingData.property.bathrooms,
        is_furnished: listingData.property.furnished,
        parking_available: listingData.property.parking,
        monthly_rent: listingData.rent.amount,
        security_deposit: listingData.rent.deposit || 0,
        rent_includes: listingData.rent.includes,
        amenities: listingData.amenities,
        preferred_gender: listingData.preferences.gender as 'male' | 'female' | 'any',
        preferred_professions: listingData.preferences.profession,
        lifestyle_preferences: listingData.preferences.additionalRequirements ? [listingData.preferences.additionalRequirements] : [],
        contact_phone: listingData.contactPreferences.call,
        contact_whatsapp: listingData.contactPreferences.whatsapp,
        contact_email: listingData.contactPreferences.email,
        images: listingData.images,
        address_line1: listingData.location.address || `${listingData.location.area}, ${listingData.location.city}`,
        status: 'active' as 'active' | 'inactive' | 'rented' | 'expired'
      };

      console.log('Submitting validated listing data:', dbListingData);

      const { data, error } = await supabase
        .from('flat_listings')
        .insert(dbListingData)
        .select()
        .single();

      if (error) {
        console.error('Error publishing pending listing:', error);
        clearPendingListingData();
        toast.error("Failed to publish your listing: " + error.message);
        return;
      }

      console.log('Listing published successfully:', data);
      clearPendingListingData();
      toast.success("Your listing has been published successfully!");
      setTimeout(() => navigate('/profile'), 2000);
    } catch (error) {
      console.error('Error in publishPendingListing:', error);
      clearPendingListingData();
      toast.error("Failed to publish your listing. Please try creating it again.");
    } finally {
      setIsPublishingPending(false);
    }
  };

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

  useEffect(() => {
    // Clear any pending data on component mount to prevent issues
    clearPendingListingData();
    
    // Set up auth state listener - must be synchronous
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        // Only synchronous state updates here!
        setSession(session);
        setUser(session?.user ?? null);

        // Async operations deferred with setTimeout
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 100);

          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            setTimeout(() => publishPendingListing(session.user.id), 1000);
          }
        } else {
          setProfile(null);
        }

        setLoading(false);
      }
    );

    // Initial session fetch
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
      }
      console.log('Initial session check:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setProfile(null);
      setUser(null);
      setSession(null);
      navigate("/");
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // DEBUG: Show the current computed value of user and return value
  // (This will print every time useAuth is used or state changes)
  useEffect(() => {
    console.log("[useAuth Hook] Current user:", user, "session:", session);
  }, [user, session]);

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
