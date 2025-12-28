'use client';

import { colors } from '@/lib/colors';
import { File } from '@/types';
import { Close } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography
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
          pb: 1.5,
          // borderBottom: `1px solid ${colors.border.default}`,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, color: colors.text.primary }}>
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
          {file?.originalName} will be moved to trash.
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
