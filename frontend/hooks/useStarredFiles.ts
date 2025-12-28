import { api } from '@/lib/api';
import { triggerDownload } from '@/lib/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

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
      toast.success('File starred');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to star file');
    },
  });

  const unstarMutation = useMutation({
    mutationFn: (fileId: string) => api.files.unstarFile(fileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['starredFiles'] });
      queryClient.invalidateQueries({ queryKey: ['files'] });
      toast.success('File unstarred');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to unstar file');
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
    } catch (error: any) {
      console.error('Download error:', error);
      toast.error(error.message || 'Failed to download file');
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

