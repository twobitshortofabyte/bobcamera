import { create } from 'zustand'

export interface Detection {
  id: string
  x: number
  y: number
  width: number
  height: number
  confidence: number
  class: string
  timestamp: number
}

export interface AppState {
  // System state
  isOnline: boolean
  mockMode: boolean
  backendStatus: 'unknown' | 'online' | 'offline'
  
  // BOB state
  isRunning: boolean
  lastHeartbeat: number | null
  
  // Detection data
  detections: Detection[]
  detectionBuffer: Detection[]
  
  // Settings
  settings: {
    confidence: number
    nms: number
    showOverlay: boolean
    showBoxes: boolean
    showLabels: boolean
    source: string
  }
  
  // UI state
  sidebarOpen: boolean
  
  // Actions
  setOnline: (online: boolean) => void
  setMockMode: (mock: boolean) => void
  setBackendStatus: (status: 'unknown' | 'online' | 'offline') => void
  setRunning: (running: boolean) => void
  setHeartbeat: (timestamp: number) => void
  addDetections: (detections: Detection[]) => void
  clearDetections: () => void
  updateSettings: (settings: Partial<AppState['settings']>) => void
  toggleSidebar: () => void
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  isOnline: false,
  mockMode: false,
  backendStatus: 'unknown',
  isRunning: false,
  lastHeartbeat: null,
  detections: [],
  detectionBuffer: [],
  settings: {
    confidence: 0.5,
    nms: 0.4,
    showOverlay: true,
    showBoxes: true,
    showLabels: true,
    source: 'camera',
  },
  sidebarOpen: false,

  // Actions
  setOnline: (online) => set({ isOnline: online }),
  setMockMode: (mock) => set({ mockMode: mock }),
  setBackendStatus: (status) => set({ backendStatus: status }),
  setRunning: (running) => set({ isRunning: running }),
  setHeartbeat: (timestamp) => set({ lastHeartbeat: timestamp }),
  
  addDetections: (newDetections) => {
    const state = get()
    const allDetections = [...state.detections, ...newDetections]
    // Keep only last 1000 detections for performance
    const trimmed = allDetections.slice(-1000)
    set({ detections: trimmed })
  },
  
  clearDetections: () => set({ detections: [] }),
  
  updateSettings: (newSettings) => {
    const state = get()
    const updatedSettings = { ...state.settings, ...newSettings }
    set({ settings: updatedSettings })
    // Persist to localStorage
    localStorage.setItem('bob-ui-settings', JSON.stringify(updatedSettings))
  },
  
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}))

// Load settings from localStorage on initialization
const savedSettings = localStorage.getItem('bob-ui-settings')
if (savedSettings) {
  try {
    const settings = JSON.parse(savedSettings)
    useAppStore.getState().updateSettings(settings)
  } catch (e) {
    console.warn('Failed to load saved settings:', e)
  }
}