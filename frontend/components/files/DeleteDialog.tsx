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
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { colors } from '@/lib/colors';
import { File } from '@/types';
import { useState } from 'react';

interface DeleteDialogProps {
  isOpen: boolean;
  file: File | null;
  onClose: () => void;
  onDelete: (fileId: string) => Promise<void>;
}

export function DeleteDialog({ isOpen, file, onClose, onDelete }: DeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!file) return;
    setIsDeleting(true);
    try {
      await onDelete(file._id);
      onClose();
    } catch (error) {
      console.error('Delete error:', error);
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
          pb: 1.5,
          borderBottom: `1px solid ${colors.border.default}`,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 400, color: colors.text.primary }}>
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

      <DialogContent sx={{ pt: 3 }}>
        <Typography variant="body1" sx={{ color: colors.text.primary }}>
          {file?.originalName} will be moved to trash. You can restore it from trash within 30 days.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, pt: 2, gap: 1.5 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: colors.border.light,
            color: colors.text.primary,
            '&:hover': {
              borderColor: colors.border.light,
              backgroundColor: colors.background.light,
            },
            textTransform: 'none',
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          disabled={isDeleting}
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
          {isDeleting ? 'Moving...' : 'Move to trash'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
