"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export interface FilterParameters {
  brightness: number;
  contrast: number;
  saturation: number;
  sharpness: number;
  temperature: number;
  exposure: number;
  highlights: number;
  shadows: number;
}

export interface AIEnhancementMode {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface ToolPanelProps {
  parameters: FilterParameters;
  onParameterChange: (key: keyof FilterParameters, value: number) => void;
  onReset: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onAIEnhance?: (mode: string) => void;
  canUndo?: boolean;
  canRedo?: boolean;
  isProcessing?: boolean;
}

const defaultParameters: FilterParameters = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  sharpness: 0,
  temperature: 0,
  exposure: 0,
  highlights: 0,
  shadows: 0,
};

const aiModes: AIEnhancementMode[] = [
  {
    id: 'portrait',
    name: 'Portrait',
    icon: '🎭',
    description: 'Enhance faces and skin tones'
  },
  {
    id: 'landscape',
    name: 'Landscape',
    icon: '🏞️',
    description: 'Boost colors and details'
  },
  {
    id: 'night',
    name: 'Night Scene',
    icon: '🌙',
    description: 'Brighten dark photos'
  },
  {
    id: 'black_white',
    name: 'Black & White',
    icon: '⚫',
    description: 'Artistic monochrome'
  },
  {
    id: 'artistic',
    name: 'Artistic',
    icon: '🎨',
    description: 'Creative enhancement'
  }
];

export function ToolPanel({
  parameters,
  onParameterChange,
  onReset,
  onUndo,
  onRedo,
  onAIEnhance,
  canUndo = false,
  canRedo = false,
  isProcessing = false,
}: ToolPanelProps) {
  const [activeTab, setActiveTab] = useState<'ai' | 'manual'>('ai');

  const handleSliderChange = (key: keyof FilterParameters, value: string) => {
    onParameterChange(key, parseInt(value));
  };

  const hasChanges = Object.entries(parameters).some(
    ([key, value]) => value !== defaultParameters[key as keyof FilterParameters]
  );

  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('ai')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'ai'
              ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          AI Enhancement
        </button>
        <button
          onClick={() => setActiveTab('manual')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'manual'
              ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Manual Adjust
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* History Controls */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onUndo}
            disabled={!canUndo || isProcessing}
            className="flex-1"
          >
            ↶ Undo
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onRedo}
            disabled={!canRedo || isProcessing}
            className="flex-1"
          >
            ↷ Redo
          </Button>
        </div>

        {activeTab === 'ai' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-3">AI Enhancement Modes</h3>
              <div className="space-y-2">
                {aiModes.map((mode) => (
                  <Button
                    key={mode.id}
                    variant="outline"
                    className="w-full justify-start text-left h-auto p-3"
                    onClick={() => onAIEnhance?.(mode.id)}
                    disabled={isProcessing}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-lg">{mode.icon}</span>
                      <div>
                        <div className="font-medium">{mode.name}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {mode.description}
                        </div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {isProcessing && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm text-blue-700">Processing with AI...</span>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'manual' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-3">Basic Adjustments</h3>
              <div className="space-y-4">
                {/* Brightness */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Brightness
                    </label>
                    <span className="text-sm text-gray-500">
                      {parameters.brightness > 0 ? '+' : ''}{parameters.brightness}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={parameters.brightness}
                    onChange={(e) => handleSliderChange('brightness', e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    disabled={isProcessing}
                  />
                </div>

                {/* Contrast */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Contrast
                    </label>
                    <span className="text-sm text-gray-500">
                      {parameters.contrast > 0 ? '+' : ''}{parameters.contrast}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={parameters.contrast}
                    onChange={(e) => handleSliderChange('contrast', e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    disabled={isProcessing}
                  />
                </div>

                {/* Saturation */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Saturation
                    </label>
                    <span className="text-sm text-gray-500">
                      {parameters.saturation > 0 ? '+' : ''}{parameters.saturation}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={parameters.saturation}
                    onChange={(e) => handleSliderChange('saturation', e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    disabled={isProcessing}
                  />
                </div>

                {/* Temperature */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Temperature
                    </label>
                    <span className="text-sm text-gray-500">
                      {parameters.temperature > 0 ? '+' : ''}{parameters.temperature}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={parameters.temperature}
                    onChange={(e) => handleSliderChange('temperature', e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    disabled={isProcessing}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Advanced</h3>
              <div className="space-y-4">
                {/* Exposure */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Exposure
                    </label>
                    <span className="text-sm text-gray-500">
                      {parameters.exposure > 0 ? '+' : ''}{parameters.exposure}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={parameters.exposure}
                    onChange={(e) => handleSliderChange('exposure', e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    disabled={isProcessing}
                  />
                </div>

                {/* Highlights */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Highlights
                    </label>
                    <span className="text-sm text-gray-500">
                      {parameters.highlights > 0 ? '+' : ''}{parameters.highlights}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={parameters.highlights}
                    onChange={(e) => handleSliderChange('highlights', e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    disabled={isProcessing}
                  />
                </div>

                {/* Shadows */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Shadows
                    </label>
                    <span className="text-sm text-gray-500">
                      {parameters.shadows > 0 ? '+' : ''}{parameters.shadows}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={parameters.shadows}
                    onChange={(e) => handleSliderChange('shadows', e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    disabled={isProcessing}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reset Button */}
        {hasChanges && (
          <div className="pt-4 border-t">
            <Button
              variant="outline"
              onClick={onReset}
              disabled={isProcessing}
              className="w-full"
            >
              Reset All Changes
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}