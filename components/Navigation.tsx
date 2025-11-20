/**
 * Navigation Component - Gen Z Design
 * Bold, glassmorphism header with distinctive styling
 */

'use client';

import { useAuth } from '@/hooks/useAuth';
import { LogOut, Sparkles, Home } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui';

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
    <nav className="sticky top-0 z-50 glass-light border-b border-[var(--border)] backdrop-blur-xl">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="flex h-20 items-center justify-between">
          {/* Logo/Brand */}
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--brand)] to-[var(--accent-secondary)] flex items-center justify-center shadow-[0_0_20px_rgba(0,217,255,0.2)] group-hover:shadow-[0_0_30px_rgba(0,217,255,0.4)] transition-all duration-300 group-hover:scale-105">
              <Sparkles className="w-5 h-5 text-[var(--bg-primary)]" strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight font-[var(--font-display)] group-hover:text-[var(--brand-light)] transition-colors">
              PortfolioMaker
            </h1>
          </Link>

          {/* Quick Navigation (Optional - Hidden on mobile) */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/dashboard">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--brand)] hover:bg-[var(--bg-elevated)] transition-all duration-200 font-[var(--font-body)]">
                <Home className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
            </Link>
          </div>

          {/* User Info & Actions */}
          <div className="flex items-center gap-4">
            {/* User Info */}
            <div className="flex items-center gap-3">
              {/* User Avatar with Initials - Gradient Background */}
              <div className="relative group/avatar">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--brand)] to-[var(--accent-secondary)] text-[var(--bg-primary)] font-bold text-sm shadow-[0_0_15px_rgba(0,217,255,0.2)] group-hover/avatar:shadow-[0_0_25px_rgba(0,217,255,0.4)] transition-all duration-300 group-hover/avatar:scale-105 font-[var(--font-display)]">
                  {user ? getInitials(user.name) : 'U'}
                </div>
                {/* Online indicator */}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-[var(--success)] rounded-full border-2 border-[var(--bg-primary)] animate-pulse" />
              </div>

              {/* User Name - Hidden on small screens */}
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-[var(--text-primary)] font-[var(--font-body)]">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-[var(--text-tertiary)] font-[var(--font-body)]">
                  {user?.email || ''}
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <Button
              onClick={logout}
              variant="ghost"
              size="md"
              icon={<LogOut className="w-4 h-4" />}
              className="group"
              aria-label="Logout"
            >
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
