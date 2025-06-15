
import React from "react";
import { LogIn } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export function FloatingSignInButton() {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide on auth page (optional, or could comment out for global usage)
  if (location.pathname === "/auth") return null;

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
