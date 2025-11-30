"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { User, Stethoscope, Building2, Shield, ArrowRight } from "lucide-react"

const roles = [
  {
    id: "patient",
    title: "Patients (User ID 1)",
    description: "Upload medical records, manage access permissions, and securely share data with healthcare providers",
    icon: User,
    color: "text-blue-400",
    gradient: "from-blue-600/20 to-blue-400/10",
    features: [
      "Upload & store medical records",
      "Grant permanent/temporary access",
      "Share with doctors & insurance",
      "View complete medical history"
    ]
  },
  {
    id: "doctor", 
    title: "Doctors (User ID 2)",
    description: "Access patient records, upload medical files, manage consultations, and collaborate with healthcare teams",
    icon: Stethoscope,
    color: "text-green-400",
    gradient: "from-green-600/20 to-green-400/10",
    features: [
      "Access authorized patient records",
      "Upload diagnoses & prescriptions", 
      "Manage patient consultations",
      "Collaborate with hospitals"
    ]
  },
  {
    id: "hospital",
    title: "Hospitals (User ID 3)", 
    description: "Manage department reports, upload test results, handle admissions, and coordinate care delivery",
    icon: Building2,
    color: "text-purple-400",
    gradient: "from-purple-600/20 to-purple-400/10",
    features: [
      "Upload lab & test results",
      "Manage patient admissions",
      "Department coordination",
      "Medical staff collaboration"
    ]
  },
  {
    id: "insurance",
    title: "Insurance (User ID 4)",
    description: "Review claims, authorize treatments, access medical records for verification, and manage policies",
    icon: Shield, 
    color: "text-orange-400",
    gradient: "from-orange-600/20 to-orange-400/10",
    features: [
      "Review & approve claims",
      "Verify medical treatments",
      "Access authorized records",
      "Manage policy coverage"
    ]
  }
]

export default function FeaturesSection() {
  const router = useRouter()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section className="relative w-full py-24 px-4 bg-gradient-to-b from-background to-accent/10 overflow-hidden">
      <div className="relative z-10 container mx-auto max-w-7xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance text-white">
            Centralized Blockchain Vault for All Healthcare Roles
          </h2>
          <p className="text-lg text-white/70 max-w-3xl mx-auto">
            STABLE connects patients, doctors, hospitals, and insurance companies through secure, role-based access to medical data
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {roles.map((role, index) => (
            <motion.div key={role.id} variants={itemVariants} whileHover={{ scale: 1.02 }}>
              <div className={`glass-effect rounded-xl p-8 border-primary/10 hover:border-primary/30 transition-all h-full bg-gradient-to-br ${role.gradient} border border-white/10`}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <role.icon className={`h-6 w-6 ${role.color}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{role.title}</h3>
                  </div>
                </div>
                
                <p className="text-white/80 leading-relaxed mb-6">{role.description}</p>
                
                <div className="space-y-2 mb-6">
                  {role.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-white/70 text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {feature}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => router.push(`/dashboard/${role.id}`)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-primary/20 text-primary rounded-lg font-semibold hover:bg-primary/30 transition-all group"
                >
                  Try {role.id.charAt(0).toUpperCase() + role.id.slice(1)} Dashboard
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
