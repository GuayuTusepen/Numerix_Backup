
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Home } from "lucide-react"
import FingerDisplay from "./FingerDisplay"

interface GameLevelProps {
  difficulty: string
  config: {
    name: string
    questions: number
    maxNumber: number
    color: string
  }
  onComplete: (score: number) => void
  onExit: () => void
}

interface Question {
  minuend: number
  subtrahend: number
  answer: number
  options: number[]
}

export default function GameLevel({ difficulty, config, onComplete, onExit }: GameLevelProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [questions, setQuestions] = useState<Question[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  // Generate questions
  useEffect(() => {
    const generateQuestions = () => {
      const newQuestions: Question[] = []
      for (let i = 0; i < config.questions; i++) {
        const minuend = Math.floor(Math.random() * (config.maxNumber - 1)) + 2; // Minuend from 2 to maxNumber
        const subtrahend = Math.floor(Math.random() * Math.min(minuend - 1, 10)) + 1; // Subtrahend up to 10 and less than minuend
        
        const answer = minuend - subtrahend;

        if (answer < 0) { // Should not happen with current logic, but as a safeguard
          i--;
          continue;
        }

        const wrongOptions = new Set<number>()
        while (wrongOptions.size < 2) {
          const variation = Math.floor(Math.random() * 3) + 1 
          let wrong = Math.random() > 0.5 ? answer + variation : answer - variation
          wrong = Math.max(0, Math.min(20, wrong)); // Clamp within 0-20

          if (wrong !== answer) {
            wrongOptions.add(wrong)
          }
        }

        const options = [answer, ...Array.from(wrongOptions)].sort(() => Math.random() - 0.5)

        newQuestions.push({ minuend, subtrahend, answer, options })
      }
      return newQuestions
    }

    setQuestions(generateQuestions())
  }, [config])

  const handleAnswerSelect = (answer: number) => {
    if (showFeedback) return

    setSelectedAnswer(answer)
    const correct = answer === questions[currentQuestion].answer
    setIsCorrect(correct)
    setShowFeedback(true)

    let finalScore = score;
    if (correct) {
      finalScore = score + 1;
      setScore(finalScore)
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 2000)
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setShowFeedback(false)
      } else {
        onComplete(finalScore)
      }
    }, 3000)
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-400 to-yellow-500 flex items-center justify-center">
        <div className="text-white text-2xl">Preparando restas... 🎲</div>
      </div>
    )
  }

  const question = questions[currentQuestion]

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-400 via-orange-400 to-yellow-400 p-4">
      {showCelebration && (
        <div className="fixed inset-0 bg-yellow-400/20 flex items-center justify-center z-50 pointer-events-none">
          <div className="text-center animate-slow-bounce">
            <div className="text-9xl mb-4">🎉</div>
            <div className="text-4xl font-bold text-white drop-shadow-lg">¡Excelente!</div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button
            onClick={onExit}
            variant="outline"
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            <Home className="mr-2 h-4 w-4" />
            Menú
          </Button>
          
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-white font-bold text-lg">
                Pregunta {currentQuestion + 1} de {config.questions}
              </div>
              <div className="text-white/80">
                Aciertos: {score}/{currentQuestion + (showFeedback ? 1 : 0)}
              </div>
            </div>
          </div>

          <div className={`px-4 py-2 rounded-full text-white font-semibold ${config.color}`}>{config.name}</div>
        </div>

        <div className="w-full bg-white/30 rounded-full h-3 mb-8">
          <div
            className="bg-white rounded-full h-3 transition-all duration-500"
            style={{ width: `${((currentQuestion + 1) / config.questions) * 100}%` }}
          />
        </div>

        <Card className="p-4 sm:p-8 bg-white/95 backdrop-blur-sm shadow-2xl">
          <div className="text-center mb-4 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">¿Cuál es el resultado de la resta? 🤔</h2>
          </div>

          <div className="mb-4 sm:mb-8">
            <FingerDisplay
              minuend={question.minuend}
              subtrahend={question.subtrahend}
              showEquation={showFeedback}
              animate={!showFeedback}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-md mx-auto mb-6">
            {question.options.map((option) => (
              <Button
                key={option}
                onClick={() => handleAnswerSelect(option)}
                disabled={showFeedback}
                className={`h-14 sm:h-16 text-xl sm:text-2xl font-bold rounded-xl transition-all duration-300 ${
                  showFeedback
                    ? option === question.answer
                      ? "bg-green-500 hover:bg-green-500 text-white scale-110"
                      : option === selectedAnswer
                        ? "bg-red-500 hover:bg-red-500 text-white"
                        : "bg-gray-300 text-gray-500"
                    : selectedAnswer === option
                      ? "bg-blue-500 text-white scale-105"
                      : "bg-white hover:bg-blue-50 text-gray-800 hover:scale-105"
                }`}
              >
                {option}
              </Button>
            ))}
          </div>

          {showFeedback && (
            <div className="text-center min-h-[100px]">
              {isCorrect ? (
                <div className="text-green-600">
                  <div className="text-4xl mb-2">🎉</div>
                  <div className="text-xl font-bold">¡Correcto!</div>
                  <div className="text-lg">
                    {question.minuend} - {question.subtrahend} = {question.answer}
                  </div>
                </div>
              ) : (
                <div className="text-red-600">
                  <div className="text-4xl mb-2">🤗</div>
                  <div className="text-xl font-bold">¡Casi!</div>
                  <div className="text-lg">La respuesta correcta es {question.answer}</div>
                  <div className="text-sm text-gray-600 mt-2">
                    {question.minuend} - {question.subtrahend} = {question.answer}
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>

        <div className="text-center mt-6">
          <div className="text-6xl animate-slow-pulse">🧙‍♂️</div>
          <div className="text-white font-medium mt-2">
            {showFeedback ? (isCorrect ? "¡Sigue así! ✨" : "¡No te rindas! 💪") : "¡Concéntrate! 🌟"}
          </div>
        </div>
      </div>
    </div>
  )
}
