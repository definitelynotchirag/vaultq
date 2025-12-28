import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

interface StorageInfo {
  used: number;
  limit: number;
  available: number;
  percentage: number;
}

export function useStorage() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['storage'],
    queryFn: async () => {
      const response = await api.files.getStorage();
      return response.storage;
    },
    refetchInterval: 30000,
  });

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  return {
    storage: data || null,
    loading: isLoading,
    error: error ? (error as Error).message : null,
    refetch,
    formatBytes,
  };
}

