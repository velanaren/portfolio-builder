/**
 * MissingSkillsSection Component
 * Displays skills the candidate is missing for the job
 */

'use client';

import { AlertCircle, Clock, BarChart3 } from 'lucide-react';
import { MissingSkill } from '@/types';

interface MissingSkillsSectionProps {
  skills: MissingSkill[];
}

export default function MissingSkillsSection({ skills }: MissingSkillsSectionProps) {
  const getImportanceBadge = (importance: string) => {
    if (importance === 'required')
      return { bg: '#FEF2F2', text: '#991B1B', label: 'Required', icon: AlertCircle };
    if (importance === 'preferred')
      return { bg: '#FEF3C7', text: '#92400E', label: 'Preferred', icon: BarChart3 };
    return { bg: '#F3F4F6', text: '#4B5563', label: 'Nice-to-have', icon: Clock };
  };

  const getDifficultyColor = (difficulty: string) => {
    if (difficulty === 'beginner') return '#10B981';
    if (difficulty === 'intermediate') return '#F97316';
    return '#EF4444';
  };

  // Group skills by importance
  const requiredSkills = skills.filter((s) => s.importance === 'required');
  const preferredSkills = skills.filter((s) => s.importance === 'preferred');
  const niceToHaveSkills = skills.filter((s) => s.importance === 'nice-to-have');

  if (skills.length === 0) {
    return (
      <div
        className="rounded-xl border p-6"
        style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}
      >
        <div className="text-center py-8">
          <CheckCircle className="w-12 h-12 mx-auto mb-3" style={{ color: '#10B981' }} />
          <p className="text-[16px] font-semibold mb-1" style={{ color: '#1A1F2E' }}>
            No skill gaps identified!
          </p>
          <p className="text-[14px]" style={{ color: '#6B7280' }}>
            You have all the skills mentioned in the job description.
          </p>
        </div>
      </div>
    );
  }

  const SkillCard = ({ skill }: { skill: MissingSkill }) => {
    const badgeData = getImportanceBadge(skill.importance);
    const difficultyColor = getDifficultyColor(skill.difficulty);
    const BadgeIcon = badgeData.icon;

    return (
      <div
        className="border rounded-lg p-4"
        style={{ borderColor: '#E5E7EB' }}
      >
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1">
            <h4 className="text-[16px] font-semibold mb-1" style={{ color: '#1A1F2E' }}>
              {skill.name}
            </h4>
            {skill.category && (
              <p className="text-[12px]" style={{ color: '#6B7280' }}>
                {skill.category}
              </p>
            )}
          </div>

          {/* Importance Badge */}
          <span
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold whitespace-nowrap"
            style={{
              backgroundColor: badgeData.bg,
              color: badgeData.text,
            }}
          >
            <BadgeIcon className="w-3.5 h-3.5" />
            {badgeData.label}
          </span>
        </div>

        {/* Difficulty and Learning Time */}
        <div className="flex flex-wrap items-center gap-4 text-[12px]" style={{ color: '#6B7280' }}>
          <div className="flex items-center gap-1.5">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: difficultyColor }}
            />
            <span>
              Difficulty: <span className="font-medium capitalize">{skill.difficulty}</span>
            </span>
          </div>

          {skill.estimatedLearningTime && (
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>
                Learning time: <span className="font-medium">{skill.estimatedLearningTime}</span>
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className="rounded-xl border"
      style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}
    >
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: '#E5E7EB' }}>
        <div className="flex items-center gap-2 mb-1">
          <AlertCircle className="w-5 h-5" style={{ color: '#EF4444' }} />
          <h3 className="text-[20px] font-semibold" style={{ color: '#1A1F2E' }}>
            Skill Gaps
          </h3>
        </div>
        <p className="text-[14px]" style={{ color: '#6B7280' }}>
          {skills.length} {skills.length === 1 ? 'skill' : 'skills'} to learn for this role
        </p>
      </div>

      {/* Skills List */}
      <div className="p-6 space-y-6">
        {/* Required Skills */}
        {requiredSkills.length > 0 && (
          <div>
            <h4 className="text-[14px] font-semibold mb-3" style={{ color: '#991B1B' }}>
              Critical Skills ({requiredSkills.length})
            </h4>
            <div className="space-y-3">
              {requiredSkills.map((skill, index) => (
                <SkillCard key={index} skill={skill} />
              ))}
            </div>
          </div>
        )}

        {/* Preferred Skills */}
        {preferredSkills.length > 0 && (
          <div>
            <h4 className="text-[14px] font-semibold mb-3" style={{ color: '#92400E' }}>
              Preferred Skills ({preferredSkills.length})
            </h4>
            <div className="space-y-3">
              {preferredSkills.map((skill, index) => (
                <SkillCard key={index} skill={skill} />
              ))}
            </div>
          </div>
        )}

        {/* Nice-to-have Skills */}
        {niceToHaveSkills.length > 0 && (
          <div>
            <h4 className="text-[14px] font-semibold mb-3" style={{ color: '#4B5563' }}>
              Nice-to-have Skills ({niceToHaveSkills.length})
            </h4>
            <div className="space-y-3">
              {niceToHaveSkills.map((skill, index) => (
                <SkillCard key={index} skill={skill} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Import CheckCircle for the no-gaps state
import { CheckCircle } from 'lucide-react';
