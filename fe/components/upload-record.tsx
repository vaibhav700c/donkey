'use client'

import { useState, useRef, useEffect } from 'react'
import { Upload, FileText, Lock, Share2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { apiClient } from '@/lib/api'
import { useNotifications } from '@/hooks/use-notifications'
import { walletManager } from '@/lib/wallet'
import type { UploadFormData } from '@/types'

interface FileUploadProps {
  onFileSelect: (file: File | null) => void
  selectedFile: File | null
}

function FileUploadZone({ onFileSelect, selectedFile }: FileUploadProps) {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files.length > 0) {
      // Trigger Charles video when file is dropped
      const event = new CustomEvent('fileSelected')
      window.dispatchEvent(event)
      onFileSelect(files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file) {
      // Trigger Charles video when file is selected
      const event = new CustomEvent('fileSelected')
      window.dispatchEvent(event)
    }
    onFileSelect(file)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div
      className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      {selectedFile ? (
        <div className="space-y-4">
          <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mx-auto">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <div>
            <p className="font-medium">{selectedFile.name}</p>
            <p className="text-sm text-muted-foreground">
              {formatFileSize(selectedFile.size)}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onFileSelect(null)}
          >
            <X className="w-4 h-4 mr-2" />
            Remove File
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-center w-16 h-16 bg-muted rounded-full mx-auto">
            <Upload className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <p className="text-lg font-medium">Drop your medical record here</p>
            <p className="text-muted-foreground">or click to browse files</p>
          </div>
          <input
            type="file"
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.dicom"
          />
          <label htmlFor="file-upload" className="inline-block">
            <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer">
              Choose File
            </div>
          </label>
          <p className="text-xs text-muted-foreground">
            Supports PDF, DOC, DOCX, JPG, PNG, DICOM files up to 100MB
          </p>
        </div>
      )}
    </div>
  )
}

export default function UploadRecord() {
  const [formData, setFormData] = useState<UploadFormData>({
    title: '',
    description: '',
    file: null,
    shareWithPatients: false,
    shareWithDoctors: true,
    shareWithHospitals: false,
    shareWithInsurance: false,
  })
  
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showCharles, setShowCharles] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { addNotification } = useNotifications()
  const walletState = walletManager.getState()

  // Listen for file selection event
  useEffect(() => {
    const handleFileSelected = () => {
      setShowCharles(true)
      // Auto-hide after 5 seconds
      setTimeout(() => {
        setShowCharles(false)
      }, 5000)
    }

    window.addEventListener('fileSelected', handleFileSelected)
    return () => window.removeEventListener('fileSelected', handleFileSelected)
  }, [])

  const handleUpload = async () => {
    if (!walletState.isConnected) {
      addNotification('error', 'Wallet Required', 'Please connect your wallet first')
      return
    }

    if (!formData.file || !formData.title) {
      addNotification('error', 'Missing Fields', 'Please select a file and provide a title')
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      // Create FormData for file upload
      const uploadData = new FormData()
      uploadData.append('file', formData.file)
      uploadData.append('title', formData.title)
      uploadData.append('description', formData.description)
      uploadData.append('uploaderAddress', walletState.address!)
      
      // Add sharing permissions
      const shareWith = []
      if (formData.shareWithPatients) shareWith.push('patient')
      if (formData.shareWithDoctors) shareWith.push('doctor')
      if (formData.shareWithHospitals) shareWith.push('hospital')
      if (formData.shareWithInsurance) shareWith.push('insurance')
      
      uploadData.append('shareWith', JSON.stringify(shareWith))

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + Math.random() * 15
        })
      }, 200)

      const result = await apiClient.uploadRecord(uploadData)
      
      clearInterval(progressInterval)
      setUploadProgress(100)

      if (result.success && result.data) {
        addNotification(
          'success',
          'Upload Successful',
          `Medical record "${formData.title}" has been uploaded and encrypted`
        )
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          file: null,
          shareWithPatients: false,
          shareWithDoctors: true,
          shareWithHospitals: false,
          shareWithInsurance: false,
        })
      } else {
        addNotification('error', 'Upload Failed', result.error || 'Failed to upload record')
      }
    } catch (error) {
      addNotification('error', 'Upload Error', 'An unexpected error occurred during upload')
    } finally {
      setTimeout(() => {
        setUploading(false)
        setUploadProgress(0)
      }, 1000)
    }
  }

  const shareWithCount = [
    formData.shareWithPatients,
    formData.shareWithDoctors,
    formData.shareWithHospitals,
    formData.shareWithInsurance,
  ].filter(Boolean).length

  return (
    <div className="container mx-auto py-8 max-w-2xl space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Upload Medical Record</h1>
        <p className="text-muted-foreground mt-2">
          Securely upload and encrypt your medical records on the blockchain
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="w-5 h-5" />
            <span>Record Information</span>
          </CardTitle>
          <CardDescription>
            Provide details about the medical record you&apos;re uploading
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Record Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Blood Test Results - January 2024"
              disabled={uploading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Additional details about this record (optional)"
              disabled={uploading}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Medical Record File *</Label>
            <FileUploadZone
              onFileSelect={(file) => setFormData(prev => ({ ...prev, file }))}
              selectedFile={formData.file}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Share2 className="w-5 h-5" />
            <span>Sharing Permissions</span>
          </CardTitle>
          <CardDescription>
            Choose which types of actors can access this record
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="patients"
                checked={formData.shareWithPatients}
                onCheckedChange={(checked) =>
                  setFormData(prev => ({ ...prev, shareWithPatients: checked as boolean }))
                }
                disabled={uploading}
              />
              <Label htmlFor="patients" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Patients
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="doctors"
                checked={formData.shareWithDoctors}
                onCheckedChange={(checked) =>
                  setFormData(prev => ({ ...prev, shareWithDoctors: checked as boolean }))
                }
                disabled={uploading}
              />
              <Label htmlFor="doctors" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Doctors
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hospitals"
                checked={formData.shareWithHospitals}
                onCheckedChange={(checked) =>
                  setFormData(prev => ({ ...prev, shareWithHospitals: checked as boolean }))
                }
                disabled={uploading}
              />
              <Label htmlFor="hospitals" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Hospitals
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="insurance"
                checked={formData.shareWithInsurance}
                onCheckedChange={(checked) =>
                  setFormData(prev => ({ ...prev, shareWithInsurance: checked as boolean }))
                }
                disabled={uploading}
              />
              <Label htmlFor="insurance" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Insurance Companies
              </Label>
            </div>
          </div>

          {shareWithCount > 0 && (
            <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
              <Lock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                This record will be shared with {shareWithCount} actor type{shareWithCount !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {uploading && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Uploading and encrypting...</span>
                <span className="text-sm text-muted-foreground">{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-xs text-muted-foreground">
                Your file is being encrypted and stored on the blockchain
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end space-x-4">
        <Button
          variant="outline"
          disabled={uploading}
          onClick={() => {
            setFormData({
              title: '',
              description: '',
              file: null,
              shareWithPatients: false,
              shareWithDoctors: true,
              shareWithHospitals: false,
              shareWithInsurance: false,
            })
          }}
        >
          Clear Form
        </Button>
        <Button
          onClick={handleUpload}
          disabled={uploading || !formData.file || !formData.title || !walletState.isConnected}
          className="min-w-32"
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Uploading...
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 mr-2" />
              Upload & Encrypt
            </>
          )}
        </Button>
      </div>

      {!walletState.isConnected && (
        <Card className="border-warning">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-warning">
              <Lock className="w-4 h-4" />
              <span className="text-sm font-medium">
                Connect your wallet to upload medical records
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charles Hoskinson popup */}
      {showCharles && (
        <div className="fixed bottom-4 right-4 z-50 w-80 bg-black rounded-lg shadow-2xl border-2 border-[#00ffb2] overflow-hidden">
          <div className="relative">
            <video
              ref={videoRef}
              src="/charles.mp4"
              autoPlay
              muted
              className="w-full h-auto"
              onEnded={() => setShowCharles(false)}
            />
            <button
              onClick={() => setShowCharles(false)}
              className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 text-white rounded-full p-1.5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="bg-linear-to-r from-[#00ffb2] to-[#1aff96] p-3">
            <p className="text-black font-semibold text-center text-sm">
              I heard someone said decentralization. I came.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}