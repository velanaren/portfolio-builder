/**
 * Navigation Component - Senior Design Engineer Level
 * Professional header navigation with user info and logout
 */

'use client';

import { useAuth } from '@/hooks/useAuth';
import { LogOut } from 'lucide-react';

export default function Navigation() {
  const { user, logout } = useAuth();

  /**
   * Get user initials from name
   */
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="mx-auto max-w-7xl px-8 lg:px-10">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-indigo-600 tracking-tight cursor-pointer">
              PortfolioMaker
            </h1>
          </div>

          {/* User Info & Logout */}
          <div className="flex items-center space-x-6">
            {/* User Info */}
            <div className="flex items-center space-x-3">
              {/* User Avatar with Initials */}
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-semibold text-sm">
                {user ? getInitials(user.name) : 'U'}
              </div>
              {/* User Name */}
              <span className="hidden sm:inline-block text-sm font-medium text-gray-900">
                {user?.name || 'User'}
              </span>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center space-x-2 rounded-md bg-gray-100 border border-gray-200 px-4 py-2 text-sm font-medium text-gray-900 transition-all duration-150 hover:bg-gray-200 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
              aria-label="Logout"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
