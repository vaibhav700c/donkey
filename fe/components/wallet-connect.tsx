'use client'

import { useEffect, useState } from 'react'
import { Wallet, Plug, Unplug, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { walletManager, type WalletState } from '@/lib/wallet'
import { useNotifications } from '@/hooks/use-notifications'

interface WalletConnectProps {
  onConnectionChange?: (isConnected: boolean) => void
}

export default function WalletConnect({ onConnectionChange }: WalletConnectProps) {
  const [walletState, setWalletState] = useState<WalletState>(walletManager.getState())
  const [isConnecting, setIsConnecting] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { addNotification } = useNotifications()

  useEffect(() => {
    const unsubscribe = walletManager.subscribe((state) => {
      setWalletState(state)
      onConnectionChange?.(state.isConnected)
    })

    return unsubscribe
  }, [onConnectionChange])

  const handleConnect = async (walletName: 'nami' | 'lace') => {
    setIsConnecting(true)
    try {
      const result = await walletManager.connectWallet(walletName)
      
      if (result.success) {
        addNotification('success', 'Wallet Connected', `Successfully connected to ${walletName} wallet`)
      } else {
        addNotification('error', 'Connection Failed', result.error || 'Failed to connect wallet')
      }
    } catch (error) {
      addNotification('error', 'Connection Error', 'An unexpected error occurred')
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    await walletManager.disconnectWallet()
    addNotification('info', 'Wallet Disconnected', 'Wallet has been disconnected')
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await walletManager.refreshBalance()
    setIsRefreshing(false)
    addNotification('success', 'Balance Updated', 'Wallet balance has been refreshed')
  }

  if (!walletState.isConnected) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Wallet className="w-6 h-6 text-primary" />
          </div>
          <CardTitle>Connect Your Wallet</CardTitle>
          <CardDescription>
            Connect your Cardano wallet to access the healthcare platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            onClick={() => handleConnect('nami')}
            disabled={isConnecting}
            className="w-full"
            variant="outline"
          >
            <Plug className="w-4 h-4 mr-2" />
            {isConnecting ? 'Connecting...' : 'Connect Nami Wallet'}
          </Button>
          
          <Button
            onClick={() => handleConnect('lace')}
            disabled={isConnecting}
            className="w-full"
            variant="outline"
          >
            <Plug className="w-4 h-4 mr-2" />
            {isConnecting ? 'Connecting...' : 'Connect Lace Wallet'}
          </Button>
          
          <p className="text-sm text-muted-foreground text-center mt-4">
            Don&apos;t have a wallet?{' '}
            <a
              href="https://namiwallet.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Download Nami
            </a>
            {' or '}
            <a
              href="https://www.lace.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Download Lace
            </a>
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <CardTitle className="text-lg">Wallet Connected</CardTitle>
          </div>
          <Badge variant="secondary">
            {walletState.walletName?.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Address</span>
            <code className="text-sm bg-muted px-2 py-1 rounded">
              {walletManager.formatAddress(walletState.address)}
            </code>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Network</span>
            <Badge variant={walletState.network === 'mainnet' ? 'default' : 'secondary'}>
              {walletState.network?.toUpperCase()}
            </Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Balance</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">
                {walletManager.formatBalance(walletState.balance)}
              </span>
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <Button
            onClick={handleDisconnect}
            variant="outline"
            className="w-full"
          >
            <Unplug className="w-4 h-4 mr-2" />
            Disconnect Wallet
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground text-center">
          Your wallet is securely connected. You can now access all platform features.
        </div>
      </CardContent>
    </Card>
  )
}