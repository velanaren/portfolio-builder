/**
 * Resume Review Component (Step 2)
 * Display and edit parsed resume data
 */

'use client';

import { useState } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Plus, X, Upload } from 'lucide-react';
import { ParsedResume } from '@/types';

interface ResumeReviewProps {
  resumeData: ParsedResume;
  confidence: 'high' | 'medium' | 'low';
  warnings?: string[];
  onConfirm: (updatedResume: ParsedResume) => void;
  onReupload: () => void;
}

export default function ResumeReview({
  resumeData,
  confidence,
  warnings = [],
  onConfirm,
  onReupload,
}: ResumeReviewProps) {
  const [editedResume, setEditedResume] = useState<ParsedResume>(resumeData);

  const updateField = (path: string[], value: any) => {
    setEditedResume(prev => {
      const updated = { ...prev };
      let current: any = updated;

      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }

      current[path[path.length - 1]] = value;
      return updated;
    });
  };

  const addExperience = () => {
    setEditedResume(prev => ({
      ...prev,
      experience: [
        ...(prev.experience || []),
        {
          id: `exp-${Date.now()}`,
          company: '',
          position: '',
          startDate: '',
          endDate: '',
          current: false,
          description: '',
        },
      ],
    }));
  };

  const removeExperience = (index: number) => {
    setEditedResume(prev => ({
      ...prev,
      experience: prev.experience?.filter((_, i) => i !== index) || [],
    }));
  };

  const addEducation = () => {
    setEditedResume(prev => ({
      ...prev,
      education: [
        ...(prev.education || []),
        {
          id: `edu-${Date.now()}`,
          institution: '',
          degree: '',
          field: '',
          graduationDate: '',
        },
      ],
    }));
  };

  const removeEducation = (index: number) => {
    setEditedResume(prev => ({
      ...prev,
      education: prev.education?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleConfirm = () => {
    // Validate required fields
    if (!editedResume.personalInfo?.name || !editedResume.personalInfo?.email) {
      alert('Please fill in at least Name and Email');
      return;
    }
    onConfirm(editedResume);
  };

  const confidenceBadge = {
    high: {
      icon: <CheckCircle className="w-5 h-5" />,
      text: 'Confidence: High',
      bgColor: '#ECFDF5',
      textColor: '#065F46',
      iconColor: '#10B981',
    },
    medium: {
      icon: <AlertTriangle className="w-5 h-5" />,
      text: 'Confidence: Medium - Please verify',
      bgColor: '#FEF3C7',
      textColor: '#92400E',
      iconColor: '#F59E0B',
    },
    low: {
      icon: <XCircle className="w-5 h-5" />,
      text: 'Confidence: Low - Please review carefully',
      bgColor: '#FEF2F2',
      textColor: '#991B1B',
      iconColor: '#EF4444',
    },
  };

  const badge = confidenceBadge[confidence];

  return (
    <div className="space-y-6">
      {/* Header with Confidence Badge */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-[24px] font-bold mb-1" style={{ color: '#1A1F2E' }}>
            Review Your Resume
          </h2>
          <p className="text-[14px]" style={{ color: '#6B7280' }}>
            Verify the parsed information and make any necessary edits
          </p>
        </div>

        <div
          className="flex items-center gap-2 px-4 py-2 rounded-lg"
          style={{
            backgroundColor: badge.bgColor,
            color: badge.textColor,
          }}
        >
          <span style={{ color: badge.iconColor }}>{badge.icon}</span>
          <span className="text-[14px] font-semibold">{badge.text}</span>
        </div>
      </div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <div
          className="rounded-lg p-4 border"
          style={{
            backgroundColor: '#FEF3C7',
            borderColor: '#FCD34D',
          }}
        >
          <p className="text-[14px] font-semibold mb-2" style={{ color: '#92400E' }}>
            Parsing Warnings:
          </p>
          <ul className="space-y-1">
            {warnings.map((warning, idx) => (
              <li key={idx} className="text-[12px]" style={{ color: '#92400E' }}>
                • {warning}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Personal Information */}
      <div className="bg-white rounded-xl p-6 border" style={{ borderColor: '#E5E7EB' }}>
        <h3 className="text-[16px] font-bold mb-4" style={{ color: '#1A1F2E' }}>
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] font-semibold mb-1" style={{ color: '#6B7280' }}>
              Full Name *
            </label>
            <input
              type="text"
              value={editedResume.personalInfo?.name || ''}
              onChange={(e) => updateField(['personalInfo', 'name'], e.target.value)}
              className="w-full px-4 py-2 rounded-lg border text-[14px]"
              style={{ borderColor: '#E5E7EB' }}
            />
          </div>
          <div>
            <label className="block text-[12px] font-semibold mb-1" style={{ color: '#6B7280' }}>
              Email *
            </label>
            <input
              type="email"
              value={editedResume.personalInfo?.email || ''}
              onChange={(e) => updateField(['personalInfo', 'email'], e.target.value)}
              className="w-full px-4 py-2 rounded-lg border text-[14px]"
              style={{ borderColor: '#E5E7EB' }}
            />
          </div>
          <div>
            <label className="block text-[12px] font-semibold mb-1" style={{ color: '#6B7280' }}>
              Phone
            </label>
            <input
              type="tel"
              value={editedResume.personalInfo?.phone || ''}
              onChange={(e) => updateField(['personalInfo', 'phone'], e.target.value)}
              className="w-full px-4 py-2 rounded-lg border text-[14px]"
              style={{ borderColor: '#E5E7EB' }}
            />
          </div>
          <div>
            <label className="block text-[12px] font-semibold mb-1" style={{ color: '#6B7280' }}>
              Location
            </label>
            <input
              type="text"
              value={editedResume.personalInfo?.location || ''}
              onChange={(e) => updateField(['personalInfo', 'location'], e.target.value)}
              className="w-full px-4 py-2 rounded-lg border text-[14px]"
              style={{ borderColor: '#E5E7EB' }}
            />
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      <div className="bg-white rounded-xl p-6 border" style={{ borderColor: '#E5E7EB' }}>
        <h3 className="text-[16px] font-bold mb-4" style={{ color: '#1A1F2E' }}>
          Professional Summary
        </h3>
        <textarea
          value={editedResume.summary || ''}
          onChange={(e) => updateField(['summary'], e.target.value)}
          className="w-full px-4 py-3 rounded-lg border text-[14px] leading-relaxed"
          style={{ borderColor: '#E5E7EB', minHeight: '120px' }}
          placeholder="Brief professional summary..."
        />
      </div>

      {/* Experience */}
      <div className="bg-white rounded-xl p-6 border" style={{ borderColor: '#E5E7EB' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[16px] font-bold" style={{ color: '#1A1F2E' }}>
            Experience
          </h3>
          <button
            type="button"
            onClick={addExperience}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-semibold"
            style={{ backgroundColor: '#F3F4F6', color: '#1A1F2E' }}
          >
            <Plus className="w-4 h-4" />
            Add Experience
          </button>
        </div>

        <div className="space-y-4">
          {editedResume.experience?.map((exp, idx) => (
            <div key={idx} className="p-4 rounded-lg border relative" style={{ borderColor: '#E5E7EB', backgroundColor: '#F8FAFB' }}>
              <button
                type="button"
                onClick={() => removeExperience(idx)}
                className="absolute top-2 right-2 p-1 rounded hover:bg-red-100"
                style={{ color: '#DC2626' }}
              >
                <X className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <input
                  type="text"
                  value={exp.position}
                  onChange={(e) => {
                    const updated = [...(editedResume.experience || [])];
                    updated[idx].position = e.target.value;
                    updateField(['experience'], updated);
                  }}
                  placeholder="Position"
                  className="px-3 py-2 rounded-lg border text-[14px]"
                  style={{ borderColor: '#E5E7EB', backgroundColor: '#FFFFFF' }}
                />
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => {
                    const updated = [...(editedResume.experience || [])];
                    updated[idx].company = e.target.value;
                    updateField(['experience'], updated);
                  }}
                  placeholder="Company"
                  className="px-3 py-2 rounded-lg border text-[14px]"
                  style={{ borderColor: '#E5E7EB', backgroundColor: '#FFFFFF' }}
                />
              </div>

              <textarea
                value={exp.description}
                onChange={(e) => {
                  const updated = [...(editedResume.experience || [])];
                  updated[idx].description = e.target.value;
                  updateField(['experience'], updated);
                }}
                placeholder="Description"
                className="w-full px-3 py-2 rounded-lg border text-[14px]"
                style={{ borderColor: '#E5E7EB', backgroundColor: '#FFFFFF', minHeight: '80px' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div className="bg-white rounded-xl p-6 border" style={{ borderColor: '#E5E7EB' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[16px] font-bold" style={{ color: '#1A1F2E' }}>
            Education
          </h3>
          <button
            type="button"
            onClick={addEducation}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-semibold"
            style={{ backgroundColor: '#F3F4F6', color: '#1A1F2E' }}
          >
            <Plus className="w-4 h-4" />
            Add Education
          </button>
        </div>

        <div className="space-y-4">
          {editedResume.education?.map((edu, idx) => (
            <div key={idx} className="p-4 rounded-lg border relative" style={{ borderColor: '#E5E7EB', backgroundColor: '#F8FAFB' }}>
              <button
                type="button"
                onClick={() => removeEducation(idx)}
                className="absolute top-2 right-2 p-1 rounded hover:bg-red-100"
                style={{ color: '#DC2626' }}
              >
                <X className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) => {
                    const updated = [...(editedResume.education || [])];
                    updated[idx].institution = e.target.value;
                    updateField(['education'], updated);
                  }}
                  placeholder="Institution"
                  className="px-3 py-2 rounded-lg border text-[14px]"
                  style={{ borderColor: '#E5E7EB', backgroundColor: '#FFFFFF' }}
                />
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => {
                    const updated = [...(editedResume.education || [])];
                    updated[idx].degree = e.target.value;
                    updateField(['education'], updated);
                  }}
                  placeholder="Degree"
                  className="px-3 py-2 rounded-lg border text-[14px]"
                  style={{ borderColor: '#E5E7EB', backgroundColor: '#FFFFFF' }}
                />
                <input
                  type="text"
                  value={edu.field}
                  onChange={(e) => {
                    const updated = [...(editedResume.education || [])];
                    updated[idx].field = e.target.value;
                    updateField(['education'], updated);
                  }}
                  placeholder="Field of Study"
                  className="px-3 py-2 rounded-lg border text-[14px]"
                  style={{ borderColor: '#E5E7EB', backgroundColor: '#FFFFFF' }}
                />
                <input
                  type="text"
                  value={edu.graduationDate}
                  onChange={(e) => {
                    const updated = [...(editedResume.education || [])];
                    updated[idx].graduationDate = e.target.value;
                    updateField(['education'], updated);
                  }}
                  placeholder="Graduation Date"
                  className="px-3 py-2 rounded-lg border text-[14px]"
                  style={{ borderColor: '#E5E7EB', backgroundColor: '#FFFFFF' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="bg-white rounded-xl p-6 border" style={{ borderColor: '#E5E7EB' }}>
        <h3 className="text-[16px] font-bold mb-4" style={{ color: '#1A1F2E' }}>
          Skills
        </h3>
        <textarea
          value={(editedResume.skills || []).join(', ')}
          onChange={(e) => updateField(['skills'], e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
          className="w-full px-4 py-3 rounded-lg border text-[14px]"
          style={{ borderColor: '#E5E7EB', minHeight: '80px' }}
          placeholder="Enter skills separated by commas (e.g., JavaScript, React, Node.js)"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={onReupload}
          className="flex-1 px-6 py-3 rounded-xl font-semibold text-[14px] transition-all border-2 flex items-center justify-center gap-2"
          style={{
            backgroundColor: '#F3F4F6',
            borderColor: '#E5E7EB',
            color: '#1A1F2E',
          }}
        >
          <Upload className="w-4 h-4" />
          Re-upload Resume
        </button>

        <button
          type="button"
          onClick={handleConfirm}
          className="flex-1 px-6 py-3 rounded-xl font-semibold text-[14px] transition-all hover:shadow-lg"
          style={{
            backgroundColor: '#D4A574',
            color: '#0F1419',
          }}
        >
          Confirm & Generate Cover Letter
        </button>
      </div>
    </div>
  );
}
