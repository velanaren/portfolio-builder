/**
 * Signup Page - Senior Design Engineer Level
 * Beautiful 55/45 split-screen matching login page aesthetics
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { SignupCredentials, FormErrors } from '@/types';
import { validateEmail, validatePassword } from '@/lib/auth';
import { Loader2, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

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
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
   * Validate a single field
   */
  const validateField = (name: string, value: string | boolean): string => {
    switch (name) {
      case 'name':
        if (typeof value === 'string' && value.length < 3) {
          return 'Name must be at least 3 characters';
        }
        return '';

      case 'email':
        if (typeof value === 'string' && !validateEmail(value)) {
          return 'Please enter a valid email';
        }
        return '';

      case 'password':
        if (typeof value === 'string' && !validatePassword(value)) {
          return 'Must be at least 8 characters';
        }
        return '';

      case 'confirmPassword':
        if (value !== credentials.password) {
          return 'Passwords do not match';
        }
        return '';

      case 'agreeToTerms':
        if (!value) {
          return 'Required';
        }
        return '';

      default:
        return '';
    }
  };

  /**
   * Handle input changes with real-time validation
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setCredentials(prev => ({
      ...prev,
      [name]: newValue,
    }));

    // Validate if field has been touched
    if (touched[name]) {
      const fieldError = validateField(name, newValue);
      setErrors(prev => ({
        ...prev,
        [name]: fieldError,
      }));
    }
  };

  /**
   * Handle field blur (mark as touched)
   */
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setTouched(prev => ({ ...prev, [name]: true }));

    const fieldError = validateField(name, fieldValue);
    setErrors(prev => ({
      ...prev,
      [name]: fieldError,
    }));
  };

  /**
   * Check if form is valid
   */
  const isFormValid = (): boolean => {
    return (
      credentials.name.length >= 3 &&
      validateEmail(credentials.email) &&
      validatePassword(credentials.password) &&
      credentials.password === credentials.confirmPassword &&
      credentials.agreeToTerms
    );
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      agreeToTerms: true,
    });

    // Validate all fields
    const newErrors: FormErrors = {
      name: validateField('name', credentials.name),
      email: validateField('email', credentials.email),
      password: validateField('password', credentials.password),
      confirmPassword: validateField('confirmPassword', credentials.confirmPassword),
      agreeToTerms: validateField('agreeToTerms', credentials.agreeToTerms),
    };

    setErrors(newErrors);

    // Check if there are any errors
    if (Object.values(newErrors).some(err => err !== '')) {
      return;
    }

    setIsLoading(true);

    try {
      await signup(credentials);
      // Navigation happens in the signup function
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get field status for visual feedback
   */
  const getFieldStatus = (fieldName: string) => {
    if (!touched[fieldName]) return null;
    return errors[fieldName] ? 'error' : 'success';
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
          {/* App Name */}
          <h1
            className={`text-5xl font-bold text-white mb-3 tracking-tight transition-all duration-400 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            Join PortfolioMaker
          </h1>

          {/* Tagline */}
          <p
            className={`text-lg font-normal text-white/90 mb-10 leading-relaxed transition-all duration-400 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '250ms' }}
          >
            Start building your professional future today
          </p>

          {/* Features List */}
          <ul className="space-y-4">
            {[
              { text: 'Free to get started', delay: '350ms' },
              { text: 'AI-powered tools included', delay: '450ms' },
              { text: 'No credit card required', delay: '550ms' },
              { text: 'Cancel anytime', delay: '650ms' },
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
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-[32px] font-bold text-gray-900 mb-2 tracking-tight">
              Create account
            </h2>
            <p className="text-sm text-gray-600 font-medium">
              Get started with your portfolio builder
            </p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Input */}
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-semibold text-gray-900 mb-2 tracking-wide uppercase"
              >
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={credentials.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="John Doe"
                  required
                  className={`w-full rounded-lg px-4 py-3 text-sm text-gray-900 border transition-all duration-200 outline-none placeholder:text-gray-400 ${
                    getFieldStatus('name') === 'error'
                      ? 'bg-red-50 border-red-300 focus:border-red-500 focus:ring-3 focus:ring-red-500/10'
                      : getFieldStatus('name') === 'success'
                      ? 'bg-green-50 border-green-300 focus:border-green-500 focus:ring-3 focus:ring-green-500/10'
                      : 'bg-gray-50 border-gray-200 focus:bg-white focus:border-indigo-600 focus:ring-3 focus:ring-indigo-600/10'
                  }`}
                />
                {getFieldStatus('name') === 'success' && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                )}
              </div>
              {touched.name && errors.name && (
                <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.name}</p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-gray-900 mb-2 tracking-wide uppercase"
              >
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="name@example.com"
                  required
                  className={`w-full rounded-lg px-4 py-3 text-sm text-gray-900 border transition-all duration-200 outline-none placeholder:text-gray-400 ${
                    getFieldStatus('email') === 'error'
                      ? 'bg-red-50 border-red-300 focus:border-red-500 focus:ring-3 focus:ring-red-500/10'
                      : getFieldStatus('email') === 'success'
                      ? 'bg-green-50 border-green-300 focus:border-green-500 focus:ring-3 focus:ring-green-500/10'
                      : 'bg-gray-50 border-gray-200 focus:bg-white focus:border-indigo-600 focus:ring-3 focus:ring-indigo-600/10'
                  }`}
                />
                {getFieldStatus('email') === 'success' && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                )}
              </div>
              {touched.email && errors.email && (
                <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.email}</p>
              )}
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
                  onBlur={handleBlur}
                  placeholder="••••••••"
                  required
                  className={`w-full rounded-lg px-4 py-3 pr-11 text-sm text-gray-900 border transition-all duration-200 outline-none placeholder:text-gray-400 ${
                    getFieldStatus('password') === 'error'
                      ? 'bg-red-50 border-red-300 focus:border-red-500 focus:ring-3 focus:ring-red-500/10'
                      : getFieldStatus('password') === 'success'
                      ? 'bg-green-50 border-green-300 focus:border-green-500 focus:ring-3 focus:ring-green-500/10'
                      : 'bg-gray-50 border-gray-200 focus:bg-white focus:border-indigo-600 focus:ring-3 focus:ring-indigo-600/10'
                  }`}
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
              {touched.password && errors.password && (
                <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-semibold text-gray-900 mb-2 tracking-wide uppercase"
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
                  onBlur={handleBlur}
                  placeholder="••••••••"
                  required
                  className={`w-full rounded-lg px-4 py-3 pr-11 text-sm text-gray-900 border transition-all duration-200 outline-none placeholder:text-gray-400 ${
                    getFieldStatus('confirmPassword') === 'error'
                      ? 'bg-red-50 border-red-300 focus:border-red-500 focus:ring-3 focus:ring-red-500/10'
                      : getFieldStatus('confirmPassword') === 'success'
                      ? 'bg-green-50 border-green-300 focus:border-green-500 focus:ring-3 focus:ring-green-500/10'
                      : 'bg-gray-50 border-gray-200 focus:bg-white focus:border-indigo-600 focus:ring-3 focus:ring-indigo-600/10'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 transition-colors duration-150"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-[18px] w-[18px]" />
                  ) : (
                    <Eye className="h-[18px] w-[18px]" />
                  )}
                </button>
              </div>
              {touched.confirmPassword && errors.confirmPassword && (
                <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div>
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  name="agreeToTerms"
                  checked={credentials.agreeToTerms}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="h-4 w-4 mt-0.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
                <label
                  htmlFor="agreeToTerms"
                  className="ml-2 text-xs text-gray-700 leading-relaxed"
                >
                  I agree to the{' '}
                  <span className="text-indigo-600 hover:underline cursor-pointer font-medium">
                    terms and conditions
                  </span>
                </label>
              </div>
              {touched.agreeToTerms && errors.agreeToTerms && (
                <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.agreeToTerms}</p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3 animate-fade-in">
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </div>
            )}

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={isLoading || !isFormValid()}
              className="w-full mt-2 rounded-lg bg-indigo-600 px-6 py-3 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-indigo-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-600/30 active:translate-y-0 active:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
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

            {/* Login Link */}
            <div className="text-center mt-5">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition-all duration-150"
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
