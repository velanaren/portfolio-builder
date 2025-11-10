/**
 * AI Content Rewrite API Route
 * Uses Groq API to rewrite resume content
 */

import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

interface RewriteRequest {
  text: string;
  type: 'summary' | 'experience' | 'skill' | 'project';
  context?: string;
}

const getPromptForType = (type: string, text: string, context?: string): string => {
  const prompts = {
    summary: `You are a professional resume writer. Rewrite the following professional summary to be more impactful, concise, and achievement-oriented. Keep it to 2-3 sentences. Make it compelling and professional.

Original summary: "${text}"
${context ? `Additional context: ${context}` : ''}

Provide only the rewritten summary, no explanations.`,

    experience: `You are a professional resume writer. Rewrite the following job experience description to be more impactful. Use action verbs, quantify achievements where possible, and highlight key accomplishments. Keep it concise and professional.

Original description: "${text}"
${context ? `Additional context: ${context}` : ''}

Provide only the rewritten description, no explanations.`,

    skill: `You are a professional resume writer. Based on the following professional summary and current skills, suggest 5-8 additional relevant skills that would complement this profile. Focus on in-demand technical and professional skills.

Summary: "${context}"
Current skills: "${text}"

Provide only a comma-separated list of suggested skills, no explanations.`,

    project: `You are a professional resume writer. Rewrite the following project description to be more impactful and professional. Highlight the technical challenges, your contributions, and the impact. Keep it concise.

Original description: "${text}"
${context ? `Additional context: ${context}` : ''}

Provide only the rewritten description, no explanations.`,
  };

  return prompts[type as keyof typeof prompts] || prompts.summary;
};

export async function POST(request: NextRequest) {
  try {
    const body: RewriteRequest = await request.json();
    const { text, type, context } = body;

    if (!text || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: text and type' },
        { status: 400 }
      );
    }

    if (!process.env.GROQ_API_KEY) {
      // Return mock response if no API key
      const mockResponses = {
        summary: `Accomplished ${context || 'professional'} with proven expertise in driving innovation and delivering results. Demonstrated success in leading cross-functional teams and implementing strategic initiatives that enhance operational efficiency and business growth.`,
        experience: `• Led and delivered high-impact projects that resulted in measurable improvements\n• Collaborated with cross-functional teams to drive innovation and operational excellence\n• Implemented best practices and mentored team members, fostering a culture of continuous improvement`,
        skill: 'React, TypeScript, Node.js, Python, AWS, Docker, Kubernetes, CI/CD',
        project: `Developed and deployed a comprehensive solution that addressed key business challenges. Leveraged modern technologies to create a scalable, user-friendly platform. Successfully delivered the project on time, resulting in improved efficiency and user satisfaction.`,
      };

      return NextResponse.json({
        original: text,
        rewritten: mockResponses[type as keyof typeof mockResponses] || text,
        success: true,
      });
    }

    const prompt = getPromptForType(type, text, context);

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 500,
    });

    const rewrittenText = chatCompletion.choices[0]?.message?.content?.trim() || text;

    return NextResponse.json({
      original: text,
      rewritten: rewrittenText,
      success: true,
    });
  } catch (error: any) {
    console.error('Error rewriting content:', error);
    return NextResponse.json(
      { error: 'Failed to rewrite content', details: error.message },
      { status: 500 }
    );
  }
}
