import { api } from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useTrashFiles() {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['trash'],
    queryFn: () => api.files.getTrashFiles(),
  });

  const restoreMutation = useMutation({
    mutationFn: (fileId: string) => api.files.restoreFile(fileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trash'] });
      queryClient.invalidateQueries({ queryKey: ['files'] });
      queryClient.invalidateQueries({ queryKey: ['storage'] });
    },
  });

  const permanentDeleteMutation = useMutation({
    mutationFn: (fileId: string) => api.files.permanentDeleteFile(fileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trash'] });
      queryClient.invalidateQueries({ queryKey: ['storage'] });
    },
  });

  return {
    files: data?.files || [],
    isLoading,
    error,
    refetch,
    restoreFile: restoreMutation.mutateAsync,
    permanentDeleteFile: permanentDeleteMutation.mutateAsync,
    isRestoring: restoreMutation.isPending,
    isDeleting: permanentDeleteMutation.isPending,
  };
}


