import { ImageUploadManager } from "./ImageUpload/ImageUploadManager";

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export const ImageUpload = ({ images, onChange }: ImageUploadProps) => {
  return (
    <ImageUploadManager
      images={images}
      onChange={onChange}
      maxImages={10}
      maxSizeMB={4}
      acceptedTypes={['image/jpeg', 'image/jpg', 'image/png', 'image/webp']}
    />
  );
};