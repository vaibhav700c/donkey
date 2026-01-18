"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Stethoscope, 
  Users, 
  FileText, 
  Calendar, 
  Clock,
  Upload,
  Search,
  Filter,
  Eye,
  Edit3,
  Phone,
  Mail,
  MapPin,
  X,
  Key,
  Shield,
  CheckCircle,
  ShieldAlert,
  CheckCircle2
} from "lucide-react"
import { doctors, patients, medicalRecords, getDoctorPatients, Doctor, Patient, MedicalRecord } from "@/lib/dummy-data"
import Navbar from "@/components/navbar"

// Healthcare Icons for background particles (matching hero section)
const HealthcareIcons = {
  stethoscope: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm0 4c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1 3.5c-1.68 0-3.22.67-4.34 1.76C12.82 16.15 12 14.88 12 13.5V4c0-.55.45-1 1-1h1V1h-1c-1.65 0-3 1.35-3 3v9.5c0 2.76 2.24 5 5 5 .28 0 .5.22.5.5s-.22.5-.5.5c-2.21 0-4-1.79-4-4V11h2V4H4v7h2v4c0 3.31 2.69 6 6 6 1.66 0 3-1.34 3-3s-1.34-3-3-3z"/>
    </svg>
  ),
  pulse: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 13h4l3-8 3 12 3-4h5v-2h-4l-2 2.5-3.5-10.5L8.5 15H3z"/>
    </svg>
  ),
  medical: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z"/>
    </svg>
  ),
  pill: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.22 11.29l7.07-7.07c2.34-2.34 6.14-2.34 8.49 0 2.34 2.34 2.34 6.14 0 8.49l-7.07 7.07c-2.34 2.34-6.14 2.34-8.49 0-2.34-2.34-2.34-6.14 0-8.49zM5.64 12.71c-1.56 1.56-1.56 4.09 0 5.65 1.56 1.56 4.09 1.56 5.65 0l7.07-7.07c1.56-1.56 1.56-4.09 0-5.65-1.56-1.56-4.09-1.56-5.65 0l-7.07 7.07zM11 6.83l4.24 4.24-6.36 6.36L4.64 13.2 11 6.83z"/>
    </svg>
  ),
}

const healthIcons = Object.values(HealthcareIcons)
const greenShades = ['#10B981', '#059669', '#047857', '#065F46', '#064E3B', '#34D399', '#6EE7B7', '#A7F3D0']

const createDeterministicParticles = (count: number, seed: number) => {
  const particles = []
  for (let i = 0; i < count; i++) {
    const x = ((Math.sin(i * 12.9898 + seed) * 43758.5453) % 1) * 100
    const y = ((Math.cos(i * 78.233 + seed) * 43758.5453) % 1) * 100
    const size = 16 + ((Math.sin(i * 7.91 + seed) * 43758.5453) % 1) * 24
    const animationOffset = ((Math.sin(i * 15.23 + seed) * 43758.5453) % 1) * 100
    const iconIndex = Math.floor(Math.abs(Math.sin(i * 9.87 + seed) * 43758.5453) % healthIcons.length)
    const colorIndex = Math.floor(Math.abs(Math.sin(i * 6.54 + seed) * 43758.5453) % greenShades.length)
    
    particles.push({
      id: i,
      left: Math.abs(x),
      top: Math.abs(y),
      size: Math.abs(size),
      animationOffset: Math.abs(animationOffset),
      icon: healthIcons[iconIndex],
      color: greenShades[colorIndex]
    })
  }
  return particles
}

const healthParticles = createDeterministicParticles(20, 3)

export default function DoctorDashboard() {
  const [currentDoctor, setCurrentDoctor] = useState<Doctor | null>(null)
  const [doctorPatients, setDoctorPatients] = useState<Patient[]>([])
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [showSnakeVibe, setShowSnakeVibe] = useState(false)
  const [showNiceTry, setShowNiceTry] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadTitle, setUploadTitle] = useState('')
  const [uploadType, setUploadType] = useState('Consultation')
  const [uploadDescription, setUploadDescription] = useState('')
  // Track which patients have access granted (using patient IDs)
  const [patientAccessGranted, setPatientAccessGranted] = useState<Set<string>>(new Set(['P001'])) // Demo: only Sarah Johnson has access
  // Allergy modal state
  const [showAllergyModal, setShowAllergyModal] = useState(false)
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null)
  const [allergyName, setAllergyName] = useState('')
  const [allergyNote, setAllergyNote] = useState('')
  const [allergySeverity, setAllergySeverity] = useState<'mild' | 'moderate' | 'severe'>('moderate')

  useEffect(() => {
    // In a real app, this would get the current authenticated doctor
    const doctor = doctors[0] // Using first doctor as demo
    setCurrentDoctor(doctor)
    if (doctor) {
      setDoctorPatients(getDoctorPatients(doctor.id))
    }
  }, [])

  const handleUploadRecord = () => {
    if (!selectedFile || !uploadTitle) {
      alert('Please fill in all required fields and select a file')
      return
    }

    setIsUploading(true)
    setUploadProgress(0)
    setUploadComplete(false)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploadComplete(true)
          // Hide loader after showing success
          setTimeout(() => {
            setIsUploading(false)
            setUploadComplete(false)
            setUploadProgress(0)
            // Reset form
            setSelectedFile(null)
            setUploadTitle('')
            setUploadDescription('')
            setUploadType('Consultation')
          }, 2000)
          return 100
        }
        return prev + 1
      })
    }, 100) // 10 seconds total (100ms × 100 steps)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleViewPatientRecord = (patientId: string) => {
    if (!patientAccessGranted.has(patientId)) {
      setShowNiceTry(true)
    } else {
      // Handle viewing record (would show record details in real app)
      alert('Viewing patient record...')
    }
  }

  const handleRequestAccess = (patientId: string) => {
    setShowSnakeVibe(true)
    setTimeout(() => setShowSnakeVibe(false), 5000)
  }

  const handleAddAllergy = (patientId: string) => {
    setSelectedPatientId(patientId)
    setShowAllergyModal(true)
  }

  const handleSaveAllergy = () => {
    if (!allergyName.trim() || !selectedPatientId) return

    const note = allergyNote.trim() ? `${allergyNote.trim()} (${allergySeverity} severity)` : `${allergySeverity} severity`

    // Update local state copy
    setDoctorPatients(prev => prev.map(p => {
      if (p.id === selectedPatientId) {
        const updated = { ...p }
        if (!updated.allergies) updated.allergies = []
        updated.allergies = [{ name: allergyName.trim(), note, verifiedBy: currentDoctor?.id, verifiedAt: new Date().toISOString() }, ...updated.allergies]
        return updated
      }
      return p
    }))

    // Also update global dummy data patients array for demo persistence
    try {
      const gp: any = (patients as any)
      const idx = gp.findIndex((x: any) => x.id === selectedPatientId)
      if (idx >= 0) {
        if (!gp[idx].allergies) gp[idx].allergies = []
        gp[idx].allergies.unshift({ name: allergyName.trim(), note, verifiedBy: currentDoctor?.id, verifiedAt: new Date().toISOString() })
      }
    } catch (e) {
      // ignore in demo
    }

    // Reset and close
    setAllergyName('')
    setAllergyNote('')
    setAllergySeverity('moderate')
    setShowAllergyModal(false)
    setSelectedPatientId(null)
  }

  const filteredPatients = doctorPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const recentRecords = medicalRecords.filter(record => 
    currentDoctor?.id === record.doctorId
  ).slice(0, 5)

  const stats = [
    {
      title: "Total Patients",
      value: doctorPatients.length.toString(),
      icon: Users,
      color: "text-blue-400"
    },
    {
      title: "Records Created",
      value: recentRecords.length.toString(),
      icon: FileText,
      color: "text-green-400"
    },
    {
      title: "Today's Appointments",
      value: "6",
      icon: Calendar,
      color: "text-purple-400"
    },
    {
      title: "Avg Response Time",
      value: "2.3h",
      icon: Clock,
      color: "text-orange-400"
    }
  ]

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Stethoscope },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'records', label: 'Records', icon: FileText },
    { id: 'upload', label: 'Upload Record', icon: Upload },
    { id: 'schedule', label: 'Schedule', icon: Calendar }
  ]

  const todayAppointments = [
    { time: "09:00", patient: "Sarah Johnson", type: "Follow-up", duration: "30 min" },
    { time: "10:00", patient: "Michael Chen", type: "Consultation", duration: "45 min" },
    { time: "11:30", patient: "Emma Davis", type: "Check-up", duration: "30 min" },
    { time: "14:00", patient: "Robert Smith", type: "Surgery Consult", duration: "60 min" },
    { time: "15:30", patient: "Lisa Anderson", type: "Follow-up", duration: "30 min" },
    { time: "16:30", patient: "David Wilson", type: "Initial Consult", duration: "45 min" }
  ]

  if (!currentDoctor) {
    return (
      <>
        <Navbar userEmail="doctor@stable.com" userRole="Doctor" />
        <div className="min-h-screen bg-gradient-to-br from-[#0B0F0E] via-[#0F2E28] to-[#0B0F0E] flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading doctor data...</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {/* Upload Loader Overlay */}
      <AnimatePresence>
        {(isUploading || uploadComplete) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-br from-[#0B0F0E]/95 via-[#0F2E28]/95 to-[#0B0F0E]/95 border-2 border-primary/30 rounded-3xl p-16 max-w-2xl w-full mx-4 shadow-2xl"
            >
              {!uploadComplete ? (
                <div className="space-y-10">
                  {/* Loading Spinner */}
                  <div className="flex justify-center">
                    <div className="relative w-32 h-32">
                      <div className="absolute inset-0 border-[6px] border-primary/20 rounded-full"></div>
                      <div className="absolute inset-0 border-[6px] border-transparent border-t-primary rounded-full animate-spin"></div>
                      <div className="absolute inset-2 border-[6px] border-transparent border-t-green-400 rounded-full animate-spin" style={{ animationDuration: '1.5s' }}></div>
                    </div>
                  </div>

                  {/* Progress Text */}
                  <div className="text-center">
                    <h3 className="text-3xl font-bold text-white mb-3">Uploading Record</h3>
                    <p className="text-white/60 mb-6 text-lg">Securing your data on blockchain...</p>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden mb-3">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary to-green-400 rounded-full"
                        initial={{ width: '0%' }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                    <p className="text-primary font-semibold text-2xl">{uploadProgress}%</p>
                  </div>

                  {/* Hydra Meme */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col items-center"
                  >
                    <div className="relative w-96 h-96 rounded-xl overflow-hidden border-2 border-primary/30 shadow-2xl">
                      <img
                        src="/Hydra.png"
                        alt="Blockchain Security"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      <div 
                        className="hidden w-full h-full bg-gradient-to-br from-primary/20 to-green-600/20 items-center justify-center"
                      >
                        <Shield className="w-16 h-16 text-primary/50" />
                      </div>
                    </div>
                  </motion.div>
                </div>
              ) : (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="text-center space-y-8"
                >
                  <div className="flex justify-center">
                    <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center">
                      <CheckCircle className="w-16 h-16 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-4xl font-bold text-white mb-3">Uploaded! ✨</h3>
                    <p className="text-white/60 text-lg">Your record has been secured on the blockchain</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar userEmail={currentDoctor.email} userRole="Doctor" />
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
            <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-400 rounded-xl flex items-center justify-center">
              <Stethoscope className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Doctor Portal</h1>
              <p className="text-white/70">Welcome back, {currentDoctor.name}</p>
            </div>
          </div>

          {/* Doctor Info Card */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <p className="text-white/60 text-sm">Specialization</p>
                <p className="text-white font-semibold">{currentDoctor.specialization}</p>
              </div>
              <div>
                <p className="text-white/60 text-sm">License</p>
                <p className="text-white font-semibold">{currentDoctor.license}</p>
              </div>
              <div>
                <p className="text-white/60 text-sm">Experience</p>
                <p className="text-white font-semibold">{currentDoctor.experience} years</p>
              </div>
              <div>
                <p className="text-white/60 text-sm">Consultation Fee</p>
                <p className="text-white font-semibold">${currentDoctor.consultationFee}</p>
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
          {stats.map((stat) => (
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
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Today's Schedule */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">Today's Schedule</h3>
                <div className="space-y-3">
                  {todayAppointments.map((appointment, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl">
                      <div className="text-primary font-semibold text-sm w-16">
                        {appointment.time}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-semibold">{appointment.patient}</p>
                        <p className="text-white/60 text-sm">{appointment.type} • {appointment.duration}</p>
                      </div>
                      <button className="text-white/60 hover:text-white">
                        <Eye className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Records */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">Recent Records</h3>
                <div className="space-y-4">
                  {recentRecords.map((record) => (
                    <div key={record.id} className="p-4 bg-white/5 rounded-xl">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-white font-semibold">{record.title}</p>
                          <p className="text-white/60 text-sm">
                            {patients.find(p => p.id === record.patientId)?.name}
                          </p>
                        </div>
                        <span className="text-white/60 text-xs">{record.date}</span>
                      </div>
                      <p className="text-white/70 text-sm">{record.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="lg:col-span-2">
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
                  <div className="grid md:grid-cols-4 gap-4">
                    <button 
                      onClick={() => setActiveTab('patients')}
                      className="p-6 bg-gradient-to-r from-blue-500/20 to-blue-500/10 rounded-xl border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 text-center"
                    >
                      <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                      <p className="text-white font-semibold">View Patients</p>
                    </button>
                    <button className="p-6 bg-gradient-to-r from-green-500/20 to-green-500/10 rounded-xl border border-green-500/20 hover:border-green-500/40 transition-all duration-300 text-center">
                      <Upload className="h-8 w-8 text-green-400 mx-auto mb-2" />
                      <p className="text-white font-semibold">Upload Record</p>
                    </button>
                    <button 
                      onClick={() => setActiveTab('schedule')}
                      className="p-6 bg-gradient-to-r from-purple-500/20 to-purple-500/10 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 text-center"
                    >
                      <Calendar className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                      <p className="text-white font-semibold">Manage Schedule</p>
                    </button>
                    <button className="p-6 bg-gradient-to-r from-orange-500/20 to-orange-500/10 rounded-xl border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 text-center">
                      <FileText className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                      <p className="text-white font-semibold">Write Prescription</p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'patients' && (
            <div className="space-y-6">
              {/* Search and Filter */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <div className="flex gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Search patients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50"
                    />
                  </div>
                  <button className="px-6 py-3 border border-white/20 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all">
                    <Filter className="h-5 w-5" />
                  </button>
                </div>

                {/* Patients Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPatients.map((patient) => {
                    const hasAccess = patientAccessGranted.has(patient.id)
                    return (
                    <div key={patient.id} className="p-6 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                              {patient.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h4 className="text-white font-semibold">{patient.name}</h4>
                            <p className="text-white/60 text-sm">{patient.bloodType} • {patient.gender}</p>
                          </div>
                        </div>
                        {/* Access Badge */}
                        {hasAccess ? (
                          <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-lg">
                            <CheckCircle2 className="h-4 w-4 text-green-400" />
                            <span className="text-xs text-green-400 font-semibold">Access</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 px-2 py-1 bg-red-500/20 border border-red-500/30 rounded-lg">
                            <ShieldAlert className="h-4 w-4 text-red-400" />
                            <span className="text-xs text-red-400 font-semibold">No Access</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex items-center gap-2 text-white/60">
                          <Phone className="h-4 w-4" />
                          {patient.phone}
                        </div>
                        <div className="flex items-center gap-2 text-white/60">
                          <Mail className="h-4 w-4" />
                          {patient.email}
                        </div>
                      </div>

                      {hasAccess ? (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleViewPatientRecord(patient.id)}
                            className="flex-1 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-all"
                          >
                            <Eye className="h-4 w-4 inline mr-2" />
                            View Records
                          </button>
                          <button 
                            onClick={() => handleViewPatientRecord(patient.id)}
                            className="flex-1 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all"
                          >
                            <Edit3 className="h-4 w-4 inline mr-2" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleAddAllergy(patient.id)}
                            className="flex-1 py-2 bg-rose-500/10 text-rose-400 rounded-lg hover:bg-rose-500/20 transition-all"
                          >
                            Add Allergy
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <button 
                            onClick={() => handleViewPatientRecord(patient.id)}
                            className="w-full py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all border border-red-500/30"
                          >
                            <Eye className="h-4 w-4 inline mr-2" />
                            Seek Peak
                          </button>
                          <button 
                            onClick={() => handleRequestAccess(patient.id)}
                            className="w-full py-2 bg-orange-500/20 text-orange-400 rounded-lg hover:bg-orange-500/30 transition-all border border-orange-500/30"
                          >
                            <Key className="h-4 w-4 inline mr-2" />
                            Request Access
                          </button>
                        </div>
                      )}
                    </div>
                  )})}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'records' && (
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">Medical Records</h3>
              <div className="space-y-4">
                {recentRecords.map((record) => (
                  <div key={record.id} className="p-6 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-white mb-2">{record.title}</h4>
                        <p className="text-white/70 text-sm mb-2">{record.description}</p>
                        <div className="flex items-center gap-4 text-sm text-white/60">
                          <span>Patient: {patients.find(p => p.id === record.patientId)?.name}</span>
                          <span>•</span>
                          <span>{record.date}</span>
                          <span>•</span>
                          <span className="capitalize">{record.type.replace('_', ' ')}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleViewPatientRecord(record.patientId)}
                          className="px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-all"
                        >
                          View
                        </button>
                        <button 
                          onClick={() => handleViewPatientRecord(record.patientId)}
                          className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                    
                    {record.files.length > 0 && (
                      <div className="flex gap-2">
                        {record.files.map((file, index) => (
                          <div key={index} className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg">
                            <FileText className="h-4 w-4 text-primary" />
                            <span className="text-white text-sm">{file.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Calendar View */}
              <div className="lg:col-span-2">
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Weekly Schedule</h3>
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                      <div key={day} className="text-center text-white/70 font-semibold py-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 35 }).map((_, index) => (
                      <div 
                        key={index} 
                        className="aspect-square bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all cursor-pointer p-2"
                      >
                        <div className="text-white/70 text-sm">{(index % 31) + 1}</div>
                        {index % 7 < 5 && index > 6 && (
                          <div className="mt-1">
                            <div className="w-2 h-2 bg-primary rounded-full mb-1"></div>
                            <div className="w-2 h-2 bg-secondary rounded-full"></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Available Slots */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">Available Slots</h3>
                <div className="space-y-4">
                  {currentDoctor.schedule.map((scheduleDay) => (
                    <div key={scheduleDay.day}>
                      <h4 className="text-white font-semibold mb-3">{scheduleDay.day}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {scheduleDay.slots.map((slot) => (
                          <button 
                            key={slot}
                            className="p-2 bg-white/5 rounded-lg text-white/70 hover:bg-primary/20 hover:text-primary transition-all text-sm"
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                <button className="w-full mt-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-lg transition-all">
                  Update Schedule
                </button>
              </div>
            </div>
          )}

          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">Upload Patient Record</h3>
                <p className="text-white/70 mb-6">
                  Upload medical records, test results, and treatment notes for your patients.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left Column - Patient & Record Info */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Select Patient</label>
                      <select className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white">
                        <option value="">Choose a patient...</option>
                        {doctorPatients.map(patient => (
                          <option key={patient.id} value={patient.id}>{patient.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Record Type</label>
                      <select 
                        value={uploadType}
                        onChange={(e) => setUploadType(e.target.value)}
                        className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white"
                      >
                        <option value="Lab Test">Lab Test</option>
                        <option value="Consultation">Consultation</option>
                        <option value="Surgery">Surgery</option>
                        <option value="Prescription">Prescription</option>
                        <option value="Diagnosis">Diagnosis</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Title *</label>
                      <input 
                        type="text" 
                        placeholder="e.g., Blood Test Results, X-Ray Report"
                        value={uploadTitle}
                        onChange={(e) => setUploadTitle(e.target.value)}
                        className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Description</label>
                      <textarea 
                        placeholder="Detailed description of the medical record..."
                        value={uploadDescription}
                        onChange={(e) => setUploadDescription(e.target.value)}
                        className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 h-24 resize-none"
                      />
                    </div>
                  </div>

                  {/* Right Column - Doctor & Hospital Info */}
                  <div className="space-y-4">
                    <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                      <h4 className="text-primary font-semibold mb-2">Doctor Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-white/60">Name:</span>
                          <span className="text-white">{currentDoctor?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">License:</span>
                          <span className="text-white font-mono">{currentDoctor?.license}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Specialization:</span>
                          <span className="text-white">{currentDoctor?.specialization}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <h4 className="text-blue-400 font-semibold mb-2">Hospital Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-white/60">Hospital:</span>
                          <span className="text-white">{currentDoctor?.hospital}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Department:</span>
                          <span className="text-white">{currentDoctor?.specialization} Dept.</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Date:</span>
                          <span className="text-white">{new Date().toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Upload Files *</label>
                      <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                        <Upload className="h-8 w-8 text-white/50 mx-auto mb-2" />
                        <p className="text-white/50 text-sm">
                          {selectedFile ? selectedFile.name : 'Drop files here or click to browse'}
                        </p>
                        <p className="text-white/30 text-xs mt-1">Supports PDF, JPEG, PNG files up to 10MB</p>
                        <label className="mt-3 inline-block px-4 py-2 bg-primary/20 text-primary border border-primary/30 rounded-lg text-sm hover:bg-primary/30 transition-colors cursor-pointer">
                          Browse Files
                          <input 
                            type="file" 
                            onChange={handleFileSelect}
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex gap-4">
                    <button 
                      onClick={handleUploadRecord}
                      disabled={isUploading}
                      className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-[0_0_30px_rgba(0,255,178,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUploading ? 'Uploading...' : 'Upload Record'}
                    </button>
                    <button 
                      disabled={isUploading}
                      className="px-6 py-3 bg-white/5 text-white border border-white/20 rounded-lg font-semibold hover:bg-white/10 transition-colors disabled:opacity-50"
                    >
                      Save as Draft
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Add Allergy Modal */}
          <AnimatePresence>
            {showAllergyModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
                onClick={() => setShowAllergyModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-gradient-to-br from-[#0B0F0E]/95 via-[#0F2E28]/95 to-[#0B0F0E]/95 border-2 border-primary/30 rounded-3xl p-8 max-w-2xl w-full mx-4 shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                        <ShieldAlert className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">Add Patient Allergy</h3>
                        <p className="text-white/60 text-sm">Document verified allergy information</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowAllergyModal(false)}
                      className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors"
                    >
                      <X className="h-5 w-5 text-white/70" />
                    </button>
                  </div>

                  <div className="space-y-5">
                    {/* Allergy Name */}
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        Allergy Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={allergyName}
                        onChange={(e) => setAllergyName(e.target.value)}
                        placeholder="e.g., Penicillin, Peanuts, Latex"
                        className="w-full p-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                        autoFocus
                      />
                    </div>

                    {/* Severity Level */}
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-3">
                        Severity Level
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          onClick={() => setAllergySeverity('mild')}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            allergySeverity === 'mild'
                              ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300'
                              : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-2xl mb-1">⚠️</div>
                            <div className="font-semibold">Mild</div>
                          </div>
                        </button>
                        <button
                          onClick={() => setAllergySeverity('moderate')}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            allergySeverity === 'moderate'
                              ? 'bg-orange-500/20 border-orange-500/50 text-orange-300'
                              : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-2xl mb-1">🔶</div>
                            <div className="font-semibold">Moderate</div>
                          </div>
                        </button>
                        <button
                          onClick={() => setAllergySeverity('severe')}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            allergySeverity === 'severe'
                              ? 'bg-red-500/20 border-red-500/50 text-red-300'
                              : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-2xl mb-1">🚨</div>
                            <div className="font-semibold">Severe</div>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Additional Notes */}
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        Additional Notes (Optional)
                      </label>
                      <textarea
                        value={allergyNote}
                        onChange={(e) => setAllergyNote(e.target.value)}
                        placeholder="Describe symptoms, previous reactions, or important details..."
                        className="w-full p-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all h-24 resize-none"
                      />
                    </div>

                    {/* Verified Badge */}
                    <div className="flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <div className="flex-1">
                        <p className="text-green-300 font-semibold text-sm">Verified by Licensed Doctor</p>
                        <p className="text-green-300/70 text-xs">{currentDoctor?.name} • License: {currentDoctor?.license}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-8">
                    <button
                      onClick={() => setShowAllergyModal(false)}
                      className="flex-1 py-4 bg-white/5 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/10 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveAllergy}
                      disabled={!allergyName.trim()}
                      className="flex-1 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:shadow-[0_0_30px_rgba(0,255,178,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                    >
                      Save Allergy
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Snake Vibe GIF Popup - Bottom Right Corner */}
          {showSnakeVibe && (
            <div className="fixed bottom-6 right-6 z-50 w-80 bg-black rounded-xl shadow-2xl border-3 border-[#00ffb2] overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
              <button
                onClick={() => setShowSnakeVibe(false)}
                className="absolute top-2 right-2 bg-black/80 hover:bg-black text-white rounded-full p-1.5 transition-colors z-10"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="relative">
                <img
                  src="/snakevibe.gif"
                  alt="Snake Vibe"
                  className="w-full h-auto"
                />
              </div>
              
              <div className="bg-linear-to-r from-[#00ffb2] to-[#1aff96] p-3">
                <p className="text-black font-bold text-center text-sm">
                  Access request pending…<br />
                  SNEK is thinking 🐍
                </p>
              </div>
            </div>
          )}

          {/* Nice Try Meme Video - Access Denied */}
          <AnimatePresence>
            {showNiceTry && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
                onClick={() => setShowNiceTry(false)}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="relative max-w-4xl w-full mx-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setShowNiceTry(false)}
                    className="absolute -top-12 right-0 bg-red-500/20 hover:bg-red-500/40 text-white rounded-full p-3 transition-all border-2 border-red-500/50 hover:border-red-500"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  
                  <div className="relative rounded-2xl overflow-hidden border-4 border-red-500/50 shadow-2xl">
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-auto"
                    >
                      <source src="/nicetry.mp4" type="video/mp4" />
                    </video>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
    </>
  )
}