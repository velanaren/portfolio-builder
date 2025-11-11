/**
 * CustomizationPanel Component
 * Allows users to customize colors, fonts, and section visibility
 */

'use client';

import { PortfolioCustomization } from '@/types';
import { Palette, Type, Eye, EyeOff } from 'lucide-react';

interface CustomizationPanelProps {
  customization: PortfolioCustomization;
  onCustomizationChange: (customization: PortfolioCustomization) => void;
}

export default function CustomizationPanel({
  customization,
  onCustomizationChange,
}: CustomizationPanelProps) {
  // Update color
  const updateColor = (colorType: string, value: string) => {
    onCustomizationChange({
      ...customization,
      colors: {
        ...customization.colors,
        [colorType]: value,
      },
    });
  };

  // Update font
  const updateFont = (fontType: string, value: string) => {
    onCustomizationChange({
      ...customization,
      fonts: {
        ...customization.fonts,
        [fontType]: value,
      },
    });
  };

  // Toggle section visibility
  const toggleSection = (section: string) => {
    onCustomizationChange({
      ...customization,
      sections: {
        ...customization.sections,
        [section]: !customization.sections[section as keyof typeof customization.sections],
      },
    });
  };

  // Font options
  const fontOptions = [
    { value: 'Inter', label: 'Inter' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Open Sans', label: 'Open Sans' },
    { value: 'Lato', label: 'Lato' },
    { value: 'Poppins', label: 'Poppins' },
    { value: 'Montserrat', label: 'Montserrat' },
    { value: 'Playfair Display', label: 'Playfair Display' },
    { value: 'Merriweather', label: 'Merriweather' },
  ];

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      {/* Colors Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-5 h-5" style={{ color: '#D4A574' }} />
          <h3 className="text-[18px] font-semibold" style={{ color: '#1A1F2E' }}>
            Colors
          </h3>
        </div>

        <div className="space-y-4">
          {/* Primary Color */}
          <div>
            <label className="block text-[14px] font-medium mb-2" style={{ color: '#6B7280' }}>
              Primary Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={customization.colors.primary}
                onChange={(e) => updateColor('primary', e.target.value)}
                className="w-12 h-12 rounded-lg border cursor-pointer"
                style={{ borderColor: '#E5E7EB' }}
              />
              <input
                type="text"
                value={customization.colors.primary}
                onChange={(e) => updateColor('primary', e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border text-[14px] font-mono"
                style={{ borderColor: '#E5E7EB' }}
                placeholder="#000000"
              />
            </div>
          </div>

          {/* Accent Color */}
          <div>
            <label className="block text-[14px] font-medium mb-2" style={{ color: '#6B7280' }}>
              Accent Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={customization.colors.accent}
                onChange={(e) => updateColor('accent', e.target.value)}
                className="w-12 h-12 rounded-lg border cursor-pointer"
                style={{ borderColor: '#E5E7EB' }}
              />
              <input
                type="text"
                value={customization.colors.accent}
                onChange={(e) => updateColor('accent', e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border text-[14px] font-mono"
                style={{ borderColor: '#E5E7EB' }}
                placeholder="#000000"
              />
            </div>
          </div>

          {/* Background Color */}
          <div>
            <label className="block text-[14px] font-medium mb-2" style={{ color: '#6B7280' }}>
              Background Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={customization.colors.background}
                onChange={(e) => updateColor('background', e.target.value)}
                className="w-12 h-12 rounded-lg border cursor-pointer"
                style={{ borderColor: '#E5E7EB' }}
              />
              <input
                type="text"
                value={customization.colors.background}
                onChange={(e) => updateColor('background', e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border text-[14px] font-mono"
                style={{ borderColor: '#E5E7EB' }}
                placeholder="#FFFFFF"
              />
            </div>
          </div>

          {/* Text Color */}
          <div>
            <label className="block text-[14px] font-medium mb-2" style={{ color: '#6B7280' }}>
              Text Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={customization.colors.text}
                onChange={(e) => updateColor('text', e.target.value)}
                className="w-12 h-12 rounded-lg border cursor-pointer"
                style={{ borderColor: '#E5E7EB' }}
              />
              <input
                type="text"
                value={customization.colors.text}
                onChange={(e) => updateColor('text', e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border text-[14px] font-mono"
                style={{ borderColor: '#E5E7EB' }}
                placeholder="#000000"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t" style={{ borderColor: '#E5E7EB' }} />

      {/* Fonts Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Type className="w-5 h-5" style={{ color: '#D4A574' }} />
          <h3 className="text-[18px] font-semibold" style={{ color: '#1A1F2E' }}>
            Typography
          </h3>
        </div>

        <div className="space-y-4">
          {/* Heading Font */}
          <div>
            <label className="block text-[14px] font-medium mb-2" style={{ color: '#6B7280' }}>
              Heading Font
            </label>
            <select
              value={customization.fonts.heading}
              onChange={(e) => updateFont('heading', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border text-[14px]"
              style={{ borderColor: '#E5E7EB' }}
            >
              {fontOptions.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>
          </div>

          {/* Body Font */}
          <div>
            <label className="block text-[14px] font-medium mb-2" style={{ color: '#6B7280' }}>
              Body Font
            </label>
            <select
              value={customization.fonts.body}
              onChange={(e) => updateFont('body', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border text-[14px]"
              style={{ borderColor: '#E5E7EB' }}
            >
              {fontOptions.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t" style={{ borderColor: '#E5E7EB' }} />

      {/* Sections Visibility */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-5 h-5" style={{ color: '#D4A574' }} />
          <h3 className="text-[18px] font-semibold" style={{ color: '#1A1F2E' }}>
            Sections
          </h3>
        </div>

        <div className="space-y-3">
          {Object.entries(customization.sections).map(([section, enabled]) => (
            <div
              key={section}
              className="flex items-center justify-between p-3 rounded-lg"
              style={{ backgroundColor: '#F8FAFB' }}
            >
              <div className="flex items-center gap-2">
                {enabled ? (
                  <Eye className="w-4 h-4" style={{ color: '#10B981' }} />
                ) : (
                  <EyeOff className="w-4 h-4" style={{ color: '#6B7280' }} />
                )}
                <span className="text-[14px] font-medium capitalize" style={{ color: '#1A1F2E' }}>
                  {section}
                </span>
              </div>

              <button
                onClick={() => toggleSection(section)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                  enabled ? 'bg-[#D4A574]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                    enabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t" style={{ borderColor: '#E5E7EB' }} />

      {/* Layout Options */}
      <div>
        <h3 className="text-[18px] font-semibold mb-4" style={{ color: '#1A1F2E' }}>
          Layout
        </h3>

        <div className="space-y-2">
          {(['single-column', 'two-column', 'sidebar'] as const).map((layout) => (
            <button
              key={layout}
              onClick={() =>
                onCustomizationChange({
                  ...customization,
                  layout,
                })
              }
              className={`w-full p-3 rounded-lg border-2 text-left text-[14px] font-medium transition-all duration-200 ${
                customization.layout === layout
                  ? 'border-[#D4A574] bg-[#FEF3C7] bg-opacity-20'
                  : 'border-[#E5E7EB] hover:border-[#D4A574] hover:border-opacity-50'
              }`}
              style={{
                color: customization.layout === layout ? '#D4A574' : '#1A1F2E',
              }}
            >
              <span className="capitalize">{layout.replace('-', ' ')}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Dark Mode Toggle */}
      <div>
        <div
          className="flex items-center justify-between p-4 rounded-lg"
          style={{ backgroundColor: '#F8FAFB' }}
        >
          <span className="text-[14px] font-medium" style={{ color: '#1A1F2E' }}>
            Dark Mode
          </span>

          <button
            onClick={() =>
              onCustomizationChange({
                ...customization,
                darkMode: !customization.darkMode,
              })
            }
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
              customization.darkMode ? 'bg-[#D4A574]' : 'bg-gray-300'
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                customization.darkMode ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={() => {
          // You could add a reset to default customization here
          // For now, just show a message
          alert('Reset to default template customization');
        }}
        className="w-full px-4 py-2 rounded-lg border text-[14px] font-medium transition-colors duration-200"
        style={{
          borderColor: '#E5E7EB',
          color: '#6B7280',
        }}
      >
        Reset to Defaults
      </button>
    </div>
  );
}
