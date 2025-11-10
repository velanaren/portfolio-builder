/**
 * Resume Context
 * Global state management for resume data across the application
 */

'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ParsedResume, ResumeContextType } from '@/types';

// Create the context
const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

/**
 * ResumeProvider - Provides resume state to all children components
 */
export function ResumeProvider({ children }: { children: ReactNode }) {
  const [resume, setResume] = useState<ParsedResume | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const value: ResumeContextType = {
    resume,
    setResume,
    loading,
    setLoading,
    error,
    setError,
  };

  return (
    <ResumeContext.Provider value={value}>
      {children}
    </ResumeContext.Provider>
  );
}

/**
 * useResume - Custom hook to access resume context
 * Usage: const { resume, setResume, loading, error } = useResume();
 */
export function useResume(): ResumeContextType {
  const context = useContext(ResumeContext);

  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }

  return context;
}
