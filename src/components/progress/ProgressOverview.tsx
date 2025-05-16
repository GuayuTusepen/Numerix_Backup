"use client";

import { useProgress } from '@/contexts/ProgressContext';
import { useProfile } from '@/contexts/ProfileContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress'; // ShadCN progress
import { Star, Trophy, Award } from 'lucide-react';
import { LESSON_CATEGORIES } from '@/types/lesson';

export function ProgressOverview() {
  const { activeProfile } = useProfile();
  const { progress, getTotalStars, isLoading } = useProgress();

  if (isLoading || !activeProfile) {
    return (
      <Card className="shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
          <CardDescription>Loading progress data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-10 animate-pulse bg-muted rounded-md"></div>
        </CardContent>
      </Card>
    );
  }

  const totalLessons = LESSON_CATEGORIES.reduce((acc, category) => acc + category.lessons.length, 0);
  const completedLessons = Object.values(progress).filter(p => p.completed).length;
  const overallProgressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  const totalStarsCollected = getTotalStars();
  // Example: define badges based on stars or completed lessons
  const badges = [];
  if (totalStarsCollected >= 10) badges.push({ name: "Star Collector", icon: <Star className="h-5 w-5 text-yellow-400" />, description: "Collected 10+ stars!" });
  if (completedLessons >= 5) badges.push({ name: "Lesson Master", icon: <Award className="h-5 w-5 text-blue-500" />, description: "Completed 5+ lessons!" });
  if (overallProgressPercentage === 100) badges.push({ name: "Numerix Champion", icon: <Trophy className="h-5 w-5 text-green-500" />, description: "Completed all lessons!" });


  return (
    <Card className="shadow-lg rounded-xl bg-card">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">Your Learning Journey, {activeProfile.name}!</CardTitle>
        <CardDescription>See how much you've learned and the rewards you've earned.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-foreground">Overall Progress</span>
            <span className="text-sm font-medium text-primary">{Math.round(overallProgressPercentage)}%</span>
          </div>
          <Progress value={overallProgressPercentage} aria-label={`Overall progress: ${Math.round(overallProgressPercentage)}%`} className="h-3 rounded-full" />
          <p className="text-xs text-muted-foreground mt-1">{completedLessons} of {totalLessons} lessons completed.</p>
        </div>

        <div className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
          <Star className="h-10 w-10 text-primary" />
          <div>
            <p className="text-2xl font-bold text-foreground">{totalStarsCollected}</p>
            <p className="text-sm text-muted-foreground">Total Stars Collected</p>
          </div>
        </div>
        
        {badges.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">Your Badges</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {badges.map(badge => (
                <div key={badge.name} className="flex items-center space-x-3 p-3 bg-background rounded-md border">
                  {badge.icon}
                  <div>
                    <p className="font-medium text-sm text-foreground">{badge.name}</p>
                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
         {badges.length === 0 && (
          <p className="text-center text-muted-foreground py-4">Keep learning to earn badges!</p>
        )}
      </CardContent>
    </Card>
  );
}
