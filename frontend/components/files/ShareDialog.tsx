'use client';

import { api } from '@/lib/api';
import { colors } from '@/lib/colors';
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
          if (response.success && response.file) {
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
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1.5,
          // borderBottom: `1px solid ${colors.border.default}`,
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
            pr: 2,
            fontSize: { xs: '1rem', md: '1.375rem' },
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

      <DialogContent sx={{ flex: 1, overflowY: 'auto', pt: 3 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                bgcolor: colors.background.light,
                borderRadius: 2,
                mb: 3,
              }}
            >
          <Avatar sx={{ bgcolor: colors.primary.main, width: 40, height: 40 }}>
            <LinkIcon />
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, color: '#202124' }}>
              Anyone with the link
            </Typography>
            <Typography variant="caption" sx={{ color: '#5f6368' }}>
              {isPublic ? 'Can view' : 'No access'}
            </Typography>
          </Box>
          <Button
            onClick={handleTogglePublic}
            disabled={isSaving}
            variant={isPublic ? 'contained' : 'outlined'}
            startIcon={isPublic ? <LockOpen /> : <Lock />}
            sx={{
              backgroundColor: isPublic ? colors.primary.main : 'transparent',
              borderColor: isPublic ? 'transparent' : colors.border.light,
              color: isPublic ? colors.text.white : colors.text.primary,
              '&:hover': {
                backgroundColor: isPublic ? colors.primary.hover : colors.background.light,
              },
              textTransform: 'none',
              boxShadow: isPublic ? colors.shadow.card : 'none',
            }}
          >
            {isPublic ? 'Public' : 'Private'}
          </Button>
        </Box>

        <Box sx={{ borderTop: '1px solid #e5e5e5', pt: 3, mb: 3 }}>
          <Typography variant="body2" sx={{ fontWeight: 500, color: '#202124', mb: 2 }}>
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
                  bgcolor: colors.background.light,
                  borderRadius: 2,
                },
              }}
            />
            <Button
              onClick={handleCopyLink}
              variant="contained"
              startIcon={copied ? <Check /> : <ContentCopy />}
              sx={{
                backgroundColor: copied ? colors.success.main : colors.primary.main,
                '&:hover': {
                  backgroundColor: copied ? colors.success.main : colors.primary.hover,
                },
                textTransform: 'none',
                boxShadow: colors.shadow.card,
                minWidth: { xs: '100%', sm: 'auto' },
              }}
            >
              {copied ? 'Copied' : 'Copy'}
            </Button>
            <Button
              onClick={handleOpenInNewTab}
              variant="outlined"
              startIcon={<OpenInNew />}
              sx={{
                borderColor: colors.border.light,
                color: colors.text.primary,
                '&:hover': {
                  backgroundColor: colors.background.light,
                  borderColor: colors.border.light,
                },
                textTransform: 'none',
                minWidth: { xs: '100%', sm: 'auto' },
              }}
            >
              Open in new tab
            </Button>
          </Box>
        </Box>

        <Box sx={{ borderTop: '1px solid #e5e5e5', pt: 3, mb: 3 }}>
          <Typography variant="body2" sx={{ fontWeight: 500, color: '#202124', mb: 2 }}>
            Share with specific people
          </Typography>
          <form onSubmit={handleShareWithUser}>
            <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' }, mb: 2 }}>
              <TextField
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                fullWidth
                variant="outlined"
                InputProps={{
                  startAdornment: <Mail sx={{ color: colors.text.secondary, mr: 1 }} />,
                }}
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              <FormControl sx={{ minWidth: { xs: '100%', sm: 140 } }}>
                <InputLabel>Permission</InputLabel>
                <Select
                  value={permissionLevel}
                  onChange={(e) => setPermissionLevel(e.target.value as 'read' | 'write')}
                  label="Permission"
                  sx={{
                    borderRadius: 2,
                  }}
                >
                  <MenuItem value="read">Can view</MenuItem>
                  <MenuItem value="write">Can edit</MenuItem>
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
                }}
              >
                Share
              </Button>
            </Box>
          </form>
        </Box>

        {currentFile.permissions && currentFile.permissions.length > 0 && (
          <Box sx={{ borderTop: '1px solid #e5e5e5', pt: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, color: '#202124', mb: 2 }}>
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
                      bgcolor: colors.background.light,
                      borderRadius: 2,
                      mb: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: colors.secondary.main, width: 40, height: 40 }}>
                        {userName.charAt(0).toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={userName}
                      secondary={
                        <Typography variant="caption" sx={{ display: 'block', color: colors.text.secondary }}>
                          {userEmail}
                        </Typography>
                      }
                      primaryTypographyProps={{
                        sx: {
                          fontWeight: 500,
                          color: colors.text.primary,
                        },
                      }}
                      sx={{ flex: 1 }}
                    />
                    <FormControl 
                      size="small" 
                      sx={{ 
                        minWidth: { xs: 120, sm: 140 },
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
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
                        <MenuItem value="read">Can view</MenuItem>
                        <MenuItem value="write">Can edit</MenuItem>
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

      <DialogActions sx={{ px: 3, pb: 2.5, pt: 2, borderTop: '1px solid #e5e5e5', flexShrink: 0 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: colors.primary.main,
            '&:hover': {
              backgroundColor: colors.primary.hover,
            },
            textTransform: 'none',
            boxShadow: colors.shadow.card,
          }}
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}
