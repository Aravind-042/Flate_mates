
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Bed, Bath, Car, Wifi, Heart, Share } from "lucide-react";

const Browse = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [priceRange, setPriceRange] = useState("");

  // Mock data for demonstration
  const flatListings = [
    {
      id: 1,
      title: "Modern 2BHK in Koramangala",
      location: { city: "Bangalore", area: "Koramangala" },
      rent: { amount: 25000, deposit: 50000 },
      property: { bedrooms: 2, bathrooms: 2, furnished: true },
      amenities: ["wifi", "parking", "gym"],
      images: ["/placeholder.svg"],
      preferences: { gender: "Any" }
    },
    {
      id: 2,
      title: "Cozy 1BHK near IT Hub",
      location: { city: "Bangalore", area: "Electronic City" },
      rent: { amount: 18000, deposit: 36000 },
      property: { bedrooms: 1, bathrooms: 1, furnished: false },
      amenities: ["wifi", "security"],
      images: ["/placeholder.svg"],
      preferences: { gender: "Female" }
    },
    {
      id: 3,
      title: "Spacious 3BHK with Garden",
      location: { city: "Mumbai", area: "Andheri" },
      rent: { amount: 45000, deposit: 90000 },
      property: { bedrooms: 3, bathrooms: 2, furnished: true },
      amenities: ["wifi", "parking", "garden", "security"],
      images: ["/placeholder.svg"],
      preferences: { gender: "Any" }
    }
  ];

  const filteredListings = flatListings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.location.area.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = !selectedCity || listing.location.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-orange-500 p-2 rounded-lg">
                <div className="h-6 w-6 bg-white rounded"></div>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                FlatMates
              </h1>
            </a>
            <nav className="hidden md:flex space-x-6">
              <a href="/browse" className="text-blue-600 font-medium">Browse Flats</a>
              <a href="/" className="text-gray-600 hover:text-blue-600 transition-colors">List Your Flat</a>
              <a href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">About</a>
              <a href="/profile" className="text-gray-600 hover:text-blue-600 transition-colors">Profile</a>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Find Your Perfect Flat</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by area or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger>
                <SelectValue placeholder="Select City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Bangalore">Bangalore</SelectItem>
                <SelectItem value="Mumbai">Mumbai</SelectItem>
                <SelectItem value="Delhi">Delhi</SelectItem>
                <SelectItem value="Pune">Pune</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-20000">₹0 - ₹20,000</SelectItem>
                <SelectItem value="20000-40000">₹20,000 - ₹40,000</SelectItem>
                <SelectItem value="40000+">₹40,000+</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-gradient-to-r from-blue-600 to-orange-500">
              Search Flats
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">
            {filteredListings.length} flats found
          </h3>
          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Flat Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <Card key={listing.id} className="hover:shadow-xl transition-shadow duration-300">
              <div className="relative">
                <img 
                  src={listing.images[0]} 
                  alt={listing.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Button size="icon" variant="secondary" className="bg-white/80 hover:bg-white">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="secondary" className="bg-white/80 hover:bg-white">
                    <Share className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{listing.title}</CardTitle>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{listing.location.area}, {listing.location.city}</span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-bold text-blue-600">
                      ₹{listing.rent.amount.toLocaleString()}
                    </span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  <Badge variant="outline">
                    {listing.preferences.gender} Only
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Bed className="h-4 w-4 mr-1" />
                    <span>{listing.property.bedrooms} BHK</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-4 w-4 mr-1" />
                    <span>{listing.property.bathrooms} Bath</span>
                  </div>
                  {listing.amenities.includes('parking') && (
                    <Car className="h-4 w-4" />
                  )}
                  {listing.amenities.includes('wifi') && (
                    <Wifi className="h-4 w-4" />
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {listing.amenities.slice(0, 3).map((amenity) => (
                    <Badge key={amenity} variant="secondary" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                  {listing.amenities.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{listing.amenities.length - 3} more
                    </Badge>
                  )}
                </div>
                
                <Button className="w-full bg-gradient-to-r from-blue-600 to-orange-500">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Browse;
