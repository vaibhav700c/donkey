"use client"

import { motion } from "framer-motion"

const roles = [
  {
    id: 1,
    title: "Patient Dashboard",
    description: "Upload records, manage access permissions, view timeline history",
    icon: "👤",
    color: "from-primary to-secondary",
    gradient: "from-primary/20 to-transparent",
  },
  {
    id: 2,
    title: "Doctor Dashboard",
    description: "Access authorized records, upload prescriptions, manage diagnoses",
    icon: "⚕️",
    color: "from-secondary to-muted",
    gradient: "from-secondary/20 to-transparent",
  },
  {
    id: 3,
    title: "Hospital Control Panel",
    description: "Upload reports, test results, admission and discharge records",
    icon: "🏥",
    color: "from-muted to-primary",
    gradient: "from-muted/20 to-transparent",
  },
  {
    id: 4,
    title: "Insurance Verification",
    description: "View records, authorize claims, track claim processing status",
    icon: "📋",
    color: "from-primary to-muted",
    gradient: "from-primary/20 to-transparent",
  },
]

export default function DashboardCards() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
    <section className="relative w-full py-24 px-4 bg-background overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent opacity-30" />

      <motion.div
        className="relative z-10 container mx-auto max-w-6xl"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Role-Based Healthcare Access
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tailored dashboards for every stakeholder in the medical ecosystem
          </p>
        </motion.div>

        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={containerVariants}>
          {roles.map((role) => (
            <motion.div key={role.id} variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
              <div className="glass-effect-strong rounded-2xl p-8 h-full border-primary/20 hover:border-primary/50 transition-all duration-300">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`text-4xl bg-gradient-to-br ${role.gradient} p-3 rounded-lg`}>{role.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{role.title}</h3>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">{role.description}</p>
                <button className="mt-6 px-4 py-2 text-sm font-semibold text-primary border border-primary rounded-lg hover:bg-primary/10 transition-colors">
                  Learn More →
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
