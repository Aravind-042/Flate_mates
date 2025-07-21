"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface WalkingLoaderProps {
  size?: 'sm' | 'md' | 'lg'
  speed?: 'slow' | 'normal' | 'fast'
  text?: string
  showText?: boolean
}

export const WalkingLoader = ({
  size = 'md',
  speed = 'normal',
  text = 'Loading...',
  showText = true
}: WalkingLoaderProps) => {
  const [currentFrame, setCurrentFrame] = useState(0)
  
  const sizeConfig = {
    sm: { scale: 0.6, containerHeight: 'h-32' },
    md: { scale: 0.8, containerHeight: 'h-40' },
    lg: { scale: 1, containerHeight: 'h-48' }
  }
  
  const speedConfig = {
    slow: 2000,
    normal: 1500,
    fast: 1000
  }
  
  const config = sizeConfig[size]
  const animationDuration = speedConfig[speed]
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame(prev => (prev + 1) % 4)
    }, animationDuration / 8)
    
    return () => clearInterval(interval)
  }, [animationDuration])

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className={`relative ${config.containerHeight} w-full max-w-md overflow-hidden`}>
        {/* Building */}
        <motion.div
          className="absolute right-0 top-0 bg-foreground"
          style={{
            width: '120px',
            height: '100%',
            transform: `scale(${config.scale})`,
            transformOrigin: 'top right'
          }}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Building details */}
          <div className="absolute inset-2 bg-background">
            {/* Windows */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-foreground"
                style={{
                  width: '12px',
                  height: '12px',
                  left: `${20 + (i % 3) * 20}px`,
                  top: `${20 + Math.floor(i / 3) * 20}px`
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
          
          {/* Door */}
          <div
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-background"
            style={{
              width: '20px',
              height: '30px'
            }}
          />
          
          {/* Door frame */}
          <div
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 border-2 border-foreground"
            style={{
              width: '24px',
              height: '34px'
            }}
          />
        </motion.div>

        {/* Walking Person */}
        <motion.div
          className="absolute bottom-0 left-0"
          style={{
            transform: `scale(${config.scale})`,
            transformOrigin: 'bottom left'
          }}
          animate={{
            x: [0, 200, 280],
            y: [0, 0, -10]
          }}
          transition={{
            duration: animationDuration / 1000,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {/* Person body */}
          <div className="relative">
            {/* Head */}
            <motion.div
              className="w-4 h-4 bg-foreground rounded-full mx-auto"
              animate={{
                y: currentFrame % 2 === 0 ? 0 : -1
              }}
              transition={{ duration: 0.1 }}
            />
            
            {/* Body */}
            <motion.div
              className="w-3 h-8 bg-foreground mx-auto mt-1"
              animate={{
                scaleY: currentFrame % 2 === 0 ? 1 : 1.1
              }}
              transition={{ duration: 0.1 }}
            />
            
            {/* Arms */}
            <motion.div
              className="absolute top-5 -left-2 w-6 h-1 bg-foreground origin-center"
              animate={{
                rotate: currentFrame % 4 < 2 ? -20 : 20
              }}
              transition={{ duration: 0.1 }}
            />
            
            {/* Left leg */}
            <motion.div
              className="absolute bottom-0 left-0 w-1 h-6 bg-foreground origin-top"
              animate={{
                rotate: currentFrame % 4 === 0 ? 20 : currentFrame % 4 === 2 ? -20 : 0
              }}
              transition={{ duration: 0.1 }}
            />
            
            {/* Right leg */}
            <motion.div
              className="absolute bottom-0 right-0 w-1 h-6 bg-foreground origin-top"
              animate={{
                rotate: currentFrame % 4 === 1 ? 20 : currentFrame % 4 === 3 ? -20 : 0
              }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </motion.div>

        {/* Ground */}
        <div
          className="absolute bottom-0 left-0 w-full h-1 bg-border"
          style={{ transform: `scale(${config.scale})` }}
        />

        {/* Walking dust particles */}
        <motion.div
          className="absolute bottom-1"
          animate={{
            x: [20, 220]
          }}
          transition={{
            duration: animationDuration / 1000,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-muted-foreground rounded-full"
              style={{
                left: `${i * 4}px`,
                transform: `scale(${config.scale})`
              }}
              animate={{
                opacity: [0, 0.6, 0],
                scale: [0.5, 1, 0.5],
                y: [0, -5, 0]
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                delay: i * 0.1
              }}
            />
          ))}
        </motion.div>

        {/* Progress indicator */}
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-muted">
          <motion.div
            className="h-full bg-primary"
            animate={{
              width: ['0%', '70%', '100%']
            }}
            transition={{
              duration: animationDuration / 1000,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>
      </div>

      {showText && (
        <motion.div
          className="text-center"
          animate={{
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <p className="text-foreground font-medium">
            {text}
            <motion.span
              animate={{
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: 0.5
              }}
            >
              ...
            </motion.span>
          </p>
        </motion.div>
      )}
    </div>
  )
}