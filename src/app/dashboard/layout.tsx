"use client";

import type { ReactNode } from 'react';
import { AppNavbar } from '@/components/layout/AppNavbar';
import { AnimatedGuide } from '@/components/guide/AnimatedGuide';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { SplashScreen } from '@/components/SplashScreen'; // Or a simpler loading state

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { activeProfile, isLoading } = useAuthGuard();

  if (isLoading || !activeProfile) {
    // Show a loading state or splash screen while checking auth or redirecting
    return <SplashScreen />; 
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppNavbar />
      <main className="flex-1 container py-8">
        {children}
      </main>
      <AnimatedGuide />
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} Numerix. ¡Feliz Aprendizaje!
      </footer>
    </div>
  );
}
