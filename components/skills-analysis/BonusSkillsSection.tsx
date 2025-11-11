/**
 * BonusSkillsSection Component
 * Displays skills the candidate has but the job doesn't require
 */

'use client';

import { Star, Award } from 'lucide-react';
import { BonusSkill } from '@/types';

interface BonusSkillsSectionProps {
  skills: BonusSkill[];
}

export default function BonusSkillsSection({ skills }: BonusSkillsSectionProps) {
  const getRelevanceBadge = (relevance: string) => {
    if (relevance === 'highly-relevant')
      return { bg: '#FEF3C7', text: '#92400E', label: 'Highly Relevant' };
    if (relevance === 'somewhat-relevant')
      return { bg: '#DBEAFE', text: '#1E40AF', label: 'Somewhat Relevant' };
    return { bg: '#F3F4F6', text: '#4B5563', label: 'Tangential' };
  };

  if (skills.length === 0) {
    return null; // Don't show section if no bonus skills
  }

  return (
    <div
      className="rounded-xl border"
      style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}
    >
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: '#E5E7EB' }}>
        <div className="flex items-center gap-2 mb-1">
          <Star className="w-5 h-5" style={{ color: '#D4A574' }} />
          <h3 className="text-[20px] font-semibold" style={{ color: '#1A1F2E' }}>
            Your Bonus Skills
          </h3>
        </div>
        <p className="text-[14px]" style={{ color: '#6B7280' }}>
          {skills.length} additional {skills.length === 1 ? 'skill' : 'skills'} you bring to the role
        </p>
      </div>

      {/* Skills List */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.map((skill, index) => {
            const badgeData = getRelevanceBadge(skill.relevance);

            return (
              <div
                key={index}
                className="border rounded-lg p-4"
                style={{ borderColor: '#E5E7EB' }}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
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

                  {skill.relevance === 'highly-relevant' && (
                    <Award className="w-5 h-5 flex-shrink-0" style={{ color: '#D4A574' }} />
                  )}
                </div>

                {/* Relevance Badge */}
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className="px-2.5 py-1 rounded-full text-[11px] font-semibold"
                    style={{
                      backgroundColor: badgeData.bg,
                      color: badgeData.text,
                    }}
                  >
                    {badgeData.label}
                  </span>
                </div>

                {/* Proficiency and Experience */}
                {(skill.proficiency || skill.yearsOfExperience) && (
                  <div className="flex items-center gap-3 text-[12px]" style={{ color: '#6B7280' }}>
                    {skill.proficiency && (
                      <span>
                        <span className="font-medium capitalize">{skill.proficiency}</span>
                      </span>
                    )}
                    {skill.yearsOfExperience && (
                      <span>• {skill.yearsOfExperience} years</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Tip */}
        <div className="mt-6 rounded-lg p-4" style={{ backgroundColor: '#FEF3C7' }}>
          <p className="text-[12px] font-semibold mb-1" style={{ color: '#92400E' }}>
            💡 Pro Tip
          </p>
          <p className="text-[12px]" style={{ color: '#92400E' }}>
            Highlight your bonus skills in your cover letter or interview to demonstrate additional value you bring to the role.
          </p>
        </div>
      </div>
    </div>
  );
}
