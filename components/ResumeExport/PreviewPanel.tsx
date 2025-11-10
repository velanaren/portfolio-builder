/**
 * Preview Panel Component
 * Right column with resume preview in selected format
 */

'use client';

import { ParsedResume } from '@/types';
import { ExportFormat, ColorTheme } from '@/app/(protected)/resume-editor/export/page';
import { Briefcase, GraduationCap, FolderOpen, Award } from 'lucide-react';

interface PreviewPanelProps {
  resume: ParsedResume;
  format: ExportFormat;
  theme: ColorTheme;
}

export default function PreviewPanel({ resume, format, theme }: PreviewPanelProps) {
  const getThemeColors = () => {
    switch (theme) {
      case 'navy-gold':
        return { primary: '#1A1F2E', accent: '#D4A574', text: '#0F1419' };
      case 'dark-minimal':
        return { primary: '#1F2937', accent: '#FFFFFF', text: '#000000' };
      case 'blue-gold':
        return { primary: '#6366F1', accent: '#D4A574', text: '#0F1419' };
      default:
        return { primary: '#1A1F2E', accent: '#D4A574', text: '#0F1419' };
    }
  };

  const colors = format === 'ats' ? { primary: '#000000', accent: '#000000', text: '#000000' } : getThemeColors();

  return (
    <div className="lg:sticky lg:top-24">
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[18px] font-bold text-[#1A1F2E]">PDF Preview</h2>
          <div className="flex gap-2">
            <span className="px-2 py-1 bg-[#F8FAFB] text-[11px] font-semibold text-[#6B7280] rounded">
              100%
            </span>
          </div>
        </div>

        {/* Preview Display */}
        <div className="border border-[#E5E7EB] rounded-lg overflow-hidden bg-white transition-all duration-300">
          <div id="resume-preview" className="p-8 min-h-[500px]" style={{ fontFamily: format === 'classic' ? 'Georgia, serif' : '-apple-system, BlinkMacSystemFont, sans-serif' }}>
            {format === 'ats' && <ATSPreview resume={resume} />}
            {format === 'modern' && <ModernPreview resume={resume} colors={colors} />}
            {format === 'classic' && <ClassicPreview resume={resume} colors={colors} />}
          </div>
        </div>

        <p className="text-[11px] text-[#6B7280] mt-3 text-center">
          This is a preview. Actual PDF may vary slightly.
        </p>
      </div>
    </div>
  );
}

// ATS-Optimized Preview (Plain text, no colors)
function ATSPreview({ resume }: { resume: ParsedResume }) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#000000', lineHeight: '1.5' }}>
      {/* Header */}
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
          {resume.personalInfo?.name}
        </h1>
        <div style={{ fontSize: '12px', color: '#000000' }}>
          {resume.personalInfo?.email && <span>{resume.personalInfo.email}</span>}
          {resume.personalInfo?.phone && <span> | {resume.personalInfo.phone}</span>}
          {resume.personalInfo?.location && <span> | {resume.personalInfo.location}</span>}
        </div>
        {(resume.personalInfo?.linkedin || resume.personalInfo?.website) && (
          <div style={{ fontSize: '12px', marginTop: '4px' }}>
            {resume.personalInfo?.linkedin && <span>{resume.personalInfo.linkedin}</span>}
            {resume.personalInfo?.website && resume.personalInfo?.linkedin && <span> | </span>}
            {resume.personalInfo?.website && <span>{resume.personalInfo.website}</span>}
          </div>
        )}
      </div>

      {/* Professional Summary */}
      {resume.summary && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', borderBottom: '1px solid #000000', paddingBottom: '4px' }}>
            PROFESSIONAL SUMMARY
          </h2>
          <p style={{ fontSize: '11px' }}>{resume.summary}</p>
        </div>
      )}

      {/* Experience */}
      {resume.experience && resume.experience.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', borderBottom: '1px solid #000000', paddingBottom: '4px' }}>
            WORK EXPERIENCE
          </h2>
          {resume.experience.map((exp, idx) => (
            <div key={idx} style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{exp.position}</div>
              <div style={{ fontSize: '11px' }}>{exp.company} | {exp.startDate} - {exp.current ? 'Present' : exp.endDate}</div>
              <p style={{ fontSize: '11px', marginTop: '4px' }}>{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {resume.education && resume.education.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', borderBottom: '1px solid #000000', paddingBottom: '4px' }}>
            EDUCATION
          </h2>
          {resume.education.map((edu, idx) => (
            <div key={idx} style={{ marginBottom: '8px' }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{edu.degree} in {edu.field}</div>
              <div style={{ fontSize: '11px' }}>{edu.institution} | {edu.graduationDate}</div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {resume.skills && resume.skills.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', borderBottom: '1px solid #000000', paddingBottom: '4px' }}>
            SKILLS
          </h2>
          <p style={{ fontSize: '11px' }}>{resume.skills.join(', ')}</p>
        </div>
      )}

      {/* Projects */}
      {resume.projects && resume.projects.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', borderBottom: '1px solid #000000', paddingBottom: '4px' }}>
            PROJECTS
          </h2>
          {resume.projects.map((project, idx) => (
            <div key={idx} style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{project.name}</div>
              {project.technologies && project.technologies.length > 0 && (
                <div style={{ fontSize: '11px' }}>{project.technologies.join(', ')}</div>
              )}
              <p style={{ fontSize: '11px', marginTop: '4px' }}>{project.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {resume.certifications && resume.certifications.length > 0 && (
        <div>
          <h2 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', borderBottom: '1px solid #000000', paddingBottom: '4px' }}>
            CERTIFICATIONS
          </h2>
          {resume.certifications.map((cert, idx) => (
            <div key={idx} style={{ fontSize: '11px', marginBottom: '4px' }}>
              <span style={{ fontWeight: 'bold' }}>{cert.name}</span> | {cert.issuer} | {cert.date}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Modern Preview (Two-column with colors)
function ModernPreview({ resume, colors }: { resume: ParsedResume; colors: any }) {
  return (
    <div className="flex" style={{ fontFamily: '-apple-system, sans-serif', minHeight: '500px', fontSize: '10px' }}>
      {/* Sidebar */}
      <div className="w-1/4 p-4" style={{ backgroundColor: colors.primary, color: '#FFFFFF' }}>
        <div className="mb-4">
          <h1 className="text-lg font-bold mb-1">{resume.personalInfo?.name.split(' ')[0]}</h1>
          <h1 className="text-lg font-bold mb-2">{resume.personalInfo?.name.split(' ').slice(1).join(' ')}</h1>
          <div className="h-1 w-10 mb-3" style={{ backgroundColor: colors.accent }}></div>
        </div>

        {/* Contact */}
        <div className="mb-4">
          <h3 className="text-[10px] font-bold mb-2 uppercase" style={{ color: colors.accent }}>Contact</h3>
          <div className="space-y-1 text-[9px]">
            {resume.personalInfo?.email && <p>{resume.personalInfo.email}</p>}
            {resume.personalInfo?.phone && <p>{resume.personalInfo.phone}</p>}
            {resume.personalInfo?.location && <p>{resume.personalInfo.location}</p>}
          </div>
        </div>

        {/* Skills */}
        {resume.skills && resume.skills.length > 0 && (
          <div>
            <h3 className="text-[10px] font-bold mb-2 uppercase" style={{ color: colors.accent }}>Skills</h3>
            <div className="space-y-1">
              {resume.skills.slice(0, 8).map((skill, idx) => (
                <div key={idx} className="text-[9px] px-2 py-1 rounded" style={{ backgroundColor: `${colors.accent}33` }}>
                  {skill}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-4">
        {resume.summary && (
          <div className="mb-4">
            <h2 className="text-[11px] font-bold mb-2 uppercase" style={{ color: colors.primary }}>Professional Summary</h2>
            <p className="text-[9px] leading-relaxed text-[#374151]">{resume.summary}</p>
          </div>
        )}

        {resume.experience && resume.experience.length > 0 && (
          <div className="mb-4">
            <h2 className="text-[11px] font-bold mb-2 uppercase" style={{ color: colors.primary }}>Work Experience</h2>
            {resume.experience.slice(0, 2).map((exp, idx) => (
              <div key={idx} className="mb-3 p-3 rounded" style={{ backgroundColor: '#F8FAFB', borderLeft: `3px solid ${colors.accent}` }}>
                <div className="text-[10px] font-bold" style={{ color: colors.primary }}>{exp.position}</div>
                <div className="text-[9px]" style={{ color: colors.accent }}>{exp.company}</div>
                <p className="text-[8px] mt-1 text-[#374151] line-clamp-2">{exp.description}</p>
              </div>
            ))}
          </div>
        )}

        {resume.projects && resume.projects.length > 0 && (
          <div>
            <h2 className="text-[11px] font-bold mb-2 uppercase" style={{ color: colors.primary }}>Projects</h2>
            {resume.projects.slice(0, 2).map((project, idx) => (
              <div key={idx} className="mb-2">
                <div className="text-[10px] font-bold" style={{ color: colors.primary }}>{project.name}</div>
                <p className="text-[8px] text-[#374151] line-clamp-1">{project.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Classic Preview (Serif fonts, centered)
function ClassicPreview({ resume, colors }: { resume: ParsedResume; colors: any }) {
  return (
    <div style={{ fontFamily: 'Georgia, serif', fontSize: '10px' }}>
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-2" style={{ color: colors.primary, fontFamily: 'Georgia, serif' }}>
          {resume.personalInfo?.name}
        </h1>
        <div className="text-[9px] pb-3" style={{ borderBottom: `1px solid ${colors.accent}`, color: '#6B7280' }}>
          {resume.personalInfo?.email && <span>{resume.personalInfo.email}</span>}
          {resume.personalInfo?.phone && <span> • {resume.personalInfo.phone}</span>}
          {resume.personalInfo?.location && <span> • {resume.personalInfo.location}</span>}
        </div>
      </div>

      {resume.summary && (
        <div className="mb-4">
          <h2 className="text-[11px] font-bold mb-2" style={{ color: colors.primary, borderBottom: `2px solid ${colors.accent}`, paddingBottom: '2px' }}>
            PROFESSIONAL SUMMARY
          </h2>
          <p className="text-[9px] leading-relaxed text-[#374151]">{resume.summary}</p>
        </div>
      )}

      {resume.experience && resume.experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-[11px] font-bold mb-2" style={{ color: colors.primary, borderBottom: `2px solid ${colors.accent}`, paddingBottom: '2px' }}>
            WORK EXPERIENCE
          </h2>
          {resume.experience.slice(0, 2).map((exp, idx) => (
            <div key={idx} className="mb-3">
              <div className="text-[10px] font-bold" style={{ color: colors.primary }}>{exp.position}</div>
              <div className="text-[9px]" style={{ color: colors.accent }}>{exp.company}</div>
              <p className="text-[8px] mt-1 text-[#374151] line-clamp-2">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {resume.skills && resume.skills.length > 0 && (
        <div>
          <h2 className="text-[11px] font-bold mb-2" style={{ color: colors.primary, borderBottom: `2px solid ${colors.accent}`, paddingBottom: '2px' }}>
            SKILLS
          </h2>
          <div className="flex flex-wrap gap-1">
            {resume.skills.slice(0, 10).map((skill, idx) => (
              <span key={idx} className="px-2 py-0.5 text-[8px] rounded" style={{ backgroundColor: '#F0F4F8', border: '1px solid #E5E7EB' }}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
