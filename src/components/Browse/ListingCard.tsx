
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Home, 
  Bed, 
  Bath, 
  Car, 
  Heart
} from "lucide-react";

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

interface ListingCardProps {
  listing: FlatListing;
  onCardClick: (listingId: string) => void;
}

export const ListingCard = ({ listing, onCardClick }: ListingCardProps) => {
  return (
    <Card 
      className="bg-white/80 backdrop-blur-md border-0 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] group overflow-hidden cursor-pointer"
      onClick={() => onCardClick(listing.id)}
    >
      <div className="relative">
        {listing.images && listing.images.length > 0 ? (
          <img 
            src={listing.images[0]} 
            alt={listing.title}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-coral-100 to-violet-100 flex items-center justify-center">
            <Home className="h-16 w-16 text-coral-400" />
          </div>
        )}
        <div className="absolute top-4 right-4">
          <Button
            size="sm"
            variant="ghost"
            className="bg-white/80 backdrop-blur-md hover:bg-white/90 rounded-full p-2"
            onClick={(e) => {
              e.stopPropagation();
              // Handle favorite functionality
            }}
          >
            <Heart className="h-4 w-4 text-coral-500" />
          </Button>
        </div>
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold text-slate-800 group-hover:text-coral-500 transition-colors">
            {listing.title}
          </CardTitle>
          <Badge variant="secondary" className="bg-coral-100 text-coral-700 border-0">
            {listing.property_type.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center text-slate-600 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">
            {listing.locations?.area && listing.locations?.city 
              ? `${listing.locations.area}, ${listing.locations.city}`
              : listing.address_line1}
          </span>
        </div>
        
        {listing.description && (
          <p className="text-slate-600 text-sm mb-4 line-clamp-2">
            {listing.description.length > 100 
              ? listing.description.substring(0, 100) + "..." 
              : listing.description}
          </p>
        )}
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-slate-600">
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              <span>{listing.bedrooms}</span>
            </div>
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              <span>{listing.bathrooms}</span>
            </div>
            {listing.parking_available && (
              <div className="flex items-center">
                <Car className="h-4 w-4 mr-1" />
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-slate-800">
              ₹{listing.monthly_rent.toLocaleString()}
            </div>
            <div className="text-sm text-slate-600">per month</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
