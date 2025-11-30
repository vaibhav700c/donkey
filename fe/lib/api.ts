import { type ApiResponse, type Actor, type Record, type AccessEntry } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('API request failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  // Actor API methods
  async registerActor(actorData: Omit<Actor, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Actor>> {
    return this.request<Actor>('/actors/register', {
      method: 'POST',
      body: JSON.stringify(actorData),
    })
  }

  async getActors(): Promise<ApiResponse<Actor[]>> {
    return this.request<Actor[]>('/actors')
  }

  async getActor(id: string): Promise<ApiResponse<Actor>> {
    return this.request<Actor>(`/actors/${id}`)
  }

  async updateActor(id: string, updates: Partial<Actor>): Promise<ApiResponse<Actor>> {
    return this.request<Actor>(`/actors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  async deactivateActor(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/actors/${id}/deactivate`, {
      method: 'POST',
    })
  }

  // Record API methods
  async uploadRecord(recordData: FormData): Promise<ApiResponse<Record>> {
    return this.request<Record>('/records/upload', {
      method: 'POST',
      body: recordData,
      headers: {}, // Let browser set Content-Type for FormData
    })
  }

  async getAccessibleRecords(actorId: string): Promise<ApiResponse<Record[]>> {
    return this.request<Record[]>(`/records/accessible/${actorId}`)
  }

  async getRecord(id: string): Promise<ApiResponse<Record>> {
    return this.request<Record>(`/records/${id}`)
  }

  async downloadRecord(id: string): Promise<ApiResponse<Blob>> {
    const response = await fetch(`${API_BASE_URL}/records/${id}/download`)
    if (!response.ok) {
      return {
        success: false,
        error: `Download failed: ${response.status}`,
      }
    }
    const blob = await response.blob()
    return {
      success: true,
      data: blob,
    }
  }

  async revokeAccess(recordId: string, actorId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/records/${recordId}/revoke/${actorId}`, {
      method: 'POST',
    })
  }

  async requestAccess(recordId: string, actorId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/records/${recordId}/request-access`, {
      method: 'POST',
      body: JSON.stringify({ actorId }),
    })
  }

  // Audit API methods
  async getAuditLog(recordId: string): Promise<ApiResponse<AccessEntry[]>> {
    return this.request<AccessEntry[]>(`/audit/${recordId}`)
  }

  async getActorAuditLog(actorId: string): Promise<ApiResponse<AccessEntry[]>> {
    return this.request<AccessEntry[]>(`/audit/actor/${actorId}`)
  }
}

export const apiClient = new ApiClient()