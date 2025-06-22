import { SearchBar } from "@/components/ui/search-bar";
import { FeatureStepsDemo } from "@/components/ui/feature-steps-demo";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { HomeIcon, UploadIcon } from "lucide-react";

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

  const navigate = useNavigate();

  return (
    <section className="relative py-10 px-4 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-5xl mx-auto text-center">
        {/* Styled Headline */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-charcoal">
  Your Flatmate Hunt Ends Here.
</h1>


        {/* Styled Subheading */}
        <p className="text-base sm:text-lg text-charcoal max-w-2xl mx-auto mb-6 px-4">
  Skip the brokers and scroll — whether you need a place or have one to offer,
  we help you connect with the right people, effortlessly.
</p>

        {/* Role Buttons with Icons and Routes */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
          <Button
            className="bg-primary text-white px-6 py-2 rounded-lg text-base flex items-center gap-2"
            onClick={() => navigate("/browse")}
          >
            <HomeIcon className="w-5 h-5" />
            Find a Flat
          </Button>
          <Button
            variant="outline"
            className="px-6 py-2 text-base flex items-center gap-2"
            onClick={() => navigate("/create-listing")}
          >
            <UploadIcon className="w-5 h-5" />
            List Your Flat
          </Button>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto w-full">
          <SearchBar
            placeholder="Search by area or city..."
            onSearch={handleSearch}
          />
        </div>
      </div>

      {/* Feature Steps Section */}
      <div className="mt-10 sm:mt-14">
        <FeatureStepsDemo />
      </div>
    </section>
  );
};
