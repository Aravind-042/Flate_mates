
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileDetailsForm } from "./ProfileDetailsForm";
import { CreditsDisplay } from "@/components/Credits/CreditsDisplay";
import { ReferralSystem } from "@/components/Credits/ReferralSystem";
import { useCredits } from "@/hooks/useCredits";

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
}) => {
  const { credits } = useCredits();

  return (
    <>
      {/* Credits Display */}
      <div className="mb-6">
        <CreditsDisplay />
      </div>

      <Card className="bg-card/90 backdrop-blur-sm border shadow-lg rounded-2xl mb-8">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-foreground">Edit Profile</CardTitle>
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
    </>
  );
};

