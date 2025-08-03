
"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { GameObject, GameLevel, GameCategory } from "@/data/classifyAndCountGameData"
import { Volume2, ChevronRight, VolumeX } from "lucide-react"
import { cn } from "@/lib/utils"


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

// Función para generar una configuración de nivel aleatoria
const generateRandomLevelSetup = (levelTemplate: GameLevel): { objects: GameObject[], categories: GameCategory[] } => {
    const newObjects: GameObject[] = [];
    const newCategories: GameCategory[] = [...levelTemplate.categories];

    levelTemplate.categories.forEach(category => {
        const categoryObjects = levelTemplate.objects.filter(obj => obj.type === category.id);
        // Random count between 2 and max available, but at least 2
        const count = Math.floor(Math.random() * (categoryObjects.length - 2 + 1)) + 2;
        
        // Shuffle and pick objects
        const shuffled = [...categoryObjects].sort(() => 0.5 - Math.random());
        newObjects.push(...shuffled.slice(0, count));
    });

    return { objects: newObjects, categories: newCategories };
};


const ClassifyAndCountGame: React.FC<Props> = ({ gameLevel: levelTemplate, onLevelComplete }) => {
  const [gameState, setGameState] = useState<GameState>("welcome")
  const [gamePhase, setGamePhase] = useState<GamePhase>("classifying");
  
  // State for the current randomized level
  const [currentLevel, setCurrentLevel] = useState(levelTemplate);

  const [objects, setObjects] = useState<DroppedObject[]>([])
  const [draggedObject, setDraggedObject] = useState<GameObject | null>(null)
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [showFeedback, setShowFeedback] = useState<string | null>(null)
  
  const [countingCategoryIndex, setCountingCategoryIndex] = useState(0);
  const [countAnswers, setCountAnswers] = useState<CountAnswer>({});
  
  // State to prevent repeat audio triggers
  const [isTransitioning, setIsTransitioning] = useState(false);


  const audioRef = useRef<HTMLAudioElement | null>(null);
  const initialVolume = 0.5; // Volumen normal de la música
  const duckedVolume = 0.1; // Volumen de la música cuando habla el narrador
  
  // Refs for touch drag and drop
  const draggedItemRef = useRef<HTMLDivElement | null>(null);
  const dropZonesRef = useRef<Map<string, HTMLDivElement | null>>(new Map());

  useEffect(() => {
    // This effect runs only once on the client side
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('/sounds/Drag and Dorp funny sound.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = initialVolume;
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
  
    if (gameState === 'playing' && soundEnabled) {
      audio.play().catch(e => console.error("Error al reproducir música:", e));
    } else {
      audio.pause();
    }
  }, [gameState, soundEnabled]);


  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const isValidGameLevel = currentLevel && currentLevel.objects && currentLevel.categories

  const handleLevelComplete =
    onLevelComplete ||
    ((result) => {
      console.log("Level completed:", result)
    })
  
  const speak = useCallback((text: string) => {
    if (soundEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.9;
      
      if (audioRef.current) {
        audioRef.current.volume = duckedVolume;
      }

      utterance.onend = () => {
        if (audioRef.current) {
          audioRef.current.volume = initialVolume;
        }
      };
      
      window.speechSynthesis.speak(utterance);
    }
  }, [soundEnabled]);

  const playSound = useCallback(
    (type: "success" | "error" | "complete" | "drop" | "info", text?: string) => {
      if (!soundEnabled) return

      const sounds = {
        success: "¡Correcto!",
        error: "Inténtalo de nuevo",
        complete: "¡Nivel completado!",
        drop: "",
        info: text || "",
      }
      
      const message = sounds[type];
      console.log(`🔊 ${message}`);
      if (message) speak(message);

      if (type === "success" || type === "error" || type === 'info') {
        setShowFeedback(message)
        setTimeout(() => setShowFeedback(null), 1500)
      }
    },
    [soundEnabled, speak],
  )

    // --- Drag and Drop Logic (Mouse) ---
  const handleDragStart = (e: React.DragEvent, object: GameObject) => {
    setDraggedObject(object)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", object.id);
    (e.target as HTMLElement).style.opacity = "0.5";
  }

  const handleDragEnd = (e: React.DragEvent) => {
    (e.target as HTMLElement).style.opacity = "1";
    setDraggedObject(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).classList.add("ring-4", "ring-yellow-400", "scale-105");
  }

  const handleDragLeave = (e: React.DragEvent) => {
    (e.currentTarget as HTMLElement).classList.remove("ring-4", "ring-yellow-400", "scale-105");
  }

  const handleDrop = (e: React.DragEvent, categoryId: string) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).classList.remove("ring-4", "ring-yellow-400", "scale-105");
    const objectId = e.dataTransfer.getData("text/plain");
    processDrop(objectId, categoryId);
  }

    // --- Touch Drag and Drop Logic ---
  const handleTouchStart = (e: React.TouchEvent, object: GameObject) => {
    setDraggedObject(object);
    const target = e.currentTarget as HTMLDivElement;
    draggedItemRef.current = target;

    target.style.opacity = '0.5';
    target.style.transform = 'scale(1.1)';
    target.style.zIndex = '1000';
  }
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!draggedItemRef.current || !draggedObject) return;
    e.preventDefault();

    const touch = e.touches[0];
    const item = draggedItemRef.current;
    
    item.style.position = 'fixed';
    item.style.left = `${touch.clientX - item.offsetWidth / 2}px`;
    item.style.top = `${touch.clientY - item.offsetHeight / 2}px`;

    dropZonesRef.current.forEach((zone) => {
        if (zone) {
            const rect = zone.getBoundingClientRect();
            if (touch.clientX > rect.left && touch.clientX < rect.right && touch.clientY > rect.top && touch.clientY < rect.bottom) {
                zone.classList.add("ring-4", "ring-yellow-400", "scale-105");
            } else {
                zone.classList.remove("ring-4", "ring-yellow-400", "scale-105");
            }
        }
    });
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!draggedItemRef.current || !draggedObject) return;

    const touch = e.changedTouches[0];
    let droppedOnCategoryId: string | null = null;
    
    dropZonesRef.current.forEach((zone, categoryId) => {
        if(zone) {
            const rect = zone.getBoundingClientRect();
            if (touch.clientX > rect.left && touch.clientX < rect.right && touch.clientY > rect.top && touch.clientY < rect.bottom) {
                droppedOnCategoryId = categoryId;
            }
            zone.classList.remove("ring-4", "ring-yellow-400", "scale-105");
        }
    });

    if (droppedOnCategoryId) {
        processDrop(draggedObject.id, droppedOnCategoryId);
    }

    const item = draggedItemRef.current;
    item.style.opacity = '1';
    item.style.transform = 'scale(1)';
    item.style.zIndex = 'auto';
    item.style.position = 'static';
    
    draggedItemRef.current = null;
    setDraggedObject(null);
  }
  
  // --- Unified Drop Processing Logic ---
  const processDrop = (objectId: string, categoryId: string) => {
    const droppedObject = objects.find((obj) => obj.id === objectId);
    if (!droppedObject || droppedObject.droppedInCategory) return;

    playSound("drop");
    setAttempts((prev) => prev + 1);
    const isCorrect = droppedObject.type === categoryId;

    setObjects((prev) =>
      prev.map((obj) => (obj.id === objectId ? { ...obj, droppedInCategory: categoryId, isCorrect } : obj))
    );

    if (isCorrect) {
      setScore((prev) => prev + 10);
      playSound("success");
    } else {
      playSound("error");
    }
  };


  useEffect(() => {
    if(gamePhase === 'classifying' && !isTransitioning) {
        const allObjectsPlaced = objects.every((obj) => obj.droppedInCategory);
        if (allObjectsPlaced && objects.length > 0) {
            const allCorrect = objects.every((obj) => obj.isCorrect);
            if(allCorrect) {
                setIsTransitioning(true); // Lock to prevent re-trigger
                playSound("info", "¡Todos clasificados! Ahora, a contar.");
                setTimeout(() => {
                    setGamePhase('counting');
                    setShowFeedback(null);
                    setIsTransitioning(false); // Unlock after transition
                }, 2000);
            }
        }
    }
  }, [objects, gamePhase, playSound, isTransitioning]);

  const resetObject = (objectId: string) => {
    setObjects((prev) =>
      prev.map((obj) => (obj.id === objectId ? { ...obj, droppedInCategory: undefined, isCorrect: undefined } : obj)),
    )
  }
  
  const handleCountAnswer = (categoryId: string, answer: number) => {
    if (countAnswers[categoryId]?.isCorrect) return;

    const correctCount = objects.filter(obj => obj.type === categoryId).length;
    const isCorrect = answer === correctCount;
    
    setCountAnswers(prev => ({
        ...prev,
        [categoryId]: { answer, isCorrect }
    }));

    if(isCorrect) {
        const category = currentLevel.categories.find(c => c.id === categoryId);
        playSound("success", `¡Correcto! Hay ${answer} ${category?.name.toLowerCase()}.`);
        setScore(prev => prev + 20);
        
        setTimeout(() => {
            if (countingCategoryIndex < currentLevel.categories.length - 1) {
                setCountingCategoryIndex(prev => prev + 1);
            }
        }, 2000);

    } else {
        playSound("error");
        setAttempts(prev => prev + 1);
    }
  }

  const checkCompletion = useCallback(() => {
    if (isTransitioning) return; // Prevent completion check during other transitions
    
    const allCountsCorrect = currentLevel.categories.every(cat => {
        const correctCount = objects.filter(obj => obj.type === cat.id).length;
        return countAnswers[cat.id]?.answer === correctCount;
    });

    if (allCountsCorrect) {
        setIsTransitioning(true); // Lock to prevent re-trigger
        playSound("complete");
        const totalPossibleAttempts = currentLevel.objects.length + currentLevel.categories.length;
        const efficiency = totalPossibleAttempts > 0 ? totalPossibleAttempts / Math.max(attempts, totalPossibleAttempts) : 0;
        let stars = 1;
        if (efficiency >= 0.9) stars = 3;
        else if (efficiency >= 0.7) stars = 2;

        setTimeout(() => {
            setGameState("completed");
            handleLevelComplete({ score, stars });
            setIsTransitioning(false); // Unlock
        }, 1500);
    }
  }, [attempts, countAnswers, currentLevel, handleLevelComplete, objects, playSound, score, isTransitioning]);


  useEffect(() => {
    if (gamePhase === 'counting') {
      const allCategories = currentLevel.categories;
      const allAnsweredCorrectly = allCategories.every(cat => countAnswers[cat.id]?.isCorrect);
      
      if (allCategories.length > 0 && allAnsweredCorrectly) {
        checkCompletion();
      }
    }
  }, [countAnswers, gamePhase, currentLevel.categories, checkCompletion]);

  const availableObjects = objects.filter((obj) => !obj.droppedInCategory)
  const getObjectsInCategory = (categoryId: string) => objects.filter((obj) => obj.droppedInCategory === categoryId)

  const initializeLevel = useCallback(() => {
    const setup = generateRandomLevelSetup(levelTemplate);
    setCurrentLevel(setup);
    const shuffledObjects = shuffleArray(setup.objects);
    setObjects(shuffledObjects.map((obj) => ({ ...obj })));
    setScore(0);
    setAttempts(setup.objects.length);
    setGamePhase('classifying');
    setCountAnswers({});
    setCountingCategoryIndex(0);
    setIsTransitioning(false);
  }, [levelTemplate]);
  
  useEffect(() => {
    if (gameState === "playing") {
      initializeLevel();
    }
  }, [gameState, initializeLevel]);


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
          <CardHeader className="text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg p-4">
            <CardTitle className="text-2xl md:text-4xl font-bold mb-1">🎯 ¡Clasifica y Cuenta! 🎯</CardTitle>
            <p className="text-lg md:text-xl">Nivel {currentLevel.level}</p>
          </CardHeader>
          <CardContent className="p-6 md:p-8 text-center space-y-4">
            <div className="text-5xl md:text-6xl mb-2">🎮</div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">¡Hola explorador! 👋</h2>
            <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-200">
              <p className="text-md font-bold text-gray-700 mb-2">¿Cómo jugar?</p>
              <ul className="text-left text-sm space-y-1 text-gray-600">
                <li>1️⃣ Arrastra cada objeto a su categoría correcta.</li>
                <li>2️⃣ Cuando termines, cuenta cuántos objetos hay en cada caja.</li>
                <li>⭐ ¡Hazlo con pocos intentos para más estrellas!</li>
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button onClick={() => setGameState("playing")} className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 text-lg font-bold rounded-full shadow-lg transform hover:scale-105 transition-all">
                🚀 ¡Empezar a Jugar!
              </Button>
              <Button onClick={() => setSoundEnabled(!soundEnabled)} variant="outline" className="px-5 py-3 text-lg rounded-full">
                {soundEnabled ? "🔊" : "🔇"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (gameState === "completed") {
      const totalPossibleAttempts = currentLevel.objects.length + currentLevel.categories.length;
      const efficiency = totalPossibleAttempts > 0 ? totalPossibleAttempts / Math.max(attempts, totalPossibleAttempts) : 0;
      let stars = 1;
      if (efficiency >= 0.9) stars = 3;
      else if (efficiency >= 0.7) stars = 2;

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-200 via-blue-200 to-purple-300 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl mx-auto shadow-2xl">
          <CardContent className="p-6 md:p-8 text-center space-y-4">
            <div className="text-7xl md:text-8xl mb-2">🎉</div>
            <h2 className="text-3xl md:text-4xl font-bold text-green-600 mb-2">¡Felicitaciones!</h2>
            <p className="text-lg text-gray-700">Has completado el Nivel {currentLevel.level}</p>
            <div className="bg-yellow-50 p-4 rounded-xl border-2 border-yellow-200">
              <div className="flex justify-center mb-2">
                {[...Array(3)].map((_, i) => (
                  <span key={i} className="text-3xl md:text-4xl">
                    {i < stars ? "⭐" : "☆"}
                  </span>
                ))}
              </div>
              <p className="text-xl md:text-2xl font-bold text-yellow-600">Puntuación: {score} puntos</p>
              <p className="text-md text-gray-600">Intentos: {attempts}</p>
            </div>
             <Button
              onClick={() => onLevelComplete({score, stars})}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg font-bold rounded-full"
            >
              Volver a Niveles
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-2 sm:p-4">
      <div className="max-w-6xl mx-auto mb-4">
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
          <CardContent className="p-3 sm:p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 sm:gap-4">
                <h1 className="text-lg sm:text-2xl font-bold text-gray-800">Nivel {currentLevel.level} 🎯</h1>
                <div className="bg-blue-100 px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm">
                  <span className="font-bold text-blue-800">Puntos: {score}</span>
                </div>
              </div>
              <div className="flex gap-2">
                 <Button onClick={() => setSoundEnabled(!soundEnabled)} variant="outline" size="sm">
                  {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </Button>
                <Button onClick={() => onLevelComplete({ score: 0, stars: 0 })} variant="outline" size="sm" className="text-xs sm:text-sm">
                  🏠 Salir
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {showFeedback && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-white px-4 py-2 text-base sm:px-8 sm:py-4 sm:text-2xl rounded-full shadow-2xl border-4 border-yellow-400 animate-bounce">
            <span className="font-bold">{showFeedback}</span>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4">
        {gamePhase === 'classifying' && (
          <div className="lg:col-span-1">
            <Card className="h-full bg-white/90 backdrop-blur-sm shadow-lg">
              <CardHeader className="p-3">
                <CardTitle className="text-center text-lg font-bold text-gray-800">🎒 Objetos</CardTitle>
                 <Button variant="ghost" size="sm" onClick={() => playSound('info', 'Arrastra cada objeto a su caja.')} className="text-muted-foreground mx-auto flex items-center h-8">
                    <Volume2 className="mr-2 h-4 w-4" /> Escuchar
                </Button>
              </CardHeader>
              <CardContent className="p-3">
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-2">
                  {availableObjects.map((object) => (
                    <div
                      key={object.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, object)}
                      onDragEnd={handleDragEnd}
                      onTouchStart={(e) => handleTouchStart(e, object)}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                      className="bg-gradient-to-br from-yellow-200 to-orange-200 p-2 rounded-xl border-2 border-yellow-400 cursor-grab active:cursor-grabbing hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-center"
                    >
                      <div className="text-3xl sm:text-4xl">{object.asset}</div>
                      <div className="text-xs sm:text-sm font-semibold text-gray-700 hidden sm:block">{object.name}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className={gamePhase === 'classifying' ? 'lg:col-span-2' : 'lg:col-span-3'}>
           {gamePhase === 'counting' && (
                <div className="lg:col-span-3 text-center mb-4">
                     <Card className="inline-block mx-auto bg-purple-200 border-purple-400 border-4">
                        <CardContent className="p-3 sm:p-4">
                            <p className="font-bold text-lg sm:text-xl text-purple-800">¡Fase de Conteo!</p>
                            <p className="text-purple-700 text-sm sm:text-base">Ahora, dinos cuántos objetos hay en cada caja.</p>
                        </CardContent>
                    </Card>
                </div>
            )}
          <div className={`grid grid-cols-1 ${currentLevel.categories.length > 2 ? 'md:grid-cols-2' : ''} gap-4`}>
            {currentLevel.categories.map((category, index) => {
              const objectsInCategory = getObjectsInCategory(category.id);
              const isCurrentCountingCategory = gamePhase === 'counting' && countingCategoryIndex === index;
              const answerState = countAnswers[category.id];

              return (
                <Card key={category.id} className={`${category.color} border-4 transition-all duration-300`}>
                  <CardHeader className="p-3">
                    <CardTitle className="text-center text-lg font-bold">
                      {category.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent
                    ref={(el) => dropZonesRef.current.set(category.id, el)}
                    onDragOver={gamePhase === 'classifying' ? handleDragOver : undefined}
                    onDragEnter={gamePhase === 'classifying' ? handleDragEnter : undefined}
                    onDragLeave={gamePhase === 'classifying' ? handleDragLeave : undefined}
                    onDrop={gamePhase === 'classifying' ? (e) => handleDrop(e, category.id) : undefined}
                    className="min-h-[150px] sm:min-h-[200px] border-2 border-dashed border-gray-400 rounded-lg p-2 transition-all duration-200"
                  >
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                      {objectsInCategory.map((object) => (
                        <div
                          key={object.id}
                          className={`p-2 rounded-lg text-center transition-all duration-300 ${
                            object.isCorrect
                              ? "bg-green-200 border-2 border-green-400"
                              : "bg-red-200 border-2 border-red-400 animate-pulse"
                          }`}
                        >
                          <div className="text-2xl sm:text-3xl">{object.asset}</div>
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
                          <div className="text-3xl sm:text-4xl mb-2">📦</div>
                          <p className="text-xs sm:text-sm">Suelta aquí los {category.name.toLowerCase()}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                   {gamePhase === 'counting' && (
                       <Card className={`m-2 mt-0 ${isCurrentCountingCategory ? 'ring-4 ring-yellow-400 bg-yellow-100' : 'bg-white/50'}`}>
                           <CardContent className="p-3 sm:p-4">
                            <p className={`font-bold text-center text-base sm:text-lg mb-2 ${answerState?.isCorrect === true ? 'text-green-600' : ''}`}>
                                 {answerState?.isCorrect === true ? '¡Correcto!' : `¿Cuántos ${category.name.toLowerCase()} hay?`}
                            </p>
                             <Button variant="ghost" size="sm" onClick={() => speak(`¿Cuántos ${category.name.toLowerCase()} hay?`)} className="text-muted-foreground mx-auto flex items-center mb-2 h-8" disabled={!isCurrentCountingCategory}>
                                <Volume2 className="mr-2 h-4 w-4" /> Escuchar
                            </Button>
                            <div className="flex justify-center gap-2 flex-wrap">
                                {category.countOptions.map(option => {
                                    const isSelected = answerState?.answer === option;
                                    let buttonClass = 'bg-white hover:bg-gray-100';
                                    if(isSelected) {
                                        buttonClass = answerState.isCorrect ? 'bg-green-400 text-white hover:bg-green-400' : 'bg-red-400 text-white hover:bg-red-400';
                                    }
                                    return (
                                        <Button key={option} onClick={() => handleCountAnswer(category.id, option)} disabled={!isCurrentCountingCategory || answerState?.isCorrect === true} className={cn("text-lg font-bold w-10 h-10 sm:w-12 sm:h-12 rounded-full", buttonClass)}>
                                            {option}
                                        </Button>
                                    )
                                })}
                            </div>
                           </CardContent>
                       </Card>
                    )}
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClassifyAndCountGame;
