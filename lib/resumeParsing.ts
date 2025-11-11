/**
 * Resume Parsing Utilities
 * Helper functions for parsing resume files
 * Reuses the existing /api/parse-resume endpoint from Phase 2
 */

import { ParsedResume } from '@/types';

export interface ParseResult {
  success: boolean;
  resumeData?: ParsedResume;
  confidence?: 'high' | 'medium' | 'low';
  warnings?: string[];
  error?: string;
}

/**
 * Determine file type from file object
 */
export function getFileType(file: File): 'pdf' | 'docx' | 'txt' | null {
  const fileName = file.name.toLowerCase();

  if (file.type === 'application/pdf' || fileName.endsWith('.pdf')) {
    return 'pdf';
  }

  if (
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    fileName.endsWith('.docx')
  ) {
    return 'docx';
  }

  if (file.type === 'text/plain' || fileName.endsWith('.txt')) {
    return 'txt';
  }

  return null;
}

/**
 * Parse resume file using the existing API from Phase 2
 * Sends file as FormData to /api/parse-resume
 */
export async function parseResumeFile(file: File): Promise<ParseResult> {
  try {
    // Validate file type
    const fileType = getFileType(file);
    if (!fileType) {
      return {
        success: false,
        error: 'Unsupported file type. Please upload a PDF, DOCX, or TXT file.',
      };
    }

    // Create FormData and append file (same as Phase 2)
    const formData = new FormData();
    formData.append('file', file);

    // Call existing API endpoint
    const response = await fetch('/api/parse-resume', {
      method: 'POST',
      body: formData, // Send as FormData, not JSON
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to parse resume',
      };
    }

    // The API returns { success: true, data: ParsedResume } on success
    const parsedResume = data.data;

    if (!parsedResume) {
      return {
        success: false,
        error: 'No resume data returned from parser',
      };
    }

    // Calculate confidence based on parsed data
    const confidence = calculateConfidence(parsedResume);

    return {
      success: true,
      resumeData: parsedResume,
      confidence,
      warnings: generateWarnings(parsedResume),
    };
  } catch (error: any) {
    console.error('Error parsing resume:', error);
    return {
      success: false,
      error: error.message || 'Failed to parse resume. Please try again.',
    };
  }
}

/**
 * Generate warnings based on parsed resume data
 */
function generateWarnings(resumeData: ParsedResume): string[] {
  const warnings: string[] = [];

  if (!resumeData.summary || resumeData.summary.length < 20) {
    warnings.push('Professional summary is missing or too short');
  }

  if (!resumeData.experience || resumeData.experience.length === 0) {
    warnings.push('No work experience found');
  }

  if (!resumeData.education || resumeData.education.length === 0) {
    warnings.push('No education information found');
  }

  if (!resumeData.skills || resumeData.skills.length === 0) {
    warnings.push('No skills found');
  }

  if (!resumeData.personalInfo?.phone) {
    warnings.push('Phone number not found');
  }

  if (!resumeData.personalInfo?.location) {
    warnings.push('Location not found');
  }

  return warnings;
}

/**
 * Calculate parsing confidence based on extracted data
 */
function calculateConfidence(resumeData: ParsedResume): 'high' | 'medium' | 'low' {
  let score = 0;
  let maxScore = 0;

  // Personal info (max 4 points)
  maxScore += 4;
  if (resumeData.personalInfo?.name) score += 2;
  if (resumeData.personalInfo?.email) score += 1;
  if (resumeData.personalInfo?.phone) score += 1;

  // Summary (1 point)
  maxScore += 1;
  if (resumeData.summary && resumeData.summary.length > 20) score += 1;

  // Experience (max 3 points)
  maxScore += 3;
  if (resumeData.experience && resumeData.experience.length > 0) {
    score += 1;
    if (resumeData.experience.length >= 2) score += 1;
    if (resumeData.experience.some(e => e.description && e.description.length > 20)) score += 1;
  }

  // Education (max 2 points)
  maxScore += 2;
  if (resumeData.education && resumeData.education.length > 0) {
    score += 1;
    if (resumeData.education.length >= 1 && resumeData.education[0].degree) score += 1;
  }

  // Skills (max 2 points)
  maxScore += 2;
  if (resumeData.skills && resumeData.skills.length > 0) {
    score += 1;
    if (resumeData.skills.length >= 5) score += 1;
  }

  // Calculate percentage
  const percentage = (score / maxScore) * 100;

  if (percentage >= 80) return 'high';
  if (percentage >= 50) return 'medium';
  return 'low';
}

/**
 * Validate resume data
 */
export function validateResumeData(resumeData: ParsedResume): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!resumeData.personalInfo?.name) {
    errors.push('Name is required');
  }

  if (!resumeData.personalInfo?.email) {
    errors.push('Email is required');
  }

  if (!resumeData.experience || resumeData.experience.length === 0) {
    errors.push('At least one work experience entry is recommended');
  }

  if (!resumeData.skills || resumeData.skills.length === 0) {
    errors.push('At least one skill is recommended');
  }

  return {
    isValid: errors.length === 0 || errors.length <= 2, // Allow if only missing optional fields
    errors,
  };
}
