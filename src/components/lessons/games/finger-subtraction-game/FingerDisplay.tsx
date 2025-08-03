
"use client"

import Image from 'next/image';
import { fingerImages } from '../finger-sum-game/fingerImages'; // Reusing the same images

interface FingerDisplayProps {
  minuend: number
  subtrahend: number
  showEquation?: boolean
  animate?: boolean
}

export default function FingerDisplay({
  minuend,
  subtrahend,
  showEquation = false,
  animate = false,
}: FingerDisplayProps) {
  const renderNumberImage = (number: number, isResult = false) => {
    const imageUrl = fingerImages[number] || 'https://placehold.co/128x128.png';
    const bgColor = isResult ? 'bg-green-100 border-green-200' : 'bg-blue-100 border-blue-200';
    const sizeClasses = isResult ? 'w-28 h-28 sm:w-40 sm:h-40' : 'w-24 h-24 sm:w-32 sm:h-32';
    
    return (
      <div className={`text-center ${animate && !isResult ? "animate-slow-bounce" : ""}`}>
        <div className={`relative mx-auto mb-2 sm:mb-4 rounded-lg flex items-center justify-center border-2 overflow-hidden ${sizeClasses} ${bgColor}`}>
           <Image 
              src={imageUrl} 
              alt={`Imagen de ${number}`} 
              width={160} 
              height={160} 
              className="object-cover"
              data-ai-hint={`number ${number}`}
            />
        </div>
        <div className="text-2xl sm:text-3xl font-bold text-gray-700 bg-white/80 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mx-auto">
          {number}
        </div>
      </div>
    )
  }
  
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 py-4 sm:py-8 flex-wrap">
      <div className="transition-all duration-500">
        {renderNumberImage(minuend)}
      </div>

      <div className="text-4xl sm:text-6xl font-bold text-red-500 animate-slow-pulse mx-1 sm:mx-2">-</div>

      <div
        className="transition-all duration-500"
        style={{ animationDelay: "0.2s" }}
      >
        {renderNumberImage(subtrahend)}
      </div>

      {showEquation && (
        <>
          <div className="text-4xl sm:text-6xl font-bold text-red-500 mx-1 sm:mx-2">=</div>
          <div className="text-center">
            {renderNumberImage(minuend - subtrahend, true)}
            <div className="text-3xl sm:text-4xl font-bold text-green-600 bg-green-100 rounded-full w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-2">
              {minuend - subtrahend}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
