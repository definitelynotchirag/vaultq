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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Close,
  Person,
  CalendarToday,
  Storage,
  Lock,
  LockOpen,
  Share,
} from '@mui/icons-material';
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
    <Dialog
      open={isOpen && !!file}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
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
          flexShrink: 0,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 400, color: '#202124' }}>
          File information
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: '#5f6368',
            '&:hover': { backgroundColor: '#f1f3f4' },
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ flex: 1, overflowY: 'auto', pt: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.6875rem',
              fontWeight: 500,
              color: '#5f6368',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              display: 'block',
              mb: 1.5,
            }}
          >
            General
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography variant="body2" sx={{ color: '#5f6368', minWidth: 120 }}>
                Name
              </Typography>
              <Typography variant="body2" sx={{ color: '#202124', wordBreak: 'break-word', flex: 1 }}>
                {file.originalName}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography variant="body2" sx={{ color: '#5f6368', minWidth: 120 }}>
                Type
              </Typography>
              <Typography variant="body2" sx={{ color: '#202124' }}>
                {getFileType(file.originalName)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography variant="body2" sx={{ color: '#5f6368', minWidth: 120 }}>
                Size
              </Typography>
              <Typography variant="body2" sx={{ color: '#202124' }}>
                {formatFileSize(file.size)}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 3 }}>
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.6875rem',
              fontWeight: 500,
              color: '#5f6368',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              display: 'block',
              mb: 1.5,
            }}
          >
            Details
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Person sx={{ color: '#5f6368', mt: 0.5 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ color: '#5f6368', display: 'block', mb: 0.5 }}>
                  Owner
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#202124' }}>
                  {ownerName}
                </Typography>
                {ownerEmail && (
                  <Typography variant="caption" sx={{ color: '#5f6368' }}>
                    {ownerEmail}
                  </Typography>
                )}
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <CalendarToday sx={{ color: '#5f6368', mt: 0.5 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ color: '#5f6368', display: 'block', mb: 0.5 }}>
                  Created
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#202124' }}>
                  {formatDate(file.createdAt)}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <CalendarToday sx={{ color: '#5f6368', mt: 0.5 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ color: '#5f6368', display: 'block', mb: 0.5 }}>
                  Modified
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#202124' }}>
                  {formatDate(file.updatedAt)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box>
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.6875rem',
              fontWeight: 500,
              color: '#5f6368',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              display: 'block',
              mb: 1.5,
            }}
          >
            Sharing
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            {file.public ? (
              <>
                <LockOpen sx={{ color: '#0f9d58' }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: '#202124' }}>
                    Anyone with the link can view
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#5f6368' }}>
                    Public
                  </Typography>
                </Box>
              </>
            ) : (
              <>
                <Lock sx={{ color: '#5f6368' }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: '#202124' }}>
                    Private
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#5f6368' }}>
                    Only people with access can view
                  </Typography>
                </Box>
              </>
            )}
          </Box>

          {file.permissions && file.permissions.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Share sx={{ fontSize: 14, color: '#5f6368' }} />
                <Typography variant="caption" sx={{ fontWeight: 500, color: '#5f6368' }}>
                  Shared with ({file.permissions.length})
                </Typography>
              </Box>
              <List>
                {file.permissions.map((perm, index) => {
                  const permUser = typeof perm.userId === 'object' && perm.userId !== null
                    ? (perm.userId as any)
                    : null;
                  const userName = permUser?.name || 'Unknown User';
                  const userEmail = permUser?.email || '';

                  return (
                    <ListItem
                      key={index}
                      sx={{
                        bgcolor: '#f8f9fa',
                        borderRadius: 2,
                        mb: 1,
                      }}
                    >
                      <ListItemText
                        primary={userName}
                        secondary={userEmail}
                        primaryTypographyProps={{
                          sx: {
                            fontWeight: 500,
                            color: '#202124',
                          },
                        }}
                        secondaryTypographyProps={{
                          sx: {
                            color: '#5f6368',
                          },
                        }}
                      />
                      <Typography variant="caption" sx={{ color: '#5f6368' }}>
                        {perm.level === 'read' ? 'Can view' : 'Can edit'}
                      </Typography>
                    </ListItem>
                  );
                })}
              </List>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, pt: 2, borderTop: '1px solid #e5e5e5', flexShrink: 0 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: '#1a73e8',
            '&:hover': {
              backgroundColor: '#1765cc',
            },
            textTransform: 'none',
            boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
