/**
 * Cover Letter Generator Page
 * AI-powered cover letter generation using Groq API
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useResume } from '@/contexts/ResumeContext';
import Navigation from '@/components/Navigation';
import toast, { Toaster } from 'react-hot-toast';

// Components
import JobDescriptionInput from '@/components/cover-letter/JobDescriptionInput';
import ToneSelector from '@/components/cover-letter/ToneSelector';
import GenerateButton from '@/components/cover-letter/GenerateButton';
import CoverLetterEditor from '@/components/cover-letter/CoverLetterEditor';
import ActionButtons from '@/components/cover-letter/ActionButtons';
import PDFPreviewModal from '@/components/cover-letter/PDFPreviewModal';
import LoadingState from '@/components/cover-letter/LoadingState';
import EmptyState from '@/components/cover-letter/EmptyState';

type Tone = 'formal' | 'conversational' | 'energetic';

export default function CoverLetterPage() {
  const router = useRouter();
  const { requireAuth, isLoading: authLoading } = useAuth();
  const { resume } = useResume();

  // State
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

  // Generate cover letter
  const handleGenerate = async () => {
    // Validate job description
    if (!jobDescription.trim()) {
      toast.error('Please enter a job description to generate a cover letter', {
        duration: 4000,
      });
      return;
    }

    // Validate resume data
    if (!resume || !resume.personalInfo) {
      toast.error('Resume data not found. Please upload/parse a resume first.', {
        duration: 4000,
      });
      router.push('/resume-editor/upload');
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobDescription,
          resumeData: resume,
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
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-[28px] font-bold mb-2"
            style={{ color: '#1A1F2E' }}
          >
            AI Cover Letter Generator
          </h1>
          <p className="text-[14px]" style={{ color: '#6B7280' }}>
            Create personalized cover letters tailored to job descriptions using AI
          </p>
        </div>

        {/* Main Content - Two Column Layout */}
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
              <ToneSelector
                selectedTone={selectedTone}
                onToneChange={setSelectedTone}
              />
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
                  <CoverLetterEditor
                    value={coverLetter}
                    onChange={setCoverLetter}
                  />

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

        {/* Helpful Tips Section */}
        {!coverLetter && !isGenerating && (
          <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border" style={{ borderColor: '#E5E7EB' }}>
            <h3 className="text-[16px] font-bold mb-3" style={{ color: '#1A1F2E' }}>
              Tips for Best Results
            </h3>
            <ul className="space-y-2 text-[14px]" style={{ color: '#6B7280' }}>
              <li className="flex items-start">
                <span className="mr-2" style={{ color: '#D4A574' }}>•</span>
                <span>Include the full job description with job title, responsibilities, and requirements</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2" style={{ color: '#D4A574' }}>•</span>
                <span>Choose a tone that matches the company culture (Formal for corporate, Conversational for startups)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2" style={{ color: '#D4A574' }}>•</span>
                <span>Review and edit the generated cover letter to add personal touches</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2" style={{ color: '#D4A574' }}>•</span>
                <span>Use the Regenerate button to try different tones if needed</span>
              </li>
            </ul>
          </div>
        )}
      </main>

      {/* PDF Preview Modal */}
      {resume?.personalInfo && (
        <PDFPreviewModal
          isOpen={showPDFModal}
          onClose={() => setShowPDFModal(false)}
          coverLetter={coverLetter}
          personalInfo={{
            name: resume.personalInfo.name,
            email: resume.personalInfo.email,
            phone: resume.personalInfo.phone,
          }}
        />
      )}
    </div>
  );
}
