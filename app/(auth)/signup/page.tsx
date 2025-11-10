/**
 * Signup Page
 * Beautiful split-screen signup page with validation
 * Includes real-time form validation and password visibility toggle
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { SignupCredentials, FormErrors } from '@/types';
import { validateEmail, validatePassword } from '@/lib/auth';
import { Loader2, CheckCircle2, Eye, EyeOff, XCircle } from 'lucide-react';

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
          return 'Please enter a valid email address';
        }
        return '';

      case 'password':
        if (typeof value === 'string' && !validatePassword(value)) {
          return 'Password must be at least 8 characters';
        }
        return '';

      case 'confirmPassword':
        if (value !== credentials.password) {
          return 'Passwords do not match';
        }
        return '';

      case 'agreeToTerms':
        if (!value) {
          return 'You must agree to the terms and conditions';
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
      {/* Left Side - Gradient Background */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-12 text-white flex-col justify-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold mb-6">Join PortfolioMaker</h1>
          <p className="text-xl mb-8 text-indigo-100">
            Start building your professional portfolio today
          </p>
          <ul className="space-y-4">
            <li className="flex items-start space-x-3">
              <CheckCircle2 className="h-6 w-6 flex-shrink-0 mt-0.5" />
              <span className="text-lg">Free to get started</span>
            </li>
            <li className="flex items-start space-x-3">
              <CheckCircle2 className="h-6 w-6 flex-shrink-0 mt-0.5" />
              <span className="text-lg">AI-powered tools included</span>
            </li>
            <li className="flex items-start space-x-3">
              <CheckCircle2 className="h-6 w-6 flex-shrink-0 mt-0.5" />
              <span className="text-lg">No credit card required</span>
            </li>
            <li className="flex items-start space-x-3">
              <CheckCircle2 className="h-6 w-6 flex-shrink-0 mt-0.5" />
              <span className="text-lg">Cancel anytime</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Create your account
            </h2>
            <p className="text-gray-600">
              Get started with your portfolio builder
            </p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name Input */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
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
                  className={`w-full rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-900 border transition-colors outline-none ${
                    getFieldStatus('name') === 'error'
                      ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500'
                      : getFieldStatus('name') === 'success'
                      ? 'border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-500'
                      : 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500'
                  }`}
                />
                {getFieldStatus('name') === 'success' && (
                  <CheckCircle2 className="absolute right-3 top-3 h-5 w-5 text-green-500" />
                )}
              </div>
              {touched.name && errors.name && (
                <p className="mt-1 text-xs text-red-600 flex items-center">
                  <XCircle className="h-3 w-3 mr-1" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
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
                  placeholder="your@email.com"
                  required
                  className={`w-full rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-900 border transition-colors outline-none ${
                    getFieldStatus('email') === 'error'
                      ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500'
                      : getFieldStatus('email') === 'success'
                      ? 'border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-500'
                      : 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500'
                  }`}
                />
                {getFieldStatus('email') === 'success' && (
                  <CheckCircle2 className="absolute right-3 top-3 h-5 w-5 text-green-500" />
                )}
              </div>
              {touched.email && errors.email && (
                <p className="mt-1 text-xs text-red-600 flex items-center">
                  <XCircle className="h-3 w-3 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
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
                  className={`w-full rounded-lg bg-gray-50 px-4 py-3 pr-10 text-sm text-gray-900 border transition-colors outline-none ${
                    getFieldStatus('password') === 'error'
                      ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500'
                      : getFieldStatus('password') === 'success'
                      ? 'border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-500'
                      : 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {touched.password && errors.password && (
                <p className="mt-1 text-xs text-red-600 flex items-center">
                  <XCircle className="h-3 w-3 mr-1" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
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
                  className={`w-full rounded-lg bg-gray-50 px-4 py-3 pr-10 text-sm text-gray-900 border transition-colors outline-none ${
                    getFieldStatus('confirmPassword') === 'error'
                      ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500'
                      : getFieldStatus('confirmPassword') === 'success'
                      ? 'border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-500'
                      : 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {touched.confirmPassword && errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600 flex items-center">
                  <XCircle className="h-3 w-3 mr-1" />
                  {errors.confirmPassword}
                </p>
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
                  className="h-4 w-4 mt-1 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor="agreeToTerms"
                  className="ml-2 text-sm text-gray-700"
                >
                  I agree to the{' '}
                  <span className="text-indigo-600 hover:underline cursor-pointer">
                    terms and conditions
                  </span>
                </label>
              </div>
              {touched.agreeToTerms && errors.agreeToTerms && (
                <p className="mt-1 text-xs text-red-600 flex items-center">
                  <XCircle className="h-3 w-3 mr-1" />
                  {errors.agreeToTerms}
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Signup Button */}
            <button
              type="submit"
              disabled={isLoading || !isFormValid()}
              className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-indigo-700 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating account...
                </span>
              ) : (
                'Sign Up'
              )}
            </button>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
                >
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
