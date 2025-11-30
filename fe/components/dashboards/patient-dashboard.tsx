"use client"

import { motion } from "framer-motion"
import { useState } from "react"

export default function PatientDashboard() {
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null)

  const records = [
    { id: "1", name: "Blood Test Report", date: "2025-01-15", status: "completed" },
    { id: "2", name: "Cardiology Checkup", date: "2025-01-10", status: "completed" },
    { id: "3", name: "X-Ray Scan", date: "2025-01-05", status: "pending" },
    { id: "4", name: "Lab Work Results", date: "2024-12-28", status: "completed" },
  ]

  const sharedWith = [
    { name: "Dr. James Wilson", role: "Cardiologist", access: "permanent", lastAccessed: "2025-01-20" },
    { name: "Metro Hospital", role: "Hospital", access: "temporary", expiresIn: "5 days" },
    { name: "HealthCare Plus Insurance", role: "Insurance", access: "temporary", expiresIn: "30 days" },
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
          <h1 className="text-4xl font-bold text-foreground mb-2">My Medical Vault</h1>
          <p className="text-muted-foreground">Manage your health records and access permissions</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Records", value: "24", icon: "📄" },
            { label: "Active Shares", value: "3", icon: "👥" },
            { label: "Doctors Authorized", value: "2", icon: "⚕️" },
            { label: "Last Updated", value: "1h ago", icon: "⏱️" },
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
          {/* Medical Records */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 glass-effect-strong rounded-2xl p-8 border-primary/20"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">My Records</h2>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:shadow-[0_0_20px_rgba(0,255,178,0.3)] transition-all">
                + Upload
              </button>
            </div>

            <div className="space-y-3">
              {records.map((record) => (
                <motion.div
                  key={record.id}
                  whileHover={{ x: 5 }}
                  onClick={() => setSelectedRecord(record.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedRecord === record.id
                      ? "glass-effect-strong border-primary bg-primary/10"
                      : "border-primary/20 hover:border-primary/40"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-foreground">{record.name}</h3>
                      <p className="text-sm text-muted-foreground">{record.date}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        record.status === "completed" ? "bg-secondary/20 text-secondary" : "bg-primary/20 text-primary"
                      }`}
                    >
                      {record.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Access Control */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-effect-strong rounded-2xl p-8 border-primary/20"
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">Shared With</h2>

            <div className="space-y-4">
              {sharedWith.map((share, idx) => (
                <div key={idx} className="border-l-2 border-primary pl-4 py-2">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">{share.name}</h3>
                      <p className="text-xs text-muted-foreground">{share.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-semibold ${
                        share.access === "permanent" ? "bg-secondary/30 text-secondary" : "bg-primary/30 text-primary"
                      }`}
                    >
                      {share.access === "permanent" ? "∞ Permanent" : `⏱️ ${share.expiresIn}`}
                    </span>
                  </div>
                  <button className="mt-2 text-xs text-primary hover:text-primary/80 transition-colors">
                    Revoke Access →
                  </button>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg font-semibold hover:shadow-[0_0_30px_rgba(0,255,178,0.3)] transition-all">
              Grant New Access
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
