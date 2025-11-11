/**
 * ResumeUpload Component
 * Drag-and-drop file upload for resume parsing
 */

'use client';

import { useState, useCallback } from 'react';
import { Upload, File as FileIcon, AlertCircle } from 'lucide-react';

interface ResumeUploadProps {
  onFileUpload: (file: File) => void;
  isLoading: boolean;
  error: string | null;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
];
const ACCEPTED_EXTENSIONS = ['.pdf', '.docx', '.txt'];

export default function ResumeUpload({ onFileUpload, isLoading, error }: ResumeUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    if (
      !ACCEPTED_TYPES.includes(file.type) &&
      !ACCEPTED_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext))
    ) {
      return 'Please upload a PDF, DOCX, or TXT file';
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return 'File size exceeds 5MB limit';
    }

    return null;
  };

  const handleFile = useCallback(
    (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        return;
      }

      setSelectedFile(file);
      onFileUpload(file);
    },
    [onFileUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile]
  );

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-[28px] font-semibold mb-2" style={{ color: '#1A1F2E' }}>
          Upload Your Resume
        </h2>
        <p className="text-[14px]" style={{ color: '#6B7280' }}>
          Upload your resume to start analyzing your skills and job fit
        </p>
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative rounded-xl border-2 border-dashed transition-all duration-300
          ${isDragging ? 'border-[#D4A574] bg-[#FEF3C7] bg-opacity-20' : 'border-[#E5E7EB] bg-white'}
          ${isLoading ? 'opacity-50 pointer-events-none' : 'cursor-pointer hover:border-[#D4A574]'}
        `}
        style={{ padding: '48px 32px' }}
      >
        <input
          type="file"
          id="resume-upload"
          className="hidden"
          accept={ACCEPTED_EXTENSIONS.join(',')}
          onChange={handleFileInput}
          disabled={isLoading}
        />

        <label
          htmlFor="resume-upload"
          className="flex flex-col items-center cursor-pointer"
        >
          {/* Icon */}
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: '#F8FAFB' }}
          >
            {isLoading ? (
              <div
                className="w-8 h-8 rounded-full border-4 border-t-transparent animate-spin"
                style={{ borderColor: '#D4A574', borderTopColor: 'transparent' }}
              />
            ) : (
              <Upload className="w-8 h-8" style={{ color: '#D4A574' }} />
            )}
          </div>

          {/* Text */}
          <div className="text-center">
            {isLoading ? (
              <>
                <p className="text-[16px] font-semibold mb-1" style={{ color: '#1A1F2E' }}>
                  Parsing your resume...
                </p>
                <p className="text-[14px]" style={{ color: '#6B7280' }}>
                  This may take a few seconds
                </p>
              </>
            ) : selectedFile ? (
              <>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <FileIcon className="w-5 h-5" style={{ color: '#D4A574' }} />
                  <p className="text-[16px] font-semibold" style={{ color: '#1A1F2E' }}>
                    {selectedFile.name}
                  </p>
                </div>
                <p className="text-[14px]" style={{ color: '#6B7280' }}>
                  {(selectedFile.size / 1024).toFixed(1)} KB • Click to change
                </p>
              </>
            ) : (
              <>
                <p className="text-[16px] font-semibold mb-1" style={{ color: '#1A1F2E' }}>
                  Drag and drop your resume here
                </p>
                <p className="text-[14px] mb-3" style={{ color: '#6B7280' }}>
                  or click to browse files
                </p>
                <p className="text-[12px]" style={{ color: '#9CA3AF' }}>
                  PDF, DOCX, or TXT • Max 5MB
                </p>
              </>
            )}
          </div>
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div
          className="mt-4 rounded-lg p-4 flex items-start gap-3"
          style={{ backgroundColor: '#FEF2F2' }}
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#EF4444' }} />
          <div>
            <p className="text-[14px] font-semibold" style={{ color: '#991B1B' }}>
              Upload failed
            </p>
            <p className="text-[14px] mt-1" style={{ color: '#B91C1C' }}>
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="mt-6 rounded-lg p-4" style={{ backgroundColor: '#F8FAFB' }}>
        <p className="text-[12px] font-semibold mb-2" style={{ color: '#1A1F2E' }}>
          Tips for best results:
        </p>
        <ul className="space-y-1">
          <li className="text-[12px]" style={{ color: '#6B7280' }}>
            • DOCX and TXT files provide better parsing accuracy
          </li>
          <li className="text-[12px]" style={{ color: '#6B7280' }}>
            • Ensure your resume includes clear section headings
          </li>
          <li className="text-[12px]" style={{ color: '#6B7280' }}>
            • List your skills explicitly in a dedicated section
          </li>
        </ul>
      </div>
    </div>
  );
}
