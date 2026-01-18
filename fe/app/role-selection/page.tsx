"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { 
  User, 
  Stethoscope, 
  Building2, 
  Shield, 
  ArrowLeft,
  Users,
  FileText,
  Activity,
  CreditCard
} from "lucide-react"

const roles = [
  {
    id: 1,
    name: "Patient",
    icon: User,
    description: "Upload medical records, manage access permissions, and securely share data with healthcare providers",
    route: "/dashboard/patient",
    gradient: "from-blue-600 to-blue-400",
    features: ["Upload Records", "Manage Access", "View History", "Share Data"]
  },
  {
    id: 2,
    name: "Doctor",
    icon: Stethoscope,
    description: "Access patient records, upload medical files, manage consultations, and collaborate with healthcare teams",
    route: "/dashboard/doctor",
    gradient: "from-green-600 to-green-400",
    features: ["Patient Records", "Upload Files", "Consultations", "Prescriptions"]
  },
  {
    id: 3,
    name: "Hospital",
    icon: Building2,
    description: "Manage department reports, upload test results, handle admissions, and coordinate care delivery",
    route: "/dashboard/hospital",
    gradient: "from-purple-600 to-purple-400",
    features: ["Department Reports", "Test Results", "Admissions", "Statistics"]
  },
  {
    id: 4,
    name: "Insurance",
    icon: Shield,
    description: "Review claims, authorize treatments, access medical records for verification, and manage policies",
    route: "/dashboard/insurance",
    gradient: "from-orange-600 to-orange-400",
    features: ["Review Claims", "Authorize Treatments", "Policy Management", "Verification"]
  }
]

export default function RoleSelection() {
  const router = useRouter()
  const [particles, setParticles] = useState<Array<{ x: number; y: number; left: string; top: string }>>([])

  useEffect(() => {
    // Generate particle positions only on client side to avoid hydration mismatch
    setParticles(
      Array.from({ length: 50 }).map((_, i) => ({
        x: Math.cos((i * Math.PI) / 25) * 400 + Math.random() * 200,
        y: Math.sin((i * Math.PI) / 25) * 400 + Math.random() * 200,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }))
    )
  }, [])

  const handleRoleSelect = (route: string) => {
    // In a real app, this would set authentication state
    localStorage.setItem('userRole', route.split('/').pop() || '')
    router.push(route)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F0E] via-[#0F2E28] to-[#0B0F0E] relative overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0">
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full opacity-20"
            animate={{
              x: particle.x,
              y: particle.y,
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 10 + i,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
            style={{
              left: particle.left,
              top: particle.top,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
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
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Choose Your Role
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Access STABLE platform based on your healthcare role. Each role has specialized features and permissions.
          </p>
        </motion.div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {roles.map((role, index) => (
            <motion.div
              key={role.id}
              className="relative group cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              onClick={() => handleRoleSelect(role.route)}
            >
              <div className="h-full bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                {/* Role Icon */}
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${role.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <role.icon className="h-8 w-8 text-white" />
                </div>

                {/* Role Info */}
                <h3 className="text-2xl font-bold text-white mb-3">
                  {role.name}
                </h3>
                <p className="text-white/70 text-sm mb-6 leading-relaxed">
                  {role.description}
                </p>

                {/* Features */}
                <div className="space-y-2">
                  {role.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-white/60 text-sm">
                      <div className="w-1 h-1 bg-primary rounded-full" />
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Demo Section */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Not sure which role to choose?
            </h3>
            <p className="text-white/70 mb-6">
              Try our interactive demo to see how different roles interact within the STABLE platform.
            </p>
            <button
              onClick={() => router.push('/demo')}
              className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-[0_0_30px_rgba(0,255,178,0.4)] transition-all duration-300 transform hover:scale-105"
            >
              Launch Demo
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}