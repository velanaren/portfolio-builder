'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ResumeEditorPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/resume-editor/upload');
  }, [router]);

  return null;
}
