
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { FlatListing } from "@/types/flat";
import { clearPendingListingData, getPendingListingData } from "@/utils/storageUtils";

export const usePendingListing = () => {
  const [isPublishingPending, setIsPublishingPending] = useState(false);
  const navigate = useNavigate();

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

  const publishPendingListing = async (userId: string) => {
    if (isPublishingPending) {
      console.log('Already publishing pending listing, skipping...');
      return;
    }

    try {
      setIsPublishingPending(true);
      const listingData = getPendingListingData();
      if (!listingData) {
        console.log('No pending listing data found');
        return;
      }

      console.log('Found pending listing data, validating...');
      
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

  return {
    isPublishingPending,
    publishPendingListing
  };
};
