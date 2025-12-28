import { api } from '@/lib/api';
import { triggerDownload } from '@/lib/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { File } from '@/types';
import { toast } from 'react-toastify';

export function useFiles(searchQuery?: string) {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['files', searchQuery],
    queryFn: () => api.files.getFiles(searchQuery),
  });

  const renameMutation = useMutation({
    mutationFn: ({ fileId, newName }: { fileId: string; newName: string }) =>
      api.files.renameFile(fileId, newName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      queryClient.invalidateQueries({ queryKey: ['storage'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to rename file');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (fileId: string) => api.files.deleteFile(fileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      queryClient.invalidateQueries({ queryKey: ['storage'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete file');
    },
  });

  const downloadMutation = useMutation({
    mutationFn: (fileId: string) => api.files.downloadFile(fileId),
  });

  const handleDownload = async (fileId: string, fileName?: string) => {
    try {
      const response = await downloadMutation.mutateAsync(fileId);
      if (response.success && response.downloadUrl) {
        await triggerDownload(response.downloadUrl, fileName || 'download');
      }
    } catch (error: any) {
      console.error('Download error:', error);
      toast.error(error.message || 'Failed to download file');
      throw error;
    }
  };

  return {
    files: data?.files || [],
    isLoading,
    error,
    refetch,
    renameFile: renameMutation.mutateAsync,
    deleteFile: deleteMutation.mutateAsync,
    downloadFile: handleDownload,
    isRenaming: renameMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isDownloading: downloadMutation.isPending,
  };
}


