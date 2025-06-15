
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

interface PropertyHighlightsProps {
  propertyType: string;
  isFurnished: boolean | null;
  parkingAvailable: boolean | null;
}

export const PropertyHighlights = ({ 
  propertyType, 
  isFurnished, 
  parkingAvailable 
}: PropertyHighlightsProps) => {
  return (
    <Card className="bg-white/80 backdrop-blur-md border-0 rounded-2xl shadow-xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg sm:text-xl font-bold text-slate-800 flex items-center">
          <Users className="h-5 w-5 mr-2 text-blue-500" />
          Property Highlights
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-slate-100">
            <span className="text-slate-600 text-sm">Property Type</span>
            <span className="font-medium text-slate-800 text-sm">{propertyType.replace('_', ' ')}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-slate-100">
            <span className="text-slate-600 text-sm">Furnished</span>
            <span className="font-medium text-slate-800 text-sm">{isFurnished ? 'Yes' : 'No'}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-slate-600 text-sm">Parking</span>
            <span className="font-medium text-slate-800 text-sm">{parkingAvailable ? 'Available' : 'Not Available'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
