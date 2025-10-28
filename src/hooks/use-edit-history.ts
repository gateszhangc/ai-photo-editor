"use client";

import { useState, useCallback, useRef } from 'react';

export interface EditStep {
  id: string;
  timestamp: number;
  action: string;
  description: string;
  parameters: Record<string, any>;
  preview?: string; // Base64 or URL for preview
}

interface UseEditHistoryOptions {
  maxSteps?: number;
  autoSave?: boolean;
}

export function useEditHistory(options: UseEditHistoryOptions = {}) {
  const { maxSteps = 20, autoSave = true } = options;
  
  const [history, setHistory] = useState<EditStep[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const stepIdCounter = useRef(0);

  // Add a new step to history
  const addStep = useCallback((
    action: string,
    description: string,
    parameters: Record<string, any>,
    preview?: string
  ) => {
    const step: EditStep = {
      id: `step_${++stepIdCounter.current}`,
      timestamp: Date.now(),
      action,
      description,
      parameters: { ...parameters },
      preview,
    };

    setHistory(prev => {
      // Remove any steps after current index (when adding after undo)
      const newHistory = prev.slice(0, currentIndex + 1);
      
      // Add new step
      newHistory.push(step);
      
      // Limit history size
      if (newHistory.length > maxSteps) {
        newHistory.shift();
        setCurrentIndex(prev => Math.max(0, prev));
      } else {
        setCurrentIndex(newHistory.length - 1);
      }
      
      return newHistory;
    });
  }, [currentIndex, maxSteps]);

  // Undo to previous step
  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      return history[currentIndex - 1];
    }
    return null;
  }, [currentIndex, history]);

  // Redo to next step
  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(prev => prev + 1);
      return history[currentIndex + 1];
    }
    return null;
  }, [currentIndex, history]);

  // Jump to specific step
  const jumpToStep = useCallback((stepId: string) => {
    const index = history.findIndex(step => step.id === stepId);
    if (index !== -1) {
      setCurrentIndex(index);
      return history[index];
    }
    return null;
  }, [history]);

  // Clear all history
  const clearHistory = useCallback(() => {
    setHistory([]);
    setCurrentIndex(-1);
  }, []);

  // Get current step
  const getCurrentStep = useCallback(() => {
    return currentIndex >= 0 ? history[currentIndex] : null;
  }, [currentIndex, history]);

  // Get all steps up to current index
  const getActiveHistory = useCallback(() => {
    return history.slice(0, currentIndex + 1);
  }, [history, currentIndex]);

  // Check if can undo/redo
  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  // Get step by index relative to current
  const getRelativeStep = useCallback((offset: number) => {
    const targetIndex = currentIndex + offset;
    if (targetIndex >= 0 && targetIndex < history.length) {
      return history[targetIndex];
    }
    return null;
  }, [currentIndex, history]);

  // Export history for saving
  const exportHistory = useCallback(() => {
    return {
      history,
      currentIndex,
      timestamp: Date.now(),
    };
  }, [history, currentIndex]);

  // Import history from saved data
  const importHistory = useCallback((data: {
    history: EditStep[];
    currentIndex: number;
    timestamp: number;
  }) => {
    setHistory(data.history);
    setCurrentIndex(data.currentIndex);
  }, []);

  return {
    // State
    history,
    currentIndex,
    canUndo,
    canRedo,
    
    // Actions
    addStep,
    undo,
    redo,
    jumpToStep,
    clearHistory,
    
    // Getters
    getCurrentStep,
    getActiveHistory,
    getRelativeStep,
    
    // Import/Export
    exportHistory,
    importHistory,
  };
}