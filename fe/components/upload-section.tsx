"use client"

import { motion } from "framer-motion"
import { useState } from "react"

export default function UploadSection() {
  const [dragActive, setDragActive] = useState(false)

  return (
    <section className="relative w-full py-24 px-4 bg-background overflow-hidden">
      <div className="relative z-10 container mx-auto max-w-4xl">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Secure File Upload & Sharing</h2>
          <p className="text-lg text-muted-foreground">
            Drag and drop your medical records with granular access controls
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Upload area */}
          <motion.div
            className={`glass-effect-strong rounded-2xl p-12 border-2 border-dashed transition-all cursor-pointer ${
              dragActive ? "border-primary bg-primary/10" : "border-primary/30"
            }`}
            onDragOver={() => setDragActive(true)}
            onDragLeave={() => setDragActive(false)}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center">
              <div className="text-5xl mb-4">📁</div>
              <h3 className="text-xl font-bold text-foreground mb-2">Upload Medical Records</h3>
              <p className="text-muted-foreground mb-4">Drag files here or click to browse</p>
              <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-[0_0_20px_rgba(0,255,178,0.3)] transition-all">
                Choose Files
              </button>
            </div>
          </motion.div>

          {/* Access permissions */}
          <motion.div
            className="glass-effect-strong rounded-2xl p-8 border-primary/20"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-xl font-bold text-foreground mb-6">Access Permissions</h3>

            <div className="space-y-4">
              {[
                { label: "Doctors", type: "role" },
                { label: "Hospitals", type: "role" },
                { label: "Insurance", type: "role" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <label className="text-foreground font-medium">{item.label}</label>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-xs rounded-lg border border-primary text-primary hover:bg-primary/10 transition-colors">
                      Permanent
                    </button>
                    <button className="px-3 py-1 text-xs rounded-lg border border-primary/50 text-muted-foreground hover:bg-primary/5 transition-colors">
                      Temporary
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-8 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg font-semibold hover:shadow-[0_0_30px_rgba(0,255,178,0.4)] transition-all">
              Share Records
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
