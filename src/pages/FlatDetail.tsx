
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
  MessageCircle
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
        <div className="min-h-screen py-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Listing Not Found</h1>
            <Button onClick={() => navigate('/browse')}>Back to Browse</Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-slate-200 rounded mb-4 w-1/4"></div>
              <div className="h-64 bg-slate-200 rounded mb-6"></div>
              <div className="h-6 bg-slate-200 rounded mb-2"></div>
              <div className="h-6 bg-slate-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!listing) return null;

  return (
    <Layout>
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate('/browse')}
            className="mb-6 hover:bg-slate-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Browse
          </Button>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Images and Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Gallery */}
              <Card className="bg-white/80 backdrop-blur-md border-0 rounded-3xl shadow-xl overflow-hidden">
                {listing.images && listing.images.length > 0 ? (
                  <img 
                    src={listing.images[0]} 
                    alt={listing.title}
                    className="w-full h-96 object-cover"
                  />
                ) : (
                  <div className="w-full h-96 bg-gradient-to-br from-coral-100 to-violet-100 flex items-center justify-center">
                    <Home className="h-24 w-24 text-coral-400" />
                  </div>
                )}
              </Card>

              {/* Description */}
              <Card className="bg-white/80 backdrop-blur-md border-0 rounded-3xl shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-slate-800">
                    About This Property
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 leading-relaxed">
                    {listing.description || "No description available for this property."}
                  </p>
                </CardContent>
              </Card>

              {/* Amenities */}
              {listing.amenities && listing.amenities.length > 0 && (
                <Card className="bg-white/80 backdrop-blur-md border-0 rounded-3xl shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-slate-800">
                      Amenities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {listing.amenities.map((amenity, index) => (
                        <Badge key={index} variant="secondary" className="bg-coral-100 text-coral-700 border-0">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Property Info and Contact */}
            <div className="space-y-6">
              {/* Property Summary */}
              <Card className="bg-white/80 backdrop-blur-md border-0 rounded-3xl shadow-xl sticky top-8">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-2xl font-bold text-slate-800">
                      {listing.title}
                    </CardTitle>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="bg-white/80 backdrop-blur-md hover:bg-white/90 rounded-full p-2"
                    >
                      <Heart className="h-4 w-4 text-coral-500" />
                    </Button>
                  </div>
                  <div className="flex items-center text-slate-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>
                      {listing.locations?.area && listing.locations?.city 
                        ? `${listing.locations.area}, ${listing.locations.city}`
                        : listing.address_line1}
                    </span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary" className="bg-coral-100 text-coral-700 border-0">
                      {listing.property_type.replace('_', ' ')}
                    </Badge>
                    {listing.is_furnished && (
                      <Badge variant="outline">Furnished</Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-slate-600">
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

                  <div className="border-t pt-4">
                    <div className="text-3xl font-bold text-slate-800 mb-1">
                      ₹{listing.monthly_rent.toLocaleString()}
                    </div>
                    <div className="text-sm text-slate-600 mb-2">per month</div>
                    {listing.security_deposit && (
                      <div className="text-sm text-slate-600">
                        Security Deposit: ₹{listing.security_deposit.toLocaleString()}
                      </div>
                    )}
                  </div>

                  {/* Contact Actions */}
                  <div className="space-y-3 pt-4 border-t">
                    <Button className="w-full bg-gradient-to-r from-coral-400 to-violet-500 hover:from-coral-500 hover:to-violet-600 text-white rounded-xl">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Owner
                    </Button>
                    <Button variant="outline" className="w-full rounded-xl">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      WhatsApp
                    </Button>
                    <Button variant="outline" className="w-full rounded-xl">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
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
