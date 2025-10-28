"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <span className="font-bold text-xl">Photo Editor</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Home
          </Link>
          <Link href="/editor" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Editor
          </Link>
          <Link href="/gallery" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Gallery
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            Sign In
          </Button>
          <Button size="sm">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
}