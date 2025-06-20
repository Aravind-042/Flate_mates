
import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-300 to-pink-300 relative flex items-center justify-center p-4">
      {/* Main Auth Card */}
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-md shadow-2xl border-0 rounded-3xl">
        <CardContent className="p-8">
          {children}
        </CardContent>
      </Card>
    </div>
  );
};
