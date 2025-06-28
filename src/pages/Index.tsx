import { useState } from "react";
import { BackgroundPattern } from "@/components/Home/BackgroundPattern";
import { HeroSection } from "@/components/Home/HeroSection";
import { CircularTestimonialsDemo } from "@/components/ui/demo";
import { CircularFlatListingsDemo } from "@/components/ui/circular-flat-listings-demo";
import { CTASection } from "@/components/Home/CTASection";
import { useFeaturedListings } from "@/hooks/queries/useListings";
import { ListingService } from "@/services/listingService";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: listings, isLoading, error } = useFeaturedListings(6);

  // Transform listings for the circular component
  const transformedListings = listings?.map(listing => {
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

  const filteredListings = transformedListings?.filter(listing => 
    listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.locations?.area?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.address_line1.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (error) {
    console.error("Failed to load featured listings:", error);
  }

  return (
    <div className="relative overflow-hidden">
      <BackgroundPattern />
      <HeroSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      {/* Circular Flat Listings */}
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