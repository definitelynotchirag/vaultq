'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function AuthSuccessPage() {
  const router = useRouter();
  const { refreshUser, user, loading } = useAuth();
  const hasRedirected = useRef(false);

  useEffect(() => {
    const handleAuth = async () => {
      if (hasRedirected.current) return;
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      try {
        await refreshUser();
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (!hasRedirected.current) {
          hasRedirected.current = true;
          router.push('/');
        }
      } catch (error) {
        console.error('Auth refresh error:', error);
        setTimeout(() => {
          if (!hasRedirected.current) {
            hasRedirected.current = true;
            router.push('/');
          }
        }, 1000);
      }
    };

    handleAuth();
  }, [router, refreshUser]);

  useEffect(() => {
    if (user && !loading && !hasRedirected.current) {
      hasRedirected.current = true;
      router.push('/');
    }
  }, [user, loading, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white text-[#202124]">
      <div className="text-center">
        <div className="text-xl mb-4 font-normal">Authentication successful!</div>
        <div className="text-[#5f6368]">Redirecting to Drive...</div>
      </div>
    </div>
  );
}

