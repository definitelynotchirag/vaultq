'use client';

import { useTheme as useCustomTheme } from '@/contexts/ThemeContext';
import { getColors } from '@/lib/colors';
import { File } from '@/types';
import { Close } from '@mui/icons-material';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface RenameDialogProps {
  isOpen: boolean;
  file: File | null;
  onClose: () => void;
  onRename: (fileId: string, newName: string) => Promise<void>;
}

export function RenameDialog({ isOpen, file, onClose, onRename }: RenameDialogProps) {
  const { mode } = useCustomTheme();
  const colors = getColors(mode);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [newName, setNewName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (file) {
      setNewName(file.originalName);
    }
  }, [file]);

  if (!isOpen || !file) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setIsSaving(true);
    try {
      await onRename(file._id, newName.trim());
      toast.success('File renamed successfully');
      onClose();
    } catch (error: any) {
      console.error('Rename error:', error);
      toast.error(error.message || 'Failed to rename file');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog
      open={isOpen && !!file}
      onClose={onClose}
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
          pb: { xs: 1, sm: 1.5 },
          px: { xs: 2, sm: 3 },
          pt: { xs: 2, sm: 3 },
          borderBottom: `1px solid ${colors.border.default}`,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 400, color: colors.text.primary, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
          Rename
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

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: { xs: 2, sm: 3 }, px: { xs: 2, sm: 3 } }}>
          <TextField
            autoFocus
            fullWidth
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                fontSize: { xs: '0.875rem', sm: '1rem' },
              },
            }}
          />
        </DialogContent>

        <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 2.5 }, pt: { xs: 1.5, sm: 2 }, gap: { xs: 1, sm: 1.5 }, flexDirection: { xs: 'column', sm: 'row' } }}>
          <Button
            type="button"
            onClick={onClose}
            variant="outlined"
            fullWidth={isMobile}
            sx={{
              borderColor: colors.border.light,
              color: colors.text.primary,
              '&:hover': {
                borderColor: colors.border.light,
                backgroundColor: colors.background.light,
              },
              textTransform: 'none',
              flex: { xs: 'none', sm: 1 },
              fontSize: { xs: '0.875rem', sm: '1rem' },
              py: { xs: 1, sm: 1.25 },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!newName.trim() || isSaving}
            variant="contained"
            fullWidth={isMobile}
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
              flex: { xs: 'none', sm: 1 },
              fontSize: { xs: '0.875rem', sm: '1rem' },
              py: { xs: 1, sm: 1.25 },
            }}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
