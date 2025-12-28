'use client';

import { DeleteDialog } from '@/components/files/DeleteDialog';
import { FileContextMenu } from '@/components/files/FileContextMenu';
import { FileInfoDialog } from '@/components/files/FileInfoDialog';
import { FileViewer } from '@/components/files/FileViewer';
import { PreviewPanel } from '@/components/files/PreviewPanel';
import { RenameDialog } from '@/components/files/RenameDialog';
import { ShareDialog } from '@/components/files/ShareDialog';
import { UploadDialog } from '@/components/files/UploadDialog';
import { FileGrid } from '@/components/layout/FileGrid';
import { FileList } from '@/components/layout/FileList';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { useFiles } from '@/hooks/useFiles';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { api } from '@/lib/api';
import { colors } from '@/lib/colors';
import { File } from '@/types';
import { GridView, List as ListIcon } from '@mui/icons-material';
import { Box, Container, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { files, isLoading, renameFile: renameFileApi, deleteFile: deleteFileApi, downloadFile, refetch } = useFiles(debouncedSearch);

  useKeyboardShortcuts({
    onFocusSearch: () => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleFileClick = (file: File) => {
    setPreviewFile(file);
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
      await downloadFile(file._id, file.originalName);
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
        toast.success('File unstarred');
      } else {
        await api.files.starFile(file._id);
        toast.success('File starred');
      }
      refetch();
    } catch (error: any) {
      console.error('Star error:', error);
      toast.error(error.message || 'Failed to update star status');
    }
  };


  const handleCopyLink = async (file: File) => {
    const shareableUrl = api.files.getShareableUrl(file._id);
    try {
      await navigator.clipboard.writeText(shareableUrl);
      toast.success('Link copied to clipboard');
    } catch (error) {
      console.error('Failed to copy link:', error);
      toast.error('Failed to copy link');
    }
  };

  return (
    <ProtectedRoute>
      <Box sx={{ height: '100vh', backgroundColor: colors.background.default, color: colors.text.primary, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <TopBar onSearch={setSearchQuery} searchQuery={searchQuery} />
        
        <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden', pt: 8 }}>
          <Sidebar onNewClick={() => setShowUploadDialog(true)} />
          
          <Box
            component="main"
            sx={{
              flex: 1,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              ml: { xs: 0, md: 4 },
              transition: 'margin-left 300ms ease',
            }}
          >
            <Box
              sx={{
                flex: 1,
                overflowY: 'auto',
                width: '100%',
              }}
            >
              <Container maxWidth={false} sx={{ pl: { xs: 2, sm: 1, md: 0.5 }, pr: { xs: 2, sm: 3, md: 4 }, py: { xs: 3, sm: 4, md: 4 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: { xs: 2, sm: 3, md: 3 } }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontSize: { xs: '1.25rem', md: '1.375rem' },
                      fontWeight: 400,
                      color: colors.text.primary,
                    }}
                  >
                    My Drive
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', border: `1px solid ${colors.border.light}`, borderRadius: 1 }}>
                      <IconButton
                        onClick={() => setViewMode('grid')}
                        size="small"
                        sx={{
                          width: { xs: 36, sm: 40 },
                          height: { xs: 36, sm: 40 },
                          color: viewMode === 'grid' ? colors.text.primary : colors.text.secondary,
                          backgroundColor: viewMode === 'grid' ? colors.background.selected : 'transparent',
                          borderRadius: 0,
                          '&:hover': {
                            backgroundColor: viewMode === 'grid' ? colors.background.selected : colors.background.hover,
                          },
                        }}
                        aria-label="Grid view"
                      >
                        <GridView fontSize={isMobile ? 'small' : 'medium'} />
                      </IconButton>
                      <Box sx={{ width: 1, height: 24, backgroundColor: colors.border.light }} />
                      <IconButton
                        onClick={() => setViewMode('list')}
                        size="small"
                        sx={{
                          width: { xs: 36, sm: 40 },
                          height: { xs: 36, sm: 40 },
                          color: viewMode === 'list' ? colors.text.primary : colors.text.secondary,
                          backgroundColor: viewMode === 'list' ? colors.background.selected : 'transparent',
                          borderRadius: 0,
                          '&:hover': {
                            backgroundColor: viewMode === 'list' ? colors.background.selected : colors.background.hover,
                          },
                        }}
                        aria-label="List view"
                      >
                        <ListIcon fontSize={isMobile ? 'small' : 'medium'} />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>

                {viewMode === 'grid' ? (
                  <FileGrid
                    files={files}
                    loading={isLoading}
                    onFileClick={handleFileClick}
                    onFileMenuClick={handleFileMenuClick}
                    onFileDoubleClick={(file) => handleOpenFile(file)}
                    onFileStar={handleStar}
                  />
                ) : (
                  <FileList
                    files={files}
                    loading={isLoading}
                    onFileClick={handleFileClick}
                    onFileMenuClick={handleFileMenuClick}
                    onFileDoubleClick={(file) => handleOpenFile(file)}
                    onFileStar={handleStar}
                  />
                )}
              </Container>
            </Box>
          </Box>

          {previewFile && (
            <PreviewPanel
              file={previewFile}
              isOpen={!!previewFile}
              onClose={() => setPreviewFile(null)}
            />
          )}
        </Box>

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
      </Box>
    </ProtectedRoute>
  );
}
