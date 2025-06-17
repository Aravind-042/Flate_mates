
// Utility functions for image compression and handling

export const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.8): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedDataUrl);
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

export const getImageSizeInMB = (dataUrl: string): number => {
  // Calculate approximate size in MB
  const base64Length = dataUrl.split(',')[1]?.length || 0;
  const sizeInBytes = (base64Length * 3) / 4;
  return sizeInBytes / (1024 * 1024);
};

export const getTotalImagesSize = (images: string[]): number => {
  return images.reduce((total, image) => total + getImageSizeInMB(image), 0);
};
