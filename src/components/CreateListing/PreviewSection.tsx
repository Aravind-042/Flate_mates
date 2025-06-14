
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
  userId: string;
}

export const PreviewSection = ({ listingData, onBack, userId }: PreviewSectionProps) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Map the frontend data structure to the database structure
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
        security_deposit: listingData.rent.deposit,
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

      const { data, error } = await supabase
        .from('flat_listings')
        .insert(dbListingData)
        .select()
        .single();

      if (error) {
        console.error('Error creating listing:', error);
        throw error;
      }

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
              className="flex-1 bg-gradient-to-r from-deep-blue to-orange hover:from-darker-blue hover:to-orange-darker text-white rounded-xl"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Publishing...</span>
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
