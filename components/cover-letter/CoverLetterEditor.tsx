/**
 * Cover Letter Editor Component
 * Editable textarea for generated cover letter with counts
 */

'use client';

import { useEffect, useState } from 'react';

interface CoverLetterEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function CoverLetterEditor({
  value,
  onChange,
  placeholder = 'Generated cover letter will appear here...',
}: CoverLetterEditorProps) {
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    // Update counts
    const words = value.trim().split(/\s+/).filter(w => w.length > 0);
    setWordCount(words.length);
    setCharCount(value.length);
  }, [value]);

  return (
    <div className="space-y-2">
      <label className="block text-[14px] font-semibold" style={{ color: '#1A1F2E' }}>
        Cover Letter
      </label>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border-2 p-5 text-[14px] leading-relaxed resize-none transition-all duration-300 focus:outline-none"
        style={{
          minHeight: '500px',
          backgroundColor: '#FFFFFF',
          borderColor: '#E5E7EB',
          color: '#0F1419',
          lineHeight: '1.6',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#D4A574';
          e.target.style.boxShadow = '0 0 0 3px rgba(212, 165, 116, 0.1)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = '#E5E7EB';
          e.target.style.boxShadow = 'none';
        }}
      />

      <div className="flex items-center justify-between text-[12px]" style={{ color: '#6B7280' }}>
        <span>
          Word Count: <strong>{wordCount.toLocaleString()}</strong> |
          Character Count: <strong>{charCount.toLocaleString()}</strong>
        </span>
      </div>
    </div>
  );
}
