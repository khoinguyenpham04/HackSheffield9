'use client'

import { motion } from "framer-motion"

interface SpinnerProps {
  size?: "sm" | "md" | "lg"
  color?: string
  className?: string
}

export function Spinner({ 
  size = "md", 
  color = "bg-blue-500",
  className = "" 
}: SpinnerProps) {
  const dotSize = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4"
  }

  const containerSize = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32"
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-50/80 backdrop-blur-sm">
      <div className={`flex items-center justify-center ${containerSize[size]} rounded-full bg-gray-100 shadow-[inset_-5px_-5px_10px_rgba(255,255,255,0.8),inset_5px_5px_10px_rgba(0,0,0,0.2)] ${className}`}>
        <div className="flex items-center space-x-2">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className={`rounded-full ${color} ${dotSize[size]} shadow-[0_0_10px_rgba(0,0,0,0.1)] backdrop-blur-sm`}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.7, 1, 0.7],
                boxShadow: [
                  '0 0 0 rgba(0,0,0,0.1)',
                  '0 0 20px rgba(0,0,0,0.3)',
                  '0 0 0 rgba(0,0,0,0.1)'
                ],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}