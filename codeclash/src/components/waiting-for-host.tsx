'use client'

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { ClockIcon } from "lucide-react"

export default function ClientWaitForHost() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Waiting for Host
        </h1>
        <p className="text-xl text-gray-600">The game will start soon...</p>
      </motion.div>

      <Card className="w-64 h-64 rounded-full bg-gray-100 shadow-neumorphism flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white to-gray-200 shadow-inner" />
        <motion.div
          className="relative z-10 flex flex-col items-center justify-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <ClockIcon className="w-12 h-12 text-blue-500 mb-2" />
          <time className="text-2xl font-semibold text-gray-800">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </time>
        </motion.div>
      </Card>

      <motion.div
        className="mt-12 flex space-x-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 rounded-full bg-blue-500"
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
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-8 right-8 text-center text-gray-500"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <p>Tip: Make sure your team is ready!</p>
      </motion.div>
    </div>
  )
}

// Add this to your global CSS file or in a style tag in your layout
const styles = `
  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .shadow-neumorphism {
    box-shadow: 
      20px 20px 60px #d1d1d1,
      -20px -20px 60px #ffffff;
  }
`;