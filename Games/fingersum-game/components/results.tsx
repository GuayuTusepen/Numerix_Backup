"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Home, RotateCcw, ChevronRight } from "lucide-react"

interface ResultsProps {
  score: number
  total: number
  onPlayAgain: () => void
  onNextLevel: () => void
  canAdvance: boolean
  currentDifficulty: string
  hasNextLevel?: boolean
}

export default function Results({
  score,
  total,
  onPlayAgain,
  onNextLevel,
  canAdvance,
  currentDifficulty,
  hasNextLevel = false,
}: ResultsProps) {
  const percentage = Math.round((score / total) * 100)
  const isExcellent = percentage >= 90
  const isGood = percentage >= 70
  const needsImprovement = percentage < 70

  const getResultMessage = () => {
    if (isExcellent) {
      return {
        emoji: "🏆",
        title: "¡Excelente trabajo!",
        message: "¡Eres un genio de las matemáticas!",
        color: "text-yellow-600",
      }
    } else if (isGood) {
      return {
        emoji: "🌟",
        title: "¡Muy bien!",
        message: "¡Estás aprendiendo súper rápido!",
        color: "text-green-600",
      }
    } else {
      return {
        emoji: "💪",
        title: "¡Sigue practicando!",
        message: "¡Cada intento te hace más fuerte!",
        color: "text-blue-600",
      }
    }
  }

  const result = getResultMessage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-400 to-purple-400 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Resultados</h1>
          <div className="text-white/80 capitalize">{currentDifficulty}</div>
        </div>

        {/* Results Card */}
        <Card className="p-8 bg-white/95 backdrop-blur-sm shadow-2xl text-center">
          {/* Result Animation */}
          <div className="mb-6">
            <div className="text-8xl mb-4 animate-bounce">{result.emoji}</div>
            <div className="text-6xl animate-pulse">✨</div>
          </div>

          {/* Score Display */}
          <div className="mb-6">
            <div className="text-6xl font-bold text-gray-800 mb-2">
              {score}/{total}
            </div>
            <div className="text-2xl font-semibold text-gray-600 mb-4">{percentage}% correcto</div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div
                className={`h-4 rounded-full transition-all duration-1000 ${
                  isExcellent ? "bg-yellow-500" : isGood ? "bg-green-500" : "bg-blue-500"
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* Result Message */}
          <div className="mb-8">
            <h2 className={`text-3xl font-bold mb-2 ${result.color}`}>{result.title}</h2>
            <p className="text-xl text-gray-600">{result.message}</p>

            {/* Level unlock message */}
            {canAdvance && hasNextLevel && (
              <div className="mt-4 p-4 bg-green-100 rounded-lg">
                <p className="text-green-700 font-semibold">🎉 ¡Has desbloqueado el siguiente nivel!</p>
              </div>
            )}
          </div>

          {/* Stars Display */}
          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3].map((star) => (
              <div
                key={star}
                className={`text-4xl transition-all duration-500 ${
                  star <= Math.ceil((percentage / 100) * 3) ? "text-yellow-400 animate-pulse" : "text-gray-300"
                }`}
                style={{ animationDelay: `${star * 0.2}s` }}
              >
                ⭐
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="grid gap-4">
            <Button
              onClick={onPlayAgain}
              className="bg-blue-500 hover:bg-blue-600 text-white py-3 text-lg font-semibold rounded-full"
            >
              <RotateCcw className="mr-2 h-5 w-5" />
              Jugar de Nuevo
            </Button>

            {canAdvance && hasNextLevel && (
              <Button
                onClick={onNextLevel}
                className="bg-green-500 hover:bg-green-600 text-white py-3 text-lg font-semibold rounded-full"
              >
                Siguiente Nivel
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            )}

            <Button
              onClick={onPlayAgain}
              variant="outline"
              className="py-3 text-lg font-semibold rounded-full bg-transparent"
            >
              <Home className="mr-2 h-5 w-5" />
              Menú Principal
            </Button>
          </div>
        </Card>

        {/* Wizard Congratulations */}
        <div className="text-center mt-8">
          <div className="text-6xl animate-bounce">🧙‍♂️</div>
          <div className="text-white font-bold text-xl mt-2">
            {isExcellent && "¡Eres increíble! 🎉"}
            {isGood && !isExcellent && "¡Buen trabajo! 👏"}
            {needsImprovement && "¡Sigue practicando! 💪"}
          </div>
        </div>
      </div>
    </div>
  )
}
