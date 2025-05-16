"use client";

import Image from 'next/image';
import { cn } from '@/lib/utils';

export const AVATARS = [
  { id: 'lion', src: 'https://placehold.co/100x100.png', alt: 'Lion', hint: 'lion cartoon' },
  { id: 'bear', src: 'https://placehold.co/100x100.png', alt: 'Bear', hint: 'bear cartoon' },
  { id: 'rabbit', src: 'https://placehold.co/100x100.png', alt: 'Rabbit', hint: 'rabbit cartoon' },
  { id: 'fox', src: 'https://placehold.co/100x100.png', alt: 'Fox', hint: 'fox cartoon' },
  { id: 'panda', src: 'https://placehold.co/100x100.png', alt: 'Panda', hint: 'panda cartoon' },
];

interface AvatarSelectorProps {
  selectedAvatar: string;
  onSelectAvatar: (avatarId: string) => void;
}

export function AvatarSelector({ selectedAvatar, onSelectAvatar }: AvatarSelectorProps) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
      {AVATARS.map((avatar) => (
        <button
          key={avatar.id}
          type="button"
          onClick={() => onSelectAvatar(avatar.id)}
          className={cn(
            'rounded-full p-1 border-4 border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
            selectedAvatar === avatar.id ? 'border-primary ring-2 ring-primary' : 'hover:border-accent'
          )}
          aria-label={`Select ${avatar.alt} avatar`}
        >
          <Image
            src={avatar.src}
            alt={avatar.alt}
            width={80}
            height={80}
            className="rounded-full object-cover"
            data-ai-hint={avatar.hint}
          />
        </button>
      ))}
    </div>
  );
}
