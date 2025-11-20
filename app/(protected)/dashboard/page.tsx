/**
 * Dashboard Page - Gen Z Design
 * Bold, interactive hub with glassmorphism cards
 */

'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import { FileText, Mail, Target, Globe, Sparkles, ArrowRight } from 'lucide-react';
import { Card, Badge, Spinner } from '@/components/ui';
import Link from 'next/link';

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  route: string;
  delay: string;
  mounted: boolean;
  badge?: string;
  badgeVariant?: 'brand' | 'accent' | 'success';
}

function FeatureCard({ icon: Icon, title, description, route, delay, mounted, badge, badgeVariant = 'brand' }: FeatureCardProps) {
  return (
    <Link href={route}>
      <Card
        variant="glass"
        padding="lg"
        hover
        className={`group cursor-pointer transition-all duration-500 relative overflow-hidden ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ transitionDelay: delay }}
      >
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10">
          {/* Header with Icon and Badge */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--brand)]/20 to-[var(--accent-secondary)]/10 border border-[var(--brand)]/30 flex items-center justify-center group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(0,217,255,0.3)] transition-all duration-300">
              <Icon className="w-7 h-7 text-[var(--brand)]" strokeWidth={2} />
            </div>
            {badge && (
              <Badge variant={badgeVariant} size="sm" dot>
                {badge}
              </Badge>
            )}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3 font-[var(--font-display)] group-hover:text-[var(--brand-light)] transition-colors">
            {title}
          </h3>

          {/* Description */}
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-5 font-[var(--font-body)]">
            {description}
          </p>

          {/* Arrow Link */}
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--brand)] group-hover:gap-3 transition-all duration-300 font-[var(--font-body)]">
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Animated border glow on hover */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 rounded-xl border-2 border-[var(--brand)] animate-glow" />
        </div>
      </Card>
    </Link>
  );
}

export default function DashboardPage() {
  const { user, requireAuth, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    requireAuth();
  }, [requireAuth]);

  if (isLoading) {
    return (
      <Spinner
        fullScreen
        size="xl"
        variant="brand"
        text="Loading your dashboard..."
      />
    );
  }

  return (
    <div className="min-h-screen">
      {/* Navigation Header */}
      <div
        className={`transition-all duration-700 ease-out ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'
        }`}
      >
        <Navigation />
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-[1400px] px-6 lg:px-12 py-12 lg:py-20">
        {/* Welcome Section with Sparkle */}
        <div
          className={`mb-16 transition-all duration-700 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '100ms' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--brand)] to-[var(--accent-secondary)] flex items-center justify-center shadow-[0_0_20px_rgba(0,217,255,0.3)] animate-pulse">
              <Sparkles className="w-5 h-5 text-[var(--bg-primary)]" strokeWidth={2.5} />
            </div>
            <Badge variant="brand" size="md">
              Dashboard
            </Badge>
          </div>

          <h1 className="text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight leading-[1.1] font-[var(--font-display)]">
            <span className="text-[var(--text-primary)]">Welcome back,</span>
            <br />
            <span className="gradient-text">{user?.name || 'User'}</span>
          </h1>

          <p className="text-lg text-[var(--text-secondary)] font-medium max-w-2xl font-[var(--font-body)]">
            Your AI-powered career toolkit. Select a feature below to get started.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
          {/* Card 1: Resume Editor */}
          <FeatureCard
            icon={FileText}
            title="Resume Editor"
            description="Upload, edit, and optimize your resume with AI-powered suggestions and smart formatting tools."
            route="/resume-editor"
            delay="200ms"
            mounted={mounted}
            badge="Popular"
            badgeVariant="brand"
          />

          {/* Card 2: Cover Letter Generator */}
          <FeatureCard
            icon={Mail}
            title="Cover Letter Generator"
            description="Generate tailored, professional cover letters from job descriptions in seconds with AI assistance."
            route="/cover-letter"
            delay="300ms"
            mounted={mounted}
            badge="AI"
            badgeVariant="accent"
          />

          {/* Card 3: Skills Analysis */}
          <FeatureCard
            icon={Target}
            title="Skills Analysis"
            description="Match your skills with job requirements and get personalized recommendations to improve."
            route="/skills-analysis"
            delay="400ms"
            mounted={mounted}
          />

          {/* Card 4: Portfolio Generator */}
          <FeatureCard
            icon={Globe}
            title="Portfolio Generator"
            description="Create a stunning portfolio website to showcase your projects, skills, and achievements."
            route="/portfolio-builder"
            delay="500ms"
            mounted={mounted}
            badge="New"
            badgeVariant="success"
          />
        </div>

        {/* Stats Section */}
        <div
          className={`mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 transition-all duration-700 ${
            mounted ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: '600ms' }}
        >
          {[
            { label: 'Resume Versions', value: '0', color: 'var(--brand)' },
            { label: 'Cover Letters', value: '0', color: 'var(--accent)' },
            { label: 'Skills Analyzed', value: '0', color: 'var(--accent-secondary)' },
            { label: 'Portfolios', value: '0', color: 'var(--success)' },
          ].map((stat, index) => (
            <Card
              key={index}
              variant="glass"
              padding="md"
              className="text-center"
            >
              <div
                className="text-3xl font-bold mb-2 font-[var(--font-display)]"
                style={{ color: stat.color }}
              >
                {stat.value}
              </div>
              <div className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider font-semibold font-[var(--font-body)]">
                {stat.label}
              </div>
            </Card>
          ))}
        </div>

        {/* Tips Section */}
        <div
          className={`mt-16 transition-all duration-700 ${
            mounted ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: '700ms' }}
        >
          <Card variant="glass" padding="lg" className="border-l-4 border-l-[var(--brand)]">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[var(--brand)]/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[var(--brand)]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 font-[var(--font-display)]">
                  Pro Tip
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-[var(--font-body)]">
                  Start by uploading your resume to the Resume Editor. Our AI will analyze it and provide
                  personalized suggestions to improve your content, formatting, and keywords for ATS optimization.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Footer Note */}
        <div
          className={`mt-12 text-center transition-all duration-700 ${
            mounted ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: '800ms' }}
        >
          <p className="text-xs text-[var(--text-tertiary)] font-medium font-[var(--font-body)]">
            All tools are powered by AI to help you land your dream job
          </p>
        </div>
      </main>
    </div>
  );
}
