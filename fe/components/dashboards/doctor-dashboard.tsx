"use client"

import { motion } from "framer-motion"
import { useState } from "react"

export default function DoctorDashboard() {
  const [view, setView] = useState("patients")

  const patients = [
    { id: "1", name: "John Smith", lastVisit: "2025-01-20", status: "active", conditions: "Hypertension" },
    { id: "2", name: "Sarah Johnson", lastVisit: "2025-01-18", status: "follow-up", conditions: "Diabetes" },
    { id: "3", name: "Michael Brown", lastVisit: "2025-01-15", status: "active", conditions: "Cardio" },
  ]

  const recentPrescriptions = [
    { patient: "John Smith", drug: "Lisinopril 10mg", date: "2025-01-20" },
    { patient: "Sarah Johnson", drug: "Metformin 500mg", date: "2025-01-18" },
    { patient: "Michael Brown", drug: "Aspirin 81mg", date: "2025-01-15" },
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
          <h1 className="text-4xl font-bold text-foreground mb-2">Doctor Portal</h1>
          <p className="text-muted-foreground">Access authorized patient records and manage care</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Patients", value: "28", icon: "👥" },
            { label: "Prescriptions", value: "12", icon: "💊" },
            { label: "Diagnoses", value: "8", icon: "📋" },
            { label: "Analytics", value: "Updated", icon: "📊" },
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
              <div className="text-2xl font-bold text-secondary">{stat.value}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 glass-effect-strong rounded-2xl p-8 border-primary/20"
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">Authorized Patients</h2>

            <div className="space-y-3">
              {patients.map((patient) => (
                <motion.div
                  key={patient.id}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 glass-effect rounded-lg border border-primary/20 hover:border-primary/40 transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{patient.name}</h3>
                      <p className="text-sm text-muted-foreground">Condition: {patient.conditions}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        patient.status === "active" ? "bg-secondary/30 text-secondary" : "bg-primary/30 text-primary"
                      }`}
                    >
                      {patient.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Last visit: {patient.lastVisit}</p>
                </motion.div>
              ))}
            </div>

            <button className="w-full mt-6 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-[0_0_20px_rgba(0,255,178,0.3)] transition-all">
              + Add Diagnosis
            </button>
          </motion.div>

          {/* Prescriptions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-effect-strong rounded-2xl p-8 border-primary/20"
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">Recent Prescriptions</h2>

            <div className="space-y-4">
              {recentPrescriptions.map((rx, idx) => (
                <div key={idx} className="border-l-2 border-secondary pl-4 py-3">
                  <h3 className="font-semibold text-foreground text-sm">{rx.drug}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{rx.patient}</p>
                  <p className="text-xs text-primary">{rx.date}</p>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-secondary to-primary text-primary-foreground rounded-lg font-semibold hover:shadow-[0_0_30px_rgba(26,255,150,0.3)] transition-all">
              + New Prescription
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
