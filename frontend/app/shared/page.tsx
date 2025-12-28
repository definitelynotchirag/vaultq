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
import { colors } from '@/lib/colors';
import { File } from '@/types';
import { Box, Container, Typography } from '@mui/material';
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
              ml: { xs: 0, md: 'var(--sidebar-width, 256px)' },
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
                <Box sx={{ mb: { xs: 2, sm: 3, md: 3 } }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontSize: { xs: '1.25rem', md: '1.375rem' },
                      fontWeight: 400,
                      color: colors.text.primary,
                      mb: { xs: 2, sm: 3, md: 3 },
                    }}
                  >
                    Shared with me
                  </Typography>
                </Box>
                <FileGrid
                  files={sharedFiles}
                  loading={isLoading}
                  onFileMenuClick={handleFileMenuClick}
                  onFileDoubleClick={(file) => handleOpenFile(file)}
                  onFileStar={handleStar}
                />
              </Container>
            </Box>
          </Box>
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
