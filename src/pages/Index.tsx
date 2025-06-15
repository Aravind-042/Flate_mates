
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { BackgroundPattern } from "@/components/Home/BackgroundPattern";
import { HeroSection } from "@/components/Home/HeroSection";
import { CircularTestimonialsDemo } from "@/components/ui/demo";
import { CircularFlatListingsDemo } from "@/components/ui/circular-flat-listings-demo";
import { CTASection } from "@/components/Home/CTASection";
import { toast } from "sonner";

interface FlatListing {
  id: string;
  title: string;
  description: string | null;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  monthly_rent: number;
  security_deposit: number | null;
  is_furnished: boolean | null;
  parking_available: boolean | null;
  amenities: string[] | null;
  address_line1: string;
  address_line2: string | null;
  images: string[] | null;
  owner_id: string;
  created_at: string;
  locations?: {
    city: string;
    area: string;
  };
}

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: listings, isLoading, error } = useQuery({
    queryKey: ['featured-listings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flat_listings')
        .select(`
          *,
          locations (
            city,
            area
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(6);
      
      if (error) {
        console.error('Error fetching listings:', error);
        throw error;
      }
      
      return data as FlatListing[];
    }
  });

  const filteredListings = listings?.filter(listing => 
    listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.locations?.area?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.address_line1.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (error) {
    toast.error("Failed to load listings");
  }

  return (
    <Layout>
      <div className="relative overflow-hidden">
        <BackgroundPattern />
        <HeroSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        
        {/* Circular Flat Listings */}
        {!isLoading && listings && listings.length > 0 && (
          <CircularFlatListingsDemo listings={filteredListings.length > 0 ? filteredListings : listings} />
        )}
        
        <CircularTestimonialsDemo />
        
        {/* Call to Action Section */}
        <CTASection />
      </div>
    </Layout>
  );
};

export default Index;
