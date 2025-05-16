"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProfile } from '@/contexts/ProfileContext';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AVATARS } from '@/components/profile/AvatarSelector';
import { ChevronDown, LogOut, Users, Settings, HelpCircle } from 'lucide-react';

export function AppNavbar() {
  const router = useRouter();
  const { activeProfile, profiles, selectProfile, isLoading } = useProfile();

  const handleProfileSwitch = (profileId: string) => {
    selectProfile(profileId);
    // Optional: router.refresh() or router.push('/dashboard') if needed,
    // but context change should trigger re-renders.
  };

  const handleManageProfiles = () => {
    router.push('/profiles');
  };
  
  const handleLogout = () => {
    selectProfile(null); // Deselect current profile
    router.push('/profiles'); // Redirect to profile selection
  };

  const currentUserAvatar = AVATARS.find(a => a.id === activeProfile?.avatar)?.src || AVATARS[0].src;
  const currentUserInitials = activeProfile?.name.substring(0, 2).toUpperCase() || '??';

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/dashboard" aria-label="Ir al panel">
          <Logo size="sm" />
        </Link>

        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="h-8 w-24 animate-pulse rounded-md bg-muted"></div>
          ) : activeProfile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-3 py-2 h-auto rounded-full hover:bg-muted">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentUserAvatar} alt={activeProfile.name} data-ai-hint={AVATARS.find(a => a.id === activeProfile.avatar)?.hint} />
                    <AvatarFallback>{currentUserInitials}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-sm hidden md:inline">{activeProfile.name}</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>¡Hola, {activeProfile.name}!</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {profiles.filter(p => p.id !== activeProfile.id).slice(0,2).map(profile => (
                  <DropdownMenuItem key={profile.id} onClick={() => handleProfileSwitch(profile.id)}>
                     <Avatar className="h-6 w-6 mr-2">
                       <AvatarImage src={AVATARS.find(a => a.id === profile.avatar)?.src} alt={profile.name} data-ai-hint={AVATARS.find(a => a.id === profile.avatar)?.hint}/>
                       <AvatarFallback>{profile.name.substring(0,2).toUpperCase()}</AvatarFallback>
                     </Avatar>
                    Cambiar a {profile.name}
                  </DropdownMenuItem>
                ))}
                {profiles.length > 1 && <DropdownMenuSeparator />}
                <DropdownMenuItem onClick={handleManageProfiles}>
                  <Users className="mr-2 h-4 w-4" />
                  Gestionar Perfiles
                </DropdownMenuItem>
                <DropdownMenuItem disabled> {/* Placeholder for future features */}
                  <Settings className="mr-2 h-4 w-4" />
                  Configuración
                </DropdownMenuItem>
                <DropdownMenuItem disabled> {/* Placeholder for future features */}
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Ayuda
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={handleManageProfiles}>Seleccionar Perfil</Button>
          )}
        </div>
      </div>
    </header>
  );
}
