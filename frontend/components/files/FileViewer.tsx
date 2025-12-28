'use client';

import { api } from '@/lib/api';
import { File } from '@/types';
import { useEffect, useState } from 'react';
import { Check, Download, Link as LinkIcon, X } from 'lucide-react';

interface FileViewerProps {
  isOpen: boolean;
  file: File | null;
  onClose: () => void;
  isSharedView?: boolean;
}

export function FileViewer({ isOpen, file, onClose, isSharedView = false }: FileViewerProps) {
  const [viewUrl, setViewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && file) {
      loadViewUrl();
    } else {
      setViewUrl(null);
      setError(null);
    }
  }, [isOpen, file, isSharedView]);

  const loadViewUrl = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const response = isSharedView
        ? await api.files.getSharedFileViewUrl(file._id)
        : await api.files.getViewUrl(file._id);
      if (response.success && response.viewUrl) {
        setViewUrl(response.viewUrl);
      }
    } catch (err: any) {
      console.error('FileViewer loadViewUrl error:', err);
      setError(err.message || 'Failed to load file');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!file) return;

    try {
      const response = isSharedView
        ? await api.files.getSharedFileDownloadUrl(file._id)
        : await api.files.downloadFile(file._id);
      if (response.success && response.downloadUrl) {
        window.open(response.downloadUrl, '_blank');
      }
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  const handleCopyLink = async () => {
    if (!file) return;
    const shareableUrl = api.files.getShareableUrl(file._id);
    try {
      await navigator.clipboard.writeText(shareableUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const getFileExtension = (fileName: string) => {
    return fileName.split('.').pop()?.toLowerCase() || '';
  };

  const isImage = (fileName: string) => {
    const ext = getFileExtension(fileName);
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
  };

  const isPdf = (fileName: string) => {
    return getFileExtension(fileName) === 'pdf';
  };

  if (!isOpen || !file) return null;

  const canView = isImage(file.originalName) || isPdf(file.originalName);

  return (
    <div className="fixed inset-0 bg-[#1a1a1a] z-[2000] flex flex-col">
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#3c3c3c] bg-[#1a1a1a] flex-shrink-0">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <h2 className="text-white text-lg font-normal truncate">{file.originalName}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className={`h-10 px-4 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium ${
              copied
                ? 'bg-[#0f9d58] text-white'
                : 'text-white hover:bg-[rgba(255,255,255,0.1)]'
            }`}
          >
            {copied ? (
              <>
                <Check size={18} />
                Copied
              </>
            ) : (
              <>
                <LinkIcon size={18} />
                Copy link
              </>
            )}
          </button>
          <button
            onClick={handleDownload}
            className="h-10 px-4 rounded-lg text-white hover:bg-[rgba(255,255,255,0.1)] transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <Download size={18} />
            Download
          </button>
          <div className="w-px h-8 bg-[#3c3c3c] mx-2" />
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full text-white hover:bg-[rgba(255,255,255,0.1)] transition-colors flex items-center justify-center"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex items-center justify-center relative p-4">
        {loading && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[rgba(255,255,255,0.1)] border-t-[#1a73e8] rounded-full animate-spin" />
            <div className="text-white text-lg font-medium">Loading...</div>
          </div>
        )}

        {error && (
          <div className="text-[#ea4335] text-lg font-medium bg-[rgba(234,67,53,0.1)] px-6 py-3 rounded-lg border border-[#ea4335]">
            {error}
          </div>
        )}

        {!loading && !error && viewUrl && canView && (
          <div className="w-full h-full flex items-center justify-center">
            {isPdf(file.originalName) ? (
              <iframe
                src={viewUrl}
                className="w-full h-full border-0 rounded-lg bg-white shadow-2xl"
                title={file.originalName}
              />
            ) : isImage(file.originalName) ? (
              <img
                src={viewUrl}
                alt={file.originalName}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
            ) : null}
          </div>
        )}

        {!loading && !error && viewUrl && !canView && (
          <div className="text-center">
            <div className="w-20 h-20 bg-[rgba(255,255,255,0.05)] rounded-full flex items-center justify-center mx-auto mb-6">
              <X size={40} className="text-white opacity-20" />
            </div>
            <p className="text-white text-xl font-medium mb-2">No preview available</p>
            <p className="text-[#80868b] mb-8">This file type cannot be viewed in the browser.</p>
            <button
              onClick={handleDownload}
              className="px-8 py-3 bg-[#1a73e8] hover:bg-[#1765cc] text-white rounded-lg transition-colors flex items-center gap-2 mx-auto font-medium shadow-lg"
            >
              <Download size={20} />
              Download to view
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
