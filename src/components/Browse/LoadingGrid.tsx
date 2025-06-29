import { Card, CardContent } from "@/components/ui/card";
import { TextShimmer } from "@/components/ui/text-shimmer";

export const LoadingGrid = () => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <TextShimmer 
          className="text-2xl font-semibold text-slate-700"
          duration={1.8}
        >
          Finding amazing properties for you...
        </TextShimmer>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 lg:gap-8">
        {[...Array(10)].map((_, i) => (
          <Card key={i} className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg overflow-hidden">
            <div className="animate-pulse">
              {/* Image placeholder */}
              <div className="h-56 sm:h-64 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200 bg-[length:200%_100%] animate-pulse"></div>
              
              <CardContent className="p-6 space-y-4">
                {/* Title */}
                <div className="h-6 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 bg-[length:200%_100%] rounded-lg animate-pulse"></div>
                
                {/* Location */}
                <div className="h-4 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 bg-[length:200%_100%] rounded w-3/4 animate-pulse"></div>
                
                {/* Property details */}
                <div className="flex space-x-3">
                  <div className="h-8 w-16 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 bg-[length:200%_100%] rounded-lg animate-pulse"></div>
                  <div className="h-8 w-16 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 bg-[length:200%_100%] rounded-lg animate-pulse"></div>
                  <div className="h-8 w-16 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 bg-[length:200%_100%] rounded-lg animate-pulse"></div>
                </div>
                
                {/* Description */}
                <div className="space-y-2">
                  <div className="h-4 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 bg-[length:200%_100%] rounded animate-pulse"></div>
                  <div className="h-4 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 bg-[length:200%_100%] rounded w-5/6 animate-pulse"></div>
                </div>
                
                {/* Price */}
                <div className="flex justify-between items-end pt-4 border-t border-slate-200">
                  <div className="space-y-1">
                    <div className="h-8 w-24 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 bg-[length:200%_100%] rounded animate-pulse"></div>
                    <div className="h-3 w-16 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 bg-[length:200%_100%] rounded animate-pulse"></div>
                  </div>
                  <div className="h-6 w-20 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 bg-[length:200%_100%] rounded animate-pulse"></div>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};