"use client";

import React, { useState } from "react";

interface SimpleCanvasProps {
  imageUrl: string;
  alt?: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function SimpleCanvas({
  imageUrl,
  alt = "Photo",
  className = "",
  onLoad,
  onError,
}: SimpleCanvasProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  return (
    <div className={`relative bg-gray-100 rounded-lg overflow-hidden ${className}`}>
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading image...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-600 font-medium">Failed to load image</p>
          </div>
        </div>
      )}

      {/* Image */}
      <img
        src={imageUrl}
        alt={alt}
        className={`w-full h-full object-contain ${isLoading || hasError ? 'invisible' : 'visible'}`}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
}