import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BrowseHeader } from "@/components/Browse/BrowseHeader";
import { LoadingGrid } from "@/components/Browse/LoadingGrid";
import { EmptyState } from "@/components/Browse/EmptyState";
import { ListingCard } from "@/components/Browse/ListingCard";
import { SearchBar } from "@/components/ui/search-bar";
import { Landmark, Factory, Warehouse } from "lucide-react";
import type { FlatListing } from "@/types/flat";

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
    <div className="min-h-screen py-8 px-4 relative overflow-x-clip overflow-y-visible">
      {/* Only the floating building icons - background is now global */}
      <Landmark size={72} className="absolute left-12 bottom-[14%] text-emerald-400 drop-shadow-xl z-10 animate-float hidden md:block" />
      <Factory size={56} className="absolute right-20 bottom-[18%] text-pink-400 drop-shadow z-10 animate-float delay-250 md:block hidden" />
      <Warehouse size={38} className="absolute left-1/2 bottom-11 text-orange-300 drop-shadow-lg z-10 animate-float" />
      <div className="max-w-7xl mx-auto relative z-10">
        <BrowseHeader />
        {/* Search bar and city select in the same row */}
        <div className="mb-6 flex flex-col md:flex-row gap-3 md:gap-5 max-w-2xl w-full mx-auto">
          <div className="flex-1">
            <SearchBar 
              placeholder="Search by title, area, or address..."
              onSearch={setSearchQuery}
            />
          </div>
          <div className="md:w-[220px] w-full">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="h-12 px-4 border-2 border-slate-200 focus:border-coral-400 rounded-xl bg-white text-slate-700 transition-all w-full shadow-sm"
            >
              <option value="">All Cities</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
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
  );
};

export default Browse;
