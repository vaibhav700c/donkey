"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Building2, 
  Users, 
  FileText, 
  BarChart3,
  TrendingUp,
  Activity,
  Bed,
  UserPlus,
  Download,
  Upload,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle
} from "lucide-react"
import { hospitals, doctors, patients, hospitalReports, getHospitalReports, Hospital } from "@/lib/dummy-data"

export default function HospitalDashboard() {
  const [currentHospital, setCurrentHospital] = useState<Hospital | null>(null)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    // In a real app, this would get the current authenticated hospital
    const hospital = hospitals[0] // Using first hospital as demo
    setCurrentHospital(hospital)
  }, [])

  const stats = [
    {
      title: "Total Capacity",
      value: currentHospital?.capacity.toString() || "0",
      icon: Bed,
      color: "text-blue-400",
      change: "+5%"
    },
    {
      title: "Current Patients",
      value: currentHospital?.statistics.totalPatients.toString() || "0",
      icon: Users,
      color: "text-green-400",
      change: "+12%"
    },
    {
      title: "Occupancy Rate",
      value: `${currentHospital?.statistics.occupancyRate}%` || "0%",
      icon: TrendingUp,
      color: "text-purple-400",
      change: "+3%"
    },
    {
      title: "Monthly Admissions",
      value: currentHospital?.statistics.monthlyAdmissions.toString() || "0",
      icon: UserPlus,
      color: "text-orange-400",
      change: "+8%"
    }
  ]

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'departments', label: 'Departments', icon: Building2 },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'reports', label: 'Reports', icon: FileText }
  ]

  const departmentData = [
    { name: "Emergency", patients: 45, capacity: 60, utilization: 75 },
    { name: "Cardiology", patients: 32, capacity: 40, utilization: 80 },
    { name: "Neurology", patients: 18, capacity: 25, utilization: 72 },
    { name: "Pediatrics", patients: 28, capacity: 35, utilization: 80 },
    { name: "Oncology", patients: 22, capacity: 30, utilization: 73 }
  ]

  const recentAdmissions = [
    { id: "A001", patient: "Sarah Johnson", department: "Cardiology", time: "2 hours ago", status: "Admitted" },
    { id: "A002", patient: "Michael Chen", department: "Emergency", time: "4 hours ago", status: "Under Review" },
    { id: "A003", patient: "Emma Davis", department: "Neurology", time: "6 hours ago", status: "Admitted" },
    { id: "A004", patient: "Robert Smith", department: "Oncology", time: "8 hours ago", status: "Discharged" }
  ]

  if (!currentHospital) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B0F0E] via-[#0F2E28] to-[#0B0F0E] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading hospital data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F0E] via-[#0F2E28] to-[#0B0F0E]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-400 rounded-xl flex items-center justify-center">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Hospital Management</h1>
              <p className="text-white/70">Welcome to {currentHospital.name}</p>
            </div>
          </div>

          {/* Hospital Info Card */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <p className="text-white/60 text-sm">Location</p>
                <p className="text-white font-semibold">{currentHospital.address}</p>
              </div>
              <div>
                <p className="text-white/60 text-sm">Departments</p>
                <p className="text-white font-semibold">{currentHospital.departments.length} Active</p>
              </div>
              <div>
                <p className="text-white/60 text-sm">Medical Staff</p>
                <p className="text-white font-semibold">{currentHospital.doctors.length} Doctors</p>
              </div>
              <div>
                <p className="text-white/60 text-sm">Contact</p>
                <p className="text-white font-semibold">{currentHospital.phone}</p>
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
                <div className="text-right">
                  <span className="text-2xl font-bold text-white block">{stat.value}</span>
                  <span className="text-green-400 text-sm">{stat.change}</span>
                </div>
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
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Department Overview */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Department Utilization</h3>
                  <div className="space-y-4">
                    {departmentData.map((dept) => (
                      <div key={dept.name} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-white font-semibold">{dept.name}</span>
                          <span className="text-white/70 text-sm">
                            {dept.patients}/{dept.capacity} ({dept.utilization}%)
                          </span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-primary to-secondary rounded-full h-2 transition-all duration-500"
                            style={{ width: `${dept.utilization}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Admissions */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Recent Admissions</h3>
                  <div className="space-y-4">
                    {recentAdmissions.map((admission) => (
                      <div key={admission.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                        <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                          <UserPlus className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-semibold">{admission.patient}</p>
                          <p className="text-white/60 text-sm">{admission.department} • {admission.time}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          admission.status === 'Admitted' ? 'bg-green-500/20 text-green-400' :
                          admission.status === 'Under Review' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {admission.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Key Metrics Chart */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">Monthly Trends</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <Activity className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                    <p className="text-2xl font-bold text-white">98.5%</p>
                    <p className="text-white/70 text-sm">Patient Satisfaction</p>
                  </div>
                  <div className="text-center">
                    <Clock className="h-12 w-12 text-green-400 mx-auto mb-4" />
                    <p className="text-2xl font-bold text-white">12 min</p>
                    <p className="text-white/70 text-sm">Avg Wait Time</p>
                  </div>
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                    <p className="text-2xl font-bold text-white">2.1 days</p>
                    <p className="text-white/70 text-sm">Avg Length of Stay</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
                <div className="grid md:grid-cols-4 gap-4">
                  <button className="p-6 bg-gradient-to-r from-blue-500/20 to-blue-500/10 rounded-xl border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 text-center">
                    <UserPlus className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <p className="text-white font-semibold">New Admission</p>
                  </button>
                  <button 
                    onClick={() => setActiveTab('reports')}
                    className="p-6 bg-gradient-to-r from-green-500/20 to-green-500/10 rounded-xl border border-green-500/20 hover:border-green-500/40 transition-all duration-300 text-center"
                  >
                    <Upload className="h-8 w-8 text-green-400 mx-auto mb-2" />
                    <p className="text-white font-semibold">Upload Report</p>
                  </button>
                  <button className="p-6 bg-gradient-to-r from-purple-500/20 to-purple-500/10 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 text-center">
                    <Calendar className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                    <p className="text-white font-semibold">Schedule Surgery</p>
                  </button>
                  <button className="p-6 bg-gradient-to-r from-orange-500/20 to-orange-500/10 rounded-xl border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 text-center">
                    <BarChart3 className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                    <p className="text-white font-semibold">View Analytics</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'departments' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentHospital.departments.map((department) => (
                <div key={department} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                      <Activity className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{department}</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-white/70">Current Patients</span>
                      <span className="text-white font-semibold">
                        {departmentData.find(d => d.name === department)?.patients || Math.floor(Math.random() * 30) + 10}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Staff on Duty</span>
                      <span className="text-white font-semibold">{Math.floor(Math.random() * 8) + 4}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Equipment Status</span>
                      <span className="text-green-400 font-semibold flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" />
                        Operational
                      </span>
                    </div>
                  </div>

                  <button className="w-full mt-6 py-3 bg-primary/20 text-primary rounded-lg font-semibold hover:bg-primary/30 transition-all">
                    Manage Department
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'patients' && (
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Current Patients</h3>
                <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-lg transition-all">
                  <UserPlus className="h-5 w-5 inline mr-2" />
                  New Admission
                </button>
              </div>

              {/* Patients List */}
              <div className="space-y-4">
                {patients.slice(0, 10).map((patient, index) => (
                  <div key={patient.id} className="p-6 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">
                            {patient.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">{patient.name}</h4>
                          <p className="text-white/60 text-sm">
                            {departmentData[index % departmentData.length].name} • Room {100 + index}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-white/70 text-sm">Admitted</p>
                          <p className="text-white font-semibold">Nov {20 + (index % 5)}, 2024</p>
                        </div>
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                          Stable
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              {/* Upload Report */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">Upload Hospital Report</h3>
                
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white/70 text-sm mb-2">Report Type</label>
                      <select className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white">
                        <option>Lab Test</option>
                        <option>Surgery Report</option>
                        <option>Admission Report</option>
                        <option>Discharge Summary</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm mb-2">Department</label>
                      <select className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white">
                        {currentHospital.departments.map(dept => (
                          <option key={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm mb-2">Patient ID</label>
                    <input
                      type="text"
                      className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50"
                      placeholder="Enter patient ID..."
                    />
                  </div>

                  <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 text-white/60 mx-auto mb-4" />
                    <p className="text-white/70 mb-2">Upload medical files and reports</p>
                    <p className="text-white/50 text-sm">PDF, JPEG, PNG files up to 25MB</p>
                  </div>

                  <button className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-lg transition-all">
                    Upload Report
                  </button>
                </div>
              </div>

              {/* Recent Reports */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">Recent Reports</h3>
                <div className="space-y-4">
                  {hospitalReports.map((report) => (
                    <div key={report.id} className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-white font-semibold">{report.title}</h4>
                          <p className="text-white/60 text-sm">
                            {report.department} • Patient: {patients.find(p => p.id === report.patientId)?.name}
                          </p>
                          <p className="text-white/60 text-sm">{report.date}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-all">
                            View
                          </button>
                          <button className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all">
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}