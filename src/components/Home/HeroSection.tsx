
import { SearchBar } from "@/components/ui/search-bar";

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const HeroSection = ({ searchQuery, setSearchQuery }: HeroSectionProps) => {
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <section className="relative py-8 sm:py-12 lg:py-16 px-4 text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-deep-blue via-orange to-emerald bg-clip-text text-transparent leading-tight">
          Find Your Perfect
          <span className="block">Flatmate Today</span>
        </h1>
        
        <p className="text-base sm:text-lg md:text-xl text-charcoal mb-6 sm:mb-8 max-w-2xl mx-auto font-medium px-4">
          Discover amazing shared living spaces and connect with like-minded people in your city.
        </p>

        {/* Enhanced Search Bar */}
        <div className="max-w-md mx-auto mb-6 sm:mb-8 px-4">
          <SearchBar 
            placeholder="Search by area or city..."
            onSearch={handleSearch}
          />
        </div>
      </div>
    </section>
  );
};
