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

function mapDbToFlatListing(db: any): FlatListing {
  return {
    id: db.id,
    title: db.title,
    description: db.description ?? "",
    location: {
      city: db.locations?.city ?? "",
      area: db.locations?.area ?? "",
      address: db.address_line1 ?? "",
    },
    property: {
      type: db.property_type,
      bedrooms: db.bedrooms,
      bathrooms: db.bathrooms,
      furnished: !!db.is_furnished,
      parking: !!db.parking_available,
    },
    rent: {
      amount: db.monthly_rent,
      deposit: db.security_deposit ?? 0,
      includes: db.rent_includes ?? [],
    },
    amenities: db.amenities ?? [],
    preferences: {
      gender: db.preferred_gender ?? "any",
      profession: db.preferred_professions ?? [],
      additionalRequirements: db.lifestyle_preferences?.join(", ") ?? "",
    },
    contactPreferences: {
      whatsapp: !!db.contact_whatsapp,
      call: !!db.contact_phone,
      email: !!db.contact_email,
    },
    images: db.images ?? [],
    createdAt: db.created_at ?? undefined,
    ownerId: db.owner_id ?? undefined,
  };
}

const Browse = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const { data: listingsDb, isLoading, error } = useQuery({
    queryKey: ["flat-listings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("flat_listings")
        .select(
          `
          *,
          locations (
            city,
            area
          )
        `
        )
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching listings:", error);
        throw error;
      }

      // Transform DB structure → FlatListing
      return (data ?? []).map(mapDbToFlatListing) as FlatListing[];
    },
  });

  const filteredListings =
    listingsDb?.filter((listing) => {
      const matchesSearch =
        listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.location.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.location.address.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCity =
        !selectedCity ||
        listing.location.city.toLowerCase() === selectedCity.toLowerCase();
      return matchesSearch && matchesCity;
    }) ?? [];

  const cities =
    Array.from(new Set(listingsDb?.map((listing) => listing.location.city).filter(Boolean) || []));

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
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
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
            {filteredListings.map((listing) => {
              // Flatten normalized FlatListing to match ListingCard's expected props
              const cardListing = {
                id: listing.id,
                title: listing.title,
                description: listing.description ?? "",
                property_type: listing.property.type,
                bedrooms: listing.property.bedrooms,
                bathrooms: listing.property.bathrooms,
                monthly_rent: listing.rent.amount,
                security_deposit: listing.rent.deposit ?? 0,
                is_furnished: listing.property.furnished,
                parking_available: listing.property.parking,
                amenities: listing.amenities ?? [],
                address_line1: listing.location.address,
                address_line2: "",
                images: listing.images ?? [],
                owner_id: listing.ownerId ?? "",
                created_at: listing.createdAt ?? "",
                preferred_gender: listing.preferences.gender,
                locations: {
                  city: listing.location.city,
                  area: listing.location.area
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
      </div>
    </div>
  );
};

export default Browse;
