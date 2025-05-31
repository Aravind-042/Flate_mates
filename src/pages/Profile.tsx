
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Phone, Mail, MapPin, Edit, Settings, Home, Heart } from "lucide-react";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 9876543210",
    city: "Bangalore",
    profession: "Software Engineer",
    bio: "Looking for a clean and peaceful flat in a good neighborhood. Non-smoker, vegetarian."
  });

  const myListings = [
    {
      id: 1,
      title: "Modern 2BHK in Koramangala",
      status: "Active",
      views: 245,
      interested: 12
    },
    {
      id: 2,
      title: "Cozy 1BHK near Metro",
      status: "Rented",
      views: 180,
      interested: 8
    }
  ];

  const savedFlats = [
    {
      id: 1,
      title: "Spacious 3BHK with Garden",
      location: "Andheri, Mumbai",
      rent: 45000
    },
    {
      id: 2,
      title: "Modern Studio Apartment",
      location: "HSR Layout, Bangalore",
      rent: 22000
    }
  ];

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
              <a href="/browse" className="text-gray-600 hover:text-blue-600 transition-colors">Browse Flats</a>
              <a href="/" className="text-gray-600 hover:text-blue-600 transition-colors">List Your Flat</a>
              <a href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">About</a>
              <a href="/profile" className="text-blue-600 font-medium">Profile</a>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <CardTitle className="flex items-center justify-center space-x-2">
                  <span>{profile.name}</span>
                  <Button 
                    size="icon" 
                    variant="ghost"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </CardTitle>
                <Badge variant="secondary">{profile.profession}</Badge>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{profile.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{profile.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{profile.city}</span>
                </div>
                
                <div className="pt-4">
                  <h4 className="font-medium mb-2">About Me</h4>
                  <p className="text-sm text-gray-600">{profile.bio}</p>
                </div>
                
                <Button className="w-full" variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Account Settings
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="listings" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="listings" className="flex items-center space-x-2">
                  <Home className="h-4 w-4" />
                  <span>My Listings</span>
                </TabsTrigger>
                <TabsTrigger value="saved" className="flex items-center space-x-2">
                  <Heart className="h-4 w-4" />
                  <span>Saved Flats</span>
                </TabsTrigger>
                <TabsTrigger value="edit" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Edit Profile</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="listings" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">My Flat Listings</h3>
                  <Button>
                    <a href="/">Add New Listing</a>
                  </Button>
                </div>
                
                {myListings.map((listing) => (
                  <Card key={listing.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{listing.title}</h4>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                            <span>{listing.views} views</span>
                            <span>{listing.interested} interested</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge 
                            variant={listing.status === 'Active' ? 'default' : 'secondary'}
                          >
                            {listing.status}
                          </Badge>
                          <Button variant="outline" size="sm">Edit</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="saved" className="space-y-4">
                <h3 className="text-xl font-semibold">Saved Flats</h3>
                
                {savedFlats.map((flat) => (
                  <Card key={flat.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{flat.title}</h4>
                          <p className="text-sm text-gray-600">{flat.location}</p>
                          <p className="text-lg font-bold text-blue-600 mt-1">
                            ₹{flat.rent.toLocaleString()}/month
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">View Details</Button>
                          <Button variant="outline" size="sm">
                            <Heart className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="edit" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Edit Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Full Name</label>
                        <Input 
                          value={profile.name}
                          onChange={(e) => setProfile({...profile, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <Input 
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({...profile, email: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Phone</label>
                        <Input 
                          value={profile.phone}
                          onChange={(e) => setProfile({...profile, phone: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">City</label>
                        <Input 
                          value={profile.city}
                          onChange={(e) => setProfile({...profile, city: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Profession</label>
                        <Input 
                          value={profile.profession}
                          onChange={(e) => setProfile({...profile, profession: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Bio</label>
                      <textarea 
                        className="w-full p-3 border border-gray-300 rounded-md"
                        rows={4}
                        value={profile.bio}
                        onChange={(e) => setProfile({...profile, bio: e.target.value})}
                      />
                    </div>
                    
                    <div className="flex space-x-4">
                      <Button className="bg-gradient-to-r from-blue-600 to-orange-500">
                        Save Changes
                      </Button>
                      <Button variant="outline">Cancel</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
