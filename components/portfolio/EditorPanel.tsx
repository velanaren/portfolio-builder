/**
 * EditorPanel Component
 * Content editing interface for portfolio sections with AI enhancement
 */

'use client';

import { useState } from 'react';
import { PortfolioContent } from '@/types';
import { Sparkles, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface EditorPanelProps {
  content: PortfolioContent;
  onContentChange: (content: PortfolioContent) => void;
}

export default function EditorPanel({ content, onContentChange }: EditorPanelProps) {
  const [enhancingSection, setEnhancingSection] = useState<string | null>(null);

  // AI Enhancement Handler
  const handleAIEnhance = async (section: string, text: string, context?: string, itemIndex?: number) => {
    if (!text.trim()) {
      toast.error('Please enter some content first');
      return;
    }

    const enhanceKey = itemIndex !== undefined ? `${section}-${itemIndex}` : section;
    setEnhancingSection(enhanceKey);

    try {
      const response = await fetch('/api/rewrite-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          type: section === 'about' ? 'summary' : section === 'project' ? 'project' : 'experience',
          context,
        }),
      });

      const data = await response.json();

      if (data.success && data.rewritten) {
        // Apply the enhanced content
        const updatedContent = { ...content };

        if (section === 'about') {
          updatedContent.sections.about.content = data.rewritten;
        } else if (section === 'project' && itemIndex !== undefined) {
          updatedContent.sections.projects.items[itemIndex].description = data.rewritten;
        } else if (section === 'experience' && itemIndex !== undefined) {
          updatedContent.sections.experience.items[itemIndex].description = data.rewritten;
        }

        onContentChange(updatedContent);
        toast.success('Content enhanced successfully!');
      } else {
        toast.error('Failed to enhance content');
      }
    } catch (error) {
      toast.error('Failed to enhance content');
    } finally {
      setEnhancingSection(null);
    }
  };

  // Update handlers
  const updatePersonalInfo = (field: string, value: string) => {
    onContentChange({
      ...content,
      personalInfo: {
        ...content.personalInfo,
        [field]: value,
      },
    });
  };

  const updateAbout = (text: string) => {
    onContentChange({
      ...content,
      sections: {
        ...content.sections,
        about: {
          ...content.sections.about,
          content: text,
        },
      },
    });
  };

  const addProject = () => {
    onContentChange({
      ...content,
      sections: {
        ...content.sections,
        projects: {
          ...content.sections.projects,
          items: [
            ...content.sections.projects.items,
            {
              id: Date.now().toString(),
              name: '',
              description: '',
              technologies: [],
              url: '',
              imageUrl: '',
            },
          ],
        },
      },
    });
  };

  const updateProject = (index: number, field: string, value: any) => {
    const updatedProjects = [...content.sections.projects.items];
    updatedProjects[index] = {
      ...updatedProjects[index],
      [field]: value,
    };

    onContentChange({
      ...content,
      sections: {
        ...content.sections,
        projects: {
          ...content.sections.projects,
          items: updatedProjects,
        },
      },
    });
  };

  const removeProject = (index: number) => {
    onContentChange({
      ...content,
      sections: {
        ...content.sections,
        projects: {
          ...content.sections.projects,
          items: content.sections.projects.items.filter((_, i) => i !== index),
        },
      },
    });
  };

  // Experience handlers
  const addExperience = () => {
    onContentChange({
      ...content,
      sections: {
        ...content.sections,
        experience: {
          ...content.sections.experience,
          items: [
            ...content.sections.experience.items,
            {
              id: Date.now().toString(),
              position: '',
              company: '',
              duration: '',
              description: '',
            },
          ],
        },
      },
    });
  };

  const updateExperience = (index: number, field: string, value: string) => {
    const updatedExperience = [...content.sections.experience.items];
    updatedExperience[index] = {
      ...updatedExperience[index],
      [field]: value,
    };

    onContentChange({
      ...content,
      sections: {
        ...content.sections,
        experience: {
          ...content.sections.experience,
          items: updatedExperience,
        },
      },
    });
  };

  const removeExperience = (index: number) => {
    onContentChange({
      ...content,
      sections: {
        ...content.sections,
        experience: {
          ...content.sections.experience,
          items: content.sections.experience.items.filter((_, i) => i !== index),
        },
      },
    });
  };

  // Education handlers
  const addEducation = () => {
    onContentChange({
      ...content,
      sections: {
        ...content.sections,
        education: {
          ...content.sections.education,
          items: [
            ...content.sections.education.items,
            {
              id: Date.now().toString(),
              degree: '',
              field: '',
              school: '',
              year: '',
            },
          ],
        },
      },
    });
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const updatedEducation = [...content.sections.education.items];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value,
    };

    onContentChange({
      ...content,
      sections: {
        ...content.sections,
        education: {
          ...content.sections.education,
          items: updatedEducation,
        },
      },
    });
  };

  const removeEducation = (index: number) => {
    onContentChange({
      ...content,
      sections: {
        ...content.sections,
        education: {
          ...content.sections.education,
          items: content.sections.education.items.filter((_, i) => i !== index),
        },
      },
    });
  };

  // Skills handlers
  const addSkill = () => {
    onContentChange({
      ...content,
      sections: {
        ...content.sections,
        skills: {
          ...content.sections.skills,
          items: [...content.sections.skills.items, ''],
        },
      },
    });
  };

  const updateSkill = (index: number, value: string) => {
    const updatedSkills = [...content.sections.skills.items];
    updatedSkills[index] = value;

    onContentChange({
      ...content,
      sections: {
        ...content.sections,
        skills: {
          ...content.sections.skills,
          items: updatedSkills,
        },
      },
    });
  };

  const removeSkill = (index: number) => {
    onContentChange({
      ...content,
      sections: {
        ...content.sections,
        skills: {
          ...content.sections.skills,
          items: content.sections.skills.items.filter((_, i) => i !== index),
        },
      },
    });
  };

  return (
    <div className="h-full overflow-y-auto p-6 space-y-8">
      {/* Personal Info Section */}
      <div>
        <h3 className="text-[18px] font-semibold mb-4" style={{ color: '#1A1F2E' }}>
          Personal Information
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-[14px] font-medium mb-2" style={{ color: '#6B7280' }}>
              Name
            </label>
            <input
              type="text"
              value={content.personalInfo.name}
              onChange={(e) => updatePersonalInfo('name', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border"
              style={{ borderColor: '#E5E7EB' }}
            />
          </div>

          <div>
            <label className="block text-[14px] font-medium mb-2" style={{ color: '#6B7280' }}>
              Title
            </label>
            <input
              type="text"
              value={content.personalInfo.title}
              onChange={(e) => updatePersonalInfo('title', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border"
              style={{ borderColor: '#E5E7EB' }}
              placeholder="e.g., Full Stack Developer"
            />
          </div>

          <div>
            <label className="block text-[14px] font-medium mb-2" style={{ color: '#6B7280' }}>
              Email
            </label>
            <input
              type="email"
              value={content.personalInfo.email}
              onChange={(e) => updatePersonalInfo('email', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border"
              style={{ borderColor: '#E5E7EB' }}
            />
          </div>

          <div>
            <label className="block text-[14px] font-medium mb-2" style={{ color: '#6B7280' }}>
              Phone
            </label>
            <input
              type="tel"
              value={content.personalInfo.phone}
              onChange={(e) => updatePersonalInfo('phone', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border"
              style={{ borderColor: '#E5E7EB' }}
            />
          </div>

          <div>
            <label className="block text-[14px] font-medium mb-2" style={{ color: '#6B7280' }}>
              Location
            </label>
            <input
              type="text"
              value={content.personalInfo.location}
              onChange={(e) => updatePersonalInfo('location', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border"
              style={{ borderColor: '#E5E7EB' }}
              placeholder="e.g., San Francisco, CA"
            />
          </div>
        </div>
      </div>

      {/* About Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[18px] font-semibold" style={{ color: '#1A1F2E' }}>
            About Me
          </h3>
          <button
            onClick={() => handleAIEnhance('about', content.sections.about.content)}
            disabled={enhancingSection === 'about'}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-200"
            style={{
              backgroundColor: enhancingSection === 'about' ? '#E5E7EB' : '#D4A574',
              color: '#FFFFFF',
            }}
          >
            {enhancingSection === 'about' ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Enhancing...
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3" />
                AI Enhance
              </>
            )}
          </button>
        </div>

        <textarea
          value={content.sections.about.content}
          onChange={(e) => updateAbout(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border min-h-[120px]"
          style={{ borderColor: '#E5E7EB' }}
          placeholder="Write a brief introduction about yourself..."
        />
      </div>

      {/* Projects Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[18px] font-semibold" style={{ color: '#1A1F2E' }}>
            Projects
          </h3>
          <button
            onClick={addProject}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-medium"
            style={{ backgroundColor: '#D4A574', color: '#FFFFFF' }}
          >
            <Plus className="w-3 h-3" />
            Add Project
          </button>
        </div>

        <div className="space-y-4">
          {content.sections.projects.items.map((project, index) => (
            <div
              key={project.id}
              className="p-4 rounded-lg border"
              style={{ borderColor: '#E5E7EB', backgroundColor: '#F8FAFB' }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12px] font-medium" style={{ color: '#6B7280' }}>
                  Project {index + 1}
                </span>
                <button
                  onClick={() => removeProject(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  value={project.name}
                  onChange={(e) => updateProject(index, 'name', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border text-[14px]"
                  style={{ borderColor: '#E5E7EB' }}
                  placeholder="Project Name"
                />

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[12px] font-medium" style={{ color: '#6B7280' }}>
                      Description
                    </label>
                    <button
                      onClick={() =>
                        handleAIEnhance('project', project.description, project.name, index)
                      }
                      disabled={enhancingSection === `project-${index}`}
                      className="flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-all duration-200"
                      style={{
                        backgroundColor:
                          enhancingSection === `project-${index}` ? '#E5E7EB' : '#D4A574',
                        color: '#FFFFFF',
                      }}
                    >
                      {enhancingSection === `project-${index}` ? (
                        <>
                          <div className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Enhancing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-2.5 h-2.5" />
                          AI Enhance
                        </>
                      )}
                    </button>
                  </div>
                  <textarea
                    value={project.description}
                    onChange={(e) => updateProject(index, 'description', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border text-[14px] min-h-[80px]"
                    style={{ borderColor: '#E5E7EB' }}
                    placeholder="Project Description"
                  />
                </div>

                <input
                  type="text"
                  value={project.technologies.join(', ')}
                  onChange={(e) =>
                    updateProject(
                      index,
                      'technologies',
                      e.target.value.split(',').map((t) => t.trim())
                    )
                  }
                  className="w-full px-3 py-2 rounded-lg border text-[14px]"
                  style={{ borderColor: '#E5E7EB' }}
                  placeholder="Technologies (comma-separated)"
                />

                <input
                  type="url"
                  value={project.url || ''}
                  onChange={(e) => updateProject(index, 'url', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border text-[14px]"
                  style={{ borderColor: '#E5E7EB' }}
                  placeholder="Project URL (optional)"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Experience Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[18px] font-semibold" style={{ color: '#1A1F2E' }}>
            Work Experience
          </h3>
          <button
            onClick={addExperience}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-medium"
            style={{ backgroundColor: '#D4A574', color: '#FFFFFF' }}
          >
            <Plus className="w-3 h-3" />
            Add Experience
          </button>
        </div>

        <div className="space-y-4">
          {content.sections.experience.items.map((exp, index) => (
            <div
              key={exp.id}
              className="p-4 rounded-lg border"
              style={{ borderColor: '#E5E7EB', backgroundColor: '#F8FAFB' }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12px] font-medium" style={{ color: '#6B7280' }}>
                  Experience {index + 1}
                </span>
                <button
                  onClick={() => removeExperience(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  value={exp.position}
                  onChange={(e) => updateExperience(index, 'position', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border text-[14px]"
                  style={{ borderColor: '#E5E7EB' }}
                  placeholder="Position/Job Title"
                />

                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => updateExperience(index, 'company', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border text-[14px]"
                  style={{ borderColor: '#E5E7EB' }}
                  placeholder="Company Name"
                />

                <input
                  type="text"
                  value={exp.duration}
                  onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border text-[14px]"
                  style={{ borderColor: '#E5E7EB' }}
                  placeholder="Duration (e.g., Jan 2020 - Present)"
                />

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[12px] font-medium" style={{ color: '#6B7280' }}>
                      Description
                    </label>
                    <button
                      onClick={() =>
                        handleAIEnhance(
                          'experience',
                          exp.description,
                          `${exp.position} at ${exp.company}`,
                          index
                        )
                      }
                      disabled={enhancingSection === `experience-${index}`}
                      className="flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-all duration-200"
                      style={{
                        backgroundColor:
                          enhancingSection === `experience-${index}` ? '#E5E7EB' : '#D4A574',
                        color: '#FFFFFF',
                      }}
                    >
                      {enhancingSection === `experience-${index}` ? (
                        <>
                          <div className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Enhancing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-2.5 h-2.5" />
                          AI Enhance
                        </>
                      )}
                    </button>
                  </div>
                  <textarea
                    value={exp.description}
                    onChange={(e) => updateExperience(index, 'description', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border text-[14px] min-h-[80px]"
                    style={{ borderColor: '#E5E7EB' }}
                    placeholder="Describe your responsibilities and achievements..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[18px] font-semibold" style={{ color: '#1A1F2E' }}>
            Education
          </h3>
          <button
            onClick={addEducation}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-medium"
            style={{ backgroundColor: '#D4A574', color: '#FFFFFF' }}
          >
            <Plus className="w-3 h-3" />
            Add Education
          </button>
        </div>

        <div className="space-y-4">
          {content.sections.education.items.map((edu, index) => (
            <div
              key={edu.id}
              className="p-4 rounded-lg border"
              style={{ borderColor: '#E5E7EB', backgroundColor: '#F8FAFB' }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12px] font-medium" style={{ color: '#6B7280' }}>
                  Education {index + 1}
                </span>
                <button
                  onClick={() => removeEducation(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border text-[14px]"
                  style={{ borderColor: '#E5E7EB' }}
                  placeholder="Degree (e.g., Bachelor of Science)"
                />

                <input
                  type="text"
                  value={edu.field}
                  onChange={(e) => updateEducation(index, 'field', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border text-[14px]"
                  style={{ borderColor: '#E5E7EB' }}
                  placeholder="Field of Study (e.g., Computer Science)"
                />

                <input
                  type="text"
                  value={edu.school}
                  onChange={(e) => updateEducation(index, 'school', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border text-[14px]"
                  style={{ borderColor: '#E5E7EB' }}
                  placeholder="School/University Name"
                />

                <input
                  type="text"
                  value={edu.year || ''}
                  onChange={(e) => updateEducation(index, 'year', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border text-[14px]"
                  style={{ borderColor: '#E5E7EB' }}
                  placeholder="Year (e.g., 2020 or 2016-2020)"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[18px] font-semibold" style={{ color: '#1A1F2E' }}>
            Skills
          </h3>
          <button
            onClick={addSkill}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-medium"
            style={{ backgroundColor: '#D4A574', color: '#FFFFFF' }}
          >
            <Plus className="w-3 h-3" />
            Add Skill
          </button>
        </div>

        <div className="space-y-2">
          {content.sections.skills.items.map((skill, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={skill}
                onChange={(e) => updateSkill(index, e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border text-[14px]"
                style={{ borderColor: '#E5E7EB' }}
                placeholder="Enter a skill (e.g., React, Python, AWS)"
              />
              <button
                onClick={() => removeSkill(index)}
                className="text-red-500 hover:text-red-700 p-2"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Social Links Section */}
      <div>
        <h3 className="text-[18px] font-semibold mb-4" style={{ color: '#1A1F2E' }}>
          Social Links
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-[14px] font-medium mb-2" style={{ color: '#6B7280' }}>
              GitHub
            </label>
            <input
              type="url"
              value={content.socialLinks.github || ''}
              onChange={(e) =>
                onContentChange({
                  ...content,
                  socialLinks: { ...content.socialLinks, github: e.target.value },
                })
              }
              className="w-full px-4 py-2 rounded-lg border"
              style={{ borderColor: '#E5E7EB' }}
              placeholder="https://github.com/username"
            />
          </div>

          <div>
            <label className="block text-[14px] font-medium mb-2" style={{ color: '#6B7280' }}>
              LinkedIn
            </label>
            <input
              type="url"
              value={content.socialLinks.linkedin || ''}
              onChange={(e) =>
                onContentChange({
                  ...content,
                  socialLinks: { ...content.socialLinks, linkedin: e.target.value },
                })
              }
              className="w-full px-4 py-2 rounded-lg border"
              style={{ borderColor: '#E5E7EB' }}
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          <div>
            <label className="block text-[14px] font-medium mb-2" style={{ color: '#6B7280' }}>
              Twitter
            </label>
            <input
              type="url"
              value={content.socialLinks.twitter || ''}
              onChange={(e) =>
                onContentChange({
                  ...content,
                  socialLinks: { ...content.socialLinks, twitter: e.target.value },
                })
              }
              className="w-full px-4 py-2 rounded-lg border"
              style={{ borderColor: '#E5E7EB' }}
              placeholder="https://twitter.com/username"
            />
          </div>

          <div>
            <label className="block text-[14px] font-medium mb-2" style={{ color: '#6B7280' }}>
              Website
            </label>
            <input
              type="url"
              value={content.socialLinks.website || ''}
              onChange={(e) =>
                onContentChange({
                  ...content,
                  socialLinks: { ...content.socialLinks, website: e.target.value },
                })
              }
              className="w-full px-4 py-2 rounded-lg border"
              style={{ borderColor: '#E5E7EB' }}
              placeholder="https://yourwebsite.com"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
