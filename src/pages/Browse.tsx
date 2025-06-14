
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
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
  Wifi, 
  Search,
  Filter,
  Heart,
  MessageCircle,
  Star,
  TrendingUp,
  Zap
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { toast } from "sonner";
import { ContactModal } from "@/components/ContactModal";

interface FlatListing {
  id: string;
  title: string;
  description: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  rent_amount: number;
  rent_deposit: number;
  furnished: boolean;
  parking: boolean;
  amenities: string[];
  location_city: string;
  location_area: string;
  location_address: string;
  images: string[];
  owner_id: string;
  created_at: string;
}

const Browse = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [likedListings, setLikedListings] = useState<Set<string>>(new Set());
  const [selectedListing, setSelectedListing] = useState<FlatListing | null>(null);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  const { data: listings, isLoading, error } = useQuery({
    queryKey: ['flat-listings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flat_listings')
        .select('*')
        .eq('is_active', true)
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
                         listing.location_area.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = !selectedCity || listing.location_city.toLowerCase() === selectedCity.toLowerCase();
    return matchesSearch && matchesCity;
  }) || [];

  const cities = Array.from(new Set(listings?.map(listing => listing.location_city) || []));

  const handleLike = (listingId: string) => {
    const newLikedListings = new Set(likedListings);
    if (newLikedListings.has(listingId)) {
      newLikedListings.delete(listingId);
      toast.success("Removed from favorites! 💔");
    } else {
      newLikedListings.add(listingId);
      toast.success("Added to favorites! 💖 Ready to connect?");
    }
    setLikedListings(newLikedListings);
  };

  const handleContact = (listing: FlatListing) => {
    setSelectedListing(listing);
    setContactModalOpen(true);
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
            <h1 className="text-5xl md:text-6xl font-black mb-4 hero-gradient">
              Discover Your Vibe
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
              Swipe through the most aesthetic flats. Find your perfect living situation! ✨
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="card-modern mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    placeholder="Search vibes, areas, or keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-14 border-2 border-slate-200 focus:border-purple-haze rounded-2xl text-lg font-medium"
                  />
                </div>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="h-14 px-4 border-2 border-slate-200 focus:border-purple-haze rounded-2xl bg-white text-slate-700 font-medium min-w-[200px]"
                >
                  <option value="">All Cities</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                <Button className="btn-secondary h-14 px-6 font-bold">
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Listings Grid */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="card-modern">
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="h-48 bg-gradient-to-br from-purple-haze/10 to-neon-pink/10 rounded-2xl mb-4"></div>
                      <div className="h-4 bg-slate-200 rounded mb-2"></div>
                      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredListings.length === 0 ? (
            <Card className="card-modern">
              <CardContent className="p-12 text-center">
                <Home className="h-16 w-16 mx-auto mb-4 text-slate-400" />
                <h3 className="text-2xl font-bold text-slate-700 mb-2">No vibes found</h3>
                <p className="text-slate-600">Try different search terms to find your perfect flat! 🏠</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredListings.map((listing) => {
                const isLiked = likedListings.has(listing.id);
                return (
                  <Card key={listing.id} className="card-modern group overflow-hidden relative">
                    <div className="relative">
                      {listing.images && listing.images.length > 0 ? (
                        <img 
                          src={listing.images[0]} 
                          alt={listing.title}
                          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-purple-haze/20 to-neon-pink/20 flex items-center justify-center">
                          <Home className="h-16 w-16 text-purple-haze/60" />
                        </div>
                      )}
                      
                      {/* Action buttons overlay */}
                      <div className="absolute top-4 right-4 flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleLike(listing.id)}
                          className={`bg-white/90 backdrop-blur-md hover:bg-white rounded-full p-2 transition-all duration-200 ${
                            isLiked ? 'text-red-500 hover:text-red-600' : 'text-slate-500 hover:text-red-500'
                          }`}
                        >
                          <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                        </Button>
                      </div>

                      {/* Trending badge */}
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-gradient-to-r from-sunset-orange to-neon-pink text-white border-0 font-bold">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Hot
                        </Badge>
                      </div>
                    </div>
                    
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl font-black text-slate-800 group-hover:text-purple-haze transition-colors line-clamp-1">
                          {listing.title}
                        </CardTitle>
                        <Badge variant="secondary" className="bg-purple-haze/10 text-purple-haze border-0 font-bold">
                          {listing.property_type}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="flex items-center text-slate-600 mb-3">
                        <MapPin className="h-4 w-4 mr-2 text-purple-haze" />
                        <span className="text-sm font-medium">{listing.location_area}, {listing.location_city}</span>
                      </div>
                      
                      {listing.description && (
                        <p className="text-slate-600 text-sm mb-4 line-clamp-2 font-medium">
                          {listing.description.length > 100 
                            ? listing.description.substring(0, 100) + "..." 
                            : listing.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4 text-sm text-slate-600">
                          <div className="flex items-center bg-purple-haze/10 px-2 py-1 rounded-lg">
                            <Bed className="h-4 w-4 mr-1 text-purple-haze" />
                            <span className="font-bold">{listing.bedrooms}</span>
                          </div>
                          <div className="flex items-center bg-electric-blue/10 px-2 py-1 rounded-lg">
                            <Bath className="h-4 w-4 mr-1 text-electric-blue" />
                            <span className="font-bold">{listing.bathrooms}</span>
                          </div>
                          {listing.parking && (
                            <div className="flex items-center bg-cyber-lime/10 px-2 py-1 rounded-lg">
                              <Car className="h-4 w-4 text-cyber-lime" />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-black hero-gradient">
                            ₹{listing.rent_amount.toLocaleString()}
                          </div>
                          <div className="text-sm text-slate-600 font-medium">per month</div>
                        </div>
                        <Button 
                          onClick={() => handleContact(listing)}
                          className="btn-primary h-10 px-4 font-bold"
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Connect
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <ContactModal 
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        listing={selectedListing}
      />
    </Layout>
  );
};

export default Browse;
