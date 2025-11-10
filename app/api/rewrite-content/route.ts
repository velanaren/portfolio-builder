/**
 * AI Content Rewrite API Route
 *
 * PURPOSE:
 * This API endpoint handles AI-powered content enhancement for resume sections.
 * It receives resume content (summary, experience, skills, projects), sends it to
 * the Groq API with specialized prompts, and returns professionally rewritten content.
 *
 * FLOW:
 * 1. Receives POST request with content to enhance
 * 2. Validates API key and request data
 * 3. Selects appropriate prompt based on content type
 * 4. Calls Groq API with the prompt
 * 5. Returns enhanced content to frontend
 *
 * API KEY:
 * Requires GROQ_API_KEY environment variable in .env.local
 * Get your key from: https://console.groq.com/keys
 *
 * ALTERNATIVE PROVIDERS:
 * You can replace Groq with OpenAI, Anthropic Claude, or Google Gemini.
 * See AI_ENHANCEMENT_GUIDE.md for detailed instructions.
 */

import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk'; // SDK for Groq API - install via: npm install groq-sdk

/**
 * Initialize Groq client with API key from environment variables
 * IMPORTANT: This key is loaded server-side only and never exposed to the frontend
 */
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '', // Server-side env variable (no NEXT_PUBLIC_ prefix)
});

/**
 * Request body interface
 * Defines the structure of incoming enhancement requests
 */
interface RewriteRequest {
  text: string;      // The content to be rewritten (required)
  type: 'summary' | 'experience' | 'skill' | 'project'; // Section type (required)
  context?: string;  // Optional additional context (e.g., job title, company name)
}

/**
 * Generate specialized prompts for different content types
 *
 * Each content type has a unique prompt tailored to its purpose:
 * - Summary: 2-3 sentences, achievement-oriented, professional
 * - Experience: Action verbs, quantifiable achievements, impact-focused
 * - Skill: Suggests 5-8 complementary skills based on profile
 * - Project: Technical challenges, contributions, measurable impact
 *
 * @param type - The type of content being rewritten
 * @param text - The original content
 * @param context - Optional context (job title, company, etc.)
 * @returns Formatted prompt string for the AI
 */
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

  // Default to summary prompt if type is unrecognized
  return prompts[type as keyof typeof prompts] || prompts.summary;
};

/**
 * POST Handler - Main API Endpoint
 *
 * This function handles incoming POST requests to enhance resume content.
 * It validates the request, calls the Groq API, and returns the enhanced content.
 *
 * REQUEST FORMAT:
 * {
 *   "text": "original content here",
 *   "type": "summary" | "experience" | "skill" | "project",
 *   "context": "optional context"
 * }
 *
 * RESPONSE FORMAT (Success):
 * {
 *   "original": "original text",
 *   "rewritten": "enhanced text",
 *   "success": true
 * }
 *
 * RESPONSE FORMAT (Error):
 * {
 *   "error": "error message",
 *   "details": "detailed error info",
 *   "success": false
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body: RewriteRequest = await request.json();
    const { text, type, context } = body;

    // Validate required fields
    if (!text || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: text and type' },
        { status: 400 } // Bad Request
      );
    }

    /**
     * Fallback Mode: Return mock data if API key is not configured
     *
     * This allows the application to run in demo mode without requiring
     * a Groq API key. Useful for testing and development.
     *
     * IMPORTANT: For production, always set GROQ_API_KEY in .env.local
     */
    if (!process.env.GROQ_API_KEY) {
      // Mock responses for each content type
      const mockResponses = {
        summary: `Accomplished ${context || 'professional'} with proven expertise in driving innovation and delivering results. Demonstrated success in leading cross-functional teams and implementing strategic initiatives that enhance operational efficiency and business growth.`,
        experience: `• Led and delivered high-impact projects that resulted in measurable improvements\n• Collaborated with cross-functional teams to drive innovation and operational excellence\n• Implemented best practices and mentored team members, fostering a culture of continuous improvement`,
        skill: 'React, TypeScript, Node.js, Python, AWS, Docker, Kubernetes, CI/CD',
        project: `Developed and deployed a comprehensive solution that addressed key business challenges. Leveraged modern technologies to create a scalable, user-friendly platform. Successfully delivered the project on time, resulting in improved efficiency and user satisfaction.`,
      };

      // Return mock response
      return NextResponse.json({
        original: text,
        rewritten: mockResponses[type as keyof typeof mockResponses] || text,
        success: true,
      });
    }

    /**
     * Step 1: Generate the appropriate prompt
     * Selects a specialized prompt based on the content type
     */
    const prompt = getPromptForType(type, text, context);

    /**
     * Step 2: Call Groq API for content enhancement
     *
     * MODEL: llama-3.3-70b-versatile
     * - Fast and accurate for text rewriting tasks
     * - Handles complex instructions well
     * - Good balance of quality and speed
     *
     * PARAMETERS:
     * - temperature: 0.7 (balanced creativity vs consistency)
     * - max_tokens: 500 (sufficient for resume sections)
     *
     * TO CHANGE MODEL:
     * Replace 'llama-3.3-70b-versatile' with:
     * - 'mixtral-8x7b-32768' (faster, less creative)
     * - 'llama-3.1-70b-versatile' (more creative)
     * See: https://console.groq.com/docs/models
     */
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',      // Sender role (user sends the prompt)
          content: prompt,   // The specialized prompt for this content type
        },
      ],
      model: 'llama-3.3-70b-versatile',  // AI model to use
      temperature: 0.7,    // Controls randomness (0.0 = deterministic, 1.0 = creative)
      max_tokens: 500,     // Maximum length of the response
    });

    /**
     * Step 3: Extract the enhanced text from the API response
     * Falls back to original text if API response is empty/invalid
     */
    const rewrittenText = chatCompletion.choices[0]?.message?.content?.trim() || text;

    /**
     * Step 4: Return success response with both original and rewritten content
     * Frontend will display these side-by-side in ComparisonModal
     */
    return NextResponse.json({
      original: text,           // Original content for comparison
      rewritten: rewrittenText, // AI-enhanced content
      success: true,            // Success flag
    });

  } catch (error: any) {
    /**
     * Error Handling
     *
     * Catches and logs all errors:
     * - Network errors (API unreachable)
     * - API errors (rate limits, invalid keys)
     * - Parsing errors (invalid JSON)
     *
     * Returns user-friendly error message while logging details server-side
     */
    console.error('Error rewriting content:', error);

    return NextResponse.json(
      {
        error: 'Failed to rewrite content',  // User-friendly message
        details: error.message,              // Technical details for debugging
      },
      { status: 500 } // Internal Server Error
    );
  }
}
