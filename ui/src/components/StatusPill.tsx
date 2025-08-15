import { useAppStore } from '../store/useAppStore'

export function StatusPill() {
  const { backendStatus, isRunning, lastHeartbeat } = useAppStore()
  
  const getStatus = () => {
    if (backendStatus === 'offline') return { color: 'bg-red-500', text: 'Offline' }
    if (backendStatus === 'unknown') return { color: 'bg-gray-500', text: 'Unknown' }
    if (!isRunning) return { color: 'bg-yellow-500', text: 'Stopped' }
    
    // Check if heartbeat is recent (within last 5 seconds)
    const now = Date.now()
    const heartbeatAge = lastHeartbeat ? now - lastHeartbeat : Infinity
    if (heartbeatAge > 5000) {
      return { color: 'bg-orange-500', text: 'Stale' }
    }
    
    return { color: 'bg-green-500', text: 'Running' }
  }
  
  const status = getStatus()
  
  return (
    <div className={`${status.color} text-white px-3 py-1 rounded-full text-sm flex items-center gap-2`}>
      <div className={`w-2 h-2 rounded-full ${status.color.replace('bg-', 'bg-').replace('500', '300')}`} />
      {status.text}
    </div>
  )
}