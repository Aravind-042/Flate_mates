import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MapPin, 
  Home, 
  Bed, 
  Bath, 
  Car, 
  Search,
  Heart
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

const Browse = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const { data: listings, isLoading, error } = useQuery({
    queryKey: ['flat-listings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flat_listings')
        .select(`
          *,
          locations (
            city,
            area
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching listings:', error);
        throw error;
      }
      
      return data as FlatListing[];
    }
  });

  const filteredListings = listings?.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.locations?.area?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.address_line1.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = !selectedCity || listing.locations?.city?.toLowerCase() === selectedCity.toLowerCase();
    return matchesSearch && matchesCity;
  }) || [];

  const cities = Array.from(new Set(listings?.map(listing => listing.locations?.city).filter(Boolean) || []));

  const handleFlatClick = (listingId: string) => {
    navigate(`/flat/${listingId}`);
  };

  if (error) {
    toast.error("Failed to load listings");
  }

  return (
    <Layout>
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-coral-400 via-pink-500 to-violet-500 bg-clip-text text-transparent">
              Browse Flat Listings
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Discover amazing flat sharing opportunities in your preferred city.
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="bg-white/80 backdrop-blur-md border-0 rounded-3xl shadow-xl mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    placeholder="Search by title or area..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 border-2 border-slate-200 focus:border-coral-400 rounded-xl"
                  />
                </div>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="h-12 px-4 border-2 border-slate-200 focus:border-coral-400 rounded-xl bg-white text-slate-700"
                >
                  <option value="">All Cities</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Listings Grid */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="bg-white/80 backdrop-blur-md border-0 rounded-3xl shadow-xl">
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="h-48 bg-slate-200 rounded-2xl mb-4"></div>
                      <div className="h-4 bg-slate-200 rounded mb-2"></div>
                      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredListings.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-md border-0 rounded-3xl shadow-xl">
              <CardContent className="p-12 text-center">
                <Home className="h-16 w-16 mx-auto mb-4 text-slate-400" />
                <h3 className="text-2xl font-bold text-slate-700 mb-2">No listings found</h3>
                <p className="text-slate-600">Try adjusting your search criteria to find more results.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
                <Card 
                  key={listing.id} 
                  className="bg-white/80 backdrop-blur-md border-0 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] group overflow-hidden cursor-pointer"
                  onClick={() => handleFlatClick(listing.id)}
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
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Browse;
