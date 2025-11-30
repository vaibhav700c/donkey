'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  User, 
  Wallet, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  ChevronDown,
  Home
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

interface NavbarProps {
  userEmail?: string
  userRole?: string
}

export default function Navbar({ userEmail = 'demo@stable.com', userRole }: NavbarProps) {
  const router = useRouter()
  const [showProfileDialog, setShowProfileDialog] = useState(false)
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleConnectWallet = () => {
    // Simulate wallet connection
    const mockAddress = '0x' + Math.random().toString(16).substr(2, 40)
    setWalletAddress(mockAddress)
    setWalletConnected(true)
  }

  const handleDisconnectWallet = () => {
    setWalletAddress('')
    setWalletConnected(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('userRole')
    router.push('/')
  }

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'patient':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'doctor':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'hospital':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'insurance':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      default:
        return 'bg-primary/20 text-primary border-primary/30'
    }
  }

  const getUserInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase()
  }

  return (
    <>
      <nav className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-primary">STABLE</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link 
                href="/" 
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                <Home className="w-4 h-4 inline mr-2" />
                Home
              </Link>
            </div>

            {/* User Profile Section */}
            <div className="flex items-center space-x-4">
              {/* Wallet Status */}
              {walletConnected && (
                <Badge variant="outline" className="hidden md:flex items-center gap-2 px-3 py-1">
                  <Wallet className="w-4 h-4 text-primary" />
                  <span className="text-xs">{walletAddress.substring(0, 6)}...{walletAddress.substring(38)}</span>
                </Badge>
              )}

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      <AvatarImage src="" alt={userEmail} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {getUserInitials(userEmail)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{userEmail}</p>
                      {userRole && (
                        <Badge className={`mt-1 w-fit text-xs ${getRoleColor(userRole)}`}>
                          {userRole}
                        </Badge>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setShowProfileDialog(true)}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile & Wallet</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-400">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border/40">
              <div className="flex flex-col space-y-3">
                <Link 
                  href="/" 
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Home className="w-4 h-4 inline mr-2" />
                  Home
                </Link>
                {walletConnected && (
                  <div className="text-xs text-muted-foreground">
                    <Wallet className="w-4 h-4 inline mr-2" />
                    {walletAddress.substring(0, 10)}...{walletAddress.substring(36)}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Profile & Wallet Dialog */}
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Profile & Wallet</DialogTitle>
            <DialogDescription>
              Manage your profile and connect your blockchain wallet
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Profile Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-primary">Profile Information</h3>
              <div className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg">
                <Avatar className="h-16 w-16 border-2 border-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xl">
                    {getUserInitials(userEmail)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{userEmail}</p>
                  {userRole && (
                    <Badge className={`mt-1 text-xs ${getRoleColor(userRole)}`}>
                      {userRole}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Wallet Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-primary">Blockchain Wallet</h3>
              {!walletConnected ? (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    Connect your wallet to access blockchain features like secure medical records, 
                    access management, and transaction history.
                  </p>
                  <Button 
                    onClick={handleConnectWallet}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    Connect Wallet
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-primary">Connected</span>
                      <Badge variant="outline" className="text-xs">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                        Active
                      </Badge>
                    </div>
                    <p className="text-sm font-mono text-muted-foreground break-all">
                      {walletAddress}
                    </p>
                  </div>
                  <Button 
                    onClick={handleDisconnectWallet}
                    variant="outline"
                    className="w-full border-red-400/30 text-red-400 hover:bg-red-400/10"
                  >
                    Disconnect Wallet
                  </Button>
                </div>
              )}
            </div>

            {/* Additional Info */}
            <div className="pt-4 border-t border-border/40">
              <p className="text-xs text-muted-foreground">
                <span className="text-primary font-semibold">Note:</span> This is a demo environment. 
                Wallet connections are simulated for demonstration purposes.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
