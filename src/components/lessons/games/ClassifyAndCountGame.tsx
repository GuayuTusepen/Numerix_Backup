
"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { GameObject, GameLevel } from "@/data/classifyAndCountGameData"

interface Props {
  gameLevel: GameLevel
  onLevelComplete: (result: { score: number; stars: number }) => void
}

type GameState = "welcome" | "playing" | "completed"

interface DroppedObject extends GameObject {
  droppedInCategory?: string
  isCorrect?: boolean
}

const ClassifyAndCountGame: React.FC<Props> = ({ gameLevel, onLevelComplete }) => {
  const [gameState, setGameState] = useState<GameState>("welcome")
  const [objects, setObjects] = useState<DroppedObject[]>([])
  const [draggedObject, setDraggedObject] = useState<GameObject | null>(null)
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [showFeedback, setShowFeedback] = useState<string | null>(null)
  const [completedCategories, setCompletedCategories] = useState<Set<string>>(new Set())

  // Función para mezclar array aleatoriamente (Fisher-Yates shuffle)
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // Add prop validation
  const isValidGameLevel = gameLevel && gameLevel.objects && gameLevel.categories

  const handleLevelComplete =
    onLevelComplete ||
    ((result) => {
      console.log("Level completed:", result)
    })

  // Simular sonidos (en una implementación real usarías Web Audio API)
  const playSound = useCallback(
    (type: "success" | "error" | "complete" | "drop") => {
      if (!soundEnabled) return

      const sounds = {
        success: "🎉 ¡Correcto!",
        error: "❌ Inténtalo de nuevo",
        complete: "🌟 ¡Nivel completado!",
        drop: "📦 Objeto soltado",
      }

      console.log(`🔊 ${sounds[type]}`)

      // Mostrar feedback visual
      if (type === "success" || type === "error") {
        setShowFeedback(sounds[type])
        setTimeout(() => setShowFeedback(null), 2000)
      }
    },
    [soundEnabled],
  )

  // Manejar inicio del arrastre
  const handleDragStart = (e: React.DragEvent, object: GameObject) => {
    setDraggedObject(object)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", object.id)

    // Añadir efecto visual al elemento arrastrado
    const target = e.target as HTMLElement
    target.style.opacity = "0.5"
  }

  // Manejar fin del arrastre
  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.target as HTMLElement
    target.style.opacity = "1"
    setDraggedObject(null)
  }

  // Permitir soltar en la zona de destino
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  // Manejar entrada en zona de destino
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    const target = e.currentTarget as HTMLElement
    target.classList.add("ring-4", "ring-yellow-400", "scale-105")
  }

  // Manejar salida de zona de destino
  const handleDragLeave = (e: React.DragEvent) => {
    const target = e.currentTarget as HTMLElement
    target.classList.remove("ring-4", "ring-yellow-400", "scale-105")
  }

  // Manejar soltar objeto
  const handleDrop = (e: React.DragEvent, categoryId: string) => {
    e.preventDefault()
    const target = e.currentTarget as HTMLElement
    target.classList.remove("ring-4", "ring-yellow-400", "scale-105")

    const objectId = e.dataTransfer.getData("text/plain")
    const droppedObject = objects.find((obj) => obj.id === objectId)

    if (!droppedObject || droppedObject.droppedInCategory) return

    playSound("drop")
    setAttempts((prev) => prev + 1)

    const isCorrect = droppedObject.type === categoryId

    setObjects((prev) =>
      prev.map((obj) => (obj.id === objectId ? { ...obj, droppedInCategory: categoryId, isCorrect } : obj)),
    )

    if (isCorrect) {
      setScore((prev) => prev + 10)
      playSound("success")

      // Verificar si la categoría está completa
      const categoryObjects = gameLevel.objects.filter((obj) => obj.type === categoryId)
      const droppedInCategory =
        objects.filter(
          (obj) => obj.type === categoryId && (obj.droppedInCategory === categoryId || obj.id === objectId),
        ).length

      if (droppedInCategory === categoryObjects.length) {
        setCompletedCategories((prev) => new Set([...prev, categoryId]))
      }
    } else {
      playSound("error")
    }
  }

  // Verificar si el juego está completado
  useEffect(() => {
    const allObjectsPlaced = objects.every((obj) => obj.droppedInCategory)
    const allCorrect = objects.every((obj) => obj.isCorrect)

    if (allObjectsPlaced && allCorrect && objects.length > 0) {
      playSound("complete")

      // Calcular estrellas basado en intentos
      const totalObjects = gameLevel.objects.length
      const efficiency = totalObjects / attempts
      let stars = 1
      if (efficiency >= 0.8) stars = 3
      else if (efficiency >= 0.6) stars = 2

      setTimeout(() => {
        setGameState("completed")
        handleLevelComplete({ score, stars })
      }, 1500)
    }
  }, [objects, attempts, score, gameLevel.objects.length, handleLevelComplete, playSound])

  // Reiniciar objeto mal colocado
  const resetObject = (objectId: string) => {
    setObjects((prev) =>
      prev.map((obj) => (obj.id === objectId ? { ...obj, droppedInCategory: undefined, isCorrect: undefined } : obj)),
    )
  }

  // Obtener objetos disponibles para arrastrar
  const availableObjects = objects.filter((obj) => !obj.droppedInCategory)

  // Obtener objetos en una categoría específica
  const getObjectsInCategory = (categoryId: string) => {
    return objects.filter((obj) => obj.droppedInCategory === categoryId)
  }

  useEffect(() => {
    if (gameState === "playing" && isValidGameLevel) {
      // Mezclar objetos aleatoriamente para mayor desafío
      const shuffledObjects = shuffleArray(gameLevel.objects)
      setObjects(shuffledObjects.map((obj) => ({ ...obj })))
      setScore(0)
      setAttempts(0)
      setCompletedCategories(new Set())
    }
  }, [gameLevel, gameState, isValidGameLevel])

  if (!isValidGameLevel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-200 via-orange-200 to-yellow-300 flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto shadow-2xl">
          <CardContent className="p-8 text-center space-y-4">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-red-600">Error de Configuración</h2>
            <p className="text-gray-700">No se pudo cargar el nivel del juego. Por favor, verifica la configuración.</p>
            <Button onClick={() => window.location.reload()} className="bg-blue-500 hover:bg-blue-600 text-white">
              🔄 Recargar Página
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (gameState === "welcome") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-pink-200 to-purple-300 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl mx-auto shadow-2xl border-4 border-primary">
          <CardHeader className="text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="text-4xl font-bold mb-2">🎯 ¡Clasifica y Cuenta! 🎯</CardTitle>
            <p className="text-xl">Nivel {gameLevel.level}</p>
          </CardHeader>
          <CardContent className="p-8 text-center space-y-6">
            <div className="text-6xl mb-4">🎮</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">¡Hola pequeño explorador! 👋</h2>
            <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
              <p className="text-lg text-gray-700 mb-4">
                <strong>¿Cómo jugar?</strong>
              </p>
              <ul className="text-left space-y-2 text-gray-600">
                <li>🖱️ Arrastra cada objeto a su categoría correcta</li>
                <li>🎯 Clasifica todos los objetos para ganar</li>
                <li>⭐ ¡Hazlo con pocos intentos para más estrellas!</li>
                <li>🔊 Puedes silenciar los sonidos si quieres</li>
              </ul>
            </div>
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => setGameState("playing")}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-xl font-bold rounded-full shadow-lg transform hover:scale-105 transition-all"
              >
                🚀 ¡Empezar a Jugar!
              </Button>
              <Button
                onClick={() => setSoundEnabled(!soundEnabled)}
                variant="outline"
                className="px-6 py-4 text-lg rounded-full"
              >
                {soundEnabled ? "🔊" : "🔇"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (gameState === "completed") {
      const totalObjects = gameLevel.objects.length;
      const efficiency = totalObjects > 0 ? totalObjects / Math.max(attempts, totalObjects) : 0;
      let stars = 1;
      if (efficiency === 1) stars = 3;
      else if (efficiency >= 0.75) stars = 2;


    return (
      <div className="min-h-screen bg-gradient-to-br from-green-200 via-blue-200 to-purple-300 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl mx-auto shadow-2xl">
          <CardContent className="p-8 text-center space-y-6">
            <div className="text-8xl mb-4">🎉</div>
            <h2 className="text-4xl font-bold text-green-600 mb-4">¡Felicitaciones!</h2>
            <p className="text-xl text-gray-700">Has completado el Nivel {gameLevel.level}</p>
            <div className="bg-yellow-50 p-6 rounded-xl border-2 border-yellow-200">
              <div className="flex justify-center mb-4">
                {[...Array(3)].map((_, i) => (
                  <span key={i} className="text-4xl">
                    {i < stars ? "⭐" : "☆"}
                  </span>
                ))}
              </div>
              <p className="text-2xl font-bold text-yellow-600">Puntuación: {score} puntos</p>
              <p className="text-lg text-gray-600">Intentos: {attempts}</p>
            </div>
             <Button
              onClick={() => onLevelComplete({score, stars})}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 text-xl font-bold rounded-full"
            >
              Volver a Niveles
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4">
      {/* Header del juego */}
      <div className="max-w-6xl mx-auto mb-6">
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Nivel {gameLevel.level} 🎯</h1>
                <div className="bg-blue-100 px-4 py-2 rounded-full">
                  <span className="font-bold text-blue-800">Puntos: {score}</span>
                </div>
                <div className="bg-purple-100 px-4 py-2 rounded-full">
                  <span className="font-bold text-purple-800">Intentos: {attempts}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setSoundEnabled(!soundEnabled)} variant="outline" size="sm">
                  {soundEnabled ? "🔊" : "🔇"}
                </Button>
                <Button onClick={() => onLevelComplete({ score: 0, stars: 0 })} variant="outline" size="sm">
                  🏠 Volver a Niveles
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feedback visual */}
      {showFeedback && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="bg-white px-8 py-4 rounded-full shadow-2xl border-4 border-yellow-400 animate-bounce">
            <span className="text-2xl font-bold">{showFeedback}</span>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Área de objetos disponibles */}
        <div className="lg:col-span-1">
          <Card className="h-full bg-white/90 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="text-center text-xl font-bold text-gray-800">🎒 Objetos para Clasificar</CardTitle>
              <p className="text-center text-sm text-gray-600">Arrastra cada objeto a su categoría</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {availableObjects.map((object) => (
                  <div
                    key={object.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, object)}
                    onDragEnd={handleDragEnd}
                    className="bg-gradient-to-br from-yellow-200 to-orange-200 p-4 rounded-xl border-2 border-yellow-400 cursor-grab active:cursor-grabbing hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-center"
                  >
                    <div className="text-4xl mb-2">{object.asset}</div>
                    <div className="text-sm font-semibold text-gray-700">{object.name}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Área de categorías */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gameLevel.categories.map((category) => {
              const objectsInCategory = getObjectsInCategory(category.id)
              const isCompleted = completedCategories.has(category.id)

              return (
                <Card
                  key={category.id}
                  className={`${category.color} border-4 transition-all duration-300 ${
                    isCompleted ? "ring-4 ring-green-400 shadow-2xl" : ""
                  }`}
                >
                  <CardHeader>
                    <CardTitle className="text-center text-lg font-bold">
                      {isCompleted && "✅ "}
                      {category.name}
                      <div className="text-sm font-normal mt-1">({objectsInCategory.length} objetos)</div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, category.id)}
                    className="min-h-[200px] border-2 border-dashed border-gray-400 rounded-lg p-4 transition-all duration-200"
                  >
                    <div className="grid grid-cols-3 gap-2">
                      {objectsInCategory.map((object) => (
                        <div
                          key={object.id}
                          className={`p-3 rounded-lg text-center transition-all duration-300 ${
                            object.isCorrect
                              ? "bg-green-200 border-2 border-green-400 shadow-lg"
                              : "bg-red-200 border-2 border-red-400 animate-pulse"
                          }`}
                        >
                          <div className="text-3xl mb-1">{object.asset}</div>
                          <div className="text-xs font-semibold">{object.name}</div>
                          {!object.isCorrect && (
                            <Button
                              onClick={() => resetObject(object.id)}
                              size="sm"
                              variant="outline"
                              className="mt-2 text-xs"
                            >
                              🔄
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>

                    {objectsInCategory.length === 0 && (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                          <div className="text-4xl mb-2">📦</div>
                          <p>Suelta aquí los {category.name.toLowerCase()} </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="max-w-6xl mx-auto mt-6">
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Progreso</span>
              <span className="text-sm text-gray-600">
                {objects.filter((obj) => obj.droppedInCategory).length} / {gameLevel.objects.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full transition-all duration-500"
                style={{
                  width: `${(objects.filter((obj) => obj.droppedInCategory).length / gameLevel.objects.length) * 100}%`,
                }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ClassifyAndCountGame

    