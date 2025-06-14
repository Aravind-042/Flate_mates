import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Layout } from "@/components/Layout";
import { FlatListingForm } from "@/components/FlatListingForm";
import { FlatPreview } from "@/components/FlatPreview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { FlatListing } from "@/types/flat";
import { ArrowLeft, Save } from "lucide-react";

const CreateListing = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<'form' | 'preview'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [listingData, setListingData] = useState<FlatListing>({
    id: '',
    title: '',
    description: '',
    location: {
      city: '',
      area: '',
      address: ''
    },
    property: {
      type: 'apartment',
      bedrooms: 1,
      bathrooms: 1,
      furnished: false,
      parking: false
    },
    rent: {
      amount: 0,
      deposit: 0,
      includes: []
    },
    amenities: [],
    preferences: {
      gender: 'any',
      profession: [],
      additionalRequirements: ''
    },
    contactPreferences: {
      whatsapp: false,
      call: true,
      email: true
    },
    images: [],
    ownerId: user?.id || '',
    createdAt: new Date().toISOString()
  });

  // Check if user has permission to create listings
  if (profile?.role === 'flat_seeker') {
    return (
      <Layout>
        <div className="min-h-screen py-8 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="bg-white/80 backdrop-blur-md border-0 rounded-3xl shadow-xl">
              <CardContent className="p-8">
                <h1 className="text-2xl font-bold text-slate-800 mb-4">
                  Access Restricted
                </h1>
                <p className="text-slate-600 mb-6">
                  You need to be a "Flat Owner" or have "Both" roles to create listings.
                  Please update your role in your profile settings.
                </p>
                <div className="space-y-4">
                  <Button
                    onClick={() => navigate('/profile')}
                    className="bg-gradient-to-r from-coral-400 to-violet-500 hover:from-coral-500 hover:to-violet-600 text-white rounded-xl"
                  >
                    Go to Profile Settings
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/browse')}
                    className="border-2 border-slate-200 rounded-xl"
                  >
                    Browse Listings Instead
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  const handleDataChange = (updates: Partial<FlatListing>) => {
    setListingData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    setCurrentStep('preview');
  };

  const handleBack = () => {
    if (currentStep === 'preview') {
      setCurrentStep('form');
    } else {
      navigate('/profile');
    }
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      toast.error("You must be logged in to create a listing");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Map the frontend data structure to the database structure
      const dbListingData = {
        owner_id: user.id,
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
    <Layout>
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-coral-400 via-pink-500 to-violet-500 bg-clip-text text-transparent">
              Create New Listing
            </h1>
            <p className="text-xl text-slate-600">
              {currentStep === 'form' ? 'Fill in your property details' : 'Review and publish your listing'}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form/Preview Section */}
            <div>
              {currentStep === 'form' ? (
                <FlatListingForm
                  data={listingData}
                  onChange={handleDataChange}
                  onNext={handleNext}
                />
              ) : (
                <Card className="bg-white/80 backdrop-blur-md border-0 rounded-3xl shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-slate-800">
                      Listing Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <FlatPreview data={listingData} />
                      
                      <div className="flex space-x-4">
                        <Button
                          variant="outline"
                          onClick={handleBack}
                          className="flex-1 border-2 border-slate-200 rounded-xl"
                        >
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Back to Edit
                        </Button>
                        <Button
                          onClick={handleSubmit}
                          disabled={isSubmitting}
                          className="flex-1 bg-gradient-to-r from-coral-400 to-violet-500 hover:from-coral-500 hover:to-violet-600 text-white rounded-xl"
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
              )}
            </div>

            {/* Live Preview Section */}
            <div className="lg:sticky lg:top-8 h-fit">
              <Card className="bg-white/80 backdrop-blur-md border-0 rounded-3xl shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-slate-800">
                    Live Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FlatPreview data={listingData} />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Back Button for Form Step */}
          {currentStep === 'form' && (
            <div className="mt-8 text-center">
              <Button
                variant="outline"
                onClick={handleBack}
                className="border-2 border-slate-200 rounded-xl"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Profile
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CreateListing;
