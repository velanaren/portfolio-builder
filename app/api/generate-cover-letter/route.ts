/**
 * AI Cover Letter Generation API Route
 *
 * PURPOSE:
 * This API endpoint generates personalized cover letters using Groq AI.
 * It takes a job description, resume data, and tone preference to create
 * a compelling, tailored cover letter that highlights relevant experience.
 *
 * FLOW:
 * 1. Receives POST request with job description, resume data, and tone
 * 2. Validates API key and request data
 * 3. Constructs specialized prompt based on tone preference
 * 4. Calls Groq API to generate cover letter
 * 5. Returns generated cover letter to frontend
 */

import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

interface GenerateCoverLetterRequest {
  jobDescription: string;
  resumeData: {
    personalInfo: {
      name: string;
      email: string;
      phone: string;
    };
    summary?: string;
    experience?: Array<{
      company: string;
      position: string;
      description: string;
      startDate: string;
      endDate?: string;
      current?: boolean;
    }>;
    skills?: string[];
    education?: Array<{
      institution: string;
      degree: string;
      field: string;
      graduationDate: string;
    }>;
  };
  tone: 'formal' | 'conversational' | 'energetic';
}

/**
 * Generate tone-specific prompt instructions
 */
const getToneInstructions = (tone: string): string => {
  const toneMap = {
    formal: `Use professional vocabulary, structured paragraphs, formal salutation approach, and corporate tone.
    Maintain a polished, business-appropriate voice throughout. Use phrases like "I am writing to express my interest"
    and "I would welcome the opportunity." Keep language precise and professional.`,

    conversational: `Use friendly language with a personal touch. Show personality while remaining professional.
    Write in a conversational style with natural, relatable paragraphs. Use phrases like "I'm excited about"
    and "I'd love to bring my experience." Make it feel personable but still polished.`,

    energetic: `Show passion and enthusiasm throughout. Use dynamic language that conveys excitement about the role.
    Include appropriate exclamation points. Use phrases like "I'm thrilled to apply" and "I'm passionate about."
    Demonstrate genuine excitement while maintaining professionalism.`,
  };

  return toneMap[tone as keyof typeof toneMap] || toneMap.formal;
};

/**
 * Construct the main prompt for cover letter generation
 */
const constructPrompt = (
  jobDescription: string,
  resumeData: GenerateCoverLetterRequest['resumeData'],
  tone: string
): string => {
  const { personalInfo, summary, experience = [], skills = [], education = [] } = resumeData;

  // Format experience list
  const experienceList = experience.map((exp, idx) =>
    `${idx + 1}. ${exp.position} at ${exp.company} (${exp.startDate} - ${exp.current ? 'Present' : exp.endDate})\n   ${exp.description}`
  ).join('\n\n');

  // Format skills list
  const skillsList = skills.join(', ');

  // Format education list
  const educationList = education.map((edu, idx) =>
    `${idx + 1}. ${edu.degree} in ${edu.field} - ${edu.institution} (${edu.graduationDate})`
  ).join('\n');

  return `Based on the following resume and job description, generate a personalized, compelling cover letter.

TONE: ${tone.toUpperCase()}
${getToneInstructions(tone)}

RESUME INFORMATION:
Name: ${personalInfo.name}
Email: ${personalInfo.email}
Phone: ${personalInfo.phone}

${summary ? `Professional Summary:\n${summary}\n` : ''}

${experience.length > 0 ? `Experience:\n${experienceList}\n` : ''}

${skills.length > 0 ? `Skills: ${skillsList}\n` : ''}

${education.length > 0 ? `Education:\n${educationList}\n` : ''}

JOB DESCRIPTION:
${jobDescription}

Generate a cover letter that:
1. Opens with a compelling hook that connects the candidate's experience to the job
2. Highlights 2-3 key skills/experiences that match the job requirements
3. Shows enthusiasm for the company and role
4. Uses the specified TONE throughout
5. Closes with a call to action
6. Is between 250-400 words
7. Uses proper business letter formatting with paragraphs (no headers/metadata)
8. Includes a professional salutation and closing

IMPORTANT: Start writing the cover letter directly without any preamble or introduction.
Format it as proper paragraphs. Do NOT include the date, addresses, or "Sincerely" at the end -
just write the body paragraphs starting with the salutation.

Start with "Dear Hiring Manager," and end after the final paragraph (before the closing signature).`;
};

export async function POST(request: NextRequest) {
  try {
    const body: GenerateCoverLetterRequest = await request.json();
    const { jobDescription, resumeData, tone } = body;

    // Validate required fields
    if (!jobDescription || !resumeData || !tone) {
      return NextResponse.json(
        { error: 'Missing required fields: jobDescription, resumeData, and tone' },
        { status: 400 }
      );
    }

    if (!resumeData.personalInfo || !resumeData.personalInfo.name) {
      return NextResponse.json(
        { error: 'Resume data must include personal information' },
        { status: 400 }
      );
    }

    // Fallback mode if no API key
    if (!process.env.GROQ_API_KEY) {
      const mockCoverLetter = `Dear Hiring Manager,

I am writing to express my strong interest in the position described in your job posting. With my background in ${resumeData.experience?.[0]?.position || 'professional development'} and proven expertise in ${resumeData.skills?.slice(0, 3).join(', ') || 'various technical skills'}, I am confident that I would be a valuable addition to your team.

In my previous role at ${resumeData.experience?.[0]?.company || 'my most recent position'}, I successfully ${resumeData.experience?.[0]?.description?.slice(0, 150) || 'delivered impactful results and contributed to team success'}. This experience has equipped me with the skills and knowledge necessary to excel in this position and contribute to your organization's goals.

I am particularly drawn to this opportunity because it aligns perfectly with my professional background and career aspirations. I am excited about the possibility of bringing my unique perspective and expertise to your team and contributing to your continued success.

Thank you for considering my application. I would welcome the opportunity to discuss how my skills and experience align with your needs. I look forward to the possibility of contributing to your organization.`;

      return NextResponse.json({
        success: true,
        coverLetter: mockCoverLetter,
        generatedAt: new Date().toISOString(),
      });
    }

    // Construct prompt
    const prompt = constructPrompt(jobDescription, resumeData, tone);

    // Call Groq API
    const model = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: model,
      temperature: 0.7, // Higher temperature for more creative, varied cover letters
      max_tokens: 1000, // Allow for longer cover letters
    });

    // Extract generated text
    let coverLetter = chatCompletion.choices[0]?.message?.content?.trim() || '';

    // Remove outer quotes if present
    if ((coverLetter.startsWith('"') && coverLetter.endsWith('"')) ||
        (coverLetter.startsWith("'") && coverLetter.endsWith("'"))) {
      coverLetter = coverLetter.slice(1, -1).trim();
    }

    return NextResponse.json({
      success: true,
      coverLetter,
      generatedAt: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Error generating cover letter:', error);

    return NextResponse.json(
      {
        error: 'Failed to generate cover letter',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
