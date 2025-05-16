"use client";

import Image from 'next/image';
import type { Profile } from '@/types/profile';
import { AVATARS } from './AvatarSelector';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Edit3 } from 'lucide-react';

interface ProfileCardProps {
  profile: Profile;
  onSelectProfile: (profileId: string) => void;
  onDeleteProfile?: (profileId: string) => void; // Optional delete handler
  onEditProfile?: (profile: Profile) => void; // Optional edit handler
  isSelected?: boolean;
}

export function ProfileCard({ profile, onSelectProfile, onDeleteProfile, onEditProfile, isSelected }: ProfileCardProps) {
  const avatarData = AVATARS.find(avatar => avatar.id === profile.avatar) || AVATARS[0];

  return (
    <Card className={`w-full max-w-xs shadow-lg rounded-xl transition-all duration-300 hover:shadow-xl ${isSelected ? 'ring-4 ring-primary' : 'ring-1 ring-border'}`}>
      <CardHeader className="items-center pt-6">
        <Image
          src={avatarData.src}
          alt={avatarData.alt}
          width={100}
          height={100}
          className="rounded-full border-4 border-background shadow-md"
          data-ai-hint={avatarData.hint}
        />
      </CardHeader>
      <CardContent className="text-center">
        <CardTitle className="text-2xl font-bold text-foreground">{profile.name}</CardTitle>
        <p className="text-muted-foreground">Age: {profile.age}</p>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 p-4">
        <Button onClick={() => onSelectProfile(profile.id)} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" size="lg">
          Play as {profile.name}
        </Button>
        {(onDeleteProfile || onEditProfile) && (
          <div className="flex gap-2 w-full mt-2">
            {onEditProfile && (
              <Button variant="outline" size="sm" className="flex-1" onClick={() => onEditProfile(profile)}>
                <Edit3 className="mr-2 h-4 w-4" /> Edit
              </Button>
            )}
            {onDeleteProfile && (
              <Button variant="destructive" size="sm" className="flex-1" onClick={() => onDeleteProfile(profile.id)}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
