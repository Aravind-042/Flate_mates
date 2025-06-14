
import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Home } from "lucide-react";
import { AuthFeatures } from "./AuthFeatures";

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    // Remove 'overflow-hidden' to permit scrolling if content is taller than the viewport.
    <div className="min-h-screen bg-cool-gray relative">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-deep-blue to-orange rounded-full blur-3xl opacity-20 animate-bounce"></div>
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-br from-orange to-emerald rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-gradient-to-br from-emerald to-deep-blue rounded-full blur-3xl opacity-20 animate-bounce"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-orange to-deep-blue rounded-full blur-3xl opacity-15 animate-pulse"></div>
      </div>
      
      {/* Spill over content when needed, allow scroll on long forms */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-2xl mx-auto">
          {/* Brand Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-deep-blue to-orange blur-lg opacity-40 rounded-3xl"></div>
                <div className="relative bg-gradient-to-r from-deep-blue to-orange p-4 rounded-3xl shadow-2xl">
                  <Home className="h-10 w-10 text-white" />
                </div>
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-deep-blue via-orange to-emerald bg-clip-text text-transparent">
                FlatMates
              </span>
            </div>
            
            <AuthFeatures />
          </div>

          {/* Let Card grow beyond viewport; handle scrolling at the window level */}
          <Card className="bg-white/90 backdrop-blur-2xl shadow-2xl border-0 rounded-3xl overflow-visible mx-auto">
            <CardContent className="p-10">
              {children}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

