
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageCarousel } from "@/components/ui/ImageCarousel";
import { Heart } from "lucide-react";

interface PropertyImageGalleryProps {
  images: string[] | null;
  title: string;
}

export const PropertyImageGallery = ({ images, title }: PropertyImageGalleryProps) => {
  return (
    <Card className="bg-white/80 backdrop-blur-md border-0 rounded-2xl shadow-xl overflow-hidden">
      <div className="relative">
        <ImageCarousel
          images={images}
          title={title}
          height="h-48 sm:h-64 md:h-80"
          showIndicator={true}
          showArrows={true}
        />
        
        {/* Heart/Favorite Button */}
        <Button
          size="sm"
          variant="ghost"
          className="absolute top-3 left-3 bg-white/90 backdrop-blur-md hover:bg-white rounded-full p-2 shadow-lg z-20"
        >
          <Heart className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    </Card>
  );
};
