/**
 * Professional Summary Section
 * With AI enhancement capability
 */

'use client';

import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import ComparisonModal from '../ComparisonModal';

interface SummarySectionProps {
  summary: string;
  onChange: (value: string) => void;
}

export default function SummarySection({ summary, onChange }: SummarySectionProps) {
  const [isRewriting, setIsRewriting] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [rewrittenText, setRewrittenText] = useState('');
  const maxLength = 500;

  const handleEnhance = async () => {
    if (!summary || summary.trim().length === 0) {
      alert('Please write a summary first');
      return;
    }

    setIsRewriting(true);

    try {
      const response = await fetch('/api/rewrite-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: summary,
          type: 'summary',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setRewrittenText(data.rewritten);
        setShowComparison(true);
      } else {
        alert('Failed to enhance summary. Please try again.');
      }
    } catch (error) {
      console.error('Error enhancing summary:', error);
      alert('Failed to enhance summary. Please try again.');
    } finally {
      setIsRewriting(false);
    }
  };

  const handleAccept = () => {
    onChange(rewrittenText);
    setShowComparison(false);
  };

  const handleReject = () => {
    setShowComparison(false);
  };

  return (
    <>
      <section className="mb-10">
        <div className="mb-6">
          <h2 className="text-[20px] font-semibold text-[#0F1419] tracking-[-0.5px] pb-2 border-b-2 border-[#D4A574]">
            Professional Summary
          </h2>
          <p className="text-[12px] text-[#6B7280] mt-2">
            2-3 sentences about your background and key achievements
          </p>
        </div>

        <div>
          <textarea
            value={summary}
            onChange={(e) => onChange(e.target.value)}
            maxLength={maxLength}
            rows={6}
            className="w-full rounded-lg bg-[#F8FAFB] px-4 py-3 text-[14px] text-[#0F1419] border border-[#E5E7EB] focus:bg-white focus:border-[#D4A574] focus:ring-2 focus:ring-[#D4A574]/20 transition-all duration-300 outline-none resize-none leading-relaxed"
            placeholder="Write a compelling summary that highlights your experience, skills, and what makes you unique..."
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-[12px] text-[#6B7280]">
              {summary.length}/{maxLength}
            </span>
            <button
              onClick={handleEnhance}
              disabled={isRewriting || !summary}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#D4A574] text-[#0F1419] text-[14px] font-semibold transition-all duration-300 hover:bg-[#C89850] hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {isRewriting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Rewriting...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Enhance with AI</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      <ComparisonModal
        isOpen={showComparison}
        original={summary}
        rewritten={rewrittenText}
        onAccept={handleAccept}
        onReject={handleReject}
        onClose={handleReject}
      />
    </>
  );
}
