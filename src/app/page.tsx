"use client";

import { useState } from "react";
import Link from "next/link";
import { PhotoUploader } from "@/components/upload/photo-uploader";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileReady = (file: File, imageUrl: string) => {
    setSelectedFile(file);
    console.log("File ready:", file.name, imageUrl);
  };

  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}
      <section className="py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AI Photo Editor
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Transform your photos with advanced AI technology. Professional editing tools with real-time preview and instant results.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button size="lg" asChild>
            <Link href="/editor">Start Editing</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/gallery">View Gallery</Link>
          </Button>
        </div>
      </section>

      {/* Quick Upload Section */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">
            Quick Start - Upload Your Photo
          </h2>
          <PhotoUploader onFileReady={handleFileReady} />
          
          {selectedFile && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-4">
                Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)}KB)
              </p>
              <Button asChild>
                <Link href="/editor">Continue to Editor</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Powerful AI Features
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🎭</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Enhancement</h3>
            <p className="text-gray-600">
              Automatically enhance your photos with specialized AI models for portraits, landscapes, and more.
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-time Preview</h3>
            <p className="text-gray-600">
              See changes instantly as you adjust brightness, contrast, saturation, and other parameters.
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Mobile Friendly</h3>
            <p className="text-gray-600">
              Edit photos on any device with our responsive design that works perfectly on mobile and desktop.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}