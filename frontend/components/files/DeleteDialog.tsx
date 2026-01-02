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
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';

interface DeleteDialogProps {
  isOpen: boolean;
  file: File | null;
  onClose: () => void;
  onDelete: (fileId: string) => Promise<void>;
}

export function DeleteDialog({ isOpen, file, onClose, onDelete }: DeleteDialogProps) {
  const { mode } = useCustomTheme();
  const colors = getColors(mode);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!file) return;
    setIsDeleting(true);
    try {
      await onDelete(file._id);
      toast.success(`${file.originalName} moved to trash`);
      onClose();
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Failed to delete file');
    } finally {
      setIsDeleting(false);
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
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, color: colors.text.primary, fontSize: { xs: '1.125rem', sm: '1.5rem' } }}>
          Move to trash?
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

      <DialogContent sx={{ pt: { xs: 2, sm: 3 }, px: { xs: 2, sm: 3 } }}>
        <Typography variant="body1" sx={{ color: colors.text.primary, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
          {file?.originalName} will be moved to trash.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 2.5 }, pt: { xs: 1.5, sm: 2 }, gap: { xs: 1, sm: 1.5 }, flexDirection: { xs: 'column', sm: 'row' } }}>
        <Button
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
            fontSize: { xs: '0.875rem', sm: '1rem' },
            py: { xs: 1, sm: 1.25 },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          disabled={isDeleting}
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
          {isDeleting ? 'Moving...' : 'Move to trash'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
