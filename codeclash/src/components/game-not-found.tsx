'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function GameNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-purple-900">
      <h1 className="mb-8 text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 drop-shadow-sm">
        Game Not Found
      </h1>
      <p className="mb-8 text-xl text-gray-600 dark:text-gray-300">
        Oops! The game you&apos;re looking for seems to be missing.
      </p>
      <Button asChild className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-opacity-90 dark:hover:bg-opacity-90 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl rounded-full px-8 py-3 text-lg font-semibold backdrop-blur-sm bg-opacity-50 dark:bg-opacity-50">
        <Link href="/">
          <span className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
            Take me home
          </span>
        </Link>
      </Button>
    </div>
  )
}