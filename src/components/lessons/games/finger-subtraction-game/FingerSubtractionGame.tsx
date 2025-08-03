
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Play, Lock } from "lucide-react"
import Tutorial from "./Tutorial"
import GameLevel from "./GameLevel"
import Results from "./Results"
import { useProgress } from "@/contexts/ProgressContext"
import { useProfile } from "@/contexts/ProfileContext"
import { getLocalStorageItem, setLocalStorageItem } from "@/lib/localStorage"

type GameState = "menu" | "tutorial" | "playing" | "results"
export type Difficulty = "easy" | "intermediate" | "advanced"

interface FingerSubtractionGameProps {
  lessonId: string;
  onGameExit: () => void;
}

export default function FingerSubtractionGame({ lessonId, onGameExit }: FingerSubtractionGameProps) {
  const [gameState, setGameState] = useState<GameState>("menu")
  const [difficulty, setDifficulty] = useState<Difficulty>("easy")
  const [score, setScore] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  
  const { activeProfile } = useProfile();
  const { updateLessonProgress } = useProgress();
  
  const tutorialStorageKey = activeProfile ? `fingersub_tutorial_completed_${activeProfile.id}` : null;
  const progressStorageKey = activeProfile ? `fingersub_progress_${activeProfile.id}` : null;

  const [unlockedLevels, setUnlockedLevels] = useState<Difficulty[]>(["easy"]);
  const [tutorialCompleted, setTutorialCompleted] = useState(false);

  const difficultyConfig = {
    easy: { name: "Fácil", questions: 5, maxNumber: 10, color: "bg-green-500" },
    intermediate: { name: "Intermedio", questions: 7, maxNumber: 15, color: "bg-yellow-500" },
    advanced: { name: "Avanzado", questions: 10, maxNumber: 20, color: "bg-red-500" },
  }

  useEffect(() => {
    if (progressStorageKey) {
      const savedProgress = getLocalStorageItem<{ unlockedLevels: Difficulty[] }>(progressStorageKey, { unlockedLevels: ["easy"] });
      setUnlockedLevels(savedProgress.unlockedLevels);
    }
    if(tutorialStorageKey) {
        const savedTutorialStatus = getLocalStorageItem<boolean>(tutorialStorageKey, false);
        setTutorialCompleted(savedTutorialStatus);
    }
  }, [progressStorageKey, tutorialStorageKey]);

  const saveProgress = (newUnlockedLevels: Difficulty[]) => {
    if (progressStorageKey) {
      setUnlockedLevels(newUnlockedLevels)
      setLocalStorageItem(progressStorageKey, { unlockedLevels: newUnlockedLevels });
    }
  }

  const handleTutorialComplete = () => {
      if(tutorialStorageKey) {
        setLocalStorageItem(tutorialStorageKey, true);
        setTutorialCompleted(true);
      }
      setGameState("playing");
  }

  const startGame = (selectedDifficulty: Difficulty) => {
    if (!unlockedLevels.includes(selectedDifficulty)) {
      return
    }

    setDifficulty(selectedDifficulty)
    setScore(0)
    setTotalQuestions(difficultyConfig[selectedDifficulty].questions)
    
    if (selectedDifficulty === 'easy' && !tutorialCompleted) {
        setGameState("tutorial");
    } else {
        setGameState("playing")
    }
  }

  const finishGame = (finalScore: number) => {
    setScore(finalScore)

    const percentage = (finalScore / totalQuestions) * 100
    if (percentage >= 70) {
      const levels: Difficulty[] = ["easy", "intermediate", "advanced"]
      const currentIndex = levels.indexOf(difficulty)

      if (currentIndex < levels.length - 1) {
        const nextLevel = levels[currentIndex + 1]
        if (!unlockedLevels.includes(nextLevel)) {
          const newUnlockedLevels = [...unlockedLevels, nextLevel]
          saveProgress(newUnlockedLevels)
        }
      }
    }
    
    const allLevels = ["easy", "intermediate", "advanced"];
    const completedCount = allLevels.filter(l => unlockedLevels.includes(l as Difficulty)).length;
    let stars: 1 | 2 | 3 = 1;
    if (unlockedLevels.includes('advanced') && percentage >= 70) {
        stars = 3;
    } else if (unlockedLevels.includes('intermediate')) {
        stars = 2;
    }
    
    updateLessonProgress(lessonId, { completed: completedCount > 0, stars });

    setGameState("results")
  }

  const isLevelLocked = (level: Difficulty) => {
    return !unlockedLevels.includes(level)
  }

  if (gameState === "tutorial") {
    return <Tutorial onComplete={handleTutorialComplete} onExit={() => setGameState("menu")} />
  }

  if (gameState === "playing") {
    return (
      <GameLevel
        difficulty={difficulty}
        config={difficultyConfig[difficulty]}
        onComplete={finishGame}
        onExit={() => setGameState("menu")}
      />
    )
  }

  if (gameState === "results") {
    return (
      <Results
        score={score}
        total={totalQuestions}
        onPlayAgain={() => startGame(difficulty)}
        onMenuReturn={() => setGameState("menu")}
        onNextLevel={() => {
          const levels: Difficulty[] = ["easy", "intermediate", "advanced"]
          const currentIndex = levels.indexOf(difficulty)
          if (currentIndex < levels.length - 1) {
            const nextLevel = levels[currentIndex + 1]
            if (unlockedLevels.includes(nextLevel)) {
              startGame(nextLevel)
            } else {
              setGameState("menu")
            }
          } else {
            setGameState("menu")
          }
        }}
        canAdvance={score >= Math.ceil(totalQuestions * 0.7)}
        currentDifficulty={difficulty}
        hasNextLevel={
          difficulty !== "advanced" &&
          unlockedLevels.includes(
            ["easy", "intermediate", "advanced"][
              ["easy", "intermediate", "advanced"].indexOf(difficulty) + 1
            ] as Difficulty,
          )
        }
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-400 via-orange-400 to-yellow-400 p-4">
      <div className="max-w-4xl mx-auto">
         <div className="flex justify-start mb-4">
            <Button onClick={onGameExit} variant="ghost" className="text-white hover:bg-white/20">
                ← Salir
            </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4 drop-shadow-lg animate-slow-bounce">🧙‍♂️ Reto de Restas ✨</h1>
          <p className="text-lg sm:text-xl text-white/90 font-medium">¡Aprende a restar hasta 20 con deditos mágicos!</p>
        </div>

        <div className="grid gap-6 max-w-2xl mx-auto">
           <div className="grid gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-4">Elige tu Aventura</h2>

            {Object.entries(difficultyConfig).map(([key, config]) => {
              const isLocked = isLevelLocked(key as Difficulty)

              return (
                <Card
                  key={key}
                  className={`p-4 sm:p-6 backdrop-blur-sm shadow-xl transition-all duration-300 ${
                    isLocked
                      ? "bg-gray-400/50 cursor-not-allowed"
                      : "bg-white/95 hover:shadow-2xl hover:scale-105 cursor-pointer"
                  }`}
                  onClick={() => !isLocked && startGame(key as Difficulty)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${isLocked ? "bg-gray-400" : config.color}`}></div>
                      <div>
                        <h3 className={`text-lg sm:text-xl font-bold ${isLocked ? "text-gray-500" : "text-gray-800"}`}>
                          {config.name}
                          {isLocked && <Lock className="inline ml-2 h-4 w-4" />}
                        </h3>
                        <p className={`text-sm ${isLocked ? "text-gray-400" : "text-gray-600"}`}>
                          {config.questions} ejercicios • Restas hasta {config.maxNumber}
                        </p>
                        {isLocked && (
                          <p className="text-xs sm:text-sm text-gray-500 mt-1">Completa el nivel anterior</p>
                        )}
                      </div>
                    </div>
                    <div className={`text-2xl sm:text-3xl ${isLocked ? "grayscale" : ""}`}>
                      {key === "easy" && "🌟"}
                      {key === "intermediate" && "⭐"}
                      {key === "advanced" && "🏆"}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          <div className="text-center mt-6">
            <h3 className="text-white font-bold mb-2">Tu Progreso</h3>
            <div className="flex justify-center gap-2">
              {Object.keys(difficultyConfig).map((level) => (
                <div
                  key={level}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    unlockedLevels.includes(level as Difficulty) ? "bg-green-400 scale-125" : "bg-white/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-12 text-white/80">
          <p className="text-sm">¡Diviértete aprendiendo matemáticas! 🎉</p>
        </div>
      </div>
    </div>
  )
}
