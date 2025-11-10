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

/**
 * WorkExperience - Represents a work experience entry
 */
export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

/**
 * Education - Represents an education entry
 */
export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  graduationDate: string;
}

/**
 * Project - Represents a project entry
 */
export interface Project {
  id: string;
  name: string;
  description: string;
  technologies?: string;
}

/**
 * Certification - Represents a certification entry
 */
export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date?: string;
}

/**
 * PersonalInfo - Personal information from resume
 */
export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedIn?: string;
  linkedin?: string; // Alias for linkedIn
  website?: string;
}

/**
 * ParsedResume - Complete parsed resume data structure
 */
export interface ParsedResume {
  personalInfo: PersonalInfo;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: string[];
  projects?: Project[];
  certifications?: Certification[];
}

/**
 * ResumeContextType - Type for resume context
 */
export interface ResumeContextType {
  resume: ParsedResume | null;
  setResume: (resume: ParsedResume | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}
