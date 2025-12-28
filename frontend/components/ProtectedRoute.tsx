'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, login } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      login();
    }
  }, [user, loading, login]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-[#5f6368]">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}

