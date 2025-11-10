/**
 * Resume Export Page - Phase 4
 * ATS-Friendly PDF Export with Multiple Themes
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Download, Eye, Loader2, Check, AlertCircle } from 'lucide-react';
import { useResume } from '@/contexts/ResumeContext';
import ExportOptions from '@/components/ResumeExport/ExportOptions';
import PreviewPanel from '@/components/ResumeExport/PreviewPanel';

export type ExportFormat = 'ats' | 'modern' | 'classic';
export type ColorTheme = 'navy-gold' | 'dark-minimal' | 'blue-gold';

export default function ExportPage() {
  const router = useRouter();
  const { resume } = useResume();
  const [format, setFormat] = useState<ExportFormat>('ats');
  const [theme, setTheme] = useState<ColorTheme>('navy-gold');
  const [filename, setFilename] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Redirect if no resume data
    if (!resume) {
      router.push('/resume-editor/upload');
      return;
    }

    // Set default filename from resume name
    if (resume.personalInfo?.name) {
      const name = resume.personalInfo.name.replace(/\s+/g, '_');
      setFilename(`${name}_Resume`);
    }
  }, [resume, router]);

  const handleDownload = async () => {
    if (!resume) return;

    setIsDownloading(true);
    setDownloadStatus('idle');

    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume,
          format,
          theme,
          filename
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setDownloadStatus('success');
      setTimeout(() => setDownloadStatus('idle'), 2000);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      setDownloadStatus('error');
      setTimeout(() => setDownloadStatus('idle'), 3000);
    } finally {
      setIsDownloading(false);
    }
  };

  if (!mounted || !resume) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#D4A574]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFB]">
      {/* Header - Sticky */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#E5E7EB] animate-fade-in">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-[#F8FAFB] rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5 text-[#6B7280]" />
            </button>
            <h1 className="text-[24px] font-bold text-[#1A1F2E]">Export Resume</h1>
          </div>

          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-[14px] transition-all duration-300 ${
              downloadStatus === 'success'
                ? 'bg-green-500 text-white'
                : downloadStatus === 'error'
                ? 'bg-red-500 text-white'
                : 'bg-[#D4A574] text-[#1A1F2E] hover:bg-[#C89850] hover:-translate-y-0.5 hover:shadow-md'
            } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0`}
          >
            {isDownloading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : downloadStatus === 'success' ? (
              <>
                <Check className="h-4 w-4" />
                <span>Downloaded!</span>
              </>
            ) : downloadStatus === 'error' ? (
              <>
                <AlertCircle className="h-4 w-4" />
                <span>Error</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span>Download PDF</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Export Options */}
          <div className="animate-slide-in-left">
            <ExportOptions
              resume={resume}
              format={format}
              theme={theme}
              filename={filename}
              onFormatChange={setFormat}
              onThemeChange={setTheme}
              onFilenameChange={setFilename}
              onDownload={handleDownload}
              isDownloading={isDownloading}
              downloadStatus={downloadStatus}
            />
          </div>

          {/* Right Column - Preview Panel */}
          <div className="animate-slide-in-right">
            <PreviewPanel
              resume={resume}
              format={format}
              theme={theme}
            />
          </div>
        </div>
      </main>

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.4s ease-out 0.2s both;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.4s ease-out 0.2s both;
        }
      `}</style>
    </div>
  );
}
