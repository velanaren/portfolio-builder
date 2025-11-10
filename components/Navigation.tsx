/**
 * Navigation Component - Premium Design
 * Sophisticated header with elegant styling
 */

'use client';

import { useAuth } from '@/hooks/useAuth';
import { LogOut } from 'lucide-react';

export default function Navigation() {
  const { user, logout } = useAuth();

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[#E5E7EB]">
      <div className="mx-auto max-w-[1200px] px-8 lg:px-10">
        <div className="flex h-20 items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <h1 className="text-[28px] font-bold text-[#0F1419] tracking-[-0.5px] cursor-pointer">
              PortfolioMaker
            </h1>
          </div>

          {/* User Info & Logout */}
          <div className="flex items-center space-x-6">
            {/* User Info */}
            <div className="flex items-center space-x-3">
              {/* User Avatar with Initials */}
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#D4A574] text-[#0F1419] font-semibold text-[14px]">
                {user ? getInitials(user.name) : 'U'}
              </div>
              {/* User Name */}
              <span className="hidden sm:inline-block text-[14px] font-semibold text-[#0F1419]">
                {user?.name || 'User'}
              </span>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center space-x-2 rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-[14px] font-semibold text-[#0F1419] transition-all duration-300 hover:bg-[#F8FAFB] hover:border-[#D4A574] focus:outline-none focus:ring-2 focus:ring-[#D4A574] focus:ring-offset-2"
              aria-label="Logout"
            >
              <LogOut className="h-[18px] w-[18px]" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
