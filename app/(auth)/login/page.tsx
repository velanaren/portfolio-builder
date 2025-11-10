/**
 * Login Page - Premium Design
 * Inspired by CRED.club - Sophisticated, elegant, modern
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
    <div className="flex min-h-screen">
      {/* Hero Section (Left 55%) - Dark Navy Gradient */}
      <div
        className={`hidden lg:flex lg:w-[55%] bg-gradient-to-br from-[#1A1F2E] to-[#0F1419] p-16 text-white flex-col justify-center transition-opacity duration-600 ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="max-w-[520px] mx-auto">
          {/* App Name */}
          <h1
            className={`text-[48px] font-bold text-white mb-4 tracking-[-0.5px] leading-tight transition-all duration-400 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            Build Your Professional Portfolio
          </h1>

          {/* Tagline */}
          <p
            className={`text-[18px] font-normal text-white/90 mb-16 leading-relaxed transition-all duration-400 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '250ms' }}
          >
            Create stunning portfolios powered by artificial intelligence
          </p>

          {/* Features List - Gold Accent Circles */}
          <div className="space-y-6">
            {[
              { text: 'AI-powered resume optimization', delay: '350ms' },
              { text: 'Instant cover letter generation', delay: '450ms' },
              { text: 'Smart skill matching analysis', delay: '550ms' },
              { text: 'Beautiful portfolio creation', delay: '650ms' },
            ].map((item, index) => (
              <div
                key={index}
                className={`flex items-center space-x-4 transition-all duration-400 ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: item.delay }}
              >
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-[#D4A574]" />
                <span className="text-[16px] text-white/95 font-normal leading-relaxed">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Section (Right 45%) - White Background */}
      <div
        className={`flex w-full lg:w-[45%] items-center justify-center p-8 bg-white transition-opacity duration-400 ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionDelay: '300ms' }}
      >
        <div className="w-full max-w-[420px] px-4">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-10">
            <h1 className="text-[32px] font-bold text-[#0F1419] mb-2 tracking-[-0.5px]">
              PortfolioMaker
            </h1>
            <p className="text-[14px] text-[#6B7280] font-medium">Welcome back</p>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block mb-10">
            <h2 className="text-[32px] font-bold text-[#0F1419] mb-2 tracking-[-0.5px]">
              Welcome Back
            </h2>
            <p className="text-[16px] text-[#6B7280] font-medium">
              Log in to your account
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-[14px] font-semibold text-[#0F1419] mb-2.5"
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
                className="w-full rounded-lg bg-[#F8FAFB] px-4 py-3.5 text-[14px] text-[#0F1419] border border-[#E5E7EB] focus:bg-white focus:border-[#D4A574] focus:ring-2 focus:ring-[#D4A574]/20 transition-all duration-300 outline-none placeholder:text-[#9CA3AF]"
              />
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-[14px] font-semibold text-[#0F1419] mb-2.5"
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
                  className="w-full rounded-lg bg-[#F8FAFB] px-4 py-3.5 pr-11 text-[14px] text-[#0F1419] border border-[#E5E7EB] focus:bg-white focus:border-[#D4A574] focus:ring-2 focus:ring-[#D4A574]/20 transition-all duration-300 outline-none placeholder:text-[#9CA3AF]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#0F1419] transition-colors duration-300"
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
              <div className="rounded-lg bg-red-50 border border-red-200 p-3.5 animate-fade-in">
                <p className="text-[14px] text-red-600 font-medium">{error}</p>
              </div>
            )}

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 rounded-lg bg-[#D4A574] px-6 py-3 text-[14px] font-semibold text-[#0F1419] transition-all duration-300 hover:bg-[#C89850] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#D4A574]/30 active:translate-y-0 active:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none focus:outline-none focus:ring-2 focus:ring-[#D4A574] focus:ring-offset-2"
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
            <div className="text-center mt-6">
              <p className="text-[14px] text-[#6B7280]">
                Don&apos;t have an account?{' '}
                <Link
                  href="/signup"
                  className="font-semibold text-[#0F1419] hover:text-[#D4A574] transition-colors duration-300"
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
