import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { apiClient } from '../lib/api'

export function ControlsPanel() {
  const { isRunning, mockMode, clearDetections } = useAppStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const handleStart = async () => {
    if (mockMode) {
      // Mock mode - just toggle state
      useAppStore.getState().setRunning(true)
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      await apiClient.start()
      useAppStore.getState().setRunning(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start')
      console.error('Start failed:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const handleStop = async () => {
    if (mockMode) {
      // Mock mode - just toggle state
      useAppStore.getState().setRunning(false)
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      await apiClient.stop()
      useAppStore.getState().setRunning(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to stop')
      console.error('Stop failed:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const handleClearDetections = () => {
    clearDetections()
  }
  
  return (
    <div className="bg-white rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Controls</h3>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="space-y-3">
        {/* Start/Stop Controls */}
        <div className="flex gap-2">
          <button
            onClick={handleStart}
            disabled={loading || isRunning}
            className={`px-4 py-2 rounded font-medium ${
              isRunning
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700 disabled:opacity-50'
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Starting...
              </span>
            ) : (
              'Start Detection'
            )}
          </button>
          
          <button
            onClick={handleStop}
            disabled={loading || !isRunning}
            className={`px-4 py-2 rounded font-medium ${
              !isRunning
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-red-600 text-white hover:bg-red-700 disabled:opacity-50'
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Stopping...
              </span>
            ) : (
              'Stop Detection'
            )}
          </button>
        </div>
        
        {/* Status Display */}
        <div className="text-sm text-gray-600">
          Status: <span className={`font-medium ${isRunning ? 'text-green-600' : 'text-gray-500'}`}>
            {isRunning ? 'Running' : 'Stopped'}
          </span>
        </div>
        
        {mockMode && (
          <div className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
            ⚠️ Running in mock mode - backend unavailable
          </div>
        )}
        
        {/* Additional Controls */}
        <div className="border-t pt-3 mt-3">
          <button
            onClick={handleClearDetections}
            className="text-sm text-gray-600 hover:text-gray-800 underline"
          >
            Clear Detection History
          </button>
        </div>
        
        {/* Quick Stats */}
        <DetectionStats />
      </div>
    </div>
  )
}

function DetectionStats() {
  const { detections } = useAppStore()
  
  const recentDetections = detections.filter(d => Date.now() - d.timestamp < 60000)
  const detectionRate = recentDetections.length / 60 // per second over last minute
  
  return (
    <div className="border-t pt-3 mt-3 text-sm text-gray-600">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <div className="font-medium">Total</div>
          <div>{detections.length}</div>
        </div>
        <div>
          <div className="font-medium">Rate</div>
          <div>{detectionRate.toFixed(1)}/s</div>
        </div>
      </div>
    </div>
  )
}