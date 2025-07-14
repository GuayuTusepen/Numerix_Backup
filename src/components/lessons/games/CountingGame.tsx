
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { gameData } from '@/data/countingGameData';
import './CountingGame.css';

interface CountingGameProps {
  onLevelComplete: (stars: 1 | 2 | 3) => void;
}

const CountingGame = ({ onLevelComplete }: CountingGameProps) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('menu'); // menu, playing, completed
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [stars, setStars] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [levelProgress, setLevelProgress] = useState<any>({});

  const currentLevelData = gameData.levels[currentLevel - 1];
  const totalQuestions = currentLevelData.questions.length;
  const currentQuestionData = currentLevelData.questions[currentQuestion];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedProgress = localStorage.getItem('countingGameProgress');
      if (savedProgress) {
        setLevelProgress(JSON.parse(savedProgress));
      }
    }
  }, []);

  const saveProgress = (level: number, starsEarned: number) => {
    const newProgress = {
      ...levelProgress,
      [level]: {
        stars: starsEarned,
        completed: true,
        completedAt: new Date().toISOString()
      }
    };
    setLevelProgress(newProgress);
    if (typeof window !== 'undefined') {
      localStorage.setItem('countingGameProgress', JSON.stringify(newProgress));
    }
  };

  useEffect(() => {
    if (gameState === 'playing') {
      playBackgroundMusic();
    }
  }, [gameState]);

  const playBackgroundMusic = () => {
    // Mock function
    console.log('🎵 Playing background music...');
  };

  const playSound = (soundType: string) => {
    // Mock function
    console.log(`🔊 Playing ${soundType} sound`);
  };

  const speakNumber = (number: number) => {
    console.log(`🗣️ Speaking number: ${number}`);
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(number.toString());
      utterance.lang = 'es-ES';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startLevel = (level: number) => {
    setCurrentLevel(level);
    setCurrentQuestion(0);
    setScore(0);
    setCorrectAnswers(0);
    setGameState('playing');
    setShowResult(false);
    setStars(0);
    setSelectedAnswer(null);
    playSound('start');
  };

  const selectAnswer = (answer: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);
    
    const isCorrect = answer === currentQuestionData.correctAnswer;
    
    if (isCorrect) {
      setScore(score + 100);
      setCorrectAnswers(correctAnswers + 1);
      playSound('correct');
      speakNumber(answer);
    } else {
      playSound('incorrect');
    }

    setTimeout(() => {
      nextQuestion();
    }, 2000);
  };

  const nextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      completeLevel();
    }
  };

  const completeLevel = () => {
    const accuracy = correctAnswers / totalQuestions;
    let earnedStars: 1 | 2 | 3 = 1;
    
    if (accuracy >= 0.95) earnedStars = 3;
    else if (accuracy >= 0.80) earnedStars = 2;
    
    setStars(earnedStars);
    setGameState('completed');
    
    saveProgress(currentLevel, earnedStars);
    onLevelComplete(earnedStars); // Notify parent component
    
    playSound('level_complete');
  };

  const resetGame = () => {
    setGameState('menu');
  };

  const renderFruits = () => {
    return currentQuestionData.fruits.map((fruit, index) => (
      <div
        key={index}
        className={`fruit-item ${fruit.type} animate-bounce-in`}
        style={{
          animationDelay: `${index * 0.2}s`,
          left: `${fruit.position.x}%`,
          top: `${fruit.position.y}%`
        }}
      >
        <div className="fruit-emoji">{fruit.emoji}</div>
      </div>
    ));
  };

  const renderStars = (count: number) => {
    return Array.from({ length: 3 }, (_, i) => (
      <span
        key={i}
        className={`star ${i < count ? 'filled' : 'empty'}`}
      >
        ⭐
      </span>
    ));
  };

  const getLevelStars = (level: number) => {
    return levelProgress[level]?.stars || 0;
  };

  const isLevelCompleted = (level: number) => {
    return levelProgress[level]?.completed || false;
  };

  const getStarText = (stars: number) => {
    if (stars === 3) return "¡Perfecto!";
    if (stars === 2) return "Aceptable";
    if (stars === 1) return "Mejora más";
    return "Sin jugar";
  };

  if (gameState === 'menu') {
    return (
      <div className="counting-game">
        <div className="game-container">
          <Card className="menu-card">
            <CardHeader className="text-center">
              <CardTitle className="game-title">
                🍎 Juego de Contar Frutas 🍊
              </CardTitle>
              <p className="game-subtitle">¡Aprende a contar del 1 al 10!</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {gameData.levels.map((level, index) => {
                const levelNumber = index + 1;
                const levelStars = getLevelStars(levelNumber);
                const completed = isLevelCompleted(levelNumber);
                
                return (
                  <Card key={index} className={`level-card ${completed ? 'completed' : ''}`}>
                    <CardContent className="p-4">
                      <div className="level-info">
                        <div className="level-header">
                          <h3 className="level-title">Nivel {levelNumber}</h3>
                          {completed && (
                            <div className="level-stars-display">
                              {renderStars(levelStars)}
                            </div>
                          )}
                        </div>
                        <p className="level-description">{level.description}</p>
                        <div className="level-range">
                          Contar: {level.range}
                        </div>
                        {completed && (
                          <div className="level-status">
                            <Badge variant={levelStars === 3 ? "default" : levelStars === 2 ? "secondary" : "outline"}>
                              {getStarText(levelStars)}
                            </Badge>
                          </div>
                        )}
                      </div>
                      <Button
                        className="level-button"
                        onClick={() => startLevel(levelNumber)}
                      >
                        {completed ? '¡Jugar de nuevo!' : '¡Jugar!'}
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
              <CardTitle className="completion-title">
                🎉 ¡Nivel Completado! 🎉
              </CardTitle>
              <div className="stars-display">
                {renderStars(stars)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="completion-stats">
                <div className="stat-item">
                  <span className="stat-label">Nivel completado:</span>
                  <span className="stat-value">Nivel {currentLevel}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Puntuación:</span>
                  <span className="stat-value">{score}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Respuestas correctas:</span>
                  <span className="stat-value">{correctAnswers}/{totalQuestions}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Precisión:</span>
                  <span className="stat-value">
                    {Math.round((correctAnswers / totalQuestions) * 100)}%
                  </span>
                </div>
                <div className="stat-item performance">
                  <span className="stat-label">Desempeño:</span>
                  <span className={`stat-value ${stars === 3 ? 'perfect' : stars === 2 ? 'good' : 'needs-improvement'}`}>
                    {getStarText(stars)}
                  </span>
                </div>
              </div>
              <div className="completion-actions">
                <Button
                  className="action-button"
                  onClick={() => startLevel(currentLevel)}
                >
                  Repetir Nivel {currentLevel}
                </Button>
                {currentLevel < gameData.levels.length && (
                  <Button
                    className="action-button next-level"
                    onClick={() => startLevel(currentLevel + 1)}
                  >
                    Siguiente Nivel
                  </Button>
                )}
                <Button
                  className="action-button secondary"
                  onClick={resetGame}
                >
                  Menú Principal
                </Button>
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
          <div className="game-info">
            <Badge variant="secondary">
              Nivel {currentLevel}
            </Badge>
            <Badge variant="outline">
              Pregunta {currentQuestion + 1} de {totalQuestions}
            </Badge>
          </div>
          <div className="score-display">
            Puntuación: {score}
          </div>
        </div>

        <Progress 
          value={(currentQuestion / totalQuestions) * 100} 
          className="progress-bar"
        />

        <Card className="game-card">
          <CardHeader>
            <CardTitle className="question-title">
              {currentQuestionData.question}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="fruits-container">
              {renderFruits()}
            </div>
            
            <div className="answers-container">
              {currentQuestionData.options.map((option, index) => (
                <Button
                  key={index}
                  className={`answer-button ${
                    selectedAnswer === option
                      ? option === currentQuestionData.correctAnswer
                        ? 'correct'
                        : 'incorrect'
                      : ''
                  } ${
                    showResult && option === currentQuestionData.correctAnswer
                      ? 'correct-answer'
                      : ''
                  }`}
                  onClick={() => selectAnswer(option)}
                  disabled={selectedAnswer !== null}
                >
                  {option}
                </Button>
              ))}
            </div>

            {showResult && (
              <div className={`result-message ${
                selectedAnswer === currentQuestionData.correctAnswer
                  ? 'correct'
                  : 'incorrect'
              }`}>
                {selectedAnswer === currentQuestionData.correctAnswer
                  ? '¡Correcto! 🎉'
                  : `¡Incorrecto! La respuesta correcta es ${currentQuestionData.correctAnswer} 😊`
                }
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CountingGame;
