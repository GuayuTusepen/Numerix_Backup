"use client";

import Image from 'next/image';
import { cn } from '@/lib/utils';

// Asumiendo que las imágenes están en public/avatars/
export const BOY_AVATARS = [
  { id: 'boy-1', src: '/avatars/Pfp_Boy1.png', alt: 'Avatar Niño 1', hint: 'boy 1' },
  { id: 'boy-2', src: '/avatars/Pfp_Boy2.png', alt: 'Avatar Niño 2', hint: 'boy 2' },
  { id: 'boy-3', src: '/avatars/Pfp_Boy3.png', alt: 'Avatar Niño 3', hint: 'boy 3' },
 
];

export const GIRL_AVATARS = [
  { id: 'girl-1', src: '/avatars/Pfp_Girl1.png', alt: 'Avatar Niña 1', hint: 'girl 1' },
  { id: 'girl-2', src: '/avatars/Pfp_Girl2.png', alt: 'Avatar Niña 2', hint: 'girl 2' },
  { id: 'girl-3', src: '/avatars/Pfp_Girl3.png', alt: 'Avatar Niña 3', hint: 'girl 3' },
];
// Combined list for components that need to look up any avatar by ID
export const AVATARS = [...BOY_AVATARS, ...GIRL_AVATARS];

interface AvatarSelectorProps {
  selectedAvatar: string;
  onSelectAvatar: (avatarId: string) => void;
  gender?: 'boy' | 'girl';
}

export function AvatarSelector({ selectedAvatar, onSelectAvatar, gender }: AvatarSelectorProps) {
  if (!gender) {
    return <p className="text-muted-foreground text-sm">Por favor, selecciona un género para ver los avatares disponibles.</p>;
  }

  const currentAvatarList = gender === 'boy' ? BOY_AVATARS : GIRL_AVATARS;

  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
      {currentAvatarList.map((avatar) => (
        <button
          key={avatar.id}
          type="button"
          onClick={() => onSelectAvatar(avatar.id)}
          className={cn(
            'rounded-full p-1 border-4 border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
            selectedAvatar === avatar.id ? 'border-primary ring-2 ring-primary' : 'hover:border-accent'
          )}
          aria-label={`Seleccionar avatar ${avatar.alt}`}
        >
          <Image
            src={avatar.src} // Esto ahora será, por ej: /avatars/boy-superhero.png
            alt={avatar.alt}
            width={80}
            height={80}
            className="rounded-full object-cover"
            // data-ai-hint se mantiene por si se quiere usar en el futuro, pero la imagen es local
            data-ai-hint={avatar.hint}
          />
        </button>
      ))}
    </div>
  );
}
