
"use client";

import Image from 'next/image';
import { useState } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Rocket, Star, Trophy, Award } from 'lucide-react';
import { LESSON_CATEGORIES } from '@/types/lesson';

export function AnimatedGuide() {
  const { activeProfile } = useProfile();
  const [isOpen, setIsOpen] = useState(false);

  if (!activeProfile) return null; // No mostrar si no hay perfil activo

  const welcomeMessage = activeProfile.gender === 'boy' ? `¡Hola, ${activeProfile.name}! Soy Nubo.` : `¡Hola, ${activeProfile.name}! Soy Nuba.`;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="fixed bottom-4 right-4 z-30 cursor-pointer group">
          <div className="absolute bottom-full right-0 mb-2 w-48 bg-card p-3 rounded-lg shadow-xl text-sm text-card-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <p className="font-semibold">¿Necesitas ayuda?</p>
            <p>¡Haz clic en mí para un tour!</p>
            <div className="absolute right-4 -bottom-2 w-0 h-0 border-t-8 border-t-card border-l-8 border-l-transparent border-r-8 border-r-transparent"></div>
          </div>
          <div className="bg-primary p-2 rounded-full shadow-lg animate-bounce">
            <Image 
              src="/guide/friendly-owl.png"
              alt="Guía Amigable" 
              width={56} 
              height={56} 
              className="rounded-full"
              data-ai-hint="owl mascot"
            />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] bg-card rounded-xl p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-2xl text-center text-primary flex items-center justify-center gap-3">
            <Image src="/guide/friendly-owl.png" alt="Guía" width={40} height={40} data-ai-hint="owl mascot"/>
            <span>Guía de Numerix</span>
          </DialogTitle>
           <p className="text-center text-muted-foreground pt-2">{welcomeMessage} ¡Déjame mostrarte cómo funciona todo!</p>
        </DialogHeader>
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile"><User className="h-4 w-4 mr-1"/>Perfil</TabsTrigger>
            <TabsTrigger value="adventures"><Rocket className="h-4 w-4 mr-1"/>Aventuras</TabsTrigger>
            <TabsTrigger value="progress"><Star className="h-4 w-4 mr-1"/>Progreso</TabsTrigger>
          </TabsList>
          
          <div className="p-6 min-h-[250px]">
            <TabsContent value="profile">
              <div className="space-y-4 text-sm text-foreground">
                <h3 className="font-bold text-lg">Tu Perfil de Explorador</h3>
                <p>¡Este es tu espacio personal! Aquí guardamos todo tu progreso y las estrellas que ganas.</p>
                <ul className="list-disc list-inside space-y-2 pl-2">
                  <li>Puedes <span className="font-semibold text-accent">cambiar de perfil</span> o <span className="font-semibold text-accent">gestionarlos</span> haciendo clic en tu avatar en la esquina superior derecha.</li>
                  <li>Cada perfil guarda su propio progreso, ¡así que puedes compartir la aplicación con tus hermanos o amigos!</li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="adventures">
               <div className="space-y-4 text-sm text-foreground">
                <h3 className="font-bold text-lg">Tus Aventuras de Aprendizaje</h3>
                <p>En el panel principal, verás diferentes categorías. ¡Cada una es una aventura!</p>
                 <ul className="space-y-2">
                  {LESSON_CATEGORIES.map(category => (
                    <li key={category.id} className="flex items-start gap-3">
                      <Image src={category.iconSrc} alt={category.title} width={32} height={32} className="rounded-md mt-1" data-ai-hint={category.iconHint} />
                      <div>
                        <span className="font-semibold text-accent">{category.title}:</span>
                        <p className="text-xs text-muted-foreground">{category.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="progress">
              <div className="space-y-4 text-sm text-foreground">
                <h3 className="font-bold text-lg">Aprende y Gana Recompensas</h3>
                <p>¡Mientras más aprendes, más ganas!</p>
                <ul className="list-disc list-inside space-y-2 pl-2">
                  <li>
                    <span className="font-semibold text-accent flex items-center gap-1"><Star className="h-4 w-4 text-yellow-400 fill-yellow-400"/>Estrellas:</span> Ganas hasta 3 estrellas por cada lección que completas. ¡Intenta conseguirlas todas!
                  </li>
                  <li>
                    <span className="font-semibold text-accent flex items-center gap-1"><Award className="h-4 w-4 text-blue-500"/>Insignias:</span> Ganas insignias especiales por alcanzar grandes logros, como completar muchas lecciones.
                  </li>
                  <li>
                    <span className="font-semibold text-accent flex items-center gap-1"><Trophy className="h-4 w-4 text-green-500"/>Tu Progreso:</span> En el panel principal siempre verás una barra que te muestra cuánto te falta para completar todas las aventuras.
                  </li>
                </ul>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
