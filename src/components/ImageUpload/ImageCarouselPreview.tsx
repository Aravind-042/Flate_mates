import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ImageCarousel } from "./ImageCarousel";
import { Settings, Eye, Upload } from "lucide-react";

interface ImageCarouselPreviewProps {
  images: string[];
  title?: string;
  showSettings?: boolean;
}

export const ImageCarouselPreview = ({
  images,
  title = "Property Images Preview",
  showSettings = true
}: ImageCarouselPreviewProps) => {
  const [autoPlay, setAutoPlay] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(true);
  const [showControls, setShowControls] = useState(true);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Eye className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-heading-3 text-slate-800">{title}</h3>
            <p className="text-body-small text-slate-600">
              Preview how your images will appear to potential flatmates
            </p>
          </div>
        </div>

        {showSettings && images.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="btn-outline"
          >
            <Settings className="h-4 w-4 mr-2" />
            Customize
          </Button>
        )}
      </div>

      {/* Settings Panel */}
      {showSettings && images.length > 1 && (
        <Card className="card-secondary">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Carousel Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="autoplay" className="text-sm font-medium">
                  Auto-play slideshow
                </Label>
                <Switch
                  id="autoplay"
                  checked={autoPlay}
                  onCheckedChange={setAutoPlay}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="thumbnails" className="text-sm font-medium">
                  Show thumbnails
                </Label>
                <Switch
                  id="thumbnails"
                  checked={showThumbnails}
                  onCheckedChange={setShowThumbnails}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="controls" className="text-sm font-medium">
                  Show controls
                </Label>
                <Switch
                  id="controls"
                  checked={showControls}
                  onCheckedChange={setShowControls}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Carousel */}
      <Card className="card-primary">
        <CardContent className="p-6">
          {images.length === 0 ? (
            <div className="aspect-video flex items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
              <div className="text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  No Images Uploaded
                </h3>
                <p className="text-gray-500 mb-4">
                  Upload some images to see the carousel preview
                </p>
                <div className="text-sm text-gray-400">
                  The carousel will automatically appear once you add images
                </div>
              </div>
            </div>
          ) : (
            <ImageCarousel
              images={images}
              autoPlay={autoPlay}
              showThumbnails={showThumbnails}
              showControls={showControls}
              autoPlayInterval={3000}
            />
          )}
        </CardContent>
      </Card>

      {/* Tips */}
      {images.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h4 className="font-semibold text-blue-800 mb-2">🎯 Carousel Tips</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• First image is automatically set as the main photo</li>
            <li>• Use arrow keys or click thumbnails to navigate</li>
            <li>• Click the main image to view in fullscreen</li>
            <li>• Auto-play helps showcase all your photos</li>
            <li>• Thumbnails give viewers quick access to specific images</li>
          </ul>
        </div>
      )}
    </div>
  );
};