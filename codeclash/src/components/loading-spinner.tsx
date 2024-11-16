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

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className={`rounded-full ${color} ${dotSize[size]}`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  )
}

//YOU CAN USE THIS COMPONENT LIKE THIS:
// Default usage
{/* <Spinner />

// Small blue spinner
<Spinner size="sm" />

// Large green spinner
<Spinner size="lg" color="bg-green-500" />

// Custom classes
<Spinner className="mt-4" /> */}