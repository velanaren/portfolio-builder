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
  const doc = new jsPDF();

  // Get theme colors
  const colors = getThemeColors(theme, format);

  // Set font
  const font = format === 'classic' ? 'times' : 'helvetica';
  doc.setFont(font);

  let y = 20; // Starting Y position

  // Header
  y = addHeader(doc, resume, y, colors, format);

  // Professional Summary
  if (resume.summary) {
    y = addSection(doc, 'PROFESSIONAL SUMMARY', y, colors);
    y = addText(doc, resume.summary, y, colors.text, 10);
    y += 5;
  }

  // Work Experience
  if (resume.experience && resume.experience.length > 0) {
    y = addSection(doc, 'WORK EXPERIENCE', y, colors);
    for (const exp of resume.experience) {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(11);
      doc.setFont(font, 'bold');
      doc.setTextColor(colors.text);
      doc.text(exp.position, 20, y);
      y += 5;

      doc.setFontSize(10);
      doc.setFont(font, 'normal');
      doc.setTextColor(colors.accent);
      doc.text(`${exp.company} | ${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`, 20, y);
      y += 5;

      doc.setTextColor(colors.text);
      const descLines = doc.splitTextToSize(exp.description, 170);
      doc.text(descLines, 20, y);
      y += descLines.length * 5 + 5;
    }
    y += 3;
  }

  // Education
  if (resume.education && resume.education.length > 0) {
    if (y > 230) {
      doc.addPage();
      y = 20;
    }
    y = addSection(doc, 'EDUCATION', y, colors);
    for (const edu of resume.education) {
      doc.setFontSize(11);
      doc.setFont(font, 'bold');
      doc.setTextColor(colors.text);
      doc.text(`${edu.degree} in ${edu.field}`, 20, y);
      y += 5;

      doc.setFontSize(10);
      doc.setFont(font, 'normal');
      doc.setTextColor(colors.accent);
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
    y = addSection(doc, 'SKILLS', y, colors);
    doc.setFontSize(10);
    doc.setFont(font, 'normal');
    doc.setTextColor(colors.text);
    const skillsText = resume.skills.join(', ');
    const skillsLines = doc.splitTextToSize(skillsText, 170);
    doc.text(skillsLines, 20, y);
    y += skillsLines.length * 5 + 5;
  }

  // Projects
  if (resume.projects && resume.projects.length > 0) {
    if (y > 230) {
      doc.addPage();
      y = 20;
    }
    y = addSection(doc, 'PROJECTS', y, colors);
    for (const project of resume.projects) {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(11);
      doc.setFont(font, 'bold');
      doc.setTextColor(colors.text);
      doc.text(project.name, 20, y);
      y += 5;

      if (project.technologies && project.technologies.length > 0) {
        doc.setFontSize(9);
        doc.setFont(font, 'normal');
        doc.setTextColor(colors.accent);
        doc.text(project.technologies.join(', '), 20, y);
        y += 5;
      }

      doc.setFontSize(10);
      doc.setTextColor(colors.text);
      const descLines = doc.splitTextToSize(project.description, 170);
      doc.text(descLines, 20, y);
      y += descLines.length * 5 + 5;
    }
  }

  // Certifications
  if (resume.certifications && resume.certifications.length > 0) {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
    y = addSection(doc, 'CERTIFICATIONS', y, colors);
    for (const cert of resume.certifications) {
      doc.setFontSize(10);
      doc.setFont(font, 'bold');
      doc.setTextColor(colors.text);
      doc.text(cert.name, 20, y);
      y += 5;

      doc.setFont(font, 'normal');
      doc.setTextColor(colors.accent);
      doc.text(`${cert.issuer} | ${cert.date}`, 20, y);
      y += 7;
    }
  }

  return doc;
}

function addHeader(doc: jsPDF, resume: ParsedResume, y: number, colors: any, format: ExportFormat): number {
  const font = format === 'classic' ? 'times' : 'helvetica';

  // Name
  doc.setFontSize(format === 'ats' ? 18 : 20);
  doc.setFont(font, 'bold');
  doc.setTextColor(colors.primary);

  const name = resume.personalInfo?.name || 'Resume';
  const textWidth = doc.getTextWidth(name);
  const pageWidth = doc.internal.pageSize.getWidth();
  const x = format === 'classic' ? (pageWidth - textWidth) / 2 : 20;

  doc.text(name, x, y);
  y += 7;

  // Contact Info
  doc.setFontSize(9);
  doc.setFont(font, 'normal');
  doc.setTextColor(100, 100, 100);

  const contactInfo = [];
  if (resume.personalInfo?.email) contactInfo.push(resume.personalInfo.email);
  if (resume.personalInfo?.phone) contactInfo.push(resume.personalInfo.phone);
  if (resume.personalInfo?.location) contactInfo.push(resume.personalInfo.location);

  const contactText = contactInfo.join(' | ');
  const contactWidth = doc.getTextWidth(contactText);
  const contactX = format === 'classic' ? (pageWidth - contactWidth) / 2 : 20;

  doc.text(contactText, contactX, y);
  y += 6;

  // Divider line
  if (format !== 'ats') {
    doc.setDrawColor(colors.accent);
    doc.setLineWidth(0.5);
    doc.line(20, y, pageWidth - 20, y);
  } else {
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    doc.line(20, y, pageWidth - 20, y);
  }
  y += 8;

  return y;
}

function addSection(doc: jsPDF, title: string, y: number, colors: any): number {
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.primary);
  doc.text(title, 20, y);

  // Underline
  const titleWidth = doc.getTextWidth(title);
  doc.setDrawColor(colors.accent);
  doc.setLineWidth(0.5);
  doc.line(20, y + 1, 20 + titleWidth, y + 1);

  return y + 7;
}

function addText(doc: jsPDF, text: string, y: number, color: string, fontSize: number): number {
  doc.setFontSize(fontSize);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(color);
  const lines = doc.splitTextToSize(text, 170);
  doc.text(lines, 20, y);
  return y + lines.length * 5;
}

function getThemeColors(theme: ColorTheme, format: ExportFormat) {
  if (format === 'ats') {
    return {
      primary: '#000000',
      accent: '#000000',
      text: '#000000'
    };
  }

  switch (theme) {
    case 'navy-gold':
      return {
        primary: '#1A1F2E',
        accent: '#D4A574',
        text: '#0F1419'
      };
    case 'dark-minimal':
      return {
        primary: '#1F2937',
        accent: '#6B7280',
        text: '#000000'
      };
    case 'blue-gold':
      return {
        primary: '#6366F1',
        accent: '#D4A574',
        text: '#0F1419'
      };
    default:
      return {
        primary: '#1A1F2E',
        accent: '#D4A574',
        text: '#0F1419'
      };
  }
}
