"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { 
  Upload, 
  FileText, 
  Share2, 
  Clock, 
  Shield, 
  User, 
  Heart,
  Activity,
  Calendar,
  Plus,
  Eye,
  Download,
  CheckCircle,
  XCircle,
  History,
  Users,
  Settings,
  X,
  ShieldAlert
} from "lucide-react"
import { patients, medicalRecords, doctors, insuranceCompanies, getPatientRecords, Patient, MedicalRecord, accessPermissions } from "@/lib/dummy-data"
import AccessControl from "@/components/access-control"
import DocumentViewHistory from "@/components/document-view-history"
import TransactionHistoryView from "@/components/transaction-history"
import PeerAccessManagement from "@/components/peer-access-management"
import Navbar from "@/components/navbar"

// Healthcare Icons for background particles (matching hero section)
const HealthcareIcons = {
  heart: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  ),
  pulse: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 13h4l3-8 3 12 3-4h5v-2h-4l-2 2.5-3.5-10.5L8.5 15H3z"/>
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
    </svg>
  ),
  medical: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z"/>
    </svg>
  ),
}

const healthIcons = Object.values(HealthcareIcons)
const blueShades = ['#60A5FA', '#3B82F6', '#2563EB', '#1D4ED8', '#1E40AF', '#93C5FD', '#BFDBFE', '#DBEAFE']

const createDeterministicParticles = (count: number, seed: number) => {
  const particles = []
  for (let i = 0; i < count; i++) {
    const x = ((Math.sin(i * 12.9898 + seed) * 43758.5453) % 1) * 100
    const y = ((Math.cos(i * 78.233 + seed) * 43758.5453) % 1) * 100
    const size = 16 + ((Math.sin(i * 7.91 + seed) * 43758.5453) % 1) * 24
    const animationOffset = ((Math.sin(i * 15.23 + seed) * 43758.5453) % 1) * 100
    const iconIndex = Math.floor(Math.abs(Math.sin(i * 9.87 + seed) * 43758.5453) % healthIcons.length)
    const colorIndex = Math.floor(Math.abs(Math.sin(i * 6.54 + seed) * 43758.5453) % blueShades.length)
    
    particles.push({
      id: i,
      left: Math.abs(x),
      top: Math.abs(y),
      size: Math.abs(size),
      animationOffset: Math.abs(animationOffset),
      icon: healthIcons[iconIndex],
      color: blueShades[colorIndex]
    })
  }
  return particles
}

const healthParticles = createDeterministicParticles(20, 2)

export default function PatientDashboard() {
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null)
  const [patientRecords, setPatientRecords] = useState<MedicalRecord[]>([])
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadTitle, setUploadTitle] = useState('')
  const [uploadType, setUploadType] = useState('Consultation')
  const [uploadDescription, setUploadDescription] = useState('')
  const [showCharles, setShowCharles] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // In a real app, this would get the current authenticated patient
    const patient = patients[0] // Using first patient as demo
    setCurrentPatient(patient)
    if (patient) {
      setPatientRecords(getPatientRecords(patient.id))
    }
  }, [])

  const stats = [
    {
      title: "Total Records",
      value: patientRecords.length.toString(),
      icon: FileText,
      color: "text-blue-400"
    },
    {
      title: "Shared Access",
      value: patientRecords.reduce((acc, record) => acc + record.permissions.length, 0).toString(),
      icon: Share2,
      color: "text-green-400"
    },
    {
      title: "Recent Uploads",
      value: patientRecords.filter(record => 
        new Date(record.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ).length.toString(),
      icon: Upload,
      color: "text-purple-400"
    },
    {
      title: "Active Permissions",
      value: patientRecords.reduce((acc, record) => 
        acc + record.permissions.filter(p => 
          p.type === 'permanent' || (p.expiresAt && new Date(p.expiresAt) > new Date())
        ).length, 0
      ).toString(),
      icon: Shield,
      color: "text-orange-400"
    }
  ]

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'records', label: 'Medical Records', icon: FileText },
    { id: 'access-control', label: 'Access Control', icon: Shield },
    { id: 'view-history', label: 'View History', icon: Eye },
    { id: 'transactions', label: 'Transactions', icon: History },
    { id: 'peer-access', label: 'Peer Access', icon: Users },
    { id: 'upload', label: 'Upload Record', icon: Upload }
  ]

  if (!currentPatient) {
    return (
      <>
        <Navbar userEmail={currentPatient?.email} userRole="Patient" />
        <div className="min-h-screen bg-gradient-to-br from-[#0B0F0E] via-[#0F2E28] to-[#0B0F0E] flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading patient data...</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar userEmail={currentPatient.email} userRole="Patient" />
      <div className="min-h-screen bg-gradient-to-br from-[#0B0F0E] via-[#0F2E28] to-[#0B0F0E] relative overflow-hidden">
        {/* Animated Healthcare Icon Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {healthParticles.map((particle) => (
            <motion.div
              key={`health-${particle.id}`}
              className="absolute"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                color: particle.color,
                opacity: 0.15,
                filter: `drop-shadow(0 0 3px ${particle.color})`,
              }}
              animate={{
                y: [-30, 30, -30],
                x: [-10, 10, -10],
                rotate: [0, 15, -15, 0],
                opacity: [0.1, 0.25, 0.1],
                scale: [0.9, 1.1, 0.9],
              }}
              transition={{
                duration: 10 + (particle.animationOffset * 0.08),
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                delay: particle.animationOffset * 0.05,
                ease: "easeInOut",
              }}
            >
              {particle.icon}
            </motion.div>
          ))}
        </div>
        
        <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Patient Portal</h1>
              <p className="text-white/70">Welcome back, {currentPatient.name}</p>
            </div>
          </div>

          {/* Patient Info Card */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <p className="text-white/60 text-sm">Blood Type</p>
                <p className="text-white font-semibold">{currentPatient.bloodType}</p>
              </div>
              <div>
                <p className="text-white/60 text-sm">Date of Birth</p>
                <p className="text-white font-semibold">{currentPatient.dateOfBirth}</p>
              </div>
              <div>
                <p className="text-white/60 text-sm">Emergency Contact</p>
                <p className="text-white font-semibold">{currentPatient.emergencyContact.name}</p>
              </div>
              <div>
                <p className="text-white/60 text-sm">Allergies</p>
                <p className="text-white font-semibold">{currentPatient.allergies && currentPatient.allergies.length > 0 ? currentPatient.allergies.map(a => `${a.name}${a.verifiedBy ? ' (verified)' : ''}`).join(', ') : 'None'}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Emergency Summary: surgical complexities and important notes */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="bg-gradient-to-r from-red-900/20 via-red-800/15 to-red-900/20 backdrop-blur-lg border-2 border-red-500/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(239,68,68,0.15)]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                <ShieldAlert className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Emergency Summary</h3>
                <p className="text-red-300/70 text-sm">Critical information for emergency responders</p>
              </div>
            </div>
            <div className="space-y-3 mt-4">
              <div className="p-4 bg-white/5 rounded-xl border border-red-500/20">
                <div className="flex items-start gap-2">
                  <Heart className="h-5 w-5 text-red-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-red-300 font-semibold mb-1">Known Allergies</p>
                    <p className="text-white text-sm">
                      {currentPatient.allergies && currentPatient.allergies.length > 0 ? (
                        currentPatient.allergies.map((a, idx) => (
                          <span key={idx} className="inline-block mr-2 mb-1">
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-lg">
                              {a.name}
                              {a.verifiedBy && <CheckCircle className="h-3 w-3 text-green-400" />}
                            </span>
                            {a.note && <span className="text-white/60 text-xs ml-1">({a.note})</span>}
                          </span>
                        ))
                      ) : (
                        <span className="text-white/60">None reported</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-red-500/20">
                <div className="flex items-start gap-2">
                  <Activity className="h-5 w-5 text-red-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-red-300 font-semibold mb-1">Surgical History</p>
                    {currentPatient.surgicalHistory && currentPatient.surgicalHistory.length > 0 ? (
                      <div className="space-y-2">
                        {currentPatient.surgicalHistory.map((s, idx) => (
                          <div key={idx} className="text-sm">
                            <p className="text-white font-medium">{s.procedure}</p>
                            <div className="flex items-center gap-2 text-white/60 text-xs mt-1">
                              <span>{s.date}</span>
                              <span>•</span>
                              <span className={`px-2 py-0.5 rounded ${
                                s.complexity === 'high' ? 'bg-red-500/20 text-red-300' :
                                s.complexity === 'moderate' ? 'bg-yellow-500/20 text-yellow-300' :
                                'bg-green-500/20 text-green-300'
                              }`}>
                                {s.complexity || 'unknown'} complexity
                              </span>
                            </div>
                            {s.notes && <p className="text-white/60 text-xs mt-1">{s.notes}</p>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-white/60 text-sm">No surgical history recorded</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid md:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {stats.map((stat, index) => (
            <div key={stat.title} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
                <span className="text-2xl font-bold text-white">{stat.value}</span>
              </div>
              <p className="text-white/70 text-sm">{stat.title}</p>
            </div>
          ))}
        </motion.div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-2 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Recent Activity */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {patientRecords.slice(0, 3).map((record) => (
                    <div key={record.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                      <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-semibold">{record.title}</p>
                        <p className="text-white/60 text-sm">{record.date}</p>
                      </div>
                      <span className="text-primary text-sm">
                        {record.permissions.length} shared
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <button 
                    onClick={() => setActiveTab('upload')}
                    className="p-6 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl border border-primary/20 hover:border-primary/40 transition-all duration-300 text-center"
                  >
                    <Upload className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-white font-semibold">Upload Record</p>
                  </button>
                  <button 
                    onClick={() => setActiveTab('access-control')}
                    className="p-6 bg-gradient-to-r from-blue-500/20 to-blue-500/10 rounded-xl border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 text-center"
                  >
                    <Share2 className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <p className="text-white font-semibold">Manage Access</p>
                  </button>
                  <button 
                    onClick={() => setActiveTab('records')}
                    className="p-6 bg-gradient-to-r from-purple-500/20 to-purple-500/10 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 text-center"
                  >
                    <FileText className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                    <p className="text-white font-semibold">View Records</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'records' && (
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">Medical Records</h3>
              <div className="space-y-4">
                {patientRecords.map((record) => (
                  <div key={record.id} className="p-6 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-2">{record.title}</h4>
                        <p className="text-white/70 text-sm mb-2">{record.description}</p>
                        <div className="flex items-center gap-4 text-sm text-white/60">
                          <span>{record.date}</span>
                          <span>•</span>
                          <span className="capitalize">{record.type.replace('_', ' ')}</span>
                          <span>•</span>
                          <span>Dr. {doctors.find(d => d.id === record.doctorId)?.name}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          record.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {record.status}
                        </span>
                      </div>
                    </div>
                    
                    {/* Files */}
                    {record.files.length > 0 && (
                      <div className="mb-4">
                        <p className="text-white/60 text-sm mb-2">Attachments:</p>
                        <div className="flex gap-2">
                          {record.files.map((file, index) => (
                            <div key={index} className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg">
                              <FileText className="h-4 w-4 text-primary" />
                              <span className="text-white text-sm">{file.name}</span>
                              <Download className="h-4 w-4 text-white/60 hover:text-white cursor-pointer" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Permissions */}
                    <div>
                      <p className="text-white/60 text-sm mb-2">Shared with:</p>
                      <div className="flex gap-2 flex-wrap">
                        {record.permissions.map((permission, index) => {
                          // Find matching access permission to get color coding
                          const accessPerm = accessPermissions.find(ap => 
                            (ap.entityId === permission.doctorId || ap.entityId === permission.insuranceId) && 
                            ap.patientId === currentPatient.id
                          )
                          
                          const isSystemAwarded = accessPerm?.awardedBySystem
                          const colorClass = accessPerm?.color || 'blue'
                          
                          const getPermissionColor = (color: string, isSystem: boolean) => {
                            const baseColors: Record<string, string> = {
                              blue: isSystem ? 'bg-blue-500/30 text-blue-200 border-blue-400' : 'bg-blue-100/20 text-blue-300 border-blue-500',
                              green: isSystem ? 'bg-green-500/30 text-green-200 border-green-400' : 'bg-green-100/20 text-green-300 border-green-500',
                              purple: isSystem ? 'bg-purple-500/30 text-purple-200 border-purple-400' : 'bg-purple-100/20 text-purple-300 border-purple-500',
                              orange: isSystem ? 'bg-orange-500/30 text-orange-200 border-orange-400' : 'bg-orange-100/20 text-orange-300 border-orange-500'
                            }
                            return baseColors[color] || baseColors.blue
                          }
                          
                          return (
                            <div key={index} className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${getPermissionColor(colorClass, !!isSystemAwarded)}`}>
                              <span className="text-xs font-medium">
                                {permission.doctorId ? `Dr. ${doctors.find(d => d.id === permission.doctorId)?.name}` : 
                                 permission.insuranceId ? insuranceCompanies.find(i => i.id === permission.insuranceId)?.name : 
                                 'Unknown'}
                              </span>
                              <span className="text-xs opacity-75">
                                ({permission.type})
                              </span>
                              {isSystemAwarded && (
                                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                                  System Awarded
                                </span>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">Upload Medical Record</h3>
              
              <div className="space-y-6">
                {/* Upload Form */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Record Title</label>
                    <input
                      type="text"
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50"
                      placeholder="Enter record title..."
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Record Type</label>
                    <select 
                      value={uploadType}
                      onChange={(e) => setUploadType(e.target.value)}
                      className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white"
                    >
                      <option>Consultation</option>
                      <option>Lab Report</option>
                      <option>Prescription</option>
                      <option>Imaging</option>
                      <option>Surgery</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-2">Description</label>
                  <textarea
                    value={uploadDescription}
                    onChange={(e) => setUploadDescription(e.target.value)}
                    className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 h-24"
                    placeholder="Enter description..."
                  />
                </div>

                {/* File Upload */}
                <div 
                  className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-primary/50 transition-colors"
                  onDrop={(e) => {
                    e.preventDefault()
                    const files = e.dataTransfer.files
                    if (files.length > 0) {
                      setSelectedFile(files[0])
                    }
                  }}
                  onDragOver={(e) => e.preventDefault()}
                >
                  {selectedFile ? (
                    <div className="space-y-4">
                      <FileText className="h-12 w-12 text-primary mx-auto" />
                      <div>
                        <p className="text-white font-semibold">{selectedFile.name}</p>
                        <p className="text-white/50 text-sm">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                      </div>
                      <button
                        onClick={() => setSelectedFile(null)}
                        className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
                      >
                        Remove File
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-12 w-12 text-white/60 mx-auto mb-4" />
                      <p className="text-white/70 mb-2">Drag and drop files here, or click to browse</p>
                      <p className="text-white/50 text-sm">Supports PDF, JPEG, PNG files up to 10MB</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setSelectedFile(file)
                          }
                        }}
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-lg transition-all"
                      >
                        Browse Files
                      </button>
                    </>
                  )}
                </div>

                {/* Permissions */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Set Permissions</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="text-white font-semibold">Dr. Emily Rodriguez</p>
                        <p className="text-white/60 text-sm">Cardiology</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <select className="bg-white/5 border border-white/20 rounded px-3 py-1 text-white text-sm">
                          <option>Permanent</option>
                          <option>Temporary</option>
                        </select>
                        <input type="checkbox" className="w-5 h-5 accent-primary" />
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    if (!uploadTitle || !selectedFile) {
                      alert('Please fill in all required fields and select a file')
                      return
                    }
                    
                    // Add dummy record
                    const newRecord: MedicalRecord = {
                      id: `rec${Date.now()}`,
                      patientId: currentPatient?.id || 'pat1',
                      doctorId: 'doc1',
                      type: uploadType.toLowerCase().replace(' ', '_') as any,
                      title: uploadTitle,
                      description: uploadDescription,
                      date: new Date().toISOString(),
                      files: [{
                        name: selectedFile.name,
                        url: `ipfs://Qm${Math.random().toString(36).substring(7)}`,
                        type: selectedFile.type || 'application/pdf'
                      }],
                      permissions: [],
                      status: 'active'
                    }
                    
                    setPatientRecords([newRecord, ...patientRecords])
                    
                    // Reset form
                    setUploadTitle('')
                    setUploadType('Consultation')
                    setUploadDescription('')
                    setSelectedFile(null)
                    
                    // Switch to records tab and show Charles video after page loads
                    setTimeout(() => {
                      setActiveTab('records')
                      // Show Charles video after switching tabs
                      setTimeout(() => {
                        setShowCharles(true)
                      }, 500)
                    }, 100)
                  }}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-[0_0_30px_rgba(0,255,178,0.4)] transition-all"
                >
                  Upload Record
                </button>
              </div>
            </div>
          )}

          {/* Charles Hoskinson popup - BIG and LOOPING */}
          {showCharles && (
            <div className="fixed bottom-8 right-8 z-50 w-[800px] bg-black rounded-xl shadow-2xl border-4 border-[#00ffb2] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="relative">
                <video
                  ref={videoRef}
                  src="/charles.mp4"
                  autoPlay
                  loop
                  muted
                  className="w-full h-auto"
                />
                <button
                  onClick={() => setShowCharles(false)}
                  className="absolute top-3 right-3 bg-black/80 hover:bg-black text-white rounded-full p-2 transition-colors shadow-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="bg-linear-to-r from-[#00ffb2] to-[#1aff96] p-4">
                <p className="text-black font-bold text-center text-lg">
                  I heard someone said decentralization. I came.
                </p>
              </div>
            </div>
          )}

          {/* Access Control Tab */}
          {activeTab === 'access-control' && (
            <div>
              <AccessControl patientId={currentPatient.id} />
            </div>
          )}

          {/* View History Tab */}
          {activeTab === 'view-history' && (
            <div>
              <DocumentViewHistory patientId={currentPatient.id} />
            </div>
          )}

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div>
              <TransactionHistoryView patientId={currentPatient.id} />
            </div>
          )}

          {/* Peer Access Tab */}
          {activeTab === 'peer-access' && (
            <div>
              <PeerAccessManagement patientId={currentPatient.id} />
            </div>
          )}
        </motion.div>
      </div>
    </div>
    </>
  )
}