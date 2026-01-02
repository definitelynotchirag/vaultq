'use client';

import { useTheme as useCustomTheme } from '@/contexts/ThemeContext';
import { useUpload } from '@/hooks/useUpload';
import { getColors } from '@/lib/colors';
import { formatFileSize } from '@/lib/utils';
import { Close, CloudUpload, InsertDriveFile } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';

interface UploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete?: () => void;
}

export function UploadDialog({ isOpen, onClose, onUploadComplete }: UploadDialogProps) {
  const { mode } = useCustomTheme();
  const colors = getColors(mode);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, uploads, isUploading, clearUploads } = useUpload();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    for (const file of selectedFiles) {
      try {
        await uploadFile(file);
        toast.success(`${file.name} uploaded successfully`);
        if (onUploadComplete) {
          onUploadComplete();
        }
      } catch (error: any) {
        console.error('Upload error:', error);
        toast.error(error.message || `Failed to upload ${file.name}`);
      }
    }
    setSelectedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    setSelectedFiles([]);
    clearUploads();
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          backgroundColor: colors.background.darkBackground,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1.5,
          borderBottom: `1px solid ${colors.border.default}`,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 400, color: colors.text.primary }}>
          Upload Files
        </Typography>
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{
            color: colors.text.secondary,
            '&:hover': { backgroundColor: colors.background.hover },
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, backgroundColor: colors.background.default }}>
        <Box
          onClick={() => fileInputRef.current?.click()}
          sx={{
            border: `2px dashed ${colors.border.default}`,
            borderRadius: 2,
            p: { xs: 4, sm: 5 },
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: colors.background.hover,
            '&:hover': {
              backgroundColor: colors.background.selected,
              borderColor: colors.primary.main,
            },
            transition: 'all 150ms ease',
          }}
        >
          <CloudUpload sx={{ fontSize: { xs: 40, sm: 48 }, color: colors.text.secondary, mb: { xs: 1.5, sm: 2 } }} />
          <Typography variant="body1" sx={{ fontWeight: 500, color: colors.text.primary, mb: 1, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
            Click to select files
          </Typography>
          <Typography variant="body2" sx={{ color: colors.text.secondary, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
            Maximum file size: 100MB
          </Typography>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </Box>

        {selectedFiles.length > 0 && (
          <Box sx={{ mt: { xs: 2, sm: 2.5 }, maxHeight: { xs: 180, sm: 200 }, overflowY: 'auto' }}>
            <List>
              {selectedFiles.map((file, index) => (
                <ListItem
                  key={index}
                  sx={{
                    bgcolor: colors.background.hover,
                    borderRadius: 2,
                    mb: 1,
                  }}
                >
                  <ListItemIcon>
                    <InsertDriveFile sx={{ color: colors.text.secondary }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={file.name}
                    secondary={formatFileSize(file.size)}
                    primaryTypographyProps={{
                      sx: {
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        fontWeight: 500,
                        color: colors.text.primary,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      },
                    }}
                    secondaryTypographyProps={{
                      sx: {
                        fontSize: { xs: '0.6875rem', sm: '0.75rem' },
                        color: colors.text.secondary,
                      },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {uploads.length > 0 && (
          <Box sx={{ mt: { xs: 2, sm: 2.5 }, maxHeight: { xs: 180, sm: 200 }, overflowY: 'auto' }}>
            <List>
              {uploads.map((upload, index) => (
                <ListItem
                  key={index}
                  sx={{
                    bgcolor: colors.background.hover,
                    borderRadius: 2,
                    mb: 1,
                    flexDirection: 'column',
                    alignItems: 'stretch',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        fontWeight: 500,
                        color: colors.text.primary,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        flex: 1,
                        mr: 1,
                      }}
                    >
                      {(upload.file as any).name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: { xs: '0.6875rem', sm: '0.75rem' },
                        color: colors.text.secondary,
                      }}
                    >
                      {upload.progress}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={upload.progress}
                    sx={{
                      height: 8,
                      borderRadius: 1,
                      backgroundColor: colors.background.selected,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor:
                          upload.status === 'success'
                            ? colors.success.main
                            : upload.status === 'error'
                            ? colors.error.main
                            : colors.primary.main,
                        borderRadius: 1,
                      },
                    }}
                  />
                  {upload.error && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: colors.error.main,
                        fontSize: { xs: '0.6875rem', sm: '0.75rem' },
                        mt: 1,
                      }}
                    >
                      {upload.error}
                    </Typography>
                  )}
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, pt: 2, gap: 1.5, borderTop: `1px solid ${colors.border.default}` }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            borderColor: colors.border.light,
            color: colors.text.primary,
            '&:hover': {
              borderColor: colors.border.light,
              backgroundColor: colors.background.hover,
            },
            textTransform: 'none',
            flex: 1,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          disabled={selectedFiles.length === 0 || isUploading}
          variant="contained"
          sx={{
            backgroundColor: colors.primary.main,
            color: colors.text.white,
            '&:hover': {
              backgroundColor: colors.primary.hover,
            },
            '&:disabled': {
              backgroundColor: colors.background.selected,
              color: colors.text.disabled,
            },
            textTransform: 'none',
            boxShadow: colors.shadow.card,
            flex: 1,
          }}
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
