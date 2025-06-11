
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  User, 
  Home, 
  Settings, 
  Save,
  Plus
} from "lucide-react";
import { Layout } from "@/components/Layout";

const Profile = () => {
  const { user, profile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: profile?.full_name || '',
    phone_number: profile?.phone_number || '',
    city: profile?.city || '',
    role: profile?.role || 'flat_seeker'
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user?.id);

      if (error) throw error;
      
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error("Error updating profile: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-coral-400 via-pink-500 to-violet-500 bg-clip-text text-transparent">
              My Profile
            </h1>
            <p className="text-xl text-slate-600">
              Manage your account and preferences
            </p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-md border-0 rounded-2xl p-1 shadow-lg">
              <TabsTrigger value="profile" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-coral-400 data-[state=active]:to-violet-500 data-[state=active]:text-white">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="listings" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-coral-400 data-[state=active]:to-violet-500 data-[state=active]:text-white">
                <Home className="h-4 w-4 mr-2" />
                Listings
              </TabsTrigger>
              <TabsTrigger value="settings" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-coral-400 data-[state=active]:to-violet-500 data-[state=active]:text-white">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card className="bg-white/80 backdrop-blur-md border-0 rounded-3xl shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-slate-800">
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="full_name" className="text-slate-700 font-semibold">
                        Full Name
                      </Label>
                      <Input
                        id="full_name"
                        value={profileData.full_name}
                        onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                        className="h-12 border-2 border-slate-200 focus:border-coral-400 rounded-xl"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="phone_number" className="text-slate-700 font-semibold">
                        Phone Number
                      </Label>
                      <Input
                        id="phone_number"
                        value={profileData.phone_number}
                        onChange={(e) => setProfileData({ ...profileData, phone_number: e.target.value })}
                        className="h-12 border-2 border-slate-200 focus:border-coral-400 rounded-xl"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="city" className="text-slate-700 font-semibold">
                        City
                      </Label>
                      <Input
                        id="city"
                        value={profileData.city}
                        onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                        placeholder="Enter your city"
                        className="h-12 border-2 border-slate-200 focus:border-coral-400 rounded-xl"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="role" className="text-slate-700 font-semibold">
                        Role
                      </Label>
                      <Select 
                        value={profileData.role} 
                        onValueChange={(value: 'flat_seeker' | 'flat_owner') => 
                          setProfileData({ ...profileData, role: value })
                        }
                      >
                        <SelectTrigger className="h-12 border-2 border-slate-200 focus:border-coral-400 rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white/95 backdrop-blur-md border-2 border-slate-200 rounded-xl">
                          <SelectItem value="flat_seeker">🏠 Flat Seeker</SelectItem>
                          <SelectItem value="flat_owner">🔑 Flat Owner</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-full h-12 bg-gradient-to-r from-coral-400 to-violet-500 hover:from-coral-500 hover:to-violet-600 text-white rounded-xl font-semibold"
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Saving...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Save className="h-4 w-4" />
                          <span>Save Changes</span>
                        </div>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="listings">
              <Card className="bg-white/80 backdrop-blur-md border-0 rounded-3xl shadow-xl">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-2xl font-bold text-slate-800">
                      My Listings
                    </CardTitle>
                    {profile?.role === 'flat_owner' && (
                      <Button className="bg-gradient-to-r from-coral-400 to-violet-500 hover:from-coral-500 hover:to-violet-600 text-white rounded-xl">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Listing
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {profile?.role === 'flat_seeker' ? (
                    <div className="text-center py-12">
                      <Home className="h-16 w-16 mx-auto mb-4 text-slate-400" />
                      <h3 className="text-xl font-semibold text-slate-700 mb-2">
                        Switch to Flat Owner
                      </h3>
                      <p className="text-slate-600 mb-4">
                        Change your role to "Flat Owner" in the Profile tab to create listings.
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Home className="h-16 w-16 mx-auto mb-4 text-slate-400" />
                      <h3 className="text-xl font-semibold text-slate-700 mb-2">
                        No listings yet
                      </h3>
                      <p className="text-slate-600 mb-4">
                        Create your first listing to start finding flatmates.
                      </p>
                      <Button className="bg-gradient-to-r from-coral-400 to-violet-500 hover:from-coral-500 hover:to-violet-600 text-white rounded-xl">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Listing
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card className="bg-white/80 backdrop-blur-md border-0 rounded-3xl shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-slate-800">
                    Account Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div>
                        <h4 className="font-semibold text-slate-800">Email</h4>
                        <p className="text-slate-600">{user?.email}</p>
                      </div>
                      <Button variant="outline" className="border-2 border-slate-200 rounded-xl">
                        Change Email
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div>
                        <h4 className="font-semibold text-slate-800">Password</h4>
                        <p className="text-slate-600">••••••••</p>
                      </div>
                      <Button variant="outline" className="border-2 border-slate-200 rounded-xl">
                        Change Password
                      </Button>
                    </div>

                    <div className="pt-6 border-t border-slate-200">
                      <Button variant="destructive" className="w-full rounded-xl">
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
