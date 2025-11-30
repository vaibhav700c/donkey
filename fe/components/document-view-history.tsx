"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Eye, 
  Search, 
  Clock, 
  FileText,
  Stethoscope,
  Hospital,
  CreditCard,
  User,
  Timer,
  Calendar,
  Globe
} from "lucide-react"
import { documentViews, type DocumentView } from "@/lib/dummy-data"

interface DocumentViewHistoryProps {
  patientId: string
}

export default function DocumentViewHistory({ patientId }: DocumentViewHistoryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  
  // Group views by sessionId (de-duplicate views within 2 hours)
  const groupedViews = useMemo(() => {
    const views = documentViews.filter(view => 
      view.documentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      view.viewerName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    
    // Group by sessionId to handle de-duplication
    const sessions = new Map<string, DocumentView[]>()
    views.forEach(view => {
      if (!sessions.has(view.sessionId)) {
        sessions.set(view.sessionId, [])
      }
      sessions.get(view.sessionId)!.push(view)
    })
    
    // Convert to array and get the first view of each session (earliest timestamp)
    return Array.from(sessions.values()).map(sessionViews => {
      const sortedViews = sessionViews.sort((a, b) => 
        new Date(a.viewedAt).getTime() - new Date(b.viewedAt).getTime()
      )
      const firstView = sortedViews[0]
      const totalDuration = sessionViews.reduce((sum, view) => sum + (view.duration || 0), 0)
      const viewCount = sessionViews.length
      
      return {
        ...firstView,
        sessionViewCount: viewCount,
        totalSessionDuration: totalDuration
      }
    }).sort((a, b) => new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime())
  }, [searchQuery])

  const getViewerIcon = (type: string) => {
    switch (type) {
      case "doctor": return <Stethoscope className="h-4 w-4 text-blue-400" />
      case "hospital": return <Hospital className="h-4 w-4 text-green-400" />
      case "insurance": return <CreditCard className="h-4 w-4 text-purple-400" />
      case "patient": return <User className="h-4 w-4 text-orange-400" />
      default: return <Eye className="h-4 w-4 text-gray-400" />
    }
  }

  const getViewerTypeColor = (type: string) => {
    switch (type) {
      case "doctor": return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300"
      case "hospital": return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300"
      case "insurance": return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300"
      case "patient": return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300"
      default: return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300"
    }
  }

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
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
      return date.toLocaleDateString()
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <Eye className="h-6 w-6 text-primary" />
            Document View History
          </h3>
          <p className="text-gray-400">Track who has viewed your medical documents (duplicate views within 2 hours are grouped)</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by document or viewer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-600 text-white"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {groupedViews.map((view) => (
          <motion.div
            key={`${view.sessionId}-${view.documentId}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-medium text-white">{view.documentName}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          {getViewerIcon(view.viewerType)}
                          <span>{view.viewerName}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Badge 
                      variant="outline" 
                      className={getViewerTypeColor(view.viewerType)}
                    >
                      {view.viewerType}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(view.viewedAt)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Timer className="h-4 w-4" />
                      <span>{formatDuration(view.totalSessionDuration)}</span>
                    </div>
                    
                    {view.sessionViewCount > 1 && (
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{view.sessionViewCount} views (grouped)</span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-1">
                      <Globe className="h-4 w-4" />
                      <span className="font-mono text-xs">{view.ipAddress}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="text-xs text-gray-500">
                    Session ID: {view.sessionId} • 
                    Viewed at: {new Date(view.viewedAt).toLocaleString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {groupedViews.length === 0 && (
        <div className="text-center py-8">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-300 mb-2">No Document Views</h3>
          <p className="text-gray-400">
            {searchQuery 
              ? "No document views found matching your search." 
              : "No one has viewed your documents yet."
            }
          </p>
        </div>
      )}

      {groupedViews.length > 0 && (
        <div className="text-center pt-4 border-t border-gray-700">
          <p className="text-sm text-gray-400">
            Total unique viewing sessions: {groupedViews.length} • 
            Multiple views within 2 hours are grouped as one session
          </p>
        </div>
      )}
    </div>
  )
}