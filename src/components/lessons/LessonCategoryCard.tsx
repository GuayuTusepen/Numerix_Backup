
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
      statusIcon = <Trophy className="h-5 w-5 text-yellow-400" />;
      statusText = "¡Excelente!";
    } else if (avgStars >= 1.8) {
      status = 'completed-silver';
      statusIcon = <Award className="h-5 w-5 text-slate-300" />;
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
        "w-full shadow-lg rounded-xl cursor-pointer transition-all duration-300 border-2 border-transparent relative overflow-hidden group",
        "hover:shadow-xl hover:scale-105 hover:border-primary",
        status === 'completed-gold' && 'border-yellow-400 shadow-yellow-200/50',
        status === 'completed-silver' && 'border-slate-400 shadow-slate-200/50',
        status === 'completed-bronze' && 'border-orange-400 shadow-orange-200/50'
      )}
      onClick={onClick}
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
      aria-label={`Seleccionar categoría ${category.title}`}
    >
      <Image 
          src={category.iconSrc} 
          alt={category.title} 
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 z-0 transition-transform duration-300 group-hover:scale-110"
          data-ai-hint={category.iconHint}
      />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
      
      <div className="relative z-20 flex flex-col justify-end h-full p-6 text-white">
        <CardTitle className="text-3xl font-bold drop-shadow-lg font-zto">{category.title}</CardTitle>
        <CardDescription className="text-white/90 drop-shadow-md font-zto">{category.description}</CardDescription>
        <div className="flex items-center justify-end mt-4 text-sm font-medium text-white/90 drop-shadow-sm font-zto">
          {statusIcon}
          <span className="ml-2">{statusText}</span>
          <ChevronRight className="h-4 w-4 ml-1" />
        </div>
      </div>
    </Card>
  );
}
