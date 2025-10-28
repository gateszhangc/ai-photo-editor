import type { UploadResponse } from '@/app/api/photos/upload/route';

export interface UploadOptions {
  autoEnhance?: boolean;
  mode?: string;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  /**
   * Upload photo to server
   */
  async uploadPhoto(file: File, options: UploadOptions = {}): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('options', JSON.stringify(options));

    const response = await fetch(`${this.baseUrl}/api/photos/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Upload failed with status ${response.status}`);
    }

    return response.json();
  }

  /**
   * Enhance photo with AI
   */
  async enhancePhoto(photoId: string, mode: string, intensity: number = 1.0) {
    const response = await fetch(`${this.baseUrl}/api/photos/${photoId}/enhance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mode, intensity }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Enhancement failed with status ${response.status}`);
    }

    return response.json();
  }

  /**
   * Adjust photo parameters
   */
  async adjustPhoto(photoId: string, parameters: Record<string, number>) {
    const response = await fetch(`${this.baseUrl}/api/photos/${photoId}/adjust`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ parameters }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Adjustment failed with status ${response.status}`);
    }

    return response.json();
  }

  /**
   * Get processing status
   */
  async getProcessingStatus(taskId: string) {
    const response = await fetch(`${this.baseUrl}/api/tasks/${taskId}/status`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Status check failed with status ${response.status}`);
    }

    return response.json();
  }
}

// Default client instance
export const apiClient = new ApiClient();