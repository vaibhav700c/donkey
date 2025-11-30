'use client'

import { useEffect, useState } from 'react'
import { User, Plus, Shield, UserCheck, Building, HeartPulse } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { apiClient } from '@/lib/api'
import { useNotifications } from '@/hooks/use-notifications'
import { walletManager } from '@/lib/wallet'
import type { Actor } from '@/types'

interface RegisterFormData {
  name: string
  email: string
  role: 'patient' | 'doctor' | 'hospital' | 'insurance'
  publicKey: string
}

const roleIcons = {
  patient: HeartPulse,
  doctor: UserCheck,
  hospital: Building,
  insurance: Shield,
}

const roleColors = {
  patient: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  doctor: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  hospital: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  insurance: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
}

export default function ActorsPage() {
  const [actors, setActors] = useState<Actor[]>([])
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { addNotification } = useNotifications()
  const walletState = walletManager.getState()

  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    role: 'patient',
    publicKey: '',
  })

  useEffect(() => {
    loadActors()
  }, [])

  const loadActors = async () => {
    try {
      const result = await apiClient.getActors()
      if (result.success && result.data) {
        setActors(result.data)
      } else {
        addNotification('error', 'Load Failed', result.error || 'Failed to load actors')
      }
    } catch (error) {
      addNotification('error', 'Load Error', 'Failed to load actors')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    if (!walletState.isConnected || !walletState.address) {
      addNotification('error', 'Wallet Required', 'Please connect your wallet first')
      return
    }

    if (!formData.name || !formData.role) {
      addNotification('error', 'Missing Fields', 'Please fill in all required fields')
      return
    }

    setRegistering(true)
    try {
      const actorData = {
        ...formData,
        address: walletState.address,
        publicKey: formData.publicKey || walletState.address, // Use wallet address as fallback
        isActive: true,
      }

      const result = await apiClient.registerActor(actorData)
      
      if (result.success && result.data) {
        addNotification('success', 'Registration Successful', `Successfully registered as ${formData.role}`)
        setActors(prev => [result.data!, ...prev])
        setIsDialogOpen(false)
        setFormData({ name: '', email: '', role: 'patient', publicKey: '' })
      } else {
        addNotification('error', 'Registration Failed', result.error || 'Failed to register actor')
      }
    } catch (error) {
      addNotification('error', 'Registration Error', 'An unexpected error occurred')
    } finally {
      setRegistering(false)
    }
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

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading actors...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Actor Management</h1>
          <p className="text-muted-foreground">
            Manage healthcare ecosystem participants and their roles
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Register Actor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Register New Actor</DialogTitle>
              <DialogDescription>
                Add a new participant to the healthcare ecosystem
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter full name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: 'patient' | 'doctor' | 'hospital' | 'insurance') =>
                    setFormData(prev => ({ ...prev, role: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="patient">Patient</SelectItem>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="hospital">Hospital</SelectItem>
                    <SelectItem value="insurance">Insurance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="publicKey">Public Key (Optional)</Label>
                <Input
                  id="publicKey"
                  value={formData.publicKey}
                  onChange={(e) => setFormData(prev => ({ ...prev, publicKey: e.target.value }))}
                  placeholder="Leave blank to use wallet address"
                />
                <p className="text-xs text-muted-foreground">
                  Will use your wallet address if not provided
                </p>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleRegister} disabled={registering || !walletState.isConnected}>
                {registering ? 'Registering...' : 'Register'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Registered Actors</span>
          </CardTitle>
          <CardDescription>
            {actors.length} actor{actors.length !== 1 ? 's' : ''} registered in the healthcare ecosystem
          </CardDescription>
        </CardHeader>
        <CardContent>
          {actors.length === 0 ? (
            <div className="text-center py-12">
              <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Actors Registered</h3>
              <p className="text-muted-foreground mb-4">
                Be the first to register in the healthcare ecosystem
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Register First Actor
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Registered</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {actors.map((actor) => {
                    const RoleIcon = roleIcons[actor.role]
                    return (
                      <TableRow key={actor.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <RoleIcon className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{actor.name}</div>
                              {actor.email && (
                                <div className="text-sm text-muted-foreground">{actor.email}</div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={roleColors[actor.role]}>
                            {actor.role.charAt(0).toUpperCase() + actor.role.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <code className="text-sm bg-muted px-2 py-1 rounded">
                            {walletManager.formatAddress(actor.address, 6)}
                          </code>
                        </TableCell>
                        <TableCell>
                          <Badge variant={actor.isActive ? 'default' : 'secondary'}>
                            {actor.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(actor.createdAt)}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}