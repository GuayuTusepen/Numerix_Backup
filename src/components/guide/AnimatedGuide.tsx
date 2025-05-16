"use client";

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Smile } from 'lucide-react'; // Using a simple icon as placeholder

interface AnimatedGuideProps {
  message?: string;
}

const messages = [
  "¡Hola! ¿Listo/a para aprender algo nuevo?",
  "¡Excelente trabajo! ¡Sigue así!",
  "Los números son divertidos, ¿verdad?",
  "¡Exploremos juntos el mundo de las matemáticas!",
  "No te preocupes si es difícil, ¡estoy aquí para ayudarte!"
];

export function AnimatedGuide({ message: initialMessage }: AnimatedGuideProps) {
  const [message, setMessage] = useState(initialMessage || messages[0]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Make guide visible after a short delay to avoid cluttering initial load
    const timer = setTimeout(() => setIsVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    if (!initialMessage) {
      const interval = setInterval(() => {
        setMessage(messages[Math.floor(Math.random() * messages.length)]);
      }, 15000); // Change message every 15 seconds
      return () => clearInterval(interval);
    } else {
      setMessage(initialMessage);
    }
  }, [initialMessage]);


  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-30 flex items-end space-x-3 transition-opacity duration-500 ease-in-out opacity-100">
      <div className="bg-card p-4 rounded-lg shadow-xl max-w-xs text-sm text-card-foreground relative">
        <p>{message}</p>
        <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-card mr-[-1px]"></div> {/* Speech bubble triangle */}
      </div>
      <div className="bg-primary p-3 rounded-full shadow-lg animate-bounce">
        <Image 
          src="https://placehold.co/80x80.png" 
          alt="Guía Amigable" 
          width={80} 
          height={80} 
          className="rounded-full"
          data-ai-hint="owl mascot"
        />
      </div>
    </div>
  );
}
