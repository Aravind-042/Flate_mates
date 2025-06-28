import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUploadManager } from "./ImageUploadManager";
import { ImageCarouselPreview } from "./ImageCarouselPreview";
import { Upload, Eye, Image as ImageIcon } from "lucide-react";

interface ImageUploadWithCarouselProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  maxSizeMB?: number;
  acceptedTypes?: string[];
}

export const ImageUploadWithCarousel = ({
  images,
  onChange,
  maxImages = 10,
  maxSizeMB = 4,
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
}: ImageUploadWithCarouselProps) => {
  const [activeTab, setActiveTab] = useState("upload");

  // Auto-switch to preview when images are uploaded
  const handleImagesChange = (newImages: string[]) => {
    onChange(newImages);
    
    // Switch to preview tab when first image is uploaded
    if (images.length === 0 && newImages.length > 0) {
      setActiveTab("preview");
    }
  };

  return (
    <Card className="card-primary">
      <CardHeader>
        <CardTitle className="text-heading-3 text-slate-800 flex items-center">
          <ImageIcon className="h-5 w-5 mr-2" />
          Property Images
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger 
              value="upload" 
              className="flex items-center space-x-2"
            >
              <Upload className="h-4 w-4" />
              <span>Upload Images</span>
              {images.length > 0 && (
                <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {images.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="preview" 
              className="flex items-center space-x-2"
              disabled={images.length === 0}
            >
              <Eye className="h-4 w-4" />
              <span>Preview Carousel</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-0">
            <ImageUploadManager
              images={images}
              onChange={handleImagesChange}
              maxImages={maxImages}
              maxSizeMB={maxSizeMB}
              acceptedTypes={acceptedTypes}
            />
          </TabsContent>

          <TabsContent value="preview" className="mt-0">
            <ImageCarouselPreview
              images={images}
              title="How Your Images Will Look"
              showSettings={true}
            />
          </TabsContent>
        </Tabs>

        {/* Quick Stats */}
        {images.length > 0 && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-sm">
                  <span className="font-semibold text-green-800">{images.length}</span>
                  <span className="text-green-700"> image{images.length !== 1 ? 's' : ''} uploaded</span>
                </div>
                <div className="text-sm text-green-600">
                  Main photo: Image 1
                </div>
              </div>
              <button
                onClick={() => setActiveTab(activeTab === "upload" ? "preview" : "upload")}
                className="text-sm text-green-700 hover:text-green-800 font-medium underline"
              >
                {activeTab === "upload" ? "Preview Carousel" : "Upload More"}
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};