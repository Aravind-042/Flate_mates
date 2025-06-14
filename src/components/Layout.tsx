
import React from "react";
import { Navigation } from "./Navigation";

// Main layout that wraps all primary pages with navigation and scrolling.
// Ensures content is always vertically scrollable and fills min screen height.
export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-cool-gray overflow-auto">
      <Navigation />
      <main className="flex-1 w-full mx-auto p-0">
        {children}
      </main>
    </div>
  );
};
