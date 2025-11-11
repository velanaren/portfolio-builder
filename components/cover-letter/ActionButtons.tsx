/**
 * Action Buttons Component
 * Copy, Regenerate, and Download PDF buttons
 */

'use client';

import { Copy, RefreshCw, Download } from 'lucide-react';
import toast from 'react-hot-toast';

interface ActionButtonsProps {
  coverLetter: string;
  onRegenerate: () => void;
  onDownloadPDF: () => void;
  isRegenerating: boolean;
  canRegenerate: boolean;
}

export default function ActionButtons({
  coverLetter,
  onRegenerate,
  onDownloadPDF,
  isRegenerating,
  canRegenerate,
}: ActionButtonsProps) {
  const hasCoverLetter = coverLetter.trim().length > 0;

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(coverLetter);
      toast.success('Cover letter copied to clipboard!', {
        duration: 3000,
        style: {
          background: '#10B981',
          color: '#FFFFFF',
        },
      });
    } catch (error) {
      toast.error('Failed to copy to clipboard', {
        duration: 3000,
      });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Copy to Clipboard */}
      <button
        type="button"
        onClick={handleCopyToClipboard}
        disabled={!hasCoverLetter}
        className="flex-1 px-5 py-3 rounded-xl font-semibold text-[14px] transition-all duration-300 flex items-center justify-center gap-2 border-2 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: '#F3F4F6',
          borderColor: '#E5E7EB',
          color: '#1A1F2E',
        }}
      >
        <Copy className="w-4 h-4" />
        Copy to Clipboard
      </button>

      {/* Regenerate */}
      {canRegenerate && (
        <button
          type="button"
          onClick={onRegenerate}
          disabled={!hasCoverLetter || isRegenerating}
          className="flex-1 px-5 py-3 rounded-xl font-semibold text-[14px] transition-all duration-300 flex items-center justify-center gap-2 border-2 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: '#F3F4F6',
            borderColor: '#E5E7EB',
            color: '#1A1F2E',
          }}
        >
          <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
          {isRegenerating ? 'Regenerating...' : 'Regenerate'}
        </button>
      )}

      {/* Download PDF */}
      <button
        type="button"
        onClick={onDownloadPDF}
        disabled={!hasCoverLetter}
        className="flex-1 px-5 py-3 rounded-xl font-semibold text-[14px] transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: hasCoverLetter ? '#D4A574' : '#D1D5DB',
          color: '#0F1419',
        }}
      >
        <Download className="w-4 h-4" />
        Download PDF
      </button>
    </div>
  );
}
