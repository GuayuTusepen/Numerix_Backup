
"use client";

import { Logo } from '@/components/Logo';
import Image from 'next/image'; // Import next/image

export function SplashScreen() {
  // Se eliminó useEffect y useState para el texto "Cargando..." y los puntos animados.

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50">
      <div className="animate-bounce">
        <Logo size="lg" />
      </div>
      {/* Se reemplaza la etiqueta <p> con el componente Image para el GIF */}
      <div className="mt-6"> {/* Se añadió un poco de margen superior para espaciar */}
        <Image
          src="/animations/Loading.gif" // Ruta a tu GIF en la carpeta public/animations/
          alt="Cargando animación"
          width={80} // Ajusta el ancho según sea necesario
          height={80} // Ajusta la altura según sea necesario
          unoptimized // Recomendado para GIFs para prevenir optimización que podría romper la animación
          data-ai-hint="loading spinner animation"
        />
      </div>
    </div>
  );
}
