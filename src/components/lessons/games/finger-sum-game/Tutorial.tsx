
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronRight, Home } from "lucide-react"
import FingerDisplay from "./FingerDisplay"

interface TutorialProps {
  onComplete: () => void
}

export default function Tutorial({ onComplete }: TutorialProps) {
  const [step, setStep] = useState(0)

  const tutorialSteps = [
    {
      title: "¡Hola! Soy el Mago Suma 🧙‍♂️",
      content: "Te voy a enseñar a sumar usando deditos mágicos. ¡Ahora podemos sumar hasta 20!",
      showFingers: false,
      leftFingers: 0,
      rightFingers: 0,
    },
    {
      title: "Mira estos deditos ✋",
      content: "Cada dedo representa el número 1. Si veo 3 dedos, eso significa 3.",
      showFingers: true,
      leftFingers: 3,
      rightFingers: 0,
    },
    {
      title: "Ahora sumemos 🤝",
      content: "Si tengo 4 dedos aquí y 6 dedos allá, ¿cuántos dedos hay en total?",
      showFingers: true,
      leftFingers: 4,
      rightFingers: 6,
    },
    {
      title: "¡Exacto! 4 + 6 = 10 🎉",
      content: "Cuenta todos los dedos: ¡son 10 dedos en total! Podemos sumar hasta 20.",
      showFingers: true,
      leftFingers: 4,
      rightFingers: 6,
    },
    {
      title: "Tu turno de jugar 🎮",
      content: "En el juego verás grupos de dedos y tres botones con números. ¡Toca el número correcto!",
      showFingers: false,
      leftFingers: 0,
      rightFingers: 0,
    },
  ]

  const currentStep = tutorialSteps[step]

  const nextStep = () => {
    if (step < tutorialSteps.length - 1) {
      setStep(step + 1)
    } else {
      onComplete()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Button
            onClick={onComplete}
            variant="outline"
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            <Home className="mr-2 h-4 w-4" />
            Menú
          </Button>
          <div className="text-white font-semibold">
            Paso {step + 1} de {tutorialSteps.length}
          </div>
        </div>

        <Card className="p-8 bg-white/95 backdrop-blur-sm shadow-2xl max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{currentStep.title}</h2>
            <p className="text-xl text-gray-600 leading-relaxed">{currentStep.content}</p>
          </div>

          {currentStep.showFingers && (
            <div className="mb-8">
              <FingerDisplay
                leftFingers={currentStep.leftFingers}
                rightFingers={currentStep.rightFingers}
                showEquation={step === 3}
                animate={true}
              />
            </div>
          )}

          {!currentStep.showFingers && (
            <div className="text-center mb-8">
              <div className="text-8xl mb-4 animate-bounce">🧙‍♂️</div>
              <div className="text-4xl animate-pulse">✨</div>
            </div>
          )}

          <div className="text-center">
            <Button
              onClick={nextStep}
              className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 text-lg font-semibold rounded-full"
            >
              {step < tutorialSteps.length - 1 ? (
                <>
                  Siguiente
                  <ChevronRight className="ml-2 h-5 w-5" />
                </>
              ) : (
                "¡Empezar a Jugar!"
              )}
            </Button>
          </div>
        </Card>

        <div className="flex justify-center mt-6 gap-2">
          {tutorialSteps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === step ? "bg-white scale-125" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
