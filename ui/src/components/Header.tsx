import { useAppStore } from '../store/useAppStore'

export function Header() {
  const { backendStatus, mockMode, toggleSidebar } = useAppStore()
  
  return (
    <header className="bg-gray-900 text-white p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-700 rounded"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-xl font-bold">BOB Camera</h1>
      </div>
      
      <div className="flex items-center gap-4">
        {mockMode && (
          <span className="bg-yellow-600 text-yellow-100 px-2 py-1 rounded text-sm">
            Mock Mode
          </span>
        )}
        <StatusPill status={backendStatus} />
      </div>
    </header>
  )
}

function StatusPill({ status }: { status: 'unknown' | 'online' | 'offline' }) {
  const colors = {
    unknown: 'bg-gray-500',
    online: 'bg-green-500',
    offline: 'bg-red-500'
  }
  
  const labels = {
    unknown: 'Unknown',
    online: 'Online',
    offline: 'Offline'
  }
  
  return (
    <div className={`${colors[status]} text-white px-3 py-1 rounded-full text-sm flex items-center gap-2`}>
      <div className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-green-300' : 'bg-gray-300'}`} />
      {labels[status]}
    </div>
  )
}