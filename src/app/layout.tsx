import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Photo Editor - Professional AI-Powered Photo Editing",
  description: "Transform your photos with advanced AI technology. Professional photo editing tools with real-time preview, multiple enhancement modes, and easy export options.",
  keywords: "AI photo editor, photo enhancement, image editing, AI filters, photo retouching",
  authors: [{ name: "AI Photo Editor Team" }],
  creator: "AI Photo Editor",
  publisher: "AI Photo Editor",
  openGraph: {
    title: "AI Photo Editor - Professional AI-Powered Photo Editing",
    description: "Transform your photos with advanced AI technology",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Photo Editor",
    description: "Professional AI-powered photo editing platform",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}