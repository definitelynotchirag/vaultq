'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  IconButton,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import {
  Close,
  Link as LinkIcon,
  Lock,
  LockOpen,
  Check,
  ContentCopy,
  Mail,
  OpenInNew,
} from '@mui/icons-material';
import { File } from '@/types';
import { api } from '@/lib/api';
import { colors } from '@/lib/colors';
import { useState } from 'react';

interface ShareDialogProps {
  isOpen: boolean;
  file: File | null;
  onClose: () => void;
  onShareComplete?: () => void;
}

export function ShareDialog({ isOpen, file, onClose, onShareComplete }: ShareDialogProps) {
  const [isPublic, setIsPublic] = useState(file?.public || false);
  const [isSaving, setIsSaving] = useState(false);
  const [email, setEmail] = useState('');
  const [permissionLevel, setPermissionLevel] = useState<'read' | 'write'>('read');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !file) return null;

  const handleTogglePublic = async () => {
    setIsSaving(true);
    try {
      if (isPublic) {
        await api.files.makePrivate(file._id);
      } else {
        await api.files.makePublic(file._id);
      }
      setIsPublic(!isPublic);
      if (onShareComplete) {
        onShareComplete();
      }
    } catch (error) {
      console.error('Toggle public error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleShareWithUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSaving(true);
    try {
      await api.files.shareFileByEmail(file._id, email.trim(), permissionLevel);
      setEmail('');
      if (onShareComplete) {
        onShareComplete();
      }
    } catch (error: any) {
      console.error('Share error:', error);
      alert(error.message || 'Failed to share file. Please check the email address.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyLink = async () => {
    const shareableUrl = api.files.getShareableUrl(file._id);
    try {
      await navigator.clipboard.writeText(shareableUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleOpenInNewTab = () => {
    const shareableUrl = api.files.getShareableUrl(file._id);
    if (shareableUrl) {
      window.open(shareableUrl, '_blank', 'noopener,noreferrer');
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
          borderBottom: `1px solid ${colors.border.default}`,
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
          Share "{file.originalName}"
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
              value={api.files.getShareableUrl(file._id)}
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

        {file.permissions && file.permissions.length > 0 && (
          <Box sx={{ borderTop: '1px solid #e5e5e5', pt: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, color: '#202124', mb: 2 }}>
              People with access
            </Typography>
            <List>
              {file.permissions.map((perm, index) => {
                const permUser = typeof perm.userId === 'object' && perm.userId !== null
                  ? (perm.userId as any)
                  : null;
                const userName = permUser?.name || 'Unknown User';
                const userEmail = permUser?.email || perm.userId;

                return (
                  <ListItem
                    key={index}
                    sx={{
                      bgcolor: colors.background.light,
                      borderRadius: 2,
                      mb: 1,
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
                        <>
                          <Typography variant="caption" sx={{ display: 'block', color: colors.text.secondary }}>
                            {userEmail}
                          </Typography>
                          <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                            {perm.level === 'read' ? 'Can view' : 'Can edit'}
                          </Typography>
                        </>
                      }
                      primaryTypographyProps={{
                        sx: {
                          fontWeight: 500,
                          color: colors.text.primary,
                        },
                      }}
                    />
                  </ListItem>
                );
              })}
            </List>
          </Box>
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
