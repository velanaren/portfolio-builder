/**
 * Education Section
 * Manages multiple education entries
 */

'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Education } from '@/types';

interface EducationSectionProps {
  education: Education[];
  onChange: (education: Education[]) => void;
}

export default function EducationSection({ education, onChange }: EducationSectionProps) {
  const handleAdd = () => {
    const newEdu: Education = {
      id: `edu_${Date.now()}`,
      institution: '',
      degree: '',
      field: '',
      graduationDate: '',
    };
    onChange([...education, newEdu]);
  };

  const handleDelete = (id: string) => {
    onChange(education.filter(edu => edu.id !== id));
  };

  const handleChange = (id: string, field: keyof Education, value: string) => {
    onChange(
      education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    );
  };

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-6 pb-2 border-b-2 border-[#D4A574]">
        <h2 className="text-[20px] font-semibold text-[#0F1419] tracking-[-0.5px]">
          Education
        </h2>
      </div>

      <div className="space-y-4">
        {education.map((edu) => (
          <div
            key={edu.id}
            className="bg-[#F8FAFB] border-l-4 border-[#6366F1] rounded-lg p-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Institution */}
              <div>
                <label className="block text-[12px] font-semibold text-[#0F1419] mb-2 uppercase tracking-wide">
                  Institution *
                </label>
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) => handleChange(edu.id, 'institution', e.target.value)}
                  className="w-full rounded-lg bg-white px-4 py-3 text-[14px] text-[#0F1419] border border-[#E5E7EB] focus:border-[#D4A574] focus:ring-2 focus:ring-[#D4A574]/20 transition-all duration-300 outline-none"
                  placeholder="University Name"
                />
              </div>

              {/* Degree */}
              <div>
                <label className="block text-[12px] font-semibold text-[#0F1419] mb-2 uppercase tracking-wide">
                  Degree *
                </label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => handleChange(edu.id, 'degree', e.target.value)}
                  className="w-full rounded-lg bg-white px-4 py-3 text-[14px] text-[#0F1419] border border-[#E5E7EB] focus:border-[#D4A574] focus:ring-2 focus:ring-[#D4A574]/20 transition-all duration-300 outline-none"
                  placeholder="Bachelor's, Master's, etc."
                />
              </div>

              {/* Field of Study */}
              <div>
                <label className="block text-[12px] font-semibold text-[#0F1419] mb-2 uppercase tracking-wide">
                  Field of Study
                </label>
                <input
                  type="text"
                  value={edu.field}
                  onChange={(e) => handleChange(edu.id, 'field', e.target.value)}
                  className="w-full rounded-lg bg-white px-4 py-3 text-[14px] text-[#0F1419] border border-[#E5E7EB] focus:border-[#D4A574] focus:ring-2 focus:ring-[#D4A574]/20 transition-all duration-300 outline-none"
                  placeholder="Computer Science, Business, etc."
                />
              </div>

              {/* Graduation Date */}
              <div>
                <label className="block text-[12px] font-semibold text-[#0F1419] mb-2 uppercase tracking-wide">
                  Graduation Date
                </label>
                <input
                  type="text"
                  value={edu.graduationDate}
                  onChange={(e) => handleChange(edu.id, 'graduationDate', e.target.value)}
                  className="w-full rounded-lg bg-white px-4 py-3 text-[14px] text-[#0F1419] border border-[#E5E7EB] focus:border-[#D4A574] focus:ring-2 focus:ring-[#D4A574]/20 transition-all duration-300 outline-none"
                  placeholder="May 2020"
                />
              </div>
            </div>

            {/* Delete Button */}
            <div className="flex justify-end">
              <button
                onClick={() => handleDelete(edu.id)}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 text-[13px] font-semibold hover:text-red-700 transition-colors"
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
        <span>Add Education</span>
      </button>
    </section>
  );
}
