
"use client";

import Link from 'next/link';
import type { Lesson } from '@/types/lesson';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Star, CheckCircle2, PlayCircle } from 'lucide-react';
import type { LessonProgress } from '@/types/progress';
import { cn } from '@/lib/utils';

interface LessonItemCardProps {
  lesson: Lesson;
  progress?: LessonProgress;
}

function DifficultyBadge({ difficulty }: { difficulty: Lesson['difficulty'] }) {
  let bgColor = 'bg-green-100 text-green-700';
  let difficultyText = 'Fácil';
  if (difficulty === 'medium') {
    bgColor = 'bg-yellow-100 text-yellow-700';
    difficultyText = 'Medio';
  }
  if (difficulty === 'hard') {
    bgColor = 'bg-red-100 text-red-700';
    difficultyText = 'Difícil';
  }

  return (
    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${bgColor} shadow-sm`}>
      {difficultyText}
    </span>
  );
}

export function LessonItemCard({ lesson, progress }: LessonItemCardProps) {
  const stars = progress?.stars || 0;

  return (
    <Link href={`/lessons/${lesson.id}`} passHref>
      <Card className="w-full shadow-lg rounded-xl overflow-hidden transition-all duration-300 group hover:shadow-xl hover:scale-105 relative border-2 border-transparent hover:border-primary">
        <Image 
            src={lesson.backgroundSrc} 
            alt={`Fondo para ${lesson.title}`}
            layout="fill"
            objectFit="cover"
            className="absolute inset-0 z-0 transition-transform duration-300 group-hover:scale-110"
            data-ai-hint={lesson.iconHint} // Reuse hint for background
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
        
        <div className="relative z-20 flex flex-col justify-between h-full text-white min-h-[220px]">
          <CardHeader className="flex flex-row items-center space-x-4 p-4">
              <Image
                src={lesson.iconSrc}
                alt={lesson.title}
                width={50}
                height={50}
                className="rounded-md border-2 border-white/50 bg-white/20 p-1"
                data-ai-hint={lesson.iconHint}
              />
              <div className="flex-1">
                <CardTitle className="text-lg font-bold [text-shadow:1px_1px_3px_rgba(0,0,0,0.7)]">{lesson.title}</CardTitle>
                <DifficultyBadge difficulty={lesson.difficulty} />
              </div>
              {progress?.completed && <CheckCircle2 className="h-6 w-6 text-green-300" />}
          </CardHeader>

          <CardContent className="p-4 pt-0">
             <CardDescription className="text-sm text-white/95 mb-3 min-h-[40px] [text-shadow:1px_1px_2px_rgba(0,0,0,0.8)]">{lesson.description}</CardDescription>
            <div className="flex items-center justify-between">
              <div className="flex bg-black/30 p-1 rounded-full">
                {[1, 2, 3].map((s) => (
                  <Star
                    key={s}
                    className={`h-5 w-5 ${s <= stars ? 'text-yellow-400 fill-yellow-400' : 'text-white/40'}`}
                  />
                ))}
              </div>
              <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full shadow-md">
                <PlayCircle className="mr-2 h-4 w-4" />
                {progress?.completed ? 'Repetir' : 'Empezar'}
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
}
