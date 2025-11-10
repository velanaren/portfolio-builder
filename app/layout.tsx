/**
 * Root Layout
 * Main layout component that wraps all pages
 */

import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "PortfolioMaker - Build Your Professional Portfolio",
  description: "Create stunning resumes, cover letters, and portfolio websites with AI-powered tools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
