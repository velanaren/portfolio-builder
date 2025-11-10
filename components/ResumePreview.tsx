/**
 * Resume Preview Component
 * Shows live preview of resume with multiple themes
 */

'use client';

import { useState } from 'react';
import { ParsedResume } from '@/types';
import { Download, Maximize2, Printer } from 'lucide-react';

interface ResumePreviewProps {
  resume: ParsedResume;
}

type Theme = 'classic' | 'modern' | 'minimal';

export default function ResumePreview({ resume }: ResumePreviewProps) {
  const [theme, setTheme] = useState<Theme>('modern');

  const themes = {
    classic: {
      name: 'Classic',
      headerBg: '#000000',
      headerText: '#FFFFFF',
      sectionTitle: '#000000',
      bodyText: '#333333',
      accent: '#666666',
      font: 'serif',
    },
    modern: {
      name: 'Modern',
      headerBg: '#1A1F2E',
      headerText: '#FFFFFF',
      sectionTitle: '#1A1F2E',
      bodyText: '#0F1419',
      accent: '#D4A574',
      font: 'sans-serif',
    },
    minimal: {
      name: 'Minimal',
      headerBg: '#FFFFFF',
      headerText: '#000000',
      sectionTitle: '#000000',
      bodyText: '#333333',
      accent: '#CCCCCC',
      font: 'sans-serif',
    },
  };

  const currentTheme = themes[theme];

  return (
    <div className="sticky top-24">
      <div className="bg-[#F8FAFB] rounded-xl p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[18px] font-semibold text-[#0F1419] tracking-[-0.5px]">
            Resume Preview
          </h3>
        </div>

        {/* Theme Selector */}
        <div className="flex gap-2 mb-4 border-b border-[#E5E7EB]">
          {(Object.keys(themes) as Theme[]).map((themeKey) => (
            <button
              key={themeKey}
              onClick={() => setTheme(themeKey)}
              className={`px-4 py-2 text-[14px] font-semibold transition-all duration-200 border-b-2 ${
                theme === themeKey
                  ? 'text-[#D4A574] border-[#D4A574]'
                  : 'text-[#6B7280] border-transparent hover:text-[#0F1419]'
              }`}
            >
              {themes[themeKey].name}
            </button>
          ))}
        </div>

        {/* Preview Content */}
        <div
          className="bg-white border border-[#E5E7EB] rounded-lg p-6 min-h-[500px] max-h-[calc(100vh-340px)] overflow-y-auto"
          style={{ fontSize: '11px', fontFamily: currentTheme.font }}
        >
          {/* Header */}
          <div
            className="p-4 rounded-lg mb-4"
            style={{ backgroundColor: currentTheme.headerBg, color: currentTheme.headerText }}
          >
            <h1 className="text-xl font-bold mb-1">{resume.personalInfo.name}</h1>
            <div className="text-xs opacity-90">
              {resume.personalInfo.email && <span>{resume.personalInfo.email}</span>}
              {resume.personalInfo.phone && <span> • {resume.personalInfo.phone}</span>}
              {resume.personalInfo.location && <span> • {resume.personalInfo.location}</span>}
            </div>
            {(resume.personalInfo.linkedin || resume.personalInfo.website) && (
              <div className="text-xs opacity-80 mt-1">
                {resume.personalInfo.linkedin && <span>{resume.personalInfo.linkedin}</span>}
                {resume.personalInfo.website && resume.personalInfo.linkedin && <span> • </span>}
                {resume.personalInfo.website && <span>{resume.personalInfo.website}</span>}
              </div>
            )}
          </div>

          {/* Summary */}
          {resume.summary && (
            <div className="mb-4">
              <h2
                className="text-sm font-bold mb-2 pb-1 border-b"
                style={{ color: currentTheme.sectionTitle, borderColor: currentTheme.accent }}
              >
                Professional Summary
              </h2>
              <p className="text-xs italic leading-relaxed" style={{ color: currentTheme.bodyText }}>
                {resume.summary}
              </p>
            </div>
          )}

          {/* Experience */}
          {resume.experience && resume.experience.length > 0 && (
            <div className="mb-4">
              <h2
                className="text-sm font-bold mb-2 pb-1 border-b"
                style={{ color: currentTheme.sectionTitle, borderColor: currentTheme.accent }}
              >
                Work Experience
              </h2>
              {resume.experience.map((exp) => (
                <div key={exp.id} className="mb-3">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-xs font-bold" style={{ color: currentTheme.bodyText }}>
                      {exp.position}
                    </h3>
                    <span className="text-xs" style={{ color: currentTheme.accent }}>
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <p className="text-xs mb-1" style={{ color: currentTheme.accent }}>
                    {exp.company}
                  </p>
                  <p className="text-xs leading-relaxed whitespace-pre-wrap" style={{ color: currentTheme.bodyText }}>
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {resume.education && resume.education.length > 0 && (
            <div className="mb-4">
              <h2
                className="text-sm font-bold mb-2 pb-1 border-b"
                style={{ color: currentTheme.sectionTitle, borderColor: currentTheme.accent }}
              >
                Education
              </h2>
              {resume.education.map((edu) => (
                <div key={edu.id} className="mb-3">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-xs font-bold" style={{ color: currentTheme.bodyText }}>
                      {edu.degree} in {edu.field}
                    </h3>
                    <span className="text-xs" style={{ color: currentTheme.accent }}>
                      {edu.graduationDate}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: currentTheme.accent }}>
                    {edu.institution}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {resume.skills && resume.skills.length > 0 && (
            <div className="mb-4">
              <h2
                className="text-sm font-bold mb-2 pb-1 border-b"
                style={{ color: currentTheme.sectionTitle, borderColor: currentTheme.accent }}
              >
                Skills
              </h2>
              <div className="flex flex-wrap gap-1">
                {resume.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 rounded text-xs"
                    style={{
                      backgroundColor: `${currentTheme.accent}20`,
                      color: currentTheme.bodyText
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {resume.projects && resume.projects.length > 0 && (
            <div className="mb-4">
              <h2
                className="text-sm font-bold mb-2 pb-1 border-b"
                style={{ color: currentTheme.sectionTitle, borderColor: currentTheme.accent }}
              >
                Projects
              </h2>
              {resume.projects.map((project) => (
                <div key={project.id} className="mb-3">
                  <h3 className="text-xs font-bold mb-1" style={{ color: currentTheme.bodyText }}>
                    {project.name}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: currentTheme.bodyText }}>
                    {project.description}
                  </p>
                  {project.technologies && (
                    <p className="text-xs mt-1" style={{ color: currentTheme.accent }}>
                      Technologies: {project.technologies}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Certifications */}
          {resume.certifications && resume.certifications.length > 0 && (
            <div>
              <h2
                className="text-sm font-bold mb-2 pb-1 border-b"
                style={{ color: currentTheme.sectionTitle, borderColor: currentTheme.accent }}
              >
                Certifications
              </h2>
              {resume.certifications.map((cert) => (
                <div key={cert.id} className="mb-2">
                  <h3 className="text-xs font-bold" style={{ color: currentTheme.bodyText }}>
                    {cert.name}
                  </h3>
                  <p className="text-xs" style={{ color: currentTheme.accent }}>
                    {cert.issuer} • {cert.date}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Preview Controls */}
        <div className="flex gap-2 mt-4">
          <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white border border-[#E5E7EB] text-[#0F1419] text-[13px] font-semibold transition-all duration-300 hover:bg-[#F8FAFB]">
            <Download className="h-4 w-4" />
            <span>Download</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white border border-[#E5E7EB] text-[#0F1419] text-[13px] font-semibold transition-all duration-300 hover:bg-[#F8FAFB]">
            <Maximize2 className="h-4 w-4" />
            <span>Full Screen</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white border border-[#E5E7EB] text-[#0F1419] text-[13px] font-semibold transition-all duration-300 hover:bg-[#F8FAFB]">
            <Printer className="h-4 w-4" />
            <span>Print</span>
          </button>
        </div>
      </div>
    </div>
  );
}
