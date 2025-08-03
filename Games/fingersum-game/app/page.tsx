"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Volume2, VolumeX, Play, Lock } from "lucide-react"
import Tutorial from "@/components/tutorial"
import GameLevel from "@/components/game-level"
import Results from "@/components/results"

type GameState = "menu" | "tutorial" | "playing" | "results"
type Difficulty = "easy" | "intermediate" | "advanced"

export default function FingerSumGame() {
  const [gameState, setGameState] = useState<GameState>("menu")
  const [difficulty, setDifficulty] = useState<Difficulty>("easy")
  const [musicEnabled, setMusicEnabled] = useState(false)
  const [score, setScore] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [unlockedLevels, setUnlockedLevels] = useState<Difficulty[]>(["easy"]) // Solo fácil desbloqueado inicialmente

  const difficultyConfig = {
    easy: { name: "Fácil", questions: 5, maxNumber: 10, color: "bg-green-500" },
    intermediate: { name: "Intermedio", questions: 7, maxNumber: 15, color: "bg-yellow-500" },
    advanced: { name: "Avanzado", questions: 10, maxNumber: 20, color: "bg-red-500" },
  }

  // Cargar progreso del localStorage al iniciar
  useEffect(() => {
    const savedProgress = localStorage.getItem("fingersum-progress")
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress)
        setUnlockedLevels(progress.unlockedLevels || ["easy"])
      } catch (error) {
        console.error("Error loading progress:", error)
      }
    }
  }, [])

  // Guardar progreso en localStorage
  const saveProgress = (newUnlockedLevels: Difficulty[]) => {
    setUnlockedLevels(newUnlockedLevels)
    localStorage.setItem(
      "fingersum-progress",
      JSON.stringify({
        unlockedLevels: newUnlockedLevels,
      }),
    )
  }

  const startGame = (selectedDifficulty: Difficulty) => {
    if (!unlockedLevels.includes(selectedDifficulty)) {
      return // No permitir jugar niveles bloqueados
    }

    setDifficulty(selectedDifficulty)
    setScore(0)
    setTotalQuestions(difficultyConfig[selectedDifficulty].questions)
    setGameState("playing")
  }

  const finishGame = (finalScore: number) => {
    setScore(finalScore)

    // Desbloquear siguiente nivel si se obtiene al menos 70% de aciertos
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

    setGameState("results")
  }

  const toggleMusic = () => {
    setMusicEnabled(!musicEnabled)
    // In a real implementation, this would control background music
  }

  const isLevelLocked = (level: Difficulty) => {
    return !unlockedLevels.includes(level)
  }

  if (gameState === "tutorial") {
    return <Tutorial onComplete={() => setGameState("menu")} />
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
        onPlayAgain={() => setGameState("menu")}
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
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg animate-bounce">🧙‍♂️ FingerSum ✨</h1>
          <p className="text-xl text-white/90 font-medium">¡Aprende a sumar hasta 20 con deditos mágicos!</p>
        </div>

        {/* Music Control */}
        <div className="flex justify-end mb-4">
          <Button
            onClick={toggleMusic}
            variant="outline"
            size="icon"
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            {musicEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
        </div>

        {/* Main Menu */}
        <div className="grid gap-6 max-w-2xl mx-auto">
          {/* Tutorial Button - Siempre disponible */}
          <Card className="p-6 bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="text-center">
              <div className="text-4xl mb-4">🎓</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Tutorial</h2>
              <p className="text-gray-600 mb-4">Aprende cómo jugar con el Mago Suma</p>
              <Button
                onClick={() => setGameState("tutorial")}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg font-semibold rounded-full"
              >
                <Play className="mr-2 h-5 w-5" />
                Comenzar Tutorial
              </Button>
            </div>
          </Card>

          {/* Difficulty Levels */}
          <div className="grid gap-4">
            <h2 className="text-3xl font-bold text-white text-center mb-4">Elige tu nivel</h2>

            {Object.entries(difficultyConfig).map(([key, config]) => {
              const isLocked = isLevelLocked(key as Difficulty)

              return (
                <Card
                  key={key}
                  className={`p-6 backdrop-blur-sm shadow-xl transition-all duration-300 ${
                    isLocked
                      ? "bg-gray-400/50 cursor-not-allowed"
                      : "bg-white/95 hover:shadow-2xl hover:scale-105 cursor-pointer"
                  }`}
                  onClick={() => !isLocked && startGame(key as Difficulty)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-4 h-4 rounded-full ${isLocked ? "bg-gray-400" : config.color}`}></div>
                      <div>
                        <h3 className={`text-xl font-bold ${isLocked ? "text-gray-500" : "text-gray-800"}`}>
                          {config.name}
                          {isLocked && <Lock className="inline ml-2 h-4 w-4" />}
                        </h3>
                        <p className={`${isLocked ? "text-gray-400" : "text-gray-600"}`}>
                          {config.questions} ejercicios • Sumas hasta {config.maxNumber}
                        </p>
                        {isLocked && (
                          <p className="text-sm text-gray-500 mt-1">Completa el nivel anterior para desbloquear</p>
                        )}
                      </div>
                    </div>
                    <div className={`text-3xl ${isLocked ? "grayscale" : ""}`}>
                      {key === "easy" && "🌟"}
                      {key === "intermediate" && "⭐"}
                      {key === "advanced" && "🏆"}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Progress Indicator */}
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

        {/* Footer */}
        <div className="text-center mt-12 text-white/80">
          <p className="text-sm">¡Diviértete aprendiendo matemáticas! 🎉</p>
        </div>
      </div>
    </div>
  )
}
