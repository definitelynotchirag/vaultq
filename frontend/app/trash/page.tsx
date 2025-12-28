'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { FileGrid } from '@/components/layout/FileGrid';
import { FileContextMenu } from '@/components/files/FileContextMenu';
import { useTrashFiles } from '@/hooks/useTrashFiles';
import { File } from '@/types';
import { RotateCcw, Trash2 } from 'lucide-react';

export default function TrashPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [contextMenu, setContextMenu] = useState<{
    file: File;
    position: { x: number; y: number };
  } | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const { files, isLoading, restoreFile, permanentDeleteFile, refetch } = useTrashFiles();

  const handleFileMenuClick = (file: File, event: React.MouseEvent) => {
    setContextMenu({
      file,
      position: { x: event.clientX, y: event.clientY },
    });
  };

  const handleRestore = async (fileId: string) => {
    try {
      await restoreFile(fileId);
      refetch();
    } catch (error) {
      console.error('Restore error:', error);
    }
  };

  const handlePermanentDelete = async (fileId: string) => {
    if (confirm('Are you sure you want to permanently delete this file? This action cannot be undone.')) {
      try {
        await permanentDeleteFile(fileId);
        refetch();
      } catch (error) {
        console.error('Permanent delete error:', error);
      }
    }
  };

  const handleDownload = async (file: File) => {
    try {
      const response = await fetch(`/api/files/${file._id}/download`, {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success && data.downloadUrl) {
        window.open(data.downloadUrl, '_blank');
      }
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const trashMenuItems = [
    {
      label: 'Restore',
      icon: RotateCcw,
      onClick: (file: File) => handleRestore(file._id),
    },
    {
      label: 'Download',
      icon: null,
      onClick: (file: File) => handleDownload(file),
    },
    {
      label: 'Delete forever',
      icon: Trash2,
      onClick: (file: File) => handlePermanentDelete(file._id),
      danger: true,
    },
  ];

  return (
    <ProtectedRoute>
      <div className="h-screen bg-white text-[#202124] overflow-hidden relative flex flex-col">
        <TopBar onSearch={setSearchQuery} searchQuery={searchQuery} />
        
        <div className="flex flex-1 overflow-hidden pt-16">
          <Sidebar onNewClick={() => {}} />
          
          <main 
            className="flex-1 transition-all h-full flex flex-col overflow-hidden"
            style={{ marginLeft: 'var(--sidebar-width, 256px)' }}
          >
            <div 
              className="flex-1 overflow-y-auto transition-all w-full"
            >
              <div className="px-4 md:px-8 py-6 md:py-8">
                <div className="mb-4 md:mb-6">
                  <h1 className="text-xl md:text-[22px] font-normal text-[#202124] mb-2">Trash</h1>
                  <p className="text-[#5f6368] text-sm">
                    Files in trash are deleted after 30 days
                  </p>
                </div>
                {files.length === 0 && !isLoading ? (
                  <div className="text-center py-12">
                    <p className="text-[#5f6368]">Trash is empty</p>
                  </div>
                ) : (
                  <FileGrid
                    files={files}
                    loading={isLoading}
                    onFileMenuClick={handleFileMenuClick}
                    selectedFiles={selectedFiles}
                  />
                )}
              </div>
            </div>
          </main>
        </div>

        {contextMenu && (
          <div
            className="fixed bg-white border border-[#e5e5e5] rounded-lg shadow-lg py-2 min-w-[200px] z-[1000]"
            style={{ left: contextMenu.position.x, top: contextMenu.position.y }}
          >
            {trashMenuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  onClick={() => {
                    item.onClick(contextMenu.file);
                    setContextMenu(null);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                    item.danger
                      ? 'text-[#ea4335] hover:bg-[#f1f3f4]'
                      : 'text-[#202124] hover:bg-[#f1f3f4]'
                  }`}
                >
                  {Icon && <Icon size={18} className="text-[#5f6368]" />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
