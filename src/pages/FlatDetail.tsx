import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { PropertyImageGallery } from "@/components/FlatDetail/PropertyImageGallery";
import { PropertyHeader } from "@/components/FlatDetail/PropertyHeader";
import { PropertyPricing } from "@/components/FlatDetail/PropertyPricing";
import { PropertyDescription } from "@/components/FlatDetail/PropertyDescription";
import { PropertyHighlights } from "@/components/FlatDetail/PropertyHighlights";
import { PropertyAmenities } from "@/components/FlatDetail/PropertyAmenities";
import { PropertyTrustIndicators } from "@/components/FlatDetail/PropertyTrustIndicators";
import { useListing, usePrefetchOwnerListings } from "@/hooks/queries/useListings";
import { ListingService } from "@/services/listingService";
import { useEffect } from "react";

const FlatDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Optimized data fetching with prefetching
  const { data: listing, isLoading, error } = useListing(id!, {
    enabled: !!id
  });
  
  const prefetchOwnerListings = usePrefetchOwnerListings();

  // Prefetch owner's other listings for better UX
  useEffect(() => {
    if (listing?.owner_id) {
      prefetchOwnerListings(listing.owner_id);
    }
  }, [listing?.owner_id, prefetchOwnerListings]);

  if (error) {
    return (
      <div className="min-h-screen py-4 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 border border-slate-200">
            <div className="text-red-100 mb-4">
              <Home className="h-16 w-16 sm:h-20 sm:w-20 mx-auto" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3">
              Listing Not Found
            </h1>
            <p className="text-slate-600 text-sm sm:text-base mb-4">
              The property you're looking for doesn't exist or has been removed.
            </p>
            <Button
              onClick={() => navigate("/browse")}
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
      <div className="min-h-screen py-4 px-4">
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

  if (!listing) {
    return (
      <div className="min-h-screen py-4 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 border border-slate-200">
            <Home className="h-16 w-16 mx-auto mb-4 text-slate-400" />
            <h1 className="text-xl font-bold text-slate-800 mb-3">
              Listing Not Found
            </h1>
            <p className="text-slate-600 mb-4">
              This listing may have been removed or is no longer available.
            </p>
            <Button
              onClick={() => navigate("/browse")}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white"
            >
              Browse Other Properties
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const flatListing = ListingService.transformToFlatListing(listing);

  return (
    <div className="min-h-screen py-4 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/browse")}
          className="mb-4 bg-white/90 backdrop-blur-sm border border-slate-200 hover:bg-white hover:shadow-lg transition-all duration-200 rounded-xl px-4 py-2 text-sm"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span className="font-medium">Back to Browse</span>
        </Button>

        {/* Main Content */}
        <div className="space-y-4">
          <PropertyImageGallery 
            images={flatListing.images} 
            title={flatListing.title} 
          />

          <PropertyHeader
            listing={{
              title: flatListing.title,
              property_type: flatListing.property.type,
              bedrooms: flatListing.property.bedrooms,
              bathrooms: flatListing.property.bathrooms,
              parking_available: flatListing.property.parking,
              is_furnished: flatListing.property.furnished,
              address_line1: flatListing.location.address,
              created_at: flatListing.createdAt!,
              locations: {
                city: flatListing.location.city,
                area: flatListing.location.area,
              },
            }}
          />

          <PropertyPricing
            monthlyRent={flatListing.rent.amount}
            securityDeposit={flatListing.rent.deposit}
          />

          <PropertyDescription description={flatListing.description} />

          <PropertyHighlights
            propertyType={flatListing.property.type}
            isFurnished={flatListing.property.furnished}
            parkingAvailable={flatListing.property.parking}
          />

          <PropertyAmenities amenities={flatListing.amenities} />

          <PropertyTrustIndicators />
        </div>
      </div>
    </div>
  );
};

export default FlatDetail;