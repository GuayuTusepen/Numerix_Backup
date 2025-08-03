
"use client";

import Link from 'next/link';
import type { Lesson } from '@/types/lesson';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Star, CheckCircle2, PlayCircle } from 'lucide-react';
import type { LessonProgress } from '@/types/progress';

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
    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${bgColor}`}>
      {difficultyText}
    </span>
  );
}

export function LessonItemCard({ lesson, progress }: LessonItemCardProps) {
  const stars = progress?.stars || 0;

  return (
    <Card className="w-full shadow-md rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardHeader className="flex flex-row items-start bg-muted/50 p-4 space-x-4">
        <Image
          src={lesson.iconSrc}
          alt={lesson.title}
          width={60}
          height={60}
          className="rounded-md border bg-background"
          data-ai-hint={lesson.iconHint}
        />
        <div className="flex-1">
          <CardTitle className="text-lg font-semibold text-foreground">{lesson.title}</CardTitle>
          <DifficultyBadge difficulty={lesson.difficulty} />
        </div>
        {progress?.completed && <CheckCircle2 className="h-6 w-6 text-green-500" />}
      </CardHeader>
      <CardContent className="p-4">
        <CardDescription className="text-sm text-muted-foreground mb-3 min-h-[40px]">{lesson.description}</CardDescription>
        <div className="flex items-center justify-between">
          <div className="flex">
            {[1, 2, 3].map((s) => (
              <Star
                key={s}
                className={`h-5 w-5 ${s <= stars ? 'text-primary fill-primary' : 'text-muted-foreground/50'}`}
              />
            ))}
          </div>
          <Button asChild size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href={`/lessons/${lesson.id}`}>
              <PlayCircle className="mr-2 h-4 w-4" />
              {progress?.completed ? 'Repetir' : 'Empezar'}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
