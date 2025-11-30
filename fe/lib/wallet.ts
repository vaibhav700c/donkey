import { type WalletState } from '@/types'

export type { WalletState }

declare global {
  interface Window {
    cardano?: {
      nami?: any
      lace?: any
    }
  }
}

export class WalletManager {
  private static instance: WalletManager
  private walletState: WalletState = {
    isConnected: false,
    address: null,
    network: null,
    balance: null,
    walletName: null,
  }

  private listeners: ((state: WalletState) => void)[] = []

  static getInstance(): WalletManager {
    if (!WalletManager.instance) {
      WalletManager.instance = new WalletManager()
    }
    return WalletManager.instance
  }

  subscribe(callback: (state: WalletState) => void) {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback)
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.walletState))
  }

  async isWalletAvailable(walletName: 'nami' | 'lace'): Promise<boolean> {
    if (typeof window === 'undefined') return false
    return !!(window.cardano?.[walletName])
  }

  async connectWallet(walletName: 'nami' | 'lace'): Promise<{ success: boolean; error?: string }> {
    try {
      if (!await this.isWalletAvailable(walletName)) {
        return {
          success: false,
          error: `${walletName} wallet is not installed. Please install it first.`,
        }
      }

      const wallet = window.cardano?.[walletName]
      if (!wallet) {
        return {
          success: false,
          error: 'Wallet not found',
        }
      }

      // Request connection
      const api = await wallet.enable()
      
      // Get network info
      const networkId = await api.getNetworkId()
      const network = networkId === 1 ? 'mainnet' : 'testnet'

      // Get addresses
      const rawAddresses = await api.getUsedAddresses()
      if (!rawAddresses || rawAddresses.length === 0) {
        return {
          success: false,
          error: 'No addresses found in wallet',
        }
      }

      // Get readable address (first used address)
      const address = rawAddresses[0]

      // Get balance
      const balance = await api.getBalance()

      this.walletState = {
        isConnected: true,
        address,
        network,
        balance,
        walletName,
      }

      this.notifyListeners()

      return { success: true }
    } catch (error) {
      console.error('Wallet connection failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Connection failed',
      }
    }
  }

  async disconnectWallet(): Promise<void> {
    this.walletState = {
      isConnected: false,
      address: null,
      network: null,
      balance: null,
      walletName: null,
    }
    this.notifyListeners()
  }

  getState(): WalletState {
    return { ...this.walletState }
  }

  async refreshBalance(): Promise<void> {
    if (!this.walletState.isConnected || !this.walletState.walletName) return

    try {
      const wallet = window.cardano?.[this.walletState.walletName]
      if (wallet) {
        const api = await wallet.enable()
        const balance = await api.getBalance()
        this.walletState.balance = balance
        this.notifyListeners()
      }
    } catch (error) {
      console.error('Failed to refresh balance:', error)
    }
  }

  formatAddress(address: string | null, length: number = 8): string {
    if (!address) return 'Not connected'
    return `${address.slice(0, length)}...${address.slice(-length)}`
  }

  formatBalance(balance: string | null): string {
    if (!balance) return '0 ADA'
    try {
      // Convert lovelace to ADA (1 ADA = 1,000,000 lovelace)
      const ada = parseInt(balance) / 1_000_000
      return `${ada.toFixed(2)} ADA`
    } catch {
      return '0 ADA'
    }
  }
}

export const walletManager = WalletManager.getInstance()