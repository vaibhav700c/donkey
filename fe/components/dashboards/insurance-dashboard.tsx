"use client"

import { motion } from "framer-motion"

export default function InsuranceDashboard() {
  const claims = [
    { id: "1", patient: "John Smith", amount: "$2,500", status: "approved", verified: true },
    { id: "2", patient: "Sarah Johnson", amount: "$1,850", status: "pending", verified: false },
    { id: "3", patient: "Michael Brown", amount: "$3,200", status: "approved", verified: true },
  ]

  const claimProcessing = [
    { stage: "Submitted", completed: 156 },
    { stage: "Verified", completed: 142 },
    { stage: "Approved", completed: 138 },
    { stage: "Paid", completed: 125 },
  ]

  return (
    <div className="min-h-screen bg-background p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Insurance Claims Portal</h1>
          <p className="text-muted-foreground">Verify records, authorize claims, and track processing</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Claims Today", value: "24", icon: "📊" },
            { label: "Amount Verified", value: "$156K", icon: "✓" },
            { label: "Pending Review", value: "8", icon: "⏳" },
            { label: "Approval Rate", value: "94%", icon: "📈" },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-effect-strong rounded-xl p-6 border-primary/20"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-muted-foreground text-sm">{stat.label}</div>
              <div className="text-2xl font-bold text-primary">{stat.value}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Claims */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 glass-effect-strong rounded-2xl p-8 border-primary/20"
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">Active Claims</h2>

            <div className="space-y-3">
              {claims.map((claim) => (
                <motion.div
                  key={claim.id}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 glass-effect rounded-lg border border-primary/20 hover:border-primary/40 transition-all"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{claim.patient}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        {claim.verified && <span className="text-secondary">✓ Verified</span>}
                        {!claim.verified && <span className="text-primary">⏳ Verifying</span>}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary mb-1">{claim.amount}</div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          claim.status === "approved" ? "bg-secondary/30 text-secondary" : "bg-primary/30 text-primary"
                        }`}
                      >
                        {claim.status}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <button className="w-full mt-6 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-[0_0_20px_rgba(0,255,178,0.3)] transition-all">
              Review All Claims
            </button>
          </motion.div>

          {/* Processing Pipeline */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-effect-strong rounded-2xl p-8 border-primary/20"
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">Processing Pipeline</h2>

            <div className="space-y-4">
              {claimProcessing.map((stage, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-foreground">{stage.stage}</span>
                    <span className="text-sm font-bold text-primary">{stage.completed}</span>
                  </div>
                  <div className="w-full h-2 bg-primary/20 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(stage.completed / 156) * 100}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.1 }}
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg font-semibold hover:shadow-[0_0_30px_rgba(0,255,178,0.3)] transition-all">
              Analytics Dashboard
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
