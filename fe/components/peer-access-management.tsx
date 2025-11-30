"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Users, 
  Search, 
  Clock, 
  Eye, 
  Globe,
  Monitor,
  Activity,
  Shield,
  AlertCircle,
  CheckCircle,
  Stethoscope,
  Hospital,
  CreditCard,
  User,
  Calendar,
  Smartphone
} from "lucide-react"
import { peerAccess, type PeerAccess } from "@/lib/dummy-data"

interface PeerAccessManagementProps {
  patientId: string
}

export default function PeerAccessManagement({ patientId }: PeerAccessManagementProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPeer, setSelectedPeer] = useState<string | null>(null)
  
  const filteredPeers = useMemo(() => {
    return peerAccess
      .filter(peer => peer.patientId === patientId)
      .filter(peer =>
        peer.peerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        peer.peerType.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime())
  }, [patientId, searchQuery])

  const getPeerIcon = (type: string) => {
    switch (type) {
      case "doctor": return <Stethoscope className="h-5 w-5 text-blue-400" />
      case "hospital": return <Hospital className="h-5 w-5 text-green-400" />
      case "insurance": return <CreditCard className="h-5 w-5 text-purple-400" />
      case "family": return <User className="h-5 w-5 text-orange-400" />
      default: return <Shield className="h-5 w-5 text-gray-400" />
    }
  }

  const getPeerTypeColor = (type: string) => {
    switch (type) {
      case "doctor": return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300"
      case "hospital": return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300"
      case "insurance": return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300"
      case "family": return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300"
      default: return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300"
    }
  }

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case "full": return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300"
      case "view": return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300"
      case "limited": return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300"
      default: return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60)
      return `${minutes} minutes ago`
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours)
      return `${hours} hours ago`
    } else {
      const days = Math.floor(diffInHours / 24)
      if (days === 1) return "Yesterday"
      if (days < 7) return `${days} days ago`
      return date.toLocaleDateString()
    }
  }

  const isRecentlyActive = (lastAccessed: string) => {
    const diffInHours = (new Date().getTime() - new Date(lastAccessed).getTime()) / (1000 * 60 * 60)
    return diffInHours < 24
  }

  const selectedPeerDetails = selectedPeer 
    ? filteredPeers.find(peer => peer.id === selectedPeer)
    : null

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Peer Access Management
          </h3>
          <p className="text-gray-400">Monitor who has access to your account and their activity logs</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search peers by name or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-600 text-white"
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Peers List */}
        <div className="lg:col-span-2 space-y-3">
          {filteredPeers.map((peer) => (
            <motion.div
              key={peer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card 
                className={`bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer ${
                  selectedPeer === peer.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedPeer(peer.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        {getPeerIcon(peer.peerType)}
                        {isRecentlyActive(peer.lastAccessed) && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-800"></div>
                        )}
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-white">{peer.peerName}</h4>
                        <div className="flex items-center space-x-2 text-sm">
                          <Badge 
                            variant="outline" 
                            className={getPeerTypeColor(peer.peerType)}
                          >
                            {peer.peerType}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className={getAccessLevelColor(peer.accessLevel)}
                          >
                            {peer.accessLevel} access
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right text-sm">
                      <div className="text-gray-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(peer.lastAccessed)}
                      </div>
                      <div className="text-gray-500 flex items-center gap-1 mt-1">
                        <Activity className="h-3 w-3" />
                        {peer.accessCount} times
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          
          {filteredPeers.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">No Peers Found</h3>
              <p className="text-gray-400">
                {searchQuery 
                  ? "No peers found matching your search." 
                  : "No one has access to your account yet."
                }
              </p>
            </div>
          )}
        </div>

        {/* Peer Details Panel */}
        <div className="space-y-4">
          {selectedPeerDetails ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Access Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-white mb-2">{selectedPeerDetails.peerName}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Type:</span>
                        <Badge className={getPeerTypeColor(selectedPeerDetails.peerType)}>
                          {selectedPeerDetails.peerType}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Access Level:</span>
                        <Badge className={getAccessLevelColor(selectedPeerDetails.accessLevel)}>
                          {selectedPeerDetails.accessLevel}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Granted:</span>
                        <span className="text-white">{new Date(selectedPeerDetails.grantedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Last Access:</span>
                        <span className="text-white">{formatDate(selectedPeerDetails.lastAccessed)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Access Count:</span>
                        <span className="text-white">{selectedPeerDetails.accessCount}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-700">
                    <h5 className="font-medium text-white mb-2 flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      IP History
                    </h5>
                    <div className="space-y-1">
                      {selectedPeerDetails.ipHistory.map((ip, index) => (
                        <div key={index} className="font-mono text-xs text-gray-300 bg-gray-900 p-2 rounded">
                          {ip}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-700">
                    <h5 className="font-medium text-white mb-2 flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      Device History
                    </h5>
                    <div className="space-y-1">
                      {selectedPeerDetails.deviceHistory.map((device, index) => (
                        <div key={index} className="text-xs text-gray-300 bg-gray-900 p-2 rounded">
                          {device}
                        </div>
                      ))}
                    </div>
                  </div>

                  {isRecentlyActive(selectedPeerDetails.lastAccessed) && (
                    <div className="pt-4 border-t border-gray-700">
                      <div className="flex items-center gap-2 text-green-400">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">Recently Active</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6 text-center">
                <Eye className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-400">Select a peer to view detailed access information</p>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total Peers:</span>
                <span className="text-white">{filteredPeers.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Recently Active:</span>
                <span className="text-white">
                  {filteredPeers.filter(peer => isRecentlyActive(peer.lastAccessed)).length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Full Access:</span>
                <span className="text-white">
                  {filteredPeers.filter(peer => peer.accessLevel === "full").length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}