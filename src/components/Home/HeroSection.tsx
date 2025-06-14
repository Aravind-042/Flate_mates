
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
      {/* Feature Steps Section - Now at the top */}
      <FeatureStepsDemo />
      
      {/* Decreased mb-8 to mb-2 for less spacing after search */}
      <div className="max-w-4xl mx-auto text-center mb-2">
        <div className="max-w-lg mx-auto mb-2 sm:mb-3 px-4">
          <SearchBar placeholder="Search by area or city..." onSearch={handleSearch} />
        </div>
      </div>
    </section>;
};
