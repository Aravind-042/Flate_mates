
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Layout } from "@/components/Layout";
import { AccessRestricted } from "@/components/CreateListing/AccessRestricted";
import { CreateListingHeader } from "@/components/CreateListing/CreateListingHeader";
import { MainListingLayout } from "@/components/CreateListing/MainListingLayout";
import { BackToProfileButton } from "@/components/CreateListing/BackToProfileButton";
import type { FlatListing } from "@/types/flat";

const CreateListing = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<'form' | 'preview'>('form');
  
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
        <AccessRestricted />
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

  return (
    <Layout>
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <CreateListingHeader currentStep={currentStep} />

          <MainListingLayout
            currentStep={currentStep}
            listingData={listingData}
            onDataChange={handleDataChange}
            onNext={handleNext}
            onBack={handleBack}
            userId={user?.id || ''}
          />

          {/* Back Button for Form Step */}
          {currentStep === 'form' && (
            <BackToProfileButton onBack={handleBack} />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CreateListing;
