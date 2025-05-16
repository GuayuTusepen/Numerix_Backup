export interface LessonProgress {
  completed: boolean;
  stars: 0 | 1 | 2 | 3; // e.g., 3-star rating system
  score?: number; // Optional score
  lastAttempted?: string; // ISO date string
}

export interface ProfileProgress {
  [lessonId: string]: LessonProgress;
}

// Rewards could be an array of strings (badge names/IDs) or more complex objects
export interface ProfileRewards {
  badges: string[];
  totalStars: number;
}
