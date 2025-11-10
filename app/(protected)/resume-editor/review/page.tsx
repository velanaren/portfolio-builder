/**
 * Resume Review & Edit Page - Premium Design
 * Elegant two-column layout with editable form and real-time JSON preview
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useResume } from '@/contexts/ResumeContext';
import Navigation from '@/components/Navigation';
import { ArrowLeft, Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { ParsedResume, WorkExperience, Education, Project, Certification } from '@/types';

export default function ResumeReviewPage() {
  const router = useRouter();
  const { requireAuth } = useAuth();
  const { resume, setResume } = useResume();

  const [mounted, setMounted] = useState(false);
  const [editedResume, setEditedResume] = useState<ParsedResume | null>(null);

  useEffect(() => {
    setMounted(true);
    requireAuth();
  }, [requireAuth]);

  useEffect(() => {
    // If no resume data, redirect to upload
    if (!resume && mounted) {
      router.push('/resume-editor/upload');
    } else if (resume) {
      setEditedResume(resume);
      // Debug: Log resume data to help identify parsing issues
      console.log('[Review Page] Resume loaded:', resume);
      console.log('[Review Page] Projects count:', resume.projects?.length || 0);
      if (resume.projects && resume.projects.length > 0) {
        console.log('[Review Page] Projects data:', resume.projects);
      } else {
        console.log('[Review Page] No projects found in parsed resume');
      }
    }
  }, [resume, mounted, router]);

  if (!editedResume) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFB]">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#D4A574] border-t-transparent mx-auto mb-4"></div>
          <p className="text-[14px] text-[#6B7280] font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  const handlePersonalInfoChange = (field: string, value: string) => {
    setEditedResume({
      ...editedResume,
      personalInfo: {
        ...editedResume.personalInfo,
        [field]: value,
      },
    });
  };

  const handleSummaryChange = (value: string) => {
    setEditedResume({
      ...editedResume,
      summary: value,
    });
  };

  const handleSkillsChange = (value: string) => {
    setEditedResume({
      ...editedResume,
      skills: value.split(',').map(s => s.trim()).filter(s => s.length > 0),
    });
  };

  const handleExperienceChange = (id: string, field: keyof WorkExperience, value: any) => {
    setEditedResume({
      ...editedResume,
      experience: editedResume.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };

  const handleEducationChange = (id: string, field: keyof Education, value: string) => {
    setEditedResume({
      ...editedResume,
      education: editedResume.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    });
  };

  const addExperience = () => {
    const newExp: WorkExperience = {
      id: `exp_${Date.now()}`,
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    };
    setEditedResume({
      ...editedResume,
      experience: [...editedResume.experience, newExp],
    });
  };

  const deleteExperience = (id: string) => {
    setEditedResume({
      ...editedResume,
      experience: editedResume.experience.filter(exp => exp.id !== id),
    });
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: `edu_${Date.now()}`,
      institution: '',
      degree: '',
      field: '',
      graduationDate: '',
    };
    setEditedResume({
      ...editedResume,
      education: [...editedResume.education, newEdu],
    });
  };

  const deleteEducation = (id: string) => {
    setEditedResume({
      ...editedResume,
      education: editedResume.education.filter(edu => edu.id !== id),
    });
  };

  const handleProjectChange = (id: string, field: keyof Project, value: any) => {
    setEditedResume({
      ...editedResume,
      projects: (editedResume.projects || []).map(proj =>
        proj.id === id ? { ...proj, [field]: value } : proj
      ),
    });
  };

  const addProject = () => {
    const newProject: Project = {
      id: `proj_${Date.now()}`,
      name: '',
      description: '',
      technologies: [],
      url: '',
      startDate: '',
      endDate: '',
    };
    setEditedResume({
      ...editedResume,
      projects: [...(editedResume.projects || []), newProject],
    });
  };

  const deleteProject = (id: string) => {
    setEditedResume({
      ...editedResume,
      projects: (editedResume.projects || []).filter(proj => proj.id !== id),
    });
  };

  const handleContinue = () => {
    setResume(editedResume);
    router.push('/resume-editor/edit');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFB]">
      <Navigation />

      <main className="mx-auto max-w-[1400px] px-8 lg:px-10 py-8">
        {/* Header */}
        <div
          className={`mb-12 transition-all duration-400 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h1 className="text-[40px] font-bold text-[#0F1419] mb-3 tracking-[-0.5px] leading-tight">
            Review Your Resume Data
          </h1>
          <p className="text-[16px] text-[#6B7280] font-medium">
            Edit any information that needs correction
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column - Editable Form (60%) */}
          <div
            className={`lg:col-span-3 transition-all duration-400 ease-out ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-10 space-y-10">
              {/* Personal Information */}
              <section>
                <h2 className="text-[20px] font-semibold text-[#0F1419] mb-6 tracking-[-0.5px] pb-2 border-b-2 border-[#D4A574]">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#0F1419] mb-2 tracking-wide uppercase">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editedResume.personalInfo.name}
                      onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
                      className="w-full rounded-lg bg-[#F8FAFB] px-4 py-3 text-sm text-[#0F1419] border border-[#E5E7EB] focus:bg-white focus:border-[#D4A574] focus:ring-3 focus:ring-[#D4A574]/10 transition-all duration-200 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#0F1419] mb-2 tracking-wide uppercase">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editedResume.personalInfo.email}
                      onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                      className="w-full rounded-lg bg-[#F8FAFB] px-4 py-3 text-sm text-[#0F1419] border border-[#E5E7EB] focus:bg-white focus:border-[#D4A574] focus:ring-3 focus:ring-[#D4A574]/10 transition-all duration-200 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#0F1419] mb-2 tracking-wide uppercase">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={editedResume.personalInfo.phone}
                      onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                      className="w-full rounded-lg bg-[#F8FAFB] px-4 py-3 text-sm text-[#0F1419] border border-[#E5E7EB] focus:bg-white focus:border-[#D4A574] focus:ring-3 focus:ring-[#D4A574]/10 transition-all duration-200 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#0F1419] mb-2 tracking-wide uppercase">
                      Location
                    </label>
                    <input
                      type="text"
                      value={editedResume.personalInfo.location}
                      onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                      className="w-full rounded-lg bg-[#F8FAFB] px-4 py-3 text-sm text-[#0F1419] border border-[#E5E7EB] focus:bg-white focus:border-[#D4A574] focus:ring-3 focus:ring-[#D4A574]/10 transition-all duration-200 outline-none"
                    />
                  </div>
                </div>
              </section>

              {/* Professional Summary */}
              <section>
                <h2 className="text-[20px] font-semibold text-[#0F1419] mb-6 tracking-[-0.5px] pb-2 border-b-2 border-[#D4A574]">Professional Summary</h2>
                <textarea
                  value={editedResume.summary}
                  onChange={(e) => handleSummaryChange(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg bg-[#F8FAFB] px-4 py-3 text-sm text-[#0F1419] border border-[#E5E7EB] focus:bg-white focus:border-[#D4A574] focus:ring-3 focus:ring-[#D4A574]/10 transition-all duration-200 outline-none resize-none"
                />
              </section>

              {/* Work Experience */}
              <section>
                <div className="flex items-center justify-between mb-6 pb-2 border-b-2 border-[#D4A574]">
                  <h2 className="text-[20px] font-semibold text-[#0F1419] tracking-[-0.5px]">Work Experience</h2>
                  <button
                    onClick={addExperience}
                    className="flex items-center space-x-2 text-sm font-semibold text-[#D4A574] hover:text-[#C89850] transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Experience</span>
                  </button>
                </div>
                <div className="space-y-6">
                  {editedResume.experience.map((exp, index) => (
                    <div key={exp.id} className="p-4 border border-[#E5E7EB] rounded-lg">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-sm font-semibold text-[#0F1419]">Experience {index + 1}</h3>
                        <button
                          onClick={() => deleteExperience(exp.id)}
                          className="text-red-600 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#0F1419] mb-2">Company</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => handleExperienceChange(exp.id, 'company', e.target.value)}
                            className="w-full rounded-lg bg-[#F8FAFB] px-3 py-2 text-sm border border-[#E5E7EB] focus:border-[#D4A574] focus:ring-2 focus:ring-[#D4A574]/10 transition-all outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#0F1419] mb-2">Position</label>
                          <input
                            type="text"
                            value={exp.position}
                            onChange={(e) => handleExperienceChange(exp.id, 'position', e.target.value)}
                            className="w-full rounded-lg bg-[#F8FAFB] px-3 py-2 text-sm border border-[#E5E7EB] focus:border-[#D4A574] focus:ring-2 focus:ring-[#D4A574]/10 transition-all outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#0F1419] mb-2">Start Date</label>
                          <input
                            type="text"
                            value={exp.startDate}
                            onChange={(e) => handleExperienceChange(exp.id, 'startDate', e.target.value)}
                            className="w-full rounded-lg bg-[#F8FAFB] px-3 py-2 text-sm border border-[#E5E7EB] focus:border-[#D4A574] focus:ring-2 focus:ring-[#D4A574]/10 transition-all outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#0F1419] mb-2">End Date</label>
                          <input
                            type="text"
                            value={exp.endDate}
                            onChange={(e) => handleExperienceChange(exp.id, 'endDate', e.target.value)}
                            className="w-full rounded-lg bg-[#F8FAFB] px-3 py-2 text-sm border border-[#E5E7EB] focus:border-[#D4A574] focus:ring-2 focus:ring-[#D4A574]/10 transition-all outline-none"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-semibold text-[#0F1419] mb-2">Description</label>
                          <textarea
                            value={exp.description}
                            onChange={(e) => handleExperienceChange(exp.id, 'description', e.target.value)}
                            rows={3}
                            className="w-full rounded-lg bg-[#F8FAFB] px-3 py-2 text-sm border border-[#E5E7EB] focus:border-[#D4A574] focus:ring-2 focus:ring-[#D4A574]/10 transition-all outline-none resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Education */}
              <section>
                <div className="flex items-center justify-between mb-6 pb-2 border-b-2 border-[#D4A574]">
                  <h2 className="text-[20px] font-semibold text-[#0F1419] tracking-[-0.5px]">Education</h2>
                  <button
                    onClick={addEducation}
                    className="flex items-center space-x-2 text-sm font-semibold text-[#D4A574] hover:text-[#C89850] transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Education</span>
                  </button>
                </div>
                <div className="space-y-4">
                  {editedResume.education.map((edu, index) => (
                    <div key={edu.id} className="p-4 border border-[#E5E7EB] rounded-lg">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-sm font-semibold text-[#0F1419]">Education {index + 1}</h3>
                        <button
                          onClick={() => deleteEducation(edu.id)}
                          className="text-red-600 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#0F1419] mb-2">Institution</label>
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => handleEducationChange(edu.id, 'institution', e.target.value)}
                            className="w-full rounded-lg bg-[#F8FAFB] px-3 py-2 text-sm border border-[#E5E7EB] focus:border-[#D4A574] focus:ring-2 focus:ring-[#D4A574]/10 transition-all outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#0F1419] mb-2">Degree</label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => handleEducationChange(edu.id, 'degree', e.target.value)}
                            className="w-full rounded-lg bg-[#F8FAFB] px-3 py-2 text-sm border border-[#E5E7EB] focus:border-[#D4A574] focus:ring-2 focus:ring-[#D4A574]/10 transition-all outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#0F1419] mb-2">Field of Study</label>
                          <input
                            type="text"
                            value={edu.field}
                            onChange={(e) => handleEducationChange(edu.id, 'field', e.target.value)}
                            className="w-full rounded-lg bg-[#F8FAFB] px-3 py-2 text-sm border border-[#E5E7EB] focus:border-[#D4A574] focus:ring-2 focus:ring-[#D4A574]/10 transition-all outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#0F1419] mb-2">Graduation Date</label>
                          <input
                            type="text"
                            value={edu.graduationDate}
                            onChange={(e) => handleEducationChange(edu.id, 'graduationDate', e.target.value)}
                            className="w-full rounded-lg bg-[#F8FAFB] px-3 py-2 text-sm border border-[#E5E7EB] focus:border-[#D4A574] focus:ring-2 focus:ring-[#D4A574]/10 transition-all outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Skills */}
              <section>
                <h2 className="text-[20px] font-semibold text-[#0F1419] mb-6 tracking-[-0.5px] pb-2 border-b-2 border-[#D4A574]">Skills</h2>
                <textarea
                  value={editedResume.skills.join(', ')}
                  onChange={(e) => handleSkillsChange(e.target.value)}
                  rows={3}
                  placeholder="Enter skills separated by commas"
                  className="w-full rounded-lg bg-[#F8FAFB] px-4 py-3 text-sm text-[#0F1419] border border-[#E5E7EB] focus:bg-white focus:border-[#D4A574] focus:ring-3 focus:ring-[#D4A574]/10 transition-all duration-200 outline-none resize-none"
                />
              </section>

              {/* Projects */}
              <section>
                <div className="flex items-center justify-between mb-6 pb-2 border-b-2 border-[#D4A574]">
                  <h2 className="text-[20px] font-semibold text-[#0F1419] tracking-[-0.5px]">Projects</h2>
                  <button
                    onClick={addProject}
                    className="flex items-center space-x-2 text-sm font-semibold text-[#D4A574] hover:text-[#C89850] transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Project</span>
                  </button>
                </div>
                {editedResume.projects && editedResume.projects.length > 0 ? (
                  <div className="space-y-6">
                    {editedResume.projects.map((project, index) => (
                      <div key={project.id} className="p-4 border border-[#E5E7EB] rounded-lg border-l-4 border-l-[#D4A574]">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-sm font-semibold text-[#0F1419]">Project {index + 1}</h3>
                          <button
                            onClick={() => deleteProject(project.id)}
                            className="text-red-600 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-[#0F1419] mb-2">Project Name</label>
                            <input
                              type="text"
                              value={project.name}
                              onChange={(e) => handleProjectChange(project.id, 'name', e.target.value)}
                              className="w-full rounded-lg bg-[#F8FAFB] px-3 py-2 text-sm border border-[#E5E7EB] focus:border-[#D4A574] focus:ring-2 focus:ring-[#D4A574]/10 transition-all outline-none"
                              placeholder="e.g., E-commerce Platform"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-[#0F1419] mb-2">Description</label>
                            <textarea
                              value={project.description}
                              onChange={(e) => handleProjectChange(project.id, 'description', e.target.value)}
                              rows={4}
                              className="w-full rounded-lg bg-[#F8FAFB] px-3 py-2 text-sm border border-[#E5E7EB] focus:border-[#D4A574] focus:ring-2 focus:ring-[#D4A574]/10 transition-all outline-none resize-none"
                              placeholder="Describe the project, your role, and achievements"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-[#0F1419] mb-2">Technologies (comma-separated)</label>
                            <input
                              type="text"
                              value={Array.isArray(project.technologies) ? project.technologies.join(', ') : ''}
                              onChange={(e) => handleProjectChange(project.id, 'technologies', e.target.value.split(',').map(t => t.trim()).filter(t => t))}
                              className="w-full rounded-lg bg-[#F8FAFB] px-3 py-2 text-sm border border-[#E5E7EB] focus:border-[#D4A574] focus:ring-2 focus:ring-[#D4A574]/10 transition-all outline-none"
                              placeholder="e.g., React, Node.js, MongoDB"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-[#0F1419] mb-2">Project URL (optional)</label>
                              <input
                                type="url"
                                value={project.url || ''}
                                onChange={(e) => handleProjectChange(project.id, 'url', e.target.value)}
                                className="w-full rounded-lg bg-[#F8FAFB] px-3 py-2 text-sm border border-[#E5E7EB] focus:border-[#D4A574] focus:ring-2 focus:ring-[#D4A574]/10 transition-all outline-none"
                                placeholder="https://github.com/..."
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-xs font-semibold text-[#0F1419] mb-2">Start Date</label>
                                <input
                                  type="text"
                                  value={project.startDate || ''}
                                  onChange={(e) => handleProjectChange(project.id, 'startDate', e.target.value)}
                                  className="w-full rounded-lg bg-[#F8FAFB] px-3 py-2 text-sm border border-[#E5E7EB] focus:border-[#D4A574] focus:ring-2 focus:ring-[#D4A574]/10 transition-all outline-none"
                                  placeholder="Jan 2024"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-[#0F1419] mb-2">End Date</label>
                                <input
                                  type="text"
                                  value={project.endDate || ''}
                                  onChange={(e) => handleProjectChange(project.id, 'endDate', e.target.value)}
                                  className="w-full rounded-lg bg-[#F8FAFB] px-3 py-2 text-sm border border-[#E5E7EB] focus:border-[#D4A574] focus:ring-2 focus:ring-[#D4A574]/10 transition-all outline-none"
                                  placeholder="Jun 2024"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-[#F8FAFB] rounded-lg border border-[#E5E7EB]">
                    <p className="text-sm text-[#6B7280]">No projects added yet. Click "Add Project" to add one.</p>
                  </div>
                )}
              </section>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => router.push('/resume-editor/upload')}
                className="px-7 py-3 bg-gray-100 border border-[#E5E7EB] text-[#0F1419] rounded-lg text-sm font-semibold transition-all duration-150 hover:bg-gray-200 hover:border-gray-300"
              >
                <ArrowLeft className="h-4 w-4 inline mr-2" />
                Back
              </button>
              <button
                onClick={handleContinue}
                className="flex-1 px-8 py-3.5 bg-[#D4A574] text-[#0F1419] rounded-lg text-[14px] font-semibold transition-all duration-300 hover:bg-[#C89850] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#D4A574]/30"
              >
                Continue
              </button>
            </div>
          </div>

          {/* Right Column - JSON Preview (40%) */}
          <div
            className={`lg:col-span-2 transition-all duration-400 ease-out ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <div className="sticky top-24">
              <div className="bg-[#1A1F2E] rounded-xl p-8 max-h-[calc(100vh-140px)] overflow-y-auto border border-[#0F1419]">
                <h3 className="text-[16px] font-semibold text-white mb-6 tracking-[-0.5px]">Data Preview (JSON)</h3>
                <div className="bg-[#0F1419] rounded-lg p-6 overflow-x-auto">
                  <pre className="text-[12px] text-[#D4A574] font-mono leading-relaxed">
                    {JSON.stringify(editedResume, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
