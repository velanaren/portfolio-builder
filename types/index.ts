/**
 * Type Definitions for Portfolio Builder Application
 * This file contains all TypeScript types and interfaces used throughout the app
 */

/**
 * User type - Represents a registered user in the application
 */
export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // In production, this would be hashed
  createdAt: string;
}

/**
 * AuthToken type - Represents the authentication token stored in localStorage
 */
export interface AuthToken {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  expiresAt: string;
}

/**
 * LoginCredentials type - Used for login form
 */
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * SignupCredentials type - Used for signup form
 */
export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

/**
 * FeatureCard type - Represents a feature card on the dashboard
 */
export interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  color: string;
}

/**
 * FormErrors type - Generic form validation errors
 */
export interface FormErrors {
  [key: string]: string;
}

/**
 * AuthContextType - Type for authentication context
 */
export interface AuthContextType {
  user: AuthToken['user'] | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}
