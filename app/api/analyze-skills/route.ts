/**
 * API Route: Analyze Skills
 * Handles skills gap analysis between resume and job description using Groq AI
 */

import { NextRequest, NextResponse } from 'next/server';
import { ParsedResume, MatchedSkill, MissingSkill, BonusSkill, SkillsAnalysis } from '@/types';

/**
 * Extract skills from job description using Groq
 */
async function extractJobSkills(jobDescription: string): Promise<any[]> {
  const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;

  if (!apiKey || apiKey === '' || apiKey === 'your_groq_api_key_here') {
    console.warn('[ANALYZE] No Groq API key configured, using simplified extraction');
    // Simple keyword extraction as fallback
    return extractSkillsSimple(jobDescription);
  }

  const prompt = `Extract all technical and professional skills from this job description.
For each skill, identify:
1. Skill name
2. Category (programming-language, framework, database, tool, soft-skill, etc.)
3. Importance level (required/preferred/nice-to-have)
4. Difficulty (beginner/intermediate/advanced)
5. Estimated learning time if someone needs to acquire it

Return ONLY valid JSON array (no markdown, no extra text):
[
  {
    "name": "React",
    "category": "framework",
    "importance": "required",
    "difficulty": "intermediate",
    "estimatedLearningTime": "4-8 weeks"
  }
]

JOB DESCRIPTION:
${jobDescription}`;

  try {
    const model = process.env.NEXT_PUBLIC_GROQ_MODEL || 'llama-3.1-8b-instant';

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content returned from Groq API');
    }

    // Extract JSON from response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Could not find valid JSON in response');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error: any) {
    console.error('[ANALYZE] Error extracting job skills with Groq:', error.message);
    // Fallback to simple extraction
    return extractSkillsSimple(jobDescription);
  }
}

/**
 * Extract skills from resume using Groq
 */
async function extractResumeSkills(resumeData: ParsedResume): Promise<any[]> {
  const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;

  if (!apiKey || apiKey === '' || apiKey === 'your_groq_api_key_here') {
    console.warn('[ANALYZE] No Groq API key configured, using resume skills directly');
    // Use skills from parsed resume directly
    return resumeData.skills.map((skill) => ({
      name: skill,
      category: 'technical',
      proficiency: 'intermediate',
      yearsOfExperience: 2,
    }));
  }

  const resumeText = `
Name: ${resumeData.personalInfo.name}
Summary: ${resumeData.summary}
Skills: ${resumeData.skills.join(', ')}
Experience: ${resumeData.experience.map((exp) => `${exp.position} at ${exp.company} - ${exp.description}`).join('\n')}
Education: ${resumeData.education.map((edu) => `${edu.degree} in ${edu.field} from ${edu.institution}`).join('\n')}
`;

  const prompt = `Extract all technical and professional skills from this resume.
For each skill, identify:
1. Skill name
2. Category (programming-language, framework, database, tool, soft-skill, etc.)
3. Proficiency level (junior/intermediate/expert) based on context
4. Years of experience if mentioned

Return ONLY valid JSON array (no markdown, no extra text):
[
  {
    "name": "Python",
    "category": "programming-language",
    "proficiency": "expert",
    "yearsOfExperience": 8
  }
]

RESUME:
${resumeText}`;

  try {
    const model = process.env.NEXT_PUBLIC_GROQ_MODEL || 'llama-3.1-8b-instant';

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content returned from Groq API');
    }

    // Extract JSON from response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Could not find valid JSON in response');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error: any) {
    console.error('[ANALYZE] Error extracting resume skills with Groq:', error.message);
    // Fallback: use skills from parsed resume
    return resumeData.skills.map((skill) => ({
      name: skill,
      category: 'technical',
      proficiency: 'intermediate',
      yearsOfExperience: 2,
    }));
  }
}

/**
 * Perform skills matching and generate analysis using Groq
 */
async function performSkillsAnalysis(
  resumeSkills: any[],
  jobSkills: any[]
): Promise<SkillsAnalysis> {
  const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;

  if (!apiKey || apiKey === '' || apiKey === 'your_groq_api_key_here') {
    console.warn('[ANALYZE] No Groq API key configured, using simple matching');
    return performSimpleMatching(resumeSkills, jobSkills);
  }

  const prompt = `Analyze the skills match between a candidate and job position.

CANDIDATE SKILLS:
${JSON.stringify(resumeSkills, null, 2)}

JOB REQUIRED SKILLS:
${JSON.stringify(jobSkills, null, 2)}

Perform this analysis:
1. Match candidate skills to job requirements (exact matches, similar matches, related matches)
2. Calculate overall match percentage (0-100)
3. Identify missing skills (gaps)
4. Identify bonus skills (candidate has but job doesn't require)
5. Generate upskilling recommendations based on missing skills and career progression

Return ONLY valid JSON (no markdown, no extra text):
{
  "matchPercentage": 75,
  "matchingSkills": [
    {"name": "React", "matchScore": 100, "matchStrength": "exact", "proficiency": "expert"}
  ],
  "missingSkills": [
    {"name": "Docker", "importance": "required", "difficulty": "intermediate", "estimatedLearningTime": "4-8 weeks", "category": "tool"}
  ],
  "bonusSkills": [
    {"name": "Python", "relevance": "highly-relevant", "proficiency": "expert", "category": "programming-language"}
  ],
  "recommendations": [
    "Learn Docker (HIGH PRIORITY): Required for this role. Start with online courses and hands-on projects.",
    "Learn Kubernetes (HIGH PRIORITY): Critical for DevOps responsibilities. Estimated learning time: 8-12 weeks."
  ],
  "summary": "You are a good match for this role with 75% of required skills. Focus on learning Docker and Kubernetes to strengthen your profile."
}`;

  try {
    const model = process.env.NEXT_PUBLIC_GROQ_MODEL || 'llama-3.1-8b-instant';

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content returned from Groq API');
    }

    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not find valid JSON in response');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error: any) {
    console.error('[ANALYZE] Error performing analysis with Groq:', error.message);
    // Fallback to simple matching
    return performSimpleMatching(resumeSkills, jobSkills);
  }
}

/**
 * Simple skill extraction fallback (keyword-based)
 */
function extractSkillsSimple(text: string): any[] {
  const skillKeywords = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'Go', 'Rust', 'PHP',
    'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel',
    'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'Git', 'GitHub', 'GitLab',
    'HTML', 'CSS', 'Sass', 'Tailwind', 'Bootstrap',
    'REST', 'GraphQL', 'API', 'Microservices', 'Agile', 'Scrum',
  ];

  const foundSkills = skillKeywords.filter((skill) =>
    text.toLowerCase().includes(skill.toLowerCase())
  );

  return foundSkills.map((skill) => ({
    name: skill,
    category: 'technical',
    importance: 'required',
    difficulty: 'intermediate',
    estimatedLearningTime: '4-8 weeks',
  }));
}

/**
 * Simple matching fallback
 */
function performSimpleMatching(resumeSkills: any[], jobSkills: any[]): SkillsAnalysis {
  const resumeSkillNames = resumeSkills.map((s) => s.name.toLowerCase());
  const jobSkillNames = jobSkills.map((s) => s.name.toLowerCase());

  // Find matching skills
  const matchingSkills: MatchedSkill[] = resumeSkills
    .filter((rs) => jobSkillNames.includes(rs.name.toLowerCase()))
    .map((rs) => ({
      ...rs,
      matchScore: 100,
      matchStrength: 'exact' as const,
    }));

  // Find missing skills
  const missingSkills: MissingSkill[] = jobSkills
    .filter((js) => !resumeSkillNames.includes(js.name.toLowerCase()))
    .map((js) => ({
      ...js,
      importance: js.importance || 'required',
      difficulty: js.difficulty || 'intermediate',
      estimatedLearningTime: js.estimatedLearningTime || '4-8 weeks',
    }));

  // Find bonus skills
  const bonusSkills: BonusSkill[] = resumeSkills
    .filter((rs) => !jobSkillNames.includes(rs.name.toLowerCase()))
    .map((rs) => ({
      ...rs,
      relevance: 'somewhat-relevant' as const,
    }));

  // Calculate match percentage
  const matchPercentage = Math.round(
    (matchingSkills.length / Math.max(jobSkills.length, 1)) * 100
  );

  // Generate recommendations
  const recommendations = missingSkills
    .slice(0, 5)
    .map(
      (skill, index) =>
        `Learn ${skill.name} (${index < 2 ? 'HIGH' : 'MEDIUM'} PRIORITY): ${skill.importance === 'required' ? 'Required for this role.' : 'Preferred skill.'} Estimated learning time: ${skill.estimatedLearningTime}.`
    );

  const summary = `You match ${matchPercentage}% of the required skills for this role. ${matchingSkills.length} skills matched, ${missingSkills.length} skills to learn, and ${bonusSkills.length} bonus skills.`;

  return {
    matchPercentage,
    matchingSkills,
    missingSkills,
    bonusSkills,
    recommendations,
    summary,
  };
}

/**
 * POST handler for skills analysis
 */
export async function POST(request: NextRequest) {
  console.log('\n[ANALYZE] ========== NEW SKILLS ANALYSIS REQUEST ==========');

  try {
    const body = await request.json();
    const { jobDescription, resumeData } = body;

    if (!jobDescription || !resumeData) {
      return NextResponse.json(
        { error: 'Missing required fields: jobDescription, resumeData' },
        { status: 400 }
      );
    }

    console.log('[ANALYZE] Extracting skills from job description...');
    const jobSkills = await extractJobSkills(jobDescription);
    console.log('[ANALYZE] Job skills extracted:', jobSkills.length);

    console.log('[ANALYZE] Extracting skills from resume...');
    const resumeSkills = await extractResumeSkills(resumeData);
    console.log('[ANALYZE] Resume skills extracted:', resumeSkills.length);

    console.log('[ANALYZE] Performing skills analysis...');
    const analysis = await performSkillsAnalysis(resumeSkills, jobSkills);
    console.log('[ANALYZE] Analysis complete!');
    console.log('[ANALYZE] Match percentage:', analysis.matchPercentage);

    console.log('[ANALYZE] ========== ANALYSIS REQUEST COMPLETE ==========\n');

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error: any) {
    console.error('[ANALYZE] Error:', error.message);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
