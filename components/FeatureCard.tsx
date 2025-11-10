/**
 * FeatureCard Component - Senior Design Engineer Level
 * Beautifully animated card with professional hover effects
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
      className="group flex flex-col rounded-xl bg-white p-7 shadow-sm transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl cursor-pointer opacity-0 animate-fade-in relative overflow-hidden"
      style={{ animationDelay: delay, animationFillMode: 'forwards' }}
      onClick={handleClick}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
          <Icon className="h-6 w-6" strokeWidth={2} />
        </div>

        {/* Title */}
        <h3 className="mb-2.5 text-xl font-bold text-gray-900 tracking-tight">
          {title}
        </h3>

        {/* Description */}
        <p className="mb-6 flex-grow text-sm text-gray-600 leading-relaxed">
          {description}
        </p>

        {/* Action Button */}
        <button
          className="w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-indigo-700 hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-600/30 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
          aria-label={`Go to ${title}`}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
