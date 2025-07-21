
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
    <div className="min-h-screen bg-gray-50">
      {/* Back to Home Button */}
      <div className="px-6 py-4">
        <button 
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            {profile?.profile_picture_url ? (
              <img
                src={profile.profile_picture_url}
                className="w-24 h-24 rounded-full object-cover border-4 border-gradient-to-r from-blue-400 to-orange-400"
                alt="Profile"
              />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-orange-400 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <span className="text-2xl font-bold text-white">
                  {profile?.full_name?.charAt(0)?.toUpperCase() || 'A'}
                </span>
              </div>
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {profile?.full_name || 'Your Name'}
          </h1>
          <p className="text-gray-600">{profile?.email}</p>
        </div>
        
        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <div className="flex justify-center mb-6">
            <div className="flex bg-gray-100 rounded-full p-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === 'profile'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('listings')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === 'listings'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Listings
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === 'favorites'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Favorites
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === 'settings'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Settings
              </button>
            </div>
          </div>

          <TabsContent value="profile" className="animate-fade-in">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <ProfileTabProfile
                profileData={profileData}
                setProfileData={setProfileData}
                handleUpdateProfile={handleUpdateProfile}
                isLoading={isLoading}
              />
            </div>
          </TabsContent>

          <TabsContent value="listings" className="animate-fade-in">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <ProfileTabListings />
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="animate-fade-in">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <ProfileTabFavorites />
            </div>
          </TabsContent>

          <TabsContent value="settings" className="animate-fade-in">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <ProfileTabSettings user={{ email: user?.email || null }} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
