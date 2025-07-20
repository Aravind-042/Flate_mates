
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileHeader } from "@/components/Profile/ProfileHeader";
import { ProfileTabProfile } from "@/components/Profile/ProfileTabProfile";
import { ProfileTabListings } from "@/components/Profile/ProfileTabListings";
import { ProfileTabFavorites } from "@/components/Profile/ProfileTabFavorites";
import { ProfileTabSettings } from "@/components/Profile/ProfileTabSettings";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/auth/useProfile";
import { useFavoritesStore } from "@/store/favoritesStore";

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const { profile, updateProfile, loading: profileLoading } = useProfile();
  const { loadFavorites } = useFavoritesStore();
  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    city: "",
    profession: "",
    bio: "",
    age: "",
  });

  // Load user favorites when component mounts
  useEffect(() => {
    if (user?.id) {
      loadFavorites(user.id);
    }
  }, [user?.id, loadFavorites]);

  useEffect(() => {
    if (profile) {
      setProfileData({
        fullName: profile.full_name || "",
        email: profile.email || "",
        phoneNumber: profile.phone_number || "",
        city: profile.city || "",
        profession: profile.profession || "",
        bio: profile.bio || "",
        age: profile.age?.toString() || "",
      });
    }
  }, [profile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      await updateProfile({
        full_name: profileData.fullName,
        phone_number: profileData.phoneNumber,
        city: profileData.city,
        profession: profileData.profession,
        bio: profileData.bio,
        age: profileData.age ? parseInt(profileData.age) : null,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const isLoading = authLoading || profileLoading;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <ProfileHeader 
          fullName={profile?.full_name || null}
          email={profile?.email || null}
          avatarUrl={profile?.profile_picture_url || null}
        />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
          <TabsList className="grid w-full grid-cols-4 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-2xl p-1 shadow-lg">
            <TabsTrigger 
              value="profile" 
              className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-coral-400 data-[state=active]:to-violet-500 data-[state=active]:text-white font-semibold"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger 
              value="listings" 
              className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-coral-400 data-[state=active]:to-violet-500 data-[state=active]:text-white font-semibold"
            >
              My Listings
            </TabsTrigger>
            <TabsTrigger 
              value="favorites" 
              className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-coral-400 data-[state=active]:to-violet-500 data-[state=active]:text-white font-semibold"
            >
              Favorites
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-coral-400 data-[state=active]:to-violet-500 data-[state=active]:text-white font-semibold"
            >
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <ProfileTabProfile
              profileData={profileData}
              setProfileData={setProfileData}
              handleUpdateProfile={handleUpdateProfile}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="listings" className="mt-6">
            <ProfileTabListings />
          </TabsContent>

          <TabsContent value="favorites" className="mt-6">
            <ProfileTabFavorites />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <ProfileTabSettings user={{ email: user?.email || null }} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
