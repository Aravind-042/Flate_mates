import { useState, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, AlertTriangle, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { compressImage, getTotalImagesSize } from "@/utils/imageUtils";
import { ImagePreviewGrid } from "./ImagePreviewGrid";
import { ImageUploadDropzone } from "./ImageUploadDropzone";
import { ImageUploadProgress } from "./ImageUploadProgress";

interface ImageUploadManagerProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  maxSizeMB?: number;
  acceptedTypes?: string[];
}

export const ImageUploadManager = ({
  images,
  onChange,
  maxImages = 10,
  maxSizeMB = 4,
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
}: ImageUploadManagerProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `File type ${file.type} is not supported. Please use JPEG, PNG, or WebP.`;
    }
    
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > 10) {
      return `File size (${fileSizeMB.toFixed(1)}MB) is too large. Maximum size is 10MB.`;
    }
    
    return null;
  };

  const processImage = async (file: File, index: number): Promise<string> => {
    const fileId = `${file.name}-${index}`;
    
    try {
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
      
      const fileSizeMB = file.size / (1024 * 1024);
      let dataUrl: string;
      
      if (fileSizeMB > 2) {
        // Compress large images
        setUploadProgress(prev => ({ ...prev, [fileId]: 30 }));
        dataUrl = await compressImage(file, 1200, 0.8);
        setUploadProgress(prev => ({ ...prev, [fileId]: 80 }));
      } else {
        // Use original for smaller images
        setUploadProgress(prev => ({ ...prev, [fileId]: 50 }));
        dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }
      
      setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));
      
      // Clean up progress after a delay
      setTimeout(() => {
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[fileId];
          return newProgress;
        });
      }, 1000);
      
      return dataUrl;
    } catch (error) {
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[fileId];
        return newProgress;
      });
      throw error;
    }
  };

  const handleFileSelect = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    
    if (images.length + fileArray.length > maxImages) {
      toast.error(`You can only upload up to ${maxImages} images. Currently have ${images.length}, trying to add ${fileArray.length}.`);
      return;
    }

    setIsProcessing(true);
    const newImages: string[] = [];
    const errors: string[] = [];

    try {
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        const validationError = validateFile(file);
        
        if (validationError) {
          errors.push(`${file.name}: ${validationError}`);
          continue;
        }

        try {
          const dataUrl = await processImage(file, i);
          newImages.push(dataUrl);
        } catch (error) {
          console.error(`Error processing ${file.name}:`, error);
          errors.push(`${file.name}: Failed to process image`);
        }
      }

      if (newImages.length > 0) {
        const updatedImages = [...images, ...newImages];
        const totalSize = getTotalImagesSize(updatedImages);
        
        if (totalSize > maxSizeMB) {
          toast.error(`Total images size (${totalSize.toFixed(1)}MB) exceeds ${maxSizeMB}MB limit. Please reduce image sizes or remove some images.`);
          return;
        }

        onChange(updatedImages);
        toast.success(`Successfully added ${newImages.length} image(s) (${totalSize.toFixed(1)}MB total)`);
      }

      if (errors.length > 0) {
        toast.error(`Some files couldn't be processed:\n${errors.join('\n')}`);
      }
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [images, maxImages, maxSizeMB, onChange]);

  const handleRemoveImage = useCallback((index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
    toast.success("Image removed");
  }, [images, onChange]);

  const handleReorderImages = useCallback((fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    onChange(newImages);
    toast.success("Images reordered");
  }, [images, onChange]);

  const totalSizeMB = getTotalImagesSize(images);
  const isNearLimit = totalSizeMB > maxSizeMB * 0.8;
  const hasProgress = Object.keys(uploadProgress).length > 0;

  return (
    <div className="space-y-6">
      {/* Storage Usage Indicator */}
      {images.length > 0 && (
        <div className={`text-sm p-3 rounded-lg flex items-center justify-between ${
          isNearLimit ? 'bg-orange-50 text-orange-700 border border-orange-200' : 'bg-gray-50 text-gray-600'
        }`}>
          <div className="flex items-center space-x-2">
            {isNearLimit && <AlertTriangle className="h-4 w-4" />}
            <span>
              Storage: {totalSizeMB.toFixed(1)}MB / {maxSizeMB}MB
              {isNearLimit && " (near limit)"}
            </span>
          </div>
          <span className="text-xs">
            {images.length} / {maxImages} images
          </span>
        </div>
      )}

      {/* Upload Progress */}
      {hasProgress && (
        <ImageUploadProgress uploadProgress={uploadProgress} />
      )}

      {/* Upload Dropzone */}
      <ImageUploadDropzone
        onFileSelect={handleFileSelect}
        isProcessing={isProcessing}
        maxImages={maxImages}
        currentCount={images.length}
        acceptedTypes={acceptedTypes}
      />

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(',')}
        className="hidden"
        onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
        disabled={isProcessing}
      />

      {/* Image Preview Grid */}
      {images.length > 0 ? (
        <ImagePreviewGrid
          images={images}
          onRemove={handleRemoveImage}
          onReorder={handleReorderImages}
          isProcessing={isProcessing}
        />
      ) : (
        <div className="text-center py-12">
          <ImageIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No images uploaded yet</h3>
          <p className="text-gray-500 mb-4">Add some photos to make your listing more attractive</p>
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Your First Image
          </Button>
        </div>
      )}

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2">📸 Photo Tips</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• First image will be used as the main photo</li>
          <li>• Use high-quality images (JPEG, PNG, WebP)</li>
          <li>• Show different angles and rooms</li>
          <li>• Good lighting makes a big difference</li>
          <li>• Drag and drop to reorder images</li>
        </ul>
      </div>
    </div>
  );
};