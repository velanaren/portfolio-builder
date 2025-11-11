/**
 * Portfolio Template Definitions
 *
 * This file contains all pre-defined portfolio templates with their default configurations,
 * including color schemes, fonts, layouts, and enabled sections.
 *
 * Each template is designed for different use cases:
 * - Minimal: Clean, modern, single-column layout for minimalist professionals
 * - Creative: Dark mode with gradient accents for designers and creatives
 * - Professional: Traditional two-column layout for corporate environments
 * - Artistic: Portfolio-focused layout for artists and creative professionals
 */

import { PortfolioTemplate, PortfolioCustomization } from '@/types';

/**
 * Template Definition Interface
 * Defines the structure for each portfolio template
 */
export interface TemplateDefinition {
  /** Unique identifier for the template */
  id: PortfolioTemplate;

  /** Display name of the template */
  name: string;

  /** Brief description of the template's purpose */
  description: string;

  /** Detailed description of the template's appearance and style */
  preview: string;

  /** Default customization settings for this template */
  defaultCustomization: PortfolioCustomization;

  /** Key features and highlights of this template */
  features: string[];
}

/**
 * Minimal Template
 * A clean, modern, single-column layout perfect for professionals who prefer simplicity
 */
const minimalTemplate: TemplateDefinition = {
  id: 'minimal',
  name: 'Minimal',
  description: 'Clean, modern, single-column layout',
  preview: 'A minimalist design with a white background, navy text, and subtle gold accents. Features a single-column layout that emphasizes content hierarchy and readability. Perfect for professionals who want their work to speak for itself.',
  defaultCustomization: {
    template: 'minimal',
    colors: {
      primary: '#1A1F2E',     // Navy text
      accent: '#D4A574',      // Gold accent
      background: '#FFFFFF',  // White background
      text: '#1A1F2E',        // Navy text
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
    sections: {
      about: true,
      experience: true,
      projects: true,
      skills: true,
      education: true,
      contact: true,
    },
    darkMode: false,
    layout: 'single-column',
  },
  features: [
    'Clean, minimalist design',
    'Optimal readability with single-column layout',
    'Professional color palette',
    'Modern typography with Inter font',
    'Focus on content over decoration',
    'Mobile-responsive design',
  ],
};

/**
 * Creative Template
 * A modern dark mode design with gradient accents for designers and creative professionals
 */
const creativeTemplate: TemplateDefinition = {
  id: 'creative',
  name: 'Creative',
  description: 'Modern, dark mode, gradient accents',
  preview: 'A striking dark mode design with a deep navy background, crisp white text, and warm gold accents. Features modern typography with Poppins headings and Inter body text. Ideal for designers, developers, and creative professionals who want to make a bold statement.',
  defaultCustomization: {
    template: 'creative',
    colors: {
      primary: '#FFFFFF',     // White text
      accent: '#D4A574',      // Gold accent
      background: '#0F1419',  // Dark navy background
      text: '#FFFFFF',        // White text
    },
    fonts: {
      heading: 'Poppins',
      body: 'Inter',
    },
    sections: {
      about: true,
      experience: true,
      projects: true,
      skills: true,
      education: true,
      contact: true,
    },
    darkMode: true,
    layout: 'single-column',
  },
  features: [
    'Eye-catching dark mode design',
    'Modern gradient accents',
    'Bold typography with Poppins headings',
    'High contrast for excellent readability',
    'Perfect for creative portfolios',
    'Sleek, contemporary aesthetic',
  ],
};

/**
 * Professional Template
 * A traditional two-column layout with a corporate feel for business professionals
 */
const professionalTemplate: TemplateDefinition = {
  id: 'professional',
  name: 'Professional',
  description: 'Traditional, two-column, corporate feel',
  preview: 'A sophisticated two-column layout with a light gray background, navy text, and professional blue accents. Features traditional typography with Inter font throughout. Designed for corporate professionals, executives, and business consultants who need a polished, trustworthy appearance.',
  defaultCustomization: {
    template: 'professional',
    colors: {
      primary: '#1A1F2E',     // Navy text
      accent: '#3B82F6',      // Blue accent
      background: '#F8FAFB',  // Light gray background
      text: '#1A1F2E',        // Navy text
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
    sections: {
      about: true,
      experience: true,
      projects: true,
      skills: true,
      education: true,
      contact: true,
    },
    darkMode: false,
    layout: 'two-column',
  },
  features: [
    'Traditional two-column layout',
    'Corporate-friendly color scheme',
    'Professional blue accents',
    'Consistent Inter typography',
    'Optimal for business environments',
    'Efficient use of space',
  ],
};

/**
 * Artistic Template
 * A creative sidebar layout emphasizing visual projects and portfolio work
 */
const artisticTemplate: TemplateDefinition = {
  id: 'artistic',
  name: 'Artistic',
  description: 'Portfolio-focused, creative layout',
  preview: 'An elegant sidebar layout with a clean white background, navy text, and vibrant purple accents. Features sophisticated typography with Playfair Display headings and Open Sans body text. Special emphasis on projects section with enhanced visual presentation. Perfect for artists, photographers, and creative professionals showcasing visual work.',
  defaultCustomization: {
    template: 'artistic',
    colors: {
      primary: '#1A1F2E',     // Navy text
      accent: '#8B5CF6',      // Purple accent
      background: '#FFFFFF',  // White background
      text: '#1A1F2E',        // Navy text
    },
    fonts: {
      heading: 'Playfair Display',
      body: 'Open Sans',
    },
    sections: {
      about: true,
      experience: true,
      projects: true,
      skills: true,
      education: true,
      contact: true,
    },
    darkMode: false,
    layout: 'sidebar',
  },
  features: [
    'Unique sidebar layout',
    'Elegant serif headings with Playfair Display',
    'Enhanced project showcase',
    'Vibrant purple accents',
    'Optimized for visual portfolios',
    'Sophisticated, artistic aesthetic',
  ],
};

/**
 * Array of all available portfolio templates
 * Export for use in template selection components
 */
export const PORTFOLIO_TEMPLATES: TemplateDefinition[] = [
  minimalTemplate,
  creativeTemplate,
  professionalTemplate,
  artisticTemplate,
];

/**
 * Get a template definition by its ID
 *
 * @param id - The template ID to retrieve
 * @returns The template definition matching the ID
 * @throws Error if template ID is not found
 *
 * @example
 * const template = getTemplateById('minimal');
 * console.log(template.name); // "Minimal"
 */
export function getTemplateById(id: PortfolioTemplate): TemplateDefinition {
  const template = PORTFOLIO_TEMPLATES.find(t => t.id === id);

  if (!template) {
    throw new Error(`Template with id "${id}" not found. Available templates: ${PORTFOLIO_TEMPLATES.map(t => t.id).join(', ')}`);
  }

  return template;
}

/**
 * Get default customization settings for a specific template
 *
 * @param template - The template ID to get customization for
 * @returns The default customization settings for the template
 * @throws Error if template ID is not found
 *
 * @example
 * const customization = getDefaultCustomization('creative');
 * console.log(customization.darkMode); // true
 */
export function getDefaultCustomization(template: PortfolioTemplate): PortfolioCustomization {
  const templateDef = getTemplateById(template);
  return { ...templateDef.defaultCustomization };
}

/**
 * Get all template names and IDs
 * Useful for dropdown selectors and template choosers
 *
 * @returns Array of objects containing template IDs and names
 *
 * @example
 * const options = getTemplateOptions();
 * // [{ id: 'minimal', name: 'Minimal' }, ...]
 */
export function getTemplateOptions(): Array<{ id: PortfolioTemplate; name: string }> {
  return PORTFOLIO_TEMPLATES.map(t => ({
    id: t.id,
    name: t.name,
  }));
}

/**
 * Check if a template ID is valid
 *
 * @param id - The template ID to validate
 * @returns True if the template exists, false otherwise
 *
 * @example
 * isValidTemplate('minimal'); // true
 * isValidTemplate('invalid'); // false
 */
export function isValidTemplate(id: string): id is PortfolioTemplate {
  return PORTFOLIO_TEMPLATES.some(t => t.id === id);
}

/**
 * Get templates filtered by a specific feature
 *
 * @param feature - The feature to filter by (partial match)
 * @returns Array of templates that include the specified feature
 *
 * @example
 * const darkTemplates = getTemplatesByFeature('dark mode');
 * // Returns templates with dark mode feature
 */
export function getTemplatesByFeature(feature: string): TemplateDefinition[] {
  const searchTerm = feature.toLowerCase();
  return PORTFOLIO_TEMPLATES.filter(t =>
    t.features.some(f => f.toLowerCase().includes(searchTerm))
  );
}

/**
 * Get templates with a specific layout
 *
 * @param layout - The layout type to filter by
 * @returns Array of templates with the specified layout
 *
 * @example
 * const twoColumnTemplates = getTemplatesByLayout('two-column');
 */
export function getTemplatesByLayout(
  layout: 'single-column' | 'two-column' | 'sidebar'
): TemplateDefinition[] {
  return PORTFOLIO_TEMPLATES.filter(t => t.defaultCustomization.layout === layout);
}

/**
 * Get templates with dark mode enabled
 *
 * @returns Array of templates with dark mode by default
 *
 * @example
 * const darkTemplates = getDarkModeTemplates();
 */
export function getDarkModeTemplates(): TemplateDefinition[] {
  return PORTFOLIO_TEMPLATES.filter(t => t.defaultCustomization.darkMode);
}

/**
 * Get templates with light mode (dark mode disabled)
 *
 * @returns Array of templates with light mode by default
 *
 * @example
 * const lightTemplates = getLightModeTemplates();
 */
export function getLightModeTemplates(): TemplateDefinition[] {
  return PORTFOLIO_TEMPLATES.filter(t => !t.defaultCustomization.darkMode);
}
