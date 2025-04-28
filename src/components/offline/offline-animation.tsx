"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function OfflineAnimation() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="relative h-40 w-full my-6">
      {/* Cloud */}
      <motion.div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-16 bg-muted rounded-full"
        initial={{ y: 0 }}
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div className="absolute top-8 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-muted rounded-full" />
      <motion.div className="absolute top-8 left-1/2 transform -translate-x-[70%] -translate-y-1/2 w-16 h-16 bg-muted rounded-full" />
      <motion.div className="absolute top-8 left-1/2 transform -translate-x-[30%] -translate-y-1/2 w-16 h-16 bg-muted rounded-full" />

      {/* Signal waves */}
      <motion.div
        className="absolute top-20 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full border-2 border-muted-foreground"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 3] }}
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeOut" }}
      />
      <motion.div
        className="absolute top-20 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full border-2 border-muted-foreground"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 3] }}
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeOut", delay: 1 }}
      />
      <motion.div
        className="absolute top-20 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full border-2 border-muted-foreground"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 3] }}
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeOut", delay: 2 }}
      />

      {/* Device */}
      <motion.div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-24 bg-primary/10 rounded-lg border-2 border-primary/30"
        initial={{ y: 0 }}
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.5 }}
      >
        <div className="w-12 h-16 mx-auto mt-2 bg-background rounded-sm"></div>
        <div className="w-4 h-4 mx-auto mt-2 rounded-full border-2 border-primary/30"></div>
      </motion.div>
    </div>
  )
}
