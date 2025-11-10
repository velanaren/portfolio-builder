/**
 * FeatureCard Component
 * Reusable card component for displaying features on the dashboard
 * Shows an icon, title, description, and action button
 */

'use client';

import { useRouter } from 'next/navigation';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  route: string;
}

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  route,
}: FeatureCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(route);
  };

  return (
    <div className="group flex flex-col rounded-xl bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
      {/* Icon */}
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
        <Icon className="h-6 w-6" />
      </div>

      {/* Title */}
      <h3 className="mb-2 text-xl font-bold text-gray-900">{title}</h3>

      {/* Description */}
      <p className="mb-6 flex-grow text-sm text-gray-600 leading-relaxed">
        {description}
      </p>

      {/* Action Button */}
      <button
        onClick={handleClick}
        className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-indigo-700 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Get Started
      </button>
    </div>
  );
}
