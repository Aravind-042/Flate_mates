
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
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="border-0 bg-gradient-to-br from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 transition-all duration-300 cursor-pointer">
        <CardContent className="p-8 text-center">
          <div className="text-4xl font-bold text-primary mb-2">0</div>
          <div className="text-muted-foreground font-medium">Active Listings</div>
        </CardContent>
      </Card>
      
      <Card className="border-0 bg-gradient-to-br from-secondary/10 to-accent/10 hover:from-secondary/20 hover:to-accent/20 transition-all duration-300 cursor-pointer">
        <CardContent className="p-8 text-center">
          <div className="text-4xl font-bold text-secondary mb-2">0</div>
          <div className="text-muted-foreground font-medium">Saved Favorites</div>
        </CardContent>
      </Card>
      
      <Card className="border-0 bg-gradient-to-br from-accent/10 to-primary/10 hover:from-accent/20 hover:to-primary/20 transition-all duration-300 cursor-pointer">
        <CardContent className="p-8 text-center">
          <div className="text-4xl font-bold text-accent mb-2">0</div>
          <div className="text-muted-foreground font-medium">Reviews</div>
        </CardContent>
      </Card>
    </div>
  </>
);

