import { Card, CardContent } from "@/components/ui/card";
import { Home } from "lucide-react";

export const EmptyState = () => {
  return (
    <Card className="bg-white/80 backdrop-blur-md border-0 rounded-3xl shadow-xl">
      <CardContent className="p-12 text-center">
        <Home className="h-16 w-16 mx-auto mb-4 text-slate-400" />
        <h3 className="text-heading-3 font-secondary font-bold text-slate-700 mb-2">
          No listings found
        </h3>
        <p className="text-body font-primary text-slate-600">
          Try adjusting your search criteria to find more results.
        </p>
      </CardContent>
    </Card>
  );
};