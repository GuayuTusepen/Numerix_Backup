"use client";

import type { LessonCategory } from '@/types/lesson';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

interface LessonCategoryCardProps {
  category: LessonCategory;
  onClick: () => void;
}

export function LessonCategoryCard({ category, onClick }: LessonCategoryCardProps) {
  return (
    <Card 
      className="w-full shadow-lg rounded-xl cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-primary border-2 border-transparent"
      onClick={onClick}
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
      aria-label={`Seleccionar categoría ${category.title}`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold text-primary">{category.title}</CardTitle>
        <Image 
            src={`https://placehold.co/60x60.png?text=${category.title.substring(0,1)}`} 
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
          Explorar Lecciones <ChevronRight className="h-4 w-4 ml-1" />
        </div>
      </CardContent>
    </Card>
  );
}
