"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { extractImageMetadata, formatFileSize, type ImageMetadata } from "@/lib/image-utils";

interface FilePreviewProps {
  file: File;
  imageUrl: string;
  onRemove: () => void;
  onEdit: () => void;
}

export function FilePreview({ file, imageUrl, onRemove, onEdit }: FilePreviewProps) {
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMetadata = async () => {
      try {
        setIsLoading(true);
        const meta = await extractImageMetadata(file);
        setMetadata(meta);
      } catch (error) {
        console.error('Failed to extract metadata:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMetadata();
  }, [file]);

  return (
    <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
      {/* Image Preview */}
      <div className="aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
        <img
          src={imageUrl}
          alt={file.name}
          className="max-w-full max-h-full object-contain"
        />
      </div>
      
      {/* File Info */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-medium text-gray-900 truncate" title={file.name}>
            {file.name}
          </h3>
          
          {isLoading ? (
            <div className="text-sm text-gray-500 mt-1">Loading metadata...</div>
          ) : metadata ? (
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-500 mt-2">
              <div>Size: {formatFileSize(metadata.size)}</div>
              <div>Format: {metadata.format}</div>
              <div>Dimensions: {metadata.width} × {metadata.height}</div>
              <div>Megapixels: {metadata.megapixels}MP</div>
              <div>Aspect Ratio: {metadata.aspectRatio.toFixed(2)}:1</div>
            </div>
          ) : (
            <div className="text-sm text-red-500 mt-1">Failed to load metadata</div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button onClick={onEdit} className="flex-1">
            Edit Photo
          </Button>
          <Button onClick={onRemove} variant="outline" size="sm">
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
}