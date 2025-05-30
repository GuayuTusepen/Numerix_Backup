
"use client";

import { Logo } from '@/components/Logo';
import Image from 'next/image'; // Import next/image

export function SplashScreen() {
  // Removed useEffect and useState for "Cargando..." text

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50">
      <div className="animate-bounce">
        <Logo size="lg" />
      </div>
      {/* Replace the <p> tag with the Image component for the GIF */}
      <div className="mt-6"> {/* Added a little margin-top for spacing */}
        <Image
          src="/animations/Loading.gif" // Path to your GIF in the public folder
          alt="Cargando animación"
          width={80} // Adjust width as needed
          height={80} // Adjust height as needed
          unoptimized // Recommended for GIFs to prevent optimization that might break animation
          data-ai-hint="loading spinner animation"
        />
      </div>
    </div>
  );
}
