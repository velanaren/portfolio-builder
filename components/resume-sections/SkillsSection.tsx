/**
 * Skills Section
 * Manages skills with AI-powered suggestions
 */

'use client';

import { useState, KeyboardEvent } from 'react';
import { X, Plus, Sparkles, Loader2 } from 'lucide-react';

interface SkillsSectionProps {
  skills: string[];
  onChange: (skills: string[]) => void;
  summary?: string;
}

export default function SkillsSection({ skills, onChange, summary }: SkillsSectionProps) {
  const [newSkill, setNewSkill] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleAdd = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      onChange([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleRemove = (skillToRemove: string) => {
    onChange(skills.filter(skill => skill !== skillToRemove));
  };

  const handleEnhance = async () => {
    setIsEnhancing(true);

    try {
      const response = await fetch('/api/rewrite-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: skills.join(', '),
          type: 'skill',
          context: summary || '',
        }),
      });

      const data = await response.json();

      if (data.success) {
        const suggestedSkills = data.rewritten
          .split(',')
          .map((s: string) => s.trim())
          .filter((s: string) => s && !skills.includes(s));

        setSuggestions(suggestedSkills);
        setShowSuggestions(true);
      } else {
        alert('Failed to get skill suggestions. Please try again.');
      }
    } catch (error) {
      console.error('Error getting skill suggestions:', error);
      alert('Failed to get skill suggestions. Please try again.');
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleAddSuggestion = (skill: string) => {
    if (!skills.includes(skill)) {
      onChange([...skills, skill]);
    }
    setSuggestions(suggestions.filter(s => s !== skill));
  };

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-6 pb-2 border-b-2 border-[#D4A574]">
        <div>
          <h2 className="text-[20px] font-semibold text-[#0F1419] tracking-[-0.5px]">
            Skills
          </h2>
          <p className="text-[12px] text-[#6B7280] mt-1">
            Add technical and professional skills
          </p>
        </div>
      </div>

      {/* Current Skills */}
      <div className="mb-4">
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#EDE9FE] text-[#6366F1] rounded-full text-[12px] font-medium"
              >
                {skill}
                <button
                  onClick={() => handleRemove(skill)}
                  className="hover:text-[#4F46E5] transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Add Skill Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 rounded-lg bg-[#F8FAFB] px-4 py-3 text-[14px] text-[#0F1419] border border-[#E5E7EB] focus:bg-white focus:border-[#D4A574] focus:ring-2 focus:ring-[#D4A574]/20 transition-all duration-300 outline-none"
            placeholder="Add a skill..."
          />
          <button
            onClick={handleAdd}
            disabled={!newSkill.trim()}
            className="px-4 py-3 rounded-lg bg-[#D4A574] text-[#0F1419] font-semibold transition-all duration-300 hover:bg-[#C89850] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* AI Enhance Button */}
      <button
        onClick={handleEnhance}
        disabled={isEnhancing || skills.length === 0}
        className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-[#D4A574] text-[#0F1419] text-[14px] font-semibold transition-all duration-300 hover:bg-[#C89850] hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isEnhancing ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Getting Suggestions...</span>
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5" />
            <span>Enhance Skills with AI</span>
          </>
        )}
      </button>

      {/* AI Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="mt-4 p-4 bg-[#FFFBF7] border-2 border-[#D4A574] rounded-lg">
          <h3 className="text-[14px] font-semibold text-[#0F1419] mb-3">
            ✨ AI Suggested Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((skill, index) => (
              <button
                key={index}
                onClick={() => handleAddSuggestion(skill)}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-[#D4A574] text-[#0F1419] rounded-full text-[12px] font-medium hover:bg-[#D4A574] hover:text-white transition-all duration-200"
              >
                <Plus className="h-3 w-3" />
                {skill}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowSuggestions(false)}
            className="mt-3 text-[12px] text-[#6B7280] hover:text-[#0F1419] transition-colors"
          >
            Close suggestions
          </button>
        </div>
      )}
    </section>
  );
}
