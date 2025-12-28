'use client';

import { FileListItem } from '@/components/files/FileListItem';
import { colors } from '@/lib/colors';
import { File } from '@/types';
import {
    Box,
    Paper,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';

interface FileListProps {
  files: File[];
  onFileClick?: (file: File) => void;
  onFileMenuClick?: (file: File, event: React.MouseEvent) => void;
  onFileDoubleClick?: (file: File) => void;
  onFileStar?: (file: File) => void;
  loading?: boolean;
}

export function FileList({
  files,
  onFileClick,
  onFileMenuClick,
  onFileDoubleClick,
  onFileStar,
  loading = false,
}: FileListProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (loading) {
    return (
      <TableContainer component={Paper} sx={{ boxShadow: 'none', border: `1px solid ${colors.border.light}`, borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ py: { xs: 1.5, sm: 2 } }}>
                <Skeleton variant="text" width="40%" height={20} />
              </TableCell>
              {!isMobile && (
                <>
                  <TableCell sx={{ py: { xs: 1.5, sm: 2 } }}>
                    <Skeleton variant="text" width="60%" height={20} />
                  </TableCell>
                  <TableCell sx={{ py: { xs: 1.5, sm: 2 } }}>
                    <Skeleton variant="text" width="60%" height={20} />
                  </TableCell>
                </>
              )}
              <TableCell align="right" sx={{ py: { xs: 1.5, sm: 2 } }}>
                <Skeleton variant="text" width={40} height={20} sx={{ ml: 'auto' }} />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(10)].map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Skeleton variant="rectangular" width={24} height={24} sx={{ borderRadius: 0.5 }} />
                    <Skeleton variant="text" width="60%" height={16} />
                  </Box>
                </TableCell>
                {!isMobile && (
                  <>
                    <TableCell>
                      <Skeleton variant="text" width="40%" height={14} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width="50%" height={14} />
                    </TableCell>
                  </>
                )}
                <TableCell align="right">
                  <Skeleton variant="circular" width={32} height={32} sx={{ ml: 'auto' }} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  if (files.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: { xs: 8, md: 10 },
          color: colors.text.secondary,
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: '3rem', md: '3.75rem' },
            mb: 2,
          }}
        >
          📁
        </Typography>
        <Typography
          variant="h6"
          sx={{
            mb: 1,
            color: colors.text.primary,
            fontSize: { xs: '1rem', md: '1.125rem' },
          }}
        >
          No files yet
        </Typography>
        <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
          Upload files to get started
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ boxShadow: 'none', border: `1px solid ${colors.border.light}`, borderRadius: 2 }}>
      <Table>
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: colors.background.light,
              '& th': {
                borderBottom: `1px solid ${colors.border.default}`,
                py: { xs: 1.5, sm: 2 },
                fontWeight: 500,
                fontSize: { xs: '0.75rem', sm: '0.8125rem', md: '0.875rem' },
                color: colors.text.secondary,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              },
            }}
          >
            <TableCell>Name</TableCell>
            {!isMobile && <TableCell>Size</TableCell>}
            {!isMobile && <TableCell>Modified</TableCell>}
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {files.map((file) => (
            <FileListItem
              key={file._id}
              file={file}
              onClick={onFileClick}
              onMenuClick={onFileMenuClick}
              onDoubleClick={onFileDoubleClick}
              onStar={onFileStar}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}


