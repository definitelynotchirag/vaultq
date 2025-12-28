'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FileViewer } from '@/components/files/FileViewer';
import { api } from '@/lib/api';
import { File } from '@/types';

export default function SharedFilePage() {
  const params = useParams();
  const router = useRouter();
  const fileId = params.fileId as string;
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!fileId) return;

    const loadFile = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.files.getSharedFile(fileId);
        if (response.success && response.file) {
          setFile(response.file);
        }
      } catch (err: any) {
        if (err.status === 401) {
          setError('Please log in to view this file');
        } else if (err.status === 403) {
          setError('You do not have permission to view this file');
        } else if (err.status === 404) {
          setError('File not found');
        } else {
          setError(err.message || 'Failed to load file');
        }
      } finally {
        setLoading(false);
      }
    };

    loadFile();
  }, [fileId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-[#202124] flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white text-[#202124] flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl mb-4 text-red-600">{error}</div>
          {error.includes('log in') && (
            <button
              onClick={() => {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
                window.location.href = `${API_URL}/auth/google`;
              }}
              className="px-6 py-2 bg-[#1a73e8] hover:bg-[#1765cc] text-white rounded-lg transition-colors"
            >
              Log In
            </button>
          )}
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-6 py-2 bg-[#f1f3f4] hover:bg-[#e8eaed] text-[#202124] rounded-lg transition-colors border border-[#dadce0]"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!file) {
    return (
      <div className="min-h-screen bg-white text-[#202124] flex items-center justify-center">
        <div className="text-lg">File not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <FileViewer
        isOpen={true}
        file={file}
        onClose={() => router.push('/')}
        isSharedView={true}
      />
    </div>
  );
}

