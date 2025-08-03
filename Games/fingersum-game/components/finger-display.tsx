"use client"

interface FingerDisplayProps {
  leftFingers: number
  rightFingers: number
  showEquation?: boolean
  animate?: boolean
}

export default function FingerDisplay({
  leftFingers,
  rightFingers,
  showEquation = false,
  animate = false,
}: FingerDisplayProps) {
  const renderFingerImage = (fingers: number, side: "left" | "right") => {
    return (
      <div className={`text-center ${animate ? "animate-pulse" : ""}`}>
        {/* IMAGEN DE DEDOS: Aquí va la imagen de {fingers} dedo(s) */}
        <div className="relative w-32 h-32 mx-auto mb-4 bg-blue-100 rounded-lg flex items-center justify-center border-2 border-blue-200">
          {/* Placeholder temporal mientras se cargan las imágenes reales */}
          <div className="text-center">
            <div className="text-4xl mb-2">{fingers <= 5 ? "✋".repeat(Math.ceil(fingers / 5)) : "✋✋"}</div>
            <div className="text-xs text-gray-600">
              Imagen de {fingers} dedo{fingers !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        {/* Número debajo de la imagen */}
        <div className="text-3xl font-bold text-gray-700 bg-white/80 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
          {fingers}
        </div>

        {/* Etiqueta descriptiva */}
        <div className="text-sm text-gray-600 mt-2">
          {fingers} dedo{fingers !== 1 ? "s" : ""}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center gap-4 py-8 flex-wrap">
      {/* Grupo de dedos izquierdo */}
      <div className={`${animate ? "animate-bounce" : ""} transition-all duration-500`}>
        {renderFingerImage(leftFingers, "left")}
      </div>

      {/* Signo más */}
      <div className="text-6xl font-bold text-purple-600 animate-pulse mx-2">+</div>

      {/* Grupo de dedos derecho */}
      <div
        className={`${animate ? "animate-bounce" : ""} transition-all duration-500`}
        style={{ animationDelay: "0.2s" }}
      >
        {renderFingerImage(rightFingers, "right")}
      </div>

      {/* Ecuación y resultado */}
      {showEquation && (
        <>
          <div className="text-6xl font-bold text-purple-600 mx-2">=</div>
          <div className="text-center">
            {/* IMAGEN DEL RESULTADO: Aquí va la imagen de {leftFingers + rightFingers} dedo(s) */}
            <div className="relative w-40 h-40 mx-auto mb-4 bg-green-100 rounded-lg flex items-center justify-center border-2 border-green-200">
              <div className="text-center">
                <div className="text-5xl mb-2">{leftFingers + rightFingers <= 10 ? "🙌" : "🙌🙌"}</div>
                <div className="text-xs text-gray-600">Imagen de {leftFingers + rightFingers} dedos</div>
              </div>
            </div>

            <div className="text-4xl font-bold text-green-600 bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
              {leftFingers + rightFingers}
            </div>

            <div className="text-lg text-gray-600 font-semibold bg-white/90 rounded-lg px-4 py-2">
              {leftFingers} + {rightFingers} = {leftFingers + rightFingers}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
