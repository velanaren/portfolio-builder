/**
 * Personal Information Section
 * Editable personal details
 */

'use client';

import { PersonalInfo } from '@/types';

interface PersonalInfoSectionProps {
  data: PersonalInfo;
  onChange: (field: keyof PersonalInfo, value: string) => void;
}

export default function PersonalInfoSection({ data, onChange }: PersonalInfoSectionProps) {
  return (
    <section className="mb-10">
      <h2 className="text-[20px] font-semibold text-[#0F1419] mb-6 tracking-[-0.5px] pb-2 border-b-2 border-[#D4A574]">
        Personal Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label className="block text-[12px] font-semibold text-[#0F1419] mb-2 uppercase tracking-wide">
            Full Name *
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => onChange('name', e.target.value)}
            required
            className="w-full rounded-lg bg-[#F8FAFB] px-4 py-3 text-[14px] text-[#0F1419] border border-[#E5E7EB] focus:bg-white focus:border-[#D4A574] focus:ring-2 focus:ring-[#D4A574]/20 transition-all duration-300 outline-none"
            placeholder="John Doe"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-[12px] font-semibold text-[#0F1419] mb-2 uppercase tracking-wide">
            Email *
          </label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => onChange('email', e.target.value)}
            required
            className="w-full rounded-lg bg-[#F8FAFB] px-4 py-3 text-[14px] text-[#0F1419] border border-[#E5E7EB] focus:bg-white focus:border-[#D4A574] focus:ring-2 focus:ring-[#D4A574]/20 transition-all duration-300 outline-none"
            placeholder="john@example.com"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-[12px] font-semibold text-[#0F1419] mb-2 uppercase tracking-wide">
            Phone
          </label>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            className="w-full rounded-lg bg-[#F8FAFB] px-4 py-3 text-[14px] text-[#0F1419] border border-[#E5E7EB] focus:bg-white focus:border-[#D4A574] focus:ring-2 focus:ring-[#D4A574]/20 transition-all duration-300 outline-none"
            placeholder="+1 (555) 000-0000"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-[12px] font-semibold text-[#0F1419] mb-2 uppercase tracking-wide">
            Location
          </label>
          <input
            type="text"
            value={data.location}
            onChange={(e) => onChange('location', e.target.value)}
            className="w-full rounded-lg bg-[#F8FAFB] px-4 py-3 text-[14px] text-[#0F1419] border border-[#E5E7EB] focus:bg-white focus:border-[#D4A574] focus:ring-2 focus:ring-[#D4A574]/20 transition-all duration-300 outline-none"
            placeholder="San Francisco, CA"
          />
        </div>

        {/* LinkedIn */}
        <div>
          <label className="block text-[12px] font-semibold text-[#0F1419] mb-2 uppercase tracking-wide">
            LinkedIn URL
          </label>
          <input
            type="url"
            value={data.linkedin || ''}
            onChange={(e) => onChange('linkedin', e.target.value)}
            className="w-full rounded-lg bg-[#F8FAFB] px-4 py-3 text-[14px] text-[#0F1419] border border-[#E5E7EB] focus:bg-white focus:border-[#D4A574] focus:ring-2 focus:ring-[#D4A574]/20 transition-all duration-300 outline-none"
            placeholder="linkedin.com/in/johndoe"
          />
        </div>

        {/* Portfolio */}
        <div>
          <label className="block text-[12px] font-semibold text-[#0F1419] mb-2 uppercase tracking-wide">
            Portfolio URL
          </label>
          <input
            type="url"
            value={data.website || ''}
            onChange={(e) => onChange('website', e.target.value)}
            className="w-full rounded-lg bg-[#F8FAFB] px-4 py-3 text-[14px] text-[#0F1419] border border-[#E5E7EB] focus:bg-white focus:border-[#D4A574] focus:ring-2 focus:ring-[#D4A574]/20 transition-all duration-300 outline-none"
            placeholder="johndoe.com"
          />
        </div>
      </div>
    </section>
  );
}
