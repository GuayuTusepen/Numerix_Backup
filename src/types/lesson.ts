import type { LucideIcon } from "lucide-react";

export interface Lesson {
  id: string;
  title: string;
  description: string;
  iconHint: string; // For data-ai-hint
  contentPath?: string; 
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
    title: 'Diversión Contando',
    description: 'Aprende a contar números y objetos.',
    iconHint: 'list ordered',
    lessons: [
      { id: 'count-to-10', title: 'Contar hasta 10', description: 'Practica contar del 1 al 10.', iconHint: 'fingerprint', difficulty: 'easy' },
      { id: 'object-counting', title: 'Contar Objetos', description: 'Cuenta un conjunto de objetos divertidos.', iconHint: 'shapes', difficulty: 'easy' },
    ],
  },
  {
    id: 'addition',
    title: 'Aventura de Sumas',
    description: 'Empieza a sumar números.',
    iconHint: 'plus circle',
    lessons: [
      { id: 'simple-addition', title: 'Sumas Simples', description: 'Suma números de un solo dígito.', iconHint: 'plus', difficulty: 'easy' },
      { id: 'addition-up-to-20', title: 'Sumas hasta 20', description: 'Practica sumas hasta 20.', iconHint: 'calculator', difficulty: 'medium' },
    ],
  },
  {
    id: 'subtraction',
    title: 'Estación de Restas',
    description: 'Aprende a quitar números.',
    iconHint: 'minus circle',
    lessons: [
      { id: 'simple-subtraction', title: 'Restas Simples', description: 'Resta números de un solo dígito.', iconHint: 'minus', difficulty: 'easy' },
      { id: 'subtraction-from-20', title: 'Restas desde 20', description: 'Practica quitar de números hasta 20.', iconHint: 'file minus', difficulty: 'medium' },
    ],
  },
  {
    id: 'geometry',
    title: 'Tierra de Formas',
    description: 'Descubre diferentes formas y sus nombres.',
    iconHint: 'triangle',
    lessons: [
      { id: 'basic-shapes', title: 'Formas Básicas', description: 'Aprende círculos, cuadrados y triángulos.', iconHint: 'square', difficulty: 'easy' },
      { id: 'more-shapes', title: 'Más Formas', description: 'Explora rectángulos, estrellas y corazones.', iconHint: 'star', difficulty: 'medium' },
    ],
  },
];
