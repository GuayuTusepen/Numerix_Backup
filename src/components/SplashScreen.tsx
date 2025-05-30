
"use client";

import { Logo } from '@/components/Logo';
import Image from 'next/image'; // Import next/image

export function SplashScreen() {
  // Se eliminó cualquier lógica anterior relacionada con el texto "Cargando..." y sus puntos.
  // Esta pantalla ahora solo muestra el logo y la animación GIF.

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50">
      <div className="animate-bounce">
        <Logo size="lg" />
      </div>
      {/* Contenedor para la animación GIF */}
      <div className="mt-6"> {/* Un poco de margen superior para espaciar del logo */}
        <Image
          src="/animations/Loading.gif" // Ruta a tu GIF en la carpeta public/animations/
          alt="Cargando animación"
          width={80} // Ancho del GIF
          height={80} // Altura del GIF
          unoptimized // Importante para GIFs para evitar optimización que rompa la animación
          data-ai-hint="loading spinner animation"
        />
      </div>
    </div>
  );
}
