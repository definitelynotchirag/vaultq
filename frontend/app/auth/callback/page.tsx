'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { user, loading, refreshUser } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      await refreshUser();
      if (user) {
        router.push('/');
      } else {
        setTimeout(() => {
          router.push('/');
        }, 2000);
      }
    };

    checkAuth();
  }, [user, router, refreshUser]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white text-[#202124]">
      <div className="text-center">
        <div className="text-xl mb-4 font-normal">Authenticating...</div>
        <div className="text-[#5f6368]">Please wait while we verify your account.</div>
      </div>
    </div>
  );
}

