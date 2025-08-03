
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronRight, Home } from "lucide-react"
import FingerDisplay from "./FingerDisplay"

interface TutorialProps {
  onComplete: () => void
  onExit: () => void;
}

export default function Tutorial({ onComplete, onExit }: TutorialProps) {
  const [step, setStep] = useState(0)

  const tutorialSteps = [
    {
      title: "¡Hola! Soy el Mago de las Restas 🧙‍♂️",
      content: "Te enseñaré a quitar números usando los deditos mágicos.",
      showFingers: false,
      minuend: 0,
      subtrahend: 0,
    },
    {
      title: "Empezamos con un número ✋",
      content: "Aquí tenemos el número 8. ¡Ocho deditos!",
      showFingers: true,
      minuend: 8,
      subtrahend: 0,
    },
    {
      title: "Ahora quitamos algunos 🤝",
      content: "Si a 8 le quitamos 3 deditos... ¿cuántos nos quedan?",
      showFingers: true,
      minuend: 8,
      subtrahend: 3,
    },
    {
      title: "¡Exacto! 8 - 3 = 5 🎉",
      content: "Contamos los dedos que quedan... ¡y son 5! Es así de fácil.",
      showFingers: true,
      minuend: 8,
      subtrahend: 3,
    },
    {
      title: "¡Ahora es tu turno! 🎮",
      content: "En el juego, te mostraré una resta. ¡Tú eliges el número correcto!",
      showFingers: false,
      minuend: 0,
      subtrahend: 0,
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
    <div className="min-h-screen bg-gradient-to-br from-red-400 via-orange-400 to-yellow-400 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Button
            onClick={onExit}
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

        <Card className="p-6 sm:p-8 bg-white/95 backdrop-blur-sm shadow-2xl max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">{currentStep.title}</h2>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">{currentStep.content}</p>
          </div>

          {currentStep.showFingers && (
            <div className="mb-8">
              <FingerDisplay
                minuend={currentStep.minuend}
                subtrahend={currentStep.subtrahend}
                showEquation={step === 3}
                animate={true}
              />
            </div>
          )}

          {!currentStep.showFingers && (
            <div className="text-center mb-8">
              <div className="text-8xl mb-4 animate-slow-bounce">🧙‍♂️</div>
              <div className="text-4xl animate-slow-pulse">✨</div>
            </div>
          )}

          <div className="text-center">
            <Button
              onClick={nextStep}
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 text-lg font-semibold rounded-full"
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
