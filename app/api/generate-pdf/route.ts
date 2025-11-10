/**
 * PDF Generation API Route
 * Generates PDF from resume data
 */

import { NextRequest, NextResponse } from 'next/server';
import { generatePDF } from '@/lib/pdfGeneration';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resume, format, theme, filename } = body;

    if (!resume || !format) {
      return NextResponse.json(
        { error: 'Missing required fields: resume and format' },
        { status: 400 }
      );
    }

    // Generate PDF
    const pdf = generatePDF({
      resume,
      format,
      theme: theme || 'navy-gold'
    });

    // Convert PDF to buffer
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));

    // Return PDF as downloadable file
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename || 'resume'}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate PDF',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
