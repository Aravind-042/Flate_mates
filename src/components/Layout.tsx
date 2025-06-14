
import { Navigation } from "./Navigation";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-coral-50 via-pink-50 to-violet-100">
      <Navigation />
      <main className="relative z-10">
        {children}
      </main>
    </div>
  );
};
