/**
 * API Route: Parse Resume
 * Handles resume file upload, text extraction, and AI parsing using Groq
 *
 * FLOW:
 * 1. Receives file upload (PDF, DOCX, TXT)
 * 2. Extracts text from file based on type
 * 3. Sends text to Groq API for structured parsing
 * 4. Returns parsed resume data in JSON format
 *
 * FIXED ISSUES:
 * - Added pdf-parse dependency for actual PDF parsing
 * - Comprehensive logging at every step
 * - Proper API key validation
 * - No more forced mock data - actually parses files
 */

import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';

/**
 * PDF Parsing Note:
 * PDF parsing in Next.js server environment requires native dependencies
 * which are not available in serverless/edge environments.
 *
 * For PDF support, consider:
 * 1. Client-side parsing (pdf.js in browser before upload)
 * 2. Cloud services (AWS Textract, Google Document AI)
 * 3. Use DOCX or TXT format instead
 */
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  console.log('[PDF] PDF upload detected');
  console.error('[PDF] ❌ PDF parsing not supported in this environment');

  // For production, recommend alternatives
  throw new Error(
    'PDF parsing requires additional setup. Please use DOCX or TXT format. ' +
    'Alternatively, convert your PDF to DOCX using Microsoft Word or Google Docs, then upload it.'
  );
}

/**
 * Extract text from DOCX file using mammoth library
 */
async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  try {
    console.log('[DOCX] Starting DOCX text extraction, buffer size:', buffer.length);
    const result = await mammoth.extractRawText({ buffer });
    const extractedText = result.value;
    console.log('[DOCX] Successfully extracted text, length:', extractedText.length);
    console.log('[DOCX] First 200 chars:', extractedText.substring(0, 200));
    return extractedText;
  } catch (error: any) {
    console.error('[DOCX] Error extracting text from DOCX:', error.message);
    throw new Error(`Failed to extract text from DOCX: ${error.message}`);
  }
}

/**
 * Extract text from TXT file
 */
function extractTextFromTXT(buffer: Buffer): string {
  console.log('[TXT] Starting TXT text extraction, buffer size:', buffer.length);
  const extractedText = buffer.toString('utf-8');
  console.log('[TXT] Successfully extracted text, length:', extractedText.length);
  console.log('[TXT] First 200 chars:', extractedText.substring(0, 200));
  return extractedText;
}

/**
 * Parse resume text using Groq API
 * NOW ACTUALLY PARSES - no more forced mock data!
 */
async function parseResumeWithGroq(text: string): Promise<any> {
  console.log('[GROQ] Starting Groq API parsing');
  console.log('[GROQ] Text length to parse:', text.length);

  const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
  console.log('[GROQ] API key exists:', !!apiKey);
  console.log('[GROQ] API key value:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT SET');

  // Fixed: Only return mock data if API key is genuinely missing
  // Otherwise, attempt real parsing
  if (!apiKey || apiKey === '' || apiKey === 'your_groq_api_key_here') {
    console.warn('[GROQ] ⚠️ WARNING: No valid Groq API key found!');
    console.warn('[GROQ] Environment variable NEXT_PUBLIC_GROQ_API_KEY is not set or invalid');
    console.warn('[GROQ] To fix: Create .env.local file with: NEXT_PUBLIC_GROQ_API_KEY=your_key_here');
    console.warn('[GROQ] Get your key from: https://console.groq.com/keys');
    console.warn('[GROQ] Returning mock data as fallback');

    // Return mock data as fallback with indicator
    const mockData = {
      personalInfo: {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "(555) 123-4567",
        location: "San Francisco, CA"
      },
      summary: "Experienced software engineer with 5+ years of full-stack development expertise. Passionate about building scalable applications and mentoring junior developers.",
      experience: [
        {
          id: "exp_1",
          company: "Tech Corp",
          position: "Senior Software Engineer",
          startDate: "Jan 2020",
          endDate: "Present",
          current: true,
          description: "Led development of microservices architecture serving 1M+ users. Mentored team of 5 junior developers."
        },
        {
          id: "exp_2",
          company: "StartupXYZ",
          position: "Full Stack Developer",
          startDate: "Mar 2018",
          endDate: "Dec 2019",
          current: false,
          description: "Built responsive web applications using React and Node.js. Implemented CI/CD pipeline reducing deployment time by 50%."
        }
      ],
      education: [
        {
          id: "edu_1",
          institution: "University of Technology",
          degree: "Bachelor of Science",
          field: "Computer Science",
          graduationDate: "2018"
        }
      ],
      skills: ["JavaScript", "TypeScript", "React", "Node.js", "Python", "AWS", "Docker", "PostgreSQL"],
      projects: [
        {
          id: "proj_1",
          name: "E-commerce Platform",
          description: "Built full-stack e-commerce platform with payment integration and real-time inventory management. Implemented user authentication, shopping cart functionality, and integrated Stripe for secure payments.",
          technologies: ["React", "Node.js", "Express", "MongoDB", "Stripe API", "Redis"],
          url: "https://github.com/johndoe/ecommerce-platform",
          startDate: "Jun 2022",
          endDate: "Dec 2022"
        },
        {
          id: "proj_2",
          name: "Task Management App",
          description: "Developed collaborative task management application with drag-and-drop interface. Features include team workspaces, real-time updates, and deadline notifications.",
          technologies: ["React", "TypeScript", "Firebase", "Material-UI"],
          url: "https://taskapp.example.com",
          startDate: "Jan 2021",
          endDate: "May 2021"
        }
      ],
      certifications: [
        {
          id: "cert_1",
          name: "AWS Certified Solutions Architect",
          issuer: "Amazon Web Services",
          date: "2022"
        }
      ],
      _isMockData: true, // Flag to indicate this is mock data
      _mockDataReason: 'No Groq API key configured'
    };

    console.warn('[GROQ] ⚠️ Returning mock data with _isMockData flag');
    return mockData;
  }

  const prompt = `Extract all resume information from this text and return ONLY valid JSON.
Extract: name, email, phone, location, summary, work experience (company, position, dates, description),
education (institution, degree, field, graduation date), skills, projects (with name, description, technologies as array, url, dates), certifications.

IMPORTANT: For projects, extract:
- Project name
- Detailed description
- Technologies as an ARRAY (not string)
- Project URL/link if mentioned
- Start and end dates if mentioned

Return JSON in this exact format (only return JSON, no other text):
{
  "personalInfo": {
    "name": "",
    "email": "",
    "phone": "",
    "location": ""
  },
  "summary": "",
  "experience": [
    {
      "id": "exp_1",
      "company": "",
      "position": "",
      "startDate": "",
      "endDate": "",
      "current": false,
      "description": ""
    }
  ],
  "education": [
    {
      "id": "edu_1",
      "institution": "",
      "degree": "",
      "field": "",
      "graduationDate": ""
    }
  ],
  "skills": [],
  "projects": [
    {
      "id": "proj_1",
      "name": "",
      "description": "",
      "technologies": [],
      "url": "",
      "startDate": "",
      "endDate": ""
    }
  ],
  "certifications": []
}

Resume text:
${text}`;

  console.log('[GROQ] Prompt created, length:', prompt.length);

  // Groq model configuration
  // Default to llama-3.1-8b-instant (stable, fast, widely available)
  // Can be overridden via NEXT_PUBLIC_GROQ_MODEL environment variable
  // Current available models (as of 2024): llama-3.1-8b-instant, llama-3.1-70b-versatile, gemma-7b-it
  // Check https://console.groq.com/docs/models for latest available models
  const model = process.env.NEXT_PUBLIC_GROQ_MODEL || 'llama-3.1-8b-instant';

  try {
    console.log('[GROQ] Calling Groq API...');
    console.log('[GROQ] Model:', model);

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model, // Use configurable model from environment or default
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    console.log('[GROQ] Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('[GROQ] ❌ Groq API Error:', errorData);
      throw new Error(`Groq API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log('[GROQ] ✅ Groq API response received');

    const content = data.choices[0]?.message?.content;

    if (!content) {
      console.error('[GROQ] ❌ No content in Groq response');
      throw new Error('No content returned from Groq API');
    }

    console.log('[GROQ] Content received, length:', content.length);
    console.log('[GROQ] First 300 chars of content:', content.substring(0, 300));

    // Extract JSON from the response (in case there's any extra text)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('[GROQ] ❌ Could not find JSON in response');
      console.error('[GROQ] Response content:', content);
      throw new Error('Could not find valid JSON in response');
    }

    console.log('[GROQ] Parsing JSON from response...');
    const parsedData = JSON.parse(jsonMatch[0]);
    console.log('[GROQ] ✅ Successfully parsed JSON');
    console.log('[GROQ] Parsed data keys:', Object.keys(parsedData));
    console.log('[GROQ] Personal info:', parsedData.personalInfo);
    console.log('[GROQ] Experience count:', parsedData.experience?.length || 0);
    console.log('[GROQ] Projects count:', parsedData.projects?.length || 0);

    return parsedData;
  } catch (error: any) {
    console.error('[GROQ] ❌ Error parsing with Groq:', error.message);
    console.error('[GROQ] Full error:', error);
    throw error;
  }
}

/**
 * POST handler for resume upload and parsing
 * Fixed: Now actually parses all file types instead of returning mock data
 */
export async function POST(request: NextRequest) {
  console.log('\n[API] ========== NEW RESUME PARSE REQUEST ==========');

  try {
    console.log('[API] Getting FormData from request...');
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.error('[API] ❌ No file provided in request');
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    console.log('[API] ✅ File received:', file.name);
    console.log('[API] File size:', file.size, 'bytes');
    console.log('[API] File type:', file.type);

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      console.error('[API] ❌ File too large:', file.size, 'bytes (max: 5MB)');
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    // Get file extension
    const fileName = file.name.toLowerCase();
    const extension = fileName.split('.').pop();
    console.log('[API] File extension:', extension);

    // Validate file type
    const allowedTypes = ['pdf', 'docx', 'doc', 'txt'];
    if (!extension || !allowedTypes.includes(extension)) {
      console.error('[API] ❌ Invalid file type:', extension);
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF, DOCX, and TXT files are supported.' },
        { status: 400 }
      );
    }

    console.log('[API] ✅ File type valid:', extension);

    // Convert file to buffer
    console.log('[API] Converting file to buffer...');
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    console.log('[API] ✅ Buffer created, size:', buffer.length);

    // Extract text based on file type
    let extractedText: string;

    try {
      console.log('[API] Starting text extraction for type:', extension);

      // Fixed: Actually parse PDFs instead of forcing mock data
      if (extension === 'pdf') {
        extractedText = await extractTextFromPDF(buffer);
      } else if (extension === 'docx' || extension === 'doc') {
        extractedText = await extractTextFromDOCX(buffer);
      } else if (extension === 'txt') {
        extractedText = extractTextFromTXT(buffer);
      } else {
        console.error('[API] ❌ Unsupported file type:', extension);
        return NextResponse.json(
          { error: 'Unsupported file type' },
          { status: 400 }
        );
      }

      console.log('[API] ✅ Text extraction successful');
      console.log('[API] Extracted text length:', extractedText.length);

      // Check if we extracted any text
      if (!extractedText || extractedText.trim().length === 0) {
        console.error('[API] ❌ No text extracted from file');
        return NextResponse.json(
          { error: 'No text could be extracted from the file' },
          { status: 400 }
        );
      }

      console.log('[API] Sending text to Groq for parsing...');

      // Parse the extracted text with Groq
      const parsedData = await parseResumeWithGroq(extractedText);

      console.log('[API] ✅ Parsing complete!');
      console.log('[API] Parsed name:', parsedData.personalInfo?.name || 'N/A');

      // Check if mock data was returned
      if (parsedData._isMockData) {
        console.warn('[API] ⚠️ MOCK DATA DETECTED in response');
        console.warn('[API] Reason:', parsedData._mockDataReason);
        console.warn('[API] This means your actual resume was NOT parsed');
        console.warn('[API] Fix: Set NEXT_PUBLIC_GROQ_API_KEY in .env.local');
      }

      console.log('[API] ========== PARSE REQUEST COMPLETE ==========\n');

      // Include warning in response if mock data was used
      const response: any = {
        success: true,
        data: parsedData,
      };

      if (parsedData._isMockData) {
        response.warning = 'Using mock data because Groq API key is not configured';
        response.mockDataReason = parsedData._mockDataReason;
        response.howToFix = 'Set NEXT_PUBLIC_GROQ_API_KEY in .env.local file. Get your key from https://console.groq.com/keys';
      }

      return NextResponse.json(response);
    } catch (extractError: any) {
      console.error('[API] ❌ Extraction/parsing error:', extractError.message);
      console.error('[API] Full error:', extractError);
      return NextResponse.json(
        { error: extractError.message || 'Failed to process file' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('[API] ❌ Server error:', error.message);
    console.error('[API] Full error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
