import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Layout } from "@/components/Layout";
import { CreateListingHeader } from "@/components/CreateListing/CreateListingHeader";
import { MainListingLayout } from "@/components/CreateListing/MainListingLayout";
import { BackToProfileButton } from "@/components/CreateListing/BackToProfileButton";
import type { FlatListing } from "@/types/flat";

const CreateListing = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<'form' | 'preview' | 'signup'>('form');
  
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
      amount: 1, // Start with 1 instead of 0 to satisfy database constraint
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

  const handleDataChange = (updates: Partial<FlatListing>) => {
    setListingData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep === 'form') {
      setCurrentStep('preview');
    } else if (currentStep === 'preview') {
      // If user is not logged in, show signup step
      if (!user) {
        setCurrentStep('signup');
      } else {
        // This case should not happen since the publish button in PreviewSection 
        // handles the actual publishing for authenticated users
        console.log('Authenticated user trying to proceed from preview - this should be handled by PreviewSection');
      }
    }
  };

  const handleBack = () => {
    if (currentStep === 'signup') {
      setCurrentStep('preview');
    } else if (currentStep === 'preview') {
      setCurrentStep('form');
    } else {
      navigate('/');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen py-8 px-4 flex flex-col overflow-auto">
        <div className="max-w-6xl mx-auto flex-1 flex flex-col">
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
