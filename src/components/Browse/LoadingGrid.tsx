
import { Card, CardContent } from "@/components/ui/card";
import { TextShimmer } from "@/components/ui/text-shimmer";

export const LoadingGrid = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <TextShimmer 
          className="text-xl font-semibold text-charcoal"
          duration={1.8}
        >
          Loading amazing flats for you...
        </TextShimmer>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="bg-white/80 backdrop-blur-md border-0 rounded-3xl shadow-xl">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-48 bg-slate-200 rounded-2xl mb-4"></div>
                <div className="h-4 bg-slate-200 rounded mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
