import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative flex items-center justify-center p-4">
      {/* Floating background elements for visual interest */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-orange-400/20 to-pink-400/20 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-1/4 w-28 h-28 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-xl animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Main Auth Card - Centered and prominent */}
      <div className="card-primary w-full max-w-md relative z-10 mx-auto">
        <div className="p-8">
          {children}
        </div>
      </div>

      {/* Subtle branding at bottom */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center z-10">
        <p className="text-sm text-slate-500">
          Secure authentication powered by{" "}
          <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            FlatMates
          </span>
        </p>
      </div>
    </div>
  );
};