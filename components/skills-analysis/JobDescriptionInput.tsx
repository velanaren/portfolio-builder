/**
 * JobDescriptionInput Component
 * Input field for job description with analytics button
 */

'use client';

import { useState } from 'react';
import { Briefcase, X } from 'lucide-react';

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  disabled?: boolean;
}

export default function JobDescriptionInput({
  value,
  onChange,
  onAnalyze,
  isAnalyzing,
  disabled = false,
}: JobDescriptionInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    onChange('');
  };

  const charCount = value.length;
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Briefcase className="w-5 h-5" style={{ color: '#D4A574' }} />
        <h3 className="text-[20px] font-semibold" style={{ color: '#1A1F2E' }}>
          Job Description
        </h3>
      </div>

      {/* Helper Text */}
      <p className="text-[14px] mb-4" style={{ color: '#6B7280' }}>
        Paste the full job description here. Include job title, responsibilities, required and preferred skills.
      </p>

      {/* Textarea */}
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled || isAnalyzing}
          placeholder="Paste job description here...

Example:
Senior Full Stack Developer

We are looking for an experienced Full Stack Developer with strong skills in:
- React and Node.js
- TypeScript
- PostgreSQL and MongoDB
- AWS cloud services
- Docker and Kubernetes

Responsibilities include..."
          className={`
            w-full rounded-xl border-2 transition-all duration-300 resize-none
            ${isFocused ? 'border-[#D4A574] ring-2 ring-[#D4A574] ring-opacity-20' : 'border-[#E5E7EB]'}
            ${disabled || isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          style={{
            padding: '20px',
            minHeight: '350px',
            fontSize: '16px',
            lineHeight: '1.6',
            fontFamily: 'inherit',
            backgroundColor: '#FFFFFF',
            color: '#1A1F2E',
          }}
        />

        {/* Clear Button */}
        {value && !isAnalyzing && (
          <button
            onClick={handleClear}
            className="absolute top-4 right-4 p-2 rounded-lg transition-all duration-200 hover:bg-[#F8FAFB]"
            style={{ color: '#6B7280' }}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Character/Word Count and Analyze Button */}
      <div className="flex items-center justify-between mt-3">
        <div className="text-[12px]" style={{ color: '#9CA3AF' }}>
          {wordCount} words • {charCount} characters
        </div>

        <button
          onClick={onAnalyze}
          disabled={!value.trim() || isAnalyzing || disabled}
          className={`
            px-6 py-3 rounded-xl font-semibold text-[14px] transition-all duration-300
            ${
              !value.trim() || isAnalyzing || disabled
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:scale-105 hover:shadow-lg'
            }
          `}
          style={{
            backgroundColor: '#D4A574',
            color: '#FFFFFF',
          }}
        >
          {isAnalyzing ? (
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"
              />
              <span>Analyzing...</span>
            </div>
          ) : (
            'Analyze Skills Match'
          )}
        </button>
      </div>

      {/* Info Box */}
      {!value && (
        <div className="mt-4 rounded-lg p-4" style={{ backgroundColor: '#F8FAFB' }}>
          <p className="text-[12px] font-semibold mb-2" style={{ color: '#1A1F2E' }}>
            For best results, include:
          </p>
          <ul className="space-y-1">
            <li className="text-[12px]" style={{ color: '#6B7280' }}>
              • Job title and seniority level
            </li>
            <li className="text-[12px]" style={{ color: '#6B7280' }}>
              • Required technical skills and technologies
            </li>
            <li className="text-[12px]" style={{ color: '#6B7280' }}>
              • Preferred qualifications and nice-to-have skills
            </li>
            <li className="text-[12px]" style={{ color: '#6B7280' }}>
              • Years of experience required
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
