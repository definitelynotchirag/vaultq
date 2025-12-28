'use client';

import { FileGrid } from '@/components/layout/FileGrid';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useTrashFiles } from '@/hooks/useTrashFiles';
import { colors } from '@/lib/colors';
import { File } from '@/types';
import { Delete as DeleteIcon, Restore } from '@mui/icons-material';
import { Box, Container, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from '@mui/material';
import { useState } from 'react';

export default function TrashPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [contextMenu, setContextMenu] = useState<{
    file: File;
    position: { x: number; y: number };
  } | null>(null);

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

  return (
    <ProtectedRoute>
      <Box sx={{ height: '100vh', backgroundColor: colors.background.default, color: colors.text.primary, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <TopBar onSearch={setSearchQuery} searchQuery={searchQuery} />
        
        <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden', pt: 8 }}>
          <Sidebar onNewClick={() => {}} />
          
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
              <Container maxWidth={false} sx={{ pl: { xs: 2, sm: 1, md: 0.5 }, pr: { xs: 2, sm: 3, md: 1 }, py: { xs: 3, sm: 4, md: 4 } }}>
                <Box sx={{ mb: { xs: 2, sm: 3, md: 3 } }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontSize: { xs: '1.25rem', md: '1.375rem' },
                      fontWeight: 400,
                      color: colors.text.primary,
                      mb: 1,
                    }}
                  >
                    Trash
                  </Typography>
                </Box>
                {files.length === 0 && !isLoading ? (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <Typography variant="body1" sx={{ color: colors.text.secondary }}>
                      Trash is empty
                    </Typography>
                  </Box>
                ) : (
                  <FileGrid
                    files={files}
                    loading={isLoading}
                    onFileMenuClick={handleFileMenuClick}
                  />
                )}
              </Container>
            </Box>
          </Box>
        </Box>

        {contextMenu && (
          <Menu
            open={true}
            onClose={() => setContextMenu(null)}
            anchorReference="anchorPosition"
            anchorPosition={{ top: contextMenu.position.y, left: contextMenu.position.x }}
            PaperProps={{
              sx: {
                minWidth: 200,
                boxShadow: colors.shadow.menu,
                border: `1px solid ${colors.border.default}`,
              },
            }}
          >
            <MenuItem
              onClick={() => {
                handleRestore(contextMenu.file._id);
                setContextMenu(null);
              }}
            >
              <ListItemIcon>
                <Restore fontSize="small" />
              </ListItemIcon>
              <ListItemText>Restore</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleDownload(contextMenu.file);
                setContextMenu(null);
              }}
            >
              <ListItemText>Download</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => {
                handlePermanentDelete(contextMenu.file._id);
                setContextMenu(null);
              }}
              sx={{ color: colors.error.main }}
            >
              <ListItemIcon>
                <DeleteIcon fontSize="small" sx={{ color: colors.error.main }} />
              </ListItemIcon>
              <ListItemText>Delete forever</ListItemText>
            </MenuItem>
          </Menu>
        )}
      </Box>
    </ProtectedRoute>
  );
}
