/**
 * Generate Button Component
 * Primary button to generate cover letter
 */

'use client';

import { Loader2, Sparkles } from 'lucide-react';

interface GenerateButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export default function GenerateButton({
  onClick,
  isLoading,
  disabled = false,
}: GenerateButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className="w-full lg:w-auto px-8 py-4 rounded-xl font-bold text-[16px] transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        backgroundColor: isDisabled ? '#D1D5DB' : '#D4A574',
        color: '#0F1419',
      }}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="w-5 h-5" />
          Generate Cover Letter
        </>
      )}
    </button>
  );
}
