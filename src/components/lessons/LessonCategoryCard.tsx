
"use client";

import type { LessonCategory } from '@/types/lesson';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import { ChevronRight, Star, Award, Trophy } from 'lucide-react';
import type { ProfileProgress } from '@/types/progress';
import { cn } from '@/lib/utils';

interface LessonCategoryCardProps {
  category: LessonCategory;
  onClick: () => void;
  progressData: ProfileProgress;
}

export function LessonCategoryCard({ category, onClick, progressData }: LessonCategoryCardProps) {
  const categoryLessons = category.lessons;
  const completedLessons = categoryLessons.filter(lesson => progressData[lesson.id]?.completed);
  const totalStars = completedLessons.reduce((acc, lesson) => acc + (progressData[lesson.id]?.stars || 0), 0);
  
  let status: 'not-started' | 'completed-bronze' | 'completed-silver' | 'completed-gold' = 'not-started';
  let statusIcon = null;
  let statusText = "Explorar Lecciones";
  
  if (completedLessons.length === categoryLessons.length && categoryLessons.length > 0) {
    const avgStars = totalStars / completedLessons.length;
    if (avgStars >= 2.8) {
      status = 'completed-gold';
      statusIcon = <Trophy className="h-5 w-5 text-yellow-500" />;
      statusText = "¡Excelente!";
    } else if (avgStars >= 1.8) {
      status = 'completed-silver';
      statusIcon = <Award className="h-5 w-5 text-slate-400" />;
      statusText = "¡Muy Bien!";
    } else {
      status = 'completed-bronze';
      statusIcon = <Star className="h-5 w-5 text-orange-400" />;
      statusText = "¡Completado!";
    }
  }

  return (
    <Card 
      className={cn(
        "w-full shadow-lg rounded-xl cursor-pointer transition-all duration-300 border-2 border-transparent",
        "hover:shadow-xl hover:scale-105 hover:border-primary",
        status === 'completed-gold' && 'border-yellow-400 bg-yellow-50/50 shadow-yellow-200/50',
        status === 'completed-silver' && 'border-slate-400 bg-slate-50/50 shadow-slate-200/50',
        status === 'completed-bronze' && 'border-orange-400 bg-orange-50/50 shadow-orange-200/50'
      )}
      onClick={onClick}
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
      aria-label={`Seleccionar categoría ${category.title}`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold text-primary">{category.title}</CardTitle>
        <Image 
            src={category.iconSrc} 
            alt={category.title} 
            width={48} 
            height={48}
            className="rounded-lg bg-muted p-1" 
            data-ai-hint={category.iconHint}
        />
      </CardHeader>
      <CardContent>
        <CardDescription className="text-muted-foreground">{category.description}</CardDescription>
        <div className="flex items-center justify-end mt-4 text-sm text-accent font-medium">
          {statusIcon}
          <span className="ml-2">{statusText}</span>
          <ChevronRight className="h-4 w-4 ml-1" />
        </div>
      </CardContent>
    </Card>
  );
}
