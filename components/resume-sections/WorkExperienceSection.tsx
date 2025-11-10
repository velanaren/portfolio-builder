/**
 * Work Experience Section
 * Manages multiple work experiences with AI enhancement (auto-apply)
 */

'use client';

import { useState } from 'react';
import { Plus, Trash2, Sparkles, Loader2, Copy, Check } from 'lucide-react';
import { WorkExperience } from '@/types';

interface WorkExperienceSectionProps {
  experiences: WorkExperience[];
  onChange: (experiences: WorkExperience[]) => void;
}

export default function WorkExperienceSection({ experiences, onChange }: WorkExperienceSectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(experiences[0]?.id || null);
  const [enhancingId, setEnhancingId] = useState<string | null>(null);
  const [enhanceStatus, setEnhanceStatus] = useState<{[key: string]: 'success' | 'error' | null}>({});

  const handleAdd = () => {
    const newExp: WorkExperience = {
      id: `exp_${Date.now()}`,
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    };
    onChange([...experiences, newExp]);
    setExpandedId(newExp.id);
  };

  const handleDelete = (id: string) => {
    onChange(experiences.filter(exp => exp.id !== id));
  };

  const handleDuplicate = (exp: WorkExperience) => {
    const newExp = { ...exp, id: `exp_${Date.now()}` };
    onChange([...experiences, newExp]);
    setExpandedId(newExp.id);
  };

  const handleChange = (id: string, field: keyof WorkExperience, value: any) => {
    onChange(
      experiences.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    );
  };

  const handleEnhance = async (exp: WorkExperience) => {
    if (!exp.description || exp.description.trim().length === 0) {
      alert('Please write a description first');
      return;
    }

    setEnhancingId(exp.id);
    setEnhanceStatus({ ...enhanceStatus, [exp.id]: null });

    try {
      const response = await fetch('/api/rewrite-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: exp.description,
          type: 'experience',
          context: `${exp.position} at ${exp.company}`,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Auto-apply: directly update the field
        handleChange(exp.id, 'description', data.rewritten);

        // Show success feedback
        setEnhanceStatus({ ...enhanceStatus, [exp.id]: 'success' });

        // Clear success message after 1.5 seconds
        setTimeout(() => {
          setEnhanceStatus(prev => ({ ...prev, [exp.id]: null }));
        }, 1500);
      } else {
        setEnhanceStatus({ ...enhanceStatus, [exp.id]: 'error' });
        setTimeout(() => {
          setEnhanceStatus(prev => ({ ...prev, [exp.id]: null }));
        }, 2000);
      }
    } catch (error) {
      console.error('Error enhancing description:', error);
      setEnhanceStatus({ ...enhanceStatus, [exp.id]: 'error' });
      setTimeout(() => {
        setEnhanceStatus(prev => ({ ...prev, [exp.id]: null }));
      }, 2000);
    } finally {
      setEnhancingId(null);
    }
  };

  return (
    <>
      <section className="mb-10">
        <div className="flex items-center justify-between mb-6 pb-2 border-b-2 border-[#D4A574]">
          <h2 className="text-[20px] font-semibold text-[#0F1419] tracking-[-0.5px]">
            Work Experience
          </h2>
        </div>

        <div className="space-y-4">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="bg-[#F8FAFB] border-l-4 border-[#D4A574] rounded-lg p-5"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Company */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#0F1419] mb-2 uppercase tracking-wide">
                    Company *
                  </label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => handleChange(exp.id, 'company', e.target.value)}
                    className="w-full rounded-lg bg-white px-4 py-3 text-[14px] text-[#0F1419] border border-[#E5E7EB] focus:border-[#D4A574] focus:ring-2 focus:ring-[#D4A574]/20 transition-all duration-300 outline-none"
                    placeholder="Company Name"
                  />
                </div>

                {/* Position */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#0F1419] mb-2 uppercase tracking-wide">
                    Position *
                  </label>
                  <input
                    type="text"
                    value={exp.position}
                    onChange={(e) => handleChange(exp.id, 'position', e.target.value)}
                    className="w-full rounded-lg bg-white px-4 py-3 text-[14px] text-[#0F1419] border border-[#E5E7EB] focus:border-[#D4A574] focus:ring-2 focus:ring-[#D4A574]/20 transition-all duration-300 outline-none"
                    placeholder="Job Title"
                  />
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#0F1419] mb-2 uppercase tracking-wide">
                    Start Date
                  </label>
                  <input
                    type="text"
                    value={exp.startDate}
                    onChange={(e) => handleChange(exp.id, 'startDate', e.target.value)}
                    className="w-full rounded-lg bg-white px-4 py-3 text-[14px] text-[#0F1419] border border-[#E5E7EB] focus:border-[#D4A574] focus:ring-2 focus:ring-[#D4A574]/20 transition-all duration-300 outline-none"
                    placeholder="Jan 2020"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#0F1419] mb-2 uppercase tracking-wide">
                    End Date
                  </label>
                  <input
                    type="text"
                    value={exp.endDate}
                    onChange={(e) => handleChange(exp.id, 'endDate', e.target.value)}
                    disabled={exp.current}
                    className="w-full rounded-lg bg-white px-4 py-3 text-[14px] text-[#0F1419] border border-[#E5E7EB] focus:border-[#D4A574] focus:ring-2 focus:ring-[#D4A574]/20 transition-all duration-300 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Dec 2023"
                  />
                </div>
              </div>

              {/* Currently Working */}
              <div className="mb-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exp.current}
                    onChange={(e) => handleChange(exp.id, 'current', e.target.checked)}
                    className="h-4 w-4 rounded border-[#E5E7EB] text-[#D4A574] focus:ring-[#D4A574]"
                  />
                  <span className="text-[14px] text-[#0F1419] font-medium">
                    Currently working here
                  </span>
                </label>
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-[12px] font-semibold text-[#0F1419] mb-2 uppercase tracking-wide">
                  Description
                </label>
                <textarea
                  value={exp.description}
                  onChange={(e) => handleChange(exp.id, 'description', e.target.value)}
                  rows={4}
                  className="w-full rounded-lg bg-white px-4 py-3 text-[14px] text-[#0F1419] border border-[#E5E7EB] focus:border-[#D4A574] focus:ring-2 focus:ring-[#D4A574]/20 transition-all duration-300 outline-none resize-none"
                  placeholder="Describe your responsibilities and achievements..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleEnhance(exp)}
                  disabled={enhancingId === exp.id}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-[13px] font-semibold transition-all duration-300 disabled:opacity-50 ${
                    enhanceStatus[exp.id] === 'success'
                      ? 'bg-green-500 text-white'
                      : enhanceStatus[exp.id] === 'error'
                      ? 'bg-red-500 text-white'
                      : 'bg-[#D4A574] text-[#0F1419] hover:bg-[#C89850]'
                  }`}
                >
                  {enhancingId === exp.id ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Enhancing...</span>
                    </>
                  ) : enhanceStatus[exp.id] === 'success' ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Enhanced!</span>
                    </>
                  ) : enhanceStatus[exp.id] === 'error' ? (
                    <>
                      <span>✕</span>
                      <span>Failed</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>Enhance</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDuplicate(exp)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white border border-[#E5E7EB] text-[#0F1419] text-[13px] font-semibold transition-all duration-300 hover:bg-[#F8FAFB]"
                >
                  <Copy className="h-4 w-4" />
                  <span>Duplicate</span>
                </button>

                <button
                  onClick={() => handleDelete(exp.id)}
                  className="ml-auto flex items-center space-x-2 px-4 py-2 text-red-600 text-[13px] font-semibold hover:text-red-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleAdd}
          className="w-full mt-4 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-[#D4A574] text-[#0F1419] text-[14px] font-semibold transition-all duration-300 hover:bg-[#C89850] hover:-translate-y-0.5 hover:shadow-md"
        >
          <Plus className="h-5 w-5" />
          <span>Add Experience</span>
        </button>
      </section>
    </>
  );
}
