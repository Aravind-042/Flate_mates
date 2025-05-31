
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { FlatListingForm } from "@/components/FlatListingForm";
import { FlatPreview } from "@/components/FlatPreview";
import { Home, Users, Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface FlatListing {
  title: string;
  description: string;
  location: {
    city: string;
    area: string;
    address: string;
  };
  rent: {
    amount: number;
    deposit: number;
    includes: string[];
  };
  property: {
    type: string;
    bedrooms: number;
    bathrooms: number;
    furnished: boolean;
    parking: boolean;
  };
  amenities: string[];
  preferences: {
    gender: string;
    profession: string[];
    lifestyle: string[];
    additionalRequirements: string;
  };
  images: string[];
  contactPreferences: {
    whatsapp: boolean;
    call: boolean;
    email: boolean;
  };
}

const Index = () => {
  const { profile, signOut } = useAuth();
  const [currentStep, setCurrentStep] = useState<'form' | 'preview'>('form');
  const [flatData, setFlatData] = useState<FlatListing>({
    title: "",
    description: "",
    location: {
      city: "",
      area: "",
      address: ""
    },
    rent: {
      amount: 0,
      deposit: 0,
      includes: []
    },
    property: {
      type: "",
      bedrooms: 1,
      bathrooms: 1,
      furnished: false,
      parking: false
    },
    amenities: [],
    preferences: {
      gender: "",
      profession: [],
      lifestyle: [],
      additionalRequirements: ""
    },
    images: [],
    contactPreferences: {
      whatsapp: false,
      call: false,
      email: false
    }
  });

  const handleDataChange = (newData: Partial<FlatListing>) => {
    setFlatData(prev => ({ ...prev, ...newData }));
  };

  // Show different content based on user role
  const isOwner = profile?.role === 'flat_owner';

  if (!isOwner) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-600 to-orange-500 p-2 rounded-lg">
                  <Home className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                  FlatMates
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Welcome, {profile?.full_name}</span>
                <Button variant="outline" onClick={signOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to FlatMates!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            You're registered as a flat seeker. Browse available flats and connect with verified owners.
          </p>
          <div className="space-x-4">
            <Button 
              asChild
              className="bg-gradient-to-r from-blue-600 to-orange-500"
            >
              <a href="/browse">Browse Flats</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/profile">Update Profile</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-orange-500 p-2 rounded-lg">
                <Home className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                FlatMates
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex space-x-6">
                <a href="/browse" className="text-gray-600 hover:text-blue-600 transition-colors">Find Flats</a>
                <a href="/" className="text-blue-600 font-medium">List Your Flat</a>
                <a href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">About</a>
                <a href="/profile" className="text-gray-600 hover:text-blue-600 transition-colors">Profile</a>
              </nav>
              <span className="text-sm text-gray-600">Welcome, {profile?.full_name}</span>
              <Button variant="outline" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-orange-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            List Your Flat & Find Perfect Flatmates
          </h1>
          <p className="text-xl mb-8 text-blue-100">
            Connect with verified seekers through our trust-based platform
          </p>
          <div className="flex justify-center space-x-8 mb-8">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Verified Profiles</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Quality Matches</span>
            </div>
            <div className="flex items-center space-x-2">
              <Home className="h-5 w-5" />
              <span>Secure Platform</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
              currentStep === 'form' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
            }`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold ${
                currentStep === 'form' ? 'bg-blue-600 text-white' : 'bg-gray-400 text-white'
              }`}>1</span>
              <span>Flat Details</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
              currentStep === 'preview' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
            }`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold ${
                currentStep === 'preview' ? 'bg-blue-600 text-white' : 'bg-gray-400 text-white'
              }`}>2</span>
              <span>Preview & Submit</span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="order-2 lg:order-1">
            {currentStep === 'form' ? (
              <FlatListingForm
                data={flatData}
                onChange={handleDataChange}
                onNext={() => setCurrentStep('preview')}
              />
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Final Review</h2>
                  <button
                    onClick={() => setCurrentStep('form')}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Edit Details
                  </button>
                </div>
                <p className="text-gray-600 mb-6">
                  Review your listing details and submit when ready. You can always edit later.
                </p>
                <div className="space-y-4">
                  <button className="w-full bg-gradient-to-r from-blue-600 to-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105">
                    Publish Listing
                  </button>
                  <button className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                    Save as Draft
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Preview Section */}
          <div className="order-1 lg:order-2">
            <FlatPreview data={flatData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
