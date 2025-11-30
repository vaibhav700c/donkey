"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"
import VaultCanvas from "./3d/vault-canvas"

interface HeroSectionProps {
  children?: React.ReactNode
}

// Healthcare Icons SVG components
const HealthcareIcons = {
  heart: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  ),
  pill: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.22 11.29l7.07-7.07c2.34-2.34 6.14-2.34 8.49 0 2.34 2.34 2.34 6.14 0 8.49l-7.07 7.07c-2.34 2.34-6.14 2.34-8.49 0-2.34-2.34-2.34-6.14 0-8.49zM5.64 12.71c-1.56 1.56-1.56 4.09 0 5.65 1.56 1.56 4.09 1.56 5.65 0l7.07-7.07c1.56-1.56 1.56-4.09 0-5.65-1.56-1.56-4.09-1.56-5.65 0l-7.07 7.07zM11 6.83l4.24 4.24-6.36 6.36L4.64 13.2 11 6.83z"/>
    </svg>
  ),
  dna: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 2h2v4H4V2zm0 6h2v4H4V8zm0 6h2v4H4v-4zm0 6h2v4H4v-4zm4-16h2v2H8V2zm0 4h2v2H8V6zm0 4h2v2H8v-2zm0 4h2v2H8v-2zm0 4h2v2H8v-2zm0 4h2v2H8v-2zm4-20h2v2h-2V2zm0 4h2v2h-2V6zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2zm4-20h2v4h-2V2zm0 6h2v4h-2V8zm0 6h2v4h-2v-4zm0 6h2v4h-2v-4z"/>
    </svg>
  ),
  stethoscope: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm0 4c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1 3.5c-1.68 0-3.22.67-4.34 1.76C12.82 16.15 12 14.88 12 13.5V4c0-.55.45-1 1-1h1V1h-1c-1.65 0-3 1.35-3 3v9.5c0 2.76 2.24 5 5 5 .28 0 .5.22.5.5s-.22.5-.5.5c-2.21 0-4-1.79-4-4V11h2V4H4v7h2v4c0 3.31 2.69 6 6 6 1.66 0 3-1.34 3-3s-1.34-3-3-3z"/>
    </svg>
  ),
  pulse: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 13h4l3-8 3 12 3-4h5v-2h-4l-2 2.5-3.5-10.5L8.5 15H3z"/>
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
    </svg>
  ),
  syringe: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.54 3.46L22 4.92l-1.41 1.41-1.42-1.41-1.41 1.41 1.41 1.42-3.54 3.54-1.41-1.42-1.06 1.06 1.42 1.42-5.66 5.66c-.39.39-1.02.39-1.41 0l-.71-.71-2.12 2.12-1.41-1.41 2.12-2.12-.71-.71c-.39-.39-.39-1.02 0-1.41l5.66-5.66 1.42 1.42 1.06-1.06-1.42-1.42 3.54-3.54 1.42 1.41 1.41-1.41-1.41-1.42 1.41-1.41zM6.41 20l2.12-2.12-1.42-1.42L5 18.58 6.41 20z"/>
    </svg>
  ),
  medical: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z"/>
    </svg>
  ),
}

const healthIcons = Object.values(HealthcareIcons)
const greenShades = ['#00ffb2', '#1aff96', '#00cc8e', '#00997a', '#006655', '#00ff99', '#33ffaa', '#00e68a']

// Deterministic particle configurations to avoid hydration mismatch
const createDeterministicParticles = (count: number, seed: number) => {
  const particles = []
  for (let i = 0; i < count; i++) {
    // Use sine and cosine with different seeds for deterministic "randomness"
    const x = ((Math.sin(i * 12.9898 + seed) * 43758.5453) % 1) * 100
    const y = ((Math.cos(i * 78.233 + seed) * 43758.5453) % 1) * 100
    const size = 20 + ((Math.sin(i * 7.91 + seed) * 43758.5453) % 1) * 40
    const animationOffset = ((Math.sin(i * 15.23 + seed) * 43758.5453) % 1) * 100
    const iconIndex = Math.floor(Math.abs(Math.sin(i * 9.87 + seed) * 43758.5453) % healthIcons.length)
    const colorIndex = Math.floor(Math.abs(Math.sin(i * 6.54 + seed) * 43758.5453) % greenShades.length)
    
    particles.push({
      id: i,
      left: Math.abs(x),
      top: Math.abs(y),
      size: Math.abs(size),
      animationOffset: Math.abs(animationOffset),
      icon: healthIcons[iconIndex],
      color: greenShades[colorIndex]
    })
  }
  return particles
}

const healthParticles = createDeterministicParticles(30, 1)

export default function HeroSection({ children }: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-background flex items-center justify-center"
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B0F0E] via-[#0F2E28] to-[#0B0F0E]" />

      {/* Animated Healthcare Icon Particles */}
      {isMounted && (
        <div className="absolute inset-0 pointer-events-none">
          {healthParticles.map((particle) => (
            <motion.div
              key={`health-${particle.id}`}
              className="absolute"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                color: particle.color,
                opacity: 0.25,
                filter: `drop-shadow(0 0 4px ${particle.color})`,
              }}
              animate={{
                y: [-40, 40, -40],
                x: [-15, 15, -15],
                rotate: [0, 20, -20, 0],
                opacity: [0.15, 0.35, 0.15],
                scale: [0.85, 1.15, 0.85],
              }}
              transition={{
                duration: 12 + (particle.animationOffset * 0.08),
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                delay: particle.animationOffset * 0.05,
                ease: "easeInOut",
              }}
            >
              {particle.icon}
            </motion.div>
          ))}
        </div>
      )}

      <div className="relative z-10 container mx-auto px-4 h-full flex items-center justify-between gap-8 pb-24">
        {/* Left content */}
        <motion.div
          className="flex-1 max-w-xl"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-6xl md:text-7xl font-bold leading-tight mb-6 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              STABLE
            </span>
            <span className="block text-white"> for Secure Healthcare</span>
          </motion.h1>

          <motion.p
            className="text-lg text-white/80 mb-6 leading-relaxed max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            A decentralized blockchain vault connecting Patients, Doctors, Hospitals & Insurance through secure medical data management.
          </motion.p>

          <motion.div
            className="flex justify-start mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <button 
              onClick={() => router.push('/dashboard')}
              className="px-10 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:shadow-[0_0_30px_rgba(0,255,178,0.4)] transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
            >
              Login
              <span className="flex items-center">
                <ArrowRight className="w-5 h-5" />
                <span className="text-xl font-bold">]</span>
              </span>
            </button>
          </motion.div>
        </motion.div>

        {/* Right 3D vault canvas */}
        <motion.div
          className="flex-1 hidden lg:flex items-center justify-center h-full px-8"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-full h-full max-w-4xl min-h-[700px] max-h-[900px]">
            <VaultCanvas />
          </div>
        </motion.div>
      </div>

      {/* Children overlay (for buttons, etc.) */}
      {children}

      {/* Scroll indicator - moved higher to avoid overlap */}
      <motion.div
        className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      >
        <div className="text-white/70 text-xs font-medium mb-1 text-center">Scroll to explore</div>
        <svg className="w-5 h-5 text-white/70 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </section>
  )
}
