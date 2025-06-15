
import { useState } from "react";
import { Home, Search, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const HeroSection = ({ searchQuery, setSearchQuery }: HeroSectionProps) => {
  return (
    <section className="relative py-8 sm:py-12 lg:py-16 px-4 text-center">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4 sm:mb-6">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-deep-blue to-orange blur-2xl opacity-30 rounded-full animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-deep-blue to-orange p-3 sm:p-4 rounded-3xl shadow-2xl">
              <Home className="h-8 w-8 sm:h-12 sm:w-12 text-white" />
            </div>
          </div>
        </div>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-deep-blue via-orange to-emerald bg-clip-text text-transparent leading-tight">
          Find Your Perfect
          <span className="block">Flatmate Today</span>
        </h1>
        
        <p className="text-base sm:text-lg md:text-xl text-charcoal mb-6 sm:mb-8 max-w-2xl mx-auto font-medium px-4">
          Discover amazing shared living spaces and connect with like-minded people in your city.
        </p>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-6 sm:mb-8 px-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
            <Input
              placeholder="Search by area or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 sm:pl-10 h-10 sm:h-12 border-2 border-slate-200 focus:border-coral-400 rounded-xl text-base sm:text-lg bg-white/90 backdrop-blur-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
