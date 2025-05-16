"use client";

import type { ProfileProgress, LessonProgress } from '@/types/progress';
import { getLocalStorageItem, setLocalStorageItem } from '@/lib/localStorage';
import type { ReactNode} from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useProfile } from './ProfileContext';

const PROGRESS_STORAGE_KEY_PREFIX = 'numerix_progress_';

interface ProgressContextType {
  progress: ProfileProgress;
  isLoading: boolean;
  updateLessonProgress: (lessonId: string, lessonProgress: Partial<LessonProgress>) => void;
  getLessonProgress: (lessonId: string) => LessonProgress | undefined;
  getTotalStars: () => number;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { activeProfile, isLoading: isProfileLoading } = useProfile();
  const [progress, setProgress] = useState<ProfileProgress>({});
  const [isLoading, setIsLoading] = useState(true);

  const getStorageKey = useCallback(() => {
    if (!activeProfile) return null;
    return `${PROGRESS_STORAGE_KEY_PREFIX}${activeProfile.id}`;
  }, [activeProfile]);

  useEffect(() => {
    setIsLoading(true);
    if (!isProfileLoading && activeProfile) {
      const storageKey = getStorageKey();
      if (storageKey) {
        const storedProgress = getLocalStorageItem<ProfileProgress>(storageKey, {});
        setProgress(storedProgress);
      } else {
        setProgress({}); // Reset progress if no active profile or key issue
      }
      setIsLoading(false);
    } else if (!isProfileLoading && !activeProfile) {
      // No active profile, clear progress state
      setProgress({});
      setIsLoading(false);
    }
  }, [activeProfile, isProfileLoading, getStorageKey]);

  const saveProgress = useCallback((updatedProgress: ProfileProgress) => {
    const storageKey = getStorageKey();
    if (storageKey) {
      setProgress(updatedProgress);
      setLocalStorageItem(storageKey, updatedProgress);
    }
  }, [getStorageKey]);

  const updateLessonProgress = (lessonId: string, lessonProgressUpdate: Partial<LessonProgress>) => {
    const currentLessonProgress = progress[lessonId] || { completed: false, stars: 0 };
    const updatedLessonProgress = { ...currentLessonProgress, ...lessonProgressUpdate };
    
    // Ensure stars are within 0-3 range
    if (updatedLessonProgress.stars < 0) updatedLessonProgress.stars = 0;
    if (updatedLessonProgress.stars > 3) updatedLessonProgress.stars = 3;

    const updatedProgress = {
      ...progress,
      [lessonId]: updatedLessonProgress,
    };
    saveProgress(updatedProgress);
  };

  const getLessonProgress = (lessonId: string): LessonProgress | undefined => {
    return progress[lessonId];
  };

  const getTotalStars = (): number => {
    return Object.values(progress).reduce((total, lesson) => total + (lesson.stars || 0), 0);
  };

  return (
    <ProgressContext.Provider value={{ progress, isLoading, updateLessonProgress, getLessonProgress, getTotalStars }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
