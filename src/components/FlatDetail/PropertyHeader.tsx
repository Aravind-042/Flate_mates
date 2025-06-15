
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Car, Home, Calendar } from "lucide-react";

interface FlatListing {
  title: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  parking_available: boolean | null;
  is_furnished: boolean | null;
  address_line1: string;
  created_at: string;
  locations?: {
    city: string;
    area: string;
  };
}

interface PropertyHeaderProps {
  listing: FlatListing;
}

export const PropertyHeader = ({ listing }: PropertyHeaderProps) => {
  return (
    <Card className="bg-white/80 backdrop-blur-md border-0 rounded-2xl shadow-xl">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          {/* Title and Location */}
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 mb-2 leading-tight">
              {listing.title}
            </h1>
            <div className="flex items-center text-slate-600 mb-3">
              <MapPin className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
              <span className="text-sm sm:text-base">
                {listing.locations?.area && listing.locations?.city 
                  ? `${listing.locations.area}, ${listing.locations.city}`
                  : listing.address_line1}
              </span>
            </div>
          </div>

          {/* Property Stats - Mobile Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-blue-50 rounded-xl p-3 text-center">
              <Bed className="h-5 w-5 text-blue-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-slate-800">{listing.bedrooms}</div>
              <div className="text-xs text-slate-600">Bedrooms</div>
            </div>
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <Bath className="h-5 w-5 text-green-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-slate-800">{listing.bathrooms}</div>
              <div className="text-xs text-slate-600">Bathrooms</div>
            </div>
            {listing.parking_available && (
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <Car className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                <div className="text-xs font-semibold text-slate-800">Available</div>
                <div className="text-xs text-slate-600">Parking</div>
              </div>
            )}
            {listing.is_furnished && (
              <div className="bg-orange-50 rounded-xl p-3 text-center">
                <Home className="h-5 w-5 text-orange-600 mx-auto mb-1" />
                <div className="text-xs font-semibold text-slate-800">Furnished</div>
                <div className="text-xs text-slate-600">Ready to move</div>
              </div>
            )}
          </div>

          {/* Property Type and Date */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <Badge variant="secondary" className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-0 px-3 py-1 text-xs font-medium w-fit">
              {listing.property_type.replace('_', ' ').toUpperCase()}
            </Badge>
            <div className="flex items-center text-xs text-slate-500">
              <Calendar className="h-3 w-3 mr-1" />
              Listed {new Date(listing.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
