/**
 * Authentication Utilities
 * This file contains all authentication-related functions including
 * login, signup, logout, and token management
 */

import { User, AuthToken, LoginCredentials, SignupCredentials } from '@/types';

// LocalStorage keys
const AUTH_TOKEN_KEY = 'authToken';
const USERS_KEY = 'users';

// Default test credentials
const DEFAULT_USER: User = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
  createdAt: new Date().toISOString(),
};

/**
 * Initialize the users database in localStorage with default test user
 * This runs once to ensure the test user exists
 */
export const initializeUsers = (): void => {
  if (typeof window === 'undefined') return;

  const existingUsers = localStorage.getItem(USERS_KEY);
  if (!existingUsers) {
    localStorage.setItem(USERS_KEY, JSON.stringify([DEFAULT_USER]));
  }
};

/**
 * Get all users from localStorage
 */
const getUsers = (): User[] => {
  if (typeof window === 'undefined') return [];

  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

/**
 * Save users to localStorage
 */
const saveUsers = (users: User[]): void => {
  if (typeof window === 'undefined') return;

  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

/**
 * Generate a mock JWT token
 * In production, this would be done on the server
 */
const generateToken = (user: User): string => {
  const payload = {
    userId: user.id,
    email: user.email,
    timestamp: Date.now(),
  };

  // Simple base64 encoding (NOT secure for production!)
  return btoa(JSON.stringify(payload));
};

/**
 * Create auth token object
 */
const createAuthToken = (user: User): AuthToken => {
  const token = generateToken(user);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiration

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    expiresAt: expiresAt.toISOString(),
  };
};

/**
 * Save auth token to localStorage
 */
export const saveAuthToken = (authToken: AuthToken): void => {
  if (typeof window === 'undefined') return;

  localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(authToken));
};

/**
 * Get auth token from localStorage
 */
export const getAuthToken = (): AuthToken | null => {
  if (typeof window === 'undefined') return null;

  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) return null;

  try {
    const authToken: AuthToken = JSON.parse(token);

    // Check if token is expired
    if (new Date(authToken.expiresAt) < new Date()) {
      removeAuthToken();
      return null;
    }

    return authToken;
  } catch (error) {
    return null;
  }
};

/**
 * Remove auth token from localStorage
 */
export const removeAuthToken = (): void => {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(AUTH_TOKEN_KEY);
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return getAuthToken() !== null;
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

/**
 * Login function
 * Validates credentials and creates auth token
 */
export const login = async (credentials: LoginCredentials): Promise<AuthToken> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Initialize users if needed
  initializeUsers();

  const users = getUsers();
  const user = users.find(
    u => u.email === credentials.email && u.password === credentials.password
  );

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const authToken = createAuthToken(user);
  saveAuthToken(authToken);

  return authToken;
};

/**
 * Signup function
 * Creates new user and returns auth token
 */
export const signup = async (credentials: SignupCredentials): Promise<AuthToken> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Validate input
  if (!credentials.name || credentials.name.length < 3) {
    throw new Error('Name must be at least 3 characters long');
  }

  if (!validateEmail(credentials.email)) {
    throw new Error('Invalid email format');
  }

  if (!validatePassword(credentials.password)) {
    throw new Error('Password must be at least 8 characters long');
  }

  if (credentials.password !== credentials.confirmPassword) {
    throw new Error('Passwords do not match');
  }

  if (!credentials.agreeToTerms) {
    throw new Error('You must agree to the terms and conditions');
  }

  // Initialize users if needed
  initializeUsers();

  const users = getUsers();

  // Check if user already exists
  if (users.some(u => u.email === credentials.email)) {
    throw new Error('An account with this email already exists');
  }

  // Create new user
  const newUser: User = {
    id: Date.now().toString(),
    name: credentials.name,
    email: credentials.email,
    password: credentials.password,
    createdAt: new Date().toISOString(),
  };

  // Save new user
  users.push(newUser);
  saveUsers(users);

  // Create and save auth token
  const authToken = createAuthToken(newUser);
  saveAuthToken(authToken);

  return authToken;
};

/**
 * Logout function
 * Removes auth token from localStorage
 */
export const logout = (): void => {
  removeAuthToken();
};

/**
 * Get current user from auth token
 */
export const getCurrentUser = (): AuthToken['user'] | null => {
  const authToken = getAuthToken();
  return authToken ? authToken.user : null;
};
