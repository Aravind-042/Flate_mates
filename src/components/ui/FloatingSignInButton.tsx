
import React from "react";
import { LogIn, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

export function FloatingSignInButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();

  // DEBUG log every render to help catch weird states!
  console.log(
    "[FloatingSignInButton] location:", location.pathname,
    "loading:", loading,
    "user:", user,
    "user?.id:", user?.id
  );

  // Hide on /auth page
  if (location.pathname === "/auth") return null;
  // Don't show anything until auth state is known (prevents flicker)
  if (loading) return null;

  // Defensive: Don't show if no user or user id
  if (user && user.id) {
    return (
      <button
        onClick={() => navigate("/profile")}
        className={cn(
          "fixed top-4 right-4 z-[100] flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-all text-base font-semibold",
          "sm:top-6 sm:right-8"
        )}
        aria-label="View profile"
      >
        <User size={20} className="mr-1" />
        Profile
      </button>
    );
  }

  // Not authenticated: show floating "Sign In" button (same as before)
  return (
    <button
      onClick={() => navigate("/auth")}
      className={cn(
        "fixed top-4 right-4 z-[100] flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-all text-base font-semibold",
        "sm:top-6 sm:right-8"
      )}
      aria-label="Sign in"
    >
      <LogIn size={20} className="mr-1" />
      Sign In
    </button>
  );
}
