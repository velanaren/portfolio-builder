/**
 * ResumeReview Component
 * Display and edit parsed resume data before analysis
 */

'use client';

import { useState } from 'react';
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
} from 'lucide-react';
import { ParsedResume, WorkExperience, Education, PersonalInfo } from '@/types';

interface ResumeReviewProps {
  resumeData: ParsedResume;
  confidence: 'high' | 'medium' | 'low';
  warnings: string[];
  onConfirm: (editedResume: ParsedResume) => void;
  onReupload: () => void;
}

export default function ResumeReview({
  resumeData,
  confidence,
  warnings,
  onConfirm,
  onReupload,
}: ResumeReviewProps) {
  const [editedResume, setEditedResume] = useState<ParsedResume>(resumeData);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>('');

  // Confidence badge configuration
  const confidenceConfig = {
    high: {
      icon: CheckCircle,
      color: '#10B981',
      bgColor: '#D1FAE5',
      label: 'High Confidence',
    },
    medium: {
      icon: AlertTriangle,
      color: '#F59E0B',
      bgColor: '#FEF3C7',
      label: 'Medium Confidence',
    },
    low: {
      icon: XCircle,
      color: '#EF4444',
      bgColor: '#FEE2E2',
      label: 'Low Confidence',
    },
  };

  const config = confidenceConfig[confidence];
  const ConfidenceIcon = config.icon;

  // Handle personal info field edits
  const handlePersonalInfoEdit = (field: keyof PersonalInfo, value: string) => {
    setEditedResume({
      ...editedResume,
      personalInfo: {
        ...editedResume.personalInfo,
        [field]: value,
      },
    });
  };

  // Handle summary edit
  const handleSummaryEdit = (value: string) => {
    setEditedResume({
      ...editedResume,
      summary: value,
    });
  };

  // Handle experience edits
  const handleExperienceEdit = (index: number, field: keyof WorkExperience, value: string | boolean) => {
    const updatedExperience = [...editedResume.experience];
    updatedExperience[index] = {
      ...updatedExperience[index],
      [field]: value,
    };
    setEditedResume({
      ...editedResume,
      experience: updatedExperience,
    });
  };

  const handleAddExperience = () => {
    const newExperience: WorkExperience = {
      id: `exp-${Date.now()}`,
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    };
    setEditedResume({
      ...editedResume,
      experience: [...editedResume.experience, newExperience],
    });
  };

  const handleRemoveExperience = (index: number) => {
    const updatedExperience = editedResume.experience.filter((_, i) => i !== index);
    setEditedResume({
      ...editedResume,
      experience: updatedExperience,
    });
  };

  // Handle education edits
  const handleEducationEdit = (index: number, field: keyof Education, value: string) => {
    const updatedEducation = [...editedResume.education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value,
    };
    setEditedResume({
      ...editedResume,
      education: updatedEducation,
    });
  };

  const handleAddEducation = () => {
    const newEducation: Education = {
      id: `edu-${Date.now()}`,
      institution: '',
      degree: '',
      field: '',
      graduationDate: '',
    };
    setEditedResume({
      ...editedResume,
      education: [...editedResume.education, newEducation],
    });
  };

  const handleRemoveEducation = (index: number) => {
    const updatedEducation = editedResume.education.filter((_, i) => i !== index);
    setEditedResume({
      ...editedResume,
      education: updatedEducation,
    });
  };

  // Handle skills edits
  const handleSkillEdit = (index: number, value: string) => {
    const updatedSkills = [...editedResume.skills];
    updatedSkills[index] = value;
    setEditedResume({
      ...editedResume,
      skills: updatedSkills,
    });
  };

  const handleAddSkill = () => {
    setEditedResume({
      ...editedResume,
      skills: [...editedResume.skills, ''],
    });
  };

  const handleRemoveSkill = (index: number) => {
    const updatedSkills = editedResume.skills.filter((_, i) => i !== index);
    setEditedResume({
      ...editedResume,
      skills: updatedSkills,
    });
  };

  // Inline edit helpers
  const startEdit = (field: string, initialValue: string) => {
    setEditingField(field);
    setTempValue(initialValue);
  };

  const cancelEdit = () => {
    setEditingField(null);
    setTempValue('');
  };

  const saveEdit = (callback: (value: string) => void) => {
    callback(tempValue);
    setEditingField(null);
    setTempValue('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header with Confidence Badge */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <h2 className="text-[28px] font-semibold" style={{ color: '#1A1F2E' }}>
            Review Your Resume
          </h2>
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ backgroundColor: config.bgColor }}
          >
            <ConfidenceIcon className="w-4 h-4" style={{ color: config.color }} />
            <span className="text-[12px] font-semibold" style={{ color: config.color }}>
              {config.label}
            </span>
          </div>
        </div>
        <p className="text-[14px]" style={{ color: '#6B7280' }}>
          Review and edit the extracted information to ensure accuracy
        </p>
      </div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <div
          className="mb-6 rounded-lg p-4"
          style={{ backgroundColor: '#FEF3C7', borderLeft: '4px solid #F59E0B' }}
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#F59E0B' }} />
            <div className="flex-1">
              <p className="text-[14px] font-semibold mb-2" style={{ color: '#92400E' }}>
                Parsing Warnings
              </p>
              <ul className="space-y-1">
                {warnings.map((warning, index) => (
                  <li key={index} className="text-[14px]" style={{ color: '#B45309' }}>
                    • {warning}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="space-y-6">
        {/* Personal Information */}
        <div className="bg-white rounded-xl p-6 border" style={{ borderColor: '#E5E7EB' }}>
          <h3 className="text-[20px] font-semibold mb-4" style={{ color: '#1A1F2E' }}>
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-[14px] font-medium mb-2" style={{ color: '#374151' }}>
                Full Name
              </label>
              <input
                type="text"
                value={editedResume.personalInfo.name}
                onChange={(e) => handlePersonalInfoEdit('name', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border transition-colors"
                style={{ borderColor: '#E5E7EB', color: '#1A1F2E' }}
                placeholder="Enter your name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-[14px] font-medium mb-2" style={{ color: '#374151' }}>
                Email
              </label>
              <input
                type="email"
                value={editedResume.personalInfo.email}
                onChange={(e) => handlePersonalInfoEdit('email', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border transition-colors"
                style={{ borderColor: '#E5E7EB', color: '#1A1F2E' }}
                placeholder="your.email@example.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[14px] font-medium mb-2" style={{ color: '#374151' }}>
                Phone
              </label>
              <input
                type="tel"
                value={editedResume.personalInfo.phone}
                onChange={(e) => handlePersonalInfoEdit('phone', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border transition-colors"
                style={{ borderColor: '#E5E7EB', color: '#1A1F2E' }}
                placeholder="(123) 456-7890"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-[14px] font-medium mb-2" style={{ color: '#374151' }}>
                Location
              </label>
              <input
                type="text"
                value={editedResume.personalInfo.location}
                onChange={(e) => handlePersonalInfoEdit('location', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border transition-colors"
                style={{ borderColor: '#E5E7EB', color: '#1A1F2E' }}
                placeholder="City, State"
              />
            </div>

            {/* LinkedIn */}
            <div>
              <label className="block text-[14px] font-medium mb-2" style={{ color: '#374151' }}>
                LinkedIn (Optional)
              </label>
              <input
                type="text"
                value={editedResume.personalInfo.linkedin || editedResume.personalInfo.linkedIn || ''}
                onChange={(e) => handlePersonalInfoEdit('linkedin', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border transition-colors"
                style={{ borderColor: '#E5E7EB', color: '#1A1F2E' }}
                placeholder="linkedin.com/in/yourprofile"
              />
            </div>

            {/* Website */}
            <div>
              <label className="block text-[14px] font-medium mb-2" style={{ color: '#374151' }}>
                Website (Optional)
              </label>
              <input
                type="text"
                value={editedResume.personalInfo.website || ''}
                onChange={(e) => handlePersonalInfoEdit('website', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border transition-colors"
                style={{ borderColor: '#E5E7EB', color: '#1A1F2E' }}
                placeholder="yourwebsite.com"
              />
            </div>
          </div>
        </div>

        {/* Professional Summary */}
        <div className="bg-white rounded-xl p-6 border" style={{ borderColor: '#E5E7EB' }}>
          <h3 className="text-[20px] font-semibold mb-4" style={{ color: '#1A1F2E' }}>
            Professional Summary
          </h3>
          <textarea
            value={editedResume.summary}
            onChange={(e) => handleSummaryEdit(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border transition-colors"
            style={{ borderColor: '#E5E7EB', color: '#1A1F2E', minHeight: '120px' }}
            placeholder="Brief professional summary..."
          />
        </div>

        {/* Work Experience */}
        <div className="bg-white rounded-xl p-6 border" style={{ borderColor: '#E5E7EB' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[20px] font-semibold" style={{ color: '#1A1F2E' }}>
              Work Experience
            </h3>
            <button
              onClick={handleAddExperience}
              className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors hover:opacity-80"
              style={{ backgroundColor: '#F8FAFB', color: '#D4A574' }}
            >
              <Plus className="w-4 h-4" />
              <span className="text-[14px] font-medium">Add Experience</span>
            </button>
          </div>

          <div className="space-y-4">
            {editedResume.experience.map((exp, index) => (
              <div
                key={exp.id}
                className="p-4 rounded-lg border relative"
                style={{ borderColor: '#E5E7EB', backgroundColor: '#F8FAFB' }}
              >
                <button
                  onClick={() => handleRemoveExperience(index)}
                  className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-white transition-colors"
                  style={{ color: '#EF4444' }}
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-[12px] font-medium mb-1" style={{ color: '#6B7280' }}>
                      Company
                    </label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => handleExperienceEdit(index, 'company', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border bg-white"
                      style={{ borderColor: '#E5E7EB', color: '#1A1F2E', fontSize: '14px' }}
                      placeholder="Company name"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium mb-1" style={{ color: '#6B7280' }}>
                      Position
                    </label>
                    <input
                      type="text"
                      value={exp.position}
                      onChange={(e) => handleExperienceEdit(index, 'position', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border bg-white"
                      style={{ borderColor: '#E5E7EB', color: '#1A1F2E', fontSize: '14px' }}
                      placeholder="Job title"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                  <div>
                    <label className="block text-[12px] font-medium mb-1" style={{ color: '#6B7280' }}>
                      Start Date
                    </label>
                    <input
                      type="text"
                      value={exp.startDate}
                      onChange={(e) => handleExperienceEdit(index, 'startDate', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border bg-white"
                      style={{ borderColor: '#E5E7EB', color: '#1A1F2E', fontSize: '14px' }}
                      placeholder="MM/YYYY"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium mb-1" style={{ color: '#6B7280' }}>
                      End Date
                    </label>
                    <input
                      type="text"
                      value={exp.endDate}
                      onChange={(e) => handleExperienceEdit(index, 'endDate', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border bg-white"
                      style={{ borderColor: '#E5E7EB', color: '#1A1F2E', fontSize: '14px' }}
                      placeholder="MM/YYYY"
                      disabled={exp.current}
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={exp.current}
                        onChange={(e) => handleExperienceEdit(index, 'current', e.target.checked)}
                        className="w-4 h-4 rounded"
                        style={{ accentColor: '#D4A574' }}
                      />
                      <span className="text-[14px]" style={{ color: '#374151' }}>
                        Current
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-medium mb-1" style={{ color: '#6B7280' }}>
                    Description
                  </label>
                  <textarea
                    value={exp.description}
                    onChange={(e) => handleExperienceEdit(index, 'description', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border bg-white"
                    style={{ borderColor: '#E5E7EB', color: '#1A1F2E', fontSize: '14px', minHeight: '80px' }}
                    placeholder="Key responsibilities and achievements..."
                  />
                </div>
              </div>
            ))}

            {editedResume.experience.length === 0 && (
              <p className="text-center text-[14px] py-8" style={{ color: '#9CA3AF' }}>
                No work experience added. Click "Add Experience" to start.
              </p>
            )}
          </div>
        </div>

        {/* Education */}
        <div className="bg-white rounded-xl p-6 border" style={{ borderColor: '#E5E7EB' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[20px] font-semibold" style={{ color: '#1A1F2E' }}>
              Education
            </h3>
            <button
              onClick={handleAddEducation}
              className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors hover:opacity-80"
              style={{ backgroundColor: '#F8FAFB', color: '#D4A574' }}
            >
              <Plus className="w-4 h-4" />
              <span className="text-[14px] font-medium">Add Education</span>
            </button>
          </div>

          <div className="space-y-4">
            {editedResume.education.map((edu, index) => (
              <div
                key={edu.id}
                className="p-4 rounded-lg border relative"
                style={{ borderColor: '#E5E7EB', backgroundColor: '#F8FAFB' }}
              >
                <button
                  onClick={() => handleRemoveEducation(index)}
                  className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-white transition-colors"
                  style={{ color: '#EF4444' }}
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12px] font-medium mb-1" style={{ color: '#6B7280' }}>
                      Institution
                    </label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => handleEducationEdit(index, 'institution', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border bg-white"
                      style={{ borderColor: '#E5E7EB', color: '#1A1F2E', fontSize: '14px' }}
                      placeholder="University/College name"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium mb-1" style={{ color: '#6B7280' }}>
                      Degree
                    </label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => handleEducationEdit(index, 'degree', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border bg-white"
                      style={{ borderColor: '#E5E7EB', color: '#1A1F2E', fontSize: '14px' }}
                      placeholder="Bachelor's, Master's, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium mb-1" style={{ color: '#6B7280' }}>
                      Field of Study
                    </label>
                    <input
                      type="text"
                      value={edu.field}
                      onChange={(e) => handleEducationEdit(index, 'field', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border bg-white"
                      style={{ borderColor: '#E5E7EB', color: '#1A1F2E', fontSize: '14px' }}
                      placeholder="Computer Science, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium mb-1" style={{ color: '#6B7280' }}>
                      Graduation Date
                    </label>
                    <input
                      type="text"
                      value={edu.graduationDate}
                      onChange={(e) => handleEducationEdit(index, 'graduationDate', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border bg-white"
                      style={{ borderColor: '#E5E7EB', color: '#1A1F2E', fontSize: '14px' }}
                      placeholder="MM/YYYY"
                    />
                  </div>
                </div>
              </div>
            ))}

            {editedResume.education.length === 0 && (
              <p className="text-center text-[14px] py-8" style={{ color: '#9CA3AF' }}>
                No education added. Click "Add Education" to start.
              </p>
            )}
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white rounded-xl p-6 border" style={{ borderColor: '#E5E7EB' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[20px] font-semibold" style={{ color: '#1A1F2E' }}>
              Skills
            </h3>
            <button
              onClick={handleAddSkill}
              className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors hover:opacity-80"
              style={{ backgroundColor: '#F8FAFB', color: '#D4A574' }}
            >
              <Plus className="w-4 h-4" />
              <span className="text-[14px] font-medium">Add Skill</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {editedResume.skills.map((skill, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border group"
                style={{ borderColor: '#E5E7EB', backgroundColor: '#F8FAFB' }}
              >
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => handleSkillEdit(index, e.target.value)}
                  className="bg-transparent border-none outline-none text-[14px] min-w-[60px]"
                  style={{ color: '#1A1F2E' }}
                  placeholder="Skill name"
                />
                <button
                  onClick={() => handleRemoveSkill(index)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: '#EF4444' }}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {editedResume.skills.length === 0 && (
              <p className="text-center text-[14px] py-4 w-full" style={{ color: '#9CA3AF' }}>
                No skills added. Click "Add Skill" to start.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => onConfirm(editedResume)}
          className="flex-1 py-4 px-6 rounded-lg text-white font-semibold text-[16px] transition-all hover:opacity-90 hover:shadow-lg"
          style={{ backgroundColor: '#D4A574' }}
        >
          Confirm & Analyze
        </button>
        <button
          onClick={onReupload}
          className="flex-1 sm:flex-none py-4 px-6 rounded-lg font-semibold text-[16px] transition-all hover:opacity-80 border"
          style={{ borderColor: '#E5E7EB', color: '#6B7280', backgroundColor: '#FFFFFF' }}
        >
          Re-upload Resume
        </button>
      </div>

      {/* Helper Text */}
      <p className="mt-4 text-center text-[12px]" style={{ color: '#9CA3AF' }}>
        Review carefully - this information will be used for your skills analysis
      </p>
    </div>
  );
}
