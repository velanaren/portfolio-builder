/**
 * Resume Parsing Utilities
 * Helper functions for parsing resume files
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
 * Read file as base64 string
 */
export async function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove data URL prefix to get just the base64 content
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/**
 * Determine file type from file object
 */
export function getFileType(file: File): 'pdf' | 'docx' | null {
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

  return null;
}

/**
 * Parse resume file using API
 */
export async function parseResumeFile(file: File): Promise<ParseResult> {
  try {
    // Get file type
    const fileType = getFileType(file);
    if (!fileType) {
      return {
        success: false,
        error: 'Unsupported file type. Please upload a PDF or DOCX file.',
      };
    }

    // Read file as base64
    const fileContent = await readFileAsBase64(file);

    // Call API
    const response = await fetch('/api/parse-resume', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileContent,
        fileType,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to parse resume',
      };
    }

    // Calculate confidence based on parsed data
    const confidence = calculateConfidence(data.parsed || data.resumeData);

    return {
      success: true,
      resumeData: data.parsed || data.resumeData,
      confidence,
      warnings: data.warnings || [],
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
