/**
 * Empty State Component
 * Shows when no cover letter has been generated yet
 */

'use client';

import { FileText } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
        style={{ backgroundColor: '#F8FAFB' }}
      >
        <FileText className="w-8 h-8" style={{ color: '#D4A574' }} />
      </div>
      <h3
        className="text-[18px] font-bold mb-2"
        style={{ color: '#1A1F2E' }}
      >
        Generate Your Cover Letter
      </h3>
      <p className="text-[14px]" style={{ color: '#6B7280' }}>
        Enter a job description and click Generate to create
        <br />
        a personalized cover letter using your resume.
      </p>
    </div>
  );
}
