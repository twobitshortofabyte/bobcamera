import { Link, useLocation } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'

export function Sidebar() {
  const { sidebarOpen } = useAppStore()
  const location = useLocation()
  
  const menuItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ]
  
  if (!sidebarOpen) return null
  
  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 p-3 rounded hover:bg-gray-700 transition-colors ${
              location.pathname === item.path ? 'bg-gray-700' : ''
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}