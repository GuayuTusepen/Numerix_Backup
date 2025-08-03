
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProfile } from '@/contexts/ProfileContext';
import { SplashScreen } from '@/components/SplashScreen';

export default function HomePage() {
  const router = useRouter();
  const { activeProfile, isLoading: isProfileLoading, profiles } = useProfile();
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    // Este efecto se ejecuta una vez cuando el componente se monta (en la carga inicial o al refrescar esta página).
    const timer = setTimeout(() => {
      setIsAppLoading(false); // Después de 3 segundos, permite que la lógica de navegación proceda.
    }, 3000); // 3000 milisegundos = 3 segundos

    // Limpia el temporizador si el componente se desmonta antes de que se cumplan los 3 segundos.
    return () => clearTimeout(timer);
  }, []); // El array de dependencias vacío [] asegura que esto solo se ejecute al montar/desmontar.

  useEffect(() => {
    // Si la aplicación está en su "tiempo de carga inicial" (isAppLoading es true)
    // o si los perfiles aún se están cargando, no hagas nada.
    if (isAppLoading || isProfileLoading) {
      return;
    }

    // Una vez que isAppLoading es false (han pasado los 3 segundos) y los perfiles han cargado,
    // decide a dónde redirigir.
    if (activeProfile) {
      router.replace('/dashboard');
    } else if (profiles.length > 0) {
      router.replace('/profiles'); // Hay perfiles, pero ninguno activo.
    }
    else {
      router.replace('/profiles'); // No hay perfiles, ir a crear/seleccionar.
    }
  }, [activeProfile, isProfileLoading, isAppLoading, router, profiles]);

  // Muestra la SplashScreen mientras isAppLoading es true.
  return <SplashScreen />;
}
