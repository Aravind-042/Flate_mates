
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Layout } from "@/components/Layout";
import { CreateListingHeader } from "@/components/CreateListing/CreateListingHeader";
import { MainListingLayout } from "@/components/CreateListing/MainListingLayout";
import { BackToProfileButton } from "@/components/CreateListing/BackToProfileButton";
import type { FlatListing } from "@/types/flat";

const CreateListing = () => {
  const { user, profile } = useAuth();
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
        // User is logged in, proceed with listing creation
        // This would normally submit the listing to the database
        console.log('Creating listing:', listingData);
        navigate('/profile');
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
