import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { BrowseHeader } from "@/components/Browse/BrowseHeader";
import { LoadingGrid } from "@/components/Browse/LoadingGrid";
import { EmptyState } from "@/components/Browse/EmptyState";
import { ListingCard } from "@/components/Browse/ListingCard";
import { SearchBar } from "@/components/ui/search-bar";
import { Landmark, Factory, Warehouse } from "lucide-react";
import { useListings, useCities, usePrefetchListing } from "@/hooks/queries/useListings";
import { ListingService } from "@/services/listingService";
import { useUIStore } from "@/store/uiStore";
import { useDebounce } from "@/hooks/useDebounce";

const Browse = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  
  const { searchFilters, setSearchFilters } = useUIStore();
  
  // Debounce search query for better performance
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  // Optimized data fetching
  const { data: listingsDb, isLoading, error } = useListings();
  const { data: cities = [] } = useCities();
  const prefetchListing = usePrefetchListing();

  // Memoized filtered listings for better performance
  const filteredListings = useMemo(() => {
    if (!listingsDb) return [];

    return listingsDb.filter((listing) => {
      const flatListing = ListingService.transformToFlatListing(listing);
      
      const matchesSearch = !debouncedSearchQuery || 
        flatListing.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        flatListing.location.area.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        flatListing.location.address.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
      
      const matchesCity = !selectedCity ||
        flatListing.location.city.toLowerCase() === selectedCity.toLowerCase();
      
      return matchesSearch && matchesCity;
    });
  }, [listingsDb, debouncedSearchQuery, selectedCity]);

  // Memoized transformed listings
  const transformedListings = useMemo(() => {
    return filteredListings.map((listing) => {
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
        preferred_gender: flatListing.preferences.gender,
        locations: {
          city: flatListing.location.city,
          area: flatListing.location.area,
        },
      };
    });
  }, [filteredListings]);

  // Optimized handlers
  const handleFlatClick = useCallback((listingId: string) => {
    navigate(`/flat/${listingId}`);
  }, [navigate]);

  const handleCityChange = useCallback((city: string) => {
    setSelectedCity(city);
    setSearchFilters({ city });
  }, [setSearchFilters]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Prefetch listing on hover for better UX
  const handleListingHover = useCallback((listingId: string) => {
    prefetchListing(listingId);
  }, [prefetchListing]);

  if (error) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-red-800 mb-2">
              Failed to Load Listings
            </h2>
            <p className="text-red-600">
              We encountered an error while fetching the listings. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 relative overflow-x-clip overflow-y-visible">
      {/* Floating background elements */}
      <Landmark size={72} className="absolute left-12 bottom-[14%] text-emerald-400 drop-shadow-xl z-10 animate-float hidden md:block" />
      <Factory size={56} className="absolute right-20 bottom-[18%] text-pink-400 drop-shadow z-10 animate-float delay-250 md:block hidden" />
      <Warehouse size={38} className="absolute left-1/2 bottom-11 text-orange-300 drop-shadow-lg z-10 animate-float" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <BrowseHeader />
        
        {/* Search and filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-3 md:gap-5 max-w-2xl w-full mx-auto">
          <div className="flex-1">
            <SearchBar
              placeholder="Search by title, area, or address..."
              onSearch={handleSearch}
            />
          </div>
          <div className="md:w-[220px] w-full">
            <select
              value={selectedCity}
              onChange={(e) => handleCityChange(e.target.value)}
              className="h-12 px-4 border-2 border-slate-200 focus:border-coral-400 rounded-xl bg-white text-slate-700 transition-all w-full shadow-sm"
            >
              <option value="">All Cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <LoadingGrid />
        ) : transformedListings.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {transformedListings.map((listing) => (
              <div
                key={listing.id}
                onMouseEnter={() => handleListingHover(listing.id)}
              >
                <ListingCard
                  listing={listing}
                  onCardClick={handleFlatClick}
                />
              </div>
            ))}
          </div>
        )}

        {/* Results summary */}
        {!isLoading && transformedListings.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-slate-600">
              Showing {transformedListings.length} of {listingsDb?.length || 0} listings
              {selectedCity && ` in ${selectedCity}`}
              {debouncedSearchQuery && ` matching "${debouncedSearchQuery}"`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;