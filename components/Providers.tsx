/**
 * Providers Component
 * Wraps the application with all context providers
 */

'use client';

import { ResumeProvider } from '@/contexts/ResumeContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ResumeProvider>
      {children}
    </ResumeProvider>
  );
}
