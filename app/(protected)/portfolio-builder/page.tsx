/**
 * Portfolio Builder Page - Phase 7
 * Dynamic portfolio website generator
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import { parseResumeFile } from '@/lib/resumeParsing';
import { ParsedResume, PortfolioContent, PortfolioCustomization, PortfolioTemplate } from '@/types';
import { getDefaultCustomization } from '@/lib/portfolio/templates';
import toast, { Toaster } from 'react-hot-toast';
import { ChevronLeft, Download, Sparkles } from 'lucide-react';

// Import components
import ResumeUpload from '@/components/skills-analysis/ResumeUpload';
import ResumeReview from '@/components/skills-analysis/ResumeReview';
import TemplateSelector from '@/components/portfolio/TemplateSelector';
import EditorPanel from '@/components/portfolio/EditorPanel';
import LivePreview from '@/components/portfolio/LivePreview';
import CustomizationPanel from '@/components/portfolio/CustomizationPanel';

type Step = 'upload' | 'review' | 'template' | 'generate';

export default function PortfolioBuilderPage() {
  const router = useRouter();
  const { requireAuth, isLoading: authLoading } = useAuth();

  // Step management
  const [currentStep, setCurrentStep] = useState<Step>('upload');

  // Resume state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedResume, setParsedResume] = useState<ParsedResume | null>(null);
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<'high' | 'medium' | 'low'>('medium');
  const [warnings, setWarnings] = useState<string[]>([]);

  // Template selection
  const [selectedTemplate, setSelectedTemplate] = useState<PortfolioTemplate | null>(null);

  // Portfolio content
  const [portfolioContent, setPortfolioContent] = useState<PortfolioContent | null>(null);
  const [customization, setCustomization] = useState<PortfolioCustomization | null>(null);

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generatedFiles, setGeneratedFiles] = useState<Array<{ path: string; content: string }>>([]);

  // Editor state
  const [activeEditorTab, setActiveEditorTab] = useState<'content' | 'customize'>('content');

  useEffect(() => {
    requireAuth();
  }, [requireAuth]);

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setParseError(null);
    setIsParsingResume(true);

    try {
      const result = await parseResumeFile(file);

      if (result.success && result.resumeData) {
        setParsedResume(result.resumeData);
        setConfidence(result.confidence || 'medium');
        setWarnings(result.warnings || []);

        toast.success('Resume parsed successfully!', {
          duration: 3000,
          style: {
            background: '#10B981',
            color: '#FFFFFF',
          },
        });

        setCurrentStep('review');
      } else {
        setParseError(result.error || 'Failed to parse resume');
        toast.error(result.error || 'Failed to parse resume', {
          duration: 4000,
        });
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to parse resume. Please try again.';
      setParseError(errorMessage);
      toast.error(errorMessage, {
        duration: 4000,
      });
    } finally {
      setIsParsingResume(false);
    }
  };

  // Handle resume confirmation
  const handleResumeConfirm = (editedResume: ParsedResume) => {
    setParsedResume(editedResume);
    setCurrentStep('template');
    toast.success('Resume confirmed! Now select a template.', {
      duration: 3000,
    });
  };

  // Handle resume re-upload
  const handleReupload = () => {
    setUploadedFile(null);
    setParsedResume(null);
    setParseError(null);
    setCurrentStep('upload');
    setSelectedTemplate(null);
    setPortfolioContent(null);
    setCustomization(null);
  };

  // Handle template selection
  const handleTemplateSelect = (template: PortfolioTemplate) => {
    setSelectedTemplate(template);

    // Convert parsed resume to portfolio content
    if (parsedResume) {
      const content: PortfolioContent = {
        personalInfo: {
          name: parsedResume.personalInfo.name,
          title: 'Professional', // Default title, user can customize later
          bio: parsedResume.summary || '',
          email: parsedResume.personalInfo.email,
          phone: parsedResume.personalInfo.phone,
          location: parsedResume.personalInfo.location || '',
          profileImage: '',
        },
        sections: {
          about: {
            enabled: true,
            content: parsedResume.summary || '',
          },
          experience: {
            enabled: true,
            items: parsedResume.experience.map((exp) => ({
              id: exp.id,
              company: exp.company,
              position: exp.position,
              duration: `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`,
              description: exp.description,
            })),
          },
          projects: {
            enabled: true,
            items:
              parsedResume.projects?.map((proj) => ({
                id: proj.id,
                name: proj.name,
                description: proj.description,
                technologies: proj.technologies || [],
                url: proj.url,
                imageUrl: '',
              })) || [],
          },
          skills: {
            enabled: true,
            items: parsedResume.skills,
          },
          education: {
            enabled: true,
            items: parsedResume.education.map((edu) => ({
              id: edu.id,
              school: edu.institution,
              degree: edu.degree,
              field: edu.field,
              year: edu.graduationDate,
            })),
          },
          contact: {
            enabled: true,
            email: parsedResume.personalInfo.email,
            phone: parsedResume.personalInfo.phone,
          },
        },
        socialLinks: {
          github: parsedResume.personalInfo.linkedIn || '',
          linkedin: parsedResume.personalInfo.linkedin || '',
          twitter: '',
          website: '',
        },
      };

      setPortfolioContent(content);
      setCustomization(getDefaultCustomization(template));
    }

    toast.success('Template selected! Generating portfolio...', {
      duration: 2000,
    });

    // Auto-advance to generate step
    setTimeout(() => {
      setCurrentStep('generate');
    }, 500);
  };

  // Handle portfolio generation
  const handleGenerate = async () => {
    if (!portfolioContent || !customization) {
      toast.error('Portfolio content not ready');
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);

    try {
      const response = await fetch('/api/generate-portfolio-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          portfolioContent,
          customization,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate portfolio');
      }

      if (data.success && data.files) {
        setGeneratedFiles(data.files);
        toast.success('Portfolio generated successfully!', {
          duration: 3000,
          style: {
            background: '#10B981',
            color: '#FFFFFF',
          },
        });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to generate portfolio. Please try again.';
      setGenerationError(errorMessage);
      toast.error(errorMessage, {
        duration: 4000,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle download
  const handleDownload = () => {
    if (generatedFiles.length === 0) return;

    // Create a text file with all code
    const allFiles = generatedFiles
      .map((f) => `=== ${f.path} ===\n\n${f.content}\n\n`)
      .join('\n');

    const blob = new Blob([allFiles], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio-code.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Portfolio code downloaded!', {
      duration: 2000,
    });
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div
            className="h-12 w-12 animate-spin rounded-full border-4 border-t-transparent mx-auto mb-4"
            style={{ borderColor: '#D4A574', borderTopColor: 'transparent' }}
          />
          <p style={{ color: '#6B7280' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFB' }}>
      <Navigation />
      <Toaster position="top-right" />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-[14px] mb-4 transition-colors duration-200"
            style={{ color: '#6B7280' }}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8" style={{ color: '#D4A574' }} />
            <h1 className="text-[32px] font-bold" style={{ color: '#1A1F2E' }}>
              Portfolio Website Generator
            </h1>
          </div>
          <p className="text-[16px]" style={{ color: '#6B7280' }}>
            Create a professional Next.js portfolio website in minutes
          </p>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          {['upload', 'review', 'template', 'generate'].map((step, index) => {
            const stepLabels = {
              upload: 'Upload',
              review: 'Review',
              template: 'Template',
              generate: 'Generate',
            };
            const isActive = currentStep === step;
            const isCompleted =
              (step === 'upload' && ['review', 'template', 'generate'].includes(currentStep)) ||
              (step === 'review' && ['template', 'generate'].includes(currentStep)) ||
              (step === 'template' && currentStep === 'generate');

            return (
              <div
                key={step}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[14px] font-semibold transition-all duration-300 ${
                  isActive ? 'opacity-100' : 'opacity-50'
                }`}
                style={{
                  backgroundColor: isActive || isCompleted ? '#D4A574' : '#E5E7EB',
                  color: isActive || isCompleted ? '#FFFFFF' : '#6B7280',
                }}
              >
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold bg-white"
                  style={{ color: isActive || isCompleted ? '#D4A574' : '#6B7280' }}
                >
                  {index + 1}
                </span>
                {stepLabels[step as keyof typeof stepLabels]}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        {currentStep === 'upload' && (
          <ResumeUpload
            onFileUpload={handleFileUpload}
            isLoading={isParsingResume}
            error={parseError}
          />
        )}

        {currentStep === 'review' && parsedResume && (
          <ResumeReview
            resumeData={parsedResume}
            confidence={confidence}
            warnings={warnings}
            onConfirm={handleResumeConfirm}
            onReupload={handleReupload}
          />
        )}

        {currentStep === 'template' && (
          <TemplateSelector
            selectedTemplate={selectedTemplate}
            onSelectTemplate={handleTemplateSelect}
          />
        )}

        {currentStep === 'generate' && portfolioContent && customization && (
          <div className="w-full">
            {generatedFiles.length === 0 ? (
              <>
                {/* Split-Screen Editor */}
                <div className="flex gap-4 h-[calc(100vh-350px)] min-h-[600px]">
                  {/* Left Panel - Editor and Customization (40%) */}
                  <div className="w-[40%] flex flex-col">
                    {/* Tabs */}
                    <div
                      className="flex border-b"
                      style={{ borderColor: '#E5E7EB', backgroundColor: '#FFFFFF' }}
                    >
                      <button
                        onClick={() => setActiveEditorTab('content')}
                        className={`flex-1 px-6 py-3 text-[14px] font-semibold transition-colors duration-200 ${
                          activeEditorTab === 'content'
                            ? 'border-b-2'
                            : ''
                        }`}
                        style={{
                          color: activeEditorTab === 'content' ? '#D4A574' : '#6B7280',
                          borderColor: activeEditorTab === 'content' ? '#D4A574' : 'transparent',
                        }}
                      >
                        Content
                      </button>
                      <button
                        onClick={() => setActiveEditorTab('customize')}
                        className={`flex-1 px-6 py-3 text-[14px] font-semibold transition-colors duration-200 ${
                          activeEditorTab === 'customize'
                            ? 'border-b-2'
                            : ''
                        }`}
                        style={{
                          color: activeEditorTab === 'customize' ? '#D4A574' : '#6B7280',
                          borderColor: activeEditorTab === 'customize' ? '#D4A574' : 'transparent',
                        }}
                      >
                        Customize
                      </button>
                    </div>

                    {/* Tab Content */}
                    <div
                      className="flex-1 overflow-hidden rounded-b-xl border border-t-0"
                      style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}
                    >
                      {activeEditorTab === 'content' && (
                        <EditorPanel
                          content={portfolioContent}
                          onContentChange={setPortfolioContent}
                        />
                      )}

                      {activeEditorTab === 'customize' && (
                        <CustomizationPanel
                          customization={customization}
                          onCustomizationChange={setCustomization}
                        />
                      )}
                    </div>
                  </div>

                  {/* Right Panel - Live Preview (60%) */}
                  <div className="w-[60%]">
                    <div
                      className="h-full rounded-xl border overflow-hidden"
                      style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}
                    >
                      <LivePreview content={portfolioContent} customization={customization} />
                    </div>
                  </div>
                </div>

                {/* Generate Button */}
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className={`px-8 py-4 rounded-xl font-semibold text-[16px] transition-all duration-300 ${
                      isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                    }`}
                    style={{
                      backgroundColor: '#D4A574',
                      color: '#FFFFFF',
                    }}
                  >
                    {isGenerating ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        <span>Generating Code...</span>
                      </div>
                    ) : (
                      <>
                        <Download className="w-5 h-5 inline mr-2" />
                        Generate & Download Portfolio Code
                      </>
                    )}
                  </button>
                </div>

                {generationError && (
                  <div
                    className="mt-4 p-4 rounded-lg max-w-2xl mx-auto"
                    style={{ backgroundColor: '#FEF2F2', color: '#991B1B' }}
                  >
                    {generationError}
                  </div>
                )}
              </>
            ) : (
              <div
                className="rounded-xl border p-8 max-w-4xl mx-auto"
                style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}
              >
                <div className="text-center mb-8">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: '#ECFDF5' }}
                  >
                    <Download className="w-8 h-8" style={{ color: '#10B981' }} />
                  </div>
                  <h2 className="text-[24px] font-semibold mb-2" style={{ color: '#1A1F2E' }}>
                    Portfolio Generated Successfully!
                  </h2>
                  <p className="text-[16px]" style={{ color: '#6B7280' }}>
                    Your Next.js portfolio code is ready
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-[18px] font-semibold mb-3" style={{ color: '#1A1F2E' }}>
                    Generated Files ({generatedFiles.length})
                  </h3>
                  <div className="space-y-2">
                    {generatedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-lg"
                        style={{ backgroundColor: '#F8FAFB' }}
                      >
                        <span className="text-[14px] font-mono" style={{ color: '#1A1F2E' }}>
                          {file.path}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleDownload}
                    className="flex-1 px-6 py-3 rounded-lg font-semibold text-[14px] transition-all duration-200 hover:scale-105"
                    style={{
                      backgroundColor: '#D4A574',
                      color: '#FFFFFF',
                    }}
                  >
                    <Download className="w-4 h-4 inline mr-2" />
                    Download Code
                  </button>

                  <button
                    onClick={() => {
                      setGeneratedFiles([]);
                      setCurrentStep('upload');
                      handleReupload();
                    }}
                    className="flex-1 px-6 py-3 rounded-lg font-semibold text-[14px] transition-all duration-200"
                    style={{
                      backgroundColor: '#F8FAFB',
                      color: '#1A1F2E',
                    }}
                  >
                    Create Another Portfolio
                  </button>
                </div>

                <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#FEF3C7' }}>
                  <p className="text-[12px] font-semibold mb-1" style={{ color: '#92400E' }}>
                    📝 Next Steps:
                  </p>
                  <ul className="text-[12px] space-y-1" style={{ color: '#92400E' }}>
                    <li>1. Download the generated code</li>
                    <li>2. Create a new folder and extract the files</li>
                    <li>3. Run `npm install` to install dependencies</li>
                    <li>4. Run `npm run dev` to start the development server</li>
                    <li>5. Deploy to Vercel with `vercel` command</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
