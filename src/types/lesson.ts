
import type { LucideIcon } from "lucide-react";

export interface Lesson {
  id: string;
  title: string;
  description: string;
  iconSrc: string; // Path to image icon in /public
  backgroundSrc: string; // Path to background image for the lesson card
  iconHint: string; // For data-ai-hint
  activityType: 'game' | 'classify-and-count' | 'external-link' | 'placeholder' | 'finger-sum-game' | 'finger-subtraction-game';
  difficulty: 'easy' | 'medium' | 'hard';
  externalUrl?: string; // Add this for external links
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
        description: 'Juega un divertido juego de sumas en una página externa.', 
        iconSrc: '/icons/sumasimple_logo.jpg', 
        backgroundSrc: '/icons/fondosumasimple.jpg', 
        iconHint: 'ladybug plus', 
        difficulty: 'easy', 
        activityType: 'external-link',
        externalUrl: 'https://pbskids.org/curiousgeorge/busyday/span_bugs/'
      },
      { 
        id: 'addition-up-to-20', 
        title: 'Suma Mágica hasta 20', 
        description: 'Suma con los dedos hasta 20.', 
        iconSrc: '/icons/suma20_fondo.jpg', 
        backgroundSrc: '/icons/fondo_suma20.jpg', 
        iconHint: 'calculator math', 
        difficulty: 'medium', 
        activityType: 'finger-sum-game' 
      },
    ],
  },
  {
    id: 'subtraction',
    title: 'Estación de Restas',
    description: 'Aprende a quitar números.',
    iconSrc: '/icons/estacipon_restas_icon.jpg',
    iconHint: 'minus circle',
    lessons: [
      { 
        id: 'simple-subtraction', 
        title: 'Restas Simples', 
        description: 'Juega un divertido juego de restas en una página externa.', 
        iconSrc: '/icons/resta_logo_complete.jpg', 
        backgroundSrc: '/icons/fondo_restas_simple.jpg', 
        iconHint: 'minus one', 
        difficulty: 'easy', 
        activityType: 'external-link',
        externalUrl: 'https://es.educaplay.com/recursos-educativos/18889552-juego_de_restas_del_1_al_10.html'
      },
      { id: 'subtraction-from-20', title: 'Restas hasta 20', description: 'Practica quitar de números hasta 20.', iconSrc: '/icons/logo_resta_simple.jpg', backgroundSrc: '/icons/fondo_restas_complejas.jpg', iconHint: 'file minus', difficulty: 'medium', activityType: 'finger-subtraction-game' },
    ],
  },
  {
    id: 'geometry',
    title: 'Tierra de Formas',
    description: 'Descubre diferentes formas y sus nombres.',
    iconSrc: '/icons/eart_forms_icon.jpg',
    iconHint: 'earth shapes',
    lessons: [
      { 
        id: 'basic-shapes', 
        title: 'Formas Básicas', 
        description: 'Aprende círculos, cuadrados y triángulos en este juego externo.', 
        iconSrc: '/icons/basic-shapes-icon.png', 
        backgroundSrc: 'https://placehold.co/600x400.png', 
        iconHint: 'square circle', 
        difficulty: 'easy', 
        activityType: 'external-link',
        externalUrl: 'https://arbolabc.com/juegos-de-figuras-geometricas/aprendamos-las-formas'
      },
    ],
  },
];
