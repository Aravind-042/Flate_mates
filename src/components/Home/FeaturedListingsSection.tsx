
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Button as NeonButton } from "@/components/ui/neon-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Search, 
  ArrowRight,
  MapPin,
  Bed,
  Bath,
  Car,
  Eye,
  Heart
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

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

interface FeaturedListingsSectionProps {
  listings: FlatListing[] | undefined;
  isLoading: boolean;
  filteredListings: FlatListing[];
}

export const FeaturedListingsSection = ({ 
  listings, 
  isLoading, 
  filteredListings 
}: FeaturedListingsSectionProps) => {
  const { user } = useAuth();

  const handleConnectClick = () => {
    if (!user) {
      toast.info("Sign up to connect with flat owners and start your journey!");
    }
  };

  return (
    <section className="relative py-8 sm:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-charcoal">
            Featured Listings
          </h2>
          <p className="text-base sm:text-lg text-charcoal max-w-2xl mx-auto px-4">
            Browse through our curated selection of the best flat sharing opportunities.
          </p>
        </div>

        {/* Listings Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-white/80 backdrop-blur-md border-0 rounded-3xl shadow-xl">
                <CardContent className="p-4 sm:p-6">
                  <div className="animate-pulse">
                    <div className="h-40 sm:h-48 bg-slate-200 rounded-2xl mb-4"></div>
                    <div className="h-4 bg-slate-200 rounded mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredListings.length === 0 ? (
          <Card className="bg-white/80 backdrop-blur-md border-0 rounded-3xl shadow-xl">
            <CardContent className="p-8 sm:p-12 text-center">
              <Home className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 text-slate-400" />
              <h3 className="text-xl sm:text-2xl font-bold text-charcoal mb-2">No listings found</h3>
              <p className="text-charcoal mb-4">Try adjusting your search criteria or browse all listings.</p>
              <Link to="/browse" className="inline-block">
                <Button className="bg-gradient-to-r from-coral-400 to-violet-500 hover:from-coral-500 hover:to-violet-600 text-white rounded-xl">
                  Browse All Listings
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredListings.map((listing) => (
              <Card key={listing.id} className="bg-white/80 backdrop-blur-md border-0 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] group overflow-hidden">
                <div className="relative">
                  {listing.images && listing.images.length > 0 ? (
                    <img 
                      src={listing.images[0]} 
                      alt={listing.title}
                      className="w-full h-40 sm:h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-40 sm:h-48 bg-gradient-to-br from-coral-100 to-violet-100 flex items-center justify-center">
                      <Home className="h-12 w-12 sm:h-16 sm:w-16 text-coral-400" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="bg-white/80 backdrop-blur-md hover:bg-white/90 rounded-full p-2 h-8 w-8 sm:h-auto sm:w-auto"
                      onClick={handleConnectClick}
                    >
                      <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-coral-500" />
                    </Button>
                  </div>
                </div>
                
                <CardHeader className="pb-2 sm:pb-3 p-4 sm:p-6">
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg sm:text-xl font-bold text-charcoal group-hover:text-coral-500 transition-colors line-clamp-2">
                      {listing.title}
                    </CardTitle>
                    <Badge variant="secondary" className="bg-coral-100 text-coral-700 border-0 text-xs sm:text-sm shrink-0">
                      {listing.property_type.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0 p-4 sm:p-6 sm:pt-0">
                  <div className="flex items-center text-charcoal mb-2 sm:mb-3">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 shrink-0" />
                    <span className="text-xs sm:text-sm truncate">
                      {listing.locations?.area && listing.locations?.city 
                        ? `${listing.locations.area}, ${listing.locations.city}`
                        : listing.address_line1}
                    </span>
                  </div>
                  
                  {listing.description && (
                    <p className="text-charcoal text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                      {listing.description.length > 80 
                        ? listing.description.substring(0, 80) + "..." 
                        : listing.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="flex items-center space-x-3 sm:space-x-4 text-xs sm:text-sm text-charcoal">
                      <div className="flex items-center">
                        <Bed className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        <span>{listing.bedrooms}</span>
                      </div>
                      <div className="flex items-center">
                        <Bath className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        <span>{listing.bathrooms}</span>
                      </div>
                      {listing.parking_available && (
                        <div className="flex items-center">
                          <Car className="h-3 w-3 sm:h-4 sm:w-4" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg sm:text-2xl font-bold text-charcoal">
                        ₹{listing.monthly_rent.toLocaleString()}
                      </div>
                      <div className="text-xs sm:text-sm text-charcoal">per month</div>
                    </div>
                    {user ? (
                      <Link to="/browse">
                        <Button className="bg-gradient-to-r from-coral-400 to-violet-500 hover:from-coral-500 hover:to-violet-600 text-white rounded-xl text-xs sm:text-sm px-3 sm:px-4 py-2">
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          <span className="hidden sm:inline">View Details</span>
                          <span className="sm:hidden">View</span>
                        </Button>
                      </Link>
                    ) : (
                      <Button 
                        className="bg-gradient-to-r from-coral-400 to-violet-500 hover:from-coral-500 hover:to-violet-600 text-white rounded-xl text-xs sm:text-sm px-3 sm:px-4 py-2"
                        onClick={handleConnectClick}
                      >
                        <span className="hidden sm:inline">Connect Now</span>
                        <span className="sm:hidden">Connect</span>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Browse More Button with Neon Effect */}
        <div className="text-center mt-8 sm:mt-12">
          <Link to="/browse">
            <NeonButton 
              variant="solid" 
              size="lg"
              className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-bold shadow-xl hover:shadow-2xl transform hover:scale-[1.05] transition-all duration-200"
            >
              <Search className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Browse All Listings
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
            </NeonButton>
          </Link>
        </div>
      </div>
    </section>
  );
};
