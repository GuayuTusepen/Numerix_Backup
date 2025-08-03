
"use client"

import Image from 'next/image';
import { fingerImages } from './fingerImages';

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
  const renderFingerImage = (fingers: number) => {
    const imageUrl = fingerImages[fingers] || 'https://placehold.co/128x128.png'; // Fallback image
    return (
      <div className={`text-center ${animate ? "animate-slow-pulse" : ""}`}>
        <div className="relative w-32 h-32 mx-auto mb-4 bg-blue-100 rounded-lg flex items-center justify-center border-2 border-blue-200 overflow-hidden">
           <Image 
              src={imageUrl} 
              alt={`Imagen de ${fingers} dedo(s)`} 
              width={128} 
              height={128} 
              className="object-cover"
              data-ai-hint={`fingers ${fingers}`}
            />
        </div>
        <div className="text-3xl font-bold text-gray-700 bg-white/80 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
          {fingers}
        </div>
      </div>
    )
  }

  const renderResultImage = (totalFingers: number) => {
    // Para el resultado, si es mayor que 10, mostramos un placeholder genérico por ahora
    const imageUrl = totalFingers <= 10 ? fingerImages[totalFingers] : 'https://placehold.co/160x160.png';
    const altText = totalFingers <= 10 ? `Imagen de ${totalFingers} dedos` : `${totalFingers} dedos`;

    return (
        <div className="relative w-40 h-40 mx-auto mb-4 bg-green-100 rounded-lg flex items-center justify-center border-2 border-green-200 overflow-hidden">
            {totalFingers > 10 ? (
                 <div className="text-center">
                    <div className="text-5xl mb-2">🙌🙌</div>
                    <div className="text-xs text-gray-600">{altText}</div>
                </div>
            ) : (
                <Image 
                    src={imageUrl} 
                    alt={altText} 
                    width={160} 
                    height={160} 
                    className="object-cover"
                    data-ai-hint={`fingers ${totalFingers}`}
                />
            )}
        </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-4 py-8 flex-wrap">
      <div className={`${animate ? "animate-slow-bounce" : ""} transition-all duration-500`}>
        {renderFingerImage(leftFingers)}
      </div>

      <div className="text-6xl font-bold text-purple-600 animate-slow-pulse mx-2">+</div>

      <div
        className={`${animate ? "animate-slow-bounce" : ""} transition-all duration-500`}
        style={{ animationDelay: "0.2s" }}
      >
        {renderFingerImage(rightFingers)}
      </div>

      {showEquation && (
        <>
          <div className="text-6xl font-bold text-purple-600 mx-2">=</div>
          <div className="text-center">
            {renderResultImage(leftFingers + rightFingers)}
            <div className="text-4xl font-bold text-green-600 bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
              {leftFingers + rightFingers}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
