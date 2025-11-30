"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  History, 
  Search, 
  Shield, 
  Eye, 
  UserPlus, 
  UserMinus, 
  Upload,
  Edit,
  Clock,
  User,
  Settings,
  Info
} from "lucide-react"
import { transactionHistory, type TransactionHistory } from "@/lib/dummy-data"

interface TransactionHistoryViewProps {
  patientId: string
}

export default function TransactionHistoryView({ patientId }: TransactionHistoryViewProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  
  const filteredTransactions = useMemo(() => {
    let filtered = transactionHistory.filter(tx => tx.patientId === patientId)
    
    if (searchQuery) {
      filtered = filtered.filter(tx =>
        tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.performedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.entityAffected.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    if (filterType !== "all") {
      filtered = filtered.filter(tx => tx.type === filterType)
    }
    
    return filtered.sort((a, b) => 
      new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime()
    )
  }, [patientId, searchQuery, filterType])

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "access_granted": return <UserPlus className="h-4 w-4 text-green-400" />
      case "access_revoked": return <UserMinus className="h-4 w-4 text-red-400" />
      case "document_viewed": return <Eye className="h-4 w-4 text-blue-400" />
      case "record_uploaded": return <Upload className="h-4 w-4 text-purple-400" />
      case "permission_modified": return <Edit className="h-4 w-4 text-yellow-400" />
      default: return <Settings className="h-4 w-4 text-gray-400" />
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "access_granted": return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300"
      case "access_revoked": return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300"
      case "document_viewed": return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300"
      case "record_uploaded": return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300"
      case "permission_modified": return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300"
      default: return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300"
    }
  }

  const formatTransactionType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
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
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <History className="h-6 w-6 text-primary" />
            Transaction History
          </h3>
          <p className="text-gray-400">Complete log of all access changes and document activities</p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-600 text-white"
            />
          </div>
          
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-48 bg-gray-800 border-gray-600 text-white">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="access_granted">Access Granted</SelectItem>
              <SelectItem value="access_revoked">Access Revoked</SelectItem>
              <SelectItem value="document_viewed">Document Viewed</SelectItem>
              <SelectItem value="record_uploaded">Record Uploaded</SelectItem>
              <SelectItem value="permission_modified">Permission Modified</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        {filteredTransactions.map((transaction) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-white">{transaction.description}</h4>
                        <Badge 
                          variant="outline" 
                          className={getTransactionColor(transaction.type)}
                        >
                          {formatTransactionType(transaction.type)}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>By: {transaction.performedBy}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatDate(transaction.performedAt)}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Shield className="h-3 w-3" />
                          <span>Entity: {transaction.entityAffected}</span>
                        </div>
                      </div>
                      
                      {transaction.metadata && Object.keys(transaction.metadata).length > 0 && (
                        <div className="mt-2 p-2 bg-gray-750 rounded border border-gray-600">
                          <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                            <Info className="h-3 w-3" />
                            <span>Additional Details</span>
                          </div>
                          <div className="text-xs text-gray-300">
                            {Object.entries(transaction.metadata).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="capitalize">{key.replace(/_/g, ' ')}:</span>
                                <span className="font-mono">
                                  {typeof value === 'object' 
                                    ? JSON.stringify(value) 
                                    : String(value)
                                  }
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 font-mono">
                    {transaction.id}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredTransactions.length === 0 && (
        <div className="text-center py-8">
          <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-300 mb-2">No Transactions Found</h3>
          <p className="text-gray-400">
            {searchQuery || filterType !== "all"
              ? "No transactions found matching your criteria."
              : "No transactions have been recorded yet."
            }
          </p>
        </div>
      )}

      {filteredTransactions.length > 0 && (
        <div className="text-center pt-4 border-t border-gray-700">
          <p className="text-sm text-gray-400">
            Showing {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''} • 
            All times are in your local timezone
          </p>
        </div>
      )}
    </div>
  )
}