
import React from "react";
import { NavBarDemo } from "./ui/tubelight-navbar-demo";
import { Boxes } from "@/components/ui/background-boxes";

// Main layout that wraps all primary pages with navigation and scrolling.
// Ensures content is always vertically scrollable and fills min screen height.
export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-cool-gray overflow-auto relative">
      {/* Full-page animated background */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none select-none">
        <Boxes className="opacity-80" />
      </div>

      {/* Main app content sits above background */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <NavBarDemo />
        <main className="flex-1 w-full mx-auto p-0">{children}</main>
      </div>
    </div>
  );
};
