
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { toast } from "sonner";
import { BrowseHeader } from "@/components/Browse/BrowseHeader";
import { LoadingGrid } from "@/components/Browse/LoadingGrid";
import { EmptyState } from "@/components/Browse/EmptyState";
import { ListingCard } from "@/components/Browse/ListingCard";
import { SearchBar } from "@/components/ui/search-bar";

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

const Browse = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const { data: listings, isLoading, error } = useQuery({
    queryKey: ['flat-listings'],
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
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching listings:', error);
        throw error;
      }
      
      return data as FlatListing[];
    }
  });

  const filteredListings = listings?.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.locations?.area?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.address_line1.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = !selectedCity || listing.locations?.city?.toLowerCase() === selectedCity.toLowerCase();
    return matchesSearch && matchesCity;
  }) || [];

  const cities = Array.from(new Set(listings?.map(listing => listing.locations?.city).filter(Boolean) || []));

  const handleFlatClick = (listingId: string) => {
    navigate(`/flat/${listingId}`);
  };

  if (error) {
    toast.error("Failed to load listings");
  }

  return (
    <Layout>
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <BrowseHeader />
          
          {/* Replaced with motion search bar */}
          <div className="mb-6 flex flex-col gap-3 max-w-lg w-full mx-auto">
            <SearchBar 
              placeholder="Search by title, area, or address..."
              onSearch={setSearchQuery}
            />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="h-12 px-4 border-2 border-slate-200 focus:border-coral-400 rounded-xl bg-white text-slate-700 transition-all"
            >
              <option value="">All Cities</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {isLoading ? (
            <LoadingGrid />
          ) : filteredListings.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onCardClick={handleFlatClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Browse;

