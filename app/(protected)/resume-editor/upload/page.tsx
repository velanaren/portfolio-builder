/**
 * Resume Upload Page - Premium Design
 * Sophisticated drag-and-drop file upload with elegant styling
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useResume } from '@/contexts/ResumeContext';
import Navigation from '@/components/Navigation';
import { Upload, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function ResumeUploadPage() {
  const router = useRouter();
  const { requireAuth } = useAuth();
  const { setResume, setLoading: setGlobalLoading, setError: setGlobalError } = useResume();

  const [mounted, setMounted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    requireAuth();
  }, [requireAuth]);

  const handleFileSelect = (selectedFile: File) => {
    setError(null);
    setSuccess(false);

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setError('File size exceeds 5MB limit');
      return;
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'text/plain'];
    const fileExtension = selectedFile.name.toLowerCase().split('.').pop();
    const validExtensions = ['pdf', 'docx', 'doc', 'txt'];

    if (!allowedTypes.includes(selectedFile.type) && !validExtensions.includes(fileExtension || '')) {
      setError('Invalid file type. Please upload PDF, DOCX, or TXT files only.');
      return;
    }

    setFile(selectedFile);
    uploadFile(selectedFile);
  };

  const uploadFile = async (fileToUpload: File) => {
    setLoading(true);
    setGlobalLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', fileToUpload);

      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to parse resume');
      }

      setResume(data.data);
      setSuccess(true);

      setTimeout(() => {
        router.push('/resume-editor/review');
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to upload and parse resume');
      setGlobalError(err.message);
      setFile(null);
    } finally {
      setLoading(false);
      setGlobalLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFB]">
      <Navigation />

      <main className="mx-auto max-w-[900px] px-8 lg:px-10 py-16 lg:py-20">
        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-400 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h1 className="text-[48px] font-bold text-[#0F1419] mb-4 tracking-[-0.5px] leading-tight">
            Upload Your Resume
          </h1>
          <p className="text-[16px] text-[#6B7280] font-medium">
            Drag and drop your resume or click to browse
          </p>
        </div>

        {/* Upload Zone */}
        <div
          className={`transition-all duration-400 ease-out ${
            mounted ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
            className={`relative bg-white rounded-xl p-20 min-h-[360px] flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
              isDragging
                ? 'border-2 border-solid border-[#D4A574] bg-[#FFFBF7] scale-[1.01] shadow-[0_8px_24px_rgba(212,165,116,0.15)]'
                : 'border-2 border-dashed border-[#E5E7EB] hover:border-[#D4A574] hover:bg-[#FFFBF7] hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
            }`}
          >
            {/* Loading State */}
            {loading && (
              <div className="absolute inset-0 bg-white/95 rounded-xl flex flex-col items-center justify-center z-10">
                <Loader2 className="h-16 w-16 text-[#D4A574] animate-spin mb-6" />
                <p className="text-[18px] font-semibold text-[#0F1419] mb-2">
                  Parsing your resume...
                </p>
                <p className="text-[14px] text-[#6B7280]">
                  Extracting data and organizing information
                </p>
              </div>
            )}

            {/* Success State */}
            {success && !loading && (
              <div className="absolute inset-0 bg-green-50 border-2 border-green-300 rounded-xl flex flex-col items-center justify-center z-10 animate-fade-in">
                <CheckCircle className="h-16 w-16 text-green-600 mb-6" />
                <p className="text-[18px] font-semibold text-green-900">
                  Resume parsed successfully!
                </p>
                <p className="text-[14px] text-green-700 mt-2">
                  Redirecting to review page...
                </p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="absolute inset-0 bg-red-50 border-2 border-red-300 rounded-xl flex flex-col items-center justify-center z-10 p-8">
                <XCircle className="h-16 w-16 text-red-600 mb-6" />
                <p className="text-[18px] font-semibold text-red-900 mb-2">
                  Upload Failed
                </p>
                <p className="text-[14px] text-red-700 text-center mb-6">
                  {error}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setError(null);
                    setFile(null);
                  }}
                  className="px-8 py-3 bg-red-600 text-white rounded-lg text-[14px] font-semibold hover:bg-red-700 transition-colors duration-300"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Default State */}
            {!loading && !success && !error && (
              <>
                <Upload className="h-16 w-16 text-[#D4A574] mb-8" strokeWidth={1.5} />
                <p className="text-[24px] font-bold text-[#0F1419] mb-3 tracking-[-0.5px]">
                  {isDragging ? 'Drop your resume here' : 'Drop your resume here'}
                </p>
                <p className="text-[14px] text-[#6B7280] mb-8">
                  or click to browse
                </p>
                <p className="text-[12px] text-[#9CA3AF] font-medium">
                  Supported: PDF, DOCX, TXT (Max 5MB)
                </p>
              </>
            )}

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.doc,.txt"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>

          {/* Alternative Button */}
          <div className="mt-8 text-center">
            <button
              onClick={handleClick}
              disabled={loading}
              className="px-10 py-3.5 bg-[#D4A574] text-[#0F1419] rounded-lg text-[14px] font-semibold transition-all duration-300 hover:bg-[#C89850] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#D4A574]/30 active:translate-y-0 active:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {loading ? 'Processing...' : 'Choose File'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
