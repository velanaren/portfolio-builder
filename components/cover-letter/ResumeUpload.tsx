/**
 * Resume Upload Component (Step 1)
 * Drag-and-drop or file input for resume upload
 * Supports PDF and DOCX formats
 */

'use client';

import { useState, useRef } from 'react';
import { Upload, FileText, X, Loader2 } from 'lucide-react';

interface ResumeUploadProps {
  onFileUpload: (file: File) => void;
  isProcessing: boolean;
  error: string | null;
}

export default function ResumeUpload({
  onFileUpload,
  isProcessing,
  error,
}: ResumeUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ACCEPTED_TYPES = [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'application/pdf'
  ];
  const ACCEPTED_EXTENSIONS = ['.docx', '.txt', '.pdf'];

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!ACCEPTED_TYPES.includes(file.type) && !ACCEPTED_EXTENSIONS.some(ext => file.name.toLowerCase().endsWith(ext))) {
      return 'Please upload a DOCX, TXT, or PDF file';
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return 'File size exceeds 5MB limit';
    }

    return null;
  };

  const handleFileSelect = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      return;
    }

    setSelectedFile(file);
    onFileUpload(file);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        className={`relative rounded-xl border-2 border-dashed transition-all duration-300 ${
          isDragging
            ? 'border-[#D4A574] bg-[#FFF8F0]'
            : 'border-[#E5E7EB] bg-white hover:border-[#D4A574] hover:bg-[#FAFBFC]'
        }`}
        style={{ minHeight: '300px' }}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center p-8 text-center h-full min-h-[300px]">
          {isProcessing ? (
            <>
              <Loader2
                className="w-16 h-16 animate-spin mb-4"
                style={{ color: '#D4A574' }}
              />
              <p className="text-[16px] font-semibold mb-2" style={{ color: '#1A1F2E' }}>
                Parsing your resume...
              </p>
              <p className="text-[14px]" style={{ color: '#6B7280' }}>
                This may take a few seconds
              </p>
            </>
          ) : selectedFile && !error ? (
            <>
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: '#F0F9FF' }}
              >
                <FileText className="w-8 h-8" style={{ color: '#D4A574' }} />
              </div>
              <p className="text-[16px] font-semibold mb-2" style={{ color: '#1A1F2E' }}>
                {selectedFile.name}
              </p>
              <p className="text-[14px] mb-4" style={{ color: '#6B7280' }}>
                {formatFileSize(selectedFile.size)}
              </p>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="px-4 py-2 rounded-lg text-[14px] font-semibold transition-colors flex items-center gap-2"
                style={{
                  backgroundColor: '#F3F4F6',
                  color: '#1A1F2E',
                }}
              >
                <X className="w-4 h-4" />
                Remove
              </button>
            </>
          ) : (
            <>
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: '#F8FAFB' }}
              >
                <Upload className="w-8 h-8" style={{ color: '#D4A574' }} />
              </div>
              <h3
                className="text-[18px] font-bold mb-2"
                style={{ color: '#1A1F2E' }}
              >
                Upload Your Resume
              </h3>
              <p className="text-[14px] mb-4 max-w-md" style={{ color: '#6B7280' }}>
                Drag and drop your resume here, or click to browse
              </p>
              <button
                type="button"
                onClick={handleBrowseClick}
                className="px-6 py-3 rounded-xl font-semibold text-[14px] transition-all hover:shadow-md"
                style={{
                  backgroundColor: '#D4A574',
                  color: '#0F1419',
                }}
              >
                Browse Files
              </button>
              <p className="text-[12px] mt-4" style={{ color: '#9CA3AF' }}>
                Supported formats: DOCX (recommended), TXT, PDF • Max size: 5MB
              </p>
            </>
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".docx,.txt,.pdf"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div
          className="rounded-lg p-4 border"
          style={{
            backgroundColor: '#FEF2F2',
            borderColor: '#FCA5A5',
          }}
        >
          <p className="text-[14px] font-semibold" style={{ color: '#DC2626' }}>
            {error}
          </p>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-[#F8FAFB] rounded-lg p-4">
        <p className="text-[12px] font-semibold mb-2" style={{ color: '#1A1F2E' }}>
          Tips for best results:
        </p>
        <ul className="space-y-1 text-[12px]" style={{ color: '#6B7280' }}>
          <li className="flex items-start">
            <span className="mr-2" style={{ color: '#D4A574' }}>•</span>
            <span>Use a well-formatted resume with clear sections</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2" style={{ color: '#D4A574' }}>•</span>
            <span>Include contact information, experience, education, and skills</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2" style={{ color: '#D4A574' }}>•</span>
            <span>DOCX and TXT files provide better parsing accuracy</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
