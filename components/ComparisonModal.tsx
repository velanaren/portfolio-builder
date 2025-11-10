/**
 * ComparisonModal Component
 * Shows original vs AI-rewritten content for comparison
 *
 * FEATURES:
 * - Fixed positioning (centered on viewport, not page)
 * - Semi-transparent backdrop overlay
 * - Click outside to close
 * - Escape key to close
 * - Smooth animations
 * - Mobile responsive
 */

'use client';

import { X, Check } from 'lucide-react';
import { useEffect } from 'react';

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
  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Handle click on backdrop (outside modal) to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    // Backdrop overlay - covers entire viewport with semi-transparent background
    // Fixed positioning ensures it's always visible regardless of scroll position
    // z-[1000] ensures it appears above everything else
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4 animate-fade-in"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Modal container - centered both horizontally and vertically */}
      {/* Animation: fade-in + scale from 95% to 100% */}
      <div
        className="bg-white rounded-xl w-full max-w-[600px] md:max-w-4xl max-h-[90vh] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.3)] animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-[#E5E7EB]">
          <h3
            id="modal-title"
            className="text-[18px] md:text-[20px] font-semibold text-[#0F1419] tracking-[-0.5px]"
          >
            AI Enhancement Suggestion
          </h3>
          <button
            onClick={onClose}
            className="text-[#6B7280] hover:text-[#0F1419] transition-colors duration-200 p-1"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content - scrollable if content is too long */}
        <div className="p-4 md:p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Desktop: Side-by-side comparison */}
          {/* Mobile: Stacked comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Original Text */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-[12px] md:text-[14px] font-semibold text-[#6B7280] uppercase tracking-wide">
                  Original
                </h4>
              </div>
              <div className="bg-[#F8FAFB] border border-[#E5E7EB] rounded-lg p-4 min-h-[100px]">
                <p className="text-[13px] md:text-[14px] text-[#6B7280] leading-relaxed opacity-70 whitespace-pre-wrap">
                  {original}
                </p>
              </div>
            </div>

            {/* AI Suggested Text - highlighted with gold */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-[12px] md:text-[14px] font-semibold text-[#D4A574] uppercase tracking-wide">
                  AI Suggested ✨
                </h4>
              </div>
              <div className="bg-[#FFFBF7] border-2 border-[#D4A574] rounded-lg p-4 min-h-[100px]">
                <p className="text-[13px] md:text-[14px] text-[#0F1419] leading-relaxed whitespace-pre-wrap">
                  {rewritten}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with action buttons */}
        {/* Mobile: Stacked buttons, Desktop: Side-by-side */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-end gap-3 p-4 md:p-6 border-t border-[#E5E7EB] bg-[#F8FAFB]">
          <button
            onClick={onReject}
            className="w-full md:w-auto px-6 py-2.5 rounded-lg bg-white border border-[#E5E7EB] text-[#0F1419] text-[14px] font-semibold transition-all duration-300 hover:bg-[#F8FAFB] hover:border-[#6B7280] order-2 md:order-1"
          >
            <X className="h-4 w-4 inline mr-2" />
            Reject
          </button>
          <button
            onClick={onAccept}
            className="w-full md:w-auto px-6 py-2.5 rounded-lg bg-[#D4A574] text-[#0F1419] text-[14px] font-semibold transition-all duration-300 hover:bg-[#C89850] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#D4A574]/30 order-1 md:order-2"
          >
            <Check className="h-4 w-4 inline mr-2" />
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
