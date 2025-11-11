/**
 * API Route: Deploy Portfolio to Vercel
 * Takes portfolio files and Vercel API key, deploys to Vercel
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { files, vercelApiKey, projectName } = await request.json();

    if (!vercelApiKey) {
      return NextResponse.json(
        { success: false, error: 'Vercel API key is required' },
        { status: 400 }
      );
    }

    if (!files || !Array.isArray(files) || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No files provided for deployment' },
        { status: 400 }
      );
    }

    console.log('Deploying to Vercel with', files.length, 'files');

    // Format files for Vercel API - correct format
    const vercelFiles: Array<{ file: string; data: string }> = files.map(
      (file: { path: string; content: string }) => ({
        file: file.path,
        data: file.content,
      })
    );

    // Create deployment payload with correct Vercel API format
    const deploymentPayload = {
      name: projectName || 'portfolio',
      files: vercelFiles,
      projectSettings: {
        framework: 'nextjs',
        buildCommand: 'npm run build',
        outputDirectory: '.next',
        installCommand: 'npm install',
      },
    };

    console.log('Sending deployment to Vercel API...');

    // Deploy to Vercel
    const vercelResponse = await fetch('https://api.vercel.com/v13/deployments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${vercelApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(deploymentPayload),
    });

    const vercelData = await vercelResponse.json();

    console.log('Vercel API response status:', vercelResponse.status);
    console.log('Vercel API response:', vercelData);

    if (!vercelResponse.ok) {
      const errorMessage = vercelData.error?.message || 'Failed to deploy to Vercel';
      console.error('Vercel deployment error:', vercelData);

      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
          details: vercelData,
          vercelError: vercelData.error,
        },
        { status: vercelResponse.status }
      );
    }

    // Extract deployment URL
    const deploymentUrl = vercelData.url
      ? `https://${vercelData.url}`
      : vercelData.alias?.[0]
      ? `https://${vercelData.alias[0]}`
      : null;

    console.log('Deployment successful:', deploymentUrl);

    return NextResponse.json({
      success: true,
      deploymentUrl,
      deploymentId: vercelData.id,
      inspectorUrl: vercelData.inspectorUrl,
    });
  } catch (error) {
    console.error('Deployment error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred during deployment',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
