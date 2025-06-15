
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { toast } from "sonner";
import { PropertyImageGallery } from "@/components/FlatDetail/PropertyImageGallery";
import { PropertyHeader } from "@/components/FlatDetail/PropertyHeader";
import { PropertyPricing } from "@/components/FlatDetail/PropertyPricing";
import { PropertyDescription } from "@/components/FlatDetail/PropertyDescription";
import { PropertyHighlights } from "@/components/FlatDetail/PropertyHighlights";
import { PropertyAmenities } from "@/components/FlatDetail/PropertyAmenities";
import { PropertyTrustIndicators } from "@/components/FlatDetail/PropertyTrustIndicators";

// ... FlatListing interface the same ...

const FlatDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: listing, isLoading, error } = useQuery({
    queryKey: ['flat-listing', id],
    queryFn: async () => {
      if (!id) throw new Error('No listing ID provided');
      
      const { data, error } = await supabase
        .from('flat_listings')
        .select(`
          *,
          locations (
            city,
            area
          )
        `)
        .eq('id', id)
        .eq('status', 'active')
        .single();
      
      if (error) {
        console.error('Error fetching listing:', error);
        throw error;
      }
      
      return data as FlatListing;
    },
    enabled: !!id
  });

  if (error) {
    toast.error("Failed to load listing details");
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-4 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            <div className="text-red-100 mb-4">
              <Home className="h-16 w-16 sm:h-20 sm:w-20 mx-auto" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3">Listing Not Found</h1>
            <p className="text-slate-600 text-sm sm:text-base mb-4">The property you're looking for doesn't exist or has been removed.</p>
            <Button 
              onClick={() => navigate('/browse')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-xl font-semibold text-sm sm:text-base"
            >
              Browse Other Properties
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-4 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl mb-4 w-1/4"></div>
            <div className="space-y-4">
              <div className="h-48 sm:h-64 bg-gradient-to-r from-slate-200 to-slate-300 rounded-2xl"></div>
              <div className="h-32 bg-gradient-to-r from-slate-200 to-slate-300 rounded-2xl"></div>
              <div className="h-48 bg-gradient-to-r from-slate-200 to-slate-300 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-4 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button - Mobile Optimized */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/browse')}
          className="mb-4 bg-white/80 backdrop-blur-sm border border-slate-200 hover:bg-white hover:shadow-lg transition-all duration-200 rounded-xl px-4 py-2 text-sm"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span className="font-medium">Back to Browse</span>
        </Button>

        {/* Main Content - Mobile First Layout */}
        <div className="space-y-4">
          <PropertyImageGallery 
            images={listing.images} 
            title={listing.title} 
          />

          <PropertyHeader listing={listing} />

          <PropertyPricing 
            monthlyRent={listing.monthly_rent}
            securityDeposit={listing.security_deposit}
          />

          <PropertyDescription description={listing.description} />

          <PropertyHighlights 
            propertyType={listing.property_type}
            isFurnished={listing.is_furnished}
            parkingAvailable={listing.parking_available}
          />

          <PropertyAmenities amenities={listing.amenities} />

          <PropertyTrustIndicators />
        </div>
      </div>
    </div>
  );
};

export default FlatDetail;
