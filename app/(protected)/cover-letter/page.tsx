/**
 * Cover Letter Generator Page
 * AI-powered cover letter generation with resume upload
 * 3-Step Flow: Upload → Review → Generate
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import toast, { Toaster } from 'react-hot-toast';
import { ParsedResume } from '@/types';

// Step Components
import ResumeUpload from '@/components/cover-letter/ResumeUpload';
import ResumeReview from '@/components/cover-letter/ResumeReview';
import ParsedResumeSummary from '@/components/cover-letter/ParsedResumeSummary';

// Step 3 Components
import JobDescriptionInput from '@/components/cover-letter/JobDescriptionInput';
import ToneSelector from '@/components/cover-letter/ToneSelector';
import GenerateButton from '@/components/cover-letter/GenerateButton';
import CoverLetterEditor from '@/components/cover-letter/CoverLetterEditor';
import ActionButtons from '@/components/cover-letter/ActionButtons';
import PDFPreviewModal from '@/components/cover-letter/PDFPreviewModal';
import LoadingState from '@/components/cover-letter/LoadingState';
import EmptyState from '@/components/cover-letter/EmptyState';

// Utilities
import { parseResumeFile } from '@/lib/resumeParsing';

type Tone = 'formal' | 'conversational' | 'energetic';
type Step = 'upload' | 'review' | 'generate';

export default function CoverLetterPage() {
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

  // Cover letter state
  const [jobDescription, setJobDescription] = useState('');
  const [selectedTone, setSelectedTone] = useState<Tone>('formal');
  const [coverLetter, setCoverLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

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

        // Move to review step
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

  // Handle resume confirmation (move to generate step)
  const handleResumeConfirm = (updatedResume: ParsedResume) => {
    setParsedResume(updatedResume);
    setCurrentStep('generate');
  };

  // Handle re-upload
  const handleReupload = () => {
    setUploadedFile(null);
    setParsedResume(null);
    setParseError(null);
    setConfidence('medium');
    setWarnings([]);
    setCoverLetter('');
    setHasGenerated(false);
    setCurrentStep('upload');
  };

  // Handle edit (go back to review)
  const handleEdit = () => {
    setCurrentStep('review');
  };

  // Generate cover letter
  const handleGenerate = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please enter a job description to generate a cover letter', {
        duration: 4000,
      });
      return;
    }

    if (!parsedResume || !parsedResume.personalInfo) {
      toast.error('Resume data not found. Please upload a resume first.', {
        duration: 4000,
      });
      setCurrentStep('upload');
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobDescription,
          resumeData: parsedResume,
          tone: selectedTone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate cover letter');
      }

      if (data.success && data.coverLetter) {
        setCoverLetter(data.coverLetter);
        setHasGenerated(true);
        toast.success('Cover letter generated successfully!', {
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
      console.error('Error generating cover letter:', error);
      toast.error(error.message || 'Failed to generate cover letter. Please try again.', {
        duration: 4000,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Regenerate with new tone
  const handleRegenerate = async () => {
    setIsRegenerating(true);
    await handleGenerate();
    setIsRegenerating(false);
  };

  // Clear job description
  const handleClearJobDescription = () => {
    setJobDescription('');
  };

  // Open PDF modal
  const handleDownloadPDF = () => {
    setShowPDFModal(true);
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-transparent mx-auto mb-4" style={{ borderColor: '#D4A574', borderTopColor: 'transparent' }}></div>
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
        {/* Header with Step Indicator */}
        <div className="mb-8">
          <h1 className="text-[28px] font-bold mb-2" style={{ color: '#1A1F2E' }}>
            AI Cover Letter Generator
          </h1>
          <p className="text-[14px] mb-4" style={{ color: '#6B7280' }}>
            Create personalized cover letters tailored to job descriptions using AI
          </p>

          {/* Step Indicator */}
          <div className="flex items-center gap-2 mt-4">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-semibold ${
                currentStep === 'upload' ? 'opacity-100' : 'opacity-50'
              }`}
              style={{
                backgroundColor: currentStep === 'upload' ? '#D4A574' : '#E5E7EB',
                color: currentStep === 'upload' ? '#0F1419' : '#6B7280',
              }}
            >
              <span className="w-5 h-5 rounded-full flex items-center justify-center bg-white text-[10px]">
                1
              </span>
              Upload Resume
            </div>
            <div className="w-8 h-0.5" style={{ backgroundColor: '#E5E7EB' }}></div>
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-semibold ${
                currentStep === 'review' ? 'opacity-100' : 'opacity-50'
              }`}
              style={{
                backgroundColor: currentStep === 'review' ? '#D4A574' : '#E5E7EB',
                color: currentStep === 'review' ? '#0F1419' : '#6B7280',
              }}
            >
              <span className="w-5 h-5 rounded-full flex items-center justify-center bg-white text-[10px]">
                2
              </span>
              Review
            </div>
            <div className="w-8 h-0.5" style={{ backgroundColor: '#E5E7EB' }}></div>
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-semibold ${
                currentStep === 'generate' ? 'opacity-100' : 'opacity-50'
              }`}
              style={{
                backgroundColor: currentStep === 'generate' ? '#D4A574' : '#E5E7EB',
                color: currentStep === 'generate' ? '#0F1419' : '#6B7280',
              }}
            >
              <span className="w-5 h-5 rounded-full flex items-center justify-center bg-white text-[10px]">
                3
              </span>
              Generate
            </div>
          </div>
        </div>

        {/* Step 1: Upload Resume */}
        {currentStep === 'upload' && (
          <div className="max-w-3xl mx-auto">
            <ResumeUpload
              onFileUpload={handleFileUpload}
              isProcessing={isParsingResume}
              error={parseError}
            />
          </div>
        )}

        {/* Step 2: Review Resume */}
        {currentStep === 'review' && parsedResume && (
          <div className="max-w-4xl mx-auto">
            <ResumeReview
              resumeData={parsedResume}
              confidence={confidence}
              warnings={warnings}
              onConfirm={handleResumeConfirm}
              onReupload={handleReupload}
            />
          </div>
        )}

        {/* Step 3: Generate Cover Letter */}
        {currentStep === 'generate' && parsedResume && (
          <>
            {/* Resume Summary (Collapsible) */}
            <div className="mb-6">
              <ParsedResumeSummary
                resumeData={parsedResume}
                onEdit={handleEdit}
                onReupload={handleReupload}
              />
            </div>

            {/* Two-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Left Column - Input Section (40%) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Job Description Card */}
                <div
                  className="bg-white rounded-xl p-6 shadow-sm border"
                  style={{ borderColor: '#E5E7EB' }}
                >
                  <JobDescriptionInput
                    value={jobDescription}
                    onChange={setJobDescription}
                    onClear={handleClearJobDescription}
                  />
                </div>

                {/* Tone Selector Card */}
                <div
                  className="bg-white rounded-xl p-6 shadow-sm border"
                  style={{ borderColor: '#E5E7EB' }}
                >
                  <ToneSelector selectedTone={selectedTone} onToneChange={setSelectedTone} />
                </div>

                {/* Generate Button */}
                <GenerateButton
                  onClick={handleGenerate}
                  isLoading={isGenerating}
                  disabled={!jobDescription.trim() || isGenerating}
                />
              </div>

              {/* Right Column - Output Section (60%) */}
              <div className="lg:col-span-3">
                <div
                  className="bg-white rounded-xl p-6 shadow-sm border min-h-[600px]"
                  style={{ borderColor: '#E5E7EB' }}
                >
                  {isGenerating ? (
                    <LoadingState />
                  ) : !coverLetter ? (
                    <EmptyState />
                  ) : (
                    <div className="space-y-6">
                      <CoverLetterEditor value={coverLetter} onChange={setCoverLetter} />

                      <ActionButtons
                        coverLetter={coverLetter}
                        onRegenerate={handleRegenerate}
                        onDownloadPDF={handleDownloadPDF}
                        isRegenerating={isRegenerating}
                        canRegenerate={hasGenerated}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tips Section */}
            {!coverLetter && !isGenerating && (
              <div
                className="mt-8 bg-white rounded-xl p-6 shadow-sm border"
                style={{ borderColor: '#E5E7EB' }}
              >
                <h3 className="text-[16px] font-bold mb-3" style={{ color: '#1A1F2E' }}>
                  Tips for Best Results
                </h3>
                <ul className="space-y-2 text-[14px]" style={{ color: '#6B7280' }}>
                  <li className="flex items-start">
                    <span className="mr-2" style={{ color: '#D4A574' }}>
                      •
                    </span>
                    <span>
                      Include the full job description with job title, responsibilities, and
                      requirements
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2" style={{ color: '#D4A574' }}>
                      •
                    </span>
                    <span>
                      Choose a tone that matches the company culture (Formal for corporate,
                      Conversational for startups)
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2" style={{ color: '#D4A574' }}>
                      •
                    </span>
                    <span>Review and edit the generated cover letter to add personal touches</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2" style={{ color: '#D4A574' }}>
                      •
                    </span>
                    <span>Use the Regenerate button to try different tones if needed</span>
                  </li>
                </ul>
              </div>
            )}
          </>
        )}
      </main>

      {/* PDF Preview Modal */}
      {parsedResume?.personalInfo && (
        <PDFPreviewModal
          isOpen={showPDFModal}
          onClose={() => setShowPDFModal(false)}
          coverLetter={coverLetter}
          personalInfo={{
            name: parsedResume.personalInfo.name,
            email: parsedResume.personalInfo.email,
            phone: parsedResume.personalInfo.phone,
          }}
        />
      )}
    </div>
  );
}
