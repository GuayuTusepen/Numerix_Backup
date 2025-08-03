
"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { gameData } from '@/data/countingGameData';
import { getLocalStorageItem, setLocalStorageItem } from '@/lib/localStorage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import './CountingGame.css';
import { Home, Volume2, VolumeX } from 'lucide-react';

interface CountingGameProps {
    onGameExit: () => void;
}

const CountingGame = ({ onGameExit }: CountingGameProps) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('menu'); // menu, playing, completed
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [stars, setStars] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [levelProgress, setLevelProgress] = useState<{ [key: number]: { stars: number; completed: boolean } }>({});
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { activeProfile } = useProfile();
  const storageKey = activeProfile ? `countingGameProgress_${activeProfile.id}` : null;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio("/audio/inicio.mp3");
      audioRef.current.loop = true;
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const audio = audioRef.current;

    const playAudio = async () => {
      if (audio && gameState === 'playing' && !isMuted) {
        try {
          await audio.play();
          if (!isMounted) {
            audio.pause();
          }
        } catch (error) {
          console.error("Audio play failed:", error);
        }
      }
    };

    if (gameState === 'playing' && !isMuted) {
      playAudio();
    } else {
      audio?.pause();
    }

    return () => {
      isMounted = false;
      audio?.pause();
    };
  }, [gameState, isMuted]);
  
  const speakNumber = useCallback((number: number) => {
    if (isMuted || !('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(number.toString());
    utterance.lang = 'es-ES';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  }, [isMuted]);

  useEffect(() => {
    if (storageKey) {
      const savedProgress = getLocalStorageItem(storageKey, {});
      setLevelProgress(savedProgress);
    }
  }, [storageKey]);

  const saveProgress = (level: number, starsEarned: number, finalScore: number) => {
    if (!storageKey) return;
    const currentLevelBest = levelProgress[level] || { stars: 0, score: 0 };
    if (starsEarned > currentLevelBest.stars || finalScore > (currentLevelBest as any).score) {
      const newProgress = {
        ...levelProgress,
        [level]: {
          stars: Math.max(starsEarned, currentLevelBest.stars),
          score: Math.max(finalScore, (currentLevelBest as any).score || 0),
          completed: true,
        }
      };
      setLevelProgress(newProgress);
      setLocalStorageItem(storageKey, newProgress);
    }
  };
  
  const startLevel = (level: number) => {
    setCurrentLevel(level);
    setCurrentQuestion(0);
    setScore(0);
    setCorrectAnswers(0);
    setGameState('playing');
    setShowResult(false);
    setSelectedAnswer(null);
  };

  const handleSelectAnswer = (answer: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);
    
    const isCorrect = answer === currentQuestionData.correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 100);
      setCorrectAnswers(prev => prev + 1);
      speakNumber(answer);
    }

    setTimeout(() => {
      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        completeLevel(isCorrect ? correctAnswers + 1 : correctAnswers, isCorrect ? score + 100 : score);
      }
    }, 2000);
  };

  const completeLevel = (finalCorrectAnswers: number, finalScore: number) => {
    const accuracy = finalCorrectAnswers / totalQuestions;
    let earnedStars = 1;
    if (accuracy >= 0.95) earnedStars = 3;
    else if (accuracy >= 0.8) earnedStars = 2;
    
    setStars(earnedStars);
    setGameState('completed');
    saveProgress(currentLevel, earnedStars, finalScore);
  };

  const currentLevelData = gameData.levels.find(l => l.id === currentLevel);
  if (!currentLevelData) return <div>Cargando nivel...</div>;

  const totalQuestions = currentLevelData.questions.length;
  const currentQuestionData = currentLevelData.questions[currentQuestion];
  
  const renderStars = (count: number) => Array.from({ length: 3 }, (_, i) => (
      <span key={i} className={`star ${i < count ? 'filled' : 'empty'}`}>⭐</span>
  ));

  if (gameState === 'menu') {
    return (
      <div className="counting-game">
        <div className="game-container">
            <Button onClick={onGameExit} variant="ghost" className="absolute top-4 left-4 text-white hover:bg-white/20">
                <Home className="mr-2 h-5 w-5" /> Salir al Menú
            </Button>
          <Card className="menu-card">
            <CardHeader className="text-center">
              <CardTitle className="game-title">🍎 Juego de Contar Frutas 🍊</CardTitle>
              <p className="game-subtitle">¡Aprende a contar del 1 al 10!</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {gameData.levels.map((level) => {
                const levelStats = levelProgress[level.id] || { stars: 0, completed: false };
                return (
                  <Card key={level.id} className={`level-card ${levelStats.completed ? 'completed' : ''}`}>
                     <CardContent className="p-4">
                      <div className="level-info">
                        <div className="level-header">
                          <h3 className="level-title">Nivel {level.id}</h3>
                          {levelStats.completed && (
                            <div className="level-stars-display">{renderStars(levelStats.stars)}</div>
                          )}
                        </div>
                        <p className="level-description">{level.description}</p>
                        <div className="level-range">Contar: {level.range}</div>
                      </div>
                      <Button className="level-button" onClick={() => startLevel(level.id)}>
                         {levelStats.completed ? '¡Jugar de nuevo!' : '¡Jugar!'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (gameState === 'completed') {
    return (
      <div className="counting-game">
        <div className="game-container">
          <Card className="completion-card">
            <CardHeader className="text-center">
              <CardTitle className="completion-title">🎉 ¡Nivel Completado! 🎉</CardTitle>
              <div className="stars-display">{renderStars(stars)}</div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="completion-stats">
                 <div className="stat-item"><span className="stat-label">Puntuación:</span><span className="stat-value">{score}</span></div>
                <div className="stat-item"><span className="stat-label">Respuestas correctas:</span><span className="stat-value">{correctAnswers}/{totalQuestions}</span></div>
              </div>
              <div className="completion-actions">
                <Button className="action-button" onClick={() => startLevel(currentLevel)}>Repetir Nivel</Button>
                {currentLevel < gameData.levels.length && (
                  <Button className="action-button next-level" onClick={() => startLevel(currentLevel + 1)}>Siguiente Nivel</Button>
                )}
                <Button className="action-button secondary" onClick={() => setGameState('menu')}>Menú Principal</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="counting-game">
      <div className="game-container">
        <div className="game-header">
            <Button onClick={() => setGameState('menu')} variant="ghost" className="text-white hover:bg-white/20">
                <Home className="mr-2 h-5 w-5"/> Salir
            </Button>
            <div className="game-info">
                <Badge variant="secondary">Nivel {currentLevel}</Badge>
                <Badge variant="outline">Pregunta {currentQuestion + 1} de {totalQuestions}</Badge>
            </div>
            <div className="score-display">Puntuación: {score}</div>
            <Button onClick={() => setIsMuted(!isMuted)} variant="ghost" size="icon" className="text-white hover:bg-white/20">
              {isMuted ? <VolumeX /> : <Volume2 />}
            </Button>
        </div>
        <Progress value={((currentQuestion + 1) / totalQuestions) * 100} className="progress-bar" />
        <Card className="game-card">
          <CardHeader>
            <CardTitle className="question-title">{currentQuestionData.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="fruits-container">
              {currentQuestionData.fruits.map((fruit, index) => (
                <div key={index} className="fruit-item animate-bounce-in" style={{ left: `${fruit.position.x}%`, top: `${fruit.position.y}%`, animationDelay: `${index * 0.1}s` }}>
                  <div className="fruit-emoji">{fruit.emoji}</div>
                </div>
              ))}
            </div>
            <div className="answers-container">
              {currentQuestionData.options.map((option) => (
                <Button
                  key={option}
                  className={`answer-button ${selectedAnswer === option ? (option === currentQuestionData.correctAnswer ? 'correct' : 'incorrect') : ''} ${showResult && option === currentQuestionData.correctAnswer ? 'correct-answer' : ''}`}
                  onClick={() => handleSelectAnswer(option)}
                  disabled={selectedAnswer !== null}
                >
                  {option}
                </Button>
              ))}
            </div>
            {showResult && (
              <div className={`result-message ${selectedAnswer === currentQuestionData.correctAnswer ? 'correct' : 'incorrect'}`}>
                {selectedAnswer === currentQuestionData.correctAnswer ? '¡Correcto! 🎉' : `¡Incorrecto! La respuesta es ${currentQuestionData.correctAnswer}.`}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
