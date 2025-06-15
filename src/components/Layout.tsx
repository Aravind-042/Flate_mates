
import React from "react";
import { NavBarDemo } from "./ui/tubelight-navbar-demo";
import { AuroraBackground } from "@/components/ui/aurora-background";

// Main layout that wraps all primary pages with navigation and scrolling.
// Ensures content is always vertically scrollable and fills min screen height.
export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuroraBackground className="min-h-screen flex flex-col overflow-auto relative">
      <div className="relative z-10 flex flex-col min-h-screen w-full">
        <NavBarDemo />
        <main className="flex-1 w-full mx-auto p-0">{children}</main>
      </div>
    </AuroraBackground>
  );
};
