
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // Importar Image
import { useProfile } from '@/contexts/ProfileContext';
import { CreateProfileForm } from '@/components/profile/CreateProfileForm';
import { ProfileCard } from '@/components/profile/ProfileCard';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { PlusCircle, UserCheck, Users } from 'lucide-react';
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
            alt="Animación de carga de perfiles" // Changed alt text
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
        <Logo size="lg" />
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
             <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full shadow-lg transition-transform hover:scale-105">
              <PlusCircle className="mr-2 h-6 w-6" /> Crear Nuevo Perfil
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-card rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center text-primary">Crear un Nuevo Perfil</DialogTitle>
          </DialogHeader>
          <CreateProfileForm onProfileCreated={() => {
            setShowCreateForm(false);
            // No automatic redirect here, selection is explicit or via HomePage logic if last profile was deleted.
          }} />
        </DialogContent>
      </Dialog>

      {profiles.length === 0 && !showCreateForm && (
        <p className="mt-4 text-muted-foreground">
          ¡Haz clic en el botón de arriba para empezar!
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
