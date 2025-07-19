import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ProfileHeader } from "@/components/Profile/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Settings } from "lucide-react";
import { ProfileTabProfile } from "@/components/Profile/ProfileTabProfile";
import { ProfileTabListings } from "@/components/Profile/ProfileTabListings";
import { ProfileTabSettings } from "@/components/Profile/ProfileTabSettings";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    full_name: "",
    phone_number: "",
    city: "",
    bio: "",
    age: 0,
    profession: "",
    profile_picture_url: "",
  });

  const fetchProfile = async () => {
    if (!user?.id) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Profile fetch error:", error);
      toast.error("Failed to load profile: " + error.message);
      return;
    }

    if (data) {
      setProfileData({
        full_name: data.full_name || "",
        phone_number: data.phone_number || "",
        city: data.city || "",
        bio: data.bio || "",
        age: data.age || 0,
        profession: data.profession || "",
        profile_picture_url: data.profile_picture_url || "",
      });
    } else {
      // Profile doesn't exist yet, populate from auth metadata
      console.log("No profile found, using auth data defaults");
      setProfileData({
        full_name: user?.user_metadata?.full_name || "",
        phone_number: user?.user_metadata?.phone_number || "",
        city: "",
        bio: "",
        age: 0,
        profession: "",
        profile_picture_url: "",
      });
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user?.id]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updateData = {
        full_name: profileData.full_name,
        phone_number: profileData.phone_number,
        city: profileData.city,
        bio: profileData.bio,
        age: profileData.age ? parseInt(profileData.age.toString()) : null,
        profession: profileData.profession,
      };

      // Use upsert to handle case where profile might not exist
      const { error } = await supabase
        .from("profiles")
        .upsert({ 
          id: user?.id,
          email: user?.email,
          ...updateData 
        })
        .eq("id", user?.id);

      if (error) throw error;

      toast.success("Profile updated successfully!");
      // Refetch the profile to ensure UI is updated
      fetchProfile();
    } catch (error: any) {
      toast.error("Error updating profile: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-primary to-secondary p-1">
            <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-4xl font-bold text-primary">
              {profileData.full_name ? profileData.full_name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || "U"}
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{profileData.full_name || "Your Profile"}</h1>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Tabs defaultValue="profile" className="md:col-span-3">
            <div className="flex justify-center mb-8">
              <TabsList className="grid w-full max-w-md grid-cols-3 bg-card/50 border rounded-xl p-1">
                <TabsTrigger value="profile" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Profile
                </TabsTrigger>
                <TabsTrigger value="listings" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Listings
                </TabsTrigger>
                <TabsTrigger value="settings" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Settings
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="profile" className="animate-fade-in">
              <ProfileTabProfile
                profileData={profileData}
                setProfileData={setProfileData}
                handleUpdateProfile={handleUpdateProfile}
                isLoading={isLoading}
              />
            </TabsContent>

            <TabsContent value="listings" className="animate-fade-in">
              <ProfileTabListings />
            </TabsContent>

            <TabsContent value="settings" className="animate-fade-in">
              <ProfileTabSettings user={user || {}} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
