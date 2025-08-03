
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProfile } from "@/contexts/ProfileContext";
import { useProgress } from "@/contexts/ProgressContext";
import { getLocalStorageItem, setLocalStorageItem } from "@/lib/localStorage";
import { classifyAndCountGameData, GameLevel } from "@/data/classifyAndCountGameData";
import ClassifyAndCountGame from "@/components/lessons/games/ClassifyAndCountGame";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, Lock, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type LevelProgress = {
    completed: boolean;
    stars: number;
    score: number;
};

type GameProgress = {
    [levelId: string]: LevelProgress;
};

export default function PlayClassifyAndCountPage() {
    const router = useRouter();
    const params = useParams();
    const lessonId = params.lessonId as string;
    const { toast } = useToast();

    const { activeProfile } = useProfile();
    const { updateLessonProgress: updateOverallLessonProgress } = useProgress();

    const [selectedLevel, setSelectedLevel] = useState<GameLevel | null>(null);
    const [gameProgress, setGameProgress] = useState<GameProgress>({});
    const [notification, setNotification] = useState<{ show: boolean; level: number; score: number; stars: number } | null>(null);

    const storageKey = activeProfile ? `classifyAndCountProgress_${activeProfile.id}` : null;

    useEffect(() => {
        if (storageKey) {
            const savedProgress = getLocalStorageItem<GameProgress>(storageKey, {});
            setGameProgress(savedProgress);
        }
    }, [storageKey]);

    const handleLevelComplete = (result: { score: number; stars: number }) => {
        if (!selectedLevel || !storageKey) return;
        
        const levelId = selectedLevel.level.toString();
        const currentBest = gameProgress[levelId] || { stars: 0, score: 0, completed: false };

        let progressToSave = currentBest;
        // Update only if the new score is better, or if it's the first time completing.
        if (result.score > currentBest.score || !currentBest.completed) {
            progressToSave = { completed: true, score: result.score, stars: result.stars };
        }

        const newProgress = { 
            ...gameProgress,
            [levelId]: progressToSave
        };
        
        setGameProgress(newProgress);
        setLocalStorageItem(storageKey, newProgress);

        // Update overall lesson progress for the dashboard
        const totalLevels = classifyAndCountGameData.length;
        const completedLevelsCount = Object.values(newProgress).filter(p => p.completed).length;
        const totalStars = Object.values(newProgress).reduce((acc, p) => acc + p.stars, 0);
        
        let overallStars: 1 | 2 | 3 = 1;
        if (completedLevelsCount === totalLevels) {
            const averageStars = totalStars / totalLevels;
            if (averageStars >= 2.8) overallStars = 3; // Allow for slight rounding issues, basically perfect
            else if (averageStars >= 1.8) overallStars = 2;
            else overallStars = 1;
        } else if (completedLevelsCount > 0) {
            overallStars = 1; // Mark as started but not fully complete with a good score
        }
        
        updateOverallLessonProgress(lessonId, { completed: completedLevelsCount === totalLevels, stars: overallStars, lastAttempted: new Date().toISOString() });

        setNotification({
            show: true,
            level: selectedLevel.level,
            score: result.score,
            stars: result.stars,
        });

        setSelectedLevel(null);

        setTimeout(() => {
            setNotification(null);
        }, 5000);
    };

    const startLevel = (level: GameLevel) => {
        setSelectedLevel(level);
    };

    if (selectedLevel) {
        return <ClassifyAndCountGame gameLevel={selectedLevel} onLevelComplete={handleLevelComplete} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 p-4">
            <div className="max-w-4xl mx-auto">
                <Button variant="ghost" onClick={() => router.push('/dashboard')} className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Panel
                </Button>
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold text-gray-800 mb-4">Clasifica y Cuenta</h1>
                    <p className="text-lg text-muted-foreground">Selecciona un nivel para empezar a jugar.</p>
                </div>

                {notification?.show && (
                    <Card className="mb-6 bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-2xl border-4 border-yellow-400 animate-bounce">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="text-6xl">🎉</div>
                                    <div>
                                        <h3 className="text-2xl font-bold">¡Nivel {notification.level} Completado!</h3>
                                        <p className="text-lg">Puntuación: {notification.score} puntos</p>
                                        <div className="flex items-center space-x-1">
                                            <span className="text-lg font-semibold">Estrellas:</span>
                                            {[...Array(3)].map((_, i) => (
                                                <Star key={i} className={`h-6 w-6 ${i < notification.stars ? 'text-yellow-300 fill-yellow-300' : 'text-white/50'}`} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => setNotification(null)}
                                    variant="outline"
                                    size="sm"
                                    className="bg-white/20 hover:bg-white/30 text-white border-white/50"
                                >
                                    ✕
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {classifyAndCountGameData.map((level) => {
                        const levelProgress = gameProgress[level.level.toString()];
                        const isCompleted = levelProgress?.completed;
                        const stars = levelProgress?.stars || 0;
                        const isLocked = level.level > 1 && !gameProgress[(level.level - 1).toString()]?.completed;

                        return (
                            <Card
                                key={level.level}
                                className={`shadow-lg transition-all duration-300 hover:shadow-2xl ${
                                    isCompleted ? "bg-green-100 border-2 border-green-400" :
                                    isLocked ? "bg-gray-100 border-2 border-gray-300 opacity-60" :
                                    "bg-white border-2 border-blue-300 hover:border-blue-500"
                                }`}
                            >
                                <CardHeader className="text-center">
                                    <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                                        {isCompleted && <CheckCircle className="text-green-500" />}
                                        {isLocked && <Lock className="text-gray-500" />}
                                        Nivel {level.level}
                                    </CardTitle>
                                    {isCompleted && (
                                         <div className="flex justify-center mt-2">
                                            {[...Array(3)].map((_, i) => (
                                                <Star key={i} className={`h-5 w-5 ${i < stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                            ))}
                                        </div>
                                    )}
                                </CardHeader>
                                <CardContent className="text-center space-y-4">
                                    <div className="flex flex-wrap justify-center gap-1">
                                        {level.categories.map((category) => (
                                            <span key={category.id} className={`px-2 py-1 rounded-full text-xs font-semibold ${category.color}`}>
                                                {category.name}
                                            </span>
                                        ))}
                                    </div>

                                    <Button
                                        onClick={() => startLevel(level)}
                                        disabled={isLocked}
                                        className={`w-full font-bold text-lg py-3 rounded-full transition-all ${
                                            isCompleted ? "bg-green-500 hover:bg-green-600 text-white" :
                                            isLocked ? "bg-gray-400 cursor-not-allowed" :
                                            "bg-blue-500 hover:bg-blue-600 text-white hover:scale-105"
                                        }`}
                                    >
                                        {isCompleted ? "🔄 Jugar de Nuevo" : isLocked ? "🔒 Bloqueado" : "🚀 Jugar"}
                                    </Button>

                                    {isLocked && (
                                        <p className="text-xs text-gray-500 mt-2">Completa el nivel anterior para desbloquear</p>
                                    )}
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}
