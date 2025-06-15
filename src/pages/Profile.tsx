import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Home, Settings } from "lucide-react";
import { Layout } from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ProfileHeader } from "@/components/Profile/ProfileHeader";
import { ProfileDetailsForm } from "@/components/Profile/ProfileDetailsForm";

const Profile = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    full_name: profile?.full_name || '',
    phone_number: profile?.phone_number || '',
    city: profile?.city || '',
    bio: profile?.bio || '',
    age: profile?.age || '',
    profession: profile?.profession || ''
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updateData = {
        ...profileData,
        age: profileData.age ? parseInt(profileData.age.toString()) : null
      };

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
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
      <div className="min-h-screen py-4 px-2 sm:px-4 bg-gradient-to-br from-white via-coral-50 to-violet-50">
        <div className="max-w-4xl mx-auto">
          {/* Animated Profile Header with Avatar */}
          <ProfileHeader
            fullName={profile?.full_name || ""}
            email={user?.email || ""}
            avatarUrl={profile?.profile_picture_url}
          />

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-md border-0 rounded-2xl p-1 shadow-lg">
              <TabsTrigger value="profile" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-coral-400 data-[state=active]:to-violet-500 data-[state=active]:text-white">
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-white text-coral-400 flex items-center justify-center"><span className="material-icons-outlined"></span></span>
                  Profile
                </span>
              </TabsTrigger>
              <TabsTrigger value="listings" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-coral-400 data-[state=active]:to-violet-500 data-[state=active]:text-white">
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-white text-coral-400 flex items-center justify-center"><Home className="h-4 w-4" /></span>
                  Listings
                </span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-coral-400 data-[state=active]:to-violet-500 data-[state=active]:text-white">
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-white text-coral-400 flex items-center justify-center"><Settings className="h-4 w-4" /></span>
                  Settings
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="animate-fade-in">
              <Card className="bg-white/90 shadow-2xl border-0 rounded-3xl mb-6">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-slate-800">Edit Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProfileDetailsForm
                    profileData={profileData}
                    setProfileData={setProfileData}
                    handleUpdateProfile={handleUpdateProfile}
                    isLoading={isLoading}
                  />
                </CardContent>
              </Card>
              {/* Optional: Quick stats/summary cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gradient-to-br from-coral-400/90 to-violet-500/90 text-white p-6 rounded-2xl shadow-lg flex flex-col justify-center items-center transition-transform hover:scale-105">
                  <span className="text-3xl font-bold">0</span>
                  <span className="mt-2 font-medium">Listings</span>
                </div>
                <div className="bg-gradient-to-br from-violet-400/90 to-coral-500/80 text-white p-6 rounded-2xl shadow-lg flex flex-col justify-center items-center transition-transform hover:scale-105">
                  <span className="text-3xl font-bold">0</span>
                  <span className="mt-2 font-medium">Favorites</span>
                </div>
                <div className="bg-gradient-to-br from-coral-400/80 to-pink-400/70 text-white p-6 rounded-2xl shadow-lg flex flex-col justify-center items-center transition-transform hover:scale-105">
                  <span className="text-3xl font-bold">0</span>
                  <span className="mt-2 font-medium">Reviews</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="listings" className="animate-fade-in">
              <Card className="bg-white/90 shadow-2xl border-0 rounded-3xl">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-2xl font-bold text-slate-800">
                      My Listings
                    </CardTitle>
                    <Button
                      onClick={() => navigate('/create-listing')}
                      className="bg-gradient-to-r from-coral-400 to-violet-500 hover:from-coral-500 hover:to-violet-600 text-white rounded-xl"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Listing
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Home className="h-16 w-16 mx-auto mb-4 text-slate-400" />
                    <h3 className="text-xl font-semibold text-slate-700 mb-2">
                      No listings yet
                    </h3>
                    <p className="text-slate-600 mb-4">
                      Create your first listing to start finding flatmates.
                    </p>
                    <Button
                      onClick={() => navigate('/create-listing')}
                      className="bg-gradient-to-r from-coral-400 to-violet-500 hover:from-coral-500 hover:to-violet-600 text-white rounded-xl"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Listing
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="animate-fade-in">
              <Card className="bg-white/90 shadow-2xl border-0 rounded-3xl">
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
