
"use client";

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useProfile } from '@/contexts/ProfileContext'; // Import useProfile

interface AnimatedGuideProps {
  message?: string;
}

const baseMessages = [
  "¡Hola! ¿{listo_lista} para aprender algo nuevo?",
  "¡Excelente trabajo! ¡Sigue así!",
  "Los números son divertidos, ¿verdad?",
  "¡Exploremos juntos el mundo de las matemáticas!",
  "No te preocupes si es difícil, ¡estoy aquí para ayudarte!"
];

export function AnimatedGuide({ message: initialMessage }: AnimatedGuideProps) {
  const { activeProfile } = useProfile(); // Get active profile
  const [currentMessage, setCurrentMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const personalizeMessage = (msg: string): string => {
    if (activeProfile?.gender) {
      const listoLista = activeProfile.gender === 'boy' ? 'listo' : 'lista';
      return msg.replace("{listo_lista}", listoLista);
    }
    // Fallback if gender is not defined or profile not loaded yet
    return msg.replace("{listo_lista}", "listo/a"); 
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    if (initialMessage) {
      setCurrentMessage(personalizeMessage(initialMessage));
    } else {
      setCurrentMessage(personalizeMessage(baseMessages[0])); // Set initial message
      const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * baseMessages.length);
        setCurrentMessage(personalizeMessage(baseMessages[randomIndex]));
      }, 15000);
      return () => clearInterval(interval);
    }
  }, [initialMessage, activeProfile]); // Re-run if activeProfile (and thus gender) changes


  if (!isVisible || !activeProfile) return null; // Also ensure profile is loaded

  return (
    <div className="fixed bottom-6 right-6 z-30 flex items-end space-x-3 transition-opacity duration-500 ease-in-out opacity-100">
      <div className="bg-card p-4 rounded-lg shadow-xl max-w-xs text-sm text-card-foreground relative">
        <p>{currentMessage}</p>
        <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-card mr-[-1px]"></div> {/* Speech bubble triangle */}
      </div>
      <div className="bg-primary p-3 rounded-full shadow-lg animate-bounce">
        <Image 
          src="/guide/friendly-owl.png"
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
