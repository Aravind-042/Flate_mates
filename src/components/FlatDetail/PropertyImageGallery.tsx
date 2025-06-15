
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Home, Heart } from "lucide-react";

interface PropertyImageGalleryProps {
  images: string[] | null;
  title: string;
}

export const PropertyImageGallery = ({ images, title }: PropertyImageGalleryProps) => {
  return (
    <Card className="bg-white/80 backdrop-blur-md border-0 rounded-2xl shadow-xl overflow-hidden">
      <div className="relative">
        {images && images.length > 0 ? (
          <>
            <img 
              src={images[0]} 
              alt={title}
              className="w-full h-48 sm:h-64 md:h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
            {images.length > 1 && (
              <Badge className="absolute top-3 right-3 bg-black/70 text-white border-0 backdrop-blur-sm text-xs">
                +{images.length - 1} photos
              </Badge>
            )}
            <Button
              size="sm"
              variant="ghost"
              className="absolute top-3 left-3 bg-white/90 backdrop-blur-md hover:bg-white rounded-full p-2 shadow-lg"
            >
              <Heart className="h-4 w-4 text-red-500" />
            </Button>
          </>
        ) : (
          <div className="w-full h-48 sm:h-64 bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 flex items-center justify-center">
            <div className="text-center">
              <Home className="h-12 w-12 sm:h-16 sm:w-16 text-blue-400 mx-auto mb-2" />
              <p className="text-slate-600 font-medium text-sm">No photos available</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
