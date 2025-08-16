import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BrowseHeader } from "@/components/Browse/BrowseHeader";
import { LoadingGrid } from "@/components/Browse/LoadingGrid";
import { EmptyState } from "@/components/Browse/EmptyState";
import { ListingCard } from "@/components/Browse/ListingCard";
import { SearchBar } from "@/components/ui/search-bar";
import { ListingMap } from "@/components/Map/ListingMap";
import { Landmark, Factory, Warehouse, Map } from "lucide-react";
import { useListings } from "@/hooks/queries/useListings";
import { ListingService } from "@/services/listingService";
import { useUIStore } from "@/store/uiStore";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
const Browse = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [showMap, setShowMap] = useState(false);
  const MIN_RENT = 1;
  const MAX_RENT = 100000;
  const [rentRange, setRentRange] = useState<[number, number]>([MIN_RENT, MAX_RENT]);
  const {
    searchFilters,
    setSearchFilters
  } = useUIStore();
  const {
    data: listingsDb,
    isLoading,
    error
  } = useListings();
  const filteredListings = listingsDb?.filter(listing => {
    const flatListing = ListingService.transformToFlatListing(listing);
    const matchesSearch = flatListing.title.toLowerCase().includes(searchQuery.toLowerCase()) || flatListing.location.area.toLowerCase().includes(searchQuery.toLowerCase()) || flatListing.location.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = !selectedCity || flatListing.location.city.toLowerCase() === selectedCity.toLowerCase();
    const matchesGender = selectedGenders.length === 0 || selectedGenders.map(g => g.toLowerCase()).includes(flatListing.preferences.gender.toLowerCase());
    const matchesRent = flatListing.rent.amount >= rentRange[0] && flatListing.rent.amount <= rentRange[1];
    return matchesSearch && matchesCity && matchesGender && matchesRent;
  }) ?? [];
  const cities = Array.from(new Set(listingsDb?.map(listing => listing.locations?.city).filter(Boolean) || []));
  const handleFlatClick = (listingId: string) => {
    navigate(`/flat/${listingId}`);
  };
  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setSearchFilters({
      city
    });
  };
  if (error) {
    return <div className="min-h-screen py-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-red-800 mb-2">Failed to Load Listings</h2>
            <p className="text-red-600">
              We encountered an error while fetching the listings. Please try again later.
            </p>
          </div>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Perfect Home
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Browse thousands of verified listings in your preferred location
            </p>
            
            {/* Enhanced Search Bar */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <SearchBar 
                      placeholder="Search by title, area, or address..." 
                      onSearch={setSearchQuery}
                    />
                  </div>
                  
                  <div className="flex gap-4">
                    <select 
                      value={selectedCity} 
                      onChange={e => handleCityChange(e.target.value)} 
                      className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder:text-white/70 backdrop-blur-sm focus:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 min-w-[140px]"
                    >
                      <option value="" className="text-slate-700">All Cities</option>
                      {cities.map(city => 
                        <option key={city} value={city} className="text-slate-700">
                          {city}
                        </option>
                      )}
                    </select>
                    
                    <button
                      onClick={() => setShowMap(!showMap)}
                      className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                        showMap 
                          ? 'bg-white text-blue-600 shadow-lg' 
                          : 'bg-white/20 text-white border border-white/30 hover:bg-white/30'
                      }`}
                    >
                      <Map size={20} />
                      {showMap ? 'List View' : 'Map View'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Compact Filters Section */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-6">
            <div className="flex flex-col xl:flex-row gap-6">
              {/* Gender Filter */}
              <div className="flex-1">
                <label className="text-sm font-semibold text-slate-600 mb-3 block">
                  Gender Preference
                </label>
                <div className="flex gap-2">
                  {['Male', 'Female', 'Any'].map(gender => {
                    const isSelected = selectedGenders.includes(gender);
                    return (
                      <button 
                        key={gender} 
                        type="button" 
                        onClick={() => {
                          setSelectedGenders(prev => 
                            isSelected ? prev.filter(g => g !== gender) : [...prev, gender]
                          );
                        }} 
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          isSelected 
                            ? "bg-blue-600 text-white shadow-md" 
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {gender}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Rent Range Filter */}
              <div className="flex-1">
                <label className="text-sm font-semibold text-slate-600 mb-3 block">
                  Monthly Rent Range
                </label>
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-semibold text-slate-700">
                      ₹{rentRange[0].toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-500">to</span>
                    <span className="text-sm font-semibold text-slate-700">
                      ₹{rentRange[1].toLocaleString()}
                    </span>
                  </div>
                  <Slider 
                    range 
                    min={MIN_RENT} 
                    max={MAX_RENT} 
                    step={500} 
                    value={rentRange} 
                    onChange={(val: [number, number]) => setRentRange(val)} 
                    trackStyle={{
                      background: "linear-gradient(90deg, rgb(59 130 246), rgb(147 51 234))",
                      height: 6,
                      borderRadius: 3
                    }} 
                    handleStyle={[{
                      borderColor: "rgb(59 130 246)",
                      backgroundColor: "white",
                      boxShadow: "0 2px 8px rgba(59, 130, 246, 0.3)",
                      width: 18,
                      height: 18,
                      marginTop: -6
                    }, {
                      borderColor: "rgb(147 51 234)", 
                      backgroundColor: "white",
                      boxShadow: "0 2px 8px rgba(147, 51, 234, 0.3)",
                      width: 18,
                      height: 18,
                      marginTop: -6
                    }]} 
                    railStyle={{
                      backgroundColor: "rgb(203 213 225)",
                      height: 6,
                      borderRadius: 3
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <LoadingGrid />
        ) : filteredListings.length === 0 ? (
          <EmptyState />
        ) : showMap ? (
          <div className="w-full space-y-6">
            {/* Back to List View Button */}
            <div className="flex justify-start">
              <button
                onClick={() => setShowMap(false)}
                className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-slate-200"
              >
                ← Back to List View
              </button>
            </div>
            
            {/* Map Container */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
              <ListingMap
                listings={filteredListings.map(listing => ListingService.transformToFlatListing(listing))}
                height="600px"
                className="w-full"
                onListingSelect={(listing) => handleFlatClick(listing.id!)}
              />
              {/* Info Banner for No Coordinates */}
              {filteredListings.length > 0 && filteredListings.filter(listing => {
                const flatListing = ListingService.transformToFlatListing(listing);
                return flatListing.location.coordinates;
              }).length === 0 && (
                <div className="bg-blue-50 border-t border-blue-200 p-4">
                  <div className="text-center text-blue-700">
                    <p className="text-sm font-medium">📍 Location data is being processed</p>
                    <p className="text-xs mt-1">Listings will appear on the map once addresses are geocoded</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map(listing => {
              const flatListing = ListingService.transformToFlatListing(listing);
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
                  area: flatListing.location.area
                }
              };
              return <ListingCard key={cardListing.id} listing={cardListing} onCardClick={handleFlatClick} />;
            })}
          </div>
        )}
      </div>
    </div>;
};
export default Browse;