/**
 * PDF Preview Modal Component
 * Shows preview of cover letter PDF before download
 */

'use client';

import { X, Download } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { generateCoverLetterPDF, getCoverLetterFilename } from '@/lib/coverLetterPDF';

interface PDFPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  coverLetter: string;
  personalInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

export default function PDFPreviewModal({
  isOpen,
  onClose,
  coverLetter,
  personalInfo,
}: PDFPreviewModalProps) {
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDownload = () => {
    const pdf = generateCoverLetterPDF({ coverLetter, personalInfo });
    const filename = getCoverLetterFilename(personalInfo.name);
    pdf.save(filename);
    onClose();
  };

  // Format date
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Split into paragraphs
  const paragraphs = coverLetter.split('\n\n').filter(p => p.trim());

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300"
        onClick={onClose}
        style={{ animation: 'fadeIn 300ms ease-in' }}
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ animation: 'slideUp 300ms ease-out' }}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: '#E5E7EB' }}>
            <h2 className="text-[20px] font-bold" style={{ color: '#1A1F2E' }}>
              Cover Letter Preview
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" style={{ color: '#6B7280' }} />
            </button>
          </div>

          {/* Preview Content */}
          <div
            ref={previewRef}
            className="flex-1 overflow-y-auto p-8"
            style={{ backgroundColor: '#F8FAFB' }}
          >
            <div
              className="bg-white shadow-sm rounded-lg p-12 mx-auto"
              style={{
                maxWidth: '650px',
                fontFamily: 'Georgia, serif',
                lineHeight: '1.6',
              }}
            >
              {/* Date */}
              <div className="text-right mb-8 text-[11pt]" style={{ color: '#0F1419' }}>
                {today}
              </div>

              {/* Recipient */}
              <div className="mb-8 text-[11pt]" style={{ color: '#0F1419' }}>
                To the Hiring Manager,
              </div>

              {/* Body */}
              <div className="space-y-4 text-[11pt]" style={{ color: '#0F1419' }}>
                {paragraphs.map((paragraph, idx) => (
                  <p key={idx} className="text-justify">
                    {paragraph.trim()}
                  </p>
                ))}
              </div>

              {/* Closing */}
              <div className="mt-8 text-[11pt]" style={{ color: '#0F1419' }}>
                <p className="mb-4">Sincerely,</p>
                <p className="font-semibold">{personalInfo.name}</p>
                <p className="text-[10pt]">{personalInfo.phone}</p>
                <p className="text-[10pt]">{personalInfo.email}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t" style={{ borderColor: '#E5E7EB' }}>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg font-semibold text-[14px] transition-colors"
              style={{
                backgroundColor: '#F3F4F6',
                color: '#1A1F2E',
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="px-6 py-2.5 rounded-lg font-semibold text-[14px] transition-all flex items-center gap-2 hover:shadow-md"
              style={{
                backgroundColor: '#D4A574',
                color: '#0F1419',
              }}
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
