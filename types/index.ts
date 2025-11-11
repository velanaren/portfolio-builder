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
  technologies: string[]; // Array of technologies used
  url?: string; // Project URL/link
  startDate?: string; // Project start date
  endDate?: string; // Project end date
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

/**
 * Skills Analysis Types - Used for Phase 6
 */

/**
 * ExtractedSkill - A skill extracted from resume or job description
 */
export interface ExtractedSkill {
  name: string;
  category?: string; // e.g., 'programming', 'framework', 'database', 'tool'
  proficiency?: 'junior' | 'intermediate' | 'expert';
  yearsOfExperience?: number;
}

/**
 * MatchedSkill - A skill that matches between resume and job
 */
export interface MatchedSkill extends ExtractedSkill {
  matchScore: number; // 0-100 percentage
  matchStrength: 'exact' | 'similar' | 'related';
}

/**
 * MissingSkill - A skill the candidate is missing for the job
 */
export interface MissingSkill extends ExtractedSkill {
  importance: 'required' | 'preferred' | 'nice-to-have';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedLearningTime: string; // e.g., "2-4 weeks"
}

/**
 * BonusSkill - A skill the candidate has but job doesn't require
 */
export interface BonusSkill extends ExtractedSkill {
  relevance: 'highly-relevant' | 'somewhat-relevant' | 'tangential';
}

/**
 * SkillsAnalysis - Complete analysis results
 */
export interface SkillsAnalysis {
  matchPercentage: number;
  matchingSkills: MatchedSkill[];
  missingSkills: MissingSkill[];
  bonusSkills: BonusSkill[];
  recommendations: string[];
  summary: string;
}

/**
 * Portfolio Builder Types - Used for Phase 7
 */

/**
 * Portfolio Template Types
 */
export type PortfolioTemplate = 'minimal' | 'creative' | 'professional' | 'artistic';

/**
 * PortfolioContent - Complete portfolio content structure
 */
export interface PortfolioContent {
  personalInfo: {
    name: string;
    title: string;
    bio: string;
    email: string;
    phone: string;
    location: string;
    profileImage?: string;
  };
  sections: {
    about: { enabled: boolean; content: string };
    experience: { enabled: boolean; items: PortfolioExperience[] };
    projects: { enabled: boolean; items: PortfolioProject[] };
    skills: { enabled: boolean; items: string[] };
    education: { enabled: boolean; items: PortfolioEducation[] };
    contact: { enabled: boolean; email: string; phone: string };
  };
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

/**
 * PortfolioExperience - Experience item for portfolio
 */
export interface PortfolioExperience {
  id: string;
  company: string;
  position: string;
  duration: string;
  description: string;
}

/**
 * PortfolioProject - Project item for portfolio
 */
export interface PortfolioProject {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  imageUrl?: string;
}

/**
 * PortfolioEducation - Education item for portfolio
 */
export interface PortfolioEducation {
  id: string;
  school: string;
  degree: string;
  field: string;
  year?: string;
}

/**
 * PortfolioCustomization - Customization settings for portfolio
 */
export interface PortfolioCustomization {
  template: PortfolioTemplate;
  colors: {
    primary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  sections: {
    about: boolean;
    experience: boolean;
    projects: boolean;
    skills: boolean;
    education: boolean;
    contact: boolean;
  };
  darkMode: boolean;
  layout: 'single-column' | 'two-column' | 'sidebar';
}
