// Mock Cloudflare R2 client for development
// In production, replace with actual AWS SDK implementation

export interface UploadResult {
  key: string;
  url: string;
  publicUrl: string;
}

/**
 * Mock upload function for development
 * In production, implement actual R2 upload
 */
export async function uploadToR2(
  file: Buffer,
  key: string,
  contentType: string,
  bucket: string = 'ai-photo-editor'
): Promise<UploadResult> {
  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock successful upload
  const publicUrl = `https://demo.ai-photo-editor.com/${key}`;
  
  return {
    key,
    url: publicUrl,
    publicUrl,
  };
}

/**
 * Mock presigned URL generation
 */
export async function generatePresignedUrl(
  key: string,
  contentType: string,
  expiresIn: number = 3600,
  bucket: string = 'ai-photo-editor'
): Promise<string> {
  // Mock presigned URL
  return `https://demo.ai-photo-editor.com/upload/${key}?expires=${Date.now() + expiresIn * 1000}`;
}

/**
 * Mock delete function
 */
export async function deleteFromR2(
  key: string,
  bucket: string = 'ai-photo-editor'
): Promise<void> {
  // Mock delete operation
  console.log(`Mock: Deleted ${key} from ${bucket}`);
}

/**
 * Mock download URL generation
 */
export async function generateDownloadUrl(
  key: string,
  expiresIn: number = 3600,
  bucket: string = 'ai-photo-editor'
): Promise<string> {
  // Mock download URL
  return `https://demo.ai-photo-editor.com/download/${key}?expires=${Date.now() + expiresIn * 1000}`;
}