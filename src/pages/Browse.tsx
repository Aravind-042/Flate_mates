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

        

        <div className="mb-6 flex flex-col md:flex-row gap-3 md:gap-5 max-w-3xl w-full mx-auto">
          <div className="flex-1">
            <SearchBar placeholder="Search by title, area, or address..." onSearch={setSearchQuery} />
          </div>
          <div className="md:w-[220px] w-full">
            <select value={selectedCity} onChange={e => handleCityChange(e.target.value)} className="h-12 px-4 border-2 border-slate-200 focus:border-coral-400 rounded-xl bg-white text-slate-700 transition-all w-full shadow-sm">
              <option value="">All Cities</option>
              {cities.map(city => <option key={city} value={city}>
                  {city}
                </option>)}
            </select>
          </div>
          <button
            onClick={() => setShowMap(!showMap)}
            className={`h-12 px-4 border-2 rounded-xl transition-all flex items-center gap-2 font-medium ${
              showMap 
                ? 'bg-blue-500 text-white border-blue-500' 
                : 'bg-white text-slate-700 border-slate-200 hover:border-coral-400'
            }`}
          >
            <Map size={18} />
            {showMap ? 'List View' : 'Map View'}
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 max-w-3xl mx-auto">
          {/* Gender Filter */}
          <div className="flex items-center gap-4">
  <span className="text-slate-700 font-medium">Gender :</span>
  <div className="flex gap-2">
    {['Male', 'Female', 'Any'].map(gender => {
              const isSelected = selectedGenders.includes(gender);
              return <button key={gender} type="button" onClick={() => {
                setSelectedGenders(prev => isSelected ? prev.filter(g => g !== gender) // Deselect
                : [...prev, gender] // Select
                );
              }} className={`px-4 py-1 rounded-full border transition-all text-sm font-medium ${isSelected ? "bg-blue-500 text-white border-blue-500" : "bg-white text-slate-600 border-slate-300 hover:bg-slate-100"}`}>
          {gender}
        </button>;
            })}
  </div>
        </div>


          {/* Rent Range Filter */}
          <div className="w-full md:w-[300px]">
            <label className="text-slate-700 font-medium">
              Rent Range: ₹{rentRange[0]} - ₹{rentRange[1]}
            </label>
            <Slider range min={MIN_RENT} max={MAX_RENT} step={500} value={rentRange} onChange={(val: [number, number]) => setRentRange(val)} trackStyle={{
            backgroundColor: "hsl(213, 94%, 68%)"
          }} handleStyle={[{
            borderColor: "#0ea5e9",
            backgroundColor: "#0ea5e9"
          }, {
            borderColor: "#0ea5e9",
            backgroundColor: "#0ea5e9"
          }]} />
          </div>
        </div>

        {isLoading ? (
          <LoadingGrid />
        ) : filteredListings.length === 0 ? (
          <EmptyState />
        ) : showMap ? (
          <div className="w-full">
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