'use client'

import { useEffect, useState } from 'react'
import { Eye, Download, UserX, FileText, Clock, Share2, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { apiClient } from '@/lib/api'
import { useNotifications } from '@/hooks/use-notifications'
import { walletManager } from '@/lib/wallet'
import type { Record } from '@/types'

interface RecordsListProps {
  onRecordSelect?: (record: Record) => void
}

export default function RecordsList({ onRecordSelect }: RecordsListProps) {
  const [records, setRecords] = useState<Record[]>([])
  const [loading, setLoading] = useState(true)
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const { addNotification } = useNotifications()
  const walletState = walletManager.getState()

  useEffect(() => {
    if (walletState.isConnected && walletState.address) {
      loadRecords()
    }
  }, [walletState.isConnected, walletState.address])

  const loadRecords = async () => {
    if (!walletState.address) return
    
    try {
      const result = await apiClient.getAccessibleRecords(walletState.address)
      if (result.success && result.data) {
        setRecords(result.data)
      } else {
        addNotification('error', 'Load Failed', result.error || 'Failed to load records')
      }
    } catch (error) {
      addNotification('error', 'Load Error', 'Failed to load accessible records')
    } finally {
      setLoading(false)
    }
  }

  const handleView = async (record: Record) => {
    setActionLoading(record.id)
    
    // Log the view action
    setTimeout(() => {
      onRecordSelect?.(record)
      setActionLoading(null)
      addNotification('info', 'Record Opened', `Viewing "${record.title}"`)
    }, 500)
  }

  const handleDownload = async (record: Record) => {
    setActionLoading(record.id)
    
    try {
      const result = await apiClient.downloadRecord(record.id)
      
      if (result.success && result.data) {
        // Create download link
        const url = URL.createObjectURL(result.data)
        const a = document.createElement('a')
        a.href = url
        a.download = record.metadata.originalName || record.title
        document.body.appendChild(a)
        a.click()
        URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        addNotification('success', 'Download Complete', `Downloaded "${record.title}"`)
      } else {
        addNotification('error', 'Download Failed', 'Failed to download record')
      }
    } catch (error) {
      addNotification('error', 'Download Error', 'An error occurred during download')
    } finally {
      setActionLoading(null)
    }
  }

  const handleRevokeAccess = async (record: Record, actorId: string) => {
    setActionLoading(record.id)
    
    try {
      const result = await apiClient.revokeAccess(record.id, actorId)
      
      if (result.success) {
        addNotification('success', 'Access Revoked', 'Access has been revoked successfully')
        // Refresh records list
        loadRecords()
      } else {
        addNotification('error', 'Revoke Failed', result.error || 'Failed to revoke access')
      }
    } catch (error) {
      addNotification('error', 'Revoke Error', 'An error occurred while revoking access')
    } finally {
      setActionLoading(null)
      setRevokeDialogOpen(false)
      setSelectedRecord(null)
    }
  }

  const isOwner = (record: Record) => {
    return record.uploadedBy === walletState.address
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (!walletState.isConnected) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Wallet Required</h3>
              <p className="text-muted-foreground">
                Please connect your wallet to view accessible medical records
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading accessible records...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Medical Records</h1>
        <p className="text-muted-foreground">
          View and manage medical records you have access to
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Accessible Records</span>
          </CardTitle>
          <CardDescription>
            {records.length} record{records.length !== 1 ? 's' : ''} available for your access level
          </CardDescription>
        </CardHeader>
        <CardContent>
          {records.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Records Found</h3>
              <p className="text-muted-foreground mb-4">
                You don&apos;t have access to any medical records yet
              </p>
              <p className="text-sm text-muted-foreground">
                Records will appear here when they are shared with your actor role or when you upload them
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Record</TableHead>
                    <TableHead>File Info</TableHead>
                    <TableHead>Shared With</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{record.title}</div>
                          {record.description && (
                            <div className="text-sm text-muted-foreground">
                              {record.description}
                            </div>
                          )}
                          <div className="flex items-center space-x-2">
                            {isOwner(record) && (
                              <Badge variant="secondary" className="text-xs">
                                Owner
                              </Badge>
                            )}
                            <code className="text-xs bg-muted px-1 py-0.5 rounded">
                              {record.cid.slice(0, 8)}...
                            </code>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm space-y-1">
                          <div>{record.metadata.originalName}</div>
                          <div className="text-muted-foreground">
                            {record.metadata.fileType.toUpperCase()} • {formatFileSize(record.metadata.fileSize)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {record.sharedWith.map((actorType, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {actorType}s
                            </Badge>
                          ))}
                          {record.sharedWith.length === 0 && (
                            <span className="text-sm text-muted-foreground">Private</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm space-y-1">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <span>{formatDate(record.uploadedAt)}</span>
                          </div>
                          <div className="text-muted-foreground">
                            by {walletManager.formatAddress(record.uploadedBy, 4)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleView(record)}
                            disabled={actionLoading === record.id}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownload(record)}
                            disabled={actionLoading === record.id}
                          >
                            {actionLoading === record.id ? (
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-1" />
                            ) : (
                              <Download className="w-3 h-3 mr-1" />
                            )}
                            Download
                          </Button>
                          
                          {isOwner(record) && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedRecord(record)
                                setRevokeDialogOpen(true)
                              }}
                              disabled={actionLoading === record.id}
                            >
                              <UserX className="w-3 h-3 mr-1" />
                              Revoke
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Revoke Access Dialog */}
      <Dialog open={revokeDialogOpen} onOpenChange={setRevokeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke Access</DialogTitle>
            <DialogDescription>
              Are you sure you want to revoke access to &quot;{selectedRecord?.title}&quot;?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <p className="text-sm">This will revoke access for:</p>
              <div className="flex flex-wrap gap-2">
                {selectedRecord?.sharedWith.map((actorType, index) => (
                  <Badge key={index} variant="secondary">
                    {actorType}s
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRevokeDialogOpen(false)
                setSelectedRecord(null)
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (selectedRecord && walletState.address) {
                  handleRevokeAccess(selectedRecord, walletState.address)
                }
              }}
              disabled={actionLoading !== null}
            >
              {actionLoading ? 'Revoking...' : 'Revoke Access'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}