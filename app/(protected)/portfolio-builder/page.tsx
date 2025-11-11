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
import { ChevronLeft, Download, Sparkles, Rocket, ExternalLink, Eye, EyeOff } from 'lucide-react';

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

  // Vercel deployment state
  const [vercelApiKey, setVercelApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null);
  const [deploymentError, setDeploymentError] = useState<string | null>(null);

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
      // Step 1: Generate portfolio code
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
        setIsGenerating(false);

        toast.success('Portfolio generated! Starting deployment...', {
          duration: 2000,
          style: {
            background: '#10B981',
            color: '#FFFFFF',
          },
        });

        // Step 2: Automatically deploy to Vercel with generated files
        await deployToVercel(data.files);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to generate portfolio. Please try again.';
      setGenerationError(errorMessage);
      toast.error(errorMessage, {
        duration: 4000,
      });
      setIsGenerating(false);
    }
  };

  // Handle deployment to Vercel
  const deployToVercel = async (files: Array<{ path: string; content: string }>) => {
    if (!vercelApiKey.trim()) {
      toast.error('Please enter your Vercel API key');
      return;
    }

    if (!files || files.length === 0) {
      toast.error('No files to deploy. Please generate your portfolio first.');
      return;
    }

    setIsDeploying(true);
    setDeploymentError(null);
    setDeploymentUrl(null);

    try {
      const response = await fetch('/api/deploy-to-vercel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files: files,
          vercelApiKey,
          projectName: portfolioContent?.personalInfo.name
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '') || 'portfolio',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to deploy to Vercel');
      }

      if (data.success && data.deploymentUrl) {
        setDeploymentUrl(data.deploymentUrl);
        toast.success('Portfolio deployed successfully!', {
          duration: 5000,
          style: {
            background: '#10B981',
            color: '#FFFFFF',
          },
        });
      } else {
        // Enhanced error message from Vercel API
        const errorDetails = data.vercelError || data.details || data.error;
        const errorMessage = typeof errorDetails === 'string'
          ? errorDetails
          : JSON.stringify(errorDetails, null, 2);
        throw new Error(errorMessage || 'Invalid response from deployment service');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to deploy portfolio. Please try again.';
      console.error('Deployment error:', error);
      setDeploymentError(errorMessage);
      toast.error('Deployment failed. Check the error details below.', {
        duration: 5000,
      });
    } finally {
      setIsDeploying(false);
    }
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

                {/* Vercel API Key Input & Deploy Button */}
                <div className="mt-6 max-w-2xl mx-auto">
                  <div
                    className="p-6 rounded-xl border mb-4"
                    style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}
                  >
                    <h3 className="text-[16px] font-semibold mb-2" style={{ color: '#1A1F2E' }}>
                      Vercel Deployment
                    </h3>
                    <p className="text-[14px] mb-4" style={{ color: '#6B7280' }}>
                      Enter your Vercel API token to deploy your portfolio directly to Vercel.{' '}
                      <a
                        href="https://vercel.com/account/tokens"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                        style={{ color: '#D4A574' }}
                      >
                        Get your API token here
                      </a>
                    </p>

                    <div className="mb-4">
                      <label className="block text-[14px] font-medium mb-2" style={{ color: '#6B7280' }}>
                        Vercel API Token
                      </label>
                      <div className="relative">
                        <input
                          type={showApiKey ? 'text' : 'password'}
                          value={vercelApiKey}
                          onChange={(e) => setVercelApiKey(e.target.value)}
                          className="w-full px-4 py-3 pr-12 rounded-lg border text-[14px]"
                          style={{ borderColor: '#E5E7EB' }}
                          placeholder="Enter your Vercel API token"
                        />
                        <button
                          type="button"
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showApiKey ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      <p className="text-[12px] mt-2" style={{ color: '#6B7280' }}>
                        Your API token is not stored and is only used for this deployment.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !vercelApiKey.trim()}
                    className={`w-full px-8 py-4 rounded-xl font-semibold text-[16px] transition-all duration-300 ${
                      isGenerating || !vercelApiKey.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                    }`}
                    style={{
                      backgroundColor: '#D4A574',
                      color: '#FFFFFF',
                    }}
                  >
                    {isGenerating ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        <span>Generating Code...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Rocket className="w-5 h-5" />
                        <span>Generate & Deploy to Vercel</span>
                      </div>
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
            ) : generatedFiles.length > 0 && !deploymentUrl ? (
              <div
                className="rounded-xl border p-8 max-w-4xl mx-auto"
                style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}
              >
                {/* Progress Steps */}
                <div className="mb-8">
                  <div className="flex items-center justify-center gap-4 mb-6">
                    {/* Step 1: Files Generated */}
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: '#ECFDF5' }}
                      >
                        <span style={{ color: '#10B981', fontSize: '18px' }}>✓</span>
                      </div>
                      <span className="text-[14px] font-medium" style={{ color: '#10B981' }}>
                        Files Generated
                      </span>
                    </div>

                    <div className="w-12 h-0.5" style={{ backgroundColor: isDeploying ? '#D4A574' : '#E5E7EB' }} />

                    {/* Step 2: Deploying */}
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: isDeploying ? '#DBEAFE' : '#F3F4F6' }}
                      >
                        {isDeploying ? (
                          <div className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
                        ) : (
                          <span style={{ color: '#9CA3AF', fontSize: '18px' }}>2</span>
                        )}
                      </div>
                      <span className="text-[14px] font-medium" style={{ color: isDeploying ? '#2563EB' : '#9CA3AF' }}>
                        Deploying
                      </span>
                    </div>

                    <div className="w-12 h-0.5" style={{ backgroundColor: '#E5E7EB' }} />

                    {/* Step 3: Live */}
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: '#F3F4F6' }}
                      >
                        <span style={{ color: '#9CA3AF', fontSize: '18px' }}>3</span>
                      </div>
                      <span className="text-[14px] font-medium" style={{ color: '#9CA3AF' }}>
                        Live
                      </span>
                    </div>
                  </div>
                </div>

                {isDeploying ? (
                  <div className="text-center">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                      style={{ backgroundColor: '#DBEAFE' }}
                    >
                      <Rocket className="w-8 h-8 animate-bounce" style={{ color: '#2563EB' }} />
                    </div>
                    <h2 className="text-[24px] font-semibold mb-2" style={{ color: '#1A1F2E' }}>
                      Deploying to Vercel...
                    </h2>
                    <p className="text-[16px] mb-4" style={{ color: '#6B7280' }}>
                      Your portfolio is being deployed. This may take a minute.
                    </p>
                    <div className="w-12 h-12 rounded-full border-4 border-t-transparent mx-auto animate-spin"
                      style={{ borderColor: '#D4A574', borderTopColor: 'transparent' }}
                    />
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-6">
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                        style={{ backgroundColor: '#ECFDF5' }}
                      >
                        <Download className="w-8 h-8" style={{ color: '#10B981' }} />
                      </div>
                      <h2 className="text-[24px] font-semibold mb-2" style={{ color: '#1A1F2E' }}>
                        Portfolio Files Generated!
                      </h2>
                      <p className="text-[16px]" style={{ color: '#6B7280' }}>
                        {generatedFiles.length} files ready for deployment
                      </p>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-[16px] font-semibold mb-3" style={{ color: '#1A1F2E' }}>
                        Generated Files:
                      </h3>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {generatedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="p-3 rounded-lg flex items-center gap-2"
                            style={{ backgroundColor: '#F8FAFB' }}
                          >
                            <span style={{ color: '#10B981' }}>✓</span>
                            <span className="text-[14px] font-mono" style={{ color: '#1A1F2E' }}>
                              {file.path}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div
                      className="p-4 rounded-lg mb-4"
                      style={{ backgroundColor: '#EFF6FF' }}
                    >
                      <p className="text-[14px]" style={{ color: '#1E40AF' }}>
                        ⚡ Deployment will start automatically...
                      </p>
                    </div>
                  </>
                )}
              </div>
            ) : deploymentUrl ? (
              <div
                className="rounded-xl border p-8 max-w-4xl mx-auto"
                style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}
              >
                {/* Progress Steps - All Complete */}
                <div className="mb-8">
                  <div className="flex items-center justify-center gap-4 mb-6">
                    {/* Step 1: Files Generated */}
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: '#ECFDF5' }}
                      >
                        <span style={{ color: '#10B981', fontSize: '18px' }}>✓</span>
                      </div>
                      <span className="text-[14px] font-medium" style={{ color: '#10B981' }}>
                        Files Generated
                      </span>
                    </div>

                    <div className="w-12 h-0.5" style={{ backgroundColor: '#10B981' }} />

                    {/* Step 2: Deployed */}
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: '#ECFDF5' }}
                      >
                        <span style={{ color: '#10B981', fontSize: '18px' }}>✓</span>
                      </div>
                      <span className="text-[14px] font-medium" style={{ color: '#10B981' }}>
                        Deployed
                      </span>
                    </div>

                    <div className="w-12 h-0.5" style={{ backgroundColor: '#10B981' }} />

                    {/* Step 3: Live */}
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: '#ECFDF5' }}
                      >
                        <span style={{ color: '#10B981', fontSize: '18px' }}>✓</span>
                      </div>
                      <span className="text-[14px] font-medium" style={{ color: '#10B981' }}>
                        Live
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-center mb-8">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: '#ECFDF5' }}
                  >
                    <Rocket className="w-8 h-8" style={{ color: '#10B981' }} />
                  </div>
                  <h2 className="text-[24px] font-semibold mb-2" style={{ color: '#1A1F2E' }}>
                    Portfolio Deployed Successfully!
                  </h2>
                  <p className="text-[16px]" style={{ color: '#6B7280' }}>
                    Your portfolio is now live on Vercel
                  </p>
                </div>

                <div
                  className="mb-6 p-6 rounded-lg border-2"
                  style={{ backgroundColor: '#F0FDF4', borderColor: '#86EFAC' }}
                >
                  <p className="text-[14px] font-semibold mb-3" style={{ color: '#15803D' }}>
                    🎉 Your Portfolio URL:
                  </p>
                  <div className="flex items-center gap-3 mb-4">
                    <a
                      href={deploymentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-3 rounded-lg text-center font-mono text-[14px] break-all"
                      style={{ backgroundColor: '#FFFFFF', color: '#2563EB' }}
                    >
                      {deploymentUrl}
                    </a>
                    <button
                      onClick={() => window.open(deploymentUrl, '_blank')}
                      className="px-4 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
                      style={{ backgroundColor: '#D4A574', color: '#FFFFFF' }}
                    >
                      <ExternalLink className="w-5 h-5" />
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(deploymentUrl);
                      toast.success('URL copied to clipboard!', { duration: 2000 });
                    }}
                    className="w-full px-4 py-2 rounded-lg text-[14px] font-medium transition-colors"
                    style={{ backgroundColor: '#DCFCE7', color: '#15803D' }}
                  >
                    Copy URL to Clipboard
                  </button>
                </div>

                <button
                  onClick={() => {
                    setGeneratedFiles([]);
                    setDeploymentUrl(null);
                    setVercelApiKey('');
                    setCurrentStep('upload');
                    handleReupload();
                  }}
                  className="w-full px-6 py-3 rounded-lg font-semibold text-[14px] transition-all duration-200"
                  style={{
                    backgroundColor: '#F8FAFB',
                    color: '#1A1F2E',
                  }}
                >
                  Create Another Portfolio
                </button>

                <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#FEF3C7' }}>
                  <p className="text-[12px] font-semibold mb-1" style={{ color: '#92400E' }}>
                    ✨ What's Next:
                  </p>
                  <ul className="text-[12px] space-y-1" style={{ color: '#92400E' }}>
                    <li>• Your portfolio is live and accessible worldwide</li>
                    <li>• You can manage it from your Vercel dashboard</li>
                    <li>• Make changes and redeploy anytime</li>
                    <li>• Connect a custom domain in Vercel settings</li>
                  </ul>
                </div>
              </div>
            ) : deploymentError ? (
              <div
                className="rounded-xl border p-8 max-w-4xl mx-auto"
                style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}
              >
                <div className="text-center mb-6">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: '#FEF2F2' }}
                  >
                    <ExternalLink className="w-8 h-8" style={{ color: '#DC2626' }} />
                  </div>
                  <h2 className="text-[24px] font-semibold mb-2" style={{ color: '#1A1F2E' }}>
                    Deployment Failed
                  </h2>
                  <p className="text-[16px]" style={{ color: '#6B7280' }}>
                    There was an error deploying your portfolio
                  </p>
                </div>

                <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#FEF2F2' }}>
                  <p className="text-[12px] font-semibold mb-2" style={{ color: '#991B1B' }}>
                    Error Details:
                  </p>
                  <pre
                    className="text-[12px] overflow-auto max-h-64 p-3 rounded bg-white"
                    style={{ color: '#991B1B' }}
                  >
                    {deploymentError}
                  </pre>
                </div>

                <button
                  onClick={() => {
                    setDeploymentError(null);
                    deployToVercel(generatedFiles);
                  }}
                  disabled={isDeploying}
                  className="w-full px-6 py-3 rounded-lg font-semibold text-[14px] transition-all duration-200"
                  style={{
                    backgroundColor: '#D4A574',
                    color: '#FFFFFF',
                  }}
                >
                  Try Again
                </button>
              </div>
            ) : null}
          </div>
        )}
      </main>
    </div>
  );
}
