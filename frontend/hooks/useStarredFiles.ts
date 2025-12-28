import { api } from '@/lib/api';
import { triggerDownload } from '@/lib/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useStarredFiles(searchQuery?: string) {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['starredFiles', searchQuery],
    queryFn: () => api.files.getStarredFiles(searchQuery),
  });

  const starMutation = useMutation({
    mutationFn: (fileId: string) => api.files.starFile(fileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['starredFiles'] });
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });

  const unstarMutation = useMutation({
    mutationFn: (fileId: string) => api.files.unstarFile(fileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['starredFiles'] });
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });

  const renameMutation = useMutation({
    mutationFn: ({ fileId, newName }: { fileId: string; newName: string }) =>
      api.files.renameFile(fileId, newName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['starredFiles'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (fileId: string) => api.files.deleteFile(fileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['starredFiles'] });
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
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  };

  const toggleStar = async (fileId: string, isStarred: boolean) => {
    if (isStarred) {
      await unstarMutation.mutateAsync(fileId);
    } else {
      await starMutation.mutateAsync(fileId);
    }
  };

  return {
    files: data?.files || [],
    isLoading,
    error,
    refetch,
    toggleStar,
    renameFile: renameMutation.mutateAsync,
    deleteFile: deleteMutation.mutateAsync,
    downloadFile: handleDownload,
    isStarring: starMutation.isPending || unstarMutation.isPending,
    isRenaming: renameMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isDownloading: downloadMutation.isPending,
  };
}

