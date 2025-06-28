import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, GripVertical, Eye, Star } from "lucide-react";
import { ImagePreviewModal } from "./ImagePreviewModal";

interface ImagePreviewGridProps {
  images: string[];
  onRemove: (index: number) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  isProcessing: boolean;
}

export const ImagePreviewGrid = ({ 
  images, 
  onRemove, 
  onReorder, 
  isProcessing 
}: ImagePreviewGridProps) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      onReorder(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <Card 
            key={`${image.substring(0, 20)}-${index}`}
            className={`relative group overflow-hidden transition-all duration-200 ${
              draggedIndex === index ? 'opacity-50 scale-95' : 'hover:shadow-lg'
            }`}
            draggable={!isProcessing}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
          >
            <div className="aspect-square bg-gray-100 relative">
              <img
                src={image}
                alt={`Upload ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                loading="lazy"
              />
              
              {/* Main Photo Badge */}
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                  <Star className="h-3 w-3 mr-1" />
                  Main
                </div>
              )}

              {/* Image Number */}
              <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>

              {/* Action Buttons */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200">
                {/* Remove Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(index);
                  }}
                  disabled={isProcessing}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50"
                  title="Remove image"
                >
                  <X className="h-3 w-3" />
                </button>

                {/* Preview Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewIndex(index);
                  }}
                  className="absolute top-2 right-12 bg-blue-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-600"
                  title="Preview image"
                >
                  <Eye className="h-3 w-3" />
                </button>

                {/* Drag Handle */}
                <div className="absolute bottom-2 right-2 bg-gray-800/70 text-white rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-move">
                  <GripVertical className="h-3 w-3" />
                </div>
              </div>

              {/* Drag Overlay */}
              {draggedIndex === index && (
                <div className="absolute inset-0 bg-blue-500/20 border-2 border-blue-500 border-dashed" />
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Image Preview Modal */}
      {previewIndex !== null && (
        <ImagePreviewModal
          images={images}
          currentIndex={previewIndex}
          onClose={() => setPreviewIndex(null)}
          onNavigate={setPreviewIndex}
        />
      )}
    </>
  );
};