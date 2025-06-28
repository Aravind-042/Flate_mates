import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, ImageIcon } from "lucide-react";

interface ImageUploadDropzoneProps {
  onFileSelect: (files: FileList) => void;
  isProcessing: boolean;
  maxImages: number;
  currentCount: number;
  acceptedTypes: string[];
}

export const ImageUploadDropzone = ({
  onFileSelect,
  isProcessing,
  maxImages,
  currentCount,
  acceptedTypes
}: ImageUploadDropzoneProps) => {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    if (isProcessing) return;
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileSelect(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isProcessing) {
      setDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const canUploadMore = currentCount < maxImages;
  const remainingSlots = maxImages - currentCount;

  return (
    <Card
      className={`border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-200 ${
        dragOver && canUploadMore
          ? 'border-blue-400 bg-blue-50 scale-[1.02]' 
          : canUploadMore
          ? 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
      } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => {
        if (canUploadMore && !isProcessing) {
          const input = document.createElement('input');
          input.type = 'file';
          input.multiple = true;
          input.accept = acceptedTypes.join(',');
          input.onchange = (e) => {
            const files = (e.target as HTMLInputElement).files;
            if (files) onFileSelect(files);
          };
          input.click();
        }
      }}
    >
      <div className="space-y-4">
        {isProcessing ? (
          <div className="flex items-center justify-center space-x-3">
            <div className="w-8 h-8 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
            <span className="text-lg font-medium text-blue-600">Processing images...</span>
          </div>
        ) : canUploadMore ? (
          <>
            <div className="flex justify-center">
              <div className={`p-4 rounded-full transition-colors ${
                dragOver ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                <Upload className={`h-8 w-8 transition-colors ${
                  dragOver ? 'text-blue-500' : 'text-gray-400'
                }`} />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {dragOver ? 'Drop images here' : 'Upload Property Images'}
              </h3>
              <p className="text-gray-600 mb-4">
                Drag and drop images here, or click to browse
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Supports JPEG, PNG, WebP • Max 10MB per image
              </p>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
                disabled={isProcessing}
              >
                <ImageIcon className="h-5 w-5 mr-2" />
                Choose Images ({remainingSlots} remaining)
              </Button>
            </div>
          </>
        ) : (
          <div>
            <div className="p-4 rounded-full bg-gray-100 mx-auto w-fit mb-4">
              <ImageIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Maximum images reached
            </h3>
            <p className="text-gray-500">
              You've uploaded the maximum of {maxImages} images. Remove some to add new ones.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};