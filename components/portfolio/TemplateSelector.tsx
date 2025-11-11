/**
 * TemplateSelector Component
 * Displays 4 portfolio templates for user selection
 */

'use client';

import { useState } from 'react';
import { Check, Eye } from 'lucide-react';
import { PortfolioTemplate } from '@/types';
import { PORTFOLIO_TEMPLATES } from '@/lib/portfolio/templates';

interface TemplateSelectorProps {
  selectedTemplate: PortfolioTemplate | null;
  onSelectTemplate: (template: PortfolioTemplate) => void;
}

export default function TemplateSelector({
  selectedTemplate,
  onSelectTemplate,
}: TemplateSelectorProps) {
  const [hoveredTemplate, setHoveredTemplate] = useState<PortfolioTemplate | null>(null);

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-[28px] font-semibold mb-2" style={{ color: '#1A1F2E' }}>
          Choose Your Portfolio Template
        </h2>
        <p className="text-[14px]" style={{ color: '#6B7280' }}>
          Select a professional template that matches your style
        </p>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PORTFOLIO_TEMPLATES.map((template) => {
          const isSelected = selectedTemplate === template.id;
          const isHovered = hoveredTemplate === template.id;

          return (
            <div
              key={template.id}
              onMouseEnter={() => setHoveredTemplate(template.id)}
              onMouseLeave={() => setHoveredTemplate(null)}
              className={`
                rounded-xl border-2 p-6 cursor-pointer transition-all duration-300
                ${
                  isSelected
                    ? 'border-[#D4A574] bg-[#FEF3C7] bg-opacity-20'
                    : isHovered
                    ? 'border-[#D4A574] border-opacity-50'
                    : 'border-[#E5E7EB]'
                }
              `}
              style={{ backgroundColor: isSelected ? undefined : '#FFFFFF' }}
              onClick={() => onSelectTemplate(template.id)}
            >
              {/* Template Preview Area */}
              <div
                className="rounded-lg mb-4 flex items-center justify-center relative overflow-hidden"
                style={{
                  height: '200px',
                  backgroundColor: template.defaultCustomization.colors.background,
                }}
              >
                {/* Simulated Template Preview */}
                <div className="absolute inset-0 p-4 space-y-2">
                  {/* Header */}
                  <div
                    className="h-3 rounded"
                    style={{
                      backgroundColor: template.defaultCustomization.colors.primary,
                      width: '40%',
                      opacity: 0.3,
                    }}
                  />

                  {/* Content Lines */}
                  <div className="space-y-1.5 mt-3">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="h-2 rounded"
                        style={{
                          backgroundColor: template.defaultCustomization.colors.text,
                          width: `${90 - i * 10}%`,
                          opacity: 0.2,
                        }}
                      />
                    ))}
                  </div>

                  {/* Accent Elements */}
                  <div className="flex gap-2 mt-4">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="h-6 w-6 rounded"
                        style={{
                          backgroundColor: template.defaultCustomization.colors.accent,
                          opacity: 0.4,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Preview Overlay on Hover */}
                {isHovered && !isSelected && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-white flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      <span className="font-medium">Preview</span>
                    </div>
                  </div>
                )}

                {/* Selected Badge */}
                {isSelected && (
                  <div className="absolute top-3 right-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: '#D4A574' }}
                    >
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  </div>
                )}
              </div>

              {/* Template Info */}
              <div className="mb-4">
                <h3 className="text-[20px] font-semibold mb-1" style={{ color: '#1A1F2E' }}>
                  {template.name}
                </h3>
                <p className="text-[14px] mb-3" style={{ color: '#6B7280' }}>
                  {template.description}
                </p>

                {/* Features */}
                <div className="space-y-1">
                  {template.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: '#D4A574' }}
                      />
                      <span className="text-[12px]" style={{ color: '#6B7280' }}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Select Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectTemplate(template.id);
                }}
                className={`
                  w-full py-2.5 rounded-lg font-semibold text-[14px] transition-all duration-200
                  ${isSelected ? 'opacity-100' : 'hover:scale-105'}
                `}
                style={{
                  backgroundColor: isSelected ? '#D4A574' : '#F8FAFB',
                  color: isSelected ? '#FFFFFF' : '#1A1F2E',
                }}
              >
                {isSelected ? 'Selected' : 'Select Template'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Help Text */}
      <div className="mt-8 text-center">
        <p className="text-[12px]" style={{ color: '#9CA3AF' }}>
          You can customize colors, fonts, and layout after selecting a template
        </p>
      </div>
    </div>
  );
}
