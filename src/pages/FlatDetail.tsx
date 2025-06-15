
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Home, 
  Bed, 
  Bath, 
  Car, 
  ArrowLeft,
  Heart,
  Phone,
  Mail,
  MessageCircle,
  Calendar,
  Users,
  Star,
  Shield,
  Wifi
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { toast } from "sonner";

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

const FlatDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: listing, isLoading, error } = useQuery({
    queryKey: ['flat-listing', id],
    queryFn: async () => {
      if (!id) throw new Error('No listing ID provided');
      
      const { data, error } = await supabase
        .from('flat_listings')
        .select(`
          *,
          locations (
            city,
            area
          )
        `)
        .eq('id', id)
        .eq('status', 'active')
        .single();
      
      if (error) {
        console.error('Error fetching listing:', error);
        throw error;
      }
      
      return data as FlatListing;
    },
    enabled: !!id
  });

  if (error) {
    toast.error("Failed to load listing details");
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-4 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
              <div className="text-red-100 mb-4">
                <Home className="h-16 w-16 sm:h-20 sm:w-20 mx-auto" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3">Listing Not Found</h1>
              <p className="text-slate-600 text-sm sm:text-base mb-4">The property you're looking for doesn't exist or has been removed.</p>
              <Button 
                onClick={() => navigate('/browse')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-xl font-semibold text-sm sm:text-base"
              >
                Browse Other Properties
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-4 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl mb-4 w-1/4"></div>
              <div className="space-y-4">
                <div className="h-48 sm:h-64 bg-gradient-to-r from-slate-200 to-slate-300 rounded-2xl"></div>
                <div className="h-32 bg-gradient-to-r from-slate-200 to-slate-300 rounded-2xl"></div>
                <div className="h-48 bg-gradient-to-r from-slate-200 to-slate-300 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!listing) return null;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-4 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button - Mobile Optimized */}
          <Button 
            variant="ghost" 
            onClick={() => navigate('/browse')}
            className="mb-4 bg-white/80 backdrop-blur-sm border border-slate-200 hover:bg-white hover:shadow-lg transition-all duration-200 rounded-xl px-4 py-2 text-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="font-medium">Back to Browse</span>
          </Button>

          {/* Main Content - Mobile First Layout */}
          <div className="space-y-4">
            {/* Image Gallery - Mobile Optimized */}
            <Card className="bg-white/80 backdrop-blur-md border-0 rounded-2xl shadow-xl overflow-hidden">
              <div className="relative">
                {listing.images && listing.images.length > 0 ? (
                  <>
                    <img 
                      src={listing.images[0]} 
                      alt={listing.title}
                      className="w-full h-48 sm:h-64 md:h-80 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                    {listing.images.length > 1 && (
                      <Badge className="absolute top-3 right-3 bg-black/70 text-white border-0 backdrop-blur-sm text-xs">
                        +{listing.images.length - 1} photos
                      </Badge>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-3 left-3 bg-white/90 backdrop-blur-md hover:bg-white rounded-full p-2 shadow-lg"
                    >
                      <Heart className="h-4 w-4 text-red-500" />
                    </Button>
                  </>
                ) : (
                  <div className="w-full h-48 sm:h-64 bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 flex items-center justify-center">
                    <div className="text-center">
                      <Home className="h-12 w-12 sm:h-16 sm:w-16 text-blue-400 mx-auto mb-2" />
                      <p className="text-slate-600 font-medium text-sm">No photos available</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Property Title & Info - Mobile Optimized */}
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

            {/* Price and Contact - Mobile Optimized */}
            <Card className="bg-white/90 backdrop-blur-md border-0 rounded-2xl shadow-xl">
              <CardContent className="p-4 sm:p-6">
                {/* Price Section */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1">
                      ₹{listing.monthly_rent.toLocaleString()}
                    </div>
                    <div className="text-sm sm:text-base text-slate-600 mb-3">/month</div>
                    {listing.security_deposit && (
                      <div className="text-xs sm:text-sm text-slate-600 bg-white/70 rounded-lg p-2">
                        <Shield className="h-3 w-3 inline mr-1" />
                        Security Deposit: ₹{listing.security_deposit.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Actions - Mobile Stack */}
                <div className="space-y-3">
                  <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl py-3 text-sm font-semibold shadow-lg">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Owner
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="rounded-xl py-2 border-2 border-green-200 hover:bg-green-50 text-xs">
                      <MessageCircle className="h-3 w-3 mr-1" />
                      WhatsApp
                    </Button>
                    <Button variant="outline" className="rounded-xl py-2 border-2 border-blue-200 hover:bg-blue-50 text-xs">
                      <Mail className="h-3 w-3 mr-1" />
                      Email
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description - Mobile Optimized */}
            <Card className="bg-white/80 backdrop-blur-md border-0 rounded-2xl shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg sm:text-xl font-bold text-slate-800 flex items-center">
                  <Home className="h-5 w-5 mr-2 text-blue-500" />
                  About This Property
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  {listing.description || "This beautiful property offers comfortable living spaces with modern amenities. Perfect for anyone looking for a quality home in a great location."}
                </p>
              </CardContent>
            </Card>

            {/* Property Highlights - Mobile Optimized */}
            <Card className="bg-white/80 backdrop-blur-md border-0 rounded-2xl shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg sm:text-xl font-bold text-slate-800 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-500" />
                  Property Highlights
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-600 text-sm">Property Type</span>
                    <span className="font-medium text-slate-800 text-sm">{listing.property_type.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-600 text-sm">Furnished</span>
                    <span className="font-medium text-slate-800 text-sm">{listing.is_furnished ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-600 text-sm">Parking</span>
                    <span className="font-medium text-slate-800 text-sm">{listing.parking_available ? 'Available' : 'Not Available'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Amenities - Mobile Optimized */}
            {listing.amenities && listing.amenities.length > 0 && (
              <Card className="bg-white/80 backdrop-blur-md border-0 rounded-2xl shadow-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg sm:text-xl font-bold text-slate-800 flex items-center">
                    <Star className="h-5 w-5 mr-2 text-yellow-500" />
                    Amenities & Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {listing.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-2">
                        <Wifi className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                        <span className="text-slate-700 font-medium text-sm">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Trust Indicators - Mobile Optimized */}
            <Card className="bg-white/80 backdrop-blur-md border-0 rounded-2xl shadow-xl">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-blue-50 rounded-xl p-3">
                    <Shield className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                    <div className="text-sm font-medium text-slate-800">Verified</div>
                    <div className="text-xs text-slate-600">Property</div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-3">
                    <Star className="h-5 w-5 text-yellow-500 mx-auto mb-1" />
                    <div className="text-sm font-medium text-slate-800">Premium</div>
                    <div className="text-xs text-slate-600">Listing</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FlatDetail;
