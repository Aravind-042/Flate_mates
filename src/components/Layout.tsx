
import React from "react";
import { NavBarDemo } from "./ui/tubelight-navbar-demo";

// Main layout that wraps all primary pages with navigation and scrolling.
// Now uses a monochromatic blue gradient background that spans the whole viewport.
export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-100 via-blue-300 to-blue-500 overflow-auto">
      <NavBarDemo />
      <main className="flex-1 w-full mx-auto p-0">
        {children}
      </main>
    </div>
  );
};
