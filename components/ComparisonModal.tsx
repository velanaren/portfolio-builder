/**
 * ComparisonModal Component
 * Shows original vs AI-rewritten content for comparison
 */

'use client';

import { X, Check } from 'lucide-react';

interface ComparisonModalProps {
  isOpen: boolean;
  original: string;
  rewritten: string;
  onAccept: () => void;
  onReject: () => void;
  onClose: () => void;
}

export default function ComparisonModal({
  isOpen,
  original,
  rewritten,
  onAccept,
  onReject,
  onClose,
}: ComparisonModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB]">
          <h3 className="text-[20px] font-semibold text-[#0F1419] tracking-[-0.5px]">
            AI Enhancement Suggestion
          </h3>
          <button
            onClick={onClose}
            className="text-[#6B7280] hover:text-[#0F1419] transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Original */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-[14px] font-semibold text-[#6B7280] uppercase tracking-wide">
                  Original
                </h4>
              </div>
              <div className="bg-[#F8FAFB] border border-[#E5E7EB] rounded-lg p-4">
                <p className="text-[14px] text-[#6B7280] leading-relaxed opacity-70 whitespace-pre-wrap">
                  {original}
                </p>
              </div>
            </div>

            {/* Rewritten */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-[14px] font-semibold text-[#D4A574] uppercase tracking-wide">
                  AI Suggested ✨
                </h4>
              </div>
              <div className="bg-[#FFFBF7] border-2 border-[#D4A574] rounded-lg p-4">
                <p className="text-[14px] text-[#0F1419] leading-relaxed whitespace-pre-wrap">
                  {rewritten}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-[#E5E7EB] bg-[#F8FAFB]">
          <button
            onClick={onReject}
            className="px-6 py-2.5 rounded-lg bg-white border border-[#E5E7EB] text-[#0F1419] text-[14px] font-semibold transition-all duration-300 hover:bg-[#F8FAFB] hover:border-[#6B7280]"
          >
            <X className="h-4 w-4 inline mr-2" />
            Reject
          </button>
          <button
            onClick={onAccept}
            className="px-6 py-2.5 rounded-lg bg-[#D4A574] text-[#0F1419] text-[14px] font-semibold transition-all duration-300 hover:bg-[#C89850] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#D4A574]/30"
          >
            <Check className="h-4 w-4 inline mr-2" />
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
