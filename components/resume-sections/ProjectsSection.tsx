/**
 * Projects Section
 * Manages multiple project entries with AI enhancement
 */

'use client';

import { useState } from 'react';
import { Plus, Trash2, Sparkles, Loader2, Copy, ExternalLink } from 'lucide-react';
import { Project } from '@/types';
import ComparisonModal from '../ComparisonModal';

interface ProjectsSectionProps {
  projects: Project[];
  onChange: (projects: Project[]) => void;
}

export default function ProjectsSection({ projects, onChange }: ProjectsSectionProps) {
  const [enhancingId, setEnhancingId] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [rewrittenText, setRewrittenText] = useState('');

  const handleAdd = () => {
    const newProject: Project = {
      id: `proj_${Date.now()}`,
      name: '',
      description: '',
      technologies: [],
      url: '',
      startDate: '',
      endDate: '',
    };
    onChange([...projects, newProject]);
  };

  const handleDelete = (id: string) => {
    onChange(projects.filter(proj => proj.id !== id));
  };

  const handleDuplicate = (proj: Project) => {
    const newProject = { ...proj, id: `proj_${Date.now()}` };
    onChange([...projects, newProject]);
  };

  const handleChange = (id: string, field: keyof Project, value: any) => {
    onChange(
      projects.map(proj =>
        proj.id === id ? { ...proj, [field]: value } : proj
      )
    );
  };

  const handleTechnologiesChange = (id: string, value: string) => {
    // Convert comma-separated string to array
    const techArray = value.split(',').map(t => t.trim()).filter(t => t.length > 0);
    handleChange(id, 'technologies', techArray);
  };

  const handleEnhance = async (proj: Project) => {
    if (!proj.description || proj.description.trim().length === 0) {
      alert('Please write a description first');
      return;
    }

    setEnhancingId(proj.id);

    try {
      const response = await fetch('/api/rewrite-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: proj.description,
          type: 'project',
          context: `${proj.name} using ${proj.technologies.join(', ')}`,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setRewrittenText(data.rewritten);
        setCurrentProjectId(proj.id);
        setShowComparison(true);
      } else {
        alert('Failed to enhance description. Please try again.');
      }
    } catch (error) {
      console.error('Error enhancing description:', error);
      alert('Failed to enhance description. Please try again.');
    } finally {
      setEnhancingId(null);
    }
  };

  const handleAccept = () => {
    if (currentProjectId) {
      handleChange(currentProjectId, 'description', rewrittenText);
    }
    setShowComparison(false);
    setCurrentProjectId(null);
  };

  const handleReject = () => {
    setShowComparison(false);
    setCurrentProjectId(null);
  };

  return (
    <>
      <section className="mb-10">
        <div className="flex items-center justify-between mb-6 pb-2 border-b-2 border-[#D4A574]">
          <h2 className="text-[20px] font-semibold text-[#0F1419] tracking-[-0.5px]">
            Projects
          </h2>
        </div>

        <div className="space-y-4">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="bg-[#F8FAFB] border-l-4 border-[#D4A574] rounded-lg p-5"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Project Name */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#0F1419] mb-2 uppercase tracking-wide">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    value={proj.name}
                    onChange={(e) => handleChange(proj.id, 'name', e.target.value)}
                    className="w-full rounded-lg bg-white px-4 py-3 text-[14px] text-[#0F1419] border border-[#E5E7EB] focus:border-[#D4A574] focus:ring-2 focus:ring-[#D4A574]/20 transition-all duration-300 outline-none"
                    placeholder="E-commerce Platform"
                  />
                </div>

                {/* Project URL */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#0F1419] mb-2 uppercase tracking-wide">
                    Project URL
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={proj.url}
                      onChange={(e) => handleChange(proj.id, 'url', e.target.value)}
                      className="w-full rounded-lg bg-white px-4 py-3 pr-10 text-[14px] text-[#0F1419] border border-[#E5E7EB] focus:border-[#D4A574] focus:ring-2 focus:ring-[#D4A574]/20 transition-all duration-300 outline-none"
                      placeholder="https://github.com/username/project"
                    />
                    {proj.url && (
                      <ExternalLink className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
                    )}
                  </div>
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#0F1419] mb-2 uppercase tracking-wide">
                    Start Date
                  </label>
                  <input
                    type="text"
                    value={proj.startDate}
                    onChange={(e) => handleChange(proj.id, 'startDate', e.target.value)}
                    className="w-full rounded-lg bg-white px-4 py-3 text-[14px] text-[#0F1419] border border-[#E5E7EB] focus:border-[#D4A574] focus:ring-2 focus:ring-[#D4A574]/20 transition-all duration-300 outline-none"
                    placeholder="Jan 2023"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#0F1419] mb-2 uppercase tracking-wide">
                    End Date
                  </label>
                  <input
                    type="text"
                    value={proj.endDate}
                    onChange={(e) => handleChange(proj.id, 'endDate', e.target.value)}
                    className="w-full rounded-lg bg-white px-4 py-3 text-[14px] text-[#0F1419] border border-[#E5E7EB] focus:border-[#D4A574] focus:ring-2 focus:ring-[#D4A574]/20 transition-all duration-300 outline-none"
                    placeholder="Mar 2023"
                  />
                </div>
              </div>

              {/* Technologies */}
              <div className="mb-4">
                <label className="block text-[12px] font-semibold text-[#0F1419] mb-2 uppercase tracking-wide">
                  Technologies (comma-separated)
                </label>
                <input
                  type="text"
                  value={proj.technologies.join(', ')}
                  onChange={(e) => handleTechnologiesChange(proj.id, e.target.value)}
                  className="w-full rounded-lg bg-white px-4 py-3 text-[14px] text-[#0F1419] border border-[#E5E7EB] focus:border-[#D4A574] focus:ring-2 focus:ring-[#D4A574]/20 transition-all duration-300 outline-none"
                  placeholder="React, Node.js, MongoDB, AWS"
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-[12px] font-semibold text-[#0F1419] mb-2 uppercase tracking-wide">
                  Description
                </label>
                <textarea
                  value={proj.description}
                  onChange={(e) => handleChange(proj.id, 'description', e.target.value)}
                  rows={4}
                  className="w-full rounded-lg bg-white px-4 py-3 text-[14px] text-[#0F1419] border border-[#E5E7EB] focus:border-[#D4A574] focus:ring-2 focus:ring-[#D4A574]/20 transition-all duration-300 outline-none resize-none"
                  placeholder="Describe the project, your role, challenges faced, and the impact..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleEnhance(proj)}
                  disabled={enhancingId === proj.id}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#D4A574] text-[#0F1419] text-[13px] font-semibold transition-all duration-300 hover:bg-[#C89850] disabled:opacity-50"
                >
                  {enhancingId === proj.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  <span>Enhance</span>
                </button>

                <button
                  onClick={() => handleDuplicate(proj)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white border border-[#E5E7EB] text-[#0F1419] text-[13px] font-semibold transition-all duration-300 hover:bg-[#F8FAFB]"
                >
                  <Copy className="h-4 w-4" />
                  <span>Duplicate</span>
                </button>

                <button
                  onClick={() => handleDelete(proj.id)}
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
          <span>Add Project</span>
        </button>
      </section>

      <ComparisonModal
        isOpen={showComparison}
        original={projects.find(p => p.id === currentProjectId)?.description || ''}
        rewritten={rewrittenText}
        onAccept={handleAccept}
        onReject={handleReject}
        onClose={handleReject}
      />
    </>
  );
}
