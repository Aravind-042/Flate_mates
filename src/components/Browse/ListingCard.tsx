import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MapPin, Home, Bed, Bath, Car, Heart, ChevronRight, Users, Star, Calendar, Eye } from "lucide-react";
import { useState } from "react";

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
  preferred_gender?: string;
  locations?: {
    city: string;
    area: string;
  };
}

interface ListingCardProps {
  listing: FlatListing;
  onCardClick: (listingId: string) => void;
}

export const ListingCard = ({
  listing,
  onCardClick
}: ListingCardProps) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const formatPropertyType = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatGenderPreference = (gender: string) => {
    if (!gender || gender === 'any') return 'Any Gender';
    return gender.charAt(0).toUpperCase() + gender.slice(1);
  };

  const truncateDescription = (text: string, maxLength: number = 120) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const handleApplyToJoin = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Apply to join clicked for listing:", listing.id);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
    console.log("Favorite toggled for listing:", listing.id);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    onCardClick(listing.id);
  };

  return (
    <TooltipProvider>
      <Card 
        className="group relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] bg-white/90 backdrop-blur-sm border-0 rounded-2xl"
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Section */}
        <div className="relative overflow-hidden">
          {listing.images && listing.images.length > 0 ? (
            <div className="relative">
              <img 
                src={listing.images[0]} 
                alt={listing.title}
                className="w-full h-56 sm:h-64 object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              {/* Image Count Badge */}
              {listing.images.length > 1 && (
                <div className="absolute top-3 left-3 bg-black/70 text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center">
                  <Eye className="h-3 w-3 mr-1" />
                  {listing.images.length} photos
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-56 sm:h-64 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <Home className="h-16 w-16 text-blue-400" />
            </div>
          )}
          
          {/* Property Type Badge */}
          <div className="absolute top-3 right-3 z-10">
            <Badge className="bg-white/95 text-slate-700 border-0 shadow-lg font-medium px-3 py-1 rounded-full text-xs">
              {formatPropertyType(listing.property_type)}
            </Badge>
          </div>

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-16 z-10 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
            title="Save to favorites"
          >
            <Heart className={`h-4 w-4 transition-colors ${isFavorited ? 'fill-red-500 text-red-500' : 'text-slate-600 hover:text-red-500'}`} />
          </button>

          {/* Quick Action Button - Shows on hover */}
          <div className={`absolute bottom-4 right-4 z-20 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            <Button 
              onClick={handleApplyToJoin}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 text-sm font-semibold shadow-lg"
            >
              View Details
            </Button>
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        {/* Content Section */}
        <CardContent className="p-6 space-y-4">
          {/* Title and Location */}
          <div>
            <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
              {listing.title}
            </h3>
            <div className="flex items-center text-slate-600 mt-2">
              <MapPin className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
              <span className="text-sm">
                {listing.locations?.area && listing.locations?.city 
                  ? `${listing.locations.area}, ${listing.locations.city}`
                  : listing.address_line1}
              </span>
            </div>
          </div>

          {/* Property Details */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-slate-600">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center bg-slate-100 rounded-lg px-3 py-1">
                    <Bed className="h-4 w-4 mr-1 text-slate-500" />
                    <span className="font-medium">{listing.bedrooms}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{listing.bedrooms} Bedroom{listing.bedrooms !== 1 ? 's' : ''}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center bg-slate-100 rounded-lg px-3 py-1">
                    <Bath className="h-4 w-4 mr-1 text-slate-500" />
                    <span className="font-medium">{listing.bathrooms}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{listing.bathrooms} Bathroom{listing.bathrooms !== 1 ? 's' : ''}</p>
                </TooltipContent>
              </Tooltip>

              {listing.parking_available && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center bg-green-100 rounded-lg px-3 py-1">
                      <Car className="h-4 w-4 text-green-600" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Parking Available</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>

            {/* Additional Badges */}
            <div className="flex items-center space-x-2">
              {listing.is_furnished && (
                <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                  Furnished
                </Badge>
              )}
              {listing.preferred_gender && listing.preferred_gender !== 'any' && (
                <Badge variant="outline" className="text-xs border-purple-200 text-purple-700">
                  {formatGenderPreference(listing.preferred_gender)}
                </Badge>
              )}
            </div>
          </div>

          {/* Description */}
          {listing.description && (
            <div>
              <p className="text-slate-600 text-sm leading-relaxed">
                {showFullDescription ? listing.description : truncateDescription(listing.description)}
                {listing.description.length > 120 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowFullDescription(!showFullDescription);
                    }}
                    className="text-blue-500 hover:text-blue-600 font-medium ml-1 inline-flex items-center"
                  >
                    {showFullDescription ? 'Show Less' : 'Read More'}
                    <ChevronRight className={`h-3 w-3 ml-1 transition-transform ${showFullDescription ? 'rotate-90' : ''}`} />
                  </button>
                )}
              </p>
            </div>
          )}

          {/* Amenities Preview */}
          {listing.amenities && listing.amenities.length > 0 && (
            <div>
              <div className="flex flex-wrap gap-1">
                {listing.amenities.slice(0, 3).map((amenity, index) => (
                  <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                    {amenity}
                  </span>
                ))}
                {listing.amenities.length > 3 && (
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                    +{listing.amenities.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
          
          {/* Pricing and Footer */}
          <div className="border-t pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-slate-800">
                  ₹{listing.monthly_rent.toLocaleString()}
                </div>
                <div className="text-sm text-slate-600">per month</div>
              </div>
              
              {listing.security_deposit && listing.security_deposit > 0 && (
                <div className="text-right">
                  <div className="text-xs text-slate-500">Security Deposit</div>
                  <div className="text-sm font-semibold text-slate-700">
                    ₹{listing.security_deposit.toLocaleString()}
                  </div>
                </div>
              )}
            </div>

            {/* Posted Date */}
            <div className="flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                Posted {formatDate(listing.created_at)}
              </div>
              <div className="flex items-center">
                <Star className="h-3 w-3 mr-1 text-yellow-500" />
                <span>Premium</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};