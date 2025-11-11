/**
 * Cover Letter PDF Generation Utility
 * Generates professional PDF from cover letter text
 */

import jsPDF from 'jspdf';

interface CoverLetterPDFOptions {
  coverLetter: string;
  personalInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

/**
 * Generate PDF from cover letter content
 * Returns jsPDF instance ready for download
 */
export function generateCoverLetterPDF({
  coverLetter,
  personalInfo,
}: CoverLetterPDFOptions): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 25.4; // 1 inch = 25.4mm
  const contentWidth = pageWidth - margin * 2;

  let y = margin;

  // Date (right-aligned)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const dateWidth = doc.getTextWidth(today);
  doc.text(today, pageWidth - margin - dateWidth, y);
  y += 15;

  // Recipient address
  doc.text('To the Hiring Manager,', margin, y);
  y += 20;

  // Cover letter body
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');

  // Split cover letter into paragraphs
  const paragraphs = coverLetter.split('\n\n').filter(p => p.trim());

  for (const paragraph of paragraphs) {
    // Check if we need a new page
    if (y > pageHeight - margin - 30) {
      doc.addPage();
      y = margin;
    }

    // Split paragraph into lines that fit the page width
    const lines = doc.splitTextToSize(paragraph.trim(), contentWidth);

    // Check if paragraph fits on current page
    const paragraphHeight = lines.length * 6; // 6mm per line
    if (y + paragraphHeight > pageHeight - margin - 30) {
      doc.addPage();
      y = margin;
    }

    doc.text(lines, margin, y);
    y += paragraphHeight + 8; // Add spacing between paragraphs
  }

  // Closing
  if (y > pageHeight - margin - 40) {
    doc.addPage();
    y = margin;
  }

  y += 5;
  doc.text('Sincerely,', margin, y);
  y += 15;

  // Signature (name)
  doc.setFont('helvetica', 'normal');
  doc.text(personalInfo.name, margin, y);
  y += 6;

  // Contact info
  doc.setFontSize(10);
  doc.text(personalInfo.phone, margin, y);
  y += 5;
  doc.text(personalInfo.email, margin, y);

  return doc;
}

/**
 * Generate filename for cover letter PDF
 */
export function getCoverLetterFilename(name: string): string {
  const firstName = name.split(' ')[0];
  const lastName = name.split(' ').slice(1).join('_');
  return `${firstName}_${lastName}_CoverLetter.pdf`;
}
