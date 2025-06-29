import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BrowseHeader } from "@/components/Browse/BrowseHeader";
import { LoadingGrid } from "@/components/Browse/LoadingGrid";
import { EmptyState } from "@/components/Browse/EmptyState";
import { ListingCard } from "@/components/Browse/ListingCard";
import { SearchBar } from "@/components/ui/search-bar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Landmark, Factory, Warehouse, Filter, Grid3X3, List, SlidersHorizontal } from "lucide-react";
import { useListings } from "@/hooks/queries/useListings";
import { ListingService } from "@/services/listingService";
import { useUIStore } from "@/store/uiStore";

const Browse = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  
  const { searchFilters, setSearchFilters } = useUIStore();
  const { data: listingsDb, isLoading, error } = useListings();

  const filteredListings = listingsDb?.filter((listing) => {
    const flatListing = ListingService.transformToFlatListing(listing);
    const matchesSearch =
      flatListing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flatListing.location.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flatListing.location.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity =
      !selectedCity ||
      flatListing.location.city.toLowerCase() === selectedCity.toLowerCase();
    return matchesSearch && matchesCity;
  }) ?? [];

  const cities = Array.from(
    new Set(
      listingsDb
        ?.map((listing) => listing.locations?.city)
        .filter(Boolean) || []
    )
  );

  const handleFlatClick = (listingId: string) => {
    navigate(`/flat/${listingId}`);
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setSearchFilters({ city });
  };

  if (error) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="card-primary p-12">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-red-800 mb-4">
              Failed to Load Listings
            </h2>
            <p className="text-red-600 mb-6">
              We encountered an error while fetching the listings. Please try again later.
            </p>
            <Button 
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Try Again
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Landmark size={120} className="absolute left-20 top-1/4 text-emerald-200 opacity-60 animate-float hidden xl:block" />
        <Factory size={80} className="absolute right-32 top-1/3 text-pink-200 opacity-50 animate-float delay-1000 hidden lg:block" />
        <Warehouse size={60} className="absolute left-1/2 bottom-1/4 text-orange-200 opacity-40 animate-float delay-2000 hidden md:block" />
      </div>
      
      <div className="relative z-10">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-20">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <BrowseHeader />
            
            {/* Search and Filter Bar */}
            <div className="mt-8 space-y-4">
              {/* Main Search */}
              <div className="max-w-3xl mx-auto">
                <SearchBar
                  placeholder="Search by title, area, or address..."
                  onSearch={setSearchQuery}
                />
              </div>
              
              {/* Filters Row */}
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-3 items-center">
                  {/* City Filter */}
                  <select
                    value={selectedCity}
                    onChange={(e) => handleCityChange(e.target.value)}
                    className="h-12 px-4 border-2 border-slate-200 focus:border-blue-500 rounded-xl bg-white text-slate-700 transition-all shadow-sm min-w-[160px]"
                  >
                    <option value="">All Cities</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>

                  {/* Sort Filter */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="h-12 px-4 border-2 border-slate-200 focus:border-blue-500 rounded-xl bg-white text-slate-700 transition-all shadow-sm min-w-[140px]"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="popular">Most Popular</option>
                  </select>

                  {/* Advanced Filters Button */}
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="h-12 px-4 border-2 border-slate-200 hover:border-blue-500 rounded-xl"
                  >
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-2 bg-white rounded-xl p-1 border-2 border-slate-200">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-lg"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-lg"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Results Count */}
              <div className="flex items-center justify-between">
                <div className="text-slate-600">
                  <span className="font-semibold text-slate-800">{filteredListings.length}</span> properties found
                  {selectedCity && (
                    <span className="ml-2">
                      in <Badge variant="outline" className="ml-1">{selectedCity}</Badge>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isLoading ? (
            <LoadingGrid />
          ) : filteredListings.length === 0 ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <EmptyState />
            </div>
          ) : (
            <div className={`
              ${viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 lg:gap-8' 
                : 'space-y-6'
              }
            `}>
              {filteredListings.map((listing) => {
                const flatListing = ListingService.transformToFlatListing(listing);
                // Transform to match ListingCard's expected props
                const cardListing = {
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
                
                return (
                  <ListingCard
                    key={cardListing.id}
                    listing={cardListing}
                    onCardClick={handleFlatClick}
                  />
                );
              })}
            </div>
          )}

          {/* Load More Button */}
          {filteredListings.length > 0 && (
            <div className="text-center mt-12">
              <Button 
                variant="outline" 
                size="lg"
                className="px-8 py-3 rounded-xl border-2 border-slate-300 hover:border-blue-500 hover:bg-blue-50"
              >
                Load More Properties
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Browse;