/**
 * MatchScoreCard Component
 * Displays the overall skills match percentage with animation
 */

'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';

interface MatchScoreCardProps {
  matchPercentage: number;
  summary: string;
}

export default function MatchScoreCard({ matchPercentage, summary }: MatchScoreCardProps) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  // Animate percentage from 0 to final value
  useEffect(() => {
    let start = 0;
    const duration = 800; // 800ms animation
    const increment = matchPercentage / (duration / 16); // 60fps

    const timer = setInterval(() => {
      start += increment;
      if (start >= matchPercentage) {
        setAnimatedPercentage(matchPercentage);
        clearInterval(timer);
      } else {
        setAnimatedPercentage(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [matchPercentage]);

  // Determine color and icon based on match percentage
  const getMatchColor = () => {
    if (matchPercentage >= 80) return { bg: '#ECFDF5', text: '#065F46', accent: '#10B981' };
    if (matchPercentage >= 60) return { bg: '#FEF3C7', text: '#92400E', accent: '#D4A574' };
    if (matchPercentage >= 40) return { bg: '#FEF3C7', text: '#92400E', accent: '#F97316' };
    return { bg: '#FEF2F2', text: '#991B1B', accent: '#EF4444' };
  };

  const getMatchLabel = () => {
    if (matchPercentage >= 80) return 'Excellent Match!';
    if (matchPercentage >= 60) return 'Good Match';
    if (matchPercentage >= 40) return 'Moderate Match';
    return 'Needs Improvement';
  };

  const getMatchIcon = () => {
    if (matchPercentage >= 80) return <CheckCircle className="w-6 h-6" />;
    if (matchPercentage >= 60) return <TrendingUp className="w-6 h-6" />;
    if (matchPercentage >= 40) return <AlertTriangle className="w-6 h-6" />;
    return <AlertCircle className="w-6 h-6" />;
  };

  const colors = getMatchColor();

  return (
    <div
      className="rounded-xl shadow-sm border p-8"
      style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}
    >
      <div className="flex flex-col lg:flex-row items-center gap-8">
        {/* Left: Circular Progress */}
        <div className="flex-shrink-0">
          <div className="relative" style={{ width: '180px', height: '180px' }}>
            {/* Background Circle */}
            <svg className="transform -rotate-90" width="180" height="180">
              <circle
                cx="90"
                cy="90"
                r="75"
                stroke="#E5E7EB"
                strokeWidth="12"
                fill="none"
              />
              {/* Progress Circle */}
              <circle
                cx="90"
                cy="90"
                r="75"
                stroke={colors.accent}
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 75}`}
                strokeDashoffset={`${2 * Math.PI * 75 * (1 - animatedPercentage / 100)}`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.3s ease' }}
              />
            </svg>

            {/* Percentage Text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div
                  className="text-[48px] font-bold leading-none"
                  style={{ color: colors.accent }}
                >
                  {animatedPercentage}%
                </div>
                <div className="text-[14px] mt-1" style={{ color: '#6B7280' }}>
                  Match
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Details */}
        <div className="flex-1 text-center lg:text-left">
          {/* Match Label */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg mb-4"
            style={{ backgroundColor: colors.bg }}
          >
            <span style={{ color: colors.accent }}>{getMatchIcon()}</span>
            <span className="text-[16px] font-semibold" style={{ color: colors.text }}>
              {getMatchLabel()}
            </span>
          </div>

          {/* Summary */}
          <p className="text-[16px] leading-relaxed" style={{ color: '#1A1F2E' }}>
            {summary}
          </p>

          {/* Tips based on match percentage */}
          <div className="mt-4">
            {matchPercentage >= 80 && (
              <p className="text-[14px]" style={{ color: '#6B7280' }}>
                You're a strong candidate! Consider highlighting your matching skills in your application.
              </p>
            )}
            {matchPercentage >= 60 && matchPercentage < 80 && (
              <p className="text-[14px]" style={{ color: '#6B7280' }}>
                You have most required skills. Focus on the missing skills to strengthen your application.
              </p>
            )}
            {matchPercentage >= 40 && matchPercentage < 60 && (
              <p className="text-[14px]" style={{ color: '#6B7280' }}>
                Consider upskilling in the missing areas or emphasizing your transferable skills.
              </p>
            )}
            {matchPercentage < 40 && (
              <p className="text-[14px]" style={{ color: '#6B7280' }}>
                This role requires significant additional skills. Review the recommendations for upskilling.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
