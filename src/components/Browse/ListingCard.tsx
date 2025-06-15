
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MapPin, Home, Bed, Bath, Car, Heart, ChevronRight, Users } from "lucide-react";
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

  const formatPropertyType = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatGenderPreference = (gender: string) => {
    if (!gender || gender === 'any') return 'Any Gender';
    return gender.charAt(0).toUpperCase() + gender.slice(1);
  };

  const truncateDescription = (text: string, maxLength: number = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength);
  };

  const handleApplyToJoin = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement apply to join functionality
    console.log("Apply to join clicked for listing:", listing.id);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement favorite functionality
    console.log("Favorite clicked for listing:", listing.id);
  };

  return (
    <TooltipProvider>
      <Card 
        className="bg-white/90 backdrop-blur-md border-0 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] group overflow-hidden cursor-pointer" 
        onClick={() => onCardClick(listing.id)} 
        onMouseEnter={() => setIsHovered(true)} 
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden">
          {listing.images && listing.images.length > 0 ? (
            <div className="relative">
              <img 
                src={listing.images[0]} 
                alt={listing.title} 
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110" 
              />
              {/* Gradient overlay for better text visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-coral-100 to-violet-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Home className="h-16 w-16 text-coral-400" />
            </div>
          )}
          
          {/* Property Type and Gender Badge */}
          <div className="absolute top-4 left-4">
            <Badge className="bg-white/95 text-slate-700 border-0 shadow-md font-medium">
              {formatPropertyType(listing.property_type)}
              {listing.preferred_gender && (
                <span className="ml-2 text-purple-600">
                  • {formatGenderPreference(listing.preferred_gender)}
                </span>
              )}
            </Badge>
          </div>

          {/* Heart/Favorite Button with fixed positioning */}
          <div className="absolute top-4 right-4 z-20">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="bg-white/90 backdrop-blur-md hover:bg-white/95 rounded-full p-2 shadow-md relative z-30" 
                  onClick={handleFavoriteClick}
                >
                  <Heart className="h-4 w-4 text-coral-500 hover:fill-coral-500 transition-colors" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="z-50">
                <p>Save to favorites</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Apply to Join Button - Shows on hover */}
          <div className={`absolute bottom-4 right-4 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            <Button 
              onClick={handleApplyToJoin} 
              className="bg-coral-500 hover:bg-coral-600 text-white rounded-xl px-4 py-2 text-sm font-semibold shadow-lg"
            >
              View More
            </Button>
          </div>
        </div>
        
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-bold text-slate-800 group-hover:text-coral-500 transition-colors">
              {listing.title}
            </CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          {/* Location with enhanced styling */}
          <div className="flex items-center text-slate-600 mb-3">
            <MapPin className="h-4 w-4 mr-2 text-coral-500" />
            <span className="text-sm">
              {listing.locations?.area && <span className="font-medium">{listing.locations.area}</span>}
              {listing.locations?.area && listing.locations?.city && <span className="mx-1">•</span>}
              {listing.locations?.city && (
                <Badge variant="outline" className="ml-1 text-xs border-coral-200 text-coral-700">
                  {listing.locations.city}
                </Badge>
              )}
              {!listing.locations?.area && !listing.locations?.city && <span>{listing.address_line1}</span>}
            </span>
          </div>
          
          {/* Description with Read More functionality */}
          {listing.description && (
            <div className="mb-4">
              <p className="text-slate-600 text-sm leading-relaxed">
                {showFullDescription ? listing.description : truncateDescription(listing.description)}
                {listing.description.length > 100 && !showFullDescription && (
                  <>
                    <span className="bg-gradient-to-r from-transparent to-white absolute right-0 w-8 h-5"></span>
                    ...
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowFullDescription(true);
                      }} 
                      className="text-coral-500 hover:text-coral-600 font-medium ml-1 inline-flex items-center"
                    >
                      Read More
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </button>
                  </>
                )}
                {showFullDescription && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowFullDescription(false);
                    }} 
                    className="text-coral-500 hover:text-coral-600 font-medium ml-1"
                  >
                    Show Less
                  </button>
                )}
              </p>
            </div>
          )}
          
          {/* Property Details with Tooltips - Simplified without gender since it's now in the badge */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4 text-sm text-slate-600">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center cursor-help">
                    <Bed className="h-4 w-4 mr-1 text-slate-500" />
                    <span>{listing.bedrooms}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{listing.bedrooms} Bedroom{listing.bedrooms !== 1 ? 's' : ''}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center cursor-help">
                    <Bath className="h-4 w-4 mr-1 text-slate-500" />
                    <span>{listing.bathrooms}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{listing.bathrooms} Bathroom{listing.bathrooms !== 1 ? 's' : ''}</p>
                </TooltipContent>
              </Tooltip>

              {listing.parking_available && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center cursor-help">
                      <Car className="h-4 w-4 mr-1 text-green-600" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Parking Available</p>
                  </TooltipContent>
                </Tooltip>
              )}

              {listing.is_furnished && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 cursor-help">
                      Furnished
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Fully Furnished Property</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
          
          {/* Pricing */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-slate-800">
                ₹{listing.monthly_rent.toLocaleString()}
              </div>
              <div className="text-sm text-slate-600">per month</div>
            </div>
            
            {/* Security Deposit Info */}
            {listing.security_deposit && listing.security_deposit > 0 && (
              <div className="text-right">
                <div className="text-xs text-slate-500">Security Deposit</div>
                <div className="text-sm font-semibold text-slate-700">
                  ₹{listing.security_deposit.toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};
