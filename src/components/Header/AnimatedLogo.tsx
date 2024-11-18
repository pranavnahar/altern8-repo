'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AnimatedLogo() {
  const [isVisible, setIsVisible] = useState<boolean>(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible((prev) => !prev)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="[text-decoration:none] relative tracking-[6px] font-semibold text-5xl sm:text-21xl lg:text-10xl header_font font-exo">
      <div className="flex items-center justify-center gap-1">
        <motion.img src="/Altern.png" alt="altern" className="w-[120px]" />
        <div className="relative w-[50px] h-[45px]">
          <AnimatePresence mode="wait">
            {isVisible ? (
              <motion.img
                key="8"
                src="/8.png"
                alt="8"
                className="w-[50px] h-[45px] object-contain absolute"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
              />
            ) : (
              <motion.img
                key="infinity"
                src="/infinity.png"
                alt="infinity"
                className="w-[50px] h-[45px] object-contain absolute"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
