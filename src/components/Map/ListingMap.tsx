import React from 'react';
import { LocationMap } from './LocationMap';
import type { FlatListing } from '@/types/flat';

interface ListingMapProps {
  listings: FlatListing[];
  selectedListing?: FlatListing;
  onListingSelect?: (listing: FlatListing) => void;
  height?: string;
  className?: string;
}

export const ListingMap = ({
  listings,
  selectedListing,
  onListingSelect,
  height = "400px",
  className = ""
}: ListingMapProps) => {
  // Filter listings that have coordinates
  const listingsWithCoordinates = listings.filter(
    listing => listing.location.coordinates && listing.location.coordinates.length === 2
  );

  // Create markers for listings
  const markers = listingsWithCoordinates.map(listing => ({
    coordinates: listing.location.coordinates!,
    title: listing.title,
    description: `₹${listing.rent.amount.toLocaleString()} • ${listing.location.area}`
  }));

  // Calculate center point from all listings
  const getCenter = (): [number, number] => {
    if (selectedListing?.location.coordinates) {
      return selectedListing.location.coordinates;
    }
    
    if (listingsWithCoordinates.length === 0) {
      return [77.2090, 28.6139]; // Default to Delhi
    }

    const avgLng = listingsWithCoordinates.reduce((sum, listing) => 
      sum + listing.location.coordinates![0], 0) / listingsWithCoordinates.length;
    const avgLat = listingsWithCoordinates.reduce((sum, listing) => 
      sum + listing.location.coordinates![1], 0) / listingsWithCoordinates.length;

    return [avgLng, avgLat];
  };

  const handleMapClick = (coordinates: [number, number]) => {
    // Find listing closest to clicked coordinates (if needed for future functionality)
    console.log('Map clicked at:', coordinates);
  };

  return (
    <div className={className}>
      <LocationMap
        center={getCenter()}
        zoom={selectedListing ? 14 : 11}
        markers={markers}
        height={height}
        onMapClick={handleMapClick}
      />
      {listingsWithCoordinates.length === 0 && (
        <div className="absolute inset-0 bg-slate-100 rounded-lg flex items-center justify-center">
          <div className="text-center text-slate-500">
            <p className="text-sm">No listings with location data available</p>
            <p className="text-xs mt-1">Listings will appear here once addresses are geocoded</p>
          </div>
        </div>
      )}
    </div>
  );
};