/**
 * Signup Page - Premium Design
 * Inspired by CRED.club - Sophisticated, elegant, modern
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { SignupCredentials } from '@/types';
import { validateEmail, validatePassword } from '@/lib/auth';
import { Loader2, Eye, EyeOff } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { signup, isAuthenticated, isLoading: authLoading } = useAuth();

  // Form state
  const [credentials, setCredentials] = useState<SignupCredentials>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    // Validate form
    if (credentials.name.length < 3) {
      setError('Name must be at least 3 characters');
      return;
    }
    if (!validateEmail(credentials.email)) {
      setError('Please enter a valid email');
      return;
    }
    if (!validatePassword(credentials.password)) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (credentials.password !== credentials.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!credentials.agreeToTerms) {
      setError('You must agree to the terms and conditions');
      return;
    }

    setIsLoading(true);

    try {
      await signup(credentials);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setCredentials(prev => ({
      ...prev,
      [name]: newValue,
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
            Start Your Journey
          </h1>

          {/* Tagline */}
          <p
            className={`text-[18px] font-normal text-white/90 mb-16 leading-relaxed transition-all duration-400 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '250ms' }}
          >
            Join thousands of professionals building their career with AI
          </p>

          {/* Features List - Gold Accent Circles */}
          <div className="space-y-6">
            {[
              { text: 'Create your account in seconds', delay: '350ms' },
              { text: 'Upload and optimize your resume', delay: '450ms' },
              { text: 'Generate personalized cover letters', delay: '550ms' },
              { text: 'Build stunning portfolio websites', delay: '650ms' },
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
            <p className="text-[14px] text-[#6B7280] font-medium">Create your account</p>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block mb-8">
            <h2 className="text-[32px] font-bold text-[#0F1419] mb-2 tracking-[-0.5px]">
              Create Account
            </h2>
            <p className="text-[16px] text-[#6B7280] font-medium">
              Get started for free
            </p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input */}
            <div>
              <label
                htmlFor="name"
                className="block text-[14px] font-semibold text-[#0F1419] mb-2.5"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={credentials.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="w-full rounded-lg bg-[#F8FAFB] px-4 py-3.5 text-[14px] text-[#0F1419] border border-[#E5E7EB] focus:bg-white focus:border-[#D4A574] focus:ring-2 focus:ring-[#D4A574]/20 transition-all duration-300 outline-none placeholder:text-[#9CA3AF]"
              />
            </div>

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

            {/* Confirm Password Input */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-[14px] font-semibold text-[#0F1419] mb-2.5"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={credentials.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-lg bg-[#F8FAFB] px-4 py-3.5 pr-11 text-[14px] text-[#0F1419] border border-[#E5E7EB] focus:bg-white focus:border-[#D4A574] focus:ring-2 focus:ring-[#D4A574]/20 transition-all duration-300 outline-none placeholder:text-[#9CA3AF]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#0F1419] transition-colors duration-300"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-[18px] w-[18px]" />
                  ) : (
                    <Eye className="h-[18px] w-[18px]" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start space-x-3 pt-2">
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={credentials.agreeToTerms}
                onChange={handleChange}
                className="mt-0.5 h-4 w-4 rounded border-[#E5E7EB] text-[#D4A574] focus:ring-[#D4A574] focus:ring-offset-0"
              />
              <label
                htmlFor="agreeToTerms"
                className="text-[13px] text-[#6B7280] leading-relaxed"
              >
                I agree to the{' '}
                <a href="#" className="text-[#0F1419] font-semibold hover:text-[#D4A574] transition-colors duration-300">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-[#0F1419] font-semibold hover:text-[#D4A574] transition-colors duration-300">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3.5 animate-fade-in">
                <p className="text-[14px] text-red-600 font-medium">{error}</p>
              </div>
            )}

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 rounded-lg bg-[#D4A574] px-6 py-3 text-[14px] font-semibold text-[#0F1419] transition-all duration-300 hover:bg-[#C89850] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#D4A574]/30 active:translate-y-0 active:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none focus:outline-none focus:ring-2 focus:ring-[#D4A574] focus:ring-offset-2"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating account...
                </span>
              ) : (
                'Create account'
              )}
            </button>

            {/* Sign In Link */}
            <div className="text-center mt-6">
              <p className="text-[14px] text-[#6B7280]">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="font-semibold text-[#0F1419] hover:text-[#D4A574] transition-colors duration-300"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
