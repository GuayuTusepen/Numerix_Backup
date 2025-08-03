

"use client";

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { LESSON_CATEGORIES } from '@/types/lesson';
import type { Lesson } from '@/types/lesson';
import { Button } from '@/components/ui/button';
import { useProgress } from '@/contexts/ProgressContext';
import { ArrowLeft, CheckCircle, Star, Zap, ExternalLink, Timer, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import CountingGame from '@/components/lessons/games/CountingGame';
import FingerSumGame from '@/components/lessons/games/finger-sum-game/FingerSumGame';
import { gameData } from '@/data/countingGameData';
import { getLocalStorageItem, setLocalStorageItem } from '@/lib/localStorage';
import { useProfile } from '@/contexts/ProfileContext';

// Placeholder for other lesson content components
function LessonContentPlaceholder({ lesson, onComplete }: { lesson: Lesson, onComplete: () => void }) {
  const currentProgress = useProgress().getLessonProgress(lesson.id);
  
  return (
    <>
      <CardContent className="p-6 md:p-8">
        <div className="p-6 bg-muted/30 rounded-lg min-h-[200px] flex flex-col items-center justify-center text-center">
          <Zap size={48} className="text-primary mb-4" />
          <h3 className="text-2xl font-semibold mb-2">Contenido Interactivo para "{lesson.title}"</h3>
          <p className="text-muted-foreground">¡Aquí es donde ocurre el aprendizaje divertido!</p>
          <p className="text-sm mt-4">(Las actividades reales de la lección estarán aquí)</p>
        </div>
      </CardContent>
      <CardFooter className="p-6 md:p-8 bg-muted/30">
        <Button 
          size="lg" 
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-3 rounded-lg shadow-md transition-transform hover:scale-105"
          onClick={onComplete}
          disabled={currentProgress?.completed && currentProgress.stars === 3}
        >
          {currentProgress?.completed ? '¡Intenta de Nuevo por Más Estrellas!' : '¡Marcar como Completada y Obtener Estrellas!'}
        </Button>
      </CardFooter>
    </>
  );
}

function ExternalLinkActivity({ lesson, onComplete }: { lesson: Lesson, onComplete: (stars: 1 | 2 | 3) => void }) {
  const { activeProfile } = useProfile();
  const storageKey = activeProfile ? `timer_${activeProfile.id}_${lesson.id}` : null;

  const [endTime, setEndTime] = useState<number | null>(() => {
    if (!storageKey) return null;
    return getLocalStorageItem<number | null>(storageKey, null);
  });
  const [timeLeft, setTimeLeft] = useState(180);

  useEffect(() => {
    if (endTime === null) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.round((endTime - now) / 1000);
      if (remaining <= 0) {
        setTimeLeft(0);
        clearInterval(interval);
        if (getLocalStorageItem<number | null>(storageKey, null) !== null) {
          onComplete(2);
          setLocalStorageItem(storageKey, null); 
        }
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime, onComplete, storageKey]);
  
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleStartActivity = () => {
    if(!lesson.externalUrl) return;
    window.open(lesson.externalUrl, '_blank', 'noopener,noreferrer');
    const newEndTime = Date.now() + 180 * 1000;
    if (storageKey) {
      setLocalStorageItem(storageKey, newEndTime);
      setEndTime(newEndTime);
    }
  };

  const handleManualComplete = () => {
    if (storageKey) {
      setLocalStorageItem(storageKey, null);
    }
    setEndTime(null);
    onComplete(3);
  };

  return (
    <CardContent className="p-6 md:p-8">
      <div className="p-6 bg-muted/30 rounded-lg min-h-[200px] flex flex-col items-center justify-center text-center space-y-4">
        <ExternalLink size={48} className="text-primary" />
        <h3 className="text-2xl font-semibold">¡Actividad Externa!</h3>
        <p className="text-muted-foreground max-w-md">
          Esta lección te llevará a un juego divertido en otra página web. ¡Juega allí y regresa cuando hayas terminado!
        </p>
        {endTime === null ? (
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" onClick={handleStartActivity}>
             ¡Ir a la Actividad!
          </Button>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="text-center p-4 border rounded-lg bg-background">
                <p className="font-semibold text-lg text-primary flex items-center justify-center">
                  <Timer className="mr-2 animate-spin" />
                  Tiempo restante: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                </p>
               <p className="text-sm text-muted-foreground mt-2">¡La lección se completará cuando el tiempo termine!</p>
            </div>
            <Button onClick={handleManualComplete}>
              <Check className="mr-2 h-4 w-4" /> ¡Lo Completé!
            </Button>
          </div>
        )}
      </div>
    </CardContent>
  )
}


export default function LessonPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const { activeProfile } = useProfile();
  const lessonId = params.lessonId as string;
  
  const { updateLessonProgress, getLessonProgress } = useProgress();
  
  const lesson = LESSON_CATEGORIES.flatMap(category => category.lessons).find(l => l.id === lessonId);

  useEffect(() => {
    if (lesson && lesson.activityType === 'classify-and-count') {
      router.replace(`/lessons/${lesson.id}/play`);
    }
  }, [lesson, router]);
  
  const handleGameExit = () => {
     if (lessonId === 'count-to-10') {
      if (!activeProfile) {
          toast({
              variant: "destructive",
              title: "Error de perfil",
              description: "No se encontró un perfil activo para guardar el progreso.",
          });
          router.push('/dashboard');
          return;
      }
      const gameStorageKey = `countingGameProgress_${activeProfile.id}`;
      const gameProgress = getLocalStorageItem<any>(gameStorageKey, {});
      const totalLevels = gameData.levels.length;
      
      let allLevelsArePerfect = totalLevels > 0;
      let completedLevelsCount = 0;
      for (const level of gameData.levels) {
        const levelProgress = gameProgress[level.id];
        if (!levelProgress || levelProgress.stars !== 3) {
          allLevelsArePerfect = false;
        }
        if (levelProgress?.completed) {
          completedLevelsCount++;
        }
      }

      let overallStars: 1 | 2 | 3 = 1;
      if (allLevelsArePerfect) {
        overallStars = 3; 
      } else if (completedLevelsCount > 0) {
        overallStars = 2; 
      }

      updateLessonProgress(lessonId, { completed: completedLevelsCount > 0, stars: overallStars, lastAttempted: new Date().toISOString() });
      toast({
        title: "¡Progreso Guardado!",
        description: `Ganaste ${overallStars} estrella(s) en total para "${lesson?.title}". ¡Sigue así!`,
      });
    }
    router.push('/dashboard');
  };

  const handleLessonComplete = (stars: 0 | 1 | 2 | 3) => {
      if(!lesson) return;
      updateLessonProgress(lesson.id, { completed: true, stars: stars, lastAttempted: new Date().toISOString() });
      toast({
        title: "¡Lección Completada!",
        description: `Ganaste ${stars} estrella(s) por "${lesson.title}". ¡Buen trabajo!`,
      });

      if (lesson.id === 'addition-up-to-20' && stars === 3) {
        updateLessonProgress('simple-addition', { completed: true, stars: 3, lastAttempted: new Date().toISOString() });
        toast({
          title: "¡Bono!",
          description: `¡Eres tan bueno/a en sumas que también completaste "Sumas Simples"!`,
        });
      }

      router.push('/dashboard');
  }

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
    switch (lesson.activityType) {
      case 'game':
        return <CountingGame onGameExit={handleGameExit} />;
      case 'finger-sum-game':
        return <FingerSumGame lessonId={lesson.id} onGameExit={handleGameExit} />;
      case 'classify-and-count':
        return <p className="text-center p-8">Cargando juego...</p>;
      case 'external-link':
        return <ExternalLinkActivity lesson={lesson} onComplete={handleLessonComplete} />;
      case 'placeholder':
      default:
        return <LessonContentPlaceholder lesson={lesson} onComplete={() => handleLessonComplete((Math.floor(Math.random() * 3) + 1) as 1 | 2 | 3)} />;
    }
  };

  const isFullScreenGame = lesson.activityType === 'game' || lesson.activityType === 'finger-sum-game';

  return (
    <div className="container mx-auto py-8 px-4">
      {!isFullScreenGame && (
         <Button variant="ghost" onClick={() => router.back()} className="mb-6 text-accent hover:text-accent/90">
           <ArrowLeft className="mr-2 h-5 w-5" /> Volver
         </Button>
       )}

      {isFullScreenGame ? (
        renderLessonContent()
      ) : (
        <Card className="shadow-xl rounded-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary via-yellow-400 to-accent p-6">
            <CardTitle className="text-4xl font-bold text-primary-foreground text-center">{lesson.title}</CardTitle>
            <CardDescription className="text-lg text-primary-foreground/90 text-center mt-1">{lesson.description}</CardDescription>
          </CardHeader>
          {currentProgress?.completed && (
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
        </Card>
      )}
    </div>
  );
}
