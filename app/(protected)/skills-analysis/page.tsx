/**
 * Skills Analysis Page - Phase 6
 * Complete skills gap and job matching analysis tool
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import { parseResumeFile } from '@/lib/resumeParsing';
import { ParsedResume, SkillsAnalysis } from '@/types';
import toast, { Toaster } from 'react-hot-toast';
import { ChevronLeft, ChevronDown, ChevronUp, FileText, Edit2, Upload as UploadIcon } from 'lucide-react';

// Import components
import ResumeUpload from '@/components/skills-analysis/ResumeUpload';
import ResumeReview from '@/components/skills-analysis/ResumeReview';
import JobDescriptionInput from '@/components/skills-analysis/JobDescriptionInput';
import MatchScoreCard from '@/components/skills-analysis/MatchScoreCard';
import MatchingSkillsSection from '@/components/skills-analysis/MatchingSkillsSection';
import MissingSkillsSection from '@/components/skills-analysis/MissingSkillsSection';
import BonusSkillsSection from '@/components/skills-analysis/BonusSkillsSection';
import RecommendationsSection from '@/components/skills-analysis/RecommendationsSection';

type Step = 'upload' | 'review' | 'analyze';

export default function SkillsAnalysisPage() {
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

  // Job description state
  const [jobDescription, setJobDescription] = useState('');

  // Analysis state
  const [analysis, setAnalysis] = useState<SkillsAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Resume summary collapsed state
  const [isResumeCollapsed, setIsResumeCollapsed] = useState(true);

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

  // Handle resume review confirmation
  const handleResumeConfirm = (editedResume: ParsedResume) => {
    setParsedResume(editedResume);
    setCurrentStep('analyze');
    toast.success('Resume confirmed! Now enter the job description.', {
      duration: 3000,
    });
  };

  // Handle resume re-upload
  const handleReupload = () => {
    setUploadedFile(null);
    setParsedResume(null);
    setParseError(null);
    setCurrentStep('upload');
    setAnalysis(null);
    setJobDescription('');
  };

  // Handle skills analysis
  const handleAnalyze = async () => {
    if (!jobDescription.trim() || !parsedResume) {
      toast.error('Please enter a job description');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const response = await fetch('/api/analyze-skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobDescription,
          resumeData: parsedResume,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze skills');
      }

      if (data.success && data.analysis) {
        setAnalysis(data.analysis);
        toast.success('Analysis complete!', {
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
      const errorMessage = error.message || 'Failed to analyze skills. Please try again.';
      setAnalysisError(errorMessage);
      toast.error(errorMessage, {
        duration: 4000,
      });
    } finally {
      setIsAnalyzing(false);
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

          <h1 className="text-[32px] font-bold mb-2" style={{ color: '#1A1F2E' }}>
            Skills Gap & Job Matching Analysis
          </h1>
          <p className="text-[16px]" style={{ color: '#6B7280' }}>
            Analyze your skills against job requirements and get personalized upskilling recommendations
          </p>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          {/* Step 1 */}
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[14px] font-semibold transition-all duration-300 ${
              currentStep === 'upload' ? 'opacity-100' : 'opacity-50'
            }`}
            style={{
              backgroundColor: currentStep === 'upload' ? '#D4A574' : '#E5E7EB',
              color: currentStep === 'upload' ? '#FFFFFF' : '#6B7280',
            }}
          >
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold bg-white" style={{ color: currentStep === 'upload' ? '#D4A574' : '#6B7280' }}>
              1
            </span>
            Upload Resume
          </div>

          {/* Step 2 */}
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[14px] font-semibold transition-all duration-300 ${
              currentStep === 'review' ? 'opacity-100' : 'opacity-50'
            }`}
            style={{
              backgroundColor: currentStep === 'review' ? '#D4A574' : '#E5E7EB',
              color: currentStep === 'review' ? '#FFFFFF' : '#6B7280',
            }}
          >
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold bg-white" style={{ color: currentStep === 'review' ? '#D4A574' : '#6B7280' }}>
              2
            </span>
            Review Resume
          </div>

          {/* Step 3 */}
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[14px] font-semibold transition-all duration-300 ${
              currentStep === 'analyze' ? 'opacity-100' : 'opacity-50'
            }`}
            style={{
              backgroundColor: currentStep === 'analyze' ? '#D4A574' : '#E5E7EB',
              color: currentStep === 'analyze' ? '#FFFFFF' : '#6B7280',
            }}
          >
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold bg-white" style={{ color: currentStep === 'analyze' ? '#D4A574' : '#6B7280' }}>
              3
            </span>
            Analyze & Match
          </div>
        </div>

        {/* Content based on current step */}
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

        {currentStep === 'analyze' && parsedResume && (
          <div className="space-y-6">
            {/* Resume Summary (Collapsible) */}
            <div
              className="rounded-xl border cursor-pointer transition-all duration-300 hover:shadow-md"
              style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}
              onClick={() => setIsResumeCollapsed(!isResumeCollapsed)}
            >
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <FileText className="w-5 h-5" style={{ color: '#D4A574' }} />
                  <div className="flex-1">
                    <h3 className="text-[18px] font-semibold" style={{ color: '#1A1F2E' }}>
                      Resume Data
                    </h3>
                    {isResumeCollapsed && (
                      <p className="text-[14px] mt-1" style={{ color: '#6B7280' }}>
                        {parsedResume.personalInfo.name} • {parsedResume.skills.slice(0, 3).join(', ')}
                        {parsedResume.skills.length > 3 && ` +${parsedResume.skills.length - 3} more`}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentStep('review');
                    }}
                    className="px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all duration-200 hover:bg-opacity-80"
                    style={{
                      backgroundColor: '#F8FAFB',
                      color: '#1A1F2E',
                    }}
                  >
                    <Edit2 className="w-3.5 h-3.5 inline mr-1" />
                    Edit
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReupload();
                    }}
                    className="px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all duration-200 hover:bg-opacity-80"
                    style={{
                      backgroundColor: '#F8FAFB',
                      color: '#1A1F2E',
                    }}
                  >
                    <UploadIcon className="w-3.5 h-3.5 inline mr-1" />
                    Re-upload
                  </button>

                  {isResumeCollapsed ? (
                    <ChevronDown className="w-5 h-5" style={{ color: '#6B7280' }} />
                  ) : (
                    <ChevronUp className="w-5 h-5" style={{ color: '#6B7280' }} />
                  )}
                </div>
              </div>

              {!isResumeCollapsed && (
                <div className="px-6 pb-6 border-t pt-4" style={{ borderColor: '#E5E7EB' }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Personal Info */}
                    <div>
                      <h4 className="text-[14px] font-semibold mb-2" style={{ color: '#1A1F2E' }}>
                        Personal Information
                      </h4>
                      <p className="text-[14px]" style={{ color: '#6B7280' }}>
                        <strong>Email:</strong> {parsedResume.personalInfo.email}
                      </p>
                      <p className="text-[14px]" style={{ color: '#6B7280' }}>
                        <strong>Phone:</strong> {parsedResume.personalInfo.phone}
                      </p>
                      {parsedResume.personalInfo.location && (
                        <p className="text-[14px]" style={{ color: '#6B7280' }}>
                          <strong>Location:</strong> {parsedResume.personalInfo.location}
                        </p>
                      )}
                    </div>

                    {/* Skills */}
                    <div>
                      <h4 className="text-[14px] font-semibold mb-2" style={{ color: '#1A1F2E' }}>
                        Skills ({parsedResume.skills.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {parsedResume.skills.slice(0, 10).map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 rounded text-[12px]"
                            style={{ backgroundColor: '#F8FAFB', color: '#1A1F2E' }}
                          >
                            {skill}
                          </span>
                        ))}
                        {parsedResume.skills.length > 10 && (
                          <span
                            className="px-2 py-1 rounded text-[12px]"
                            style={{ backgroundColor: '#F8FAFB', color: '#6B7280' }}
                          >
                            +{parsedResume.skills.length - 10} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Job Description Input */}
            <div
              className="rounded-xl border p-6"
              style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}
            >
              <JobDescriptionInput
                value={jobDescription}
                onChange={setJobDescription}
                onAnalyze={handleAnalyze}
                isAnalyzing={isAnalyzing}
                disabled={false}
              />
            </div>

            {/* Analysis Results */}
            {analysis && (
              <div className="space-y-6">
                {/* Match Score Card */}
                <MatchScoreCard
                  matchPercentage={analysis.matchPercentage}
                  summary={analysis.summary}
                />

                {/* Skills Sections Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Matching Skills */}
                  <MatchingSkillsSection skills={analysis.matchingSkills} />

                  {/* Missing Skills */}
                  <MissingSkillsSection skills={analysis.missingSkills} />
                </div>

                {/* Bonus Skills */}
                {analysis.bonusSkills.length > 0 && (
                  <BonusSkillsSection skills={analysis.bonusSkills} />
                )}

                {/* Recommendations */}
                <RecommendationsSection recommendations={analysis.recommendations} />
              </div>
            )}

            {/* Error Display */}
            {analysisError && (
              <div
                className="rounded-xl border p-6"
                style={{ backgroundColor: '#FEF2F2', borderColor: '#FCA5A5' }}
              >
                <p className="text-[14px]" style={{ color: '#991B1B' }}>
                  {analysisError}
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
