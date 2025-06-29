import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Search, Plus, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const EmptyState = () => {
  const navigate = useNavigate();

  return (
    <Card className="card-primary max-w-2xl mx-auto">
      <CardContent className="p-12 text-center space-y-6">
        {/* Icon */}
        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto">
          <Search className="h-12 w-12 text-blue-500" />
        </div>
        
        {/* Content */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-slate-800">No Properties Found</h3>
          <p className="text-slate-600 leading-relaxed">
            We couldn't find any properties matching your search criteria. 
            Try adjusting your filters or search in a different area.
          </p>
        </div>

        {/* Suggestions */}
        <div className="bg-blue-50 rounded-2xl p-6 space-y-4">
          <h4 className="font-semibold text-blue-800">Try these suggestions:</h4>
          <ul className="text-sm text-blue-700 space-y-2 text-left">
            <li className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
              Search in nearby areas or different cities
            </li>
            <li className="flex items-center">
              <Search className="h-4 w-4 mr-2 flex-shrink-0" />
              Remove some filters to see more results
            </li>
            <li className="flex items-center">
              <Home className="h-4 w-4 mr-2 flex-shrink-0" />
              Check back later for new listings
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            <Search className="h-4 w-4 mr-2" />
            Clear Filters & Search Again
          </Button>
          <Button 
            onClick={() => navigate('/create-listing')}
            variant="outline"
            className="btn-outline"
          >
            <Plus className="h-4 w-4 mr-2" />
            List Your Property
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};