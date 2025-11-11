/**
 * MatchingSkillsSection Component
 * Displays skills that match between resume and job description
 */

'use client';

import { CheckCircle, Copy, Check } from 'lucide-react';
import { MatchedSkill } from '@/types';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface MatchingSkillsSectionProps {
  skills: MatchedSkill[];
}

export default function MatchingSkillsSection({ skills }: MatchingSkillsSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopySkills = async () => {
    const skillsText = skills.map((s) => s.name).join(', ');
    try {
      await navigator.clipboard.writeText(skillsText);
      setCopied(true);
      toast.success('Matched skills copied to clipboard!', {
        duration: 2000,
        style: {
          background: '#10B981',
          color: '#FFFFFF',
        },
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy skills');
    }
  };

  const getMatchBadgeColor = (strength: string) => {
    if (strength === 'exact') return { bg: '#ECFDF5', text: '#065F46', label: 'Exact' };
    if (strength === 'similar') return { bg: '#DBEAFE', text: '#1E40AF', label: 'Similar' };
    return { bg: '#FEF3C7', text: '#92400E', label: 'Related' };
  };

  if (skills.length === 0) {
    return (
      <div
        className="rounded-xl border p-6"
        style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}
      >
        <div className="text-center py-8">
          <p className="text-[14px]" style={{ color: '#6B7280' }}>
            No matching skills found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl border"
      style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}
    >
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: '#E5E7EB' }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-5 h-5" style={{ color: '#10B981' }} />
              <h3 className="text-[20px] font-semibold" style={{ color: '#1A1F2E' }}>
                Matching Skills
              </h3>
            </div>
            <p className="text-[14px]" style={{ color: '#6B7280' }}>
              {skills.length} {skills.length === 1 ? 'skill' : 'skills'} you have that match the job
            </p>
          </div>

          <button
            onClick={handleCopySkills}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 hover:shadow-md"
            style={{
              borderColor: '#E5E7EB',
              backgroundColor: '#FFFFFF',
              color: '#1A1F2E',
            }}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" style={{ color: '#10B981' }} />
                <span className="text-[14px] font-medium">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span className="text-[14px] font-medium">Copy Skills</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Skills List */}
      <div className="p-6 space-y-4">
        {skills.map((skill, index) => {
          const badgeColors = getMatchBadgeColor(skill.matchStrength);
          return (
            <div
              key={index}
              className="border rounded-lg p-4"
              style={{ borderColor: '#E5E7EB' }}
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex-1">
                  <h4 className="text-[16px] font-semibold" style={{ color: '#1A1F2E' }}>
                    {skill.name}
                  </h4>
                  {skill.category && (
                    <p className="text-[12px] mt-1" style={{ color: '#6B7280' }}>
                      {skill.category}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {/* Match Badge */}
                  <span
                    className="px-3 py-1 rounded-full text-[12px] font-semibold"
                    style={{
                      backgroundColor: badgeColors.bg,
                      color: badgeColors.text,
                    }}
                  >
                    {badgeColors.label}
                  </span>

                  {/* Match Score */}
                  <span className="text-[14px] font-semibold" style={{ color: '#10B981' }}>
                    {skill.matchScore}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div
                className="w-full h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: '#F3F4F6' }}
              >
                <div
                  className="h-full transition-all duration-500 ease-out"
                  style={{
                    width: `${skill.matchScore}%`,
                    backgroundColor: '#10B981',
                  }}
                />
              </div>

              {/* Additional Info */}
              {(skill.proficiency || skill.yearsOfExperience) && (
                <div className="flex items-center gap-4 mt-2">
                  {skill.proficiency && (
                    <span className="text-[12px]" style={{ color: '#6B7280' }}>
                      Level: <span className="font-medium capitalize">{skill.proficiency}</span>
                    </span>
                  )}
                  {skill.yearsOfExperience && (
                    <span className="text-[12px]" style={{ color: '#6B7280' }}>
                      Experience: <span className="font-medium">{skill.yearsOfExperience} years</span>
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
