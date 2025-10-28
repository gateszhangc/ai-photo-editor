"use client";

import { useState } from "react";
import { PhotoUploader } from "@/components/upload/photo-uploader";
import { SimpleCanvas } from "@/components/editor/simple-canvas";
import { ToolPanel, type FilterParameters } from "@/components/editor/tool-panel";
import { ExportPanel, type ExportOptions } from "@/components/editor/export-panel";
import { HistoryPanel } from "@/components/editor/history-panel";
import { useEditHistory } from "@/hooks/use-edit-history";
import { Button } from "@/components/ui/button";

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

export default function EditorPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [parameters, setParameters] = useState<FilterParameters>(defaultParameters);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  const {
    history,
    currentIndex,
    canUndo,
    canRedo,
    addStep,
    undo,
    redo,
    jumpToStep,
    clearHistory,
  } = useEditHistory({ maxSteps: 20 });

  const handleFileReady = (file: File, url: string) => {
    setSelectedFile(file);
    setImageUrl(url);
    
    // Add initial step to history
    addStep('upload', 'Photo uploaded', { filename: file.name, size: file.size });
  };

  const handleReset = () => {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
    setSelectedFile(null);
    setImageUrl(null);
    setParameters(defaultParameters);
  };

  const handleParameterChange = (key: keyof FilterParameters, value: number) => {
    const oldValue = parameters[key];
    setParameters(prev => ({ ...prev, [key]: value }));
    
    // Add to history if value actually changed
    if (oldValue !== value) {
      addStep(
        key,
        `Adjusted ${key} to ${value > 0 ? '+' : ''}${value}`,
        { [key]: value, previousValue: oldValue }
      );
    }
  };

  const handleResetParameters = () => {
    const hasChanges = Object.entries(parameters).some(
      ([key, value]) => value !== defaultParameters[key as keyof FilterParameters]
    );
    
    if (hasChanges) {
      setParameters(defaultParameters);
      addStep('reset', 'Reset all parameters', { parameters: defaultParameters });
    }
  };

  const handleAIEnhance = async (mode: string) => {
    setIsProcessing(true);
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Apply some mock enhancements based on mode
      const enhancements: Partial<FilterParameters> = {
        portrait: { brightness: 10, contrast: 15, saturation: 5 },
        landscape: { contrast: 20, saturation: 15, sharpness: 10 },
        night: { brightness: 25, exposure: 15, shadows: 20 },
        black_white: { saturation: -100, contrast: 25 },
        artistic: { saturation: 30, temperature: 10, contrast: 10 },
      }[mode] || {};
      
      setParameters(prev => ({ ...prev, ...enhancements }));
      
      // Add to history
      addStep(
        'ai_enhance',
        `Applied ${mode} enhancement`,
        { mode, enhancements }
      );
    } catch (error) {
      console.error('AI enhancement failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExport = async (options: ExportOptions) => {
    setIsExporting(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real implementation, this would process the image and trigger download
      console.log('Exporting with options:', options);
      
      // Mock download
      const link = document.createElement('a');
      link.href = imageUrl || '';
      link.download = `edited-photo.${options.format}`;
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleUndo = () => {
    const previousStep = undo();
    if (previousStep) {
      // Reconstruct parameters from history
      const newParameters = { ...defaultParameters };
      
      // Apply all steps up to the previous one
      for (let i = 0; i <= currentIndex - 1; i++) {
        const step = history[i];
        if (step.action !== 'upload' && step.action !== 'ai_enhance') {
          if (step.parameters[step.action] !== undefined) {
            newParameters[step.action as keyof FilterParameters] = step.parameters[step.action];
          }
        } else if (step.action === 'ai_enhance') {
          Object.assign(newParameters, step.parameters.enhancements);
        }
      }
      
      setParameters(newParameters);
    }
  };

  const handleRedo = () => {
    const nextStep = redo();
    if (nextStep) {
      // Apply the next step
      if (nextStep.action !== 'upload' && nextStep.action !== 'ai_enhance') {
        if (nextStep.parameters[nextStep.action] !== undefined) {
          setParameters(prev => ({
            ...prev,
            [nextStep.action]: nextStep.parameters[nextStep.action]
          }));
        }
      } else if (nextStep.action === 'ai_enhance') {
        setParameters(prev => ({ ...prev, ...nextStep.parameters.enhancements }));
      }
    }
  };

  const handleJumpToStep = (stepId: string) => {
    const step = jumpToStep(stepId);
    if (step) {
      // Reconstruct parameters from history up to this step
      const newParameters = { ...defaultParameters };
      
      const stepIndex = history.findIndex(s => s.id === stepId);
      for (let i = 0; i <= stepIndex; i++) {
        const historyStep = history[i];
        if (historyStep.action !== 'upload' && historyStep.action !== 'ai_enhance') {
          if (historyStep.parameters[historyStep.action] !== undefined) {
            newParameters[historyStep.action as keyof FilterParameters] = historyStep.parameters[historyStep.action];
          }
        } else if (historyStep.action === 'ai_enhance') {
          Object.assign(newParameters, historyStep.parameters.enhancements);
        }
      }
      
      setParameters(newParameters);
    }
  };

  const handleClearHistory = () => {
    clearHistory();
    setParameters(defaultParameters);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Photo Editor</h1>
        <p className="text-gray-600">
          Upload your photo and start editing with AI-powered tools
        </p>
      </div>

      {!selectedFile ? (
        <div className="max-w-2xl mx-auto">
          <PhotoUploader onFileReady={handleFileReady} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Image Canvas Area */}
          <div className="lg:col-span-3">
            <SimpleCanvas
              imageUrl={imageUrl || ""}
              alt="Selected photo"
              className="min-h-[500px]"
            />
            
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {selectedFile.name} ({Math.round(selectedFile.size / 1024)}KB)
              </div>
              <Button variant="outline" onClick={handleReset}>
                Upload New Photo
              </Button>
            </div>
          </div>

          {/* Tools Panel */}
          <div className="lg:col-span-1 space-y-4">
            <ToolPanel
              parameters={parameters}
              onParameterChange={handleParameterChange}
              onReset={handleResetParameters}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onAIEnhance={handleAIEnhance}
              canUndo={canUndo}
              canRedo={canRedo}
              isProcessing={isProcessing}
            />
            
            <HistoryPanel
              history={history}
              currentIndex={currentIndex}
              onJumpToStep={handleJumpToStep}
              onClearHistory={handleClearHistory}
              canUndo={canUndo}
              canRedo={canRedo}
              onUndo={handleUndo}
              onRedo={handleRedo}
            />
            
            <ExportPanel
              originalSize={selectedFile?.size}
              onExport={handleExport}
              isExporting={isExporting}
            />
          </div>
        </div>
      )}
    </div>
  );
}