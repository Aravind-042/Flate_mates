import { SearchBar } from "@/components/ui/search-bar";
import { FeatureStepsDemo } from "@/components/ui/feature-steps-demo";
interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}
export const HeroSection = ({
  searchQuery,
  setSearchQuery
}: HeroSectionProps) => {
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  return <section className="relative py-6 sm:py-8 lg:py-12 px-4">
      <div className="max-w-4xl mx-auto text-center mb-8">
        
        
        <p className="text-base sm:text-lg md:text-xl text-charcoal mb-4 sm:mb-6 max-w-2xl mx-auto font-medium px-4">
          Discover amazing shared living spaces and connect with like-minded people in your city.
        </p>

        {/* Enhanced Search Bar */}
        <div className="max-w-lg mx-auto mb-4 sm:mb-6 px-4">
          <SearchBar placeholder="Search by area or city..." onSearch={handleSearch} />
        </div>
      </div>

      {/* Feature Steps Section */}
      <FeatureStepsDemo />
    </section>;
};