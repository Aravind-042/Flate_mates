
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ProfileHeader } from "@/components/Profile/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Settings } from "lucide-react";
import { ProfileTabProfile } from "@/components/Profile/ProfileTabProfile";
import { ProfileTabListings } from "@/components/Profile/ProfileTabListings";
import { ProfileTabSettings } from "@/components/Profile/ProfileTabSettings";

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
    <div className="min-h-screen py-4 px-2 sm:px-4">
      <div className="max-w-4xl mx-auto">
        {/* Animated Profile Header with Avatar */}
        <ProfileHeader
          fullName={profile?.full_name || ""}
          email={user?.email || ""}
          avatarUrl={profile?.profile_picture_url}
        />

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/90 backdrop-blur-md border-0 rounded-2xl p-1 shadow-lg">
            <TabsTrigger value="profile" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-coral-600 data-[state=active]:to-violet-600 data-[state=active]:text-white data-[state=inactive]:text-slate-500 font-semibold">
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-white text-coral-400 flex items-center justify-center font-bold">P</span>
                Profile
              </span>
            </TabsTrigger>
            <TabsTrigger value="listings" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-coral-600 data-[state=active]:to-violet-600 data-[state=active]:text-white data-[state=inactive]:text-slate-500 font-semibold">
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-white text-coral-400 flex items-center justify-center"><Home className="h-4 w-4" /></span>
                Listings
              </span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-coral-600 data-[state=active]:to-violet-600 data-[state=active]:text-white data-[state=inactive]:text-slate-500 font-semibold">
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-white text-coral-400 flex items-center justify-center"><Settings className="h-4 w-4" /></span>
                Settings
              </span>
            </TabsTrigger>
          </TabsList>

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
  );
};

export default Profile;
