
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Search, 
  Menu, 
  X, 
  Sparkles,
  Heart,
  MessageCircle
} from "lucide-react";

export const Navigation = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/browse", label: "Explore", icon: Search },
    { href: "/matches", label: "Matches", icon: Heart },
    { href: "/messages", label: "Chat", icon: MessageCircle },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="glass border-b border-white/20 sticky top-0 z-50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-haze to-neon-pink blur-lg opacity-40 rounded-2xl"></div>
              <div className="relative bg-gradient-to-r from-purple-haze to-neon-pink p-2 rounded-2xl shadow-xl">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
            </div>
            <Link to="/" className="text-2xl font-black hero-gradient">
              FlatVibes
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-2xl text-sm font-bold transition-all duration-200 ${
                    isActive(item.href)
                      ? "bg-gradient-to-r from-purple-haze to-neon-pink text-white shadow-lg elevation-2"
                      : "text-slate-600 hover:text-purple-haze hover:bg-white/60"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            
            <Button className="btn-primary ml-4 h-10 px-6 text-sm font-bold">
              Join Now
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-600 hover:text-purple-haze"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 glass rounded-2xl mt-2 border border-white/20 shadow-xl backdrop-blur-xl">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-xl text-base font-bold transition-all duration-200 ${
                      isActive(item.href)
                        ? "bg-gradient-to-r from-purple-haze to-neon-pink text-white shadow-lg"
                        : "text-slate-600 hover:text-purple-haze hover:bg-white/40"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              <Button className="btn-primary w-full justify-center mt-2 h-12 font-bold">
                Join Now
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
