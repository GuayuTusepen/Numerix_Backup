
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
type GamePhase = "classifying" | "counting"

interface DroppedObject extends GameObject {
  droppedInCategory?: string
  isCorrect?: boolean
}

interface CountAnswer {
  [categoryId: string]: {
    answer: number | null;
    isCorrect: boolean | null;
  }
}

const ClassifyAndCountGame: React.FC<Props> = ({ gameLevel, onLevelComplete }) => {
  const [gameState, setGameState] = useState<GameState>("welcome")
  const [gamePhase, setGamePhase] = useState<GamePhase>("classifying");
  const [objects, setObjects] = useState<DroppedObject[]>([])
  const [draggedObject, setDraggedObject] = useState<GameObject | null>(null)
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [showFeedback, setShowFeedback] = useState<string | null>(null)
  const [completedCategories, setCompletedCategories] = useState<Set<string>>(new Set())
  const [countAnswers, setCountAnswers] = useState<CountAnswer>({});

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const isValidGameLevel = gameLevel && gameLevel.objects && gameLevel.categories

  const handleLevelComplete =
    onLevelComplete ||
    ((result) => {
      console.log("Level completed:", result)
    })

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

      if (type === "success" || type === "error") {
        setShowFeedback(sounds[type])
        setTimeout(() => setShowFeedback(null), 1500)
      }
    },
    [soundEnabled],
  )

  const handleDragStart = (e: React.DragEvent, object: GameObject) => {
    setDraggedObject(object)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", object.id)
    const target = e.target as HTMLElement
    target.style.opacity = "0.5"
  }

  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.target as HTMLElement
    target.style.opacity = "1"
    setDraggedObject(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    const target = e.currentTarget as HTMLElement
    target.classList.add("ring-4", "ring-yellow-400", "scale-105")
  }

  const handleDragLeave = (e: React.DragEvent) => {
    const target = e.currentTarget as HTMLElement
    target.classList.remove("ring-4", "ring-yellow-400", "scale-105")
  }

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
    } else {
      playSound("error")
    }
  }

  useEffect(() => {
    if(gamePhase === 'classifying') {
        const allObjectsPlaced = objects.every((obj) => obj.droppedInCategory);
        if (allObjectsPlaced && objects.length > 0) {
            const allCorrect = objects.every((obj) => obj.isCorrect);
            if(allCorrect) {
                setShowFeedback("¡Todos clasificados! Ahora a contar...");
                setTimeout(() => {
                    setGamePhase('counting');
                    setShowFeedback(null);
                }, 2000);
            }
        }
    }
  }, [objects, gamePhase]);

  const resetObject = (objectId: string) => {
    setObjects((prev) =>
      prev.map((obj) => (obj.id === objectId ? { ...obj, droppedInCategory: undefined, isCorrect: undefined } : obj)),
    )
  }
  
  const handleCountAnswer = (categoryId: string, answer: number) => {
    const correctCount = gameLevel.objects.filter(obj => obj.type === categoryId).length;
    const isCorrect = answer === correctCount;
    
    setCountAnswers(prev => ({
        ...prev,
        [categoryId]: { answer, isCorrect }
    }));

    if(isCorrect) {
        playSound("success");
        setScore(prev => prev + 20); // Extra points for counting
    } else {
        playSound("error");
    }
    setAttempts(prev => prev + 1);
  }

  const checkCompletion = () => {
    const allCategoriesCounted = gameLevel.categories.every(cat => countAnswers[cat.id]?.answer !== null);
    if (!allCategoriesCounted) return;

    const allCountsCorrect = gameLevel.categories.every(cat => countAnswers[cat.id]?.isCorrect);
    
    if (allCountsCorrect) {
      playSound("complete");
      const totalPossibleAttempts = gameLevel.objects.length + gameLevel.categories.length;
      const efficiency = totalPossibleAttempts / attempts;
      let stars = 1;
      if (efficiency >= 0.9) stars = 3;
      else if (efficiency >= 0.7) stars = 2;

      setTimeout(() => {
        setGameState("completed");
        handleLevelComplete({ score, stars });
      }, 1500);
    } else {
       setShowFeedback("Algunos números no son correctos. ¡Revisa de nuevo!");
       setTimeout(() => setShowFeedback(null), 2000);
    }
  };


  const availableObjects = objects.filter((obj) => !obj.droppedInCategory)
  const getObjectsInCategory = (categoryId: string) => objects.filter((obj) => obj.droppedInCategory === categoryId)

  useEffect(() => {
    if (gameState === "playing" && isValidGameLevel) {
      const shuffledObjects = shuffleArray(gameLevel.objects)
      setObjects(shuffledObjects.map((obj) => ({ ...obj })))
      setScore(0)
      setAttempts(0)
      setCompletedCategories(new Set())
      setGamePhase('classifying');
      setCountAnswers({});
    }
  }, [gameLevel, gameState, isValidGameLevel])

  if (!isValidGameLevel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-200 via-orange-200 to-yellow-300 flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto shadow-2xl">
          <CardContent className="p-8 text-center space-y-4">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-red-600">Error de Configuración</h2>
            <p className="text-gray-700">No se pudo cargar el nivel del juego.</p>
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
                <li>1️⃣ Arrastra cada objeto a su categoría correcta.</li>
                <li>2️⃣ Cuando termines, cuenta cuántos objetos hay en cada caja.</li>
                <li>⭐ ¡Hazlo con pocos intentos para más estrellas!</li>
              </ul>
            </div>
            <div className="flex justify-center gap-4">
              <Button onClick={() => setGameState("playing")} className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-xl font-bold rounded-full shadow-lg transform hover:scale-105 transition-all">
                🚀 ¡Empezar a Jugar!
              </Button>
              <Button onClick={() => setSoundEnabled(!soundEnabled)} variant="outline" className="px-6 py-4 text-lg rounded-full">
                {soundEnabled ? "🔊" : "🔇"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (gameState === "completed") {
      const totalPossibleAttempts = gameLevel.objects.length + gameLevel.categories.length;
      const efficiency = totalPossibleAttempts > 0 ? totalPossibleAttempts / Math.max(attempts, totalPossibleAttempts) : 0;
      let stars = 1;
      if (efficiency >= 0.9) stars = 3;
      else if (efficiency >= 0.7) stars = 2;

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

      {showFeedback && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="bg-white px-8 py-4 rounded-full shadow-2xl border-4 border-yellow-400 animate-bounce">
            <span className="text-2xl font-bold">{showFeedback}</span>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {gamePhase === 'classifying' && (
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
        )}

        <div className={gamePhase === 'classifying' ? 'lg:col-span-2' : 'lg:col-span-3'}>
          <div className={`grid grid-cols-1 ${gameLevel.categories.length > 2 ? 'md:grid-cols-2' : 'md:grid-cols-1'} gap-4`}>
            {gameLevel.categories.map((category) => {
              const objectsInCategory = getObjectsInCategory(category.id);
              const isCounted = countAnswers[category.id]?.answer !== null;

              return (
                <Card key={category.id} className={`${category.color} border-4 transition-all duration-300`}>
                  <CardHeader>
                    <CardTitle className="text-center text-lg font-bold">
                      {category.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent
                    onDragOver={gamePhase === 'classifying' ? handleDragOver : undefined}
                    onDragEnter={gamePhase === 'classifying' ? handleDragEnter : undefined}
                    onDragLeave={gamePhase === 'classifying' ? handleDragLeave : undefined}
                    onDrop={gamePhase === 'classifying' ? (e) => handleDrop(e, category.id) : undefined}
                    className="min-h-[200px] border-2 border-dashed border-gray-400 rounded-lg p-4 transition-all duration-200"
                  >
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {objectsInCategory.map((object) => (
                        <div
                          key={object.id}
                          className={`p-3 rounded-lg text-center transition-all duration-300 ${
                            object.isCorrect
                              ? "bg-green-200 border-2 border-green-400"
                              : "bg-red-200 border-2 border-red-400 animate-pulse"
                          }`}
                        >
                          <div className="text-3xl mb-1">{object.asset}</div>
                          {!object.isCorrect && (
                            <Button onClick={() => resetObject(object.id)} size="sm" variant="outline" className="mt-1 text-xs h-6 w-6 p-0">
                              🔄
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    {gamePhase === 'classifying' && objectsInCategory.length === 0 && (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                          <div className="text-4xl mb-2">📦</div>
                          <p>Suelta aquí los {category.name.toLowerCase()}</p>
                        </div>
                      </div>
                    )}
                    {gamePhase === 'counting' && (
                        <div className="mt-4 pt-4 border-t-2 border-dashed border-gray-400">
                            <p className="font-bold text-center mb-2">¿Cuántos {category.name.toLowerCase()} hay?</p>
                            <div className="flex justify-center gap-2">
                                {category.countOptions.map(option => {
                                    const answerState = countAnswers[category.id];
                                    const isSelected = answerState?.answer === option;
                                    let buttonClass = 'bg-white hover:bg-gray-100';
                                    if(isSelected) {
                                        buttonClass = answerState.isCorrect ? 'bg-green-400' : 'bg-red-400';
                                    }
                                    return (
                                        <Button key={option} onClick={() => handleCountAnswer(category.id, option)} disabled={isCounted} className={buttonClass}>
                                            {option}
                                        </Button>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
           {gamePhase === 'counting' && (
                <div className="mt-6 flex justify-center">
                    <Button onClick={checkCompletion} size="lg" className="bg-green-500 hover:bg-green-600 text-white font-bold text-xl px-8 py-6 rounded-full">
                        ¡Revisar!
                    </Button>
                </div>
            )}
        </div>
      </div>
    </div>
  )
}

export default ClassifyAndCountGame;
