/**
 * Professional Summary Section
 * With AI enhancement capability (auto-apply)
 */

'use client';

import { useState } from 'react';
import { Sparkles, Loader2, Check } from 'lucide-react';

interface SummarySectionProps {
  summary: string;
  onChange: (value: string) => void;
}

export default function SummarySection({ summary, onChange }: SummarySectionProps) {
  const [isRewriting, setIsRewriting] = useState(false);
  const [enhanceStatus, setEnhanceStatus] = useState<'success' | 'error' | null>(null);
  const maxLength = 500;

  const handleEnhance = async () => {
    if (!summary || summary.trim().length === 0) {
      alert('Please write a summary first');
      return;
    }

    setIsRewriting(true);
    setEnhanceStatus(null);

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
        // Auto-apply: directly update the field
        onChange(data.rewritten);

        // Show success feedback
        setEnhanceStatus('success');

        // Clear success message after 1.5 seconds
        setTimeout(() => {
          setEnhanceStatus(null);
        }, 1500);
      } else {
        setEnhanceStatus('error');
        setTimeout(() => {
          setEnhanceStatus(null);
        }, 2000);
      }
    } catch (error) {
      console.error('Error enhancing summary:', error);
      setEnhanceStatus('error');
      setTimeout(() => {
        setEnhanceStatus(null);
      }, 2000);
    } finally {
      setIsRewriting(false);
    }
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
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-[14px] font-semibold transition-all duration-300 disabled:cursor-not-allowed ${
                enhanceStatus === 'success'
                  ? 'bg-green-500 text-white'
                  : enhanceStatus === 'error'
                  ? 'bg-red-500 text-white'
                  : 'bg-[#D4A574] text-[#0F1419] hover:bg-[#C89850] hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50 disabled:hover:translate-y-0'
              }`}
            >
              {isRewriting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Enhancing...</span>
                </>
              ) : enhanceStatus === 'success' ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Enhanced!</span>
                </>
              ) : enhanceStatus === 'error' ? (
                <>
                  <span>✕</span>
                  <span>Failed</span>
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
    </>
  );
}
