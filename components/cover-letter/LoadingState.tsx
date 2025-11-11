/**
 * Loading State Component
 * Shows animated spinner while cover letter is being generated
 */

'use client';

import { Loader2 } from 'lucide-react';

export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <Loader2
        className="w-12 h-12 animate-spin mb-4"
        style={{ color: '#D4A574' }}
      />
      <p className="text-[14px] text-[#6B7280] text-center">
        Generating your personalized cover letter...
      </p>
      <p className="text-[12px] text-[#9CA3AF] text-center mt-2">
        This may take a few seconds
      </p>
    </div>
  );
}
