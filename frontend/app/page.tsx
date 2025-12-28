'use client';

import { useState, useEffect, useRef } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { FileGrid } from '@/components/layout/FileGrid';
import { SelectionToolbar } from '@/components/layout/SelectionToolbar';
import { PreviewPanel } from '@/components/files/PreviewPanel';
import { UploadDialog } from '@/components/files/UploadDialog';
import { FileContextMenu } from '@/components/files/FileContextMenu';
import { RenameDialog } from '@/components/files/RenameDialog';
import { DeleteDialog } from '@/components/files/DeleteDialog';
import { ShareDialog } from '@/components/files/ShareDialog';
import { FileViewer } from '@/components/files/FileViewer';
import { FileInfoDialog } from '@/components/files/FileInfoDialog';
import { useFiles } from '@/hooks/useFiles';
import { useFileSelection } from '@/hooks/useFileSelection';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useAuth } from '@/hooks/useAuth';
import { File } from '@/types';
import { api } from '@/lib/api';
import { Grid3x3, List, ChevronDown } from 'lucide-react';

export default function HomePage() {
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
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const { user } = useAuth();

  const { files, isLoading, renameFile: renameFileApi, deleteFile: deleteFileApi, downloadFile, refetch } = useFiles(debouncedSearch);
  
  const {
    selectedFiles,
    selectFile,
    selectAll,
    clearSelection,
    getSelectedFiles,
  } = useFileSelection(files);

  useKeyboardShortcuts({
    onSelectAll: () => selectAll(),
    onDelete: () => {
      const selected = getSelectedFiles();
      if (selected.length > 0) {
        setDeleteFile(selected[0]);
      }
    },
    onDownload: async () => {
      const selected = getSelectedFiles();
      for (const file of selected) {
        try {
          await downloadFile(file._id);
        } catch (error) {
          console.error('Download error:', error);
        }
      }
    },
    onFocusSearch: () => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    },
    onOpen: () => {
      const selected = getSelectedFiles();
      if (selected.length === 1) {
        handleOpenFile(selected[0]);
      }
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (selectedFiles.length === 0) {
      setPreviewFile(null);
    } else if (selectedFiles.length === 1) {
      const file = files.find(f => f._id === selectedFiles[0]);
      if (file) {
        setPreviewFile(file);
      }
    }
  }, [selectedFiles, files]);

  const handleFileSelect = (file: File, event: React.MouseEvent) => {
    selectFile(file._id, event);
  };

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
    clearSelection();
  };

  const handleDelete = async (fileId: string) => {
    await deleteFileApi(fileId);
    setDeleteFile(null);
    refetch();
    clearSelection();
  };

  const handleDeleteSelected = async () => {
    const selected = getSelectedFiles();
    for (const file of selected) {
      try {
        await deleteFileApi(file._id);
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
    refetch();
    clearSelection();
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

  const handleDownloadSelected = async () => {
    const selected = getSelectedFiles();
    for (const file of selected) {
      try {
        await downloadFile(file._id);
      } catch (error) {
        console.error('Download error:', error);
      }
    }
  };

  const handleShareComplete = () => {
    refetch();
  };

  const handleShareSelected = () => {
    const selected = getSelectedFiles();
    if (selected.length > 0) {
      setShareFile(selected[0]);
    }
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

  const handleStarSelected = async () => {
    const selected = getSelectedFiles();
    for (const file of selected) {
      try {
        const isStarred = user && file.starredBy?.includes(user._id);
        if (isStarred) {
          await api.files.unstarFile(file._id);
        } else {
          await api.files.starFile(file._id);
        }
      } catch (error) {
        console.error('Star error:', error);
      }
    }
    refetch();
  };

  const handleCopyLink = async (file: File) => {
    const shareableUrl = api.files.getShareableUrl(file._id);
    try {
      await navigator.clipboard.writeText(shareableUrl);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const hasSelection = selectedFiles.length > 0;
  const selectedFilesList = getSelectedFiles();

  return (
    <ProtectedRoute>
      <div className="h-screen bg-white text-[#202124] overflow-hidden relative flex flex-col">
        <TopBar onSearch={setSearchQuery} searchQuery={searchQuery} />
        
        <div className="flex flex-1 overflow-hidden">
          <Sidebar onNewClick={() => setShowUploadDialog(true)} />
          
          <main 
            className="flex-1 transition-all h-full flex flex-col overflow-hidden"
            style={{ marginLeft: 'var(--sidebar-width, 256px)' }}
          >
            {hasSelection && (
              <SelectionToolbar
                selectedCount={selectedFiles.length}
                selectedFiles={selectedFilesList}
                onShare={handleShareSelected}
                onDownload={handleDownloadSelected}
                onStar={handleStarSelected}
                onDelete={handleDeleteSelected}
              />
            )}

            <div 
              className={`flex-1 overflow-y-auto transition-all ${hasSelection ? 'mt-16' : ''} w-full`}
              onClick={() => {
                if (!contextMenu) {
                  clearSelection();
                }
              }}
            >
              <div className="px-3 sm:px-4 md:px-8 py-4 sm:py-5 md:py-6 lg:py-8 mt-0">
                <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6">
                  <h1 className="text-lg sm:text-xl md:text-[22px] font-normal text-[#202124]">My Drive</h1>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-[#dadce0] rounded">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center transition-colors ${
                          viewMode === 'grid'
                            ? 'bg-[#e8eaed]'
                            : 'bg-white hover:bg-[#f1f3f4]'
                        }`}
                        aria-label="Grid view"
                      >
                        <Grid3x3 size={16} className="sm:w-[17px] sm:h-[17px] md:w-[18px] md:h-[18px] text-[#5f6368]" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center border-l border-[#dadce0] transition-colors ${
                          viewMode === 'list'
                            ? 'bg-[#e8eaed]'
                            : 'bg-white hover:bg-[#f1f3f4]'
                        }`}
                        aria-label="List view"
                      >
                        <List size={16} className="sm:w-[17px] sm:h-[17px] md:w-[18px] md:h-[18px] text-[#5f6368]" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="h-10 sm:h-11 md:h-12 flex items-center border-b border-[#e5e5e5] mb-3 sm:mb-4 md:mb-6 gap-2 sm:gap-3 md:gap-4 overflow-x-auto hide-scrollbar">
                  <button className="h-7 sm:h-8 px-2.5 sm:px-3 rounded flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-[#5f6368] hover:bg-gray-100 transition-colors whitespace-nowrap flex-shrink-0">
                    Type
                    <ChevronDown size={14} className="sm:w-4 sm:h-4" />
                  </button>
                  <button className="h-7 sm:h-8 px-2.5 sm:px-3 rounded flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-[#5f6368] hover:bg-gray-100 transition-colors whitespace-nowrap flex-shrink-0">
                    People
                    <ChevronDown size={14} className="sm:w-4 sm:h-4" />
                  </button>
                  <button className="h-7 sm:h-8 px-2.5 sm:px-3 rounded flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-[#5f6368] hover:bg-gray-100 transition-colors whitespace-nowrap flex-shrink-0">
                    Modified
                    <ChevronDown size={14} className="sm:w-4 sm:h-4" />
                  </button>
                </div>

                {viewMode === 'grid' ? (
                  <FileGrid
                    files={files}
                    loading={isLoading}
                    onFileSelect={handleFileSelect}
                    onFileMenuClick={handleFileMenuClick}
                    onFileDoubleClick={(file) => handleOpenFile(file)}
                    onFileStar={handleStar}
                    selectedFiles={selectedFiles}
                  />
                ) : (
                  <div className="text-center py-12 text-[#5f6368]">
                    List view coming soon
                  </div>
                )}
              </div>
            </div>
          </main>

          {previewFile && (
            <PreviewPanel
              file={previewFile}
              isOpen={!!previewFile}
              onClose={() => setPreviewFile(null)}
            />
          )}
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
