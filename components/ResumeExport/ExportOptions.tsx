/**
 * Export Options Component
 * Left column with format selection, theme selection, filename input
 */

'use client';

import { ParsedResume } from '@/types';
import { Edit2, Download, Loader2, Check, AlertCircle, FileText, Briefcase, GraduationCap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ExportFormat, ColorTheme } from '@/app/(protected)/resume-editor/export/page';

interface ExportOptionsProps {
  resume: ParsedResume;
  format: ExportFormat;
  theme: ColorTheme;
  filename: string;
  onFormatChange: (format: ExportFormat) => void;
  onThemeChange: (theme: ColorTheme) => void;
  onFilenameChange: (filename: string) => void;
  onDownload: () => void;
  isDownloading: boolean;
  downloadStatus: 'idle' | 'success' | 'error';
}

export default function ExportOptions({
  resume,
  format,
  theme,
  filename,
  onFormatChange,
  onThemeChange,
  onFilenameChange,
  onDownload,
  isDownloading,
  downloadStatus
}: ExportOptionsProps) {
  const router = useRouter();

  const formatOptions = [
    {
      id: 'ats' as ExportFormat,
      name: 'ATS-Optimized',
      description: 'Clean, ATS-scanner friendly format',
      features: ['Single column layout', 'No graphics or colors', 'Plain fonts', 'Easy to parse'],
      recommended: true
    },
    {
      id: 'modern' as ExportFormat,
      name: 'Modern Professional',
      description: 'Contemporary design with navy + gold',
      features: ['Professional styling', 'Navy and gold accents', 'Modern fonts', 'Great for human review']
    },
    {
      id: 'classic' as ExportFormat,
      name: 'Classic',
      description: 'Traditional business format',
      features: ['Serif fonts', 'Elegant layout', 'Timeless design', 'High-end feel']
    }
  ];

  const themeOptions = [
    {
      id: 'navy-gold' as ColorTheme,
      name: 'Navy + Gold',
      primaryColor: '#1A1F2E',
      accentColor: '#D4A574'
    },
    {
      id: 'dark-minimal' as ColorTheme,
      name: 'Dark Minimal',
      primaryColor: '#1F2937',
      accentColor: '#FFFFFF'
    },
    {
      id: 'blue-gold' as ColorTheme,
      name: 'Professional Blue',
      primaryColor: '#6366F1',
      accentColor: '#D4A574'
    }
  ];

  // Calculate resume stats
  const yearsExp = resume.experience?.length || 0;
  const skillsCount = resume.skills?.length || 0;
  const projectsCount = resume.projects?.length || 0;

  return (
    <div className="space-y-6">
      {/* Resume Summary Card */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 transition-all duration-300 hover:shadow-md">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-[20px] font-bold text-[#1A1F2E]">Your Resume</h2>
          <button
            onClick={() => router.push('/resume-editor/edit')}
            className="flex items-center gap-2 px-3 py-1.5 text-[13px] font-semibold text-[#6B7280] hover:text-[#1A1F2E] transition-colors duration-200"
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span>Edit</span>
          </button>
        </div>

        <div className="space-y-2">
          <h3 className="text-[16px] font-bold text-[#0F1419]">
            {resume.personalInfo?.name || 'No name provided'}
          </h3>

          {resume.summary && (
            <p className="text-[14px] text-[#6B7280] line-clamp-2">
              {resume.summary}
            </p>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            {resume.personalInfo?.email && (
              <span className="text-[12px] text-[#6B7280]">
                {resume.personalInfo.email}
              </span>
            )}
            {resume.personalInfo?.location && (
              <span className="text-[12px] text-[#6B7280]">
                • {resume.personalInfo.location}
              </span>
            )}
          </div>

          <div className="flex gap-4 pt-3 border-t border-[#E5E7EB] mt-3">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-[#D4A574]" />
              <span className="text-[12px] text-[#6B7280]">{yearsExp} experiences</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#D4A574]" />
              <span className="text-[12px] text-[#6B7280]">{skillsCount} skills</span>
            </div>
            {projectsCount > 0 && (
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-[#D4A574]" />
                <span className="text-[12px] text-[#6B7280]">{projectsCount} projects</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Export Format Selection */}
      <div>
        <h2 className="text-[16px] font-bold text-[#1A1F2E] mb-3">Export Format</h2>
        <div className="space-y-3">
          {formatOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => onFormatChange(option.id)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                format === option.id
                  ? 'border-[#D4A574] bg-[#FFFBF7] shadow-md'
                  : 'border-[#E5E7EB] bg-white hover:border-[#D4A574] hover:shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-[14px] font-bold text-[#0F1419]">{option.name}</h3>
                    {option.recommended && (
                      <span className="px-2 py-0.5 bg-[#D4A574] text-white text-[10px] font-semibold rounded uppercase">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-[#6B7280] mt-1">{option.description}</p>
                </div>
                {format === option.id && (
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#D4A574] flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
              <ul className="space-y-1 mt-3">
                {option.features.map((feature, idx) => (
                  <li key={idx} className="text-[11px] text-[#6B7280] flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[#D4A574]"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>
      </div>

      {/* Color Theme Selection - Only show for non-ATS formats */}
      {format !== 'ats' && (
        <div>
          <h2 className="text-[16px] font-bold text-[#1A1F2E] mb-3">Color Theme</h2>
          <div className="flex gap-4">
            {themeOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => onThemeChange(option.id)}
                className="flex flex-col items-center gap-2 group"
              >
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 ${
                    theme === option.id
                      ? 'ring-4 ring-[#D4A574] scale-105'
                      : 'ring-2 ring-[#E5E7EB] hover:ring-[#D4A574] hover:scale-105'
                  }`}
                  style={{ backgroundColor: option.primaryColor }}
                >
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: option.accentColor }}
                  ></div>
                </div>
                <span className={`text-[11px] font-semibold transition-colors duration-200 ${
                  theme === option.id ? 'text-[#D4A574]' : 'text-[#6B7280] group-hover:text-[#0F1419]'
                }`}>
                  {option.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filename Input */}
      <div>
        <label className="block text-[12px] font-bold text-[#0F1419] mb-2">
          Filename
        </label>
        <input
          type="text"
          value={filename}
          onChange={(e) => onFilenameChange(e.target.value)}
          className="w-full px-4 py-3 bg-[#F8FAFB] border border-[#E5E7EB] rounded-lg text-[14px] text-[#0F1419] transition-all duration-200 focus:bg-white focus:border-[#D4A574] focus:ring-2 focus:ring-[#D4A574]/20 outline-none"
          placeholder="FirstName_LastName_Resume"
        />
        <p className="text-[11px] text-[#6B7280] mt-2">
          PDF will be named: <span className="font-semibold text-[#0F1419]">{filename}.pdf</span>
        </p>
      </div>

      {/* Download Button (Mobile) */}
      <div className="lg:hidden">
        <button
          onClick={onDownload}
          disabled={isDownloading}
          className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-semibold text-[14px] transition-all duration-300 ${
            downloadStatus === 'success'
              ? 'bg-green-500 text-white'
              : downloadStatus === 'error'
              ? 'bg-red-500 text-white'
              : 'bg-[#D4A574] text-[#1A1F2E] hover:bg-[#C89850] hover:-translate-y-0.5 hover:shadow-md'
          } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0`}
        >
          {isDownloading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Generating PDF...</span>
            </>
          ) : downloadStatus === 'success' ? (
            <>
              <Check className="h-5 w-5" />
              <span>Downloaded!</span>
            </>
          ) : downloadStatus === 'error' ? (
            <>
              <AlertCircle className="h-5 w-5" />
              <span>Error</span>
            </>
          ) : (
            <>
              <Download className="h-5 w-5" />
              <span>Download PDF</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
