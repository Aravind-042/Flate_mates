
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Home } from "lucide-react";

interface PropertyDescriptionProps {
  description: string | null;
}

export const PropertyDescription = ({ description }: PropertyDescriptionProps) => {
  return (
    <Card className="bg-white/80 backdrop-blur-md border-0 rounded-2xl shadow-xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg sm:text-xl font-bold text-slate-800 flex items-center">
          <Home className="h-5 w-5 mr-2 text-blue-500" />
          About This Property
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
          {description || "This beautiful property offers comfortable living spaces with modern amenities. Perfect for anyone looking for a quality home in a great location."}
        </p>
      </CardContent>
    </Card>
  );
};
