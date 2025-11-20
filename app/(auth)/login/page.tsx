/**
 * Login Page - Gen Z Design
 * Bold, distinctive, atmospheric aesthetic
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { LoginCredentials } from '@/types';
import { Sparkles, Zap, Target, Rocket, ArrowRight } from 'lucide-react';
import { Button, Input } from '@/components/ui';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();

  // Form state
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(credentials);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex min-h-screen relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--brand)] opacity-10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--accent)] opacity-10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Hero Section (Left 55%) - Dark with Gradient */}
      <div
        className={`hidden lg:flex lg:w-[55%] p-16 flex-col justify-center relative transition-opacity duration-700 ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="max-w-[580px] mx-auto relative z-10">
          {/* Brand Logo/Name */}
          <div
            className={`mb-8 transition-all duration-500 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--brand)] to-[var(--accent-secondary)] flex items-center justify-center shadow-[0_0_30px_rgba(0,217,255,0.3)]">
                <Sparkles className="w-6 h-6 text-[var(--bg-primary)]" strokeWidth={2.5} />
              </div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)] font-[var(--font-display)]">
                PortfolioMaker
              </h1>
            </div>
          </div>

          {/* Main Heading with Gradient Text */}
          <h2
            className={`text-5xl font-extrabold mb-6 leading-[1.1] tracking-tight transition-all duration-500 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <span className="gradient-text font-[var(--font-display)]">
              Build Your Future,
            </span>
            <br />
            <span className="text-[var(--text-primary)] font-[var(--font-display)]">
              One Portfolio at a Time
            </span>
          </h2>

          {/* Tagline */}
          <p
            className={`text-lg text-[var(--text-secondary)] mb-12 leading-relaxed font-[var(--font-body)] transition-all duration-500 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            Create stunning, AI-powered portfolios that make you stand out.
            Fast, modern, and ridiculously easy.
          </p>

          {/* Features List with Icons */}
          <div className="space-y-5">
            {[
              {
                icon: <Zap className="w-5 h-5" />,
                text: 'AI-powered resume optimization',
                delay: '400ms',
                color: 'var(--brand)',
              },
              {
                icon: <Sparkles className="w-5 h-5" />,
                text: 'Instant cover letter generation',
                delay: '500ms',
                color: 'var(--accent)',
              },
              {
                icon: <Target className="w-5 h-5" />,
                text: 'Smart skill matching analysis',
                delay: '600ms',
                color: 'var(--accent-secondary)',
              },
              {
                icon: <Rocket className="w-5 h-5" />,
                text: 'Beautiful portfolio deployment',
                delay: '700ms',
                color: 'var(--brand-light)',
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`flex items-center gap-4 group transition-all duration-500 ${
                  mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                }`}
                style={{ transitionDelay: item.delay }}
              >
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, ${item.color}22 0%, ${item.color}11 100%)`,
                    border: `1px solid ${item.color}33`,
                  }}
                >
                  <div style={{ color: item.color }}>
                    {item.icon}
                  </div>
                </div>
                <span className="text-base text-[var(--text-primary)] font-medium font-[var(--font-body)] group-hover:text-[var(--brand-light)] transition-colors">
                  {item.text}
                </span>
              </div>
            ))}
          </div>

          {/* Social Proof */}
          <div
            className={`mt-12 pt-8 border-t border-[var(--border-subtle)] transition-all duration-500 ${
              mounted ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ transitionDelay: '800ms' }}
          >
            <p className="text-sm text-[var(--text-tertiary)] font-[var(--font-body)]">
              Join <span className="text-[var(--brand)] font-semibold">1,000+</span> professionals
              building their dream careers
            </p>
          </div>
        </div>
      </div>

      {/* Form Section (Right 45%) - Glassmorphism Card */}
      <div
        className={`flex w-full lg:w-[45%] items-center justify-center p-8 relative transition-opacity duration-500 ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionDelay: '300ms' }}
      >
        <div className="w-full max-w-[440px]">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-10 animate-slide-up">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--brand)] to-[var(--accent-secondary)] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[var(--bg-primary)]" strokeWidth={2.5} />
              </div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)] font-[var(--font-display)]">
                PortfolioMaker
              </h1>
            </div>
            <p className="text-sm text-[var(--text-secondary)] font-[var(--font-body)]">
              Welcome back! Let&apos;s get you signed in.
            </p>
          </div>

          {/* Form Card - Glassmorphism */}
          <div className="glass rounded-2xl p-8 shadow-[var(--shadow-lg)] animate-scale-in animate-delay-100">
            {/* Desktop Header */}
            <div className="hidden lg:block mb-8">
              <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2 font-[var(--font-display)]">
                Welcome Back
              </h2>
              <p className="text-base text-[var(--text-secondary)] font-[var(--font-body)]">
                Sign in to continue building
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div>
                <Input
                  type="email"
                  name="email"
                  label="Email"
                  placeholder="name@example.com"
                  value={credentials.email}
                  onChange={handleChange}
                  required
                  fullWidth
                />
              </div>

              {/* Password Input */}
              <div>
                <Input
                  type="password"
                  name="password"
                  label="Password"
                  placeholder="••••••••••"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  fullWidth
                />
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <Link
                  href="#"
                  className="text-sm text-[var(--brand)] hover:text-[var(--brand-light)] transition-colors font-medium font-[var(--font-body)]"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Error Message */}
              {error && (
                <div className="rounded-lg bg-[rgba(239,68,68,0.1)] border border-[var(--error)] p-4 animate-bounce-in">
                  <p className="text-sm text-[var(--error)] font-medium font-[var(--font-body)]">
                    {error}
                  </p>
                </div>
              )}

              {/* Sign In Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={isLoading}
                  fullWidth
                  icon={!isLoading && <ArrowRight className="w-4 h-4" />}
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </Button>
              </div>

              {/* Divider */}
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[var(--border)]"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] font-medium font-[var(--font-body)]">
                    New here?
                  </span>
                </div>
              </div>

              {/* Sign Up Link */}
              <div className="text-center">
                <Link href="/signup">
                  <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    fullWidth
                  >
                    Create an account
                  </Button>
                </Link>
              </div>
            </form>
          </div>

          {/* Footer Note */}
          <p className="text-center text-xs text-[var(--text-tertiary)] mt-6 font-[var(--font-body)]">
            By signing in, you agree to our{' '}
            <Link href="#" className="text-[var(--brand)] hover:text-[var(--brand-light)] transition-colors">
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link href="#" className="text-[var(--brand)] hover:text-[var(--brand-light)] transition-colors">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
