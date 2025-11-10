/**
 * API Route: Parse Resume
 * Handles resume file upload, text extraction, and AI parsing using Groq
 *
 * NOTE: PDF parsing requires native dependencies. For production, consider using:
 * - A cloud service like AWS Textract or Google Document AI
 * - pdf-lib for client-side parsing
 * - This demo uses mock data for PDFs
 */

import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';

/**
 * Extract text from PDF file (Mock implementation for demo)
 * In production, integrate with a PDF parsing service
 */
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  // For demo purposes, return a message
  // In production, use a cloud PDF parsing service
  return `PDF parsing requires additional setup. For this demo, please use TXT or DOCX files.

To add PDF support in production:
1. Use a cloud service like AWS Textract or Google Document AI
2. Use a server with native dependencies installed
3. Or parse PDFs on the client side before upload`;
}

/**
 * Extract text from DOCX file
 */
async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    throw new Error('Failed to extract text from DOCX');
  }
}

/**
 * Extract text from TXT file
 */
function extractTextFromTXT(buffer: Buffer): string {
  return buffer.toString('utf-8');
}

/**
 * Parse resume text using Groq API
 */
async function parseResumeWithGroq(text: string): Promise<any> {
  const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;

  if (!apiKey || apiKey === 'your_groq_api_key_here') {
    // Return mock data if API key is not configured
    return {
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
      ]
    };
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

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
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

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Groq API Error:', errorData);
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content returned from Groq API');
    }

    // Extract JSON from the response (in case there's any extra text)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not find valid JSON in response');
    }

    const parsedData = JSON.parse(jsonMatch[0]);
    return parsedData;
  } catch (error) {
    console.error('Error parsing with Groq:', error);
    throw error;
  }
}

/**
 * POST handler for resume upload and parsing
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    // Get file extension
    const fileName = file.name.toLowerCase();
    const extension = fileName.split('.').pop();

    // Validate file type
    const allowedTypes = ['pdf', 'docx', 'doc', 'txt'];
    if (!extension || !allowedTypes.includes(extension)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF, DOCX, and TXT files are supported.' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text based on file type
    let extractedText: string;

    try {
      if (extension === 'pdf') {
        // For demo: PDF support requires additional setup
        // Show user they should use TXT or DOCX, or use mock data
        const useDemo = true; // Set to false when PDF parsing is properly configured

        if (useDemo) {
          // Use mock data for demo
          const mockData = await parseResumeWithGroq('Demo resume content');
          return NextResponse.json({
            success: true,
            data: mockData,
            note: 'Using demo data. PDF parsing requires additional setup. Please use TXT or DOCX files for actual parsing.',
          });
        } else {
          extractedText = await extractTextFromPDF(buffer);
        }
      } else if (extension === 'docx' || extension === 'doc') {
        extractedText = await extractTextFromDOCX(buffer);
      } else if (extension === 'txt') {
        extractedText = extractTextFromTXT(buffer);
      } else {
        return NextResponse.json(
          { error: 'Unsupported file type' },
          { status: 400 }
        );
      }

      // Check if we extracted any text
      if (!extractedText || extractedText.trim().length === 0) {
        return NextResponse.json(
          { error: 'No text could be extracted from the file' },
          { status: 400 }
        );
      }

      // Parse the extracted text with Groq
      const parsedData = await parseResumeWithGroq(extractedText);

      return NextResponse.json({
        success: true,
        data: parsedData,
      });
    } catch (extractError: any) {
      console.error('Extraction error:', extractError);
      return NextResponse.json(
        { error: extractError.message || 'Failed to process file' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
