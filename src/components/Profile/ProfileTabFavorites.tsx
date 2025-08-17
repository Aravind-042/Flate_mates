
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Grid, List } from "lucide-react";
import { ListingCard } from "@/components/Browse/ListingCard";
import { LoadingGrid } from "@/components/Browse/LoadingGrid";
import { useFavoritesStore } from "@/store/favoritesStore";
import { useListings } from "@/hooks/queries/useListings";
import { useNavigate } from "react-router-dom";
import { ListingService } from "@/services/listingService";

export const ProfileTabFavorites: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { favoriteItems, loadFavorites, isLoading: favoritesLoading } = useFavoritesStore();
  const { data: allListings, isLoading: listingsLoading } = useListings();

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  // Filter listings to show only favorites
  const favoriteListings = allListings?.filter(listing => 
    favoriteItems.some(fav => fav.listing_id === listing.id)
  ) || [];

  const transformedListings = favoriteListings.map(listing => {
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

  const handleCardClick = (listingId: string) => {
    navigate(`/flat/${listingId}`);
  };

  const isLoading = favoritesLoading || listingsLoading;

  return (
    <Card className="bg-white/90 shadow-2xl border-0 rounded-3xl">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Heart className="h-6 w-6 text-red-500" />
            My Favorites
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-xl"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-xl"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <LoadingGrid />
        ) : transformedListings.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 mx-auto mb-4 text-slate-400" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              No favorites yet
            </h3>
            <p className="text-slate-600 mb-4">
              Start browsing and add properties to your favorites.
            </p>
            <Button
              onClick={() => navigate("/browse")}
              className="bg-gradient-to-r from-coral-400 to-violet-500 hover:from-coral-500 hover:to-violet-600 text-white rounded-xl"
            >
              Browse Properties
            </Button>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }>
            {transformedListings.map(listing => (
              <ListingCard
                key={listing.id}
                listing={listing}
                onCardClick={handleCardClick}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
