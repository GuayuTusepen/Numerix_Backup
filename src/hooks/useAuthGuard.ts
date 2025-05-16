"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProfile } from '@/contexts/ProfileContext';

export function useAuthGuard(redirectTo = '/profiles') {
  const router = useRouter();
  const { activeProfile, isLoading } = useProfile();

  useEffect(() => {
    if (!isLoading && !activeProfile) {
      router.replace(redirectTo);
    }
  }, [activeProfile, isLoading, router, redirectTo]);

  return { activeProfile, isLoading };
}
