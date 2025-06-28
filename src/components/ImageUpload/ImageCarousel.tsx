import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play, Pause, Maximize2, Star } from "lucide-react";
import { ImagePreviewModal } from "./ImagePreviewModal";

interface ImageCarouselProps {
  images: string[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showThumbnails?: boolean;
  showControls?: boolean;
  className?: string;
}

export const ImageCarousel = ({
  images,
  autoPlay = false,
  autoPlayInterval = 3000,
  showThumbnails = true,
  showControls = true,
  className = ""
}: ImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isPlaying, images.length, autoPlayInterval]);

  // Reset to first image when images change
  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying(!isPlaying);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsPlaying(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setIsPlaying(false);
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
    setIsPlaying(false);
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const handleImageError = () => {
    setIsImageLoading(false);
  };

  if (!images || images.length === 0) {
    return (
      <Card className={`relative overflow-hidden bg-gray-100 ${className}`}>
        <div className="aspect-video flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No images to display</p>
            <p className="text-gray-400 text-sm">Upload some images to see the carousel</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Carousel */}
      <Card className="relative overflow-hidden group">
        <div className="aspect-video relative bg-gray-100">
          {/* Loading State */}
          {isImageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="flex flex-col items-center space-y-3">
                <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                <p className="text-gray-600 text-sm">Loading image...</p>
              </div>
            </div>
          )}

          {/* Main Image */}
          <img
            src={images[currentIndex]}
            alt={`Property image ${currentIndex + 1}`}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isImageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            onClick={() => setIsModalOpen(true)}
            style={{ cursor: 'pointer' }}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Image Counter */}
          <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Main Photo Badge */}
          {currentIndex === 0 && (
            <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
              <Star className="h-3 w-3 mr-1" />
              Main Photo
            </div>
          )}

          {/* Navigation Controls */}
          {showControls && images.length > 1 && (
            <>
              {/* Previous Button */}
              <Button
                onClick={handlePrevious}
                variant="ghost"
                size="sm"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all duration-200"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              {/* Next Button */}
              <Button
                onClick={handleNext}
                variant="ghost"
                size="sm"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all duration-200"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>

              {/* Play/Pause Button */}
              <Button
                onClick={() => setIsPlaying(!isPlaying)}
                variant="ghost"
                size="sm"
                className="absolute bottom-4 left-4 bg-black/50 text-white hover:bg-black/70 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-200"
                aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>

              {/* Fullscreen Button */}
              <Button
                onClick={() => setIsModalOpen(true)}
                variant="ghost"
                size="sm"
                className="absolute bottom-4 right-4 bg-black/50 text-white hover:bg-black/70 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-200"
                aria-label="View fullscreen"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* Progress Dots */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentIndex
                      ? 'bg-white scale-125'
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Thumbnail Strip */}
      {showThumbnails && images.length > 1 && (
        <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`flex-shrink-0 relative overflow-hidden rounded-lg transition-all duration-200 ${
                index === currentIndex
                  ? 'ring-2 ring-blue-500 scale-105'
                  : 'hover:ring-2 hover:ring-gray-300 hover:scale-102'
              }`}
            >
              <div className="w-20 h-16 bg-gray-100">
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              
              {/* Thumbnail Number */}
              <div className="absolute top-1 left-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                {index + 1}
              </div>

              {/* Main Photo Badge on Thumbnail */}
              {index === 0 && (
                <div className="absolute top-1 right-1 bg-yellow-500 text-white text-xs px-1 py-0.5 rounded flex items-center">
                  <Star className="h-2 w-2" />
                </div>
              )}

              {/* Active Overlay */}
              {index === currentIndex && (
                <div className="absolute inset-0 bg-blue-500/20 border-2 border-blue-500 rounded-lg" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Carousel Info */}
      <div className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
        <div className="flex items-center space-x-4">
          <span>
            <strong>{images.length}</strong> image{images.length !== 1 ? 's' : ''}
          </span>
          {autoPlay && (
            <span className="flex items-center space-x-1">
              {isPlaying ? (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>Auto-playing</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-gray-400 rounded-full" />
                  <span>Paused</span>
                </>
              )}
            </span>
          )}
        </div>
        
        <div className="text-xs text-gray-500">
          Use arrow keys or click thumbnails to navigate
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isModalOpen && (
        <ImagePreviewModal
          images={images}
          currentIndex={currentIndex}
          onClose={() => setIsModalOpen(false)}
          onNavigate={setCurrentIndex}
        />
      )}
    </div>
  );
};