"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";

export interface FilterSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  sharpness: number;
  temperature: number;
  exposure: number;
  highlights: number;
  shadows: number;
}

export interface ImageDimensions {
  width: number;
  height: number;
  naturalWidth: number;
  naturalHeight: number;
}

interface PhotoCanvasProps {
  imageUrl: string;
  filters?: Partial<FilterSettings>;
  onImageLoad?: (dimensions: ImageDimensions) => void;
  onFilterChange?: (filters: FilterSettings) => void;
  className?: string;
}

const defaultFilters: FilterSettings = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  sharpness: 0,
  temperature: 0,
  exposure: 0,
  highlights: 0,
  shadows: 0,
};

export function PhotoCanvas({
  imageUrl,
  filters = {},
  onImageLoad,
  onFilterChange,
  className = "",
}: PhotoCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<ImageDimensions | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const currentFilters = { ...defaultFilters, ...filters };

  // Load and draw image
  const drawImage = useCallback(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    const container = containerRef.current;
    
    if (!canvas || !image || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Calculate canvas size to fit container
    const containerRect = container.getBoundingClientRect();
    const maxWidth = containerRect.width - 32; // Account for padding
    const maxHeight = containerRect.height - 32;
    
    const imageAspect = image.naturalWidth / image.naturalHeight;
    const containerAspect = maxWidth / maxHeight;
    
    let displayWidth, displayHeight;
    
    if (imageAspect > containerAspect) {
      displayWidth = maxWidth;
      displayHeight = maxWidth / imageAspect;
    } else {
      displayHeight = maxHeight;
      displayWidth = maxHeight * imageAspect;
    }

    // Set canvas size
    canvas.width = displayWidth * zoom;
    canvas.height = displayHeight * zoom;
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply filters
    ctx.filter = generateCSSFilter(currentFilters);

    // Draw image with pan offset
    ctx.drawImage(
      image,
      pan.x * zoom,
      pan.y * zoom,
      canvas.width,
      canvas.height
    );

    // Reset filter for future operations
    ctx.filter = 'none';
  }, [currentFilters, zoom, pan]);

  // Generate CSS filter string from filter settings
  const generateCSSFilter = (filters: FilterSettings): string => {
    const filterParts = [];
    
    if (filters.brightness !== 0) {
      filterParts.push(`brightness(${1 + filters.brightness / 100})`);
    }
    
    if (filters.contrast !== 0) {
      filterParts.push(`contrast(${1 + filters.contrast / 100})`);
    }
    
    if (filters.saturation !== 0) {
      filterParts.push(`saturate(${1 + filters.saturation / 100})`);
    }
    
    if (filters.temperature !== 0) {
      // Approximate color temperature with hue rotation
      filterParts.push(`hue-rotate(${filters.temperature * 0.5}deg)`);
    }
    
    if (filters.exposure !== 0) {
      // Simulate exposure with brightness
      filterParts.push(`brightness(${1 + filters.exposure / 50})`);
    }

    return filterParts.length > 0 ? filterParts.join(' ') : 'none';
  };

  // Handle image load
  const handleImageLoad = useCallback(() => {
    const image = imageRef.current;
    if (!image) return;

    const dims: ImageDimensions = {
      width: image.width,
      height: image.height,
      naturalWidth: image.naturalWidth,
      naturalHeight: image.naturalHeight,
    };

    setDimensions(dims);
    setIsLoading(false);
    setError(null);
    onImageLoad?.(dims);
    
    // Draw image after load
    setTimeout(drawImage, 0);
  }, [drawImage, onImageLoad]);

  // Handle image error
  const handleImageError = useCallback(() => {
    setIsLoading(false);
    setError('Failed to load image');
  }, []);

  // Mouse event handlers for pan and zoom
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(prev => Math.max(0.1, Math.min(3, prev + delta)));
  }, []);

  // Reset view
  const resetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  // Fit to container
  const fitToContainer = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  // Redraw when filters change
  useEffect(() => {
    if (!isLoading && !error) {
      drawImage();
    }
  }, [drawImage, isLoading, error]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!isLoading && !error) {
        setTimeout(drawImage, 100);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawImage, isLoading, error]);

  return (
    <div className={`relative bg-gray-100 rounded-lg overflow-hidden ${className}`}>
      {/* Canvas Container */}
      <div
        ref={containerRef}
        className="relative w-full h-full min-h-[400px] flex items-center justify-center cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading image...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-red-600 font-medium">Error loading image</p>
              <p className="text-gray-500 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className={`max-w-full max-h-full shadow-lg ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px)`,
            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
          }}
        />

        {/* Hidden image for loading */}
        <img
          ref={imageRef}
          src={imageUrl}
          alt="Photo"
          className="hidden"
          onLoad={handleImageLoad}
          onError={handleImageError}
          crossOrigin="anonymous"
        />
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 flex space-x-2">
        <Button
          size="sm"
          variant="outline"
          onClick={resetView}
          className="bg-white/90 backdrop-blur-sm"
        >
          Reset
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={fitToContainer}
          className="bg-white/90 backdrop-blur-sm"
        >
          Fit
        </Button>
      </div>

      {/* Zoom indicator */}
      <div className="absolute bottom-4 left-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
        {Math.round(zoom * 100)}%
      </div>

      {/* Image info */}
      {dimensions && (
        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
          {dimensions.naturalWidth} × {dimensions.naturalHeight}
        </div>
      )}
    </div>
  );
}