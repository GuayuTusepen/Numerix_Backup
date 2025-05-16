import type { LucideIcon } from "lucide-react";

export interface Lesson {
  id: string;
  title: string;
  description: string;
  iconHint: string; // For data-ai-hint
  contentPath?: string; // Path to lesson specific content/component if not inline
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface LessonCategory {
  id: string;
  title: string;
  description: string;
  iconHint: string; // For data-ai-hint
  lessons: Lesson[];
}

export const LESSON_CATEGORIES: LessonCategory[] = [
  {
    id: 'counting',
    title: 'Counting Fun',
    description: 'Learn to count numbers and objects.',
    iconHint: 'list ordered',
    lessons: [
      { id: 'count-to-10', title: 'Count to 10', description: 'Practice counting from 1 to 10.', iconHint: 'fingerprint', difficulty: 'easy' },
      { id: 'object-counting', title: 'Object Counting', description: 'Count a set of fun objects.', iconHint: 'shapes', difficulty: 'easy' },
    ],
  },
  {
    id: 'addition',
    title: 'Addition Adventure',
    description: 'Start adding numbers together.',
    iconHint: 'plus circle',
    lessons: [
      { id: 'simple-addition', title: 'Simple Addition', description: 'Add single digit numbers.', iconHint: 'plus', difficulty: 'easy' },
      { id: 'addition-up-to-20', title: 'Addition up to 20', description: 'Practice sums up to 20.', iconHint: 'calculator', difficulty: 'medium' },
    ],
  },
  {
    id: 'subtraction',
    title: 'Subtraction Station',
    description: 'Learn to take numbers away.',
    iconHint: 'minus circle',
    lessons: [
      { id: 'simple-subtraction', title: 'Simple Subtraction', description: 'Subtract single digit numbers.', iconHint: 'minus', difficulty: 'easy' },
      { id: 'subtraction-from-20', title: 'Subtraction from 20', description: 'Practice taking away from numbers up to 20.', iconHint: 'file minus', difficulty: 'medium' },
    ],
  },
  {
    id: 'geometry',
    title: 'Shape Land',
    description: 'Discover different shapes and their names.',
    iconHint: 'triangle',
    lessons: [
      { id: 'basic-shapes', title: 'Basic Shapes', description: 'Learn circles, squares, and triangles.', iconHint: 'square', difficulty: 'easy' },
      { id: 'more-shapes', title: 'More Shapes', description: 'Explore rectangles, stars, and hearts.', iconHint: 'star', difficulty: 'medium' },
    ],
  },
];
