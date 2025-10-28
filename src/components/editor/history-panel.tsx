"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import type { EditStep } from "@/hooks/use-edit-history";

interface HistoryPanelProps {
  history: EditStep[];
  currentIndex: number;
  onJumpToStep: (stepId: string) => void;
  onClearHistory: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  className?: string;
}

export function HistoryPanel({
  history,
  currentIndex,
  onJumpToStep,
  onClearHistory,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  className = "",
}: HistoryPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getStepIcon = (action: string) => {
    const icons: Record<string, string> = {
      'ai_enhance': '🤖',
      'brightness': '☀️',
      'contrast': '🔆',
      'saturation': '🎨',
      'temperature': '🌡️',
      'exposure': '📸',
      'highlights': '✨',
      'shadows': '🌑',
      'reset': '🔄',
      'upload': '📁',
    };
    
    return icons[action] || '⚙️';
  };

  return (
    <div className={`bg-white border rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">Edit History</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? '−' : '+'}
          </Button>
        </div>
        
        {/* Quick Controls */}
        <div className="flex space-x-2 mt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onUndo}
            disabled={!canUndo}
            className="flex-1"
          >
            ↶ Undo
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onRedo}
            disabled={!canRedo}
            className="flex-1"
          >
            ↷ Redo
          </Button>
        </div>
      </div>

      {/* History List */}
      {isExpanded && (
        <div className="max-h-64 overflow-y-auto">
          {history.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              No edits yet. Start editing to see history.
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {history.map((step, index) => (
                <div
                  key={step.id}
                  className={`
                    flex items-center space-x-3 p-2 rounded cursor-pointer transition-colors
                    ${index === currentIndex 
                      ? 'bg-blue-100 border border-blue-300' 
                      : index <= currentIndex
                        ? 'bg-gray-50 hover:bg-gray-100'
                        : 'bg-gray-25 text-gray-400 hover:bg-gray-50'
                    }
                  `}
                  onClick={() => onJumpToStep(step.id)}
                >
                  {/* Step Icon */}
                  <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-sm">
                    {getStepIcon(step.action)}
                  </div>
                  
                  {/* Step Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {step.description}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatTime(step.timestamp)}
                    </div>
                  </div>
                  
                  {/* Current Indicator */}
                  {index === currentIndex && (
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* Clear History */}
          {history.length > 0 && (
            <div className="p-2 border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearHistory}
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Clear History
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Compact View */}
      {!isExpanded && history.length > 0 && (
        <div className="p-3 text-center">
          <div className="text-sm text-gray-600">
            {history.length} step{history.length !== 1 ? 's' : ''}
          </div>
          {currentIndex >= 0 && (
            <div className="text-xs text-gray-500 mt-1">
              Current: {history[currentIndex]?.description}
            </div>
          )}
        </div>
      )}
    </div>
  );
}