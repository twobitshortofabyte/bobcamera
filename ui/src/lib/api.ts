import { useAppStore } from '../store/useAppStore'

export interface StatusResponse {
  status: 'running' | 'stopped' | 'error'
  uptime?: number
  fps?: number
  detections_per_second?: number
}

export interface StartResponse {
  success: boolean
  message?: string
}

export interface StopResponse {
  success: boolean
  message?: string
}

class ApiClient {
  private baseUrl = '/api'

  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/status`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      })
      return response.ok
    } catch {
      return false
    }
  }

  async getStatus(): Promise<StatusResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/status`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Failed to get status:', error)
      useAppStore.getState().setBackendStatus('offline')
      throw error
    }
  }

  async start(): Promise<StartResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/start`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Failed to start:', error)
      throw error
    }
  }

  async stop(): Promise<StopResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/stop`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Failed to stop:', error)
      throw error
    }
  }

  async updateConfig(config: Record<string, any>): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/config`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(config)
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
    } catch (error) {
      console.warn('Config update not available:', error)
      // Graceful fallback - just log and continue
    }
  }
}

export const apiClient = new ApiClient()