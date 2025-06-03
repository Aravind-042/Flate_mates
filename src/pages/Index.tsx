import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { FlatListingForm } from "@/components/FlatListingForm";
import { FlatPreview } from "@/components/FlatPreview";
import { Home, Users, Shield, LogOut, Menu, X, Sparkles, Heart, Star } from "lucide-react";
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
      <div className="min-h-screen bg-gradient-to-br from-coral-50 via-pink-50 to-violet-100 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-coral-400 to-pink-400 rounded-full blur-3xl opacity-40 animate-bounce"></div>
          <div className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-br from-violet-400 to-purple-400 rounded-full blur-3xl opacity-40 animate-pulse"></div>
          <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-gradient-to-br from-mint-400 to-blue-400 rounded-full blur-3xl opacity-40 float"></div>
        </div>

        {/* Header */}
        <header className="relative z-10 bg-white/80 backdrop-blur-2xl shadow-xl border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-coral-400 to-violet-500 blur-lg opacity-40 rounded-2xl"></div>
                  <div className="relative bg-gradient-to-r from-coral-400 to-violet-500 p-3 rounded-2xl shadow-xl">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold hero-text-gradient">
                  FlatMates
                </h1>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <span className="text-sm text-slate-600 hidden sm:block font-medium">
                  Hey, {profile?.full_name}! 👋
                </span>
                <Button 
                  variant="outline" 
                  onClick={signOut} 
                  size="sm"
                  className="border-2 border-coral-200 text-coral-600 hover:bg-coral-50 rounded-2xl font-semibold"
                >
                  <LogOut className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-center">
          <div className="glass-card p-8 sm:p-12 lg:p-16">
            <div className="space-y-8">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-coral-400 to-violet-500 blur-2xl opacity-30 rounded-full animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-coral-400 to-violet-500 p-6 rounded-3xl shadow-2xl">
                    <Heart className="h-16 w-16 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <h1 className="text-responsive-xl font-bold text-slate-900">
                  Welcome to Your <span className="hero-text-gradient">Flatmate Journey!</span>
                </h1>
                <p className="text-responsive-lg text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed">
                  You're registered as a flat seeker. Browse amazing flats and connect with verified owners in your dream neighborhood.
                </p>
              </div>

              <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 mb-8">
                <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                  <Shield className="h-6 w-6 text-coral-500" />
                  <span className="text-slate-700 font-semibold">Verified Profiles</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                  <Users className="h-6 w-6 text-violet-500" />
                  <span className="text-slate-700 font-semibold">Quality Matches</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                  <Star className="h-6 w-6 text-mint-500" />
                  <span className="text-slate-700 font-semibold">Trusted Platform</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <Button 
                  asChild
                  className="btn-gradient px-8 py-4 text-lg h-auto"
                  size="lg"
                >
                  <a href="/browse">
                    <Sparkles className="h-5 w-5 mr-2" />
                    Browse Flats
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  asChild 
                  size="lg" 
                  className="border-2 border-coral-200 text-coral-600 hover:bg-coral-50 rounded-2xl font-semibold px-8 py-4 text-lg h-auto"
                >
                  <a href="/profile">Update Profile</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-coral-50 via-pink-50 to-violet-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-coral-400 to-pink-400 rounded-full blur-3xl opacity-40 animate-bounce"></div>
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-br from-violet-400 to-purple-400 rounded-full blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-gradient-to-br from-mint-400 to-blue-400 rounded-full blur-3xl opacity-40 float"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-2xl shadow-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-coral-400 to-violet-500 blur-lg opacity-40 rounded-2xl"></div>
                <div className="relative bg-gradient-to-r from-coral-400 to-violet-500 p-3 rounded-2xl shadow-xl">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold hero-text-gradient">
                FlatMates
              </h1>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <nav className="flex space-x-8">
                <a href="/browse" className="text-slate-600 hover:text-coral-500 transition-colors font-semibold text-lg">Find Flats</a>
                <a href="/" className="text-coral-500 font-bold text-lg">List Your Flat</a>
                <a href="/about" className="text-slate-600 hover:text-coral-500 transition-colors font-semibold text-lg">About</a>
                <a href="/profile" className="text-slate-600 hover:text-coral-500 transition-colors font-semibold text-lg">Profile</a>
              </nav>
              <span className="text-sm text-slate-600 font-medium">Hey, {profile?.full_name}! 👋</span>
              <Button 
                variant="outline" 
                onClick={signOut} 
                className="border-2 border-coral-200 text-coral-600 hover:bg-coral-50 rounded-2xl font-semibold"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center space-x-2">
              <span className="text-sm text-slate-600 hidden sm:block font-medium">Hey, {profile?.full_name}!</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-6 pb-6 border-t border-slate-200 pt-6">
              <nav className="flex flex-col space-y-4">
                <a href="/browse" className="text-slate-600 hover:text-coral-500 transition-colors font-semibold text-lg py-2">Find Flats</a>
                <a href="/" className="text-coral-500 font-bold text-lg py-2">List Your Flat</a>
                <a href="/about" className="text-slate-600 hover:text-coral-500 transition-colors font-semibold text-lg py-2">About</a>
                <a href="/profile" className="text-slate-600 hover:text-coral-500 transition-colors font-semibold text-lg py-2">Profile</a>
                <Button 
                  variant="outline" 
                  onClick={signOut} 
                  className="w-full mt-4 border-2 border-coral-200 text-coral-600 hover:bg-coral-50 rounded-2xl font-semibold"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative z-10 bg-gradient-to-r from-coral-400 to-violet-500 text-white py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <h1 className="text-responsive-xl font-bold leading-tight">
              List Your Flat & Find Perfect Flatmates
            </h1>
            <p className="text-responsive-lg mb-8 text-coral-100 max-w-4xl mx-auto font-medium leading-relaxed">
              Connect with verified seekers through our trust-based platform designed for modern living
            </p>
            <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 mb-8">
              <div className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <Shield className="h-6 w-6" />
                <span className="font-semibold">Verified Profiles</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <Users className="h-6 w-6" />
                <span className="font-semibold">Quality Matches</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <Home className="h-6 w-6" />
                <span className="font-semibold">Secure Platform</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Step Indicator */}
        <div className="flex justify-center mb-8 sm:mb-12">
          <div className="flex items-center space-x-4 glass-card p-4 sm:p-6">
            <div className={`flex items-center space-x-3 px-4 sm:px-6 py-3 rounded-2xl transition-all ${
              currentStep === 'form' 
                ? 'bg-gradient-to-r from-coral-400 to-violet-500 text-white shadow-lg' 
                : 'bg-slate-100 text-slate-500'
            }`}>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                currentStep === 'form' ? 'bg-white/20 text-white' : 'bg-slate-400 text-white'
              }`}>1</span>
              <span className="hidden sm:inline font-semibold">Flat Details</span>
              <span className="sm:hidden font-semibold">Details</span>
            </div>
            <div className="w-6 sm:w-12 h-1 bg-slate-300 rounded-full"></div>
            <div className={`flex items-center space-x-3 px-4 sm:px-6 py-3 rounded-2xl transition-all ${
              currentStep === 'preview' 
                ? 'bg-gradient-to-r from-coral-400 to-violet-500 text-white shadow-lg' 
                : 'bg-slate-100 text-slate-500'
            }`}>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                currentStep === 'preview' ? 'bg-white/20 text-white' : 'bg-slate-400 text-white'
              }`}>2</span>
              <span className="hidden sm:inline font-semibold">Preview & Submit</span>
              <span className="sm:hidden font-semibold">Preview</span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12">
          {/* Form Section */}
          <div className="order-2 xl:order-1">
            {currentStep === 'form' ? (
              <FlatListingForm
                data={flatData}
                onChange={handleDataChange}
                onNext={() => setCurrentStep('preview')}
              />
            ) : (
              <div className="glass-card p-6 sm:p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Final Review</h2>
                  <button
                    onClick={() => setCurrentStep('form')}
                    className="text-coral-500 hover:text-coral-600 font-semibold text-base sm:text-lg transition-colors"
                  >
                    Edit Details
                  </button>
                </div>
                <p className="text-slate-600 mb-8 text-base sm:text-lg font-medium">
                  Review your listing details and submit when ready. You can always edit later.
                </p>
                <div className="space-y-4">
                  <button className="w-full btn-gradient py-4 px-8 text-lg">
                    <Sparkles className="h-5 w-5 mr-2" />
                    Publish Listing
                  </button>
                  <button className="w-full border-2 border-coral-200 text-coral-600 py-4 px-8 rounded-2xl font-semibold hover:bg-coral-50 transition-colors text-lg">
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
