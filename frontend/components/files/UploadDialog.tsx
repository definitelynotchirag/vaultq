'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Box,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Close, CloudUpload, InsertDriveFile } from '@mui/icons-material';
import { useUpload } from '@/hooks/useUpload';
import { formatFileSize } from '@/lib/utils';
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';

interface UploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete?: () => void;
}

export function UploadDialog({ isOpen, onClose, onUploadComplete }: UploadDialogProps) {
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
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1.5,
          borderBottom: '1px solid #e5e5e5',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 400, color: '#202124' }}>
          Upload Files
        </Typography>
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{
            color: '#5f6368',
            '&:hover': { backgroundColor: '#f1f3f4' },
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box
          onClick={() => fileInputRef.current?.click()}
          sx={{
            border: '2px dashed #dadce0',
            borderRadius: 2,
            p: { xs: 4, sm: 5 },
            textAlign: 'center',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: '#f8f9fa',
              borderColor: '#1a73e8',
            },
            transition: 'all 150ms ease',
          }}
        >
          <CloudUpload sx={{ fontSize: { xs: 40, sm: 48 }, color: '#5f6368', mb: { xs: 1.5, sm: 2 } }} />
          <Typography variant="body1" sx={{ fontWeight: 500, color: '#202124', mb: 1, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
            Click to select files
          </Typography>
          <Typography variant="body2" sx={{ color: '#5f6368', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
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
                    bgcolor: '#f1f3f4',
                    borderRadius: 2,
                    mb: 1,
                  }}
                >
                  <ListItemIcon>
                    <InsertDriveFile sx={{ color: '#5f6368' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={file.name}
                    secondary={formatFileSize(file.size)}
                    primaryTypographyProps={{
                      sx: {
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        fontWeight: 500,
                        color: '#202124',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      },
                    }}
                    secondaryTypographyProps={{
                      sx: {
                        fontSize: { xs: '0.6875rem', sm: '0.75rem' },
                        color: '#5f6368',
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
                    bgcolor: '#f1f3f4',
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
                        color: '#202124',
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
                        color: '#5f6368',
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
                      backgroundColor: '#dadce0',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor:
                          upload.status === 'success'
                            ? '#0f9d58'
                            : upload.status === 'error'
                            ? '#ea4335'
                            : '#1a73e8',
                      },
                    }}
                  />
                  {upload.error && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#ea4335',
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

      <DialogActions sx={{ px: 3, pb: 2.5, pt: 2, gap: 1.5 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            borderColor: '#dadce0',
            color: '#202124',
            '&:hover': {
              borderColor: '#dadce0',
              backgroundColor: '#f8f9fa',
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
            backgroundColor: '#1a73e8',
            '&:hover': {
              backgroundColor: '#1765cc',
            },
            '&:disabled': {
              backgroundColor: '#dadce0',
            },
            textTransform: 'none',
            boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
            flex: 1,
          }}
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
