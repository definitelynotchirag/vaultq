'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DeleteDialog } from '@/components/files/DeleteDialog';
import { FileContextMenu } from '@/components/files/FileContextMenu';
import { FileInfoDialog } from '@/components/files/FileInfoDialog';
import { FileViewer } from '@/components/files/FileViewer';
import { RenameDialog } from '@/components/files/RenameDialog';
import { ShareDialog } from '@/components/files/ShareDialog';
import { UploadDialog } from '@/components/files/UploadDialog';
import { FileGrid } from '@/components/layout/FileGrid';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { useAuth } from '@/hooks/useAuth';
import { useFiles } from '@/hooks/useFiles';
import { api } from '@/lib/api';
import { File } from '@/types';
import { useEffect, useState } from 'react';

export default function SharedPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    file: File;
    position: { x: number; y: number };
  } | null>(null);
  const [renameFile, setRenameFile] = useState<File | null>(null);
  const [deleteFile, setDeleteFile] = useState<File | null>(null);
  const [shareFile, setShareFile] = useState<File | null>(null);
  const [viewFile, setViewFile] = useState<File | null>(null);
  const [infoFile, setInfoFile] = useState<File | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const { user } = useAuth();

  const { files, isLoading, renameFile: renameFileApi, deleteFile: deleteFileApi, downloadFile, refetch } = useFiles(debouncedSearch);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const sharedFiles = files.filter((file) => file.permissions && file.permissions.length > 0);

  const handleFileMenuClick = (file: File, event: React.MouseEvent) => {
    setContextMenu({
      file,
      position: { x: event.clientX, y: event.clientY },
    });
  };

  const handleRename = async (fileId: string, newName: string) => {
    await renameFileApi({ fileId, newName });
    setRenameFile(null);
    refetch();
  };

  const handleDelete = async (fileId: string) => {
    await deleteFileApi(fileId);
    setDeleteFile(null);
    refetch();
  };

  const handleOpenFile = (file: File) => {
    setViewFile(file);
  };

  const handleDownload = async (file: File) => {
    try {
      await downloadFile(file._id);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const handleShareComplete = () => {
    refetch();
  };

  const handleStar = async (file: File) => {
    const isStarred = user && file.starredBy?.includes(user._id);
    try {
      if (isStarred) {
        await api.files.unstarFile(file._id);
      } else {
        await api.files.starFile(file._id);
      }
      refetch();
    } catch (error) {
      console.error('Star error:', error);
    }
  };

  const handleCopyLink = async (file: File) => {
    const shareableUrl = api.files.getShareableUrl(file._id);
    try {
      await navigator.clipboard.writeText(shareableUrl);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="h-screen bg-white text-[#202124] overflow-hidden relative flex flex-col">
        <TopBar onSearch={setSearchQuery} searchQuery={searchQuery} />
        
        <div className="flex flex-1 overflow-hidden pt-16">
          <Sidebar onNewClick={() => setShowUploadDialog(true)} />
          
          <main 
            className="flex-1 transition-all h-full flex flex-col overflow-hidden"
            style={{ marginLeft: 'var(--sidebar-width, 256px)' }}
          >
            <div 
              className="flex-1 overflow-y-auto transition-all w-full"
            >
              <div className="px-4 md:px-8 py-6 md:py-8">
                <div className="mb-4 md:mb-6">
                  <h1 className="text-xl md:text-[22px] font-normal text-[#202124] mb-4 md:mb-6">Shared with me</h1>
                  <div className="h-12 flex items-center border-b border-[#e5e5e5] mb-4 md:mb-6 gap-3 md:gap-4 overflow-x-auto">
                    <button className="h-8 px-3 rounded flex items-center gap-2 text-sm text-[#5f6368] hover:bg-gray-100 transition-colors whitespace-nowrap">Type</button>
                    <button className="h-8 px-3 rounded flex items-center gap-2 text-sm text-[#5f6368] hover:bg-gray-100 transition-colors whitespace-nowrap">People</button>
                    <button className="h-8 px-3 rounded flex items-center gap-2 text-sm text-[#5f6368] hover:bg-gray-100 transition-colors whitespace-nowrap">Modified</button>
                  </div>
                </div>
                <FileGrid
                  files={sharedFiles}
                  loading={isLoading}
                  onFileMenuClick={handleFileMenuClick}
                  onFileDoubleClick={(file) => handleOpenFile(file)}
                  onFileStar={handleStar}
                  selectedFiles={selectedFiles}
                />
              </div>
            </div>
          </main>
        </div>

        {contextMenu && (
          <FileContextMenu
            file={contextMenu.file}
            position={contextMenu.position}
            onClose={() => setContextMenu(null)}
            onDownload={(file) => handleDownload(file)}
            onRename={(file) => setRenameFile(file)}
            onShare={(file) => setShareFile(file)}
            onStar={(file) => handleStar(file)}
            onCopyLink={(file) => handleCopyLink(file)}
            onDelete={(file) => setDeleteFile(file)}
            onInfo={(file) => setInfoFile(file)}
            onOpen={(file) => handleOpenFile(file)}
          />
        )}

        <FileViewer
          isOpen={!!viewFile}
          file={viewFile}
          onClose={() => setViewFile(null)}
        />

        <FileInfoDialog
          isOpen={!!infoFile}
          file={infoFile}
          onClose={() => setInfoFile(null)}
        />

        <UploadDialog
          isOpen={showUploadDialog}
          onClose={() => setShowUploadDialog(false)}
          onUploadComplete={() => {
            refetch();
            setShowUploadDialog(false);
          }}
        />

        <RenameDialog
          isOpen={!!renameFile}
          file={renameFile}
          onClose={() => setRenameFile(null)}
          onRename={handleRename}
        />

        <DeleteDialog
          isOpen={!!deleteFile}
          file={deleteFile}
          onClose={() => setDeleteFile(null)}
          onDelete={handleDelete}
        />

        <ShareDialog
          isOpen={!!shareFile}
          file={shareFile}
          onClose={() => setShareFile(null)}
          onShareComplete={handleShareComplete}
        />
      </div>
    </ProtectedRoute>
  );
}
