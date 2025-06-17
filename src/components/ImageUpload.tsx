
import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X, Image, AlertTriangle } from "lucide-react";
import { compressImage, getTotalImagesSize } from "@/utils/imageUtils";
import { toast } from "sonner";

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export const ImageUpload = ({ images, onChange }: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;

    setIsProcessing(true);
    const newImages: string[] = [];
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          // Check file size before processing
          const fileSizeMB = file.size / (1024 * 1024);
          
          let dataUrl: string;
          if (fileSizeMB > 2) {
            // Compress large images
            console.log(`Compressing large image (${fileSizeMB.toFixed(1)}MB)`);
            dataUrl = await compressImage(file, 800, 0.7);
          } else {
            // Use original for smaller images
            dataUrl = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = (e) => resolve(e.target?.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(file);
            });
          }
          
          newImages.push(dataUrl);
        }
      }

      // Check total size before adding
      const updatedImages = [...images, ...newImages];
      const totalSize = getTotalImagesSize(updatedImages);
      
      if (totalSize > 4) {
        toast.error(`Images too large (${totalSize.toFixed(1)}MB). Please reduce image sizes or remove some images.`);
        return;
      }

      onChange(updatedImages);
      
      if (newImages.length > 0) {
        toast.success(`Added ${newImages.length} image(s) (${totalSize.toFixed(1)}MB total)`);
      }
    } catch (error) {
      console.error('Error processing images:', error);
      toast.error("Failed to process some images. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
    toast.success("Image removed");
  };

  const totalSizeMB = getTotalImagesSize(images);
  const isNearLimit = totalSizeMB > 3;

  return (
    <div className="space-y-4">
      {/* Storage usage indicator */}
      {images.length > 0 && (
        <div className={`text-sm p-2 rounded flex items-center space-x-2 ${
          isNearLimit ? 'bg-orange-50 text-orange-700' : 'bg-gray-50 text-gray-600'
        }`}>
          {isNearLimit && <AlertTriangle className="h-4 w-4" />}
          <span>
            Storage used: {totalSizeMB.toFixed(1)}MB / 4MB limit
            {isNearLimit && " (near limit)"}
          </span>
        </div>
      )}

      <Card
        className={`border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${
          dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
          disabled={isProcessing}
        />
        <div className="space-y-2">
          {isProcessing ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
              <span>Processing images...</span>
            </div>
          ) : (
            <>
              <Upload className="h-8 w-8 mx-auto text-gray-400" />
              <div>
                <p className="text-gray-600">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-400">
                  PNG, JPG, JPEG (Large images will be compressed automatically)
                </p>
              </div>
              <Button type="button" variant="outline" size="sm" disabled={isProcessing}>
                Select Images
              </Button>
            </>
          )}
        </div>
      </Card>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <Card key={index} className="relative group overflow-hidden">
              <div className="aspect-square bg-gray-100">
                <img
                  src={image}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="text-center py-8">
          <Image className="h-12 w-12 mx-auto text-gray-300 mb-2" />
          <p className="text-gray-500">No images uploaded yet</p>
          <p className="text-sm text-gray-400">Add some photos to make your listing more attractive</p>
        </div>
      )}
    </div>
  );
};
