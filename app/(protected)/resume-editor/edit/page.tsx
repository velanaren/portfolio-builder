/**
 * Resume Editor Page - Phase 3
 * Main editing page with AI enhancements and live preview
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useResume } from '@/contexts/ResumeContext';
import { PersonalInfo } from '@/types';
import { ArrowLeft, Check } from 'lucide-react';
import PersonalInfoSection from '@/components/resume-sections/PersonalInfoSection';
import SummarySection from '@/components/resume-sections/SummarySection';
import WorkExperienceSection from '@/components/resume-sections/WorkExperienceSection';
import EducationSection from '@/components/resume-sections/EducationSection';
import SkillsSection from '@/components/resume-sections/SkillsSection';
import ProjectsSection from '@/components/resume-sections/ProjectsSection';
import ResumePreview from '@/components/ResumePreview';

export default function ResumeEditPage() {
  const router = useRouter();
  const { requireAuth } = useAuth();
  const { resume, setResume } = useResume();

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    setMounted(true);
    requireAuth();
  }, [requireAuth]);

  useEffect(() => {
    // Redirect if no resume data
    if (!resume && mounted) {
      router.push('/resume-editor/upload');
    }
  }, [resume, mounted, router]);

  // Auto-save functionality with debounce
  const saveResume = useCallback(() => {
    if (!resume) return;

    setIsSaving(true);

    // Save to localStorage
    try {
      localStorage.setItem('resume_draft', JSON.stringify(resume));
      localStorage.setItem('resume_draft_timestamp', new Date().toISOString());

      setTimeout(() => {
        setIsSaving(false);
        setLastSaved(new Date());
        setShowSaved(true);

        setTimeout(() => {
          setShowSaved(false);
        }, 2000);
      }, 500);
    } catch (error) {
      console.error('Error saving resume:', error);
      setIsSaving(false);
    }
  }, [resume]);

  // Debounced auto-save
  useEffect(() => {
    if (!resume) return;

    const timer = setTimeout(() => {
      saveResume();
    }, 1000);

    return () => clearTimeout(timer);
  }, [resume, saveResume]);

  if (!resume) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFB]">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#D4A574] border-t-transparent mx-auto mb-4"></div>
          <p className="text-[14px] text-[#6B7280] font-medium">Loading editor...</p>
        </div>
      </div>
    );
  }

  const handlePersonalInfoChange = (field: keyof PersonalInfo, value: string) => {
    setResume({
      ...resume,
      personalInfo: {
        ...resume.personalInfo,
        [field]: value,
      },
    });
  };

  const handleSummaryChange = (value: string) => {
    setResume({
      ...resume,
      summary: value,
    });
  };

  const handleContinue = () => {
    saveResume();
    // TODO: Navigate to Phase 4 (PDF Export)
    alert('Continuing to PDF Export (Phase 4 - Coming Soon)');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFB]">
      {/* Header */}
      <header
        className={`sticky top-0 z-40 bg-white border-b border-[#E5E7EB] transition-all duration-500 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'
        }`}
      >
        <div className="mx-auto max-w-[1400px] px-8 lg:px-10">
          <div className="flex items-center justify-between h-16">
            {/* Left */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="text-[#6B7280] hover:text-[#0F1419] transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-[24px] font-bold text-[#0F1419] tracking-[-0.5px]">
                Resume Editor
              </h1>
            </div>

            {/* Center - Breadcrumb (hidden on mobile) */}
            <div className="hidden md:block">
              <p className="text-[12px] text-[#6B7280]">
                Personal Info • Experience • Education • Skills • Projects
              </p>
            </div>

            {/* Right */}
            <div className="flex items-center gap-4">
              {/* Save Indicator */}
              {showSaved && (
                <div className="flex items-center gap-2 text-[#10B981] text-[14px] font-medium animate-fade-in">
                  <Check className="h-4 w-4" />
                  <span>Saved</span>
                </div>
              )}
              {isSaving && (
                <div className="text-[14px] text-[#6B7280] font-medium">
                  Saving...
                </div>
              )}

              {/* Continue Button */}
              <button
                onClick={handleContinue}
                className="px-6 py-2.5 rounded-lg bg-[#D4A574] text-[#0F1419] text-[14px] font-semibold transition-all duration-300 hover:bg-[#C89850] hover:-translate-y-0.5 hover:shadow-md"
              >
                Continue to PDF Export
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Tabs */}
      <div className="lg:hidden bg-white border-b-2 border-[#E5E7EB]">
        <div className="flex">
          <button
            onClick={() => setActiveTab('editor')}
            className={`flex-1 py-3 text-[14px] font-semibold transition-all duration-200 border-b-2 ${
              activeTab === 'editor'
                ? 'text-[#D4A574] border-[#D4A574]'
                : 'text-[#6B7280] border-transparent'
            }`}
          >
            Editor
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex-1 py-3 text-[14px] font-semibold transition-all duration-200 border-b-2 ${
              activeTab === 'preview'
                ? 'text-[#D4A574] border-[#D4A574]'
                : 'text-[#6B7280] border-transparent'
            }`}
          >
            Preview
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-[1400px] px-8 lg:px-10 py-10">
        {/* Desktop: Two Columns */}
        <div className="hidden lg:grid lg:grid-cols-5 lg:gap-6">
          {/* Left Column - Editor Form (60%) */}
          <div
            className={`lg:col-span-3 transition-all duration-400 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-10">
              <PersonalInfoSection
                data={resume.personalInfo}
                onChange={handlePersonalInfoChange}
              />

              <SummarySection
                summary={resume.summary}
                onChange={handleSummaryChange}
              />

              <WorkExperienceSection
                experiences={resume.experience}
                onChange={(experiences) => setResume({ ...resume, experience: experiences })}
              />

              <EducationSection
                education={resume.education}
                onChange={(education) => setResume({ ...resume, education })}
              />

              <SkillsSection
                skills={resume.skills}
                onChange={(skills) => setResume({ ...resume, skills })}
                summary={resume.summary}
              />

              <ProjectsSection
                projects={resume.projects || []}
                onChange={(projects) => setResume({ ...resume, projects })}
              />

              {/* Bottom Actions */}
              <div className="flex gap-4 pt-6 border-t border-[#E5E7EB]">
                <button
                  onClick={() => router.back()}
                  className="px-6 py-3 rounded-lg bg-white border border-[#E5E7EB] text-[#0F1419] text-[14px] font-semibold transition-all duration-300 hover:bg-[#F8FAFB]"
                >
                  Back
                </button>
                <button
                  onClick={handleContinue}
                  className="flex-1 px-6 py-3 rounded-lg bg-[#D4A574] text-[#0F1419] text-[14px] font-semibold transition-all duration-300 hover:bg-[#C89850] hover:-translate-y-0.5 hover:shadow-md"
                >
                  Continue to PDF Export
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Preview (40%) */}
          <div
            className={`lg:col-span-2 transition-all duration-400 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <ResumePreview resume={resume} />
          </div>
        </div>

        {/* Mobile: Tabs */}
        <div className="lg:hidden">
          {activeTab === 'editor' ? (
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <PersonalInfoSection
                data={resume.personalInfo}
                onChange={handlePersonalInfoChange}
              />

              <SummarySection
                summary={resume.summary}
                onChange={handleSummaryChange}
              />

              <WorkExperienceSection
                experiences={resume.experience}
                onChange={(experiences) => setResume({ ...resume, experience: experiences })}
              />

              <EducationSection
                education={resume.education}
                onChange={(education) => setResume({ ...resume, education })}
              />

              <SkillsSection
                skills={resume.skills}
                onChange={(skills) => setResume({ ...resume, skills })}
                summary={resume.summary}
              />

              <ProjectsSection
                projects={resume.projects || []}
                onChange={(projects) => setResume({ ...resume, projects })}
              />

              {/* Bottom Actions */}
              <div className="flex flex-col gap-3 pt-6 border-t border-[#E5E7EB]">
                <button
                  onClick={() => router.back()}
                  className="w-full px-6 py-3 rounded-lg bg-white border border-[#E5E7EB] text-[#0F1419] text-[14px] font-semibold"
                >
                  Back
                </button>
                <button
                  onClick={handleContinue}
                  className="w-full px-6 py-3 rounded-lg bg-[#D4A574] text-[#0F1419] text-[14px] font-semibold"
                >
                  Continue to PDF Export
                </button>
              </div>
            </div>
          ) : (
            <ResumePreview resume={resume} />
          )}
        </div>
      </main>
    </div>
  );
}
