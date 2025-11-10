/**
 * Resume Upload Page - Senior Design Engineer Level
 * Beautiful drag-and-drop file upload with smooth animations
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useResume } from '@/contexts/ResumeContext';
import Navigation from '@/components/Navigation';
import { Upload, File, CheckCircle, XCircle, Loader2 } from 'lucide-react';

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

  /**
   * Handle file selection
   */
  const handleFileSelect = (selectedFile: File) => {
    // Reset states
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

  /**
   * Upload and parse file
   */
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

      // Success! Set the resume data in context
      setResume(data.data);
      setSuccess(true);

      // Redirect to review page after a short delay
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

  /**
   * Handle drag over
   */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  /**
   * Handle drag leave
   */
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  /**
   * Handle drop
   */
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  /**
   * Handle click to browse
   */
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  /**
   * Handle file input change
   */
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      <Navigation />

      <main className="mx-auto max-w-[800px] px-8 lg:px-10 py-12 lg:py-16">
        {/* Header */}
        <div
          className={`text-center mb-12 transition-all duration-400 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight -tracking-[0.5px]">
            Upload Your Resume
          </h1>
          <p className="text-base text-gray-600 font-normal">
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
            className={`relative bg-white rounded-xl p-16 min-h-[300px] flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
              isDragging
                ? 'border-2 border-solid border-indigo-600 bg-indigo-50 scale-[1.02] shadow-lg shadow-indigo-600/10'
                : 'border-2 border-dashed border-gray-200 hover:border-indigo-600 hover:bg-indigo-50/50 hover:shadow-md'
            }`}
          >
            {/* Loading State */}
            {loading && (
              <div className="absolute inset-0 bg-white/95 rounded-xl flex flex-col items-center justify-center z-10">
                <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
                <p className="text-base font-semibold text-gray-900 mb-2">
                  Parsing your resume...
                </p>
                <p className="text-xs text-gray-600">
                  Extracting data and organizing information
                </p>
              </div>
            )}

            {/* Success State */}
            {success && !loading && (
              <div className="absolute inset-0 bg-green-50 border-2 border-green-300 rounded-xl flex flex-col items-center justify-center z-10 animate-fade-in">
                <CheckCircle className="h-12 w-12 text-green-600 mb-4" />
                <p className="text-base font-semibold text-green-900">
                  Resume parsed successfully!
                </p>
                <p className="text-xs text-green-700 mt-2">
                  Redirecting to review page...
                </p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="absolute inset-0 bg-red-50 border-2 border-red-300 rounded-xl flex flex-col items-center justify-center z-10 p-8">
                <XCircle className="h-12 w-12 text-red-600 mb-4" />
                <p className="text-base font-semibold text-red-900 mb-2">
                  Upload Failed
                </p>
                <p className="text-sm text-red-700 text-center mb-4">
                  {error}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setError(null);
                    setFile(null);
                  }}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Default State */}
            {!loading && !success && !error && (
              <>
                <Upload className="h-12 w-12 text-indigo-600 mb-6" />
                <p className="text-lg font-bold text-gray-900 mb-2">
                  {isDragging ? 'Drop your resume here' : 'Drop your resume here'}
                </p>
                <p className="text-sm text-gray-600 mb-6">
                  or click to browse
                </p>
                <p className="text-xs text-gray-400">
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
          <div className="mt-6 text-center">
            <button
              onClick={handleClick}
              disabled={loading}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg text-sm font-semibold transition-all duration-200 hover:bg-indigo-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-600/30 active:translate-y-0 active:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {loading ? 'Processing...' : 'Choose File'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
