/**
 * Custom Authentication Hook
 * This hook provides authentication state and methods throughout the application
 * Usage: const { user, login, logout, isAuthenticated } = useAuth();
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  login as authLogin,
  signup as authSignup,
  logout as authLogout,
  getCurrentUser,
  isAuthenticated as checkAuth,
  initializeUsers,
} from '@/lib/auth';
import { LoginCredentials, SignupCredentials, AuthToken } from '@/types';

/**
 * useAuth Hook
 * Manages authentication state and provides auth methods
 */
export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<AuthToken['user'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Initialize authentication state on mount
   * Checks if user is already logged in
   */
  useEffect(() => {
    // Initialize users database
    initializeUsers();

    // Check if user is authenticated
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setIsAuthenticated(true);
    }

    setIsLoading(false);
  }, []);

  /**
   * Login method
   * Validates credentials and sets user state
   */
  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      setIsLoading(true);
      const authToken = await authLogin(credentials);
      setUser(authToken.user);
      setIsAuthenticated(true);
      router.push('/dashboard');
    } catch (error) {
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Signup method
   * Creates new user account and logs them in
   */
  const signup = async (credentials: SignupCredentials): Promise<void> => {
    try {
      setIsLoading(true);
      const authToken = await authSignup(credentials);
      setUser(authToken.user);
      setIsAuthenticated(true);
      router.push('/dashboard');
    } catch (error) {
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout method
   * Clears user state and redirects to login
   */
  const logout = (): void => {
    authLogout();
    setUser(null);
    setIsAuthenticated(false);
    router.push('/login');
  };

  /**
   * Require authentication
   * Redirects to login if not authenticated
   */
  const requireAuth = (): void => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  };

  return {
    user,
    login,
    signup,
    logout,
    isAuthenticated,
    isLoading,
    requireAuth,
  };
}
