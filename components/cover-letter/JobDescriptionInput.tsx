/**
 * Job Description Input Component
 * Large text area for pasting job description
 */

'use client';

import { X } from 'lucide-react';

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

export default function JobDescriptionInput({
  value,
  onChange,
  onClear,
}: JobDescriptionInputProps) {
  const charCount = value.length;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-[14px] font-semibold" style={{ color: '#1A1F2E' }}>
          Job Description
        </label>
        {value && (
          <button
            type="button"
            onClick={onClear}
            className="text-[12px] flex items-center gap-1 hover:opacity-70 transition-opacity"
            style={{ color: '#6B7280' }}
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste the full job description here... Include job title, responsibilities, requirements, etc."
        className="w-full rounded-xl border-2 p-5 text-[16px] leading-relaxed resize-none transition-all duration-300 focus:outline-none"
        style={{
          minHeight: '300px',
          backgroundColor: '#FFFFFF',
          borderColor: value ? '#D4A574' : '#E5E7EB',
          color: '#0F1419',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#D4A574';
          e.target.style.boxShadow = '0 0 0 3px rgba(212, 165, 116, 0.1)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = value ? '#D4A574' : '#E5E7EB';
          e.target.style.boxShadow = 'none';
        }}
      />

      <div className="flex items-center justify-between">
        <p className="text-[12px]" style={{ color: '#9CA3AF' }}>
          Include job title, key responsibilities, and required skills for best results
        </p>
        <p className="text-[12px]" style={{ color: '#6B7280' }}>
          {charCount.toLocaleString()} characters
        </p>
      </div>
    </div>
  );
}
