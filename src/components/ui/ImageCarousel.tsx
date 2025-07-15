import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageCarouselProps {
  images: string[] | null;
  title: string;
  className?: string;
  showIndicator?: boolean;
  showArrows?: boolean;
  height?: string;
  fallbackIcon?: React.ReactNode;
  onImageChange?: (currentIndex: number) => void;
}

export const ImageCarousel = ({
  images,
  title,
  className,
  showIndicator = true,
  showArrows = true,
  height = "h-48",
  fallbackIcon,
  onImageChange
}: ImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const hasImages = images && images.length > 0;
  const imageCount = hasImages ? images.length : 0;

  // Reset index when images change
  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  // Notify parent of image changes
  useEffect(() => {
    if (onImageChange) {
      onImageChange(currentIndex);
    }
  }, [currentIndex, onImageChange]);

  const goToPrevious = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!hasImages) return;
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? imageCount - 1 : prevIndex - 1
    );
  };

  const goToNext = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!hasImages) return;
    setCurrentIndex(prevIndex => 
      prevIndex === imageCount - 1 ? 0 : prevIndex + 1
    );
  };

  const goToImage = (index: number, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrentIndex(index);
  };

  if (!hasImages) {
    return (
      <div className={cn(
        "relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 flex items-center justify-center",
        height,
        className
      )}>
        <div className="text-center">
          {fallbackIcon || <Home className="h-12 w-12 sm:h-16 sm:w-16 text-blue-400 mx-auto mb-2" />}
          <p className="text-slate-600 font-medium text-sm">No photos available</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn("relative overflow-hidden rounded-2xl group", height, className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Image */}
      <div className="relative w-full h-full">
        <img
          src={images[currentIndex]}
          alt={`${title} - Image ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Navigation Arrows */}
      {showArrows && imageCount > 1 && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={goToPrevious}
            className={cn(
              "absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-md hover:bg-white/95 rounded-full p-2 shadow-lg transition-all duration-200",
              "opacity-0 group-hover:opacity-100",
              isHovered && "opacity-100"
            )}
          >
            <ChevronLeft className="h-4 w-4 text-slate-700" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={goToNext}
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-md hover:bg-white/95 rounded-full p-2 shadow-lg transition-all duration-200",
              "opacity-0 group-hover:opacity-100",
              isHovered && "opacity-100"
            )}
          >
            <ChevronRight className="h-4 w-4 text-slate-700" />
          </Button>
        </>
      )}

      {/* Image Indicator */}
      {showIndicator && imageCount > 1 && (
        <Badge className="absolute top-3 right-3 bg-black/70 text-white border-0 backdrop-blur-sm text-xs z-10">
          {currentIndex + 1} / {imageCount}
        </Badge>
      )}

      {/* Dot Indicators */}
      {imageCount > 1 && imageCount <= 5 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => goToImage(index, e)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-200",
                index === currentIndex 
                  ? "bg-white scale-125" 
                  : "bg-white/60 hover:bg-white/80"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};