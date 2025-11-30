"use client"

import { motion } from "framer-motion"

export default function HospitalDashboard() {
  const admissions = [
    { id: "1", patient: "John Smith", admission: "2025-01-18", status: "admitted", room: "301" },
    { id: "2", patient: "Maria Garcia", admission: "2025-01-19", status: "admitted", room: "215" },
    { id: "3", patient: "Robert Lee", admission: "2025-01-15", status: "discharged", room: "102" },
  ]

  const documents = [
    { name: "Lab Reports", uploaded: "2025-01-20", count: 45 },
    { name: "Discharge Summaries", uploaded: "2025-01-19", count: 12 },
    { name: "Imaging Studies", uploaded: "2025-01-20", count: 28 },
    { name: "Vital Signs", uploaded: "2025-01-20", count: 156 },
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
          <h1 className="text-4xl font-bold text-foreground mb-2">Hospital Control Panel</h1>
          <p className="text-muted-foreground">Manage patient admissions and medical documents</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Admitted Patients", value: "156", icon: "🏥" },
            { label: "Documents Uploaded", value: "241", icon: "📂" },
            { label: "Active Records", value: "89", icon: "📋" },
            { label: "System Status", value: "Operational", icon: "✓" },
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
              <div className="text-2xl font-bold text-muted">{stat.value}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Admissions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 glass-effect-strong rounded-2xl p-8 border-primary/20"
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">Current Admissions</h2>

            <div className="space-y-3">
              {admissions.map((admission) => (
                <motion.div
                  key={admission.id}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 glass-effect rounded-lg border border-primary/20 hover:border-primary/40 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{admission.patient}</h3>
                      <p className="text-sm text-muted-foreground">Room {admission.room}</p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          admission.status === "admitted" ? "bg-muted/30 text-muted" : "bg-primary/30 text-primary"
                        }`}
                      >
                        {admission.status}
                      </span>
                      <p className="text-xs text-muted-foreground mt-2">{admission.admission}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <button className="w-full mt-6 px-4 py-3 bg-muted text-primary-foreground rounded-lg font-semibold hover:shadow-[0_0_20px_rgba(12,225,165,0.3)] transition-all">
              + New Admission
            </button>
          </motion.div>

          {/* Documents */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-effect-strong rounded-2xl p-8 border-primary/20"
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">Document Library</h2>

            <div className="space-y-3">
              {documents.map((doc, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ x: 5 }}
                  className="p-4 glass-effect rounded-lg border border-primary/20 cursor-pointer hover:border-primary/40 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">{doc.name}</h3>
                      <p className="text-xs text-muted-foreground">{doc.uploaded}</p>
                    </div>
                    <span className="text-primary font-bold">{doc.count}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <button className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-muted to-secondary text-primary-foreground rounded-lg font-semibold hover:shadow-[0_0_30px_rgba(12,225,165,0.3)] transition-all">
              + Upload Documents
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
