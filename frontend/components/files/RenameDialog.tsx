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
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { colors } from '@/lib/colors';
import { File } from '@/types';
import { useEffect, useState } from 'react';

interface RenameDialogProps {
  isOpen: boolean;
  file: File | null;
  onClose: () => void;
  onRename: (fileId: string, newName: string) => Promise<void>;
}

export function RenameDialog({ isOpen, file, onClose, onRename }: RenameDialogProps) {
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
      onClose();
    } catch (error) {
      console.error('Rename error:', error);
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
          pb: 1.5,
          borderBottom: `1px solid ${colors.border.default}`,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 400, color: colors.text.primary }}>
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
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            autoFocus
            fullWidth
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, pt: 2, gap: 1.5 }}>
          <Button
            type="button"
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
              flex: 1,
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!newName.trim() || isSaving}
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
              flex: 1,
            }}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
