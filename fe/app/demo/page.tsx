"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft,
  User, 
  Stethoscope, 
  Building2, 
  Shield,
  Play,
  Pause,
  RotateCcw
} from "lucide-react"

const demoSteps = [
  {
    id: 1,
    role: "patient",
    title: "Patient uploads medical record",
    description: "Sarah uploads her cardiac consultation report and grants temporary access to her cardiologist and insurance company.",
    icon: User,
    gradient: "from-blue-600 to-blue-400",
    actions: ["Upload ECG Report", "Set permissions", "Share with Dr. Rodriguez"]
  },
  {
    id: 2,
    role: "doctor",
    title: "Doctor reviews and adds diagnosis",
    description: "Dr. Rodriguez reviews Sarah's ECG, adds his diagnosis, and uploads a prescription to the shared record.",
    icon: Stethoscope,
    gradient: "from-green-600 to-green-400",
    actions: ["Review ECG results", "Add diagnosis", "Upload prescription"]
  },
  {
    id: 3,
    role: "hospital",
    title: "Hospital uploads lab results",
    description: "Central Medical Center adds Sarah's blood test results and updates the treatment plan in the blockchain vault.",
    icon: Building2,
    gradient: "from-purple-600 to-purple-400",
    actions: ["Upload lab results", "Update treatment plan", "Notify care team"]
  },
  {
    id: 4,
    role: "insurance",
    title: "Insurance reviews and approves claim",
    description: "HealthFirst Insurance reviews the medical records, validates the treatment, and approves the claim for reimbursement.",
    icon: Shield,
    gradient: "from-orange-600 to-orange-400",
    actions: ["Review medical records", "Validate treatment", "Approve $250 claim"]
  }
]

export default function DemoPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [autoPlay, setAutoPlay] = useState(false)

  const nextStep = () => {
    setCurrentStep((prev) => (prev + 1) % demoSteps.length)
  }

  const prevStep = () => {
    setCurrentStep((prev) => (prev - 1 + demoSteps.length) % demoSteps.length)
  }

  const resetDemo = () => {
    setCurrentStep(0)
    setIsPlaying(false)
    setAutoPlay(false)
  }

  const toggleAutoPlay = () => {
    setAutoPlay(!autoPlay)
    setIsPlaying(!isPlaying)
  }

  // Auto-play functionality
  React.useEffect(() => {
    let interval: NodeJS.Timeout
    if (autoPlay && isPlaying) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          const next = (prev + 1) % demoSteps.length
          if (next === 0) {
            setAutoPlay(false)
            setIsPlaying(false)
          }
          return next
        })
      }, 3000)
    }
    return () => clearInterval(interval)
  }, [autoPlay, isPlaying])

  const currentStepData = demoSteps[currentStep]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F0E] via-[#0F2E28] to-[#0B0F0E]">
      {/* Background particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full opacity-20"
            animate={{
              x: Math.cos((i * Math.PI) / 15) * 300 + Math.random() * 150,
              y: Math.sin((i * Math.PI) / 15) * 300 + Math.random() * 150,
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 8 + i,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Landing
          </button>
          
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              STABLE Demo
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              See how patients, doctors, hospitals, and insurance companies work together in our blockchain healthcare ecosystem.
            </p>
          </div>
        </motion.div>

        {/* Demo Controls */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={prevStep}
                  className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
                  disabled={currentStep === 0 && !autoPlay}
                >
                  Previous
                </button>
                <button
                  onClick={toggleAutoPlay}
                  className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:shadow-lg transition-all"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {isPlaying ? 'Pause' : 'Auto Play'}
                </button>
                <button
                  onClick={nextStep}
                  className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
                  disabled={currentStep === demoSteps.length - 1 && !autoPlay}
                >
                  Next
                </button>
                <button
                  onClick={resetDemo}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </button>
              </div>
              
              <div className="text-white/70">
                Step {currentStep + 1} of {demoSteps.length}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary to-secondary rounded-full h-2 transition-all duration-500"
                  style={{ width: `${((currentStep + 1) / demoSteps.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Demo Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Step Information */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-6">
              {/* Role Badge */}
              <div className={`inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r ${currentStepData.gradient} rounded-full`}>
                <currentStepData.icon className="h-6 w-6 text-white" />
                <span className="text-white font-semibold capitalize">
                  {currentStepData.role}
                </span>
              </div>

              {/* Step Content */}
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  {currentStepData.title}
                </h2>
                <p className="text-lg text-white/80 leading-relaxed">
                  {currentStepData.description}
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-white">Actions Performed:</h3>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-2"
                  >
                    {currentStepData.actions.map((action, index) => (
                      <motion.div
                        key={action}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 }}
                        className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10"
                      >
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <span className="text-white/90">{action}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Try Role Button */}
              <button
                onClick={() => router.push(`/dashboard/${currentStepData.role}`)}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-[0_0_30px_rgba(0,255,178,0.4)] transition-all duration-300 transform hover:scale-105"
              >
                Try {currentStepData.role.charAt(0).toUpperCase() + currentStepData.role.slice(1)} Dashboard
              </button>
            </div>
          </motion.div>

          {/* Right Side - Visual Representation */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
              {/* Blockchain Vault Visualization */}
              <div className="relative">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">Blockchain Vault</h3>
                  <p className="text-white/60">Secure, Immutable, Accessible</p>
                </div>

                {/* Central Vault */}
                <div className="relative mx-auto w-48 h-48 mb-8">
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/30 to-secondary/30 border-2 border-primary/50"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  />
                  <div className="absolute inset-4 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Shield className="h-16 w-16 text-primary" />
                  </div>
                </div>

                {/* Role Connections */}
                <div className="grid grid-cols-2 gap-4">
                  {demoSteps.map((step, index) => (
                    <motion.div
                      key={step.id}
                      className={`p-4 rounded-xl border transition-all duration-300 ${
                        index === currentStep
                          ? `bg-gradient-to-r ${step.gradient} bg-opacity-20 border-opacity-50`
                          : 'bg-white/5 border-white/10'
                      }`}
                      animate={{
                        scale: index === currentStep ? 1.05 : 1,
                        opacity: index === currentStep ? 1 : 0.6
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <step.icon className={`h-8 w-8 ${
                          index === currentStep ? 'text-white' : 'text-white/60'
                        }`} />
                        <div>
                          <p className={`font-semibold ${
                            index === currentStep ? 'text-white' : 'text-white/60'
                          }`}>
                            {step.role.charAt(0).toUpperCase() + step.role.slice(1)}
                          </p>
                          <p className="text-xs text-white/50">
                            {index === currentStep ? 'Active' : 'Connected'}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to experience STABLE?
            </h3>
            <p className="text-white/70 mb-6">
              Choose your role and explore the full functionality of our blockchain healthcare platform.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => router.push('/role-selection')}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-[0_0_30px_rgba(0,255,178,0.4)] transition-all duration-300 transform hover:scale-105"
              >
                Choose Your Role
              </button>
              <button
                onClick={() => router.push('/dashboard/patient')}
                className="px-8 py-4 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/10 transition-all duration-300"
              >
                Try Patient Demo
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// Add React import for useEffect
import React from "react"