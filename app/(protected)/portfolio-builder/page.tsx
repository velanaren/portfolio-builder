/**
 * Portfolio Builder Page (Placeholder)
 * This feature will be built in a future phase
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import { Globe, ArrowLeft } from 'lucide-react';

export default function PortfolioBuilderPage() {
  const router = useRouter();
  const { requireAuth, isLoading } = useAuth();

  useEffect(() => {
    requireAuth();
  }, [requireAuth]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100">
            <Globe className="h-10 w-10 text-indigo-600" />
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Portfolio Generator
          </h1>

          {/* Placeholder Message */}
          <p className="text-xl text-gray-600 mb-8">
            This feature will be built in Phase 5
          </p>

          {/* Feature Description */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8 text-left">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Coming Soon
            </h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Choose from modern, professional templates</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Drag-and-drop interface for easy customization</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Add projects, skills, and work experience</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Fully responsive and mobile-friendly designs</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>One-click deployment to custom domain</span>
              </li>
            </ul>
          </div>

          {/* Back Button */}
          <button
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center space-x-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-indigo-700 hover:scale-105"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </main>
    </div>
  );
}
