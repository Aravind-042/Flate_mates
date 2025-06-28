import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ImageUploadProgressProps {
  uploadProgress: { [key: string]: number };
}

export const ImageUploadProgress = ({ uploadProgress }: ImageUploadProgressProps) => {
  const progressEntries = Object.entries(uploadProgress);
  
  if (progressEntries.length === 0) return null;

  return (
    <Card className="p-4 bg-blue-50 border border-blue-200">
      <h4 className="font-semibold text-blue-800 mb-3">Processing Images...</h4>
      <div className="space-y-3">
        {progressEntries.map(([fileId, progress]) => {
          const fileName = fileId.split('-')[0] || 'Unknown file';
          return (
            <div key={fileId} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-blue-700 truncate max-w-[200px]">{fileName}</span>
                <span className="text-blue-600 font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          );
        })}
      </div>
    </Card>
  );
};