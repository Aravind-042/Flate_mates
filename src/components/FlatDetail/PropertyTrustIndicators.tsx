
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Star } from "lucide-react";

export const PropertyTrustIndicators = () => {
  return (
    <Card className="bg-white/80 backdrop-blur-md border-0 rounded-2xl shadow-xl">
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-blue-50 rounded-xl p-3">
            <Shield className="h-5 w-5 text-blue-600 mx-auto mb-1" />
            <div className="text-sm font-medium text-slate-800">Verified</div>
            <div className="text-xs text-slate-600">Property</div>
          </div>
          <div className="bg-green-50 rounded-xl p-3">
            <Star className="h-5 w-5 text-yellow-500 mx-auto mb-1" />
            <div className="text-sm font-medium text-slate-800">Premium</div>
            <div className="text-xs text-slate-600">Listing</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
