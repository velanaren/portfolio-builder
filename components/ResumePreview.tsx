/**
 * Resume Preview Component
 * Premium professional themes designed by senior design engineer
 *
 * THEMES:
 * - Classic: Timeless, elegant, corporate professional
 * - Modern: Contemporary, sophisticated, tech-forward
 * - Minimal: Ultra-clean, distraction-free, typography-focused
 */

'use client';

import { useState } from 'react';
import { ParsedResume } from '@/types';
import { Download, Maximize2, Printer, Briefcase, GraduationCap, FolderOpen, Award } from 'lucide-react';

interface ResumePreviewProps {
  resume: ParsedResume;
}

type Theme = 'classic' | 'modern' | 'minimal';

export default function ResumePreview({ resume }: ResumePreviewProps) {
  const [theme, setTheme] = useState<Theme>('classic');

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
          <button
            onClick={() => setTheme('classic')}
            className={`px-4 py-2 text-[14px] font-semibold transition-all duration-200 border-b-2 ${
              theme === 'classic'
                ? 'text-[#D4A574] border-[#D4A574]'
                : 'text-[#6B7280] border-transparent hover:text-[#0F1419]'
            }`}
          >
            Classic
          </button>
          <button
            onClick={() => setTheme('modern')}
            className={`px-4 py-2 text-[14px] font-semibold transition-all duration-200 border-b-2 ${
              theme === 'modern'
                ? 'text-[#D4A574] border-[#D4A574]'
                : 'text-[#6B7280] border-transparent hover:text-[#0F1419]'
            }`}
          >
            Modern
          </button>
          <button
            onClick={() => setTheme('minimal')}
            className={`px-4 py-2 text-[14px] font-semibold transition-all duration-200 border-b-2 ${
              theme === 'minimal'
                ? 'text-[#D4A574] border-[#D4A574]'
                : 'text-[#6B7280] border-transparent hover:text-[#0F1419]'
            }`}
          >
            Minimal
          </button>
        </div>

        {/* Preview Content */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg min-h-[500px] max-h-[calc(100vh-340px)] overflow-y-auto">
          {theme === 'classic' && <ClassicTheme resume={resume} />}
          {theme === 'modern' && <ModernTheme resume={resume} />}
          {theme === 'minimal' && <MinimalTheme resume={resume} />}
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

/**
 * CLASSIC THEME
 * Timeless, elegant, corporate professional
 * Serif fonts, navy/gold accents, traditional layout
 */
function ClassicTheme({ resume }: { resume: ParsedResume }) {
  return (
    <div className="p-10" style={{ fontFamily: 'Georgia, Garamond, serif' }}>
      {/* Header - Centered, Elegant */}
      <div className="text-center mb-8">
        <h1
          className="text-4xl font-bold mb-2"
          style={{
            fontFamily: 'Georgia, Garamond, serif',
            color: '#1F2937',
            letterSpacing: '0.5px'
          }}
        >
          {resume.personalInfo.name}
        </h1>

        {/* Contact Info - Elegant Horizontal Layout */}
        <div
          className="text-xs mb-4 pb-4"
          style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
            color: '#6B7280',
            borderBottom: '1px solid #D4A574'
          }}
        >
          {resume.personalInfo.email && <span>{resume.personalInfo.email}</span>}
          {resume.personalInfo.phone && <span> • {resume.personalInfo.phone}</span>}
          {resume.personalInfo.location && <span> • {resume.personalInfo.location}</span>}
          {resume.personalInfo.linkedin && <span> • {resume.personalInfo.linkedin}</span>}
          {resume.personalInfo.website && <span> • {resume.personalInfo.website}</span>}
        </div>
      </div>

      {/* Professional Summary */}
      {resume.summary && (
        <div className="mb-6">
          <h2
            className="text-sm font-bold mb-3 pb-1"
            style={{
              color: '#1F2937',
              borderBottom: '2px solid #D4A574',
              fontFamily: 'Georgia, Garamond, serif',
              letterSpacing: '1px'
            }}
          >
            PROFESSIONAL SUMMARY
          </h2>
          <p
            className="text-xs leading-relaxed"
            style={{
              color: '#374151',
              fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
            }}
          >
            {resume.summary}
          </p>
        </div>
      )}

      {/* Work Experience */}
      {resume.experience && resume.experience.length > 0 && (
        <div className="mb-6">
          <h2
            className="text-sm font-bold mb-3 pb-1"
            style={{
              color: '#1F2937',
              borderBottom: '2px solid #D4A574',
              fontFamily: 'Georgia, Garamond, serif',
              letterSpacing: '1px'
            }}
          >
            WORK EXPERIENCE
          </h2>
          {resume.experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="text-xs font-bold" style={{ color: '#1F2937' }}>
                  {exp.position}
                </h3>
                <span className="text-xs italic" style={{ color: '#6B7280' }}>
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <p className="text-xs font-semibold mb-2" style={{ color: '#D4A574' }}>
                {exp.company}
              </p>
              <div className="text-xs leading-relaxed" style={{ color: '#374151' }}>
                {exp.description.split('\n').map((line, idx) => (
                  line.trim() && (
                    <div key={idx} className="flex items-start mb-1">
                      <span style={{ color: '#1F2937', marginRight: '8px' }}>•</span>
                      <span>{line.trim()}</span>
                    </div>
                  )
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {resume.education && resume.education.length > 0 && (
        <div className="mb-6">
          <h2
            className="text-sm font-bold mb-3 pb-1"
            style={{
              color: '#1F2937',
              borderBottom: '2px solid #D4A574',
              fontFamily: 'Georgia, Garamond, serif',
              letterSpacing: '1px'
            }}
          >
            EDUCATION
          </h2>
          {resume.education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="text-xs font-bold" style={{ color: '#1F2937' }}>
                  {edu.degree} in {edu.field}
                </h3>
                <span className="text-xs italic" style={{ color: '#6B7280' }}>
                  {edu.graduationDate}
                </span>
              </div>
              <p className="text-xs font-semibold" style={{ color: '#D4A574' }}>
                {edu.institution}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {resume.skills && resume.skills.length > 0 && (
        <div className="mb-6">
          <h2
            className="text-sm font-bold mb-3 pb-1"
            style={{
              color: '#1F2937',
              borderBottom: '2px solid #D4A574',
              fontFamily: 'Georgia, Garamond, serif',
              letterSpacing: '1px'
            }}
          >
            SKILLS
          </h2>
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 text-xs font-semibold rounded"
                style={{
                  backgroundColor: '#F0F4F8',
                  color: '#1F2937',
                  border: '1px solid #E5E7EB'
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
        <div className="mb-6">
          <h2
            className="text-sm font-bold mb-3 pb-1"
            style={{
              color: '#1F2937',
              borderBottom: '2px solid #D4A574',
              fontFamily: 'Georgia, Garamond, serif',
              letterSpacing: '1px'
            }}
          >
            PROJECTS
          </h2>
          {resume.projects.map((project) => (
            <div key={project.id} className="mb-4">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="text-xs font-bold" style={{ color: '#1F2937' }}>
                  {project.name}
                </h3>
                {(project.startDate || project.endDate) && (
                  <span className="text-xs italic" style={{ color: '#6B7280' }}>
                    {project.startDate} {project.endDate && `- ${project.endDate}`}
                  </span>
                )}
              </div>
              {project.technologies && project.technologies.length > 0 && (
                <p className="text-xs mb-1" style={{ color: '#D4A574' }}>
                  {project.technologies.join(' • ')}
                </p>
              )}
              <p className="text-xs leading-relaxed" style={{ color: '#374151' }}>
                {project.description}
              </p>
              {project.url && (
                <p className="text-xs mt-1" style={{ color: '#6B7280' }}>
                  {project.url}
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
            className="text-sm font-bold mb-3 pb-1"
            style={{
              color: '#1F2937',
              borderBottom: '2px solid #D4A574',
              fontFamily: 'Georgia, Garamond, serif',
              letterSpacing: '1px'
            }}
          >
            CERTIFICATIONS
          </h2>
          {resume.certifications.map((cert) => (
            <div key={cert.id} className="mb-2">
              <h3 className="text-xs font-bold" style={{ color: '#1F2937' }}>
                {cert.name}
              </h3>
              <p className="text-xs" style={{ color: '#6B7280' }}>
                {cert.issuer} • {cert.date}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * MODERN THEME
 * Contemporary, sophisticated, tech-forward
 * Two-column layout, navy sidebar, icons, card-based
 */
function ModernTheme({ resume }: { resume: ParsedResume }) {
  return (
    <div className="flex" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', minHeight: '500px' }}>
      {/* Left Sidebar - Navy with white text */}
      <div
        className="w-1/4 p-6"
        style={{ backgroundColor: '#1F2937', color: '#FFFFFF' }}
      >
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2" style={{ letterSpacing: '-0.5px' }}>
            {resume.personalInfo.name.split(' ')[0]}
          </h1>
          <h1 className="text-2xl font-bold mb-4" style={{ letterSpacing: '-0.5px' }}>
            {resume.personalInfo.name.split(' ').slice(1).join(' ')}
          </h1>
          <div className="h-1 w-12 mb-4" style={{ backgroundColor: '#D4A574' }}></div>
        </div>

        {/* Contact */}
        <div className="mb-6">
          <h3 className="text-xs font-bold mb-3 uppercase tracking-wide" style={{ color: '#D4A574' }}>
            Contact
          </h3>
          <div className="space-y-2 text-xs">
            {resume.personalInfo.email && (
              <p className="break-words">{resume.personalInfo.email}</p>
            )}
            {resume.personalInfo.phone && (
              <p>{resume.personalInfo.phone}</p>
            )}
            {resume.personalInfo.location && (
              <p>{resume.personalInfo.location}</p>
            )}
            {resume.personalInfo.linkedin && (
              <p className="break-words">{resume.personalInfo.linkedin}</p>
            )}
            {resume.personalInfo.website && (
              <p className="break-words">{resume.personalInfo.website}</p>
            )}
          </div>
        </div>

        {/* Skills in sidebar */}
        {resume.skills && resume.skills.length > 0 && (
          <div>
            <h3 className="text-xs font-bold mb-3 uppercase tracking-wide" style={{ color: '#D4A574' }}>
              Skills
            </h3>
            <div className="space-y-1.5">
              {resume.skills.map((skill, index) => (
                <div
                  key={index}
                  className="text-xs px-2 py-1 rounded"
                  style={{
                    backgroundColor: 'rgba(212, 165, 116, 0.2)',
                    color: '#FFFFFF'
                  }}
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Main Content */}
      <div className="w-3/4 p-8" style={{ backgroundColor: '#FFFFFF' }}>
        {/* Professional Summary */}
        {resume.summary && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Briefcase className="h-4 w-4" style={{ color: '#D4A574' }} />
              <h2 className="text-sm font-bold uppercase tracking-wide" style={{ color: '#1F2937' }}>
                Professional Summary
              </h2>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: '#374151' }}>
              {resume.summary}
            </p>
          </div>
        )}

        {/* Work Experience */}
        {resume.experience && resume.experience.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Briefcase className="h-4 w-4" style={{ color: '#D4A574' }} />
              <h2 className="text-sm font-bold uppercase tracking-wide" style={{ color: '#1F2937' }}>
                Work Experience
              </h2>
            </div>
            {resume.experience.map((exp) => (
              <div
                key={exp.id}
                className="mb-4 p-4 rounded-lg"
                style={{
                  backgroundColor: '#F8FAFB',
                  borderLeft: '3px solid #D4A574'
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xs font-bold mb-1" style={{ color: '#1F2937' }}>
                      {exp.position}
                    </h3>
                    <p className="text-xs font-semibold" style={{ color: '#6366F1' }}>
                      {exp.company}
                    </p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: '#E5E7EB', color: '#6B7280' }}>
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: '#374151' }}>
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {resume.education && resume.education.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="h-4 w-4" style={{ color: '#D4A574' }} />
              <h2 className="text-sm font-bold uppercase tracking-wide" style={{ color: '#1F2937' }}>
                Education
              </h2>
            </div>
            {resume.education.map((edu) => (
              <div
                key={edu.id}
                className="mb-3 p-4 rounded-lg"
                style={{ backgroundColor: '#F8FAFB' }}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-xs font-bold" style={{ color: '#1F2937' }}>
                    {edu.degree} in {edu.field}
                  </h3>
                  <span className="text-xs" style={{ color: '#6B7280' }}>
                    {edu.graduationDate}
                  </span>
                </div>
                <p className="text-xs font-semibold" style={{ color: '#6366F1' }}>
                  {edu.institution}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {resume.projects && resume.projects.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <FolderOpen className="h-4 w-4" style={{ color: '#D4A574' }} />
              <h2 className="text-sm font-bold uppercase tracking-wide" style={{ color: '#1F2937' }}>
                Projects
              </h2>
            </div>
            {resume.projects.map((project) => (
              <div
                key={project.id}
                className="mb-4 p-4 rounded-lg"
                style={{
                  backgroundColor: '#F8FAFB',
                  borderLeft: '3px solid #6366F1'
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xs font-bold" style={{ color: '#1F2937' }}>
                    {project.name}
                  </h3>
                  {(project.startDate || project.endDate) && (
                    <span className="text-xs" style={{ color: '#6B7280' }}>
                      {project.startDate} {project.endDate && `- ${project.endDate}`}
                    </span>
                  )}
                </div>
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {project.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-0.5 rounded"
                        style={{ backgroundColor: '#E5E7EB', color: '#374151' }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-xs leading-relaxed" style={{ color: '#374151' }}>
                  {project.description}
                </p>
                {project.url && (
                  <p className="text-xs mt-2" style={{ color: '#6B7280' }}>
                    {project.url}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {resume.certifications && resume.certifications.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Award className="h-4 w-4" style={{ color: '#D4A574' }} />
              <h2 className="text-sm font-bold uppercase tracking-wide" style={{ color: '#1F2937' }}>
                Certifications
              </h2>
            </div>
            {resume.certifications.map((cert) => (
              <div key={cert.id} className="mb-2">
                <h3 className="text-xs font-bold" style={{ color: '#1F2937' }}>
                  {cert.name}
                </h3>
                <p className="text-xs" style={{ color: '#6B7280' }}>
                  {cert.issuer} • {cert.date}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * MINIMAL THEME
 * Ultra-clean, distraction-free, typography-focused
 * Maximum whitespace, minimal colors, simple lines
 */
function MinimalTheme({ resume }: { resume: ParsedResume }) {
  const SectionDivider = () => (
    <div className="my-6" style={{ height: '0.5px', backgroundColor: '#D1D5DB' }}></div>
  );

  return (
    <div className="p-12" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {/* Header - Minimal, Left-aligned */}
      <div className="mb-8">
        <h1
          className="text-3xl font-bold mb-2"
          style={{ color: '#000000', letterSpacing: '-0.5px' }}
        >
          {resume.personalInfo.name}
        </h1>

        <div className="text-xs mb-3" style={{ color: '#D1D5DB' }}>
          {resume.personalInfo.email && <span>{resume.personalInfo.email}</span>}
          {resume.personalInfo.phone && <span> • {resume.personalInfo.phone}</span>}
          {resume.personalInfo.location && <span> • {resume.personalInfo.location}</span>}
        </div>

        {(resume.personalInfo.linkedin || resume.personalInfo.website) && (
          <div className="text-xs" style={{ color: '#D1D5DB' }}>
            {resume.personalInfo.linkedin && <span>{resume.personalInfo.linkedin}</span>}
            {resume.personalInfo.website && resume.personalInfo.linkedin && <span> • </span>}
            {resume.personalInfo.website && <span>{resume.personalInfo.website}</span>}
          </div>
        )}
      </div>

      <SectionDivider />

      {/* Professional Summary */}
      {resume.summary && (
        <>
          <div className="mb-6">
            <h2
              className="text-xs font-bold mb-3 flex items-center gap-2"
              style={{ color: '#000000', letterSpacing: '1px' }}
            >
              <span style={{ color: '#D4A574' }}>•</span>
              PROFESSIONAL SUMMARY
            </h2>
            <p className="text-xs leading-relaxed" style={{ color: '#374151' }}>
              {resume.summary}
            </p>
          </div>
          <SectionDivider />
        </>
      )}

      {/* Work Experience */}
      {resume.experience && resume.experience.length > 0 && (
        <>
          <div className="mb-6">
            <h2
              className="text-xs font-bold mb-4 flex items-center gap-2"
              style={{ color: '#000000', letterSpacing: '1px' }}
            >
              <span style={{ color: '#D4A574' }}>•</span>
              EXPERIENCE
            </h2>
            {resume.experience.map((exp, idx) => (
              <div key={exp.id} className={idx > 0 ? 'mt-5' : ''}>
                <div className="text-xs mb-1" style={{ color: '#000000' }}>
                  <span className="font-bold">{exp.company}</span>
                  <span style={{ color: '#D1D5DB' }}> • </span>
                  <span>{exp.position}</span>
                  <span style={{ color: '#D1D5DB' }}> • </span>
                  <span style={{ color: '#9CA3AF' }}>
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <p className="text-xs leading-relaxed mt-2" style={{ color: '#6B7280' }}>
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
          <SectionDivider />
        </>
      )}

      {/* Education */}
      {resume.education && resume.education.length > 0 && (
        <>
          <div className="mb-6">
            <h2
              className="text-xs font-bold mb-4 flex items-center gap-2"
              style={{ color: '#000000', letterSpacing: '1px' }}
            >
              <span style={{ color: '#D4A574' }}>•</span>
              EDUCATION
            </h2>
            {resume.education.map((edu, idx) => (
              <div key={edu.id} className={idx > 0 ? 'mt-3' : ''}>
                <div className="text-xs" style={{ color: '#000000' }}>
                  <span className="font-bold">{edu.institution}</span>
                  <span style={{ color: '#D1D5DB' }}> • </span>
                  <span>{edu.degree} in {edu.field}</span>
                  <span style={{ color: '#D1D5DB' }}> • </span>
                  <span style={{ color: '#9CA3AF' }}>{edu.graduationDate}</span>
                </div>
              </div>
            ))}
          </div>
          <SectionDivider />
        </>
      )}

      {/* Skills */}
      {resume.skills && resume.skills.length > 0 && (
        <>
          <div className="mb-6">
            <h2
              className="text-xs font-bold mb-3 flex items-center gap-2"
              style={{ color: '#000000', letterSpacing: '1px' }}
            >
              <span style={{ color: '#D4A574' }}>•</span>
              SKILLS
            </h2>
            <p className="text-xs" style={{ color: '#6B7280' }}>
              {resume.skills.join(', ')}
            </p>
          </div>
          <SectionDivider />
        </>
      )}

      {/* Projects */}
      {resume.projects && resume.projects.length > 0 && (
        <>
          <div className="mb-6">
            <h2
              className="text-xs font-bold mb-4 flex items-center gap-2"
              style={{ color: '#000000', letterSpacing: '1px' }}
            >
              <span style={{ color: '#D4A574' }}>•</span>
              PROJECTS
            </h2>
            {resume.projects.map((project, idx) => (
              <div key={project.id} className={idx > 0 ? 'mt-4' : ''}>
                <div className="text-xs mb-1" style={{ color: '#000000' }}>
                  <span className="font-bold">{project.name}</span>
                  {project.technologies && project.technologies.length > 0 && (
                    <>
                      <span style={{ color: '#D1D5DB' }}> • </span>
                      <span style={{ color: '#9CA3AF' }}>{project.technologies.join(', ')}</span>
                    </>
                  )}
                </div>
                <p className="text-xs leading-relaxed mt-1" style={{ color: '#6B7280' }}>
                  {project.description}
                </p>
                {project.url && (
                  <p className="text-xs mt-1" style={{ color: '#D1D5DB' }}>
                    {project.url}
                  </p>
                )}
              </div>
            ))}
          </div>
          <SectionDivider />
        </>
      )}

      {/* Certifications */}
      {resume.certifications && resume.certifications.length > 0 && (
        <div>
          <h2
            className="text-xs font-bold mb-3 flex items-center gap-2"
            style={{ color: '#000000', letterSpacing: '1px' }}
          >
            <span style={{ color: '#D4A574' }}>•</span>
            CERTIFICATIONS
          </h2>
          {resume.certifications.map((cert, idx) => (
            <div key={cert.id} className={idx > 0 ? 'mt-2' : ''}>
              <div className="text-xs" style={{ color: '#000000' }}>
                <span className="font-bold">{cert.name}</span>
                <span style={{ color: '#D1D5DB' }}> • </span>
                <span style={{ color: '#9CA3AF' }}>{cert.issuer} • {cert.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
