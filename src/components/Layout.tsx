
import React from "react";
import { NavBarDemo } from "./ui/tubelight-navbar-demo";
import { Boxes } from "@/components/ui/background-boxes";
import { Outlet, useLocation } from "react-router-dom";

export const Layout = () => {
  const location = useLocation();
  const isProfilePage = location.pathname === '/profile';

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 overflow-auto relative">
      {/* Subtle animated background with heavy overlay */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none select-none">
        <Boxes className="opacity-30" />
        {/* Translucent white overlay to fade the background */}
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>
      </div>

      {/* Main app content sits above background */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {!isProfilePage && <NavBarDemo />}
        <main className="flex-1 w-full mx-auto p-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
