
"use client";

import { Logo } from '@/components/Logo';
import Image from 'next/image'; // Import next/image

export function SplashScreen() {
  // This component now ONLY shows the logo and the loading GIF.
  // The 5-second display logic is handled by src/app/page.tsx.

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50">
      <div className="animate-bounce">
        <Logo size="lg" />
      </div>
      {/* Container for the GIF animation */}
      <div className="mt-6"> {/* Some top margin to space it from the logo */}
        <Image
          src="/animations/Loading.gif" // Path to your GIF in the public/animations/ folder
          alt="Animación de Numerix" // Changed alt text for diagnostics
          width={80} // Width of the GIF
          height={80} // Height of the GIF
          unoptimized // Important for GIFs to prevent optimization that might break the animation
          data-ai-hint="loading spinner animation"
        />
      </div>
    </div>
  );
}
