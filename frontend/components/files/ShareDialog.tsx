'use client';

import { useTheme as useCustomTheme } from '@/contexts/ThemeContext';
import { api } from '@/lib/api';
import { getColors } from '@/lib/colors';
import { File } from '@/types';
import {
  Check,
  Close,
  ContentCopy,
  Link as LinkIcon,
  Lock,
  LockOpen,
  Mail,
  OpenInNew,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface ShareDialogProps {
  isOpen: boolean;
  file: File | null;
  onClose: () => void;
  onShareComplete?: () => void;
}

export function ShareDialog({ isOpen, file, onClose, onShareComplete }: ShareDialogProps) {
  const { mode } = useCustomTheme();
  const colors = getColors(mode);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentFile, setCurrentFile] = useState<File | null>(file);
  const [isPublic, setIsPublic] = useState(file?.public || false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [permissionLevel, setPermissionLevel] = useState<'read' | 'write'>('read');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && file) {
      setIsLoading(true);
      api.files.getFile(file._id)
        .then((response) => {
          if (response.success  && response.file) {
            setCurrentFile(response.file);
            setIsPublic(response.file.public || false);
          }
        })
        .catch((error: any) => {
          console.error('Failed to fetch file:', error);
          toast.error('Failed to load file information');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen, file]);

  useEffect(() => {
    if (file) {
      setCurrentFile(file);
      setIsPublic(file.public || false);
    }
  }, [file]);

  if (!isOpen || !currentFile) return null;

  const handleTogglePublic = async () => {
    setIsSaving(true);
    try {
      if (isPublic) {
        await api.files.makePrivate(currentFile._id);
        toast.success('File is now private');
      } else {
        await api.files.makePublic(currentFile._id);
        toast.success('File is now public');
      }
      setIsPublic(!isPublic);
      const updatedFile = await api.files.getFile(currentFile._id);
      if (updatedFile.success && updatedFile.file) {
        setCurrentFile(updatedFile.file);
      }
      if (onShareComplete) {
        onShareComplete();
      }
    } catch (error: any) {
      console.error('Toggle public error:', error);
      toast.error(error.message || 'Failed to update file visibility');
    } finally {
      setIsSaving(false);
    }
  };

  const handleShareWithUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSaving(true);
    try {
      await api.files.shareFileByEmail(currentFile._id, email.trim(), permissionLevel);
      toast.success(`File shared with ${email.trim()}`);
      setEmail('');
      const updatedFile = await api.files.getFile(currentFile._id);
      if (updatedFile.success && updatedFile.file) {
        setCurrentFile(updatedFile.file);
      }
      if (onShareComplete) {
        onShareComplete();
      }
    } catch (error: any) {
      console.error('Share error:', error);
      toast.error(error.message || 'Failed to share file. Please check the email address.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyLink = async () => {
    const shareableUrl = api.files.getShareableUrl(currentFile._id);
    try {
      await navigator.clipboard.writeText(shareableUrl);
      setCopied(true);
      toast.success('Link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
      toast.error('Failed to copy link');
    }
  };

  const handleOpenInNewTab = () => {
    const shareableUrl = api.files.getShareableUrl(currentFile._id);
    if (shareableUrl) {
      window.open(shareableUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleUpdatePermission = async (userId: string, newLevel: 'read' | 'write') => {
    setIsSaving(true);
    try {
      await api.files.shareFile(currentFile._id, userId, newLevel);
      toast.success('Permission updated successfully');
      const updatedFile = await api.files.getFile(currentFile._id);
      if (updatedFile.success && updatedFile.file) {
        setCurrentFile(updatedFile.file);
      }
      if (onShareComplete) {
        onShareComplete();
      }
    } catch (error: any) {
      console.error('Update permission error:', error);
      toast.error(error.message || 'Failed to update permission');
    } finally {
      setIsSaving(false);
    }
  };

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
        <Typography
          variant="h6"
          sx={{
            fontWeight: 400,
            color: colors.text.primary,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            pr: { xs: 1, sm: 2 },
            fontSize: { xs: '0.9375rem', sm: '1.125rem', md: '1.375rem' },
          }}
          >
          Share "{currentFile.originalName}"
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
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: { xs: 150, sm: 200 } }}>
            <CircularProgress size={isMobile ? 32 : 40} />
          </Box>
        ) : (
          <>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 1.5, sm: 2 },
                p: { xs: 1.5, sm: 2 },
                bgcolor: colors.background.hover,
                borderRadius: 2,
                mb: { xs: 2, sm: 3 },
                flexDirection: { xs: 'column', sm: 'row' },
              }}
            >
          <Avatar sx={{ bgcolor: colors.primary.main, width: { xs: 36, sm: 40 }, height: { xs: 36, sm: 40 } }}>
            <LinkIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0, width: { xs: '100%', sm: 'auto' } }}>
            <Typography variant="body2" sx={{ fontWeight: 500, color: colors.text.primary, fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}>
              Anyone with the link
            </Typography>
            <Typography variant="caption" sx={{ color: colors.text.secondary, fontSize: { xs: '0.6875rem', sm: '0.75rem' } }}>
              {isPublic ? 'Can view' : 'No access'}
            </Typography>
          </Box>
          <Button
            onClick={handleTogglePublic}
            disabled={isSaving}
            variant={isPublic ? 'contained' : 'outlined'}
            startIcon={isPublic ? <LockOpen sx={{ fontSize: { xs: 16, sm: 18 } }} /> : <Lock sx={{ fontSize: { xs: 16, sm: 18 } }} />}
            fullWidth={isMobile}
            sx={{
              backgroundColor: isPublic ? colors.primary.main : 'transparent',
              borderColor: isPublic ? 'transparent' : colors.border.light,
              color: isPublic ? colors.text.white : colors.text.primary,
              '&:hover': {
                backgroundColor: isPublic ? colors.primary.hover : colors.background.hover,
              },
              textTransform: 'none',
              boxShadow: isPublic ? colors.shadow.card : 'none',
              fontSize: { xs: '0.8125rem', sm: '0.875rem' },
              py: { xs: 0.75, sm: 1 },
            }}
          >
            {isPublic ? 'Public' : 'Private'}
          </Button>
        </Box>

        <Box sx={{ borderTop: `1px solid ${colors.border.default}`, pt: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 } }}>
          <Typography variant="body2" sx={{ fontWeight: 500, color: colors.text.primary, mb: { xs: 1.5, sm: 2 }, fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}>
            Copy link
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
            <TextField
              value={api.files.getShareableUrl(currentFile._id)}
              InputProps={{
                readOnly: true,
              }}
              fullWidth
              variant="outlined"
              sx={{
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  bgcolor: colors.background.hover,
                  borderRadius: 2,
                },
              }}
            />
            <Button
              onClick={handleCopyLink}
              variant="contained"
              startIcon={copied ? <Check sx={{ fontSize: { xs: 16, sm: 18 } }} /> : <ContentCopy sx={{ fontSize: { xs: 16, sm: 18 } }} />}
              sx={{
                backgroundColor: copied ? colors.success.main : colors.primary.main,
                '&:hover': {
                  backgroundColor: copied ? colors.success.main : colors.primary.hover,
                },
                textTransform: 'none',
                boxShadow: colors.shadow.card,
                minWidth: { xs: '100%', sm: 'auto' },
                fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                py: { xs: 0.75, sm: 1 },
              }}
            >
              {copied ? 'Copied' : 'Copy'}
            </Button>
            <Button
              onClick={handleOpenInNewTab}
              variant="outlined"
              startIcon={<OpenInNew sx={{ fontSize: { xs: 16, sm: 18 } }} />}
              sx={{
                borderColor: colors.border.light,
                color: colors.text.primary,
                '&:hover': {
                  backgroundColor: colors.background.selected,
                  borderColor: colors.border.light,
                },
                textTransform: 'none',
                minWidth: { xs: '100%', sm: 'auto' },
                fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                py: { xs: 0.75, sm: 1 },
              }}
            >
              Open in new tab
            </Button>
          </Box>
        </Box>

        <Box sx={{ borderTop: `1px solid ${colors.border.default}`, pt: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 } }}>
          <Typography variant="body2" sx={{ fontWeight: 500, color: colors.text.primary, mb: { xs: 1.5, sm: 2 }, fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}>
            Share with specific people
          </Typography>
          <form onSubmit={handleShareWithUser}>
            <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' }, mb: { xs: 1.5, sm: 2 } }}>
              <TextField
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                fullWidth
                variant="outlined"
                InputProps={{
                  startAdornment: <Mail sx={{ color: colors.text.secondary, mr: 1, fontSize: { xs: 18, sm: 20 } }} />,
                }}
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                  },
                }}
              />
              <FormControl sx={{ minWidth: { xs: '100%', sm: 140 } }}>
                <InputLabel sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>Permission</InputLabel>
                <Select
                  value={permissionLevel}
                  onChange={(e) => setPermissionLevel(e.target.value as 'read' | 'write')}
                  label="Permission"
                  sx={{
                    borderRadius: 2,
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                  }}
                >
                  <MenuItem value="read" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>Can view</MenuItem>
                  <MenuItem value="write" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>Can edit</MenuItem>
                </Select>
              </FormControl>
              <Button
                type="submit"
                disabled={!email.trim() || isSaving}
                variant="contained"
                sx={{
                  backgroundColor: colors.primary.main,
                  '&:hover': {
                    backgroundColor: colors.primary.hover,
                  },
                  '&:disabled': {
                    backgroundColor: colors.border.light,
                  },
                  textTransform: 'none',
                  boxShadow: colors.shadow.card,
                  minWidth: { xs: '100%', sm: 'auto' },
                  fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                  py: { xs: 0.75, sm: 1 },
                }}
              >
                Share
              </Button>
            </Box>
          </form>
        </Box>

        {currentFile.permissions && currentFile.permissions.length > 0 && (
          <Box sx={{ borderTop: `1px solid ${colors.border.default}`, pt: { xs: 2, sm: 3 } }}>
            <Typography variant="body2" sx={{ fontWeight: 500, color: colors.text.primary, mb: { xs: 1.5, sm: 2 }, fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}>
              People with access
            </Typography>
            <List>
              {currentFile.permissions.map((perm, index) => {
                const permUser = typeof perm.userId === 'object' && perm.userId !== null
                  ? (perm.userId as any)
                  : null;
                const userName = permUser?.name || 'Unknown User';
                const userEmail = permUser?.email || perm.userId;
                const userId = String(permUser?._id || perm.userId);

                return (
                  <ListItem
                    key={index}
                    sx={{
                      bgcolor: colors.background.hover,
                      borderRadius: 2,
                      mb: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: { xs: 1, sm: 2 },
                      px: { xs: 1.5, sm: 2 },
                      py: { xs: 1, sm: 1.5 },
                      flexDirection: { xs: 'column', sm: 'row' },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 }, width: { xs: '100%', sm: 'auto' }, flex: { xs: '0 0 auto', sm: 1 } }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: colors.secondary.main, width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 } }}>
                          {userName.charAt(0).toUpperCase()}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={userName}
                        secondary={
                          <Typography variant="caption" sx={{ display: 'block', color: colors.text.secondary, fontSize: { xs: '0.6875rem', sm: '0.75rem' } }}>
                            {userEmail}
                          </Typography>
                        }
                        primaryTypographyProps={{
                          sx: {
                            fontWeight: 500,
                            color: colors.text.primary,
                            fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                          },
                        }}
                        sx={{ flex: 1 }}
                      />
                    </Box>
                    <FormControl 
                      size="small" 
                      sx={{ 
                        minWidth: { xs: '100%', sm: 140 },
                        width: { xs: '100%', sm: 'auto' },
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                        },
                      }}
                    >
                      <Select
                        value={perm.level}
                        onChange={(e) => handleUpdatePermission(userId, e.target.value as 'read' | 'write')}
                        disabled={isSaving}
                        sx={{
                          bgcolor: colors.background.default,
                        }}
                      >
                        <MenuItem value="read" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>Can view</MenuItem>
                        <MenuItem value="write" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>Can edit</MenuItem>
                      </Select>
                    </FormControl>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        )}
          </>
        )}
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
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}
