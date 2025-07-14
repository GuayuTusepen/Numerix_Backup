
"use client";

import { useParams, useRouter } from 'next/navigation';
import { LESSON_CATEGORIES } from '@/types/lesson';
import type { Lesson } from '@/types/lesson';
import { Button } from '@/components/ui/button';
import { useProgress } from '@/contexts/ProgressContext';
import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle, Star, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import CountingGame from '@/components/lessons/games/CountingGame';
import { gameData } from '@/data/countingGameData'; // Importar los datos del juego
import { getLocalStorageItem } from '@/lib/localStorage';
import { useProfile } from '@/contexts/ProfileContext';

// Placeholder for other lesson content components
function LessonContentPlaceholder({ lesson }: { lesson: Lesson }) {
  return (
    <div className="p-6 bg-muted/30 rounded-lg min-h-[200px] flex flex-col items-center justify-center text-center">
      <Zap size={48} className="text-primary mb-4" />
      <h3 className="text-2xl font-semibold mb-2">Contenido Interactivo para "{lesson.title}"</h3>
      <p className="text-muted-foreground">¡Aquí es donde ocurre el aprendizaje divertido!</p>
      <p className="text-sm mt-4">(Las actividades reales de la lección estarán aquí)</p>
    </div>
  );
}


export default function LessonPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const { activeProfile } = useProfile();
  const lessonId = params.lessonId as string;
  
  const { updateLessonProgress, getLessonProgress } = useProgress();
  
  const lesson = LESSON_CATEGORIES.flatMap(category => category.lessons).find(l => l.id === lessonId);
  
  const handleCompleteLesson = () => {
    if (lessonId === 'count-to-10') {
        if (!activeProfile) {
            toast({
                variant: "destructive",
                title: "Error de perfil",
                description: "No se encontró un perfil activo para guardar el progreso.",
            });
            return;
        }
      const gameStorageKey = `countingGameProgress_${activeProfile.id}`;
      const gameProgress = getLocalStorageItem<any>(gameStorageKey, {});
      const totalLevels = gameData.levels.length;
      let perfectLevels = 0;
      let completedLevels = 0;

      for (let i = 1; i <= totalLevels; i++) {
        if (gameProgress[i]?.completed) {
            completedLevels++;
        }
        if (gameProgress[i]?.stars === 3) {
          perfectLevels++;
        }
      }

      let overallStars: 1 | 2 | 3 = 1;
      if (perfectLevels === totalLevels) {
        overallStars = 3; 
      } else if (completedLevels > 0) {
        overallStars = 2; 
      }

      updateLessonProgress(lessonId, { completed: completedLevels > 0, stars: overallStars, lastAttempted: new Date().toISOString() });
      toast({
        title: "¡Progreso Guardado!",
        description: `Ganaste ${overallStars} estrella(s) en total para "${lesson?.title}". ¡Sigue así!`,
      });
    } else {
      const stars = (Math.floor(Math.random() * 3) + 1) as (1 | 2 | 3);
      updateLessonProgress(lessonId, { completed: true, stars: stars, lastAttempted: new Date().toISOString() });
      toast({
        title: "¡Lección Completada!",
        description: `Ganaste ${stars} estrella(s) por "${lesson?.title}". ¡Buen trabajo!`,
      });
    }
     router.push('/dashboard');
  };

  if (!lesson) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
        <h1 className="text-2xl font-bold text-destructive mb-4">Lección No Encontrada</h1>
        <p className="text-muted-foreground mb-6">¡Vaya! No pudimos encontrar la lección que buscas.</p>
        <Button asChild variant="outline">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Panel
          </Link>
        </Button>
      </div>
    );
  }
  
  const currentProgress = getLessonProgress(lessonId);

  const renderLessonContent = () => {
    if (lesson.id === 'count-to-10') {
      return <CountingGame onGameExit={handleCompleteLesson} />;
    }
    
    return (
      <>
        <LessonContentPlaceholder lesson={lesson} />
        <CardFooter className="p-6 md:p-8 bg-muted/30">
          <Button 
            size="lg" 
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-3 rounded-lg shadow-md transition-transform hover:scale-105"
            onClick={() => handleCompleteLesson()}
            disabled={currentProgress?.completed && currentProgress.stars === 3}
          >
            {currentProgress?.completed ? '¡Intenta de Nuevo por Más Estrellas!' : '¡Marcar como Completada y Obtener Estrellas!'}
          </Button>
        </CardFooter>
      </>
    );
  };


  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6 text-accent hover:text-accent/90">
        <ArrowLeft className="mr-2 h-5 w-5" /> Volver
      </Button>

      <Card className="shadow-xl rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary via-yellow-400 to-accent p-6">
          <CardTitle className="text-4xl font-bold text-primary-foreground text-center">{lesson.title}</CardTitle>
          <CardDescription className="text-lg text-primary-foreground/90 text-center mt-1">{lesson.description}</CardDescription>
        </CardHeader>

        <CardContent className="p-0 sm:p-0">
          {currentProgress?.completed && lesson.id !== 'count-to-10' && (
             <div className="m-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-md text-green-700">
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 mr-3" />
                  <div>
                    <p className="font-semibold">¡Has completado esta lección!</p>
                    <div className="flex mt-1">
                      {Array(currentProgress.stars).fill(0).map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      ))}
                      {Array(3 - currentProgress.stars).fill(0).map((_, i) => (
                        <Star key={`empty-${i}`} className="h-5 w-5 text-yellow-400/50" />
                      ))}
                    </div>
                  </div>
                </div>
            </div>
          )}
          {renderLessonContent()}
        </CardContent>
      </Card>
    </div>
  );
}
