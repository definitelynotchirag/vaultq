'use client';

import { File } from '@/types';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface RenameDialogProps {
  isOpen: boolean;
  file: File | null;
  onClose: () => void;
  onRename: (fileId: string, newName: string) => Promise<void>;
}

export function RenameDialog({
  isOpen,
  file,
  onClose,
  onRename,
}: RenameDialogProps) {
  const [newName, setNewName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (file) {
      setNewName(file.originalName);
    }
  }, [file]);

  if (!isOpen || !file) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setIsSaving(true);
    try {
      await onRename(file._id, newName.trim());
      onClose();
    } catch (error) {
      console.error('Rename error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[1000] modal-enter p-4">
      <div className="bg-white rounded-lg w-full max-w-md shadow-[0_8px_16px_rgba(0,0,0,0.15)] overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#e5e5e5] h-16 px-6">
          <h2 className="text-[#202124] text-lg font-normal">Rename</h2>
          <button onClick={onClose} className="text-[#5f6368] hover:bg-[#f1f3f4] w-8 h-8 rounded-full flex items-center justify-center transition-colors flex-shrink-0">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full bg-white border border-[#dadce0] text-[#202124] px-4 py-2.5 rounded-lg focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] text-sm"
            autoFocus
          />

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-5 py-2.5 bg-white border border-[#dadce0] hover:bg-[#f8f9fa] text-[#202124] rounded-lg transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newName.trim() || isSaving}
              className="flex-1 px-5 py-2.5 bg-[#1a73e8] hover:bg-[#1765cc] disabled:bg-[#dadce0] disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm font-medium shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
