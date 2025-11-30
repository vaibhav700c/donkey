"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import PatientDashboard from "@/components/dashboards/patient-dashboard"
import DoctorDashboard from "@/components/dashboards/doctor-dashboard"
import HospitalDashboard from "@/components/dashboards/hospital-dashboard"
import InsuranceDashboard from "@/components/dashboards/insurance-dashboard"

export default function DashboardsPage() {
  const [activeRole, setActiveRole] = useState("patient")

  const roles = [
    { id: "patient", label: "Patient (ID: 1)", icon: "👤" },
    { id: "doctor", label: "Doctor (ID: 2)", icon: "⚕️" },
    { id: "hospital", label: "Hospital (ID: 3)", icon: "🏥" },
    { id: "insurance", label: "Insurance (ID: 4)", icon: "📋" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      <div className="sticky top-0 z-50 glass-effect-strong border-b border-primary/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-primary">MediVault Dashboards</h1>
            <button className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-semibold hover:bg-primary/20 transition-colors">
              Documentation
            </button>
          </div>

          {/* Role Selector */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {roles.map((role) => (
              <motion.button
                key={role.id}
                onClick={() => setActiveRole(role.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                  activeRole === role.id
                    ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-[0_0_20px_rgba(0,255,178,0.3)]"
                    : "glass-effect border border-primary/20 text-foreground hover:border-primary/40"
                }`}
              >
                <span className="mr-2">{role.icon}</span>
                {role.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <motion.div
        key={activeRole}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {activeRole === "patient" && <PatientDashboard />}
        {activeRole === "doctor" && <DoctorDashboard />}
        {activeRole === "hospital" && <HospitalDashboard />}
        {activeRole === "insurance" && <InsuranceDashboard />}
      </motion.div>
    </div>
  )
}
