/**
 * PDF Generation Utility
 * Generates PDF from resume data using jsPDF
 */

import jsPDF from 'jspdf';
import { ParsedResume } from '@/types';

export type ExportFormat = 'ats' | 'modern' | 'classic';
export type ColorTheme = 'navy-gold' | 'dark-minimal' | 'blue-gold';

interface GeneratePDFOptions {
  resume: ParsedResume;
  format: ExportFormat;
  theme: ColorTheme;
}

export function generatePDF({ resume, format, theme }: GeneratePDFOptions): jsPDF {
  // Route to appropriate template based on format
  switch (format) {
    case 'ats':
      return generateATSTemplate(resume);
    case 'modern':
      return generateModernTemplate(resume, theme);
    case 'classic':
      return generateClassicTemplate(resume, theme);
    default:
      return generateATSTemplate(resume);
  }
}

/**
 * ATS-Optimized Template
 * Single column, black text, no colors, plain formatting
 */
function generateATSTemplate(resume: ParsedResume): jsPDF {
  const doc = new jsPDF();
  doc.setFont('helvetica');
  let y = 20;

  // Header - Name and Contact (centered)
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  const name = resume.personalInfo?.name || 'Resume';
  const pageWidth = doc.internal.pageSize.getWidth();
  const nameWidth = doc.getTextWidth(name);
  doc.text(name, (pageWidth - nameWidth) / 2, y);
  y += 7;

  // Contact Info
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const contactInfo = [];
  if (resume.personalInfo?.email) contactInfo.push(resume.personalInfo.email);
  if (resume.personalInfo?.phone) contactInfo.push(resume.personalInfo.phone);
  if (resume.personalInfo?.location) contactInfo.push(resume.personalInfo.location);
  const contactText = contactInfo.join(' | ');
  const contactWidth = doc.getTextWidth(contactText);
  doc.text(contactText, (pageWidth - contactWidth) / 2, y);
  y += 8;

  // Divider
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(20, y, pageWidth - 20, y);
  y += 8;

  // Professional Summary
  if (resume.summary) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('PROFESSIONAL SUMMARY', 20, y);
    y += 6;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const summaryLines = doc.splitTextToSize(resume.summary, 170);
    doc.text(summaryLines, 20, y);
    y += summaryLines.length * 5 + 8;
  }

  // Work Experience
  if (resume.experience && resume.experience.length > 0) {
    if (y > 230) {
      doc.addPage();
      y = 20;
    }
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('WORK EXPERIENCE', 20, y);
    y += 6;

    for (const exp of resume.experience) {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(exp.position, 20, y);
      y += 5;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`${exp.company} | ${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`, 20, y);
      y += 5;

      const descLines = doc.splitTextToSize(exp.description, 170);
      doc.text(descLines, 20, y);
      y += descLines.length * 5 + 6;
    }
    y += 3;
  }

  // Education
  if (resume.education && resume.education.length > 0) {
    if (y > 240) {
      doc.addPage();
      y = 20;
    }
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('EDUCATION', 20, y);
    y += 6;

    for (const edu of resume.education) {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(`${edu.degree} in ${edu.field}`, 20, y);
      y += 5;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`${edu.institution} | ${edu.graduationDate}`, 20, y);
      y += 7;
    }
    y += 3;
  }

  // Skills
  if (resume.skills && resume.skills.length > 0) {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('SKILLS', 20, y);
    y += 6;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const skillsText = resume.skills.join(', ');
    const skillsLines = doc.splitTextToSize(skillsText, 170);
    doc.text(skillsLines, 20, y);
    y += skillsLines.length * 5 + 6;
  }

  // Projects
  if (resume.projects && resume.projects.length > 0) {
    if (y > 230) {
      doc.addPage();
      y = 20;
    }
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('PROJECTS', 20, y);
    y += 6;

    for (const project of resume.projects) {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(project.name, 20, y);
      y += 5;

      if (project.technologies && project.technologies.length > 0) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(project.technologies.join(', '), 20, y);
        y += 5;
      }

      doc.setFontSize(10);
      const descLines = doc.splitTextToSize(project.description, 170);
      doc.text(descLines, 20, y);
      y += descLines.length * 5 + 6;
    }
  }

  // Certifications
  if (resume.certifications && resume.certifications.length > 0) {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('CERTIFICATIONS', 20, y);
    y += 6;

    for (const cert of resume.certifications) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(cert.name, 20, y);
      y += 5;

      doc.setFont('helvetica', 'normal');
      doc.text(`${cert.issuer} | ${cert.date}`, 20, y);
      y += 7;
    }
  }

  return doc;
}

/**
 * Modern Professional Template
 * Single column with navy/gold styling, professional design
 */
function generateModernTemplate(resume: ParsedResume, theme: ColorTheme): jsPDF {
  const doc = new jsPDF();
  const colors = getThemeColors(theme, 'modern');
  doc.setFont('helvetica');
  let y = 20;

  // Header with modern styling
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.primaryRgb);
  doc.text(resume.personalInfo?.name || 'Resume', 20, y);
  y += 8;

  // Gold accent line
  doc.setDrawColor(...colors.accentRgb);
  doc.setLineWidth(2);
  doc.line(20, y, 60, y);
  y += 6;

  // Contact Info
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  const contactInfo = [];
  if (resume.personalInfo?.email) contactInfo.push(resume.personalInfo.email);
  if (resume.personalInfo?.phone) contactInfo.push(resume.personalInfo.phone);
  if (resume.personalInfo?.location) contactInfo.push(resume.personalInfo.location);
  doc.text(contactInfo.join(' • '), 20, y);
  y += 10;

  // Professional Summary with background
  if (resume.summary) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.primaryRgb);
    doc.text('PROFESSIONAL SUMMARY', 20, y);

    // Accent underline
    const titleWidth = doc.getTextWidth('PROFESSIONAL SUMMARY');
    doc.setDrawColor(...colors.accentRgb);
    doc.setLineWidth(0.8);
    doc.line(20, y + 1, 20 + titleWidth, y + 1);
    y += 7;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    const summaryLines = doc.splitTextToSize(resume.summary, 170);
    doc.text(summaryLines, 20, y);
    y += summaryLines.length * 5 + 8;
  }

  // Work Experience
  if (resume.experience && resume.experience.length > 0) {
    if (y > 220) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.primaryRgb);
    doc.text('WORK EXPERIENCE', 20, y);

    const titleWidth = doc.getTextWidth('WORK EXPERIENCE');
    doc.setDrawColor(...colors.accentRgb);
    doc.setLineWidth(0.8);
    doc.line(20, y + 1, 20 + titleWidth, y + 1);
    y += 7;

    for (const exp of resume.experience) {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }

      // Position with modern styling
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.primaryRgb);
      doc.text(exp.position, 20, y);
      y += 5;

      // Company with accent color
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.accentRgb);
      doc.text(exp.company, 20, y);

      // Dates
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(`${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`, 100, y);
      y += 5;

      // Description
      doc.setTextColor(60, 60, 60);
      const descLines = doc.splitTextToSize(exp.description, 170);
      doc.text(descLines, 20, y);
      y += descLines.length * 5 + 7;
    }
    y += 3;
  }

  // Education
  if (resume.education && resume.education.length > 0) {
    if (y > 240) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.primaryRgb);
    doc.text('EDUCATION', 20, y);

    const titleWidth = doc.getTextWidth('EDUCATION');
    doc.setDrawColor(...colors.accentRgb);
    doc.setLineWidth(0.8);
    doc.line(20, y + 1, 20 + titleWidth, y + 1);
    y += 7;

    for (const edu of resume.education) {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.primaryRgb);
      doc.text(`${edu.degree} in ${edu.field}`, 20, y);
      y += 5;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.accentRgb);
      doc.text(edu.institution, 20, y);

      doc.setTextColor(100, 100, 100);
      doc.text(edu.graduationDate, 100, y);
      y += 7;
    }
    y += 3;
  }

  // Skills with modern styling
  if (resume.skills && resume.skills.length > 0) {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.primaryRgb);
    doc.text('SKILLS', 20, y);

    const titleWidth = doc.getTextWidth('SKILLS');
    doc.setDrawColor(...colors.accentRgb);
    doc.setLineWidth(0.8);
    doc.line(20, y + 1, 20 + titleWidth, y + 1);
    y += 7;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    const skillsText = resume.skills.join(' • ');
    const skillsLines = doc.splitTextToSize(skillsText, 170);
    doc.text(skillsLines, 20, y);
    y += skillsLines.length * 5 + 6;
  }

  // Projects
  if (resume.projects && resume.projects.length > 0) {
    if (y > 230) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.primaryRgb);
    doc.text('PROJECTS', 20, y);

    const titleWidth = doc.getTextWidth('PROJECTS');
    doc.setDrawColor(...colors.accentRgb);
    doc.setLineWidth(0.8);
    doc.line(20, y + 1, 20 + titleWidth, y + 1);
    y += 7;

    for (const project of resume.projects) {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.primaryRgb);
      doc.text(project.name, 20, y);
      y += 5;

      if (project.technologies && project.technologies.length > 0) {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...colors.accentRgb);
        doc.text(project.technologies.join(', '), 20, y);
        y += 5;
      }

      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      const descLines = doc.splitTextToSize(project.description, 170);
      doc.text(descLines, 20, y);
      y += descLines.length * 5 + 7;
    }
  }

  // Certifications
  if (resume.certifications && resume.certifications.length > 0) {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.primaryRgb);
    doc.text('CERTIFICATIONS', 20, y);

    const titleWidth = doc.getTextWidth('CERTIFICATIONS');
    doc.setDrawColor(...colors.accentRgb);
    doc.setLineWidth(0.8);
    doc.line(20, y + 1, 20 + titleWidth, y + 1);
    y += 7;

    for (const cert of resume.certifications) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.primaryRgb);
      doc.text(cert.name, 20, y);
      y += 5;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.accentRgb);
      doc.text(`${cert.issuer} | ${cert.date}`, 20, y);
      y += 7;
    }
  }

  return doc;
}

/**
 * Classic Professional Template
 * Traditional business format with serif fonts
 */
function generateClassicTemplate(resume: ParsedResume, theme: ColorTheme): jsPDF {
  const doc = new jsPDF();
  const colors = getThemeColors(theme, 'classic');
  doc.setFont('times');
  let y = 20;
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header - Centered classic style
  doc.setFontSize(20);
  doc.setFont('times', 'bold');
  doc.setTextColor(...colors.primaryRgb);
  const name = resume.personalInfo?.name || 'Resume';
  const nameWidth = doc.getTextWidth(name);
  doc.text(name, (pageWidth - nameWidth) / 2, y);
  y += 8;

  // Contact Info - Centered
  doc.setFontSize(10);
  doc.setFont('times', 'normal');
  doc.setTextColor(100, 100, 100);
  const contactInfo = [];
  if (resume.personalInfo?.email) contactInfo.push(resume.personalInfo.email);
  if (resume.personalInfo?.phone) contactInfo.push(resume.personalInfo.phone);
  if (resume.personalInfo?.location) contactInfo.push(resume.personalInfo.location);
  const contactText = contactInfo.join(' • ');
  const contactWidth = doc.getTextWidth(contactText);
  doc.text(contactText, (pageWidth - contactWidth) / 2, y);
  y += 6;

  // Elegant divider
  doc.setDrawColor(...colors.accentRgb);
  doc.setLineWidth(0.8);
  doc.line(60, y, pageWidth - 60, y);
  y += 8;

  // Professional Summary
  if (resume.summary) {
    doc.setFontSize(12);
    doc.setFont('times', 'bold');
    doc.setTextColor(...colors.primaryRgb);
    doc.text('PROFESSIONAL SUMMARY', 20, y);

    // Underline with accent color
    const titleWidth = doc.getTextWidth('PROFESSIONAL SUMMARY');
    doc.setDrawColor(...colors.accentRgb);
    doc.setLineWidth(1.5);
    doc.line(20, y + 1, 20 + titleWidth, y + 1);
    y += 7;

    doc.setFontSize(11);
    doc.setFont('times', 'normal');
    doc.setTextColor(60, 60, 60);
    const summaryLines = doc.splitTextToSize(resume.summary, 170);
    doc.text(summaryLines, 20, y);
    y += summaryLines.length * 5 + 8;
  }

  // Work Experience
  if (resume.experience && resume.experience.length > 0) {
    if (y > 220) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(12);
    doc.setFont('times', 'bold');
    doc.setTextColor(...colors.primaryRgb);
    doc.text('WORK EXPERIENCE', 20, y);

    const titleWidth = doc.getTextWidth('WORK EXPERIENCE');
    doc.setDrawColor(...colors.accentRgb);
    doc.setLineWidth(1.5);
    doc.line(20, y + 1, 20 + titleWidth, y + 1);
    y += 7;

    for (const exp of resume.experience) {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }

      // Position
      doc.setFontSize(11);
      doc.setFont('times', 'bold');
      doc.setTextColor(...colors.primaryRgb);
      doc.text(exp.position, 20, y);
      y += 5;

      // Company and dates
      doc.setFontSize(10);
      doc.setFont('times', 'italic');
      doc.setTextColor(...colors.accentRgb);
      doc.text(exp.company, 20, y);

      doc.setFont('times', 'normal');
      doc.setTextColor(100, 100, 100);
      const dates = `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`;
      const datesWidth = doc.getTextWidth(dates);
      doc.text(dates, pageWidth - 20 - datesWidth, y);
      y += 5;

      // Description
      doc.setTextColor(60, 60, 60);
      const descLines = doc.splitTextToSize(exp.description, 170);
      doc.text(descLines, 20, y);
      y += descLines.length * 5 + 7;
    }
    y += 3;
  }

  // Education
  if (resume.education && resume.education.length > 0) {
    if (y > 240) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(12);
    doc.setFont('times', 'bold');
    doc.setTextColor(...colors.primaryRgb);
    doc.text('EDUCATION', 20, y);

    const titleWidth = doc.getTextWidth('EDUCATION');
    doc.setDrawColor(...colors.accentRgb);
    doc.setLineWidth(1.5);
    doc.line(20, y + 1, 20 + titleWidth, y + 1);
    y += 7;

    for (const edu of resume.education) {
      doc.setFontSize(11);
      doc.setFont('times', 'bold');
      doc.setTextColor(...colors.primaryRgb);
      doc.text(`${edu.degree} in ${edu.field}`, 20, y);
      y += 5;

      doc.setFontSize(10);
      doc.setFont('times', 'italic');
      doc.setTextColor(...colors.accentRgb);
      doc.text(edu.institution, 20, y);

      doc.setFont('times', 'normal');
      doc.setTextColor(100, 100, 100);
      const gradWidth = doc.getTextWidth(edu.graduationDate);
      doc.text(edu.graduationDate, pageWidth - 20 - gradWidth, y);
      y += 7;
    }
    y += 3;
  }

  // Skills
  if (resume.skills && resume.skills.length > 0) {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(12);
    doc.setFont('times', 'bold');
    doc.setTextColor(...colors.primaryRgb);
    doc.text('SKILLS', 20, y);

    const titleWidth = doc.getTextWidth('SKILLS');
    doc.setDrawColor(...colors.accentRgb);
    doc.setLineWidth(1.5);
    doc.line(20, y + 1, 20 + titleWidth, y + 1);
    y += 7;

    doc.setFontSize(10);
    doc.setFont('times', 'normal');
    doc.setTextColor(60, 60, 60);
    const skillsText = resume.skills.join(', ');
    const skillsLines = doc.splitTextToSize(skillsText, 170);
    doc.text(skillsLines, 20, y);
    y += skillsLines.length * 5 + 6;
  }

  // Projects
  if (resume.projects && resume.projects.length > 0) {
    if (y > 230) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(12);
    doc.setFont('times', 'bold');
    doc.setTextColor(...colors.primaryRgb);
    doc.text('PROJECTS', 20, y);

    const titleWidth = doc.getTextWidth('PROJECTS');
    doc.setDrawColor(...colors.accentRgb);
    doc.setLineWidth(1.5);
    doc.line(20, y + 1, 20 + titleWidth, y + 1);
    y += 7;

    for (const project of resume.projects) {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(11);
      doc.setFont('times', 'bold');
      doc.setTextColor(...colors.primaryRgb);
      doc.text(project.name, 20, y);
      y += 5;

      if (project.technologies && project.technologies.length > 0) {
        doc.setFontSize(9);
        doc.setFont('times', 'italic');
        doc.setTextColor(...colors.accentRgb);
        doc.text(project.technologies.join(', '), 20, y);
        y += 5;
      }

      doc.setFontSize(10);
      doc.setFont('times', 'normal');
      doc.setTextColor(60, 60, 60);
      const descLines = doc.splitTextToSize(project.description, 170);
      doc.text(descLines, 20, y);
      y += descLines.length * 5 + 7;
    }
  }

  // Certifications
  if (resume.certifications && resume.certifications.length > 0) {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(12);
    doc.setFont('times', 'bold');
    doc.setTextColor(...colors.primaryRgb);
    doc.text('CERTIFICATIONS', 20, y);

    const titleWidth = doc.getTextWidth('CERTIFICATIONS');
    doc.setDrawColor(...colors.accentRgb);
    doc.setLineWidth(1.5);
    doc.line(20, y + 1, 20 + titleWidth, y + 1);
    y += 7;

    for (const cert of resume.certifications) {
      doc.setFontSize(10);
      doc.setFont('times', 'bold');
      doc.setTextColor(...colors.primaryRgb);
      doc.text(cert.name, 20, y);
      y += 5;

      doc.setFont('times', 'normal');
      doc.setTextColor(...colors.accentRgb);
      doc.text(`${cert.issuer} | ${cert.date}`, 20, y);
      y += 7;
    }
  }

  return doc;
}

/**
 * Helper function to convert hex color to RGB array
 */
function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
      ]
    : [0, 0, 0];
}

/**
 * Helper function to get theme colors as RGB arrays and hex strings
 */
function getThemeColors(theme: ColorTheme, format: ExportFormat) {
  if (format === 'ats') {
    return {
      primary: '#000000',
      primaryRgb: [0, 0, 0] as [number, number, number],
      accent: '#D4A574',
      accentRgb: [212, 165, 116] as [number, number, number],
      text: '#000000',
      textRgb: [0, 0, 0] as [number, number, number]
    };
  }

  switch (theme) {
    case 'navy-gold':
      return {
        primary: '#1A1F2E',
        primaryRgb: [26, 31, 46] as [number, number, number],
        accent: '#D4A574',
        accentRgb: [212, 165, 116] as [number, number, number],
        text: '#0F1419',
        textRgb: [15, 20, 25] as [number, number, number]
      };
    case 'dark-minimal':
      return {
        primary: '#1F2937',
        primaryRgb: [31, 41, 55] as [number, number, number],
        accent: '#6B7280',
        accentRgb: [107, 114, 128] as [number, number, number],
        text: '#000000',
        textRgb: [0, 0, 0] as [number, number, number]
      };
    case 'blue-gold':
      return {
        primary: '#6366F1',
        primaryRgb: [99, 102, 241] as [number, number, number],
        accent: '#D4A574',
        accentRgb: [212, 165, 116] as [number, number, number],
        text: '#0F1419',
        textRgb: [15, 20, 25] as [number, number, number]
      };
    default:
      return {
        primary: '#1A1F2E',
        primaryRgb: [26, 31, 46] as [number, number, number],
        accent: '#D4A574',
        accentRgb: [212, 165, 116] as [number, number, number],
        text: '#0F1419',
        textRgb: [15, 20, 25] as [number, number, number]
      };
  }
}
