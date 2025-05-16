"use client";

import type { ReactNode } from 'react';
import { ProfileProvider } from '@/contexts/ProfileContext';
import { ProgressProvider } from '@/contexts/ProgressContext';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ProfileProvider>
      <ProgressProvider>
        {children}
      </ProgressProvider>
    </ProfileProvider>
  );
}
