'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthFailurePage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white text-[#202124]">
      <div className="text-center">
        <div className="text-xl mb-4 text-[#ea4335] font-normal">Authentication failed</div>
        <div className="text-[#5f6368] mb-4">Please try again later.</div>
        <div className="text-[#80868b] text-sm">Redirecting to home...</div>
      </div>
    </div>
  );
}

