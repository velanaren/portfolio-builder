/**
 * PDF Generation Utility
 * Generates PDF from resume data using jsPDF
 * Templates match Phase 3 preview designs EXACTLY
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
  // Debug logging
  console.log('📋 generatePDF called with:');
  console.log('  - Format:', format, '(type:', typeof format, ')');
  console.log('  - Theme:', theme);
  console.log('  - Resume name:', resume.personalInfo?.name);

  // Route to appropriate template based on format
  switch (format) {
    case 'ats':
      console.log('✅ Routing to ATS template');
      return generateATSTemplate(resume);
    case 'modern':
      console.log('✅ Routing to Modern template');
      return generateModernTemplate(resume, theme);
    case 'classic':
      console.log('✅ Routing to Classic template');
      return generateClassicTemplate(resume, theme);
    default:
      console.log('⚠️ Unknown format, defaulting to ATS template');
      return generateATSTemplate(resume);
  }
}

/**
 * ATS-Optimized Template
 * Single column, black text, no colors, plain formatting
 * Matches Phase 3 preview ATS design
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
 * Two-column layout: Navy sidebar (25%) + White main content (75%)
 * Matches Phase 3 preview Modern theme EXACTLY
 */
function generateModernTemplate(resume: ParsedResume, theme: ColorTheme): jsPDF {
  const doc = new jsPDF();
  const colors = getThemeColors(theme, 'modern');
  const pageWidth = doc.internal.pageSize.getWidth();
  const sidebarWidth = pageWidth * 0.25;
  const mainX = sidebarWidth + 10;
  const mainWidth = pageWidth - mainX - 15;

  // Draw navy sidebar background
  doc.setFillColor(31, 41, 55); // #1F2937
  doc.rect(0, 0, sidebarWidth, 297, 'F');

  // === SIDEBAR (LEFT 25%) ===
  let sidebarY = 20;

  // Name - split across two lines
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  const nameParts = (resume.personalInfo?.name || 'Resume').split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ');
  doc.text(firstName, 10, sidebarY);
  sidebarY += 7;
  if (lastName) {
    doc.text(lastName, 10, sidebarY);
    sidebarY += 7;
  }

  // Gold divider bar
  doc.setFillColor(...colors.accentRgb);
  doc.rect(10, sidebarY, 12, 1.5, 'F');
  sidebarY += 8;

  // CONTACT section
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.accentRgb);
  doc.text('CONTACT', 10, sidebarY);
  sidebarY += 5;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(255, 255, 255);
  if (resume.personalInfo?.email) {
    const emailLines = doc.splitTextToSize(resume.personalInfo.email, sidebarWidth - 15);
    doc.text(emailLines, 10, sidebarY);
    sidebarY += emailLines.length * 4;
  }
  if (resume.personalInfo?.phone) {
    doc.text(resume.personalInfo.phone, 10, sidebarY);
    sidebarY += 4;
  }
  if (resume.personalInfo?.location) {
    doc.text(resume.personalInfo.location, 10, sidebarY);
    sidebarY += 4;
  }
  sidebarY += 5;

  // SKILLS section in sidebar
  if (resume.skills && resume.skills.length > 0 && sidebarY < 250) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.accentRgb);
    doc.text('SKILLS', 10, sidebarY);
    sidebarY += 5;

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(255, 255, 255);
    for (const skill of resume.skills.slice(0, 15)) {
      if (sidebarY > 270) break;
      // Skill badge background (gold at ~20% opacity on navy background = rgb(67, 66, 67))
      doc.setFillColor(67, 66, 67);
      doc.roundedRect(10, sidebarY - 3, sidebarWidth - 15, 4, 0.5, 0.5, 'F');
      doc.setTextColor(255, 255, 255);
      doc.text(skill, 12, sidebarY);
      sidebarY += 5;
    }
  }

  // === MAIN CONTENT (RIGHT 75%) ===
  let mainY = 20;

  // Professional Summary
  if (resume.summary) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(31, 41, 55); // Navy
    doc.text('PROFESSIONAL SUMMARY', mainX, mainY);
    mainY += 5;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(55, 65, 81); // #374151
    const summaryLines = doc.splitTextToSize(resume.summary, mainWidth);
    doc.text(summaryLines, mainX, mainY);
    mainY += summaryLines.length * 4 + 8;
  }

  // Work Experience with card styling
  if (resume.experience && resume.experience.length > 0) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(31, 41, 55); // Navy
    doc.text('WORK EXPERIENCE', mainX, mainY);
    mainY += 6;

    for (const exp of resume.experience) {
      if (mainY > 240) {
        doc.addPage();
        // Redraw sidebar on new page
        doc.setFillColor(31, 41, 55);
        doc.rect(0, 0, sidebarWidth, 297, 'F');
        mainY = 20;
      }

      // Calculate card height
      const descLines = doc.splitTextToSize(exp.description, mainWidth - 8);
      const cardHeight = 18 + descLines.length * 3.5;

      // Card background
      doc.setFillColor(248, 250, 251); // #F8FAFB
      doc.roundedRect(mainX, mainY - 3, mainWidth, cardHeight, 1, 1, 'F');

      // Gold left border
      doc.setFillColor(...colors.accentRgb);
      doc.rect(mainX, mainY - 3, 2, cardHeight, 'F');

      mainY += 2;

      // Position
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(31, 41, 55);
      doc.text(exp.position, mainX + 4, mainY);
      mainY += 4;

      // Company
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.accentRgb);
      doc.text(exp.company, mainX + 4, mainY);
      mainY += 4;

      // Dates
      doc.setTextColor(107, 114, 128);
      doc.text(`${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`, mainX + 4, mainY);
      mainY += 4;

      // Description
      doc.setFontSize(8);
      doc.setTextColor(55, 65, 81);
      doc.text(descLines, mainX + 4, mainY);
      mainY += descLines.length * 3.5 + 6;
    }
  }

  // Education
  if (resume.education && resume.education.length > 0) {
    if (mainY > 240) {
      doc.addPage();
      doc.setFillColor(31, 41, 55);
      doc.rect(0, 0, sidebarWidth, 297, 'F');
      mainY = 20;
    }

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(31, 41, 55);
    doc.text('EDUCATION', mainX, mainY);
    mainY += 6;

    for (const edu of resume.education) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(`${edu.degree} in ${edu.field}`, mainX, mainY);
      mainY += 4;

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.accentRgb);
      doc.text(edu.institution, mainX, mainY);
      mainY += 4;

      doc.setTextColor(107, 114, 128);
      doc.text(edu.graduationDate, mainX, mainY);
      mainY += 6;
    }
  }

  // Projects
  if (resume.projects && resume.projects.length > 0) {
    if (mainY > 230) {
      doc.addPage();
      doc.setFillColor(31, 41, 55);
      doc.rect(0, 0, sidebarWidth, 297, 'F');
      mainY = 20;
    }

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(31, 41, 55);
    doc.text('PROJECTS', mainX, mainY);
    mainY += 6;

    for (const project of resume.projects) {
      if (mainY > 250) {
        doc.addPage();
        doc.setFillColor(31, 41, 55);
        doc.rect(0, 0, sidebarWidth, 297, 'F');
        mainY = 20;
      }

      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(31, 41, 55);
      doc.text(project.name, mainX, mainY);
      mainY += 4;

      if (project.technologies && project.technologies.length > 0) {
        doc.setFontSize(7);
        doc.setTextColor(...colors.accentRgb);
        doc.text(project.technologies.join(', '), mainX, mainY);
        mainY += 4;
      }

      doc.setFontSize(8);
      doc.setTextColor(55, 65, 81);
      const descLines = doc.splitTextToSize(project.description, mainWidth);
      doc.text(descLines, mainX, mainY);
      mainY += descLines.length * 3.5 + 6;
    }
  }

  // Certifications
  if (resume.certifications && resume.certifications.length > 0) {
    if (mainY > 250) {
      doc.addPage();
      doc.setFillColor(31, 41, 55);
      doc.rect(0, 0, sidebarWidth, 297, 'F');
      mainY = 20;
    }

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(31, 41, 55);
    doc.text('CERTIFICATIONS', mainX, mainY);
    mainY += 6;

    for (const cert of resume.certifications) {
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text(cert.name, mainX, mainY);
      mainY += 4;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.accentRgb);
      doc.text(`${cert.issuer} | ${cert.date}`, mainX, mainY);
      mainY += 6;
    }
  }

  return doc;
}

/**
 * Classic Professional Template
 * Centered header, serif fonts, gold underlines
 * Matches Phase 3 preview Classic theme EXACTLY
 */
function generateClassicTemplate(resume: ParsedResume, theme: ColorTheme): jsPDF {
  const doc = new jsPDF();
  const colors = getThemeColors(theme, 'classic');
  doc.setFont('times');
  let y = 20;
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header - Centered with serif font
  doc.setFontSize(20);
  doc.setFont('times', 'bold');
  doc.setTextColor(31, 41, 55); // #1F2937 Navy
  const name = resume.personalInfo?.name || 'Resume';
  const nameWidth = doc.getTextWidth(name);
  doc.text(name, (pageWidth - nameWidth) / 2, y);
  y += 8;

  // Contact Info - Centered with gold bottom border
  doc.setFontSize(10);
  doc.setFont('times', 'normal');
  doc.setTextColor(107, 114, 128); // #6B7280
  const contactInfo = [];
  if (resume.personalInfo?.email) contactInfo.push(resume.personalInfo.email);
  if (resume.personalInfo?.phone) contactInfo.push(resume.personalInfo.phone);
  if (resume.personalInfo?.location) contactInfo.push(resume.personalInfo.location);
  const contactText = contactInfo.join(' • ');
  const contactWidth = doc.getTextWidth(contactText);
  doc.text(contactText, (pageWidth - contactWidth) / 2, y);
  y += 3;

  // Gold bottom border under contact
  doc.setDrawColor(...colors.accentRgb);
  doc.setLineWidth(1);
  const borderLeft = (pageWidth - contactWidth) / 2;
  const borderRight = borderLeft + contactWidth;
  doc.line(borderLeft, y, borderRight, y);
  y += 8;

  // Professional Summary
  if (resume.summary) {
    doc.setFontSize(12);
    doc.setFont('times', 'bold');
    doc.setTextColor(31, 41, 55);
    doc.text('PROFESSIONAL SUMMARY', 20, y);

    // Gold underline (2px)
    const titleWidth = doc.getTextWidth('PROFESSIONAL SUMMARY');
    doc.setDrawColor(...colors.accentRgb);
    doc.setLineWidth(2);
    doc.line(20, y + 1, 20 + titleWidth, y + 1);
    y += 7;

    doc.setFontSize(10);
    doc.setFont('times', 'normal');
    doc.setTextColor(55, 65, 81); // #374151
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
    doc.setTextColor(31, 41, 55);
    doc.text('WORK EXPERIENCE', 20, y);

    const titleWidth = doc.getTextWidth('WORK EXPERIENCE');
    doc.setDrawColor(...colors.accentRgb);
    doc.setLineWidth(2);
    doc.line(20, y + 1, 20 + titleWidth, y + 1);
    y += 7;

    for (const exp of resume.experience) {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }

      // Position and dates on same line
      doc.setFontSize(11);
      doc.setFont('times', 'bold');
      doc.setTextColor(31, 41, 55);
      doc.text(exp.position, 20, y);

      // Dates right-aligned in italic
      doc.setFont('times', 'italic');
      doc.setTextColor(107, 114, 128);
      const dates = `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`;
      const datesWidth = doc.getTextWidth(dates);
      doc.text(dates, pageWidth - 20 - datesWidth, y);
      y += 5;

      // Company in gold
      doc.setFontSize(10);
      doc.setFont('times', 'normal');
      doc.setTextColor(...colors.accentRgb);
      doc.text(exp.company, 20, y);
      y += 5;

      // Description
      doc.setTextColor(55, 65, 81);
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
    doc.setFont('times', 'bold');
    doc.setTextColor(31, 41, 55);
    doc.text('EDUCATION', 20, y);

    const titleWidth = doc.getTextWidth('EDUCATION');
    doc.setDrawColor(...colors.accentRgb);
    doc.setLineWidth(2);
    doc.line(20, y + 1, 20 + titleWidth, y + 1);
    y += 7;

    for (const edu of resume.education) {
      doc.setFontSize(11);
      doc.setFont('times', 'bold');
      doc.setTextColor(31, 41, 55);
      doc.text(`${edu.degree} in ${edu.field}`, 20, y);
      y += 5;

      doc.setFontSize(10);
      doc.setFont('times', 'normal');
      doc.setTextColor(...colors.accentRgb);
      doc.text(edu.institution, 20, y);

      doc.setTextColor(107, 114, 128);
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
    doc.setTextColor(31, 41, 55);
    doc.text('SKILLS', 20, y);

    const titleWidth = doc.getTextWidth('SKILLS');
    doc.setDrawColor(...colors.accentRgb);
    doc.setLineWidth(2);
    doc.line(20, y + 1, 20 + titleWidth, y + 1);
    y += 7;

    doc.setFontSize(10);
    doc.setFont('times', 'normal');
    doc.setTextColor(55, 65, 81);
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
    doc.setTextColor(31, 41, 55);
    doc.text('PROJECTS', 20, y);

    const titleWidth = doc.getTextWidth('PROJECTS');
    doc.setDrawColor(...colors.accentRgb);
    doc.setLineWidth(2);
    doc.line(20, y + 1, 20 + titleWidth, y + 1);
    y += 7;

    for (const project of resume.projects) {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(11);
      doc.setFont('times', 'bold');
      doc.setTextColor(31, 41, 55);
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
      doc.setTextColor(55, 65, 81);
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
    doc.setFont('times', 'bold');
    doc.setTextColor(31, 41, 55);
    doc.text('CERTIFICATIONS', 20, y);

    const titleWidth = doc.getTextWidth('CERTIFICATIONS');
    doc.setDrawColor(...colors.accentRgb);
    doc.setLineWidth(2);
    doc.line(20, y + 1, 20 + titleWidth, y + 1);
    y += 7;

    for (const cert of resume.certifications) {
      doc.setFontSize(10);
      doc.setFont('times', 'bold');
      doc.setTextColor(31, 41, 55);
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
 * Helper function to get theme colors as RGB arrays
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
