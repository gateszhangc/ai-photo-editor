"use client";

import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import type { UploadOptions } from '@/lib/api-client';
import type { UploadResponse } from '@/app/api/photos/upload/route';

export interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  result: UploadResponse['data'] | null;
}

export function usePhotoUpload() {
  const [state, setState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    result: null,
  });

  const uploadPhoto = useCallback(async (file: File, options: UploadOptions = {}) => {
    setState({
      isUploading: true,
      progress: 0,
      error: null,
      result: null,
    });

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setState(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 10, 90),
        }));
      }, 200);

      const response = await apiClient.uploadPhoto(file, options);

      clearInterval(progressInterval);

      if (response.success && response.data) {
        setState({
          isUploading: false,
          progress: 100,
          error: null,
          result: response.data,
        });
        return response.data;
      } else {
        throw new Error(response.error || 'Upload failed');
      }
    } catch (error) {
      setState({
        isUploading: false,
        progress: 0,
        error: error instanceof Error ? error.message : 'Upload failed',
        result: null,
      });
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      isUploading: false,
      progress: 0,
      error: null,
      result: null,
    });
  }, []);

  return {
    ...state,
    uploadPhoto,
    reset,
  };
}