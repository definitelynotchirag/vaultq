'use client';

import { useState } from 'react';
import { X, Link as LinkIcon, User, Lock, Unlock, Check, Copy, Mail } from 'lucide-react';
import { File } from '@/types';
import { api } from '@/lib/api';

interface ShareDialogProps {
  isOpen: boolean;
  file: File | null;
  onClose: () => void;
  onShareComplete?: () => void;
}

export function ShareDialog({
  isOpen,
  file,
  onClose,
  onShareComplete,
}: ShareDialogProps) {
  const [isPublic, setIsPublic] = useState(file?.public || false);
  const [isSaving, setIsSaving] = useState(false);
  const [email, setEmail] = useState('');
  const [permissionLevel, setPermissionLevel] = useState<'read' | 'write'>('read');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !file) return null;

  const handleTogglePublic = async () => {
    setIsSaving(true);
    try {
      if (isPublic) {
        await api.files.makePrivate(file._id);
      } else {
        await api.files.makePublic(file._id);
      }
      setIsPublic(!isPublic);
      if (onShareComplete) {
        onShareComplete();
      }
    } catch (error) {
      console.error('Toggle public error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleShareWithUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSaving(true);
    try {
      await api.files.shareFileByEmail(file._id, email.trim(), permissionLevel);
      setEmail('');
      if (onShareComplete) {
        onShareComplete();
      }
    } catch (error: any) {
      console.error('Share error:', error);
      alert(error.message || 'Failed to share file. Please check the email address.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyLink = async () => {
    const shareableUrl = api.files.getShareableUrl(file._id);
    try {
      await navigator.clipboard.writeText(shareableUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[1000] modal-enter p-4">
      <div className="w-full max-w-[640px] max-h-[90vh] bg-white rounded-lg shadow-[0_8px_16px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col">
        <div className="h-16 flex items-center justify-between border-b border-[#e5e5e5] flex-shrink-0 px-6">
          <h2 className="text-lg md:text-[22px] text-[#202124] font-normal truncate pr-4">Share "{file.originalName}"</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#f1f3f4] flex items-center justify-center transition-colors flex-shrink-0"
          >
            <X size={18} className="text-[#5f6368]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5" style={{ maxHeight: 'calc(90vh - 64px - 72px)' }}>
          <div className="flex items-center gap-3 p-4 bg-[#f8f9fa] rounded-lg mb-5">
            <div className="w-10 h-10 bg-[#1a73e8] rounded-full flex items-center justify-center flex-shrink-0">
              <LinkIcon size={20} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-[#202124]">Anyone with the link</div>
              <div className="text-xs text-[#5f6368]">
                {isPublic ? 'Can view' : 'No access'}
              </div>
            </div>
            <button
              onClick={handleTogglePublic}
              disabled={isSaving}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 ${
                isPublic
                  ? 'bg-[#1a73e8] hover:bg-[#1765cc] text-white shadow-[0_1px_2px_rgba(0,0,0,0.3),0_1px_3px_1px_rgba(0,0,0,0.15)]'
                  : 'bg-white border border-[#dadce0] hover:bg-[#f8f9fa] text-[#202124]'
              }`}
            >
              {isPublic ? (
                <>
                  <Unlock size={16} />
                  Public
                </>
              ) : (
                <>
                  <Lock size={16} />
                  Private
                </>
              )}
            </button>
          </div>

          <div className="border-t border-[#e5e5e5] pt-5 mb-5">
            <h3 className="text-sm font-medium text-[#202124] mb-4">Copy link</h3>
            <div className="flex gap-2 flex-col sm:flex-row">
              <input
                type="text"
                value={api.files.getShareableUrl(file._id)}
                readOnly
                className="flex-1 bg-[#f8f9fa] border border-[#dadce0] text-[#202124] px-4 py-2.5 rounded-lg focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] text-sm"
              />
              <button
                onClick={handleCopyLink}
                className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
                  copied
                    ? 'bg-[#0f9d58] text-white'
                    : 'bg-[#1a73e8] hover:bg-[#1765cc] text-white shadow-[0_1px_2px_rgba(0,0,0,0.3),0_1px_3px_1px_rgba(0,0,0,0.15)]'
                }`}
              >
                {copied ? (
                  <>
                    <Check size={16} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="border-t border-[#e5e5e5] pt-5 mb-5">
            <h3 className="text-sm font-medium text-[#202124] mb-4">Share with specific people</h3>
            <form onSubmit={handleShareWithUser} className="space-y-3">
              <div className="flex gap-2 flex-col sm:flex-row">
                <div className="flex-1 relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5f6368] w-4 h-4" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full bg-white border border-[#dadce0] text-[#202124] pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] text-sm"
                  />
                </div>
                <select
                  value={permissionLevel}
                  onChange={(e) => setPermissionLevel(e.target.value as 'read' | 'write')}
                  className="bg-white border border-[#dadce0] text-[#202124] px-4 py-2.5 rounded-lg focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] text-sm"
                >
                  <option value="read">Can view</option>
                  <option value="write">Can edit</option>
                </select>
                <button
                  type="submit"
                  disabled={!email.trim() || isSaving}
                  className="px-5 py-2.5 bg-[#1a73e8] hover:bg-[#1765cc] disabled:bg-[#dadce0] disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm font-medium shadow-[0_1px_2px_rgba(0,0,0,0.3),0_1px_3px_1px_rgba(0,0,0,0.15)]"
                >
                  Share
                </button>
              </div>
            </form>
          </div>

          {file.permissions && file.permissions.length > 0 && (
            <div className="border-t border-[#e5e5e5] pt-5">
              <h3 className="text-sm font-medium text-[#202124] mb-4">People with access</h3>
              <div className="space-y-3">
                {file.permissions.map((perm, index) => {
                  const permUser = typeof perm.userId === 'object' && perm.userId !== null
                    ? (perm.userId as any)
                    : null;
                  const userName = permUser?.name || 'Unknown User';
                  const userEmail = permUser?.email || perm.userId;

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-[#f8f9fa] rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#5f6368] rounded-full flex items-center justify-center flex-shrink-0">
                          <User size={18} className="text-white" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-[#202124] truncate">{userName}</div>
                          <div className="text-xs text-[#5f6368] truncate">{userEmail}</div>
                          <div className="text-xs text-[#5f6368] mt-1">
                            {perm.level === 'read' ? 'Can view' : 'Can edit'}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="h-[72px] flex items-center justify-end gap-3 border-t border-[#e5e5e5] flex-shrink-0 px-6">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#1a73e8] hover:bg-[#1765cc] text-white rounded-lg transition-colors text-sm font-medium shadow-[0_1px_2px_rgba(0,0,0,0.3),0_1px_3px_1px_rgba(0,0,0,0.15)]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
