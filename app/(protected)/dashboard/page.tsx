/**
 * Dashboard Page - Senior Design Engineer Level
 * Beautiful dashboard with staggered card animations
 */

'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import FeatureCard from '@/components/FeatureCard';
import { FileText, Mail, Target, Globe } from 'lucide-react';

export default function DashboardPage() {
  const { user, requireAuth, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  /**
   * Handle mount animation trigger
   */
  useEffect(() => {
    setMounted(true);
  }, []);

  /**
   * Require authentication on mount
   */
  useEffect(() => {
    requireAuth();
  }, [requireAuth]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* Navigation Header - Fade in from top */}
      <div
        className={`transition-all duration-500 ease-out ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'
        }`}
      >
        <Navigation />
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-[1280px] px-8 lg:px-10 py-12 lg:py-16">
        {/* Welcome Section - Fade in after header */}
        <div
          className={`mb-12 transition-all duration-400 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: '100ms' }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight -tracking-[0.5px]">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-base text-gray-600 font-normal">
            Choose what you&apos;d like to do today
          </p>
        </div>

        {/* Feature Cards Grid - Staggered entrance */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
          {/* Card 1: Resume Editor */}
          <FeatureCard
            icon={FileText}
            title="Resume Editor"
            description="Upload, edit, and optimize your resume with AI-powered suggestions and formatting tools."
            route="/resume-editor"
            delay="200ms"
          />

          {/* Card 2: Cover Letter Generator */}
          <FeatureCard
            icon={Mail}
            title="Cover Letter Generator"
            description="Generate tailored cover letters from job descriptions in seconds with AI assistance."
            route="/cover-letter"
            delay="300ms"
          />

          {/* Card 3: Skills Analysis */}
          <FeatureCard
            icon={Target}
            title="Skills Analysis"
            description="Compare your skills with job requirements and get personalized recommendations."
            route="/skills-analysis"
            delay="400ms"
          />

          {/* Card 4: Portfolio Generator */}
          <FeatureCard
            icon={Globe}
            title="Portfolio Generator"
            description="Create a beautiful portfolio website to showcase your projects and achievements."
            route="/portfolio-builder"
            delay="500ms"
          />
        </div>

        {/* Additional Info Section */}
        <div
          className={`mt-12 text-center transition-all duration-400 ease-out ${
            mounted ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: '600ms' }}
        >
          <p className="text-xs text-gray-500">
            All tools are powered by AI to help you land your dream job
          </p>
        </div>
      </main>
    </div>
  );
}
