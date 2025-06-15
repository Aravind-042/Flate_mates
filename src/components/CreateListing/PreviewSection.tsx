
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FlatPreview } from "@/components/FlatPreview";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { FlatListing } from "@/types/flat";
import { ArrowLeft, Save } from "lucide-react";

interface PreviewSectionProps {
  listingData: FlatListing;
  onBack: () => void;
  onNext: () => void;
  userId: string;
}

export const PreviewSection = ({ listingData, onBack, onNext, userId }: PreviewSectionProps) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateListingData = (data: FlatListing): string | null => {
    if (!data.title?.trim()) return "Title is required";
    if (!data.description?.trim()) return "Description is required";
    if (!data.location?.city?.trim()) return "City is required";
    if (!data.location?.area?.trim()) return "Area is required";
    if (!data.rent?.amount || data.rent.amount <= 0) return "Monthly rent must be greater than 0";
    return null;
  };

  const publishListing = async (data: FlatListing, ownerId: string) => {
    // Validate data before submission
    const validationError = validateListingData(data);
    if (validationError) {
      throw new Error(validationError);
    }

    // Map the frontend data structure to the database structure
    const dbListingData = {
      owner_id: ownerId,
      title: data.title,
      description: data.description,
      property_type: data.property.type as 'apartment' | 'independent_house' | 'villa' | 'pg' | 'shared_room' | 'studio',
      bedrooms: data.property.bedrooms,
      bathrooms: data.property.bathrooms,
      is_furnished: data.property.furnished,
      parking_available: data.property.parking,
      monthly_rent: data.rent.amount,
      security_deposit: data.rent.deposit || 0,
      rent_includes: data.rent.includes,
      amenities: data.amenities,
      preferred_gender: data.preferences.gender as 'male' | 'female' | 'any',
      preferred_professions: data.preferences.profession,
      lifestyle_preferences: data.preferences.additionalRequirements ? [data.preferences.additionalRequirements] : [],
      contact_phone: data.contactPreferences.call,
      contact_whatsapp: data.contactPreferences.whatsapp,
      contact_email: data.contactPreferences.email,
      images: data.images,
      address_line1: data.location.address || `${data.location.area}, ${data.location.city}`,
      status: 'active' as 'active' | 'inactive' | 'rented' | 'expired'
    };

    console.log('Submitting listing data:', dbListingData);

    const { data: result, error } = await supabase
      .from('flat_listings')
      .insert(dbListingData)
      .select()
      .single();

    if (error) {
      console.error('Error creating listing:', error);
      throw error;
    }

    console.log('Listing created successfully:', result);
    return result;
  };

  const handleSubmit = async () => {
    if (isSubmitting) {
      console.log('Already submitting, ignoring duplicate click');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Validate data before proceeding
      const validationError = validateListingData(listingData);
      if (validationError) {
        toast.error(validationError);
        return;
      }

      if (!userId) {
        // For non-authenticated users, validate before saving to localStorage
        console.log('Saving validated listing data for non-authenticated user');
        localStorage.setItem('pendingListingData', JSON.stringify(listingData));
        toast.success("Listing details saved! Please sign up to publish.");
        onNext(); // Move to signup step
        return;
      }

      // For authenticated users, publish directly
      await publishListing(listingData, userId);
      toast.success("Listing created successfully!");
      navigate('/profile');
    } catch (error: any) {
      console.error('Error submitting listing:', error);
      toast.error("Failed to create listing: " + (error.message || "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-charcoal">
          Listing Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <FlatPreview data={listingData} />
          
          <div className="flex space-x-4">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex-1 border-2 border-light-slate rounded-xl text-charcoal hover:text-deep-blue"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Edit
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-deep-blue to-orange hover:from-darker-blue hover:to-orange-darker text-white rounded-xl disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </div>
              ) : !userId ? (
                <div className="flex items-center space-x-2">
                  <Save className="h-4 w-4" />
                  <span>Save & Sign Up</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Save className="h-4 w-4" />
                  <span>Publish Listing</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
