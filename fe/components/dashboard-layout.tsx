'use client'

import { useState, useEffect } from 'react'
import { 
  FileText, 
  Upload, 
  Users, 
  Settings, 
  Activity,
  Menu,
  X,
  Home,
  Wallet,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import WalletConnect from '@/components/wallet-connect'
import ActorsPage from '@/components/actors-page'
import UploadRecord from '@/components/upload-record'
import RecordsList from '@/components/records-list'
import { walletManager } from '@/lib/wallet'
import { motion, AnimatePresence } from 'framer-motion'

type DashboardView = 'home' | 'records' | 'upload' | 'actors' | 'audit' | 'settings'

interface NavigationItem {
  id: DashboardView
  label: string
  icon: any
  description: string
  requiresWallet?: boolean
}

const navigationItems: NavigationItem[] = [
  {
    id: 'home',
    label: 'Dashboard',
    icon: Home,
    description: 'Overview and quick actions'
  },
  {
    id: 'records',
    label: 'Medical Records',
    icon: FileText,
    description: 'View and manage accessible records',
    requiresWallet: true
  },
  {
    id: 'upload',
    label: 'Upload Record',
    icon: Upload,
    description: 'Upload new medical records',
    requiresWallet: true
  },
  {
    id: 'actors',
    label: 'Actors',
    icon: Users,
    description: 'Manage healthcare participants'
  },
  {
    id: 'audit',
    label: 'Audit Log',
    icon: Activity,
    description: 'View access history and logs',
    requiresWallet: true
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    description: 'Account and system settings',
    requiresWallet: true
  }
]

interface DashboardLayoutProps {
  children?: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [currentView, setCurrentView] = useState<DashboardView>('home')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [walletState, setWalletState] = useState(walletManager.getState())

  // Subscribe to wallet changes
  useEffect(() => {
    const unsubscribe = walletManager.subscribe(setWalletState)
    return unsubscribe
  }, [])

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return <DashboardHome onNavigate={setCurrentView} />
      case 'records':
        return <RecordsList />
      case 'upload':
        return <UploadRecord />
      case 'actors':
        return <ActorsPage />
      case 'audit':
        return <div className="p-8">Audit Log coming soon...</div>
      case 'settings':
        return <div className="p-8">Settings coming soon...</div>
      default:
        return <DashboardHome onNavigate={setCurrentView} />
    }
  }

  const canAccessView = (item: NavigationItem) => {
    return !item.requiresWallet || walletState.isConnected
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : -320,
        }}
        className="fixed top-0 left-0 z-50 w-80 h-full bg-card border-r border-border lg:relative lg:translate-x-0 lg:z-auto"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold">MediVault</h1>
                <p className="text-sm text-muted-foreground">Healthcare Platform</p>
              </div>
              <div className="flex items-center space-x-2">
                <Link href="/">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Landing</span>
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Wallet Status */}
          <div className="p-6 border-b border-border">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Wallet Status</span>
                <Badge variant={walletState.isConnected ? 'default' : 'secondary'}>
                  {walletState.isConnected ? 'Connected' : 'Disconnected'}
                </Badge>
              </div>
              {walletState.isConnected ? (
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>Address: {walletManager.formatAddress(walletState.address, 6)}</div>
                  <div>Network: {walletState.network?.toUpperCase()}</div>
                  <div>Balance: {walletManager.formatBalance(walletState.balance)}</div>
                </div>
              ) : (
                <div className="text-xs text-muted-foreground">
                  Connect your wallet to access all features
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = currentView === item.id
              const canAccess = canAccessView(item)
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? 'default' : 'ghost'}
                  className={`w-full justify-start h-auto p-3 ${
                    !canAccess ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={() => {
                    if (canAccess) {
                      setCurrentView(item.id)
                      setSidebarOpen(false)
                    }
                  }}
                  disabled={!canAccess}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.description}
                    </div>
                  </div>
                  {item.requiresWallet && !walletState.isConnected && (
                    <Wallet className="w-3 h-3 ml-auto text-muted-foreground" />
                  )}
                </Button>
              )
            })}
          </nav>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden bg-card border-b border-border p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-4 h-4" />
            </Button>
            <h1 className="font-semibold">MediVault</h1>
            <div className="w-8" />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

interface DashboardHomeProps {
  onNavigate: (view: DashboardView) => void
}

function DashboardHome({ onNavigate }: DashboardHomeProps) {
  const walletState = walletManager.getState()

  const quickActions = [
    {
      title: 'View Records',
      description: 'Access your medical records',
      icon: FileText,
      action: () => onNavigate('records'),
      requiresWallet: true
    },
    {
      title: 'Upload Record',
      description: 'Add a new medical record',
      icon: Upload,
      action: () => onNavigate('upload'),
      requiresWallet: true
    },
    {
      title: 'Manage Actors',
      description: 'Register healthcare participants',
      icon: Users,
      action: () => onNavigate('actors'),
      requiresWallet: false
    }
  ]

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome to MediVault
        </h1>
        <p className="text-muted-foreground mt-2">
          Your secure blockchain-based healthcare platform
        </p>
      </div>

      {!walletState.isConnected && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
                <p className="text-muted-foreground">
                  Connect your Cardano wallet to access all platform features
                </p>
              </div>
              <WalletConnect />
            </div>
          </CardContent>
        </Card>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            const canAccess = !action.requiresWallet || walletState.isConnected
            
            return (
              <Card
                key={index}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  canAccess 
                    ? 'hover:border-primary/40 hover:bg-primary/5' 
                    : 'opacity-50 cursor-not-allowed'
                }`}
                onClick={() => canAccess && action.action()}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {action.description}
                      </p>
                      {action.requiresWallet && !walletState.isConnected && (
                        <div className="flex items-center mt-2">
                          <Wallet className="w-3 h-3 mr-1 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            Requires wallet connection
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {walletState.isConnected && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Account Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Wallet</p>
                    <p className="text-lg font-semibold">{walletState.walletName?.toUpperCase()}</p>
                  </div>
                  <Wallet className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Network</p>
                    <p className="text-lg font-semibold">{walletState.network?.toUpperCase()}</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    walletState.network === 'mainnet' ? 'bg-green-500' : 'bg-yellow-500'
                  }`} />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Balance</p>
                    <p className="text-lg font-semibold">
                      {walletManager.formatBalance(walletState.balance)}
                    </p>
                  </div>
                  <div className="text-primary">₳</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}