
"use client";

import { useState } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { LESSON_CATEGORIES, type LessonCategory } from '@/types/lesson';
import { LessonCategoryCard } from '@/components/lessons/LessonCategoryCard';
import { LessonItemCard } from '@/components/lessons/LessonItemCard';
import { ProgressOverview } from '@/components/progress/ProgressOverview';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useProgress } from '@/contexts/ProgressContext';

export default function DashboardPage() {
  const { activeProfile } = useProfile();
  const { progress: lessonProgressData, isLoading: isProgressLoading } = useProgress();
  const [selectedCategory, setSelectedCategory] = useState<LessonCategory | null>(null);

  if (!activeProfile) {
    return <p className="text-center text-lg text-muted-foreground">Cargando perfil de usuario...</p>;
  }

  if (isProgressLoading) {
    return <p className="text-center text-lg text-muted-foreground">Cargando progreso...</p>;
  }

  const greeting = activeProfile.gender === 'boy' ? 'Bienvenido' : 'Bienvenida';
  const readyText = activeProfile.gender === 'boy' ? '¿Listo' : '¿Lista';

  if (selectedCategory) {
    return (
      <div className="space-y-8">
        <Button variant="ghost" onClick={() => setSelectedCategory(null)} className="text-accent hover:text-accent/90">
          <ArrowLeft className="mr-2 h-5 w-5" /> Volver a Categorías
        </Button>
        <header className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary">{selectedCategory.title}</h1>
          <p className="mt-2 text-lg text-muted-foreground">{selectedCategory.description}</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedCategory.lessons.map(lesson => (
            <LessonItemCard key={lesson.id} lesson={lesson} progress={lessonProgressData[lesson.id]} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <header className="text-center space-y-2">
        <h1 className="text-5xl font-extrabold tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            ¡{greeting}, {activeProfile.name}!
          </span>
        </h1>
        <p className="text-xl text-muted-foreground flex items-center justify-center">
          <Sparkles className="mr-2 h-6 w-6 text-yellow-400" />
          {readyText} para una nueva aventura de aprendizaje?
        </p>
      </header>

      <ProgressOverview />

      <section>
        <h2 className="text-3xl font-bold mb-6 text-center text-foreground">¡Elige Tu Aventura!</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {LESSON_CATEGORIES.map(category => (
            <LessonCategoryCard
              key={category.id}
              category={category}
              onClick={() => setSelectedCategory(category)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
