/**
 * Dashboard Page
 * Main dashboard showing 4 feature cards for different portfolio tools
 * Protected route - requires authentication
 */

'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import FeatureCard from '@/components/FeatureCard';
import { FileText, Mail, Target, Globe } from 'lucide-react';

export default function DashboardPage() {
  const { user, requireAuth, isLoading } = useAuth();

  /**
   * Require authentication on mount
   */
  useEffect(() => {
    requireAuth();
  }, [requireAuth]);

  // Show loading state
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
      {/* Navigation Header */}
      <Navigation />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-xl text-gray-600">
            Choose what you&apos;d like to do today
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:gap-8">
          {/* Card 1: Resume Editor */}
          <FeatureCard
            icon={FileText}
            title="Resume Editor"
            description="Upload, edit, and optimize your resume with AI-powered suggestions and formatting tools."
            route="/resume-editor"
          />

          {/* Card 2: Cover Letter Generator */}
          <FeatureCard
            icon={Mail}
            title="Cover Letter Generator"
            description="Generate tailored cover letters from job descriptions in seconds with AI assistance."
            route="/cover-letter"
          />

          {/* Card 3: Skills Analysis */}
          <FeatureCard
            icon={Target}
            title="Skills Analysis"
            description="Compare your skills with job requirements and get personalized recommendations."
            route="/skills-analysis"
          />

          {/* Card 4: Portfolio Generator */}
          <FeatureCard
            icon={Globe}
            title="Portfolio Generator"
            description="Create a beautiful portfolio website to showcase your projects and achievements."
            route="/portfolio-builder"
          />
        </div>

        {/* Additional Info Section */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            All tools are powered by AI to help you land your dream job
          </p>
        </div>
      </main>
    </div>
  );
}
