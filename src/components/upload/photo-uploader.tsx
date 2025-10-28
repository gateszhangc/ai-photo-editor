"use client";

import React, { useState, useCallback } from "react";
import { DropZone } from "./drop-zone";
import { FilePreview } from "./file-preview";
import { ImageCompressor } from "./image-compressor";
import { Button } from "@/components/ui/button";
import { usePhotoUpload } from "@/hooks/use-photo-upload";

interface PhotoUploaderProps {
  onFileReady: (file: File, imageUrl: string) => void;
  onUploadComplete?: (result: any) => void;
  maxSize?: number;
  disabled?: boolean;
  showCompression?: boolean;
  autoUpload?: boolean;
}

export function PhotoUploader({ 
  onFileReady, 
  onUploadComplete,
  maxSize = 50 * 1024 * 1024,
  disabled = false,
  showCompression = true,
  autoUpload = false
}: PhotoUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showCompressor, setShowCompressor] = useState(false);
  const { isUploading, progress, error, uploadPhoto, reset } = usePhotoUpload();

  const handleFileSelect = useCallback(async (file: File) => {
    // Clean up previous URL
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
    
    // Reset upload state
    reset();
    
    // Create new object URL
    const url = URL.createObjectURL(file);
    setSelectedFile(file);
    setImageUrl(url);
    
    // Auto-show compressor for large files (>5MB)
    if (showCompression && file.size > 5 * 1024 * 1024) {
      setShowCompressor(true);
    } else {
      // Notify parent component immediately for smaller files
      onFileReady(file, url);
      
      // Auto-upload if enabled
      if (autoUpload) {
        try {
          const result = await uploadPhoto(file);
          onUploadComplete?.(result);
        } catch (error) {
          console.error('Auto-upload failed:', error);
        }
      }
    }
  }, [imageUrl, onFileReady, showCompression, autoUpload, uploadPhoto, onUploadComplete, reset]);

  const handleRemoveFile = useCallback(() => {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
    setSelectedFile(null);
    setImageUrl(null);
    setShowCompressor(false);
  }, [imageUrl]);

  const handleEditFile = useCallback(() => {
    if (selectedFile && imageUrl) {
      onFileReady(selectedFile, imageUrl);
    }
  }, [selectedFile, imageUrl, onFileReady]);

  const handleCompressed = useCallback(async (compressedFile: File) => {
    // Clean up previous URL
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
    
    // Create new URL for compressed file
    const url = URL.createObjectURL(compressedFile);
    setSelectedFile(compressedFile);
    setImageUrl(url);
    setShowCompressor(false);
    
    // Notify parent component
    onFileReady(compressedFile, url);
    
    // Auto-upload compressed file if enabled
    if (autoUpload) {
      try {
        const result = await uploadPhoto(compressedFile);
        onUploadComplete?.(result);
      } catch (error) {
        console.error('Auto-upload failed:', error);
      }
    }
  }, [imageUrl, onFileReady, autoUpload, uploadPhoto, onUploadComplete]);

  const handleSkipCompression = useCallback(() => {
    if (selectedFile && imageUrl) {
      setShowCompressor(false);
      onFileReady(selectedFile, imageUrl);
    }
  }, [selectedFile, imageUrl, onFileReady]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  // Show compressor if requested
  if (showCompressor && selectedFile) {
    return (
      <div className="space-y-4">
        <ImageCompressor
          file={selectedFile}
          onCompressed={handleCompressed}
          onCancel={() => setShowCompressor(false)}
        />
        
        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={handleSkipCompression}
            className="text-sm"
          >
            Skip compression and continue
          </Button>
        </div>
      </div>
    );
  }

  const handleManualUpload = useCallback(async () => {
    if (!selectedFile) return;
    
    try {
      const result = await uploadPhoto(selectedFile);
      onUploadComplete?.(result);
    } catch (error) {
      console.error('Manual upload failed:', error);
    }
  }, [selectedFile, uploadPhoto, onUploadComplete]);

  // Show preview if file is selected and not compressing
  if (selectedFile && imageUrl) {
    return (
      <div className="space-y-4">
        <FilePreview
          file={selectedFile}
          imageUrl={imageUrl}
          onRemove={handleRemoveFile}
          onEdit={handleEditFile}
        />
        
        {/* Upload Progress */}
        {isUploading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex justify-between text-sm text-blue-700 mb-2">
              <span>Uploading to cloud...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
        
        {/* Upload Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700 font-medium">Upload Failed</p>
            <p className="text-sm text-red-600">{error}</p>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => reset()}
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        )}
        
        <div className="flex space-x-2">
          {showCompression && (
            <Button 
              variant="outline" 
              onClick={() => setShowCompressor(true)}
              size="sm"
              disabled={isUploading}
            >
              Compress Image
            </Button>
          )}
          
          {!autoUpload && (
            <Button 
              onClick={handleManualUpload}
              disabled={isUploading}
              size="sm"
            >
              {isUploading ? 'Uploading...' : 'Upload to Cloud'}
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <DropZone
      onFileSelect={handleFileSelect}
      maxSize={maxSize}
      disabled={disabled}
    />
  );
}