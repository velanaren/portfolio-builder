/**
 * LivePreview Component
 * Real-time preview of portfolio with iframe rendering
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { PortfolioContent, PortfolioCustomization } from '@/types';
import { Monitor, Smartphone, Tablet } from 'lucide-react';

interface LivePreviewProps {
  content: PortfolioContent;
  customization: PortfolioCustomization;
}

type ViewportSize = 'desktop' | 'tablet' | 'mobile';

export default function LivePreview({ content, customization }: LivePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [viewport, setViewport] = useState<ViewportSize>('desktop');

  // Generate preview HTML
  const generatePreviewHTML = (): string => {
    const { personalInfo, sections, socialLinks } = content;
    const { colors, fonts } = customization;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${personalInfo.name} - Portfolio</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: ${fonts.body}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: ${colors.background};
      color: ${colors.text};
      line-height: 1.6;
    }

    h1, h2, h3, h4, h5, h6 {
      font-family: ${fonts.heading}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    /* Hero Section */
    .hero {
      text-align: center;
      padding: 80px 20px;
      background: linear-gradient(135deg, ${colors.primary}15 0%, ${colors.accent}15 100%);
    }

    .hero h1 {
      font-size: 3rem;
      color: ${colors.primary};
      margin-bottom: 1rem;
      font-weight: bold;
    }

    .hero .title {
      font-size: 1.5rem;
      color: ${colors.accent};
      margin-bottom: 1.5rem;
    }

    .hero .bio {
      font-size: 1.125rem;
      max-width: 700px;
      margin: 0 auto 2rem;
      opacity: 0.9;
    }

    .social-links {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .social-link {
      padding: 0.75rem 1.5rem;
      background-color: ${colors.accent};
      color: ${colors.background};
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      transition: transform 0.2s, opacity 0.2s;
    }

    .social-link:hover {
      transform: translateY(-2px);
      opacity: 0.9;
    }

    /* Section Styles */
    section {
      padding: 60px 20px;
    }

    section h2 {
      font-size: 2rem;
      color: ${colors.primary};
      margin-bottom: 2rem;
      font-weight: bold;
    }

    /* About Section */
    .about-content {
      font-size: 1.125rem;
      max-width: 900px;
      margin: 0 auto;
    }

    /* Projects Section */
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .project-card {
      padding: 1.5rem;
      border: 2px solid ${colors.accent}40;
      border-radius: 12px;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .project-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.1);
    }

    .project-card h3 {
      font-size: 1.5rem;
      color: ${colors.accent};
      margin-bottom: 0.75rem;
    }

    .project-description {
      margin-bottom: 1rem;
      opacity: 0.9;
    }

    .tech-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .tech-tag {
      padding: 0.375rem 0.75rem;
      background-color: ${colors.accent};
      color: ${colors.background};
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .project-link {
      color: ${colors.accent};
      text-decoration: none;
      font-weight: 600;
      font-size: 0.875rem;
    }

    .project-link:hover {
      text-decoration: underline;
    }

    /* Skills Section */
    .skills-container {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      max-width: 900px;
      margin: 0 auto;
    }

    .skill-badge {
      padding: 0.625rem 1.25rem;
      background-color: ${colors.accent};
      color: ${colors.background};
      border-radius: 8px;
      font-weight: 500;
    }

    /* Experience Section */
    .experience-list {
      max-width: 900px;
      margin: 0 auto;
    }

    .experience-item {
      margin-bottom: 2.5rem;
    }

    .experience-item h3 {
      font-size: 1.375rem;
      color: ${colors.accent};
      margin-bottom: 0.5rem;
    }

    .experience-meta {
      font-size: 1.125rem;
      margin-bottom: 0.75rem;
      opacity: 0.8;
    }

    .experience-description {
      opacity: 0.9;
    }

    /* Education Section */
    .education-list {
      max-width: 900px;
      margin: 0 auto;
    }

    .education-item {
      margin-bottom: 2rem;
    }

    .education-item h3 {
      font-size: 1.375rem;
      color: ${colors.accent};
      margin-bottom: 0.5rem;
    }

    .education-meta {
      font-size: 1.125rem;
      opacity: 0.8;
    }

    /* Contact Section */
    .contact {
      text-align: center;
    }

    .contact-info {
      max-width: 600px;
      margin: 0 auto;
    }

    .contact-item {
      font-size: 1.125rem;
      margin-bottom: 1rem;
    }

    .contact-link {
      color: ${colors.accent};
      text-decoration: none;
      font-weight: 600;
    }

    .contact-link:hover {
      text-decoration: underline;
    }

    @media (max-width: 768px) {
      .hero h1 {
        font-size: 2rem;
      }

      .hero .title {
        font-size: 1.25rem;
      }

      section h2 {
        font-size: 1.5rem;
      }

      .projects-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <!-- Hero Section -->
  <section class="hero">
    <div class="container">
      <h1>${personalInfo.name}</h1>
      <p class="title">${personalInfo.title}</p>
      <p class="bio">${personalInfo.bio}</p>

      <div class="social-links">
        ${socialLinks.github ? `<a href="${socialLinks.github}" target="_blank" class="social-link">GitHub</a>` : ''}
        ${socialLinks.linkedin ? `<a href="${socialLinks.linkedin}" target="_blank" class="social-link">LinkedIn</a>` : ''}
        ${socialLinks.twitter ? `<a href="${socialLinks.twitter}" target="_blank" class="social-link">Twitter</a>` : ''}
        ${socialLinks.website ? `<a href="${socialLinks.website}" target="_blank" class="social-link">Website</a>` : ''}
      </div>
    </div>
  </section>

  ${
    sections.about.enabled && sections.about.content
      ? `
  <!-- About Section -->
  <section>
    <div class="container">
      <h2>About Me</h2>
      <p class="about-content">${sections.about.content}</p>
    </div>
  </section>
  `
      : ''
  }

  ${
    sections.projects.enabled && sections.projects.items.length > 0
      ? `
  <!-- Projects Section -->
  <section>
    <div class="container">
      <h2>Projects</h2>
      <div class="projects-grid">
        ${sections.projects.items
          .map(
            (project) => `
        <div class="project-card">
          <h3>${project.name || 'Untitled Project'}</h3>
          <p class="project-description">${project.description || 'No description provided.'}</p>
          ${
            project.technologies && project.technologies.length > 0
              ? `
          <div class="tech-tags">
            ${project.technologies.map((tech) => `<span class="tech-tag">${tech}</span>`).join('')}
          </div>
          `
              : ''
          }
          ${project.url ? `<a href="${project.url}" target="_blank" class="project-link">View Project →</a>` : ''}
        </div>
        `
          )
          .join('')}
      </div>
    </div>
  </section>
  `
      : ''
  }

  ${
    sections.skills.enabled && sections.skills.items.length > 0
      ? `
  <!-- Skills Section -->
  <section>
    <div class="container">
      <h2>Skills</h2>
      <div class="skills-container">
        ${sections.skills.items.map((skill) => `<span class="skill-badge">${skill}</span>`).join('')}
      </div>
    </div>
  </section>
  `
      : ''
  }

  ${
    sections.experience.enabled && sections.experience.items.length > 0
      ? `
  <!-- Experience Section -->
  <section>
    <div class="container">
      <h2>Experience</h2>
      <div class="experience-list">
        ${sections.experience.items
          .map(
            (exp) => `
        <div class="experience-item">
          <h3>${exp.position}</h3>
          <p class="experience-meta">${exp.company} • ${exp.duration}</p>
          <p class="experience-description">${exp.description}</p>
        </div>
        `
          )
          .join('')}
      </div>
    </div>
  </section>
  `
      : ''
  }

  ${
    sections.education.enabled && sections.education.items.length > 0
      ? `
  <!-- Education Section -->
  <section>
    <div class="container">
      <h2>Education</h2>
      <div class="education-list">
        ${sections.education.items
          .map(
            (edu) => `
        <div class="education-item">
          <h3>${edu.degree} in ${edu.field}</h3>
          <p class="education-meta">${edu.school}${edu.year ? ` • ${edu.year}` : ''}</p>
        </div>
        `
          )
          .join('')}
      </div>
    </div>
  </section>
  `
      : ''
  }

  ${
    sections.contact.enabled
      ? `
  <!-- Contact Section -->
  <section class="contact">
    <div class="container">
      <h2>Get In Touch</h2>
      <div class="contact-info">
        <p class="contact-item">
          <a href="mailto:${sections.contact.email}" class="contact-link">${sections.contact.email}</a>
        </p>
        ${sections.contact.phone ? `<p class="contact-item">${sections.contact.phone}</p>` : ''}
        ${personalInfo.location ? `<p class="contact-item">${personalInfo.location}</p>` : ''}
      </div>
    </div>
  </section>
  `
      : ''
  }
</body>
</html>
    `.trim();
  };

  // Update iframe content when content or customization changes
  useEffect(() => {
    if (iframeRef.current) {
      const iframeDoc = iframeRef.current.contentDocument;
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(generatePreviewHTML());
        iframeDoc.close();
      }
    }
  }, [content, customization]);

  // Viewport dimensions
  const viewportDimensions = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#F8FAFB' }}>
      {/* Viewport Controls */}
      <div
        className="flex items-center gap-2 p-4 border-b"
        style={{ borderColor: '#E5E7EB', backgroundColor: '#FFFFFF' }}
      >
        <span className="text-[12px] font-medium mr-2" style={{ color: '#6B7280' }}>
          Preview:
        </span>

        <button
          onClick={() => setViewport('desktop')}
          className={`p-2 rounded-lg transition-colors duration-200 ${
            viewport === 'desktop' ? 'bg-[#D4A574] text-white' : 'bg-gray-100 text-gray-600'
          }`}
          title="Desktop View"
        >
          <Monitor className="w-4 h-4" />
        </button>

        <button
          onClick={() => setViewport('tablet')}
          className={`p-2 rounded-lg transition-colors duration-200 ${
            viewport === 'tablet' ? 'bg-[#D4A574] text-white' : 'bg-gray-100 text-gray-600'
          }`}
          title="Tablet View"
        >
          <Tablet className="w-4 h-4" />
        </button>

        <button
          onClick={() => setViewport('mobile')}
          className={`p-2 rounded-lg transition-colors duration-200 ${
            viewport === 'mobile' ? 'bg-[#D4A574] text-white' : 'bg-gray-100 text-gray-600'
          }`}
          title="Mobile View"
        >
          <Smartphone className="w-4 h-4" />
        </button>

        <div className="ml-auto text-[12px]" style={{ color: '#6B7280' }}>
          {viewport === 'desktop' && 'Desktop (Full Width)'}
          {viewport === 'tablet' && 'Tablet (768px)'}
          {viewport === 'mobile' && 'Mobile (375px)'}
        </div>
      </div>

      {/* Preview Frame */}
      <div className="flex-1 overflow-auto p-4">
        <div
          className="mx-auto transition-all duration-300"
          style={{
            width: viewportDimensions[viewport],
            minHeight: '100%',
          }}
        >
          <iframe
            ref={iframeRef}
            title="Portfolio Preview"
            className="w-full h-full border-0 rounded-lg shadow-lg"
            style={{
              minHeight: '600px',
              backgroundColor: '#FFFFFF',
            }}
          />
        </div>
      </div>
    </div>
  );
}
