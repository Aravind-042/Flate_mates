
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Star, Wifi } from "lucide-react";

interface PropertyAmenitiesProps {
  amenities: string[] | null;
}

export const PropertyAmenities = ({ amenities }: PropertyAmenitiesProps) => {
  if (!amenities || amenities.length === 0) {
    return null;
  }

  return (
    <Card className="bg-white/80 backdrop-blur-md border-0 rounded-2xl shadow-xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg sm:text-xl font-bold text-slate-800 flex items-center">
          <Star className="h-5 w-5 mr-2 text-yellow-500" />
          Amenities & Features
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {amenities.map((amenity, index) => (
            <div key={index} className="flex items-center bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-2">
              <Wifi className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
              <span className="text-slate-700 font-medium text-sm">{amenity}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
