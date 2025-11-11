/**
 * Parsed Resume Summary Component
 * Collapsible display of parsed resume data in Step 3
 */

'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Edit2, Upload } from 'lucide-react';
import { ParsedResume } from '@/types';

interface ParsedResumeSummaryProps {
  resumeData: ParsedResume;
  onEdit: () => void;
  onReupload: () => void;
}

export default function ParsedResumeSummary({
  resumeData,
  onEdit,
  onReupload,
}: ParsedResumeSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const topSkills = resumeData.skills?.slice(0, 3) || [];

  return (
    <div className="bg-white rounded-xl border" style={{ borderColor: '#E5E7EB' }}>
      {/* Header (Always Visible) */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-t-xl"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#F0F9FF' }}
          >
            <span className="text-[16px]">📋</span>
          </div>
          <div className="text-left">
            <p className="text-[14px] font-semibold" style={{ color: '#1A1F2E' }}>
              Resume Data
            </p>
            <p className="text-[12px]" style={{ color: '#6B7280' }}>
              {resumeData.personalInfo?.name} • {resumeData.personalInfo?.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isExpanded && topSkills.length > 0 && (
            <div className="hidden sm:flex items-center gap-1 mr-2">
              {topSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 rounded text-[11px]"
                  style={{ backgroundColor: '#F8FAFB', color: '#6B7280' }}
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" style={{ color: '#6B7280' }} />
          ) : (
            <ChevronDown className="w-5 h-5" style={{ color: '#6B7280' }} />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t p-4 space-y-4" style={{ borderColor: '#E5E7EB' }}>
          {/* Personal Info */}
          <div>
            <h4 className="text-[12px] font-semibold mb-2" style={{ color: '#6B7280' }}>
              PERSONAL INFORMATION
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[14px]">
              <div>
                <span style={{ color: '#6B7280' }}>Name:</span>{' '}
                <span style={{ color: '#1A1F2E' }}>{resumeData.personalInfo?.name}</span>
              </div>
              <div>
                <span style={{ color: '#6B7280' }}>Email:</span>{' '}
                <span style={{ color: '#1A1F2E' }}>{resumeData.personalInfo?.email}</span>
              </div>
              {resumeData.personalInfo?.phone && (
                <div>
                  <span style={{ color: '#6B7280' }}>Phone:</span>{' '}
                  <span style={{ color: '#1A1F2E' }}>{resumeData.personalInfo.phone}</span>
                </div>
              )}
              {resumeData.personalInfo?.location && (
                <div>
                  <span style={{ color: '#6B7280' }}>Location:</span>{' '}
                  <span style={{ color: '#1A1F2E' }}>{resumeData.personalInfo.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          {resumeData.summary && (
            <div>
              <h4 className="text-[12px] font-semibold mb-2" style={{ color: '#6B7280' }}>
                PROFESSIONAL SUMMARY
              </h4>
              <p className="text-[14px] leading-relaxed" style={{ color: '#1A1F2E' }}>
                {resumeData.summary.length > 200
                  ? resumeData.summary.substring(0, 200) + '...'
                  : resumeData.summary}
              </p>
            </div>
          )}

          {/* Experience */}
          {resumeData.experience && resumeData.experience.length > 0 && (
            <div>
              <h4 className="text-[12px] font-semibold mb-2" style={{ color: '#6B7280' }}>
                EXPERIENCE ({resumeData.experience.length})
              </h4>
              <div className="space-y-2">
                {resumeData.experience.slice(0, 2).map((exp, idx) => (
                  <div key={idx} className="text-[14px]">
                    <p style={{ color: '#1A1F2E' }}>
                      <strong>{exp.position}</strong> at {exp.company}
                    </p>
                  </div>
                ))}
                {resumeData.experience.length > 2 && (
                  <p className="text-[12px]" style={{ color: '#6B7280' }}>
                    +{resumeData.experience.length - 2} more
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Education */}
          {resumeData.education && resumeData.education.length > 0 && (
            <div>
              <h4 className="text-[12px] font-semibold mb-2" style={{ color: '#6B7280' }}>
                EDUCATION ({resumeData.education.length})
              </h4>
              <div className="space-y-2">
                {resumeData.education.slice(0, 2).map((edu, idx) => (
                  <div key={idx} className="text-[14px]">
                    <p style={{ color: '#1A1F2E' }}>
                      {edu.degree} in {edu.field} - {edu.institution}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {resumeData.skills && resumeData.skills.length > 0 && (
            <div>
              <h4 className="text-[12px] font-semibold mb-2" style={{ color: '#6B7280' }}>
                SKILLS
              </h4>
              <div className="flex flex-wrap gap-1">
                {resumeData.skills.slice(0, 10).map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 rounded text-[12px]"
                    style={{ backgroundColor: '#F8FAFB', color: '#6B7280' }}
                  >
                    {skill}
                  </span>
                ))}
                {resumeData.skills.length > 10 && (
                  <span className="px-2 py-1 text-[12px]" style={{ color: '#6B7280' }}>
                    +{resumeData.skills.length - 10} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onEdit}
              className="flex-1 px-4 py-2 rounded-lg text-[12px] font-semibold transition-colors flex items-center justify-center gap-2"
              style={{
                backgroundColor: '#F3F4F6',
                color: '#1A1F2E',
              }}
            >
              <Edit2 className="w-3 h-3" />
              Edit Resume
            </button>
            <button
              type="button"
              onClick={onReupload}
              className="flex-1 px-4 py-2 rounded-lg text-[12px] font-semibold transition-colors flex items-center justify-center gap-2"
              style={{
                backgroundColor: '#F3F4F6',
                color: '#1A1F2E',
              }}
            >
              <Upload className="w-3 h-3" />
              Re-upload
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
