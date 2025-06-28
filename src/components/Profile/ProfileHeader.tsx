import React from "react";
import { User } from "lucide-react";

interface ProfileHeaderProps {
  fullName: string | null;
  email: string | null;
  avatarUrl?: string | null;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  fullName,
  email,
  avatarUrl,
}) => {
  return (
    <div className="w-full flex flex-col md:flex-row items-center md:items-end md:space-x-6 bg-gradient-to-r from-coral-400 via-pink-500 to-violet-500 rounded-3xl shadow-xl mb-6 px-6 py-8 animate-fade-in">
      <div className="relative group">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover transition-transform group-hover:scale-105"
            alt="Profile"
          />
        ) : (
          <div className="w-28 h-28 bg-white/80 flex items-center justify-center rounded-full border-4 border-white shadow-lg">
            <User className="w-14 h-14 text-coral-400" />
          </div>
        )}
        {/* Camera/Icon overlay for future upload */}
        <div className="absolute inset-0 rounded-full flex items-end justify-center opacity-0 group-hover:opacity-80 transition pointer-events-none">
          {/* Potential camera/edit button here */}
        </div>
      </div>
      <div className="mt-4 md:mt-0 text-center md:text-left">
        <h2 className="text-heading-1 font-secondary font-bold text-white drop-shadow">
          {fullName || "Your Name"}
        </h2>
        <p className="text-body-large font-primary text-white/80">{email}</p>
      </div>
    </div>
  );
};