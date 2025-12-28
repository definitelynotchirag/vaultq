'use client';

import { X, User, Calendar, HardDrive, Lock, Unlock, Share2 } from 'lucide-react';
import { File } from '@/types';
import { formatFileSize } from '@/lib/utils';

interface FileInfoDialogProps {
  isOpen: boolean;
  file: File | null;
  onClose: () => void;
}

export function FileInfoDialog({ isOpen, file, onClose }: FileInfoDialogProps) {
  if (!isOpen || !file) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFileType = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toUpperCase() || 'FILE';
    return extension;
  };

  const ownerName = typeof file.owner === 'object' && file.owner !== null
    ? (file.owner as any).name || 'Unknown'
    : 'Unknown';

  const ownerEmail = typeof file.owner === 'object' && file.owner !== null
    ? (file.owner as any).email || ''
    : '';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[1000] modal-enter">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4 shadow-[0_8px_16px_rgba(0,0,0,0.15)] max-h-[90vh] overflow-y-auto flex flex-col p-6">
        <div className="flex items-center justify-between border-b border-[#e5e5e5] pb-4 mb-4 sticky top-0 bg-white z-10 -mx-6 px-6">
          <h2 className="text-[#202124] text-lg font-normal">File information</h2>
          <button onClick={onClose} className="text-[#5f6368] hover:bg-[#f1f3f4] w-8 h-8 rounded-full flex items-center justify-center transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-6 flex-1 overflow-y-auto">
          <div>
            <h3 className="text-sm font-medium text-[#202124] mb-3 uppercase tracking-wider text-[11px]">General</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="text-[#5f6368] text-sm min-w-[120px]">Name</div>
                <div className="text-[#202124] text-sm flex-1 break-words">{file.originalName}</div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-[#5f6368] text-sm min-w-[120px]">Type</div>
                <div className="text-[#202124] text-sm">{getFileType(file.originalName)}</div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-[#5f6368] text-sm min-w-[120px]">Size</div>
                <div className="text-[#202124] text-sm">{formatFileSize(file.size)}</div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#e5e5e5] pt-4">
            <h3 className="text-sm font-medium text-[#202124] mb-3 uppercase tracking-wider text-[11px]">Details</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <User size={18} className="text-[#5f6368] mt-0.5" />
                <div className="flex-1">
                  <div className="text-[#5f6368] text-xs mb-0.5">Owner</div>
                  <div className="text-[#202124] text-sm font-medium">{ownerName}</div>
                  {ownerEmail && (
                    <div className="text-[#5f6368] text-xs">{ownerEmail}</div>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar size={18} className="text-[#5f6368] mt-0.5" />
                <div className="flex-1">
                  <div className="text-[#5f6368] text-xs mb-0.5">Created</div>
                  <div className="text-[#202124] text-sm font-medium">{formatDate(file.createdAt)}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar size={18} className="text-[#5f6368] mt-0.5" />
                <div className="flex-1">
                  <div className="text-[#5f6368] text-xs mb-0.5">Modified</div>
                  <div className="text-[#202124] text-sm font-medium">{formatDate(file.updatedAt)}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#e5e5e5] pt-4">
            <h3 className="text-sm font-medium text-[#202124] mb-3 uppercase tracking-wider text-[11px]">Sharing</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {file.public ? (
                  <>
                    <Unlock size={18} className="text-[#0f9d58]" />
                    <div className="flex-1">
                      <div className="text-[#202124] text-sm font-medium">Anyone with the link can view</div>
                      <div className="text-[#5f6368] text-xs">Public</div>
                    </div>
                  </>
                ) : (
                  <>
                    <Lock size={18} className="text-[#5f6368]" />
                    <div className="flex-1">
                      <div className="text-[#202124] text-sm font-medium">Private</div>
                      <div className="text-[#5f6368] text-xs">Only people with access can view</div>
                    </div>
                  </>
                )}
              </div>

              {file.permissions && file.permissions.length > 0 && (
                <div className="mt-4">
                  <div className="text-[#5f6368] text-xs mb-2 flex items-center gap-2 font-medium">
                    <Share2 size={14} />
                    Shared with ({file.permissions.length})
                  </div>
                  <div className="space-y-2">
                    {file.permissions.map((perm, index) => {
                      const permUser = typeof perm.userId === 'object' && perm.userId !== null
                        ? (perm.userId as any)
                        : null;
                      const userName = permUser?.name || 'Unknown User';
                      const userEmail = permUser?.email || '';

                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-[#f8f9fa] rounded-lg"
                        >
                          <div>
                            <div className="text-[#202124] text-sm font-medium">{userName}</div>
                            {userEmail && (
                              <div className="text-[#5f6368] text-xs">{userEmail}</div>
                            )}
                          </div>
                          <div className="text-[#5f6368] text-xs">
                            {perm.level === 'read' ? 'Can view' : 'Can edit'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3 border-t border-[#e5e5e5] bg-white sticky bottom-0 pt-4 mt-4 -mx-6 px-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-[#1a73e8] hover:bg-[#1765cc] text-white rounded-lg transition-colors text-sm font-medium shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
