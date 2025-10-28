"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/lib/image-utils";

export interface ExportOptions {
  format: 'jpeg' | 'png' | 'webp';
  quality: number;
  width?: number;
  height?: number;
  maintainAspectRatio: boolean;
  includeMetadata: boolean;
}

interface ExportPanelProps {
  originalSize?: number;
  onExport: (options: ExportOptions) => void;
  isExporting?: boolean;
  className?: string;
}

const defaultOptions: ExportOptions = {
  format: 'jpeg',
  quality: 90,
  maintainAspectRatio: true,
  includeMetadata: false,
};

export function ExportPanel({
  originalSize = 0,
  onExport,
  isExporting = false,
  className = "",
}: ExportPanelProps) {
  const [options, setOptions] = useState<ExportOptions>(defaultOptions);

  const updateOption = <K extends keyof ExportOptions>(
    key: K,
    value: ExportOptions[K]
  ) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const estimatedSize = Math.round(originalSize * (options.quality / 100) * 0.8);

  const formatDescriptions = {
    jpeg: 'Best for photos with many colors. Smaller file size.',
    png: 'Best for images with transparency. Lossless compression.',
    webp: 'Modern format with excellent compression. Smaller than JPEG.',
  };

  const handleExport = () => {
    onExport(options);
  };

  return (
    <div className={`bg-white border rounded-lg p-4 space-y-6 ${className}`}>
      <div>
        <h3 className="font-semibold mb-4">Export Settings</h3>
        
        {/* Format Selection */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Format
            </label>
            <div className="space-y-2">
              {(['jpeg', 'png', 'webp'] as const).map((format) => (
                <label key={format} className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="format"
                    value={format}
                    checked={options.format === format}
                    onChange={(e) => updateOption('format', e.target.value as any)}
                    className="mt-1"
                    disabled={isExporting}
                  />
                  <div>
                    <div className="font-medium text-sm uppercase">{format}</div>
                    <div className="text-xs text-gray-500">
                      {formatDescriptions[format]}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Quality Slider */}
          {options.format !== 'png' && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Quality
                </label>
                <span className="text-sm text-gray-500">{options.quality}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={options.quality}
                onChange={(e) => updateOption('quality', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                disabled={isExporting}
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Smaller</span>
                <span>Higher Quality</span>
              </div>
            </div>
          )}

          {/* Size Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Size Options
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={options.maintainAspectRatio}
                  onChange={(e) => updateOption('maintainAspectRatio', e.target.checked)}
                  disabled={isExporting}
                />
                <span className="text-sm">Maintain aspect ratio</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={options.includeMetadata}
                  onChange={(e) => updateOption('includeMetadata', e.target.checked)}
                  disabled={isExporting}
                />
                <span className="text-sm">Include metadata (EXIF)</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Size Estimation */}
      {originalSize > 0 && (
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">Original size:</span>
              <span className="font-medium">{formatFileSize(originalSize)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estimated size:</span>
              <span className="font-medium text-green-600">
                {formatFileSize(estimatedSize)}
              </span>
            </div>
            {estimatedSize < originalSize && (
              <div className="flex justify-between">
                <span className="text-gray-600">Savings:</span>
                <span className="font-medium text-blue-600">
                  {Math.round((1 - estimatedSize / originalSize) * 100)}%
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Export Buttons */}
      <div className="space-y-2">
        <Button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full"
        >
          {isExporting ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Exporting...</span>
            </div>
          ) : (
            `Download ${options.format.toUpperCase()}`
          )}
        </Button>
        
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              updateOption('format', 'jpeg');
              updateOption('quality', 85);
              handleExport();
            }}
            disabled={isExporting}
          >
            Quick JPEG
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              updateOption('format', 'png');
              handleExport();
            }}
            disabled={isExporting}
          >
            Quick PNG
          </Button>
        </div>
      </div>

      {/* Format Info */}
      <div className="text-xs text-gray-500 space-y-1">
        <p><strong>JPEG:</strong> Best for photos, smaller files</p>
        <p><strong>PNG:</strong> Lossless, supports transparency</p>
        <p><strong>WebP:</strong> Modern format, best compression</p>
      </div>
    </div>
  );
}