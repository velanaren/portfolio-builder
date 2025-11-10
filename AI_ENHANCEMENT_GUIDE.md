# AI Enhancement Implementation Guide

## Overview

This guide explains how the AI-powered content enhancement feature works in the resume builder application. The AI enhancement uses the Groq API to rewrite and improve resume content sections.

---

## Complete AI Enhancement Flow

### 1. User Clicks "Enhance with AI" Button

**Location**: Any section component (Summary, Experience, Skills, Projects)

**Example**: `components/resume-sections/ProjectsSection.tsx:218`

```typescript
<button
  onClick={() => handleEnhance(proj)}
  disabled={enhancingId === proj.id}
  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#D4A574]..."
>
  <Sparkles className="h-4 w-4" />
  <span>Enhance</span>
</button>
```

### 2. Frontend Validates Content

**Location**: `components/resume-sections/ProjectsSection.tsx:60-64`

```typescript
const handleEnhance = async (proj: Project) => {
  // Validation: Ensure content exists before sending to API
  if (!proj.description || proj.description.trim().length === 0) {
    alert('Please write a description first');
    return;
  }

  setEnhancingId(proj.id); // Show loading state
  // ...
};
```

### 3. POST Request to API Endpoint

**Location**: `components/resume-sections/ProjectsSection.tsx:69-77`

```typescript
const response = await fetch('/api/rewrite-content', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: proj.description,              // Content to enhance
    type: 'project',                     // Section type
    context: `${proj.name} using ${proj.technologies.join(', ')}`, // Additional context
  }),
});
```

**Request Payload Example**:
```json
{
  "text": "Built an e-commerce platform",
  "type": "project",
  "context": "E-commerce Platform using React, Node.js, MongoDB"
}
```

### 4. API Route Processes Request

**Location**: `app/api/rewrite-content/route.ts`

**Step 4a**: Validate API Key
```typescript
// Line 52-56
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === '') {
  return NextResponse.json(
    { error: 'Groq API key not configured' },
    { status: 500 }
  );
}
```

**Step 4b**: Get Appropriate Prompt for Content Type
```typescript
// Line 62-88
const getPromptForType = (type: string, text: string, context?: string): string => {
  const prompts = {
    summary: `You are a professional resume writer. Rewrite the following professional summary to be more impactful and ATS-friendly...`,

    experience: `You are a professional resume writer. Rewrite the following job experience description using strong action verbs and quantifiable achievements...`,

    skill: `You are a professional resume writer. Based on the following professional summary and current skills, suggest 5-8 additional relevant skills...`,

    project: `You are a professional resume writer. Rewrite the following project description to be more impactful. Focus on technical achievements, challenges solved, and measurable impact...`,
  };

  return prompts[type as keyof typeof prompts] || prompts.summary;
};
```

**Step 4c**: Call Groq API
```typescript
// Groq model is configurable via environment variable
const model = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';

const completion = await groq.chat.completions.create({
  messages: [
    {
      role: 'user',
      content: prompt,
    },
  ],
  model: model, // Uses GROQ_MODEL from .env.local or defaults to llama-3.1-8b-instant
  temperature: 0.7,
  max_tokens: 500,
  top_p: 1,
});

const rewrittenText = completion.choices[0]?.message?.content || '';
```

**Note**: The Groq model is now configurable! Default is `llama-3.1-8b-instant` (fast, stable, widely available).

**To change the model**, add to your `.env.local`:
```bash
# Optional: Override Groq model (default: llama-3.1-8b-instant)
GROQ_MODEL=llama-3.1-70b-versatile  # For better quality but slower
# OR
GROQ_MODEL=gemma-7b-it  # Alternative model
```

**Available Models**:
- `llama-3.1-8b-instant` - Fast, stable (default, recommended)
- `llama-3.1-70b-versatile` - Larger, more capable (slower)
- `gemma-7b-it` - Alternative instruction-tuned model
- Check https://console.groq.com/docs/models for latest available models

**Step 4d**: Return Enhanced Content
```typescript
// Line 122-125
return NextResponse.json({
  success: true,
  rewritten: rewrittenText.trim(),
});
```

### 5. Frontend Receives Response

**Location**: `components/resume-sections/ProjectsSection.tsx:79-87`

```typescript
const data = await response.json();

if (data.success) {
  // Store the rewritten content
  setRewrittenText(data.rewritten);
  setCurrentProjectId(proj.id);

  // Show comparison modal
  setShowComparison(true);
} else {
  alert('Failed to enhance description. Please try again.');
}
```

### 6. Comparison Modal Displays

**Location**: `components/ComparisonModal.tsx`

**Features**:
- **Fixed Positioning**: Modal appears centered on viewport (not page)
- **Semi-transparent Backdrop**: `bg-black/50` overlay
- **Side-by-side Comparison**: Original vs AI-enhanced content
- **User Actions**: Accept or Reject buttons
- **ESC Key Handler**: Close modal with Escape key
- **Click Outside**: Close modal by clicking backdrop

```typescript
// Line 65-153
<div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50">
  <div className="bg-white rounded-xl...">
    {/* Header */}
    <div className="flex items-center justify-between p-4">
      <h3>AI Enhancement Suggestion</h3>
      <button onClick={onClose}><X /></button>
    </div>

    {/* Comparison */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Original */}
      <div className="bg-[#F8FAFB] border border-[#E5E7EB]">
        <p>{original}</p>
      </div>

      {/* AI Suggested */}
      <div className="bg-[#FFFBF7] border-2 border-[#D4A574]">
        <p>{rewritten}</p>
      </div>
    </div>

    {/* Actions */}
    <div className="flex gap-3">
      <button onClick={onReject}>Reject</button>
      <button onClick={onAccept}>Accept</button>
    </div>
  </div>
</div>
```

### 7. User Accepts or Rejects

**Accept Action** (`components/resume-sections/ProjectsSection.tsx:96-102`):
```typescript
const handleAccept = () => {
  if (currentProjectId) {
    // Update the project with AI-enhanced description
    handleChange(currentProjectId, 'description', rewrittenText);
  }
  setShowComparison(false);
  setCurrentProjectId(null);
};
```

**Reject Action** (`components/resume-sections/ProjectsSection.tsx:104-107`):
```typescript
const handleReject = () => {
  // Simply close modal, keep original content
  setShowComparison(false);
  setCurrentProjectId(null);
};
```

### 8. Auto-Save Persists Changes

**Location**: `app/(protected)/resume-editor/edit/page.tsx:71-79`

```typescript
// Auto-save with 1-second debounce
useEffect(() => {
  if (!resume) return;

  const timer = setTimeout(() => {
    saveResume(); // Saves to localStorage
  }, 1000);

  return () => clearTimeout(timer);
}, [resume, saveResume]);
```

---

## Groq API Configuration

### Where the API Key is Used

**Primary Location**: `app/api/rewrite-content/route.ts:52-53`

```typescript
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});
```

**Secondary Location (for resume parsing)**: `app/api/parse-resume/route.ts:52`

```typescript
const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
```

### How to Configure the API Key

**Step 1**: Create a `.env.local` file in the project root:

```bash
# .env.local
GROQ_API_KEY=your_actual_groq_api_key_here
NEXT_PUBLIC_GROQ_API_KEY=your_actual_groq_api_key_here
```

**Step 2**: Get your API key from [Groq Console](https://console.groq.com/keys)

**Step 3**: Restart your Next.js development server:

```bash
npm run dev
```

### How to Change/Replace the API Key

**Option 1**: Update `.env.local` file
```bash
GROQ_API_KEY=new_api_key_here
```

**Option 2**: Set environment variables directly (for production):
```bash
export GROQ_API_KEY="your_key_here"
```

**Option 3**: Configure in hosting platform (Vercel, Netlify, etc.)
- Add `GROQ_API_KEY` as environment variable in dashboard

---

## Alternative API Providers

### Option 1: OpenAI GPT

**File to Modify**: `app/api/rewrite-content/route.ts`

**Install SDK**:
```bash
npm install openai
```

**Replace Groq with OpenAI**:
```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// In POST handler:
const completion = await openai.chat.completions.create({
  messages: [
    {
      role: 'user',
      content: prompt,
    },
  ],
  model: 'gpt-3.5-turbo', // or 'gpt-4'
  temperature: 0.7,
  max_tokens: 500,
});
```

### Option 2: Anthropic Claude

**Install SDK**:
```bash
npm install @anthropic-ai/sdk
```

**Replace with Claude**:
```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// In POST handler:
const completion = await anthropic.messages.create({
  model: 'claude-3-sonnet-20240229',
  max_tokens: 500,
  messages: [
    {
      role: 'user',
      content: prompt,
    },
  ],
});

const rewrittenText = completion.content[0].text;
```

### Option 3: Google Gemini

**Install SDK**:
```bash
npm install @google/generative-ai
```

**Replace with Gemini**:
```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

// In POST handler:
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
const result = await model.generateContent(prompt);
const rewrittenText = result.response.text();
```

---

## File Location Checklist

### AI Enhancement Feature Files

| File | Purpose | Key Functions |
|------|---------|---------------|
| `app/api/rewrite-content/route.ts` | API endpoint for AI enhancement | `POST()`, `getPromptForType()` |
| `components/ComparisonModal.tsx` | Shows original vs AI-enhanced content | Modal UI, ESC handler, backdrop click |
| `components/resume-sections/SummarySection.tsx` | Summary enhancement | `handleEnhance()`, `handleAccept()` |
| `components/resume-sections/WorkExperienceSection.tsx` | Experience enhancement | `handleEnhance()`, per-job enhancement |
| `components/resume-sections/SkillsSection.tsx` | Skill suggestions | `handleEnhance()`, skill suggestions |
| `components/resume-sections/ProjectsSection.tsx` | Project enhancement | `handleEnhance()`, per-project enhancement |
| `app/(protected)/resume-editor/edit/page.tsx` | Main editor with auto-save | Auto-save with debounce |

### Configuration Files

| File | Purpose |
|------|---------|
| `.env.local` | Environment variables (API keys) |
| `package.json` | Dependencies (groq-sdk) |
| `types/index.ts` | TypeScript interfaces |

---

## Exact Prompts Being Used

### Summary Prompt

```typescript
`You are a professional resume writer. Rewrite the following professional summary
to be more impactful and ATS-friendly. Keep it concise (2-3 sentences), highlight
key strengths, and make it compelling. Return only the rewritten summary without
any explanations.

Original: ${text}`
```

**Example Input**: "Software engineer with experience in web development"

**Example Output**: "Results-driven Software Engineer with 5+ years of expertise in full-stack web development. Proven track record of delivering scalable applications using modern JavaScript frameworks and cloud technologies. Passionate about writing clean, maintainable code and mentoring junior developers."

### Experience Prompt

```typescript
`You are a professional resume writer. Rewrite the following job experience
description using strong action verbs and quantifiable achievements. Focus on
impact and results. Keep it concise but impactful. Return only the rewritten
description without any explanations.

${context ? `Context: ${context}\n\n` : ''}Original: ${text}`
```

**Example Input**: "Worked on frontend development"

**Example Output**: "Led frontend development initiatives, implementing responsive React components that improved user engagement by 40%. Collaborated with cross-functional teams to deliver features 30% faster through agile methodologies."

### Skills Prompt

```typescript
`You are a professional resume writer. Based on the following professional summary
and current skills, suggest 5-8 additional relevant skills that would strengthen
the resume. Return ONLY the skills as a comma-separated list, nothing else.

Summary: ${context}

Current skills: ${text}

Return format: Skill1, Skill2, Skill3`
```

**Example Input**:
- Context: "Senior Software Engineer specializing in cloud architecture"
- Current Skills: "JavaScript, React, Node.js"

**Example Output**: "AWS, Docker, Kubernetes, Terraform, CI/CD, Microservices, PostgreSQL, Redis"

### Project Prompt

```typescript
`You are a professional resume writer. Rewrite the following project description
to be more impactful. Focus on technical achievements, challenges solved, and
measurable impact. Use strong action verbs. Keep it concise but compelling.
Return only the rewritten description without any explanations.

${context ? `Context: ${context}\n\n` : ''}Original: ${text}`
```

**Example Input**:
- Context: "E-commerce Platform using React, Node.js, MongoDB"
- Text: "Built an online store with shopping cart"

**Example Output**: "Architected and deployed a full-stack e-commerce platform serving 10K+ monthly users. Implemented secure payment processing with Stripe, real-time inventory management, and responsive UI/UX. Optimized MongoDB queries reducing page load times by 60%."

---

## Debugging Tips

### 1. API Key Issues

**Problem**: "Groq API key not configured" error

**Solution**:
```bash
# Check if .env.local exists
ls -la .env.local

# Verify environment variables are loaded
console.log('API Key exists:', !!process.env.GROQ_API_KEY);

# Restart dev server after adding .env.local
npm run dev
```

### 2. Network Errors

**Problem**: "Failed to enhance description"

**Debug Steps**:
```typescript
// Add logging in handleEnhance function
try {
  const response = await fetch('/api/rewrite-content', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, type, context }),
  });

  console.log('Response status:', response.status);
  const data = await response.json();
  console.log('Response data:', data);

  if (data.success) {
    // ...
  }
} catch (error) {
  console.error('Network error:', error);
}
```

### 3. Modal Not Appearing

**Problem**: Modal doesn't show after clicking Enhance

**Debug Checklist**:
- Check `showComparison` state: `console.log('Modal open:', showComparison)`
- Verify `rewrittenText` has content: `console.log('Rewritten:', rewrittenText)`
- Check z-index conflicts: Modal uses `z-[1000]`
- Inspect for backdrop overlay: Should have `bg-black/50`

### 4. API Rate Limits

**Problem**: "Too many requests" error

**Solution**:
```typescript
// Add rate limiting check
if (response.status === 429) {
  alert('API rate limit reached. Please wait a moment before trying again.');
  return;
}
```

### 5. Content Not Updating

**Problem**: Accepted content doesn't appear in preview

**Debug Steps**:
```typescript
// In handleAccept, add logging
const handleAccept = () => {
  console.log('Before update:', resume.projects);

  if (currentProjectId) {
    handleChange(currentProjectId, 'description', rewrittenText);
    console.log('After update:', resume.projects);
  }

  setShowComparison(false);
};
```

### 6. Test API Endpoint Directly

**Using curl**:
```bash
curl -X POST http://localhost:3000/api/rewrite-content \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Built a website",
    "type": "project",
    "context": "Portfolio Website using Next.js"
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "rewritten": "Architected and developed a modern portfolio website using Next.js..."
}
```

---

## Performance Optimization

### Debouncing Enhancement Requests

To prevent multiple rapid API calls:

```typescript
// Add debounce to handleEnhance
const [enhanceTimeout, setEnhanceTimeout] = useState<NodeJS.Timeout | null>(null);

const handleEnhance = async (proj: Project) => {
  // Clear previous timeout
  if (enhanceTimeout) {
    clearTimeout(enhanceTimeout);
  }

  // Set new timeout
  const timeout = setTimeout(async () => {
    // Actual enhancement logic here
  }, 500);

  setEnhanceTimeout(timeout);
};
```

### Caching Enhanced Content

To avoid re-enhancing the same content:

```typescript
// Add caching layer
const [enhancementCache, setEnhancementCache] = useState<Map<string, string>>(new Map());

const handleEnhance = async (proj: Project) => {
  const cacheKey = `${proj.id}_${proj.description}`;

  // Check cache first
  if (enhancementCache.has(cacheKey)) {
    setRewrittenText(enhancementCache.get(cacheKey)!);
    setShowComparison(true);
    return;
  }

  // Call API and cache result
  const data = await response.json();
  if (data.success) {
    enhancementCache.set(cacheKey, data.rewritten);
    setRewrittenText(data.rewritten);
    setShowComparison(true);
  }
};
```

---

## Security Best Practices

1. **Never expose API keys in frontend code**
   - Always use server-side API routes (`app/api/...`)
   - Use `GROQ_API_KEY` (without `NEXT_PUBLIC_` prefix) for server-only keys

2. **Validate user input before sending to AI**
   - Check content length
   - Sanitize input to prevent injection
   - Implement rate limiting

3. **Handle errors gracefully**
   - Don't expose internal errors to users
   - Log errors server-side for debugging
   - Show user-friendly error messages

4. **Implement request throttling**
   - Limit enhancement requests per user
   - Add cooldown periods between requests

---

## Summary

The AI enhancement feature follows this flow:
1. User clicks "Enhance" →
2. Frontend validates and sends POST request →
3. API route processes with Groq →
4. Returns enhanced content →
5. Comparison modal shows both versions →
6. User accepts/rejects →
7. Auto-save persists changes

**Key Files**:
- API: `app/api/rewrite-content/route.ts`
- Modal: `components/ComparisonModal.tsx`
- Sections: `components/resume-sections/*.tsx`

**API Key Location**: `.env.local` → `GROQ_API_KEY`

**Alternative Providers**: OpenAI, Anthropic Claude, Google Gemini (see guide above)
