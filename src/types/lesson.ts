
import type { LucideIcon } from "lucide-react";

export interface Lesson {
  id: string;
  title: string;
  description: string;
  iconSrc: string; // Path to image icon in /public
  iconHint: string; // For data-ai-hint
  activityType: 'game' | 'classify-and-count' | 'placeholder';
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface LessonCategory {
  id: string;
  title: string;
  description: string;
  iconSrc: string; // Path to image icon in /public
  iconHint: string; // For data-ai-hint
  lessons: Lesson[];
}

export const LESSON_CATEGORIES: LessonCategory[] = [
  {
    id: 'counting',
    title: 'Diversión Contando',
    description: 'Aprende a contar números y objetos.',
    iconSrc: '/icons/counting-icon.png',
    iconHint: 'abacus counting',
    lessons: [
      { id: 'count-to-10', title: 'Contar hasta 10', description: 'Practica contar del 1 al 10.', iconSrc: '/icons/count-to-10-icon.png', iconHint: 'ten fingers', difficulty: 'easy', activityType: 'game' },
      { id: 'object-counting', title: 'Contar Objetos', description: 'Clasifica y cuenta un conjunto de objetos divertidos.', iconSrc: '/icons/object-counting-icon.png', iconHint: 'shapes blocks', difficulty: 'easy', activityType: 'classify-and-count' },
    ],
  },
  {
    id: 'addition',
    title: 'Aventura de Sumas',
    description: 'Empieza a sumar números.',
    iconSrc: '/icons/addition-icon.png',
    iconHint: 'plus circle',
    lessons: [
      { id: 'simple-addition', title: 'Sumas Simples', description: 'Suma números de un solo dígito.', iconSrc: '/icons/simple-addition-icon.png', iconHint: 'plus one', difficulty: 'easy', activityType: 'placeholder' },
      { id: 'addition-up-to-20', title: 'Sumas hasta 20', description: 'Practica sumas hasta 20.', iconSrc: '/icons/addition-20-icon.png', iconHint: 'calculator math', difficulty: 'medium', activityType: 'placeholder' },
    ],
  },
  {
    id: 'subtraction',
    title: 'Estación de Restas',
    description: 'Aprende a quitar números.',
    iconSrc: '/icons/subtraction-icon.png',
    iconHint: 'minus circle',
    lessons: [
      { id: 'simple-subtraction', title: 'Restas Simples', description: 'Resta números de un solo dígito.', iconSrc: '/icons/simple-subtraction-icon.png', iconHint: 'minus one', difficulty: 'easy', activityType: 'placeholder' },
      { id: 'subtraction-from-20', title: 'Restas desde 20', description: 'Practica quitar de números hasta 20.', iconSrc: '/icons/subtraction-20-icon.png', iconHint: 'file minus', difficulty: 'medium', activityType: 'placeholder' },
    ],
  },
  {
    id: 'geometry',
    title: 'Tierra de Formas',
    description: 'Descubre diferentes formas y sus nombres.',
    iconSrc: '/icons/geometry-icon.png',
    iconHint: 'triangle square circle',
    lessons: [
      { id: 'basic-shapes', title: 'Formas Básicas', description: 'Aprende círculos, cuadrados y triángulos.', iconSrc: '/icons/basic-shapes-icon.png', iconHint: 'square circle', difficulty: 'easy', activityType: 'placeholder' },
      { id: 'more-shapes', title: 'Más Formas', description: 'Explora rectángulos, estrellas y corazones.', iconSrc: '/icons/more-shapes-icon.png', iconHint: 'star heart', difficulty: 'medium', activityType: 'placeholder' },
    ],
  },
];
