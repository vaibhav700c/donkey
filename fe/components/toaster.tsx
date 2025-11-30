'use client'

import { useEffect } from 'react'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useNotifications } from '@/hooks/use-notifications'
import type { Notification, NotificationType } from '@/types'

const notificationIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const notificationStyles = {
  success: 'border-green-500 bg-green-50 dark:bg-green-950',
  error: 'border-red-500 bg-red-50 dark:bg-red-950',
  warning: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950',
  info: 'border-blue-500 bg-blue-50 dark:bg-blue-950',
}

const iconStyles = {
  success: 'text-green-600 dark:text-green-400',
  error: 'text-red-600 dark:text-red-400',
  warning: 'text-yellow-600 dark:text-yellow-400',
  info: 'text-blue-600 dark:text-blue-400',
}

interface ToastItemProps {
  notification: Notification
  onRemove: (id: string) => void
}

function ToastItem({ notification, onRemove }: ToastItemProps) {
  const Icon = notificationIcons[notification.type]

  useEffect(() => {
    // Auto-remove based on type
    let timeout: NodeJS.Timeout
    
    if (notification.type === 'success' || notification.type === 'info') {
      timeout = setTimeout(() => onRemove(notification.id), 5000)
    } else if (notification.type === 'warning') {
      timeout = setTimeout(() => onRemove(notification.id), 8000)
    }
    // Error notifications stay until manually dismissed

    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [notification.id, notification.type, onRemove])

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`shadow-lg border-l-4 ${notificationStyles[notification.type]}`}>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${iconStyles[notification.type]}`} />
            
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm">{notification.title}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {notification.message}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {new Date(notification.timestamp).toLocaleTimeString()}
              </p>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(notification.id)}
              className="h-auto p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function Toaster() {
  const { notifications, removeNotification } = useNotifications()

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      <AnimatePresence>
        {notifications.map((notification) => (
          <ToastItem
            key={notification.id}
            notification={notification}
            onRemove={removeNotification}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}