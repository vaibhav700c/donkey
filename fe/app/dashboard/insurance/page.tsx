"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Shield, 
  CreditCard, 
  FileText, 
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  TrendingUp,
  Users,
  AlertTriangle,
  Search,
  Filter,
  Eye,
  Download,
  X,
  Edit3
} from "lucide-react"
import { insuranceCompanies, insuranceClaims, patients, doctors, hospitals, getInsuranceClaims, Insurance, InsuranceClaim } from "@/lib/dummy-data"

export default function InsuranceDashboard() {
  const [currentInsurance, setCurrentInsurance] = useState<Insurance | null>(null)
  const [claims, setClaims] = useState<InsuranceClaim[]>([])
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showDonFlash, setShowDonFlash] = useState(false)
  const [showGandalf, setShowGandalf] = useState(false)

  useEffect(() => {
    // In a real app, this would get the current authenticated insurance company
    const insurance = insuranceCompanies[0] // Using first insurance as demo
    setCurrentInsurance(insurance)
    if (insurance) {
      setClaims(getInsuranceClaims(insurance.id))
    }
  }, [])

  const filteredClaims = claims.filter(claim => {
    const matchesSearch = patients.find(p => p.id === claim.patientId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || claim.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = [
    {
      title: "Total Claims",
      value: claims.length.toString(),
      icon: FileText,
      color: "text-blue-400",
      change: "+15%"
    },
    {
      title: "Approved Claims",
      value: claims.filter(c => c.status === 'approved').length.toString(),
      icon: CheckCircle,
      color: "text-green-400",
      change: "+8%"
    },
    {
      title: "Pending Review",
      value: claims.filter(c => c.status === 'pending').length.toString(),
      icon: Clock,
      color: "text-orange-400",
      change: "+5%"
    },
    {
      title: "Total Authorized",
      value: `$${(currentInsurance?.authorizedAmount || 0).toLocaleString()}`,
      icon: DollarSign,
      color: "text-purple-400",
      change: "+12%"
    }
  ]

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'claims', label: 'Claims', icon: FileText },
    { id: 'policies', label: 'Policies', icon: CreditCard },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp }
  ]

  const recentActivity = [
    { type: 'claim_approved', description: 'Cardiac consultation claim approved for Sarah Johnson', amount: '$250', time: '2 hours ago' },
    { type: 'claim_pending', description: 'Blood sugar analysis claim submitted by Michael Chen', amount: '$150', time: '4 hours ago' },
    { type: 'policy_updated', description: 'Family policy renewal processed', amount: '$2,400', time: '6 hours ago' },
    { type: 'claim_denied', description: 'Elective procedure claim denied for policy violation', amount: '$5,200', time: '8 hours ago' }
  ]

  if (!currentInsurance) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B0F0E] via-[#0F2E28] to-[#0B0F0E] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading insurance data...</p>
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
            <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-orange-400 rounded-xl flex items-center justify-center">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Insurance Portal</h1>
              <p className="text-white/70">Welcome to {currentInsurance.name}</p>
            </div>
          </div>

          {/* Insurance Info Card */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <p className="text-white/60 text-sm">Policy Types</p>
                <p className="text-white font-semibold">{currentInsurance.policyTypes.length} Active</p>
              </div>
              <div>
                <p className="text-white/60 text-sm">Coverage Plans</p>
                <p className="text-white font-semibold">{currentInsurance.coverage.length} Available</p>
              </div>
              <div>
                <p className="text-white/60 text-sm">Contact</p>
                <p className="text-white font-semibold">{currentInsurance.phone}</p>
              </div>
              <div>
                <p className="text-white/60 text-sm">Email</p>
                <p className="text-white font-semibold">{currentInsurance.email}</p>
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
                {/* Claims Overview */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Claims Overview</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Approved Claims</span>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                        <span className="text-white font-semibold">
                          {claims.filter(c => c.status === 'approved').length}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Pending Review</span>
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-orange-400" />
                        <span className="text-white font-semibold">
                          {claims.filter(c => c.status === 'pending').length}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Denied Claims</span>
                      <div className="flex items-center gap-2">
                        <XCircle className="h-5 w-5 text-red-400" />
                        <span className="text-white font-semibold">
                          {claims.filter(c => c.status === 'denied').length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          activity.type === 'claim_approved' ? 'bg-green-500/20' :
                          activity.type === 'claim_pending' ? 'bg-orange-500/20' :
                          activity.type === 'claim_denied' ? 'bg-red-500/20' :
                          'bg-blue-500/20'
                        }`}>
                          {activity.type === 'claim_approved' ? <CheckCircle className="h-5 w-5 text-green-400" /> :
                           activity.type === 'claim_pending' ? <Clock className="h-5 w-5 text-orange-400" /> :
                           activity.type === 'claim_denied' ? <XCircle className="h-5 w-5 text-red-400" /> :
                           <CreditCard className="h-5 w-5 text-blue-400" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-white text-sm">{activity.description}</p>
                          <div className="flex items-center gap-4 text-xs text-white/60 mt-1">
                            <span>{activity.amount}</span>
                            <span>•</span>
                            <span>{activity.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Coverage Plans */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">Coverage Plans</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {currentInsurance.coverage.map((coverage, index) => (
                    <div key={index} className="p-6 bg-white/5 rounded-xl border border-white/10">
                      <h4 className="text-lg font-semibold text-white mb-4">{coverage.type}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-white/70">Coverage</span>
                          <span className="text-white font-semibold">{coverage.percentage}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Max Amount</span>
                          <span className="text-white font-semibold">${coverage.maxAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
                <div className="grid md:grid-cols-4 gap-4">
                  <button 
                    onClick={() => setActiveTab('claims')}
                    className="p-6 bg-gradient-to-r from-blue-500/20 to-blue-500/10 rounded-xl border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 text-center"
                  >
                    <FileText className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <p className="text-white font-semibold">Review Claims</p>
                  </button>
                  <button className="p-6 bg-gradient-to-r from-green-500/20 to-green-500/10 rounded-xl border border-green-500/20 hover:border-green-500/40 transition-all duration-300 text-center">
                    <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                    <p className="text-white font-semibold">Approve Claims</p>
                  </button>
                  <button 
                    onClick={() => setActiveTab('policies')}
                    className="p-6 bg-gradient-to-r from-purple-500/20 to-purple-500/10 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 text-center"
                  >
                    <CreditCard className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                    <p className="text-white font-semibold">Manage Policies</p>
                  </button>
                  <button 
                    onClick={() => setActiveTab('analytics')}
                    className="p-6 bg-gradient-to-r from-orange-500/20 to-orange-500/10 rounded-xl border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 text-center"
                  >
                    <TrendingUp className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                    <p className="text-white font-semibold">View Analytics</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'claims' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="block text-white/70 text-sm mb-2">Search Claims</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5" />
                      <input
                        type="text"
                        placeholder="Search by patient name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Status</label>
                    <select 
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="denied">Denied</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Claims List */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">Claims Management</h3>
                <div className="space-y-4">
                  {filteredClaims.map((claim) => (
                    <div key={claim.id} className="p-6 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-white mb-2">
                            Claim #{claim.id}
                          </h4>
                          <p className="text-white/70 text-sm mb-2">{claim.description}</p>
                          <div className="flex items-center gap-4 text-sm text-white/60">
                            <span>Patient: {patients.find(p => p.id === claim.patientId)?.name}</span>
                            <span>•</span>
                            <span>{claim.submittedAt}</span>
                            <span>•</span>
                            <span className="capitalize">{claim.type.replace('_', ' ')}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-2xl font-bold text-white">${claim.amount}</p>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              claim.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                              claim.status === 'pending' ? 'bg-orange-500/20 text-orange-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {claim.status}
                            </span>
                          </div>
                          <div className="flex flex-col gap-2">
                            <button className="px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-all">
                              <Eye className="h-4 w-4 inline mr-2" />
                              Review
                            </button>
                            <button 
                              onClick={() => setShowGandalf(true)}
                              className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-all"
                            >
                              <Edit3 className="h-4 w-4 inline mr-2" />
                              Edit Record
                            </button>
                            {claim.status === 'pending' && (
                              <>
                                <button 
                                  onClick={() => {
                                    // Show Don Flash GIF
                                    setShowDonFlash(true)
                                    
                                    // Update claim status
                                    setClaims(claims.map(c => 
                                      c.id === claim.id ? { ...c, status: 'approved' as const } : c
                                    ))
                                  }}
                                  className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-all"
                                >
                                  <CheckCircle className="h-4 w-4 inline mr-2" />
                                  Approve
                                </button>
                                <button 
                                  onClick={() => {
                                    // Update claim status to denied
                                    setClaims(claims.map(c => 
                                      c.id === claim.id ? { ...c, status: 'denied' as const } : c
                                    ))
                                  }}
                                  className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                                >
                                  <XCircle className="h-4 w-4 inline mr-2" />
                                  Deny
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'policies' && (
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">Policy Management</h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentInsurance.policyTypes.map((policy) => (
                  <div key={policy} className="p-6 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                        <CreditCard className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="text-xl font-semibold text-white">{policy}</h4>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between">
                        <span className="text-white/70">Active Policies</span>
                        <span className="text-white font-semibold">{Math.floor(Math.random() * 500) + 100}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Monthly Premium</span>
                        <span className="text-white font-semibold">${Math.floor(Math.random() * 400) + 200}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Claims Ratio</span>
                        <span className="text-white font-semibold">{Math.floor(Math.random() * 30) + 60}%</span>
                      </div>
                    </div>

                    <button className="w-full py-3 bg-primary/20 text-primary rounded-lg font-semibold hover:bg-primary/30 transition-all">
                      Manage Policy
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-center">
                  <TrendingUp className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <p className="text-3xl font-bold text-white">94.2%</p>
                  <p className="text-white/70">Claim Approval Rate</p>
                  <p className="text-green-400 text-sm mt-2">+2.1% from last month</p>
                </div>
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-center">
                  <Clock className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                  <p className="text-3xl font-bold text-white">1.8 days</p>
                  <p className="text-white/70">Avg Processing Time</p>
                  <p className="text-green-400 text-sm mt-2">-0.3 days improvement</p>
                </div>
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-center">
                  <DollarSign className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                  <p className="text-3xl font-bold text-white">$1.2M</p>
                  <p className="text-white/70">Monthly Payouts</p>
                  <p className="text-green-400 text-sm mt-2">+15% growth</p>
                </div>
              </div>

              {/* Detailed Analytics */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-6">Claims by Type</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Consultations</span>
                      <span className="text-white font-semibold">45%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-blue-400 rounded-full h-2" style={{width: '45%'}}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Lab Tests</span>
                      <span className="text-white font-semibold">25%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-green-400 rounded-full h-2" style={{width: '25%'}}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Surgery</span>
                      <span className="text-white font-semibold">20%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-purple-400 rounded-full h-2" style={{width: '20%'}}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Medication</span>
                      <span className="text-white font-semibold">10%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-orange-400 rounded-full h-2" style={{width: '10%'}}></div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-6">Risk Assessment</h4>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                        <span className="text-green-400 font-semibold">Low Risk</span>
                      </div>
                      <p className="text-white/70 text-sm">Claims processing within normal parameters</p>
                    </div>
                    
                    <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <AlertTriangle className="h-5 w-5 text-orange-400" />
                        <span className="text-orange-400 font-semibold">Medium Risk</span>
                      </div>
                      <p className="text-white/70 text-sm">3 claims require additional review</p>
                    </div>
                    
                    <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <Shield className="h-5 w-5 text-primary" />
                        <span className="text-primary font-semibold">Protected</span>
                      </div>
                      <p className="text-white/70 text-sm">Fraud detection active and monitoring</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Don Flash GIF Popup */}
          {showDonFlash && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="relative bg-black rounded-2xl shadow-2xl border-4 border-[#00ffb2] overflow-hidden max-w-2xl w-full animate-in fade-in zoom-in-95 duration-500">
                <button
                  onClick={() => setShowDonFlash(false)}
                  className="absolute top-4 right-4 bg-black/80 hover:bg-black text-white rounded-full p-2 transition-colors shadow-lg z-10"
                >
                  <X className="w-6 h-6" />
                </button>
                
                <div className="p-8">
                  <img
                    src="/donflash.gif"
                    alt="Don Flash"
                    className="w-full h-auto rounded-lg mb-6"
                  />
                  <div className="bg-linear-to-r from-[#00ffb2] to-[#1aff96] p-6 rounded-lg">
                    <p className="text-black font-bold text-center text-2xl">
                      Insurance backend when it sees blockchain:
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Gandalf GIF Popup - Looping */}
          {showGandalf && (
            <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="relative bg-black rounded-2xl shadow-2xl border-4 border-red-500 overflow-hidden max-w-3xl w-full animate-in fade-in zoom-in-95 duration-500">
                <button
                  onClick={() => setShowGandalf(false)}
                  className="absolute top-4 right-4 bg-black/80 hover:bg-black text-white rounded-full p-2 transition-colors shadow-lg z-10"
                >
                  <X className="w-6 h-6" />
                </button>
                
                <div className="p-8">
                  <img
                    src="/galdalf.gif"
                    alt="Gandalf"
                    className="w-full h-auto rounded-lg mb-6"
                  />
                  <div className="bg-linear-to-r from-red-500 to-red-600 p-6 rounded-lg">
                    <p className="text-white font-bold text-center text-3xl">
                      Immutable blockchains be like 🚫
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}