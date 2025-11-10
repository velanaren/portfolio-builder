/**
 * Resume Editor Page
 * Redirects to the upload page
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function ResumeEditorPage() {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    // Only redirect once auth check is complete
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace('/resume-editor/upload');
      } else {
        router.replace('/login');
      }
    }
  }, [isLoading, isAuthenticated, router]);

  // Show loading state while checking auth and redirecting
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFBFC]">
      <div className="text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
        <p className="text-sm text-gray-600 font-medium">Loading Resume Editor...</p>
      </div>
    </div>
  );
}
