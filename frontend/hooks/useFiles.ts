import { api } from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (fileId: string) => api.files.deleteFile(fileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });

  const downloadMutation = useMutation({
    mutationFn: (fileId: string) => api.files.downloadFile(fileId),
  });

  const handleDownload = async (fileId: string) => {
    try {
      const response = await downloadMutation.mutateAsync(fileId);
      if (response.success && response.downloadUrl) {
        window.open(response.downloadUrl, '_blank');
      }
    } catch (error) {
      console.error('Download error:', error);
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


