"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { compressImage, formatFileSize, type CompressionOptions } from "@/lib/image-utils";

interface ImageCompressorProps {
  file: File;
  onCompressed: (compressedFile: File) => void;
  onCancel: () => void;
}

export function ImageCompressor({ file, onCompressed, onCancel }: ImageCompressorProps) {
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [compressionOptions, setCompressionOptions] = useState<CompressionOptions>({
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.8,
    format: 'jpeg'
  });

  const handleCompress = async () => {
    try {
      setIsCompressing(true);
      setProgress(0);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const result = await compressImage(file, compressionOptions);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setTimeout(() => {
        onCompressed(result.file);
      }, 500);
      
    } catch (error) {
      console.error('Compression failed:', error);
      setIsCompressing(false);
      setProgress(0);
    }
  };

  const estimatedSize = Math.round(file.size * (compressionOptions.quality || 0.8) * 0.7);

  return (
    <div className="bg-white border rounded-lg p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Compress Image</h3>
        <p className="text-sm text-gray-600">
          Reduce file size while maintaining quality for faster uploads and processing.
        </p>
      </div>

      {/* Compression Options */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Width (pixels)
          </label>
          <input
            type="number"
            value={compressionOptions.maxWidth}
            onChange={(e) => setCompressionOptions(prev => ({
              ...prev,
              maxWidth: parseInt(e.target.value) || 1920
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isCompressing}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Height (pixels)
          </label>
          <input
            type="number"
            value={compressionOptions.maxHeight}
            onChange={(e) => setCompressionOptions(prev => ({
              ...prev,
              maxHeight: parseInt(e.target.value) || 1080
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isCompressing}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quality: {Math.round((compressionOptions.quality || 0.8) * 100)}%
          </label>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={compressionOptions.quality}
            onChange={(e) => setCompressionOptions(prev => ({
              ...prev,
              quality: parseFloat(e.target.value)
            }))}
            className="w-full"
            disabled={isCompressing}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Output Format
          </label>
          <select
            value={compressionOptions.format}
            onChange={(e) => setCompressionOptions(prev => ({
              ...prev,
              format: e.target.value as 'jpeg' | 'png' | 'webp'
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isCompressing}
          >
            <option value="jpeg">JPEG</option>
            <option value="png">PNG</option>
            <option value="webp">WebP</option>
          </select>
        </div>
      </div>

      {/* Size Comparison */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center text-sm">
          <span>Original Size:</span>
          <span className="font-medium">{formatFileSize(file.size)}</span>
        </div>
        <div className="flex justify-between items-center text-sm mt-1">
          <span>Estimated Size:</span>
          <span className="font-medium text-green-600">{formatFileSize(estimatedSize)}</span>
        </div>
        <div className="flex justify-between items-center text-sm mt-1">
          <span>Estimated Savings:</span>
          <span className="font-medium text-blue-600">
            {Math.round((1 - estimatedSize / file.size) * 100)}%
          </span>
        </div>
      </div>

      {/* Progress */}
      {isCompressing && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Compressing...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-3">
        <Button 
          onClick={handleCompress} 
          disabled={isCompressing}
          className="flex-1"
        >
          {isCompressing ? 'Compressing...' : 'Compress Image'}
        </Button>
        <Button 
          onClick={onCancel} 
          variant="outline"
          disabled={isCompressing}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}