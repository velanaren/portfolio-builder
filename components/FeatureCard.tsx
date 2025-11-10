/**
 * FeatureCard Component - Premium Design
 * Elegant card with sophisticated hover effects
 */

'use client';

import { useRouter } from 'next/navigation';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  route: string;
  delay?: string;
}

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  route,
  delay = '0ms',
}: FeatureCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(route);
  };

  return (
    <div
      className="group flex flex-col rounded-xl bg-white border border-[#E5E7EB] p-8 min-h-[280px] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] cursor-pointer opacity-0 animate-fade-in"
      style={{ animationDelay: delay, animationFillMode: 'forwards' }}
      onClick={handleClick}
    >
      {/* Icon */}
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#D4A574]/10">
        <Icon className="h-7 w-7 text-[#D4A574]" strokeWidth={2} />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {/* Title */}
        <h3 className="mb-3 text-[22px] font-semibold text-[#0F1419] tracking-[-0.5px]">
          {title}
        </h3>

        {/* Description */}
        <p className="mb-6 flex-grow text-[14px] text-[#6B7280] leading-relaxed">
          {description}
        </p>

        {/* Action Button */}
        <button
          className="w-full rounded-lg bg-[#D4A574] px-6 py-3 text-[14px] font-semibold text-[#0F1419] transition-all duration-300 hover:bg-[#C89850] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#D4A574] focus:ring-offset-2"
          aria-label={`Go to ${title}`}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
