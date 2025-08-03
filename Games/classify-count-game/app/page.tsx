"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ClassifyAndCountGame from "@/src/components/lessons/games/ClassifyAndCountGame"
import { classifyAndCountGameData } from "@/src/data/classifyAndCountGameData"

export default function GameDemo() {
  const [currentLevel, setCurrentLevel] = useState(0)
  const [showGame, setShowGame] = useState(false)
  const [completedLevels, setCompletedLevels] = useState<number[]>([])

  const [notification, setNotification] = useState<{
    show: boolean
    level: number
    score: number
    stars: number
  } | null>(null)

  const handleLevelComplete = (result: { score: number; stars: number }) => {
    console.log(`Nivel ${currentLevel + 1} completado:`, result)

    // Marcar nivel como completado
    if (!completedLevels.includes(currentLevel)) {
      setCompletedLevels((prev) => [...prev, currentLevel])
    }

    // Mostrar notificación personalizada
    setNotification({
      show: true,
      level: currentLevel + 1,
      score: result.score,
      stars: result.stars,
    })

    // Volver al menú principal
    setShowGame(false)

    // Ocultar notificación después de 5 segundos
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const startLevel = (levelIndex: number) => {
    setCurrentLevel(levelIndex)
    setShowGame(true)
  }

  if (showGame) {
    return (
      <ClassifyAndCountGame gameLevel={classifyAndCountGameData[currentLevel]} onLevelComplete={handleLevelComplete} />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header simplificado */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Drag and Drop</h1>
        </div>

        {/* Notificación de nivel completado */}
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
                        <span key={i} className="text-2xl">
                          {i < notification.stars ? "⭐" : "☆"}
                        </span>
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

        {/* Selector de Niveles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {classifyAndCountGameData.map((level, index) => {
            const isCompleted = completedLevels.includes(index)
            const isLocked = index > 0 && !completedLevels.includes(index - 1)

            return (
              <Card
                key={level.level}
                className={`shadow-lg transition-all duration-300 hover:shadow-2xl ${
                  isCompleted
                    ? "bg-green-100 border-4 border-green-400"
                    : isLocked
                      ? "bg-gray-100 border-2 border-gray-300 opacity-60"
                      : "bg-white border-4 border-blue-300 hover:border-blue-500"
                }`}
              >
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold">
                    {isCompleted && "✅ "}
                    {isLocked && "🔒 "}
                    Nivel {level.level}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="text-4xl mb-2">
                    {level.level === 1 && "🐕🧸"}
                    {level.level === 2 && "🦁🧩🍎"}
                    {level.level === 3 && "🐅🤖🍍🚌"}
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <strong>Objetos:</strong> {level.objects.length}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Categorías:</strong> {level.categories.length}
                    </p>
                    <div className="flex flex-wrap justify-center gap-1">
                      {level.categories.map((category) => (
                        <span
                          key={category.id}
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${category.color}`}
                        >
                          {category.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={() => startLevel(index)}
                    disabled={isLocked}
                    className={`w-full font-bold text-lg py-3 rounded-full transition-all ${
                      isCompleted
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : isLocked
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600 text-white hover:scale-105"
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
  )
}
