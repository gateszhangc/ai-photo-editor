export interface ImageMetadata {
  width: number;
  height: number;
  size: number;
  type: string;
  format: string;
  aspectRatio: number;
  megapixels: number;
}

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

/**
 * Extract comprehensive metadata from an image file
 */
export async function extractImageMetadata(file: File): Promise<ImageMetadata> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      const metadata: ImageMetadata = {
        width: img.naturalWidth,
        height: img.naturalHeight,
        size: file.size,
        type: file.type,
        format: file.type.split('/')[1].toUpperCase(),
        aspectRatio: img.naturalWidth / img.naturalHeight,
        megapixels: Math.round((img.naturalWidth * img.naturalHeight) / 1000000 * 10) / 10
      };
      
      resolve(metadata);
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image for metadata extraction'));
    };
    
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Compress an image file with specified options
 */
export async function compressImage(
  file: File, 
  options: CompressionOptions = {}
): Promise<{ file: File; originalSize: number; compressedSize: number; compressionRatio: number }> {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.8,
    format = 'jpeg'
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = calculateDimensions(
        img.naturalWidth,
        img.naturalHeight,
        maxWidth,
        maxHeight
      );

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to compress image'));
            return;
          }

          const compressedFile = new File(
            [blob],
            `compressed_${file.name.split('.')[0]}.${format}`,
            { type: `image/${format}` }
          );

          const originalSize = file.size;
          const compressedSize = compressedFile.size;
          const compressionRatio = Math.round((1 - compressedSize / originalSize) * 100);

          resolve({
            file: compressedFile,
            originalSize,
            compressedSize,
            compressionRatio
          });
        },
        `image/${format}`,
        quality
      );
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image for compression'));
    };
    
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Calculate optimal dimensions while maintaining aspect ratio
 */
function calculateDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  const aspectRatio = originalWidth / originalHeight;

  let width = originalWidth;
  let height = originalHeight;

  // Scale down if larger than max dimensions
  if (width > maxWidth) {
    width = maxWidth;
    height = width / aspectRatio;
  }

  if (height > maxHeight) {
    height = maxHeight;
    width = height * aspectRatio;
  }

  return {
    width: Math.round(width),
    height: Math.round(height)
  };
}

/**
 * Convert image to different format
 */
export async function convertImageFormat(
  file: File,
  targetFormat: 'jpeg' | 'png' | 'webp',
  quality: number = 0.9
): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      
      // Handle transparency for JPEG conversion
      if (targetFormat === 'jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to convert image format'));
            return;
          }

          const convertedFile = new File(
            [blob],
            `${file.name.split('.')[0]}.${targetFormat}`,
            { type: `image/${targetFormat}` }
          );

          resolve(convertedFile);
        },
        `image/${targetFormat}`,
        quality
      );
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image for format conversion'));
    };
    
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Generate thumbnail from image file
 */
export async function generateThumbnail(
  file: File,
  size: number = 200,
  quality: number = 0.7
): Promise<{ file: File; dataUrl: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // Calculate square thumbnail dimensions
      const minDimension = Math.min(img.naturalWidth, img.naturalHeight);
      const scale = size / minDimension;
      
      canvas.width = size;
      canvas.height = size;
      
      // Center crop
      const sx = (img.naturalWidth - minDimension) / 2;
      const sy = (img.naturalHeight - minDimension) / 2;
      
      ctx.drawImage(
        img,
        sx, sy, minDimension, minDimension,
        0, 0, size, size
      );
      
      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to generate thumbnail'));
            return;
          }

          const thumbnailFile = new File(
            [blob],
            `thumb_${file.name}`,
            { type: 'image/jpeg' }
          );

          resolve({
            file: thumbnailFile,
            dataUrl
          });
        },
        'image/jpeg',
        quality
      );
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image for thumbnail generation'));
    };
    
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { isValid: boolean; error?: string } {
  const supportedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxSize = 50 * 1024 * 1024; // 50MB

  if (!supportedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Unsupported file format. Please use JPEG, PNG, or WebP.'
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'File size too large. Maximum size is 50MB.'
    };
  }

  return { isValid: true };
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}