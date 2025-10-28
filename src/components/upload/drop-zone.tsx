"use client";

import React, { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number;
  disabled?: boolean;
}

interface FileValidationError {
  type: 'size' | 'format' | 'general';
  message: string;
}

export function DropZone({ 
  onFileSelect, 
  accept = "image/*", 
  maxSize = 50 * 1024 * 1024, // 50MB
  disabled = false
}: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<FileValidationError | null>(null);

  const supportedFormats = ['image/jpeg', 'image/png', 'image/webp'];

  const validateFile = (file: File): FileValidationError | null => {
    // Check file size
    if (file.size > maxSize) {
      return {
        type: 'size',
        message: `File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`
      };
    }

    // Check file format
    if (!supportedFormats.includes(file.type)) {
      return {
        type: 'format',
        message: 'Only JPEG, PNG, and WEBP formats are supported'
      };
    }

    return null;
  };

  const simulateUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i);
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    setIsUploading(false);
    setUploadProgress(0);
    onFileSelect(file);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setError(null);
    
    if (disabled || isUploading) return;
    
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
      
      await simulateUpload(file);
    }
  }, [disabled, isUploading, maxSize]);

  const handleFileInput = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    
    if (disabled || isUploading) return;
    
    const file = e.target.files?.[0];
    if (file) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
      
      await simulateUpload(file);
    }
    
    // Reset input
    e.target.value = '';
  }, [disabled, isUploading, maxSize]);

  const getBorderColor = () => {
    if (error) return 'border-red-300 bg-red-50';
    if (isDragOver && !disabled) return 'border-blue-500 bg-blue-50';
    if (disabled) return 'border-gray-200 bg-gray-50';
    return 'border-gray-300 hover:border-gray-400';
  };

  return (
    <div
      className={`
        border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
        ${getBorderColor()}
        ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="space-y-4">
        {isUploading ? (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
            <div>
              <p className="text-lg font-medium text-gray-700">Uploading...</p>
              <p className="text-sm text-gray-500">{uploadProgress}% complete</p>
            </div>
            <div className="max-w-xs mx-auto">
              <Progress value={uploadProgress} className="h-2" />
            </div>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            
            <div className={disabled ? 'text-gray-400' : 'text-gray-600'}>
              <p className="text-lg font-medium">
                {disabled ? 'Upload disabled' : 'Drop your photo here'}
              </p>
              {!disabled && (
                <p className="text-sm">or click to browse</p>
              )}
            </div>
            
            {!disabled && (
              <>
                <input
                  type="file"
                  accept={accept}
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-input"
                  disabled={disabled || isUploading}
                />
                
                <Button asChild disabled={disabled || isUploading}>
                  <label htmlFor="file-input" className="cursor-pointer">
                    Choose File
                  </label>
                </Button>
              </>
            )}
            
            <p className="text-xs text-gray-500">
              Supports JPEG, PNG, WEBP up to {Math.round(maxSize / (1024 * 1024))}MB
            </p>
          </>
        )}
        
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-md">
            <p className="text-sm text-red-700 font-medium">Upload Error</p>
            <p className="text-sm text-red-600">{error.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}