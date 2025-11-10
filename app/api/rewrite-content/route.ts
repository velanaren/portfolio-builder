/**
 * AI Content Enhancement API Route
 *
 * PURPOSE:
 * This API endpoint handles AI-powered content enhancement for resume sections.
 * It receives resume content (summary, experience, skills, projects), sends it to
 * the Groq API with specialized prompts that ENHANCE (not replace) user content,
 * and returns professionally improved text that preserves the user's original information.
 *
 * FLOW:
 * 1. Receives POST request with user's content to enhance
 * 2. Validates API key and request data
 * 3. Selects appropriate enhancement prompt based on content type
 * 4. Calls Groq API with low temperature (0.3) for consistent, focused enhancement
 * 5. Returns enhanced content to frontend (auto-applied directly)
 *
 * ENHANCEMENT PHILOSOPHY:
 * - Preserve user's original information, facts, and voice
 * - Improve clarity, professionalism, and ATS-friendliness
 * - DO NOT generate new content or fabricate achievements
 * - Stay true to what the user actually wrote
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
  text: string;      // The user's original content to be enhanced (required)
  type: 'summary' | 'experience' | 'skill' | 'project'; // Section type (required)
  context?: string;  // Optional additional context (e.g., job title, company name)
}

/**
 * Generate specialized prompts for different content types
 *
 * IMPORTANT: These prompts are designed to ENHANCE user content, NOT replace it.
 * The AI should preserve the user's original information, facts, and voice while
 * improving clarity, professionalism, and ATS-friendliness.
 *
 * Each content type has a unique prompt tailored to its purpose:
 * - Summary: Enhance clarity and professionalism while keeping user's experience
 * - Experience: Strengthen action verbs while preserving actual achievements
 * - Skill: Suggest only 3-5 relevant complementary skills
 * - Project: Clarify technical details while keeping actual project scope
 *
 * @param type - The type of content being enhanced
 * @param text - The original content from the user
 * @param context - Optional context (job title, company, etc.)
 * @returns Formatted prompt string for the AI
 */
const getPromptForType = (type: string, text: string, context?: string): string => {
  const prompts = {
    summary: `You are a professional resume editor. The user provided this professional summary:

"${text}"

Your task is to ENHANCE this summary while keeping the core information and user's voice intact.
Do NOT write new content or add information not present. Instead:

1. Preserve the original meaning and user's actual experience
2. Improve clarity and professionalism (clarify if vague, refine if unclear)
3. Add stronger action words (upgrade passive to active voice where appropriate)
4. Ensure it's ATS-friendly (include relevant keywords, clear structure)
5. Keep it concise (2-3 sentences, 50-100 words maximum)
6. DO NOT add achievements, years of experience, or qualifications the user didn't mention

${context ? `Additional context: ${context}` : ''}

Return ONLY the enhanced summary. No explanations, no suggestions, just the improved text that maintains the user's original information.`,

    experience: `You are a professional resume editor. The user provided this job description:

"${text}"

Your task is to ENHANCE this description while keeping the core facts the user provided.
Do NOT generate new achievements or add information not present. Instead:

1. Preserve all original facts mentioned by the user
2. Replace weak verbs with strong action verbs (e.g., "worked on" → "developed")
3. Clarify vague statements (make them more specific using the information provided)
4. If the user mentioned results or improvements, quantify them if possible
5. Make it ATS-friendly (clear format, relevant keywords)
6. DO NOT add achievements, responsibilities, or metrics the user didn't mention or imply
7. Keep the user's original experience - don't fabricate new accomplishments

${context ? `Additional context: ${context}` : ''}

Return ONLY the enhanced description. No explanations, no additional content.`,

    skill: `You are a professional resume editor. The user provided this information:

Summary/Context: "${context}"
Current Skills: "${text}"

Your task is to SUGGEST relevant additional skills that complement their existing profile.
Important guidelines:

1. Only suggest skills that are clearly related to the user's professional summary and current skills
2. DO NOT suggest unrelated or generic skills
3. Suggest only 3-5 skills (not more)
4. Make sure suggestions are relevant to their specific role and experience level
5. Include both technical and professional skills if applicable to their profile

Return ONLY a comma-separated list of suggested skills. Example: "Python, Data Analysis, Project Management"
No explanations, no descriptions, just the skill names.`,

    project: `You are a professional resume editor. The user provided this project description:

"${text}"

Your task is to ENHANCE this project description while keeping the user's actual project.
Do NOT invent new features, technologies, or achievements. Instead:

1. Preserve the actual project name, technologies used, and what was really built
2. Clarify technical details (if vague, make more specific based on what's provided)
3. Add impact/results if clearly implied by the user's description
4. Use stronger, more professional language for technical aspects
5. Make it clear what the user personally contributed (if mentioned)
6. DO NOT add features, technologies, or achievements the user didn't mention
7. Keep factually accurate - stay within the scope of what was described

${context ? `Additional context: ${context}` : ''}

Return ONLY the enhanced description. No explanations, no additional content.`,
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
     * MODEL: Configurable via GROQ_MODEL environment variable
     * Default: llama-3.1-8b-instant
     * - Fast and accurate for text enhancement tasks
     * - Stable and widely available
     * - Good balance of quality and speed
     *
     * PARAMETERS:
     * - temperature: 0.3 (low temperature for consistent, focused enhancement)
     *   Lower temperature (0.3) ensures AI stays close to user's original content
     *   and doesn't generate creative but inaccurate additions
     * - max_tokens: 500 (sufficient for resume sections)
     *
     * TO CHANGE MODEL:
     * Set GROQ_MODEL in .env.local:
     * - 'llama-3.1-8b-instant' (fast, recommended, default)
     * - 'llama-3.1-70b-versatile' (larger, more capable)
     * - 'gemma-7b-it' (alternative)
     * See: https://console.groq.com/docs/models
     */
    const model = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',      // Sender role (user sends the prompt)
          content: prompt,   // The specialized prompt for this content type
        },
      ],
      model: model,  // Use configurable model from environment or default
      temperature: 0.3,    // Low temperature = more consistent, less creative (stays true to user's content)
      max_tokens: 500,     // Maximum length of the response
    });

    /**
     * Step 3: Extract the enhanced text from the API response
     * Falls back to original text if API response is empty/invalid
     */
    const rewrittenText = chatCompletion.choices[0]?.message?.content?.trim() || text;

    /**
     * Step 4: Return success response with enhanced content
     * Frontend will auto-apply the enhanced text directly to the field
     */
    return NextResponse.json({
      original: text,           // Original content (kept for reference)
      rewritten: rewrittenText, // AI-enhanced content (auto-applied)
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
    console.error('Error enhancing content:', error);

    return NextResponse.json(
      {
        error: 'Failed to enhance content',  // User-friendly message
        details: error.message,              // Technical details for debugging
      },
      { status: 500 } // Internal Server Error
    );
  }
}
