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

// Placeholder for actual lesson content components
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
  const lessonId = params.lessonId as string;
  
  const { updateLessonProgress, getLessonProgress } = useProgress();
  const [starsAwarded, setStarsAwarded] = useState<0 | 1 | 2 | 3>(0);

  const lesson = LESSON_CATEGORIES.flatMap(category => category.lessons).find(l => l.id === lessonId);

  useEffect(() => {
    setStarsAwarded(getLessonProgress(lessonId)?.stars || 0);
  }, [lessonId, getLessonProgress]);

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

  const handleCompleteLesson = () => {
    const randomStars = Math.floor(Math.random() * 3) + 1 as 1 | 2 | 3;
    setStarsAwarded(randomStars);
    updateLessonProgress(lesson.id, { completed: true, stars: randomStars, lastAttempted: new Date().toISOString() });
    toast({
      title: "¡Lección Completada!",
      description: `Ganaste ${randomStars} estrella(s) por "${lesson.title}". ¡Buen trabajo!`,
      action: (
        <Button size="sm" onClick={() => router.push('/dashboard')}>
          ¡Siguiente Aventura!
        </Button>
      ),
    });
  };
  
  const currentProgress = getLessonProgress(lessonId);

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

        <CardContent className="p-6 md:p-8 space-y-6">
          <LessonContentPlaceholder lesson={lesson} />

          {currentProgress?.completed && (
             <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-md text-green-700">
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
        </CardContent>

        <CardFooter className="p-6 md:p-8 bg-muted/30">
          <Button 
            size="lg" 
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-3 rounded-lg shadow-md transition-transform hover:scale-105"
            onClick={handleCompleteLesson}
            disabled={currentProgress?.completed && currentProgress.stars === 3}
          >
            {currentProgress?.completed ? '¡Intenta de Nuevo por Más Estrellas!' : '¡Marcar como Completada y Obtener Estrellas!'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
