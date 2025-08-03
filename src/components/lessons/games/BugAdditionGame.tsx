
"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { bugAdditionGameData } from '@/data/additionGameData';
import { CheckCircle, XCircle, ArrowRight, Star, Home } from 'lucide-react';
import { useProfile } from '@/contexts/ProfileContext';

type GameState = 'welcome' | 'playing' | 'levelComplete' | 'gameComplete';

interface BugAdditionGameProps {
  onGameExit: (progress: { completed: boolean, stars: 0 | 1 | 2 | 3 }) => void;
}

const BugAdditionGame = ({ onGameExit }: BugAdditionGameProps) => {
  const { activeProfile } = useProfile();
  const [gameState, setGameState] = useState<GameState>('welcome');
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [droppedBugs, setDroppedBugs] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [totalMistakes, setTotalMistakes] = useState(0);
  const [levelStars, setLevelStars] = useState(0);
  
  const level = bugAdditionGameData[currentLevelIndex];
  const problem = level.problems[currentProblemIndex];

  const answerOptions = useMemo(() => {
    const options = new Set<number>();
    options.add(problem.answer);
    while (options.size < 4) {
      const randomOffset = Math.floor(Math.random() * 5) - 2; // -2, -1, 0, 1, 2
      const randomAnswer = problem.answer + randomOffset;
      if (randomAnswer > 0 && randomAnswer !== problem.answer) {
        options.add(randomAnswer);
      }
    }
    return Array.from(options).sort((a, b) => a - b);
  }, [problem]);
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (droppedBugs < problem.num1 + problem.num2) {
      setDroppedBugs(prev => prev + 1);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleSelectAnswer = (answer: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answer);
    const correct = droppedBugs === problem.answer && answer === problem.answer;
    setIsCorrect(correct);

    if (correct) {
      setScore(prev => prev + 10);
      // Play success sound
    } else {
      setMistakes(prev => prev + 1);
      // Play error sound
    }
    
    setTimeout(() => {
        nextProblem();
    }, 1500);
  };
  
  const nextProblem = () => {
    if (currentProblemIndex < level.problems.length - 1) {
      setCurrentProblemIndex(prev => prev + 1);
      resetProblemState();
    } else {
      // Level complete
      const stars = Math.max(1, 3 - mistakes) as 1 | 2 | 3;
      setLevelStars(stars);
      setTotalMistakes(prev => prev + mistakes);
      setGameState('levelComplete');
    }
  };
  
  const nextLevel = () => {
    if (currentLevelIndex < bugAdditionGameData.length - 1) {
      setCurrentLevelIndex(prev => prev + 1);
      setCurrentProblemIndex(0);
      resetProblemState();
      setMistakes(0);
      setGameState('playing');
    } else {
      setGameState('gameComplete');
    }
  };
  
  const resetProblemState = () => {
    setDroppedBugs(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  const handleGameEnd = useCallback(() => {
    const totalProblems = bugAdditionGameData.flatMap(l => l.problems).length;
    const accuracy = totalProblems > 0 ? (totalProblems - totalMistakes) / totalProblems : 0;
    
    let finalStars: 0 | 1 | 2 | 3 = 0;
    if (accuracy === 1) finalStars = 3;
    else if (accuracy >= 0.75) finalStars = 2;
    else if (accuracy > 0.5) finalStars = 1;
    
    onGameExit({ completed: true, stars: finalStars });

  }, [totalMistakes, onGameExit]);

  const restartGame = () => {
    setCurrentLevelIndex(0);
    setCurrentProblemIndex(0);
    resetProblemState();
    setScore(0);
    setMistakes(0);
    setTotalMistakes(0);
    setGameState('playing');
  }


  if (gameState === 'welcome') {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-200 to-blue-300 flex items-center justify-center p-4">
             <Card className="w-full max-w-lg mx-auto shadow-2xl text-center font-tipografica">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-green-700">¡Aventura de Sumas con Bichos!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Image src="/guide/friendly-owl.png" alt="Bichos" width={150} height={150} className="mx-auto" data-ai-hint="owl mascot"/>
                    <p className="text-lg text-gray-600">
                        ¡Ayuda a los bichos a llegar a la hoja! Arrastra la cantidad correcta para cada número y luego elige la suma total.
                    </p>
                    <Button onClick={() => setGameState('playing')} size="lg" className="w-full text-xl py-6 bg-green-500 hover:bg-green-600">
                        ¡Empezar a Jugar!
                    </Button>
                </CardContent>
             </Card>
        </div>
    );
  }
  
  if (gameState === 'levelComplete' || gameState === 'gameComplete') {
    const isGameFinished = gameState === 'gameComplete';
    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-200 to-orange-300 flex items-center justify-center p-4">
             <Card className="w-full max-w-lg mx-auto shadow-2xl text-center font-tipografica">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-orange-700">
                        {isGameFinished ? '¡Juego Completado!' : `¡Nivel ${level.level} Superado!`}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="text-7xl">🎉</div>
                    <div className="flex justify-center">
                        {Array.from({ length: 3 }).map((_, i) => (
                             <Star key={i} className={`h-12 w-12 ${i < levelStars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                        ))}
                    </div>
                    <p className="text-xl">Puntuación: {score}</p>
                    <div className="flex gap-4 justify-center">
                        {isGameFinished ? (
                            <>
                             <Button onClick={restartGame} size="lg" className="text-lg py-4 bg-blue-500 hover:bg-blue-600">
                                Jugar de Nuevo
                             </Button>
                              <Button onClick={handleGameEnd} size="lg" variant="outline" className="text-lg py-4">
                                <Home className="mr-2 h-5 w-5"/> Salir
                             </Button>
                            </>
                        ) : (
                            <Button onClick={nextLevel} size="lg" className="text-lg py-4 bg-green-500 hover:bg-green-600">
                                Siguiente Nivel <ArrowRight className="ml-2 h-5 w-5"/>
                            </Button>
                        )}
                    </div>
                </CardContent>
             </Card>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-cover bg-center p-4" style={{backgroundImage: "url('/backgrounds/forest-background.jpg')"}}>
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 max-w-4xl mx-auto space-y-4 shadow-2xl">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold font-tipografica">Nivel {level.level}</h1>
            <div className="text-2xl font-bold font-tipografica">Puntuación: {score}</div>
            <Button onClick={() => onGameExit({completed: false, stars: 0})} variant="ghost" size="sm"><Home className="mr-2 h-4 w-4"/> Salir</Button>
        </div>
        <Progress value={(currentProblemIndex / level.problems.length) * 100} className="h-4" />
        
        <Card className="bg-green-100/70">
            <CardContent className="p-6 text-center">
                <div className="flex justify-center items-center text-5xl font-bold font-tipografica text-green-800" >
                    <span>{problem.num1}</span>
                    <span className="text-6xl mx-4 text-green-600">+</span>
                    <span>{problem.num2}</span>
                    <span className="text-6xl mx-4 text-green-600">=</span>
                    <span className="text-gray-500">?</span>
                </div>
            </CardContent>
        </Card>
        
        <div className="grid md:grid-cols-2 gap-4 items-center">
            {/* Bug container */}
            <div className="flex flex-col items-center p-4">
                 <p className="font-bold text-lg mb-2 font-tipografica text-center">Arrastra {problem.num1 + problem.num2} bichos a la hoja</p>
                <div className="flex flex-wrap gap-2 justify-center">
                     {Array.from({ length: problem.num1 + problem.num2 - droppedBugs }).map((_, i) => (
                        <div key={i} draggable onDragStart={(e) => e.dataTransfer.setData('text','bug')}>
                             <Image src="/icons/ladybug.png" alt="Mariquita" width={40} height={40} className="cursor-grab" data-ai-hint="ladybug insect"/>
                        </div>
                    ))}
                </div>
            </div>
            {/* Leaf drop zone */}
            <div 
                onDrop={handleDrop} 
                onDragOver={handleDragOver} 
                className="relative bg-contain bg-no-repeat bg-center w-full min-h-[200px] md:min-h-[300px] flex items-center justify-center"
                style={{backgroundImage: "url('/icons/leaf.png')"}}
                data-ai-hint="leaf plant"
            >
                <div className="absolute grid grid-cols-4 gap-1 p-2">
                    {Array.from({ length: droppedBugs }).map((_, i) => (
                        <Image key={i} src="/icons/ladybug.png" alt="Mariquita en hoja" width={30} height={30} data-ai-hint="ladybug insect"/>
                    ))}
                </div>
                <span className="absolute bottom-4 right-4 text-4xl font-bold bg-white/70 px-4 py-2 rounded-full font-tipografica">{droppedBugs}</span>
            </div>
        </div>
        
        <div className="text-center p-4">
            <h2 className="text-xl font-bold mb-4 font-tipografica">Selecciona la respuesta correcta</h2>
             <div className="flex justify-center gap-4">
                {answerOptions.map(option => (
                     <Button 
                        key={option} 
                        onClick={() => handleSelectAnswer(option)}
                        disabled={selectedAnswer !== null}
                        size="lg"
                        className={`text-3xl w-20 h-20 rounded-full font-bold transition-all duration-300 font-tipografica
                            ${selectedAnswer === option ? (isCorrect ? 'bg-green-500 scale-110' : 'bg-red-500 scale-110') : 'bg-primary hover:bg-primary/80'}
                        `}
                    >
                        {option}
                     </Button>
                ))}
            </div>
        </div>

        {isCorrect !== null && (
            <div className="flex justify-center items-center gap-2 text-2xl font-bold mt-4">
                {isCorrect ? <CheckCircle className="text-green-500 h-8 w-8"/> : <XCircle className="text-red-500 h-8 w-8"/>}
                <span>{isCorrect ? '¡Muy Bien!' : '¡Intenta de nuevo!'}</span>
            </div>
        )}

      </div>
    </div>
  );
};

export default BugAdditionGame;
