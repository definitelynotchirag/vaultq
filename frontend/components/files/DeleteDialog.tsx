'use client';

import { X, Trash2 } from 'lucide-react';
import { File } from '@/types';

interface DeleteDialogProps {
  isOpen: boolean;
  file: File | null;
  onClose: () => void;
  onDelete: (fileId: string) => Promise<void>;
}

export function DeleteDialog({
  isOpen,
  file,
  onClose,
  onDelete,
}: DeleteDialogProps) {
  if (!isOpen || !file) return null;

  const handleDelete = async () => {
    try {
      await onDelete(file._id);
      onClose();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[1000] modal-enter p-4">
      <div className="bg-white rounded-lg w-full max-w-md shadow-[0_8px_16px_rgba(0,0,0,0.15)] overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#e5e5e5] h-16 px-6">
          <h2 className="text-[#202124] text-lg font-normal">Move to trash</h2>
          <button onClick={onClose} className="text-[#5f6368] hover:bg-[#f1f3f4] w-8 h-8 rounded-full flex items-center justify-center transition-colors flex-shrink-0">
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5">
          <p className="text-[#202124] text-sm mb-6 leading-relaxed">
            Are you sure you want to move <span className="font-medium">"{file.originalName}"</span> to trash?
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-5 py-2.5 bg-white border border-[#dadce0] hover:bg-[#f8f9fa] text-[#202124] rounded-lg transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 px-5 py-2.5 bg-[#ea4335] hover:bg-[#d93025] text-white rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
            >
              <Trash2 size={16} />
              Move to trash
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
