"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-foreground mb-4">Something went wrong!</h1>
        <p className="text-muted-foreground mb-8">An unexpected error occurred. Please try again or contact support.</p>
        <Button onClick={() => reset()} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          Try Again
        </Button>
      </motion.div>
    </div>
  )
}
