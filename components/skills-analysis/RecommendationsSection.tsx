/**
 * RecommendationsSection Component
 * Displays upskilling recommendations based on skill gaps
 */

'use client';

import { Lightbulb, TrendingUp, Target, Clock } from 'lucide-react';

interface RecommendationsSectionProps {
  recommendations: string[];
}

export default function RecommendationsSection({ recommendations }: RecommendationsSectionProps) {
  if (recommendations.length === 0) {
    return (
      <div
        className="rounded-xl border p-6"
        style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}
      >
        <div className="text-center py-8">
          <TrendingUp className="w-12 h-12 mx-auto mb-3" style={{ color: '#10B981' }} />
          <p className="text-[16px] font-semibold mb-1" style={{ color: '#1A1F2E' }}>
            No recommendations needed!
          </p>
          <p className="text-[14px]" style={{ color: '#6B7280' }}>
            You're well-prepared for this role.
          </p>
        </div>
      </div>
    );
  }

  const getPriorityIcon = (index: number) => {
    if (index === 0 || index === 1) return <Target className="w-5 h-5" />;
    return <Clock className="w-5 h-5" />;
  };

  const getPriorityColor = (index: number) => {
    if (index === 0 || index === 1) return '#EF4444'; // High priority (red)
    if (index === 2 || index === 3) return '#F97316'; // Medium priority (orange)
    return '#6B7280'; // Lower priority (gray)
  };

  const getPriorityLabel = (index: number) => {
    if (index === 0 || index === 1) return 'HIGH PRIORITY';
    if (index === 2 || index === 3) return 'MEDIUM PRIORITY';
    return 'LOW PRIORITY';
  };

  return (
    <div
      className="rounded-xl border"
      style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}
    >
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: '#E5E7EB' }}>
        <div className="flex items-center gap-2 mb-1">
          <Lightbulb className="w-5 h-5" style={{ color: '#D4A574' }} />
          <h3 className="text-[20px] font-semibold" style={{ color: '#1A1F2E' }}>
            Upskilling Recommendations
          </h3>
        </div>
        <p className="text-[14px]" style={{ color: '#6B7280' }}>
          Prioritized learning path to strengthen your profile
        </p>
      </div>

      {/* Recommendations List */}
      <div className="p-6 space-y-4">
        {recommendations.map((recommendation, index) => {
          const priorityColor = getPriorityColor(index);
          const priorityLabel = getPriorityLabel(index);
          const PriorityIcon = () => getPriorityIcon(index);

          return (
            <div
              key={index}
              className="border rounded-lg p-5 transition-all duration-200 hover:shadow-md"
              style={{ borderColor: '#E5E7EB' }}
            >
              {/* Number and Priority */}
              <div className="flex items-start gap-4 mb-3">
                {/* Number Badge */}
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-[14px]"
                  style={{
                    backgroundColor: index < 2 ? '#FEF2F2' : index < 4 ? '#FEF3C7' : '#F3F4F6',
                    color: priorityColor,
                  }}
                >
                  {index + 1}
                </div>

                <div className="flex-1">
                  {/* Priority Badge */}
                  <div
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-2"
                    style={{
                      backgroundColor: index < 2 ? '#FEF2F2' : index < 4 ? '#FEF3C7' : '#F3F4F6',
                    }}
                  >
                    <span style={{ color: priorityColor }}>
                      <PriorityIcon />
                    </span>
                    <span
                      className="text-[11px] font-bold"
                      style={{ color: priorityColor }}
                    >
                      {priorityLabel}
                    </span>
                  </div>

                  {/* Recommendation Text */}
                  <p className="text-[15px] leading-relaxed" style={{ color: '#1A1F2E' }}>
                    {recommendation}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Tip */}
      <div className="px-6 pb-6">
        <div className="rounded-lg p-4" style={{ backgroundColor: '#F8FAFB' }}>
          <p className="text-[12px] font-semibold mb-2" style={{ color: '#1A1F2E' }}>
            💪 Next Steps
          </p>
          <ul className="space-y-1">
            <li className="text-[12px]" style={{ color: '#6B7280' }}>
              • Start with high-priority skills to maximize impact
            </li>
            <li className="text-[12px]" style={{ color: '#6B7280' }}>
              • Focus on required skills before nice-to-have ones
            </li>
            <li className="text-[12px]" style={{ color: '#6B7280' }}>
              • Use online courses, tutorials, and hands-on projects
            </li>
            <li className="text-[12px]" style={{ color: '#6B7280' }}>
              • Update your resume as you gain new skills
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
