
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileDetailsForm } from "./ProfileDetailsForm";

interface ProfileTabProfileProps {
  profileData: any;
  setProfileData: React.Dispatch<React.SetStateAction<any>>;
  handleUpdateProfile: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const ProfileTabProfile: React.FC<ProfileTabProfileProps> = ({
  profileData,
  setProfileData,
  handleUpdateProfile,
  isLoading,
}) => (
  <>
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
  </>
);

