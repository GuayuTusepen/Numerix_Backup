"use client";

import { Logo } from '@/components/Logo';
import { useEffect, useState } from 'react';

export function SplashScreen() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50">
      <div className="animate-bounce">
        <Logo size="lg" />
      </div>
      <p className="mt-4 text-xl text-foreground">Cargando{dots}</p>
    </div>
  );
}
