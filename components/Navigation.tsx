/**
 * Navigation Component
 * Header navigation bar that appears on all protected pages
 * Displays app name, user info, and logout button
 */

'use client';

import { useAuth } from '@/hooks/useAuth';
import { LogOut, User } from 'lucide-react';

export default function Navigation() {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-indigo-600">
              PortfolioMaker
            </h1>
          </div>

          {/* User Info & Logout */}
          <div className="flex items-center space-x-4">
            {/* User Info */}
            <div className="flex items-center space-x-2 text-gray-700">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
                <User className="h-4 w-4 text-indigo-600" />
              </div>
              <span className="hidden text-sm font-medium sm:inline-block">
                {user?.name || 'User'}
              </span>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center space-x-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-200 hover:scale-105"
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
