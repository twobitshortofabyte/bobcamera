import { useAppStore, type Detection } from '../store/useAppStore'

export interface DetectionMessage {
  detections: Array<{
    bbox: [number, number, number, number] // [x, y, width, height]
    confidence: number
    class_name: string
    timestamp?: number
  }>
  frame_id?: string
  timestamp?: number
}

class WebSocketClient {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 10
  private reconnectDelay = 1000
  private isConnecting = false
  private shouldReconnect = true

  connect() {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.CONNECTING)) {
      return
    }

    this.isConnecting = true
    
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const wsUrl = `${protocol}//${window.location.host}/ws/detections`
      
      this.ws = new WebSocket(wsUrl)
      
      this.ws.onopen = () => {
        console.log('WebSocket connected')
        this.isConnecting = false
        this.reconnectAttempts = 0
        useAppStore.getState().setOnline(true)
        useAppStore.getState().setBackendStatus('online')
      }
      
      this.ws.onmessage = (event) => {
        try {
          const message: DetectionMessage = JSON.parse(event.data)
          this.handleDetectionMessage(message)
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error)
        }
      }
      
      this.ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason)
        this.isConnecting = false
        this.ws = null
        
        if (this.shouldReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.scheduleReconnect()
        } else {
          useAppStore.getState().setOnline(false)
          useAppStore.getState().setBackendStatus('offline')
          useAppStore.getState().setMockMode(true)
        }
      }
      
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        this.isConnecting = false
      }
      
    } catch (error) {
      console.error('Failed to create WebSocket:', error)
      this.isConnecting = false
      this.scheduleReconnect()
    }
  }

  private scheduleReconnect() {
    this.reconnectAttempts++
    const delay = Math.min(this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1), 30000)
    
    console.log(`Scheduling reconnect attempt ${this.reconnectAttempts} in ${delay}ms`)
    
    setTimeout(() => {
      if (this.shouldReconnect) {
        this.connect()
      }
    }, delay)
  }

  private handleDetectionMessage(message: DetectionMessage) {
    const timestamp = message.timestamp || Date.now()
    
    const detections: Detection[] = message.detections.map((det, index) => ({
      id: `${timestamp}-${index}`,
      x: det.bbox[0],
      y: det.bbox[1], 
      width: det.bbox[2],
      height: det.bbox[3],
      confidence: det.confidence,
      class: det.class_name,
      timestamp
    }))
    
    useAppStore.getState().addDetections(detections)
    useAppStore.getState().setHeartbeat(timestamp)
  }

  disconnect() {
    this.shouldReconnect = false
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }
}

export const wsClient = new WebSocketClient()