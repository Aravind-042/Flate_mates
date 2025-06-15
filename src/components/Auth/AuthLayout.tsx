
import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Home } from "lucide-react";
import { AuthFeatures } from "./AuthFeatures";

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-cool-gray relative">
      {/* Enhanced Background Pattern - Responsive sizes */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute top-0 left-0 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-to-br from-deep-blue to-orange rounded-full blur-3xl opacity-20 animate-bounce"></div>
        <div className="absolute top-1/2 right-0 w-40 h-40 sm:w-60 sm:h-60 lg:w-80 lg:h-80 bg-gradient-to-br from-orange to-emerald rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-1/2 w-36 h-36 sm:w-54 sm:h-54 lg:w-72 lg:h-72 bg-gradient-to-br from-emerald to-deep-blue rounded-full blur-3xl opacity-20 animate-bounce"></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-orange to-deep-blue rounded-full blur-3xl opacity-15 animate-pulse"></div>
      </div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 sm:p-6">
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-2xl mx-auto">
          {/* Brand Header - Responsive spacing and sizing */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex items-center justify-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-deep-blue to-orange blur-lg opacity-40 rounded-3xl"></div>
                <div className="relative bg-gradient-to-r from-deep-blue to-orange p-3 sm:p-4 rounded-3xl shadow-2xl">
                  <Home className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-white" />
                </div>
              </div>
              <span className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-deep-blue via-orange to-emerald bg-clip-text text-transparent">
                FlatMates
              </span>
            </div>
            
            <div className="hidden sm:block">
              <AuthFeatures />
            </div>
          </div>

          {/* Auth Card - Responsive padding and sizing */}
          <Card className="bg-white/90 backdrop-blur-2xl shadow-2xl border-0 rounded-3xl overflow-visible mx-auto">
            <CardContent className="p-6 sm:p-8 lg:p-10">
              {children}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
