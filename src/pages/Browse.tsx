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
  return <div className="min-h-screen py-8 px-4 relative overflow-x-clip overflow-y-visible">
      <Landmark size={72} className="absolute left-12 bottom-[14%] text-emerald-400 drop-shadow-xl z-10 animate-float hidden md:block" />
      <Factory size={56} className="absolute right-20 bottom-[18%] text-pink-400 drop-shadow z-10 animate-float delay-250 md:block hidden" />
      <Warehouse size={38} className="absolute left-1/2 bottom-11 text-orange-300 drop-shadow-lg z-10 animate-float" />

      <div className="max-w-7xl mx-auto relative z-10">
        <BrowseHeader />

        

        <div className="mb-8 flex flex-col lg:flex-row gap-4 max-w-6xl w-full mx-auto">
          {/* Search Bar */}
          <div className="flex-1 min-w-0">
            <SearchBar placeholder="Search by title, area, or address..." onSearch={setSearchQuery} />
          </div>
          
          {/* City Dropdown */}
          <div className="lg:w-48 w-full">
            <select 
              value={selectedCity} 
              onChange={e => handleCityChange(e.target.value)} 
              className="h-12 px-4 border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl bg-white text-slate-700 transition-all w-full shadow-sm font-medium z-50 relative"
            >
              <option value="">All Cities</option>
              {cities.map(city => <option key={city} value={city}>
                  {city}
                </option>)}
            </select>
          </div>
          
          {/* Map View Toggle */}
          <button
            onClick={() => setShowMap(!showMap)}
            className={`h-12 px-6 border-2 rounded-xl transition-all flex items-center gap-3 font-semibold whitespace-nowrap ${
              showMap 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-blue-500 shadow-lg transform scale-[1.02]' 
                : 'bg-white text-slate-700 border-slate-200 hover:border-blue-500 hover:text-blue-600 hover:shadow-md'
            }`}
          >
            <Map size={20} />
            {showMap ? 'List View' : 'Map View'}
          </button>
        </div>

        {/* Redesigned Filters Section */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="bg-gradient-to-br from-white/95 via-white/90 to-blue-50/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="h-2 w-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-slate-700 to-blue-600 bg-clip-text text-transparent">
                Refine Your Search
              </h3>
            </div>
            
            {/* Filters Grid */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Gender Filter */}
              <div className="space-y-4">
                <label className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                  Gender Preference
                </label>
                <div className="flex flex-wrap gap-3">
                  {['Male', 'Female', 'Any'].map(gender => {
                    const isSelected = selectedGenders.includes(gender);
                    return <button 
                      key={gender} 
                      type="button" 
                      onClick={() => {
                        setSelectedGenders(prev => isSelected ? prev.filter(g => g !== gender) : [...prev, gender]);
                      }} 
                      className={`group relative px-8 py-3 rounded-2xl border-2 transition-all duration-300 text-sm font-semibold transform hover:scale-105 hover:shadow-lg ${
                        isSelected 
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white border-transparent shadow-lg shadow-blue-500/25" 
                          : "bg-white/70 text-slate-700 border-slate-200 hover:bg-white hover:border-blue-300 hover:text-blue-600"
                      }`}
                    >
                      <span className="relative z-10">{gender}</span>
                      {isSelected && (
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-40 transition-opacity"></div>
                      )}
                    </button>;
                  })}
                </div>
              </div>

              {/* Rent Range Filter */}
              <div className="space-y-4">
                <label className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                  Monthly Rent Range
                </label>
                <div className="bg-white/50 rounded-2xl p-6 border border-white/60">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold text-slate-700">
                      ₹{rentRange[0].toLocaleString()}
                    </span>
                    <span className="text-sm text-slate-500 px-3 py-1 bg-slate-100 rounded-full">to</span>
                    <span className="text-lg font-bold text-slate-700">
                      ₹{rentRange[1].toLocaleString()}
                    </span>
                  </div>
                  <div className="px-2">
                    <Slider 
                      range 
                      min={MIN_RENT} 
                      max={MAX_RENT} 
                      step={500} 
                      value={rentRange} 
                      onChange={(val: [number, number]) => setRentRange(val)} 
                      trackStyle={{
                        background: "linear-gradient(90deg, rgb(59 130 246), rgb(147 51 234))",
                        height: 8,
                        borderRadius: 8
                      }} 
                      handleStyle={[{
                        borderColor: "transparent",
                        backgroundColor: "white",
                        boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)",
                        width: 24,
                        height: 24,
                        marginTop: -8,
                        borderWidth: 3,
                        borderStyle: "solid",
                        borderRadius: 12
                      }, {
                        borderColor: "transparent", 
                        backgroundColor: "white",
                        boxShadow: "0 4px 12px rgba(147, 51, 234, 0.4)",
                        width: 24,
                        height: 24,
                        marginTop: -8,
                        borderWidth: 3,
                        borderStyle: "solid",
                        borderRadius: 12
                      }]} 
                      railStyle={{
                        backgroundColor: "rgb(226 232 240)",
                        height: 8,
                        borderRadius: 8
                      }}
                    />
                  </div>
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
          <div className="w-full">
            <div className="mb-6">
              <button
                onClick={() => setShowMap(false)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
              >
                ← Back to List View
              </button>
            </div>
            <ListingMap
              listings={filteredListings.map(listing => ListingService.transformToFlatListing(listing))}
              height="600px"
              className="rounded-2xl overflow-hidden shadow-lg"
              onListingSelect={(listing) => handleFlatClick(listing.id!)}
            />
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