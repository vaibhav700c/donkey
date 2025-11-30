'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Toaster from '@/components/toaster'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LogIn, ArrowRight } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const [showMemeVideo, setShowMemeVideo] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Dummy login - just needs any input
    if (email && password) {
      // Show meme video
      setShowMemeVideo(true)
      // After video plays for 3 seconds, redirect to role selection
      setTimeout(() => {
        router.push('/role-selection')
      }, 3000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F0E] via-[#0F2E28] to-[#0B0F0E] flex items-center justify-center p-4">
      {/* Meme Video Overlay */}
      <AnimatePresence>
        {showMemeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center p-4"
          >
            <video
              src="/early.mp4"
              autoPlay
              loop
              muted
              className="max-w-3xl w-full h-auto rounded-lg"
            />
            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.h2
                className="text-4xl md:text-5xl font-bold text-white mb-3"
                animate={{
                  textShadow: [
                    "0 0 20px rgba(0,255,178,0.5)",
                    "0 0 40px rgba(0,255,178,0.8)",
                    "0 0 20px rgba(0,255,178,0.5)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                Welcome to <span className="text-primary">STABLE</span>
              </motion.h2>
              <p className="text-white/80 text-lg mb-2">Secure Healthcare on the Blockchain</p>
              <p className="text-primary text-sm font-medium">Decentralize or get kicked 🦙</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome to <span className="text-primary">STABLE</span>
          </h1>
          <p className="text-white/60">Secure Healthcare on the Blockchain</p>
        </div>

        <Card className="bg-card/50 backdrop-blur border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LogIn className="w-5 h-5 text-primary" />
              Login to Your Account
            </CardTitle>
            <CardDescription>Enter any credentials to access the platform (Dummy Login)</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="demo@stable.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-background/50"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
                size="lg"
              >
                Login
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <p className="text-xs text-white/40 text-center">
                This is a demo - enter any email and password
              </p>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      <Toaster />
    </div>
  )
}