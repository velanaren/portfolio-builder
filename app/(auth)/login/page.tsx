/**
 * Login Page - Senior Design Engineer Level
 * Beautiful 55/45 split-screen with stunning gradient hero and clean form
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { LoginCredentials } from '@/types';
import { Loader2, Eye, EyeOff } from 'lucide-react';

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
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  /**
   * Handle mount animation trigger
   */
  useEffect(() => {
    setMounted(true);
  }, []);

  /**
   * Redirect to dashboard if already authenticated
   */
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, authLoading, router]);

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(credentials);
      // Navigation happens in the login function
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle input changes
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex min-h-screen">
      {/* Hero Section (Left 55%) - Gradient Background */}
      <div
        className={`hidden lg:flex lg:w-[55%] bg-gradient-to-br from-indigo-600 to-pink-500 p-12 text-white flex-col justify-center transition-opacity duration-600 ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="max-w-lg mx-auto">
          {/* App Name - Fade in first */}
          <h1
            className={`text-5xl font-bold text-white mb-3 tracking-tight transition-all duration-400 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            PortfolioMaker
          </h1>

          {/* Tagline - Fade in after title */}
          <p
            className={`text-lg font-normal text-white/90 mb-10 leading-relaxed transition-all duration-400 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '250ms' }}
          >
            Build your professional portfolio with AI
          </p>

          {/* Features List - Staggered fade in */}
          <ul className="space-y-4">
            {[
              { text: 'AI-powered resume optimization', delay: '350ms' },
              { text: 'Instant cover letter generation', delay: '450ms' },
              { text: 'Smart skill matching analysis', delay: '550ms' },
              { text: 'Beautiful portfolio creation', delay: '650ms' },
            ].map((item, index) => (
              <li
                key={index}
                className={`flex items-center space-x-3 transition-all duration-400 ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: item.delay }}
              >
                <svg
                  className="h-5 w-5 flex-shrink-0 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-base text-white/95">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Form Section (Right 45%) - White Background */}
      <div
        className={`flex w-full lg:w-[45%] items-center justify-center p-8 bg-white transition-opacity duration-400 ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionDelay: '300ms' }}
      >
        <div className="w-full max-w-[420px]">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-bold text-indigo-600 mb-2">
              PortfolioMaker
            </h1>
            <p className="text-sm text-gray-600 font-medium">Welcome back</p>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block mb-8">
            <h2 className="text-[32px] font-bold text-gray-900 mb-2 tracking-tight">
              Welcome back
            </h2>
            <p className="text-sm text-gray-600 font-medium">
              Log in to your account
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-gray-900 mb-2 tracking-wide uppercase"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                placeholder="name@example.com"
                required
                className="w-full rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-900 border border-gray-200 focus:bg-white focus:border-indigo-600 focus:ring-3 focus:ring-indigo-600/10 transition-all duration-200 outline-none placeholder:text-gray-400"
              />
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-gray-900 mb-2 tracking-wide uppercase"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-lg bg-gray-50 px-4 py-3 pr-11 text-sm text-gray-900 border border-gray-200 focus:bg-white focus:border-indigo-600 focus:ring-3 focus:ring-indigo-600/10 transition-all duration-200 outline-none placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 transition-colors duration-150"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-[18px] w-[18px]" />
                  ) : (
                    <Eye className="h-[18px] w-[18px]" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3 animate-fade-in">
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </div>
            )}

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 rounded-lg bg-indigo-600 px-6 py-3 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-indigo-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-600/30 active:translate-y-0 active:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>

            {/* Sign Up Link */}
            <div className="text-center mt-5">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <Link
                  href="/signup"
                  className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition-all duration-150"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
