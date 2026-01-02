'use client';

import { useTheme as useCustomTheme } from '@/contexts/ThemeContext';
import { getColors } from '@/lib/colors';
import { formatFileSize } from '@/lib/utils';
import { File } from '@/types';
import {
  CalendarToday,
  Close,
  Lock,
  LockOpen,
  Person,
  Share
} from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';

interface FileInfoDialogProps {
  isOpen: boolean;
  file: File | null;
  onClose: () => void;
}

export function FileInfoDialog({ isOpen, file, onClose }: FileInfoDialogProps) {
  const { mode } = useCustomTheme();
  const colors = getColors(mode);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
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
          backgroundColor: colors.background.darkBackground,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: { xs: 1, sm: 1.5 },
          px: { xs: 2, sm: 3 },
          pt: { xs: 2, sm: 3 },
          flexShrink: 0,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 400, color: colors.text.primary, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
          File information
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: colors.text.secondary,
            '&:hover': { backgroundColor: colors.background.hover },
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ flex: 1, overflowY: 'auto', pt: { xs: 2, sm: 3 }, px: { xs: 2, sm: 3 } }}>
        <Box sx={{ mb: { xs: 2, sm: 3 } }}>
          <Typography
            variant="caption"
            sx={{
              fontSize: { xs: '0.625rem', sm: '0.6875rem' },
              fontWeight: 500,
              color: colors.text.secondary,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              display: 'block',
              mb: { xs: 1, sm: 1.5 },
            }}
          >
            General
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1, sm: 1.5 } }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 0.5, sm: 2 } }}>
              <Typography variant="body2" sx={{ color: colors.text.secondary, minWidth: { xs: 'auto', sm: 120 }, fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}>
                Name
              </Typography>
              <Typography variant="body2" sx={{ color: colors.text.primary, wordBreak: 'break-word', flex: 1, fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}>
                {file.originalName}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 0.5, sm: 2 } }}>
              <Typography variant="body2" sx={{ color: colors.text.secondary, minWidth: { xs: 'auto', sm: 120 }, fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}>
                Type
              </Typography>
              <Typography variant="body2" sx={{ color: colors.text.primary, fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}>
                {getFileType(file.originalName)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 0.5, sm: 2 } }}>
              <Typography variant="body2" sx={{ color: colors.text.secondary, minWidth: { xs: 'auto', sm: 120 }, fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}>
                Size
              </Typography>
              <Typography variant="body2" sx={{ color: colors.text.primary, fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}>
                {formatFileSize(file.size)}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: { xs: 2, sm: 3 }, borderColor: colors.border.default }} />

        <Box sx={{ mb: { xs: 2, sm: 3 } }}>
          <Typography
            variant="caption"
            sx={{
              fontSize: { xs: '0.625rem', sm: '0.6875rem' },
              fontWeight: 500,
              color: colors.text.secondary,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              display: 'block',
              mb: { xs: 1, sm: 1.5 },
            }}
          >
            Details
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1, sm: 1.5 } }}>
            <Box sx={{ display: 'flex', gap: { xs: 1, sm: 2 } }}>
              <Person sx={{ color: colors.text.secondary, mt: 0.5, fontSize: { xs: 18, sm: 20 } }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', mb: 0.5, fontSize: { xs: '0.6875rem', sm: '0.75rem' } }}>
                  Owner
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, color: colors.text.primary, fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}>
                  {ownerName}
                </Typography>
                {ownerEmail && (
                  <Typography variant="caption" sx={{ color: colors.text.secondary, fontSize: { xs: '0.6875rem', sm: '0.75rem' } }}>
                    {ownerEmail}
                  </Typography>
                )}
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: { xs: 1, sm: 2 } }}>
              <CalendarToday sx={{ color: colors.text.secondary, mt: 0.5, fontSize: { xs: 18, sm: 20 } }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', mb: 0.5, fontSize: { xs: '0.6875rem', sm: '0.75rem' } }}>
                  Created
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, color: colors.text.primary, fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}>
                  {formatDate(file.createdAt)}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: { xs: 1, sm: 2 } }}>
              <CalendarToday sx={{ color: colors.text.secondary, mt: 0.5, fontSize: { xs: 18, sm: 20 } }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', mb: 0.5, fontSize: { xs: '0.6875rem', sm: '0.75rem' } }}>
                  Modified
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, color: colors.text.primary, fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}>
                  {formatDate(file.updatedAt)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: { xs: 2, sm: 3 }, borderColor: colors.border.default }} />

        <Box>
          <Typography
            variant="caption"
            sx={{
              fontSize: { xs: '0.625rem', sm: '0.6875rem' },
              fontWeight: 500,
              color: colors.text.secondary,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              display: 'block',
              mb: { xs: 1, sm: 1.5 },
            }}
          >
            Sharing
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, mb: { xs: 1.5, sm: 2 } }}>
            {file.public ? (
              <>
                <LockOpen sx={{ color: colors.success.main, fontSize: { xs: 18, sm: 20 } }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: colors.text.primary, fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}>
                    Anyone with the link can view
                  </Typography>
                  <Typography variant="caption" sx={{ color: colors.text.secondary, fontSize: { xs: '0.6875rem', sm: '0.75rem' } }}>
                    Public
                  </Typography>
                </Box>
              </>
            ) : (
              <>
                <Lock sx={{ color: colors.text.secondary, fontSize: { xs: 18, sm: 20 } }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: colors.text.primary, fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}>
                    Private
                  </Typography>
                  <Typography variant="caption" sx={{ color: colors.text.secondary, fontSize: { xs: '0.6875rem', sm: '0.75rem' } }}>
                    Only people with access can view
                  </Typography>
                </Box>
              </>
            )}
          </Box>

          {file.permissions && file.permissions.length > 0 && (
            <Box sx={{ mt: { xs: 1.5, sm: 2 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Share sx={{ fontSize: { xs: 12, sm: 14 }, color: colors.text.secondary }} />
                <Typography variant="caption" sx={{ fontWeight: 500, color: colors.text.secondary, fontSize: { xs: '0.6875rem', sm: '0.75rem' } }}>
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
                        bgcolor: colors.background.hover,
                        borderRadius: 2,
                        mb: 1,
                        px: { xs: 1.5, sm: 2 },
                        py: { xs: 1, sm: 1.5 },
                      }}
                    >
                      <ListItemText
                        primary={userName}
                        secondary={userEmail}
                        primaryTypographyProps={{
                          sx: {
                            fontWeight: 500,
                            color: colors.text.primary,
                            fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                          },
                        }}
                        secondaryTypographyProps={{
                          sx: {
                            color: colors.text.secondary,
                            fontSize: { xs: '0.6875rem', sm: '0.75rem' },
                          },
                        }}
                      />
                      <Typography variant="caption" sx={{ color: colors.text.secondary, fontSize: { xs: '0.6875rem', sm: '0.75rem' } }}>
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

      <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 2.5 }, pt: { xs: 1.5, sm: 2 }, borderTop: `1px solid ${colors.border.default}`, flexShrink: 0 }}>
        <Button
          onClick={onClose}
          variant="contained"
          fullWidth={isMobile}
          sx={{
            backgroundColor: colors.primary.main,
            '&:hover': {
              backgroundColor: colors.primary.hover,
            },
            textTransform: 'none',
            boxShadow: colors.shadow.card,
            fontSize: { xs: '0.875rem', sm: '1rem' },
            py: { xs: 1, sm: 1.25 },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
