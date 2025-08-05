import React from "react";
import { User } from "lucide-react";
import { Profile } from "@/hooks/auth/types";

interface OptimizedProfileHeaderProps {
  profile: Profile | null;
  isLoading: boolean;
}

export const OptimizedProfileHeader: React.FC<OptimizedProfileHeaderProps> = ({ 
  profile, 
  isLoading 
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center mb-6 sm:mb-8">
        <div className="relative mb-4">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-300 rounded-full animate-pulse"></div>
        </div>
        <div className="h-6 bg-gray-300 rounded w-32 mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mb-6 sm:mb-8">
      <div className="relative mb-4">
        {profile?.profile_picture_url ? (
          <img
            src={profile.profile_picture_url}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-gradient-to-r from-blue-400 to-orange-400 shadow-lg"
            alt="Profile"
          />
        ) : (
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-blue-400 to-orange-400 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
            {profile?.full_name ? (
              <span className="text-xl sm:text-2xl font-bold text-white">
                {profile.full_name.charAt(0).toUpperCase()}
              </span>
            ) : (
              <User className="text-xl sm:text-2xl text-white" />
            )}
          </div>
        )}
      </div>
      
      <div className="text-center">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
          {profile?.full_name || 'Your Name'}
        </h1>
        <p className="text-gray-600 text-sm sm:text-base mb-1">{profile?.email}</p>
        {profile?.city && (
          <p className="text-gray-500 text-sm">{profile.city}</p>
        )}
        {profile?.profession && (
          <p className="text-gray-500 text-sm">{profile.profession}</p>
        )}
      </div>
    </div>
  );
};