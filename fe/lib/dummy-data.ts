// Dummy data for STABLE healthcare platform

export interface AccessPermission {
  id: string
  entityId: string // Doctor, Hospital, or Insurance ID
  entityName: string
  entityType: 'doctor' | 'hospital' | 'insurance'
  patientId: string
  grantedAt: string
  grantedBy: string // Who granted the access
  expiresAt?: string
  permissions: ('view' | 'edit' | 'share')[]
  status: 'active' | 'revoked' | 'expired'
  accessReason: string
  awardedBySystem?: boolean // If insurance/hospital system awarded access
  color: 'blue' | 'green' | 'purple' | 'orange' // Color coding
}

export interface DocumentView {
  id: string
  documentId: string
  documentName: string
  viewerId: string
  viewerName: string
  viewerType: 'doctor' | 'hospital' | 'insurance' | 'patient'
  viewedAt: string
  sessionId: string // Groups views within 2 hours
  ipAddress: string
  duration?: number // In seconds
}

export interface TransactionHistory {
  id: string
  patientId: string
  type: 'access_granted' | 'access_revoked' | 'document_viewed' | 'record_uploaded' | 'permission_modified'
  description: string
  performedBy: string
  performedAt: string
  entityAffected: string
  previousState?: any
  newState?: any
  metadata: Record<string, any>
}

export interface PeerAccess {
  id: string
  patientId: string
  peerId: string
  peerName: string
  peerType: 'doctor' | 'hospital' | 'insurance' | 'family'
  accessLevel: 'view' | 'limited' | 'full'
  grantedAt: string
  lastAccessed: string
  accessCount: number
  ipHistory: string[]
  deviceHistory: string[]
}

export interface Patient {
  id: string
  name: string
  email: string
  phone: string
  dateOfBirth: string
  gender: 'male' | 'female' | 'other'
  address: string
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
  medicalHistory: MedicalRecord[]
  allergies: string[]
  medications: string[]
  bloodType: string
}

export interface Doctor {
  id: string
  name: string
  email: string
  phone: string
  specialization: string
  license: string
  hospital: string
  experience: number
  consultationFee: number
  patients: string[] // Patient IDs
  schedule: {
    day: string
    slots: string[]
  }[]
}

export interface Hospital {
  id: string
  name: string
  email: string
  phone: string
  address: string
  departments: string[]
  capacity: number
  doctors: string[] // Doctor IDs
  patients: string[] // Patient IDs
  reports: HospitalReport[]
  statistics: {
    totalPatients: number
    occupancyRate: number
    monthlyAdmissions: number
  }
}

export interface Insurance {
  id: string
  name: string
  email: string
  phone: string
  policyTypes: string[]
  claims: InsuranceClaim[]
  authorizedAmount: number
  coverage: {
    type: string
    percentage: number
    maxAmount: number
  }[]
}

export interface MedicalRecord {
  id: string
  patientId: string
  doctorId: string
  hospitalId?: string
  type: 'consultation' | 'lab_report' | 'prescription' | 'imaging' | 'surgery'
  title: string
  description: string
  date: string
  files: {
    name: string
    url: string
    type: string
  }[]
  permissions: {
    doctorId?: string
    hospitalId?: string
    insuranceId?: string
    type: 'permanent' | 'temporary'
    expiresAt?: string
  }[]
  status: 'active' | 'archived'
}

export interface HospitalReport {
  id: string
  patientId: string
  department: string
  type: 'admission' | 'discharge' | 'lab_test' | 'surgery'
  title: string
  description: string
  date: string
  doctorId: string
}

export interface InsuranceClaim {
  id: string
  patientId: string
  hospitalId?: string
  doctorId?: string
  type: 'consultation' | 'surgery' | 'medication' | 'lab_test'
  amount: number
  status: 'pending' | 'approved' | 'denied'
  submittedAt: string
  description: string
}

// Dummy Data
export const patients: Patient[] = [
  {
    id: "P001",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "1990-05-15",
    gender: "female",
    address: "123 Main St, New York, NY 10001",
    emergencyContact: {
      name: "John Johnson",
      phone: "+1 (555) 987-6543",
      relationship: "Spouse"
    },
    medicalHistory: [],
    allergies: ["Penicillin", "Nuts"],
    medications: ["Vitamin D", "Iron Supplements"],
    bloodType: "O+"
  },
  {
    id: "P002",
    name: "Michael Chen",
    email: "michael.chen@email.com",
    phone: "+1 (555) 234-5678",
    dateOfBirth: "1985-12-03",
    gender: "male",
    address: "456 Oak Ave, Los Angeles, CA 90210",
    emergencyContact: {
      name: "Lisa Chen",
      phone: "+1 (555) 876-5432",
      relationship: "Wife"
    },
    medicalHistory: [],
    allergies: ["Shellfish"],
    medications: ["Metformin"],
    bloodType: "A+"
  }
]

export const doctors: Doctor[] = [
  {
    id: "D001",
    name: "Dr. Emily Rodriguez",
    email: "emily.rodriguez@hospital.com",
    phone: "+1 (555) 345-6789",
    specialization: "Cardiology",
    license: "MD-12345",
    hospital: "H001",
    experience: 8,
    consultationFee: 250,
    patients: ["P001", "P002"],
    schedule: [
      {
        day: "Monday",
        slots: ["09:00", "10:00", "11:00", "14:00", "15:00"]
      },
      {
        day: "Wednesday",
        slots: ["09:00", "10:00", "11:00", "14:00", "15:00"]
      },
      {
        day: "Friday",
        slots: ["09:00", "10:00", "11:00"]
      }
    ]
  },
  {
    id: "D002",
    name: "Dr. Robert Kim",
    email: "robert.kim@hospital.com",
    phone: "+1 (555) 456-7890",
    specialization: "Neurology",
    license: "MD-67890",
    hospital: "H001",
    experience: 12,
    consultationFee: 300,
    patients: ["P001"],
    schedule: [
      {
        day: "Tuesday",
        slots: ["08:00", "09:00", "10:00", "14:00"]
      },
      {
        day: "Thursday",
        slots: ["08:00", "09:00", "10:00", "14:00"]
      }
    ]
  }
]

export const hospitals: Hospital[] = [
  {
    id: "H001",
    name: "Central Medical Center",
    email: "info@centralmedical.com",
    phone: "+1 (555) 567-8901",
    address: "789 Hospital Blvd, New York, NY 10002",
    departments: ["Cardiology", "Neurology", "Emergency", "Pediatrics", "Oncology"],
    capacity: 500,
    doctors: ["D001", "D002"],
    patients: ["P001", "P002"],
    reports: [],
    statistics: {
      totalPatients: 1247,
      occupancyRate: 85,
      monthlyAdmissions: 342
    }
  },
  {
    id: "H002",
    name: "Westside General Hospital",
    email: "contact@westside.com",
    phone: "+1 (555) 678-9012",
    address: "321 Health Ave, Los Angeles, CA 90211",
    departments: ["Orthopedics", "Radiology", "Surgery", "ICU"],
    capacity: 300,
    doctors: [],
    patients: [],
    reports: [],
    statistics: {
      totalPatients: 856,
      occupancyRate: 72,
      monthlyAdmissions: 189
    }
  }
]

export const insuranceCompanies: Insurance[] = [
  {
    id: "I001",
    name: "HealthFirst Insurance",
    email: "claims@healthfirst.com",
    phone: "+1 (555) 789-0123",
    policyTypes: ["Basic", "Premium", "Family", "Senior"],
    claims: [],
    authorizedAmount: 2500000,
    coverage: [
      {
        type: "Consultation",
        percentage: 80,
        maxAmount: 500
      },
      {
        type: "Surgery",
        percentage: 90,
        maxAmount: 50000
      },
      {
        type: "Medication",
        percentage: 70,
        maxAmount: 2000
      }
    ]
  },
  {
    id: "I002",
    name: "MediCare Plus",
    email: "support@medicareplus.com",
    phone: "+1 (555) 890-1234",
    policyTypes: ["Standard", "Gold", "Platinum"],
    claims: [],
    authorizedAmount: 5000000,
    coverage: [
      {
        type: "Consultation",
        percentage: 100,
        maxAmount: 800
      },
      {
        type: "Surgery",
        percentage: 95,
        maxAmount: 100000
      },
      {
        type: "Medication",
        percentage: 85,
        maxAmount: 5000
      }
    ]
  }
]

export const medicalRecords: MedicalRecord[] = [
  {
    id: "R001",
    patientId: "P001",
    doctorId: "D001",
    hospitalId: "H001",
    type: "consultation",
    title: "Cardiac Consultation",
    description: "Routine cardiac checkup. Patient reports occasional chest discomfort.",
    date: "2024-11-20",
    files: [
      {
        name: "ECG_Report.pdf",
        url: "/files/ecg_report.pdf",
        type: "application/pdf"
      }
    ],
    permissions: [
      {
        doctorId: "D001",
        type: "permanent"
      },
      {
        insuranceId: "I001",
        type: "temporary",
        expiresAt: "2024-12-20"
      }
    ],
    status: "active"
  },
  {
    id: "R002",
    patientId: "P002",
    doctorId: "D001",
    type: "lab_report",
    title: "Blood Sugar Analysis",
    description: "Quarterly diabetes monitoring. HbA1c levels within acceptable range.",
    date: "2024-11-18",
    files: [
      {
        name: "Blood_Test_Results.pdf",
        url: "/files/blood_test.pdf",
        type: "application/pdf"
      }
    ],
    permissions: [
      {
        doctorId: "D001",
        type: "permanent"
      }
    ],
    status: "active"
  }
]

export const hospitalReports: HospitalReport[] = [
  {
    id: "HR001",
    patientId: "P001",
    department: "Cardiology",
    type: "lab_test",
    title: "Stress Test Results",
    description: "Patient completed cardiac stress test with satisfactory results.",
    date: "2024-11-19",
    doctorId: "D001"
  }
]

export const insuranceClaims: InsuranceClaim[] = [
  {
    id: "C001",
    patientId: "P001",
    hospitalId: "H001",
    doctorId: "D001",
    type: "consultation",
    amount: 250,
    status: "approved",
    submittedAt: "2024-11-20",
    description: "Cardiac consultation and ECG"
  },
  {
    id: "C002",
    patientId: "P002",
    doctorId: "D001",
    type: "lab_test",
    amount: 150,
    status: "pending",
    submittedAt: "2024-11-21",
    description: "Blood sugar analysis"
  }
]

// Helper functions
export const getCurrentUserData = (role: string, id: string) => {
  switch (role) {
    case 'patient':
      return patients.find(p => p.id === id)
    case 'doctor':
      return doctors.find(d => d.id === id)
    case 'hospital':
      return hospitals.find(h => h.id === id)
    case 'insurance':
      return insuranceCompanies.find(i => i.id === id)
    default:
      return null
  }
}

export const getPatientRecords = (patientId: string) => {
  return medicalRecords.filter(record => record.patientId === patientId)
}

// Access Control Data
export const accessPermissions: AccessPermission[] = [
  {
    id: "AP001",
    entityId: "D001",
    entityName: "Dr. Emily Watson",
    entityType: "doctor",
    patientId: "P001",
    grantedAt: "2024-11-01T09:00:00Z",
    grantedBy: "P001",
    permissions: ["view", "edit"],
    status: "active",
    accessReason: "Primary care physician",
    color: "blue"
  },
  {
    id: "AP002",
    entityId: "H001",
    entityName: "New York General Hospital",
    entityType: "hospital",
    patientId: "P001",
    grantedAt: "2024-11-15T14:30:00Z",
    grantedBy: "System",
    permissions: ["view"],
    status: "active",
    accessReason: "Emergency treatment authorization",
    awardedBySystem: true,
    color: "green"
  },
  {
    id: "AP003",
    entityId: "I001",
    entityName: "HealthFirst Insurance",
    entityType: "insurance",
    patientId: "P001",
    grantedAt: "2024-10-20T10:15:00Z",
    grantedBy: "System",
    permissions: ["view"],
    status: "active",
    accessReason: "Claims processing and verification",
    awardedBySystem: true,
    color: "purple"
  }
]

export const documentViews: DocumentView[] = [
  {
    id: "DV001",
    documentId: "MR001",
    documentName: "Stress Test Results",
    viewerId: "D001",
    viewerName: "Dr. Emily Watson",
    viewerType: "doctor",
    viewedAt: "2024-11-20T09:15:00Z",
    sessionId: "S001",
    ipAddress: "192.168.1.100",
    duration: 180
  },
  {
    id: "DV002",
    documentId: "MR001",
    documentName: "Stress Test Results",
    viewerId: "D001",
    viewerName: "Dr. Emily Watson",
    viewerType: "doctor",
    viewedAt: "2024-11-20T09:45:00Z",
    sessionId: "S001", // Same session (within 2 hours)
    ipAddress: "192.168.1.100",
    duration: 120
  },
  {
    id: "DV003",
    documentId: "MR001",
    documentName: "Stress Test Results",
    viewerId: "I001",
    viewerName: "HealthFirst Insurance",
    viewerType: "insurance",
    viewedAt: "2024-11-21T15:30:00Z",
    sessionId: "S002",
    ipAddress: "203.45.67.89",
    duration: 240
  }
]

export const transactionHistory: TransactionHistory[] = [
  {
    id: "TH001",
    patientId: "P001",
    type: "access_granted",
    description: "Granted view access to Dr. Emily Watson",
    performedBy: "P001",
    performedAt: "2024-11-01T09:00:00Z",
    entityAffected: "D001",
    metadata: { permissions: ["view", "edit"], reason: "Primary care physician" }
  },
  {
    id: "TH002",
    patientId: "P001",
    type: "document_viewed",
    description: "Stress Test Results viewed by Dr. Emily Watson",
    performedBy: "D001",
    performedAt: "2024-11-20T09:15:00Z",
    entityAffected: "MR001",
    metadata: { duration: 180, ipAddress: "192.168.1.100" }
  },
  {
    id: "TH003",
    patientId: "P001",
    type: "access_granted",
    description: "System awarded access to New York General Hospital",
    performedBy: "System",
    performedAt: "2024-11-15T14:30:00Z",
    entityAffected: "H001",
    metadata: { awardedBySystem: true, reason: "Emergency treatment authorization" }
  }
]

export const peerAccess: PeerAccess[] = [
  {
    id: "PA001",
    patientId: "P001",
    peerId: "D001",
    peerName: "Dr. Emily Watson (Cardiology)",
    peerType: "doctor",
    accessLevel: "full",
    grantedAt: "2024-11-01T09:00:00Z",
    lastAccessed: "2024-11-20T09:15:00Z",
    accessCount: 15,
    ipHistory: ["192.168.1.100", "192.168.1.101"],
    deviceHistory: ["Chrome/Windows 11", "Safari/MacOS"]
  },
  {
    id: "PA002",
    patientId: "P001",
    peerId: "H001",
    peerName: "New York General Hospital",
    peerType: "hospital",
    accessLevel: "view",
    grantedAt: "2024-11-15T14:30:00Z",
    lastAccessed: "2024-11-18T16:45:00Z",
    accessCount: 3,
    ipHistory: ["203.45.67.89"],
    deviceHistory: ["Chrome/Windows 11"]
  },
  {
    id: "PA003",
    patientId: "P001",
    peerId: "I001",
    peerName: "HealthFirst Insurance",
    peerType: "insurance",
    accessLevel: "limited",
    grantedAt: "2024-10-20T10:15:00Z",
    lastAccessed: "2024-11-21T15:30:00Z",
    accessCount: 8,
    ipHistory: ["203.45.67.89", "203.45.67.90"],
    deviceHistory: ["Edge/Windows 11"]
  }
]

export const getDoctorPatients = (doctorId: string) => {
  const doctor = doctors.find(d => d.id === doctorId)
  if (!doctor) return []
  return patients.filter(p => doctor.patients.includes(p.id))
}

export const getHospitalReports = (hospitalId: string) => {
  return hospitalReports.filter(report => 
    hospitals.find(h => h.id === hospitalId)?.patients.includes(report.patientId)
  )
}

export const getInsuranceClaims = (insuranceId: string) => {
  // In a real app, this would filter by insurance company
  return insuranceClaims
}