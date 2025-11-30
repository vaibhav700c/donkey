export interface Actor {
  id: string
  address: string
  role: 'patient' | 'doctor' | 'hospital' | 'insurance'
  publicKey: string
  name: string
  email?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Record {
  id: string
  title: string
  description?: string
  cid: string
  encryptionKey: string
  uploadedBy: string
  uploadedAt: string
  sharedWith: string[]
  accessHistory: AccessEntry[]
  metadata: {
    fileType: string
    fileSize: number
    originalName: string
  }
  onChainTx?: string
}

export interface AccessEntry {
  id: string
  actorId: string
  actorName: string
  action: 'upload' | 'view' | 'download' | 'share' | 'revoke'
  timestamp: string
  ipAddress?: string
}

export interface WalletState {
  isConnected: boolean
  address: string | null
  network: 'testnet' | 'mainnet' | null
  balance: string | null
  walletName: 'nami' | 'lace' | null
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface UploadFormData {
  title: string
  description: string
  file: File | null
  shareWithPatients: boolean
  shareWithDoctors: boolean
  shareWithHospitals: boolean
  shareWithInsurance: boolean
}

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: string
  isRead: boolean
}