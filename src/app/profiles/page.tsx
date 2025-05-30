
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
// Lottie ya no es necesario aquí
import { useProfile } from '@/contexts/ProfileContext';
import { CreateProfileForm } from '@/components/profile/CreateProfileForm';
import { ProfileCard } from '@/components/profile/ProfileCard';
import { Logo } from '@/components/Logo';
import { Users } from 'lucide-react'; 
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

export default function ProfilesPage() {
  const router = useRouter();
  const { profiles, activeProfile, selectProfile, isLoading, deleteProfile } = useProfile();
  const { toast } = useToast();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleProfileSelect = (profileId: string) => {
    selectProfile(profileId);
    router.push('/dashboard');
  };

  const handleProfileDelete = (profileId: string) => {
    try {
      deleteProfile(profileId);
      toast({ title: "Perfil eliminado", description: "El perfil ha sido eliminado." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: (error as Error).message });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <div className="animate-bounce">
          <Logo size="lg" />
        </div>
        <div className="mt-6">
          <Image
            src="/animations/Loading.gif"
            alt="Animación de carga de perfiles"
            width={80}
            height={80}
            unoptimized
            data-ai-hint="loading spinner animation"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/30 via-background to-accent/30 p-4">
      <header className="mb-12 text-center">
        <div className="animate-bounce inline-block">
          <Logo size="lg" />
        </div>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground">
          {profiles.length > 0 ? '¿Quién Aprende Hoy?' : '¡Crea Tu Primer Perfil!'}
        </h1>
        {profiles.length > 0 && <p className="mt-2 text-lg text-muted-foreground">Selecciona un perfil para continuar o crea uno nuevo.</p>}
      </header>

      {profiles.length > 0 && (
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {profiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              onSelectProfile={handleProfileSelect}
              onDeleteProfile={handleProfileDelete}
              isSelected={activeProfile?.id === profile.id}
            />
          ))}
        </div>
      )}
      
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogTrigger asChild>
          {profiles.length < 3 && (
            <div 
              className="cursor-pointer transition-transform hover:scale-105 flex flex-col items-center rounded-lg shadow-lg p-3"
              role="button"
              tabIndex={0}
              aria-label="Crear Nuevo Perfil"
            >
              <Image
                src="/animations/Animation_create_account.gif" 
                alt="Crear Nuevo Perfil Animación"
                width={100} // Puedes ajustar esto según el tamaño de tu GIF
                height={100} // Puedes ajustar esto según el tamaño de tu GIF
                unoptimized // Importante para GIFs
                data-ai-hint="create profile animation"
              />
              {/* Texto eliminado según la solicitud */}
            </div>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-card rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center text-primary">Crear un Nuevo Perfil</DialogTitle>
          </DialogHeader>
          <CreateProfileForm onProfileCreated={() => {
            setShowCreateForm(false);
          }} />
        </DialogContent>
      </Dialog>

      {profiles.length === 0 && !showCreateForm && (
        <p className="mt-4 text-muted-foreground">
          ¡Haz clic en la animación de arriba para empezar!
        </p>
      )}

      {profiles.length >= 3 && (
        <p className="mt-8 text-center text-muted-foreground bg-muted p-3 rounded-md">
          <Users className="inline-block mr-2 h-5 w-5" />
          Has alcanzado el máximo de 3 perfiles.
        </p>
      )}
    </div>
  );
}
