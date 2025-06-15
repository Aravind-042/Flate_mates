
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface SearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  cities: string[];
}

export const SearchFilters = ({
  searchQuery,
  setSearchQuery,
  selectedCity,
  setSelectedCity,
  cities
}: SearchFiltersProps) => {
  return (
    <Card className="bg-white/80 backdrop-blur-md border-0 rounded-3xl shadow-xl mb-8">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              placeholder="Search by title or area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 border-2 border-slate-200 focus:border-coral-400 rounded-xl"
            />
          </div>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="h-12 px-4 border-2 border-slate-200 focus:border-coral-400 rounded-xl bg-white text-slate-700"
          >
            <option value="">All Cities</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
      </CardContent>
    </Card>
  );
};
