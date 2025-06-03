
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { FlatListingForm } from "@/components/FlatListingForm";
import { FlatPreview } from "@/components/FlatPreview";
import { Home, Users, Shield, LogOut, Menu, X } from "lucide-react";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-purple-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-xl shadow-lg">
                  <Home className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  FlatMates
                </h1>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <span className="text-sm text-gray-600 hidden sm:block">Welcome, {profile?.full_name}</span>
                <Button variant="outline" onClick={signOut} size="sm">
                  <LogOut className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 text-center">
          <div className="bg-white/60 backdrop-blur-md rounded-3xl shadow-xl p-6 sm:p-8 lg:p-12 border border-purple-200">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Welcome to FlatMates!
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
              You're registered as a flat seeker. Browse available flats and connect with verified owners.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 text-lg"
                size="lg"
              >
                <a href="/browse">Browse Flats</a>
              </Button>
              <Button variant="outline" asChild size="lg" className="border-purple-300 text-purple-700 hover:bg-purple-50">
                <a href="/profile">Update Profile</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-xl shadow-lg">
                <Home className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                FlatMates
              </h1>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              <nav className="flex space-x-6">
                <a href="/browse" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">Find Flats</a>
                <a href="/" className="text-purple-600 font-semibold">List Your Flat</a>
                <a href="/about" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">About</a>
                <a href="/profile" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">Profile</a>
              </nav>
              <span className="text-sm text-gray-600">Welcome, {profile?.full_name}</span>
              <Button variant="outline" onClick={signOut} className="border-purple-300 text-purple-700 hover:bg-purple-50">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center space-x-2">
              <span className="text-sm text-gray-600 hidden sm:block">Welcome, {profile?.full_name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-purple-100 pt-4">
              <nav className="flex flex-col space-y-3">
                <a href="/browse" className="text-gray-600 hover:text-purple-600 transition-colors font-medium py-2">Find Flats</a>
                <a href="/" className="text-purple-600 font-semibold py-2">List Your Flat</a>
                <a href="/about" className="text-gray-600 hover:text-purple-600 transition-colors font-medium py-2">About</a>
                <a href="/profile" className="text-gray-600 hover:text-purple-600 transition-colors font-medium py-2">Profile</a>
                <Button variant="outline" onClick={signOut} className="w-full mt-2 border-purple-300 text-purple-700 hover:bg-purple-50">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6">
            List Your Flat & Find Perfect Flatmates
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl mb-6 sm:mb-8 text-purple-100 max-w-3xl mx-auto">
            Connect with verified seekers through our trust-based platform
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 mb-6 sm:mb-8">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span className="text-sm sm:text-base">Verified Profiles</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span className="text-sm sm:text-base">Quality Matches</span>
            </div>
            <div className="flex items-center space-x-2">
              <Home className="h-5 w-5" />
              <span className="text-sm sm:text-base">Secure Platform</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Step Indicator */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="flex items-center space-x-2 sm:space-x-4 bg-white/60 backdrop-blur-md rounded-full p-2 sm:p-4 shadow-lg border border-purple-200">
            <div className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-full transition-colors ${
              currentStep === 'form' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'
            }`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold ${
                currentStep === 'form' ? 'bg-purple-600 text-white' : 'bg-gray-400 text-white'
              }`}>1</span>
              <span className="hidden sm:inline">Flat Details</span>
              <span className="sm:hidden">Details</span>
            </div>
            <div className="w-4 sm:w-8 h-0.5 bg-gray-300"></div>
            <div className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-full transition-colors ${
              currentStep === 'preview' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'
            }`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold ${
                currentStep === 'preview' ? 'bg-purple-600 text-white' : 'bg-gray-400 text-white'
              }`}>2</span>
              <span className="hidden sm:inline">Preview & Submit</span>
              <span className="sm:hidden">Preview</span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          {/* Form Section */}
          <div className="order-2 xl:order-1">
            {currentStep === 'form' ? (
              <FlatListingForm
                data={flatData}
                onChange={handleDataChange}
                onNext={() => setCurrentStep('preview')}
              />
            ) : (
              <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-xl p-4 sm:p-6 border border-purple-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Final Review</h2>
                  <button
                    onClick={() => setCurrentStep('form')}
                    className="text-purple-600 hover:text-purple-700 font-medium text-sm sm:text-base"
                  >
                    Edit Details
                  </button>
                </div>
                <p className="text-gray-600 mb-6 text-sm sm:text-base">
                  Review your listing details and submit when ready. You can always edit later.
                </p>
                <div className="space-y-4">
                  <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105">
                    Publish Listing
                  </button>
                  <button className="w-full border border-purple-300 text-purple-700 py-3 px-6 rounded-xl font-semibold hover:bg-purple-50 transition-colors">
                    Save as Draft
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Preview Section */}
          <div className="order-1 xl:order-2">
            <FlatPreview data={flatData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
