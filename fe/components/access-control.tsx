"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { 
  Shield, 
  UserPlus, 
  Eye, 
  Edit, 
  Share, 
  Trash2, 
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Hospital,
  Stethoscope,
  CreditCard,
  X
} from "lucide-react"
import { accessPermissions, type AccessPermission } from "@/lib/dummy-data"

interface AccessControlProps {
  patientId: string
}

export default function AccessControl({ patientId }: AccessControlProps) {
  const [permissions, setPermissions] = useState<AccessPermission[]>(
    accessPermissions.filter(p => p.patientId === patientId)
  )
  const [isGrantingAccess, setIsGrantingAccess] = useState(false)
  const [showSnakeIss, setShowSnakeIss] = useState(false)
  const [newAccess, setNewAccess] = useState({
    entityName: "",
    entityType: "doctor" as "doctor" | "hospital" | "insurance",
    permissions: [] as string[],
    reason: "",
    duration: ""
  })

  const getEntityIcon = (type: string) => {
    switch (type) {
      case "doctor": return <Stethoscope className="h-4 w-4" />
      case "hospital": return <Hospital className="h-4 w-4" />
      case "insurance": return <CreditCard className="h-4 w-4" />
      default: return <Shield className="h-4 w-4" />
    }
  }

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue": return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300"
      case "green": return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300"
      case "purple": return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300"
      case "orange": return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300"
      default: return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300"
    }
  }

  const handleGrantAccess = () => {
    // Show Snake ISS GIF
    setShowSnakeIss(true)
    
    const newPermission: AccessPermission = {
      id: `AP${Date.now()}`,
      entityId: `E${Date.now()}`,
      entityName: newAccess.entityName,
      entityType: newAccess.entityType,
      patientId,
      grantedAt: new Date().toISOString(),
      grantedBy: patientId,
      permissions: newAccess.permissions as ('view' | 'edit' | 'share')[],
      status: "active",
      accessReason: newAccess.reason,
      color: newAccess.entityType === "doctor" ? "blue" : 
             newAccess.entityType === "hospital" ? "green" : "purple"
    }
    
    setPermissions([...permissions, newPermission])
    setIsGrantingAccess(false)
    setNewAccess({
      entityName: "",
      entityType: "doctor",
      permissions: [],
      reason: "",
      duration: ""
    })
  }

  const handleRevokeAccess = (permissionId: string) => {
    setPermissions(permissions.map(p => 
      p.id === permissionId 
        ? { ...p, status: "revoked" as const }
        : p
    ))
  }

  const handlePermissionToggle = (permission: string) => {
    setNewAccess({
      ...newAccess,
      permissions: newAccess.permissions.includes(permission)
        ? newAccess.permissions.filter(p => p !== permission)
        : [...newAccess.permissions, permission]
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Access Control
          </h3>
          <p className="text-gray-400">Manage who can access your medical records</p>
        </div>
        
        <Dialog open={isGrantingAccess} onOpenChange={setIsGrantingAccess}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/80 text-black">
              <UserPlus className="h-4 w-4 mr-2" />
              Grant Access
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-background border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Grant New Access</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Entity Name</Label>
                <Input
                  placeholder="Enter name (e.g., Dr. John Smith)"
                  value={newAccess.entityName}
                  onChange={(e) => setNewAccess({...newAccess, entityName: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-white">Entity Type</Label>
                <Select
                  value={newAccess.entityType}
                  onValueChange={(value) => setNewAccess({...newAccess, entityType: value as any})}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="hospital">Hospital</SelectItem>
                    <SelectItem value="insurance">Insurance Company</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-white">Permissions</Label>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="view"
                      checked={newAccess.permissions.includes("view")}
                      onCheckedChange={() => handlePermissionToggle("view")}
                    />
                    <label htmlFor="view" className="text-white flex items-center gap-1">
                      <Eye className="h-3 w-3" /> View
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="edit"
                      checked={newAccess.permissions.includes("edit")}
                      onCheckedChange={() => handlePermissionToggle("edit")}
                    />
                    <label htmlFor="edit" className="text-white flex items-center gap-1">
                      <Edit className="h-3 w-3" /> Edit
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="share"
                      checked={newAccess.permissions.includes("share")}
                      onCheckedChange={() => handlePermissionToggle("share")}
                    />
                    <label htmlFor="share" className="text-white flex items-center gap-1">
                      <Share className="h-3 w-3" /> Share
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-white">Access Reason</Label>
                <Textarea
                  placeholder="Why is this access needed?"
                  value={newAccess.reason}
                  onChange={(e) => setNewAccess({...newAccess, reason: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              
              <Button onClick={handleGrantAccess} className="w-full bg-primary hover:bg-primary/80 text-black">
                Grant Access
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {permissions.map((permission) => (
          <motion.div
            key={permission.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getEntityIcon(permission.entityType)}
                      <div>
                        <h4 className="font-medium text-white">{permission.entityName}</h4>
                        <p className="text-sm text-gray-400">{permission.accessReason}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Badge 
                        variant="outline" 
                        className={getColorClasses(permission.color)}
                      >
                        {permission.entityType}
                        {permission.awardedBySystem && (
                          <span className="ml-1 text-xs">(System Awarded)</span>
                        )}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex gap-1">
                      {permission.permissions.map((perm) => (
                        <Badge key={perm} variant="secondary" className="text-xs">
                          {perm === "view" && <Eye className="h-3 w-3 mr-1" />}
                          {perm === "edit" && <Edit className="h-3 w-3 mr-1" />}
                          {perm === "share" && <Share className="h-3 w-3 mr-1" />}
                          {perm}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {permission.status === "active" && (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      )}
                      {permission.status === "revoked" && (
                        <XCircle className="h-4 w-4 text-red-400" />
                      )}
                      
                      <div className="text-xs text-gray-400">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {new Date(permission.grantedAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    {permission.status === "active" && !permission.awardedBySystem && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRevokeAccess(permission.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {permissions.length === 0 && (
        <div className="text-center py-8">
          <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-300 mb-2">No Access Permissions</h3>
          <p className="text-gray-400">You haven't granted access to any doctors, hospitals, or insurance companies yet.</p>
        </div>
      )}

      {/* Snake ISS GIF Popup - Bottom Center, Looping */}
      {showSnakeIss && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-96 bg-black rounded-xl shadow-2xl border-3 border-[#00ffb2] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button
            onClick={() => setShowSnakeIss(false)}
            className="absolute top-2 right-2 bg-black/80 hover:bg-black text-white rounded-full p-1.5 transition-colors z-10"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="relative">
            <img
              src="/snakeiss.gif"
              alt="Snake ISS"
              className="w-full h-auto"
            />
          </div>
          
          <div className="bg-linear-to-r from-[#00ffb2] to-[#1aff96] p-4">
            <p className="text-black font-bold text-center text-base">
              SNEK delivering your medical records safely 🐍📄
            </p>
          </div>
        </div>
      )}
    </div>
  )
}