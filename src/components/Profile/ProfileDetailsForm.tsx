
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";

export interface ProfileDetailsFormProps {
  profileData: {
    fullName: string;
    email: string;
    phoneNumber: string;
    city: string;
    bio: string;
    age: string;
    profession: string;
  };
  setProfileData: React.Dispatch<React.SetStateAction<any>>;
  handleUpdateProfile: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const ProfileDetailsForm: React.FC<ProfileDetailsFormProps> = ({
  profileData,
  setProfileData,
  handleUpdateProfile,
  isLoading,
}) => {
  return (
    <form onSubmit={handleUpdateProfile} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label htmlFor="full_name" className="text-slate-700 font-semibold">
            Full Name
          </Label>
          <Input
            id="full_name"
            value={profileData.fullName}
            onChange={e => setProfileData(d => ({ ...d, fullName: e.target.value }))}
            className="h-12 border-2 border-slate-200 focus:border-coral-400 rounded-xl"
          />
        </div>
        <div className="space-y-3">
          <Label htmlFor="phone_number" className="text-slate-700 font-semibold">
            Phone Number
          </Label>
          <Input
            id="phone_number"
            value={profileData.phoneNumber}
            onChange={e => setProfileData(d => ({ ...d, phoneNumber: e.target.value }))}
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
            onChange={e => setProfileData(d => ({ ...d, city: e.target.value }))}
            placeholder="Enter your city"
            className="h-12 border-2 border-slate-200 focus:border-coral-400 rounded-xl"
          />
        </div>
        <div className="space-y-3">
          <Label htmlFor="age" className="text-slate-700 font-semibold">
            Age
          </Label>
          <Input
            id="age"
            type="number"
            min="18"
            max="100"
            value={profileData.age}
            onChange={e => setProfileData(d => ({ ...d, age: e.target.value }))}
            placeholder="Enter your age"
            className="h-12 border-2 border-slate-200 focus:border-coral-400 rounded-xl"
          />
        </div>
        <div className="space-y-3 md:col-span-2">
          <Label htmlFor="profession" className="text-slate-700 font-semibold">
            Profession
          </Label>
          <Input
            id="profession"
            value={profileData.profession}
            onChange={e => setProfileData(d => ({ ...d, profession: e.target.value }))}
            placeholder="Enter your profession"
            className="h-12 border-2 border-slate-200 focus:border-coral-400 rounded-xl"
          />
        </div>
      </div>
      <div className="space-y-3">
        <Label htmlFor="bio" className="text-slate-700 font-semibold">
          Bio
        </Label>
        <Textarea
          id="bio"
          value={profileData.bio}
          onChange={e => setProfileData(d => ({ ...d, bio: e.target.value }))}
          placeholder="Tell us about yourself..."
          className="border-2 border-slate-200 focus:border-coral-400 rounded-xl resize-none"
          rows={4}
        />
      </div>
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 bg-gradient-to-r from-coral-400 to-violet-500 hover:from-coral-500 hover:to-violet-600 text-white rounded-xl font-semibold transition-all duration-200"
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
  );
};
