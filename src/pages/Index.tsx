import { useState, useMemo } from "react";
import { BackgroundPattern } from "@/components/Home/BackgroundPattern";
import { HeroSection } from "@/components/Home/HeroSection";
import { CircularTestimonialsDemo } from "@/components/ui/demo";
import { CircularFlatListingsDemo } from "@/components/ui/circular-flat-listings-demo";
import { CTASection } from "@/components/Home/CTASection";
import { useFeaturedListings } from "@/hooks/queries/useListings";
import { ListingService } from "@/services/listingService";
import { useDebounce } from "@/hooks/useDebounce";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Debounce search for better performance
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Optimized featured listings fetch
  const { data: listings, isLoading, error } = useFeaturedListings(6, {
    enabled: true // Always fetch featured listings for homepage
  });

  // Memoized transformation to avoid unnecessary re-renders
  const transformedListings = useMemo(() => {
    if (!listings) return [];
    
    return listings.map(listing => {
      const flatListing = ListingService.transformToFlatListing(listing);
      return {
        id: flatListing.id!,
        title: flatListing.title,
        description: flatListing.description,
        property_type: flatListing.property.type,
        bedrooms: flatListing.property.bedrooms,
        bathrooms: flatListing.property.bathrooms,
        monthly_rent: flatListing.rent.amount,
        security_deposit: flatListing.rent.deposit,
        is_furnished: flatListing.property.furnished,
        parking_available: flatListing.property.parking,
        amenities: flatListing.amenities,
        address_line1: flatListing.location.address,
        address_line2: "",
        images: flatListing.images,
        owner_id: flatListing.ownerId!,
        created_at: flatListing.createdAt!,
        locations: {
          city: flatListing.location.city,
          area: flatListing.location.area,
        },
      };
    });
  }, [listings]);

  // Memoized filtered listings based on search
  const filteredListings = useMemo(() => {
    if (!debouncedSearchQuery || !transformedListings) return transformedListings;
    
    return transformedListings.filter(listing => 
      listing.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      listing.locations?.area?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      listing.address_line1.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );
  }, [transformedListings, debouncedSearchQuery]);

  // Error handling
  if (error) {
    console.error("Failed to load featured listings:", error);
  }

  return (
    <div className="relative overflow-hidden">
      <BackgroundPattern />
      <HeroSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      {/* Circular Flat Listings - Only show when data is available */}
      {!isLoading && transformedListings && transformedListings.length > 0 && (
        <CircularFlatListingsDemo 
          listings={filteredListings.length > 0 ? filteredListings : transformedListings} 
        />
      )}
      
      <CircularTestimonialsDemo />
      
      {/* Call to Action Section */}
      <CTASection />
    </div>
  );
};

export default Index;