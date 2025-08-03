
import type { LucideIcon } from "lucide-react";

export interface Lesson {
  id: string;
  title: string;
  description: string;
  iconSrc: string; // Path to image icon in /public
  backgroundSrc: string; // Path to background image for the lesson card
  iconHint: string; // For data-ai-hint
  activityType: 'game' | 'classify-and-count' | 'bug-addition' | 'placeholder';
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
    iconSrc: '/icons/count_to_0_icon.jpg',
    iconHint: 'abacus counting',
    lessons: [
      { 
        id: 'count-to-10', 
        title: 'Contar hasta 10', 
        description: 'Practica contar del 1 al 10 con frutas.', 
        iconSrc: '/icons/contar10_icon.png',
        backgroundSrc: '/icons/fondo_count_to_10.jpg',
        iconHint: 'ten fingers', 
        difficulty: 'easy', 
        activityType: 'game' 
      },
      { 
        id: 'object-counting', 
        title: 'Contar Objetos', 
        description: 'Clasifica y cuenta un conjunto de objetos divertidos.', 
        iconSrc: '/icons/count_object_logo.jpg',
        backgroundSrc: '/icons/fondo_contar_objetos.jpg',
        iconHint: 'shapes blocks', 
        difficulty: 'easy', 
        activityType: 'classify-and-count' 
      },
    ],
  },
  {
    id: 'addition',
    title: 'Aventura de Sumas',
    description: 'Empieza a sumar números.',
    iconSrc: '/icons/sumas_icon.jpg',
    iconHint: 'plus circle',
    lessons: [
      { 
        id: 'simple-addition', 
        title: 'Sumas Simples con Bichos', 
        description: 'Suma arrastrando bichos a una hoja.', 
        iconSrc: '/icons/sumasimple_logo.jpg', 
        backgroundSrc: '/icons/fondosumasimple.jpg', 
        iconHint: 'ladybug plus', 
        difficulty: 'easy', 
        activityType: 'bug-addition' 
      },
      { id: 'addition-up-to-20', title: 'Sumas hasta 20', description: 'Practica sumas hasta 20.', iconSrc: '/icons/suma20_fondo.jpg', backgroundSrc: '/icons/fondo_suma20.jpg', iconHint: 'calculator math', difficulty: 'medium', activityType: 'placeholder' },
    ],
  },
  {
    id: 'subtraction',
    title: 'Estación de Restas',
    description: 'Aprende a quitar números.',
    iconSrc: '/icons/estacipon_restas_icon.jpg',
    iconHint: 'minus circle',
    lessons: [
      { id: 'simple-subtraction', title: 'Restas Simples', description: 'Resta números de un solo dígito.', iconSrc: '/icons/simple-subtraction-icon.png', backgroundSrc: 'https://placehold.co/600x400.png', iconHint: 'minus one', difficulty: 'easy', activityType: 'placeholder' },
      { id: 'subtraction-from-20', title: 'Restas desde 20', description: 'Practica quitar de números hasta 20.', iconSrc: '/icons/subtraction-20-icon.png', backgroundSrc: 'https://placehold.co/600x400.png', iconHint: 'file minus', difficulty: 'medium', activityType: 'placeholder' },
    ],
  },
  {
    id: 'geometry',
    title: 'Tierra de Formas',
    description: 'Descubre diferentes formas y sus nombres.',
    iconSrc: '/icons/eart_forms_icon.jpg',
    iconHint: 'earth shapes',
    lessons: [
      { id: 'basic-shapes', title: 'Formas Básicas', description: 'Aprende círculos, cuadrados y triángulos.', iconSrc: '/icons/basic-shapes-icon.png', backgroundSrc: 'https://placehold.co/600x400.png', iconHint: 'square circle', difficulty: 'easy', activityType: 'placeholder' },
      { id: 'more-shapes', title: 'Más Formas', description: 'Explora rectángulos, estrellas y corazones.', iconSrc: '/icons/more-shapes-icon.png', backgroundSrc: 'https://placehold.co/600x400.png', iconHint: 'star heart', difficulty: 'medium', activityType: 'placeholder' },
    ],
  },
];
