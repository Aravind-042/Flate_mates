
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-3xl shadow-xl p-12">
              <div className="text-red-100 mb-6">
                <Home className="h-24 w-24 mx-auto" />
              </div>
              <h1 className="text-3xl font-bold text-slate-800 mb-4">Listing Not Found</h1>
              <p className="text-slate-600 mb-6">The property you're looking for doesn't exist or has been removed.</p>
              <Button 
                onClick={() => navigate('/browse')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold"
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl mb-6 w-1/4"></div>
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="h-96 bg-gradient-to-r from-slate-200 to-slate-300 rounded-3xl"></div>
                  <div className="h-48 bg-gradient-to-r from-slate-200 to-slate-300 rounded-3xl"></div>
                </div>
                <div className="space-y-6">
                  <div className="h-80 bg-gradient-to-r from-slate-200 to-slate-300 rounded-3xl"></div>
                </div>
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Enhanced Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate('/browse')}
            className="mb-8 bg-white/80 backdrop-blur-sm border border-slate-200 hover:bg-white hover:shadow-lg transition-all duration-200 rounded-xl px-6 py-3"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="font-medium">Back to Browse</span>
          </Button>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Images and Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Enhanced Image Gallery */}
              <Card className="bg-white/80 backdrop-blur-md border-0 rounded-3xl shadow-2xl overflow-hidden group">
                <div className="relative">
                  {listing.images && listing.images.length > 0 ? (
                    <>
                      <img 
                        src={listing.images[0]} 
                        alt={listing.title}
                        className="w-full h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                      {listing.images.length > 1 && (
                        <Badge className="absolute top-4 right-4 bg-black/70 text-white border-0 backdrop-blur-sm">
                          +{listing.images.length - 1} photos
                        </Badge>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-96 bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 flex items-center justify-center">
                      <div className="text-center">
                        <Home className="h-24 w-24 text-blue-400 mx-auto mb-4" />
                        <p className="text-slate-600 font-medium">No photos available</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Enhanced Property Title & Location */}
              <Card className="bg-white/80 backdrop-blur-md border-0 rounded-3xl shadow-xl">
                <CardContent className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold text-slate-800 mb-3 leading-tight">
                        {listing.title}
                      </h1>
                      <div className="flex items-center text-slate-600 mb-4">
                        <MapPin className="h-5 w-5 mr-2 text-blue-500" />
                        <span className="text-lg">
                          {listing.locations?.area && listing.locations?.city 
                            ? `${listing.locations.area}, ${listing.locations.city}`
                            : listing.address_line1}
                        </span>
                      </div>
                    </div>
                    <Button
                      size="lg"
                      variant="ghost"
                      className="bg-white/90 backdrop-blur-md hover:bg-red-50 rounded-full p-3 shadow-lg"
                    >
                      <Heart className="h-6 w-6 text-red-500" />
                    </Button>
                  </div>

                  {/* Property Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-2xl p-4 text-center">
                      <Bed className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-slate-800">{listing.bedrooms}</div>
                      <div className="text-sm text-slate-600">Bedrooms</div>
                    </div>
                    <div className="bg-green-50 rounded-2xl p-4 text-center">
                      <Bath className="h-6 w-6 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-slate-800">{listing.bathrooms}</div>
                      <div className="text-sm text-slate-600">Bathrooms</div>
                    </div>
                    {listing.parking_available && (
                      <div className="bg-purple-50 rounded-2xl p-4 text-center">
                        <Car className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                        <div className="text-sm font-semibold text-slate-800">Available</div>
                        <div className="text-sm text-slate-600">Parking</div>
                      </div>
                    )}
                    {listing.is_furnished && (
                      <div className="bg-orange-50 rounded-2xl p-4 text-center">
                        <Home className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                        <div className="text-sm font-semibold text-slate-800">Furnished</div>
                        <div className="text-sm text-slate-600">Ready to move</div>
                      </div>
                    )}
                  </div>

                  {/* Property Type Badge */}
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-0 px-4 py-2 text-sm font-medium">
                      {listing.property_type.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <div className="flex items-center text-sm text-slate-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      Listed {new Date(listing.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Description */}
              <Card className="bg-white/80 backdrop-blur-md border-0 rounded-3xl shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-slate-800 flex items-center">
                    <Home className="h-6 w-6 mr-3 text-blue-500" />
                    About This Property
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 leading-relaxed text-lg">
                    {listing.description || "This beautiful property offers comfortable living spaces with modern amenities. Perfect for anyone looking for a quality home in a great location."}
                  </p>
                </CardContent>
              </Card>

              {/* Enhanced Amenities */}
              {listing.amenities && listing.amenities.length > 0 && (
                <Card className="bg-white/80 backdrop-blur-md border-0 rounded-3xl shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-slate-800 flex items-center">
                      <Star className="h-6 w-6 mr-3 text-yellow-500" />
                      Amenities & Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {listing.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-3">
                          <Wifi className="h-5 w-5 text-green-600 mr-3" />
                          <span className="text-slate-700 font-medium">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Enhanced Property Info and Contact */}
            <div className="space-y-8">
              {/* Enhanced Property Summary */}
              <Card className="bg-white/90 backdrop-blur-md border-0 rounded-3xl shadow-2xl sticky top-8">
                <CardContent className="p-8">
                  {/* Price Section */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 mb-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-slate-800 mb-2">
                        ₹{listing.monthly_rent.toLocaleString()}
                      </div>
                      <div className="text-lg text-slate-600 mb-4">/month</div>
                      {listing.security_deposit && (
                        <div className="text-sm text-slate-600 bg-white/70 rounded-lg p-3">
                          <Shield className="h-4 w-4 inline mr-2" />
                          Security Deposit: ₹{listing.security_deposit.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact Actions */}
                  <div className="space-y-4 mb-6">
                    <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
                      <Phone className="h-5 w-5 mr-3" />
                      Call Owner
                    </Button>
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="rounded-xl py-3 border-2 border-green-200 hover:bg-green-50 transition-colors duration-200">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        WhatsApp
                      </Button>
                      <Button variant="outline" className="rounded-xl py-3 border-2 border-blue-200 hover:bg-blue-50 transition-colors duration-200">
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </Button>
                    </div>
                  </div>

                  {/* Property Highlights */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                      <Users className="h-5 w-5 mr-2 text-blue-500" />
                      Property Highlights
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2">
                        <span className="text-slate-600">Property Type</span>
                        <span className="font-medium text-slate-800">{listing.property_type.replace('_', ' ')}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-slate-600">Furnished</span>
                        <span className="font-medium text-slate-800">{listing.is_furnished ? 'Yes' : 'No'}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-slate-600">Parking</span>
                        <span className="font-medium text-slate-800">{listing.parking_available ? 'Available' : 'Not Available'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Trust Indicators */}
                  <div className="border-t pt-6 mt-6">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="bg-blue-50 rounded-xl p-3">
                        <Shield className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                        <div className="text-sm font-medium text-slate-800">Verified</div>
                        <div className="text-xs text-slate-600">Property</div>
                      </div>
                      <div className="bg-green-50 rounded-xl p-3">
                        <Star className="h-6 w-6 text-yellow-500 mx-auto mb-1" />
                        <div className="text-sm font-medium text-slate-800">Premium</div>
                        <div className="text-xs text-slate-600">Listing</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FlatDetail;
