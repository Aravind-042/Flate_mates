
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
      <FeatureStepsDemo />
      {/* Reduced bottom spacing after search bar to mb-0 for tighter gap */}
      <div className="max-w-4xl mx-auto text-center mb-0">
        <div className="max-w-lg mx-auto mb-1 px-4">
          <SearchBar placeholder="Search by area or city..." onSearch={handleSearch} />
        </div>
      </div>
    </section>;
};
