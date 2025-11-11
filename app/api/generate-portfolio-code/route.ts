/**
 * API Route: Generate Portfolio Code
 * Generates complete Next.js portfolio code based on user's content and customization
 */

import { NextRequest, NextResponse } from 'next/server';
import { PortfolioContent, PortfolioCustomization } from '@/types';
import { generatePortfolioCode } from '@/lib/portfolio/codeGenerator';

export async function POST(request: NextRequest) {
  console.log('\n[PORTFOLIO] ========== GENERATE PORTFOLIO CODE REQUEST ==========');

  try {
    const body = await request.json();
    const { portfolioContent, customization } = body;

    if (!portfolioContent || !customization) {
      return NextResponse.json(
        { error: 'Missing required fields: portfolioContent, customization' },
        { status: 400 }
      );
    }

    console.log('[PORTFOLIO] Generating portfolio code...');
    console.log('[PORTFOLIO] Template:', customization.template);

    // Generate portfolio code
    const { files, packageJson } = generatePortfolioCode(
      portfolioContent as PortfolioContent,
      customization as PortfolioCustomization
    );

    console.log('[PORTFOLIO] ✅ Portfolio code generated successfully');
    console.log('[PORTFOLIO] Files generated:', files.length);

    console.log('[PORTFOLIO] ========== GENERATION COMPLETE ==========\n');

    return NextResponse.json({
      success: true,
      files,
      packageJson,
    });
  } catch (error: any) {
    console.error('[PORTFOLIO] Error generating portfolio code:', error.message);
    return NextResponse.json(
      { error: error.message || 'Failed to generate portfolio code' },
      { status: 500 }
    );
  }
}
