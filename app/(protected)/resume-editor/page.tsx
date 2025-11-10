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
  const { requireAuth, isLoading } = useAuth();

  useEffect(() => {
    requireAuth();
  }, [requireAuth]);

  useEffect(() => {
    if (!isLoading) {
      router.push('/resume-editor/upload');
    }
  }, [isLoading, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFBFC]">
      <div className="text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
        <p className="text-sm text-gray-600 font-medium">Loading...</p>
      </div>
    </div>
  );
}
