/**
 * Portfolio Code Generator
 * Generates Next.js portfolio code based on template and customization
 */

import { PortfolioContent, PortfolioCustomization } from '@/types';

/**
 * Generate complete Next.js portfolio code
 */
export function generatePortfolioCode(
  content: PortfolioContent,
  customization: PortfolioCustomization
): {
  files: Array<{ path: string; content: string }>;
  packageJson: object;
} {
  const files = [
    {
      path: 'app/page.tsx',
      content: generatePageTsx(content, customization),
    },
    {
      path: 'app/layout.tsx',
      content: generateLayoutTsx(content, customization),
    },
    {
      path: 'app/globals.css',
      content: generateGlobalsCss(customization),
    },
    {
      path: 'tailwind.config.ts',
      content: generateTailwindConfig(customization),
    },
    {
      path: 'package.json',
      content: JSON.stringify(generatePackageJson(), null, 2),
    },
    {
      path: 'README.md',
      content: generateReadme(content),
    },
  ];

  return {
    files,
    packageJson: generatePackageJson(),
  };
}

/**
 * Generate main page.tsx
 */
function generatePageTsx(
  content: PortfolioContent,
  customization: PortfolioCustomization
): string {
  const { personalInfo, sections, socialLinks } = content;
  const { colors } = customization;

  return `'use client';

export default function Portfolio() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '${colors.background}', color: '${colors.text}' }}>
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-4" style={{ color: '${colors.primary}' }}>
          ${personalInfo.name}
        </h1>
        <p className="text-2xl mb-6" style={{ color: '${colors.accent}' }}>
          ${personalInfo.title}
        </p>
        <p className="text-lg max-w-2xl mx-auto mb-8">
          ${personalInfo.bio}
        </p>

        {/* Social Links */}
        <div className="flex gap-4 justify-center">
          ${socialLinks.github ? `<a href="${socialLinks.github}" target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-lg font-semibold" style={{ backgroundColor: '${colors.accent}', color: '${colors.background}' }}>GitHub</a>` : ''}
          ${socialLinks.linkedin ? `<a href="${socialLinks.linkedin}" target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-lg font-semibold" style={{ backgroundColor: '${colors.accent}', color: '${colors.background}' }}>LinkedIn</a>` : ''}
        </div>
      </section>

      ${sections.about.enabled ? generateAboutSection(sections.about.content, colors) : ''}
      ${sections.projects.enabled ? generateProjectsSection(sections.projects.items, colors) : ''}
      ${sections.skills.enabled ? generateSkillsSection(sections.skills.items, colors) : ''}
      ${sections.experience.enabled ? generateExperienceSection(sections.experience.items, colors) : ''}
      ${sections.education.enabled ? generateEducationSection(sections.education.items, colors) : ''}
      ${sections.contact.enabled ? generateContactSection(sections.contact, personalInfo, colors) : ''}
    </div>
  );
}`;
}

function generateAboutSection(content: string, colors: any): string {
  return `
      {/* About Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-6" style={{ color: '${colors.primary}' }}>About Me</h2>
        <p className="text-lg max-w-3xl">${content}</p>
      </section>`;
}

function generateProjectsSection(projects: any[], colors: any): string {
  return `
      {/* Projects Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8" style={{ color: '${colors.primary}' }}>Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${projects.map(project => `
          <div className="p-6 rounded-lg border" style={{ borderColor: '${colors.accent}' }}>
            <h3 className="text-xl font-semibold mb-2" style={{ color: '${colors.accent}' }}>${project.name}</h3>
            <p className="mb-4">${project.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              ${project.technologies.map((tech: string) => `<span className="px-3 py-1 rounded-full text-sm" style={{ backgroundColor: '${colors.accent}', color: '${colors.background}' }}>${tech}</span>`).join('')}
            </div>
            ${project.url ? `<a href="${project.url}" target="_blank" className="text-sm font-semibold" style={{ color: '${colors.accent}' }}>View Project →</a>` : ''}
          </div>`).join('')}
        </div>
      </section>`;
}

function generateSkillsSection(skills: string[], colors: any): string {
  return `
      {/* Skills Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8" style={{ color: '${colors.primary}' }}>Skills</h2>
        <div className="flex flex-wrap gap-3">
          ${skills.map(skill => `<span className="px-4 py-2 rounded-lg font-medium" style={{ backgroundColor: '${colors.accent}', color: '${colors.background}' }}>${skill}</span>`).join('')}
        </div>
      </section>`;
}

function generateExperienceSection(experiences: any[], colors: any): string {
  return `
      {/* Experience Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8" style={{ color: '${colors.primary}' }}>Experience</h2>
        <div className="space-y-8">
          ${experiences.map(exp => `
          <div>
            <h3 className="text-xl font-semibold" style={{ color: '${colors.accent}' }}>${exp.position}</h3>
            <p className="text-lg mb-2">${exp.company} • ${exp.duration}</p>
            <p>${exp.description}</p>
          </div>`).join('')}
        </div>
      </section>`;
}

function generateEducationSection(education: any[], colors: any): string {
  return `
      {/* Education Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8" style={{ color: '${colors.primary}' }}>Education</h2>
        <div className="space-y-6">
          ${education.map(edu => `
          <div>
            <h3 className="text-xl font-semibold" style={{ color: '${colors.accent}' }}>${edu.degree} in ${edu.field}</h3>
            <p className="text-lg">${edu.school}${edu.year ? ` • ${edu.year}` : ''}</p>
          </div>`).join('')}
        </div>
      </section>`;
}

function generateContactSection(contact: any, personalInfo: any, colors: any): string {
  return `
      {/* Contact Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: '${colors.primary}' }}>Get In Touch</h2>
        <div className="max-w-md mx-auto text-center space-y-4">
          <p className="text-lg">
            <a href="mailto:${contact.email}" style={{ color: '${colors.accent}' }}>${contact.email}</a>
          </p>
          ${contact.phone ? `<p className="text-lg">${contact.phone}</p>` : ''}
          ${personalInfo.location ? `<p className="text-lg">${personalInfo.location}</p>` : ''}
        </div>
      </section>`;
}

/**
 * Generate layout.tsx
 */
function generateLayoutTsx(
  content: PortfolioContent,
  customization: PortfolioCustomization
): string {
  return `import './globals.css';

export const metadata = {
  title: '${content.personalInfo.name} - Portfolio',
  description: '${content.personalInfo.bio}',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="${customization.fonts.body}">{children}</body>
    </html>
  );
}`;
}

/**
 * Generate globals.css
 */
function generateGlobalsCss(customization: PortfolioCustomization): string {
  return `@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: ${customization.fonts.body}, sans-serif;
}

h1, h2, h3, h4, h5, h6 {
  font-family: ${customization.fonts.heading}, sans-serif;
}`;
}

/**
 * Generate tailwind.config.ts
 */
function generateTailwindConfig(customization: PortfolioCustomization): string {
  return `import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '${customization.colors.primary}',
        accent: '${customization.colors.accent}',
        background: '${customization.colors.background}',
        text: '${customization.colors.text}',
      },
    },
  },
  plugins: [],
};

export default config;`;
}

/**
 * Generate package.json
 */
function generatePackageJson(): object {
  return {
    name: 'my-portfolio',
    version: '1.0.0',
    private: true,
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
      lint: 'next lint',
    },
    dependencies: {
      react: '^18',
      'react-dom': '^18',
      next: '16.0.1',
    },
    devDependencies: {
      typescript: '^5',
      '@types/node': '^20',
      '@types/react': '^18',
      '@types/react-dom': '^18',
      postcss: '^8',
      tailwindcss: '^3.4.1',
    },
  };
}

/**
 * Generate README.md
 */
function generateReadme(content: PortfolioContent): string {
  return `# ${content.personalInfo.name}'s Portfolio

${content.personalInfo.bio}

## Getting Started

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

Deploy to Vercel:
\`\`\`bash
vercel
\`\`\`

## Contact

- Email: ${content.personalInfo.email}
${content.socialLinks.github ? `- GitHub: ${content.socialLinks.github}` : ''}
${content.socialLinks.linkedin ? `- LinkedIn: ${content.socialLinks.linkedin}` : ''}
`;
}

/**
 * Generate downloadable ZIP structure
 */
export function prepareDownload(files: Array<{ path: string; content: string }>): Blob {
  // In a real implementation, you'd use JSZip to create a proper ZIP file
  // For now, return a text blob with all files concatenated
  const allFiles = files.map(f => `=== ${f.path} ===\n${f.content}\n\n`).join('\n');
  return new Blob([allFiles], { type: 'text/plain' });
}
