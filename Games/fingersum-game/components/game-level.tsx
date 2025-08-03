"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Home } from "lucide-react"
import FingerDisplay from "@/components/finger-display"

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
  left: number
  right: number
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
        // Generar números que no excedan 10 por grupo y que sumen hasta el máximo permitido
        const maxFirst = Math.min(10, config.maxNumber - 1)
        const left = Math.floor(Math.random() * maxFirst) + 1
        const maxSecond = Math.min(10, config.maxNumber - left)
        const right = Math.floor(Math.random() * maxSecond) + 1
        const answer = left + right

        // Asegurar que la suma no exceda el máximo
        if (answer > config.maxNumber) {
          i-- // Reintentar esta pregunta
          continue
        }

        // Generate wrong options
        const wrongOptions = []
        let attempts = 0
        while (wrongOptions.length < 2 && attempts < 20) {
          const variation = Math.floor(Math.random() * 4) + 1 // 1-4
          const wrong = Math.random() > 0.5 ? answer + variation : answer - variation

          if (wrong > 0 && wrong <= 20 && wrong !== answer && !wrongOptions.includes(wrong)) {
            wrongOptions.push(wrong)
          }
          attempts++
        }

        // Si no pudimos generar suficientes opciones incorrectas, usar valores por defecto
        while (wrongOptions.length < 2) {
          const fallback = answer + (wrongOptions.length === 0 ? 1 : 2)
          if (fallback <= 20 && !wrongOptions.includes(fallback)) {
            wrongOptions.push(fallback)
          } else {
            const fallback2 = Math.max(1, answer - (wrongOptions.length === 0 ? 1 : 2))
            if (!wrongOptions.includes(fallback2)) {
              wrongOptions.push(fallback2)
            }
          }
        }

        const options = [answer, ...wrongOptions].sort(() => Math.random() - 0.5)

        newQuestions.push({ left, right, answer, options })
      }
      return newQuestions
    }

    setQuestions(generateQuestions())
  }, [config])

  const playSound = (type: "correct" | "incorrect" | "click") => {
    // In a real implementation, this would play actual audio files
    console.log(`Playing ${type} sound`)
  }

  const handleAnswerSelect = (answer: number) => {
    if (showFeedback) return

    playSound("click")
    setSelectedAnswer(answer)
    const correct = answer === questions[currentQuestion].answer
    setIsCorrect(correct)
    setShowFeedback(true)

    if (correct) {
      setScore(score + 1)
      playSound("correct")
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 2000)
    } else {
      playSound("incorrect")
    }

    // Auto advance after feedback
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setShowFeedback(false)
      } else {
        onComplete(correct ? score + 1 : score)
      }
    }, 3000)
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
        <div className="text-white text-2xl">Preparando ejercicios... 🎲</div>
      </div>
    )
  }

  const question = questions[currentQuestion]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-4">
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 bg-yellow-400/20 flex items-center justify-center z-50 pointer-events-none">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🎉</div>
            <div className="text-4xl font-bold text-white drop-shadow-lg">¡Excelente!</div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button
            onClick={onExit}
            variant="outline"
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            <Home className="mr-2 h-4 w-4" />
            Salir
          </Button>

          <div className="text-center">
            <div className="text-white font-bold text-lg">
              Pregunta {currentQuestion + 1} de {config.questions}
            </div>
            <div className="text-white/80">
              Puntuación: {score}/{currentQuestion + (showFeedback ? 1 : 0)}
            </div>
          </div>

          <div className={`px-4 py-2 rounded-full text-white font-semibold ${config.color}`}>{config.name}</div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/30 rounded-full h-3 mb-8">
          <div
            className="bg-white rounded-full h-3 transition-all duration-500"
            style={{ width: `${((currentQuestion + 1) / config.questions) * 100}%` }}
          />
        </div>

        {/* Game Content */}
        <Card className="p-8 bg-white/95 backdrop-blur-sm shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">¿Cuántos dedos hay en total? 🤔</h2>
          </div>

          {/* Finger Display */}
          <div className="mb-8">
            <FingerDisplay
              leftFingers={question.left}
              rightFingers={question.right}
              showEquation={showFeedback}
              animate={!showFeedback}
            />
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-6">
            {question.options.map((option) => (
              <Button
                key={option}
                onClick={() => handleAnswerSelect(option)}
                disabled={showFeedback}
                className={`h-16 text-2xl font-bold rounded-xl transition-all duration-300 ${
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

          {/* Feedback */}
          {showFeedback && (
            <div className="text-center">
              {isCorrect ? (
                <div className="text-green-600">
                  <div className="text-4xl mb-2">🎉</div>
                  <div className="text-xl font-bold">¡Correcto!</div>
                  <div className="text-lg">
                    {question.left} + {question.right} = {question.answer}
                  </div>
                </div>
              ) : (
                <div className="text-red-600">
                  <div className="text-4xl mb-2">🤗</div>
                  <div className="text-xl font-bold">¡Casi!</div>
                  <div className="text-lg">La respuesta correcta es {question.answer}</div>
                  <div className="text-sm text-gray-600 mt-2">
                    Cuenta todos los dedos: {question.left} + {question.right} = {question.answer}
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Wizard Encouragement */}
        <div className="text-center mt-6">
          <div className="text-4xl animate-bounce">🧙‍♂️</div>
          <div className="text-white font-medium mt-2">
            {showFeedback ? (isCorrect ? "¡Eres increíble! ✨" : "¡Sigue intentando! 💪") : "¡Tú puedes hacerlo! 🌟"}
          </div>
        </div>
      </div>
    </div>
  )
}
