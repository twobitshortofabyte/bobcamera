import { useAppStore } from '../store/useAppStore'

export function DetectionTable() {
  const { detections } = useAppStore()
  
  // Get recent detections (last 10 seconds) and sort by timestamp
  const recentDetections = detections
    .filter(det => Date.now() - det.timestamp < 10000)
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 100) // Limit to 100 most recent
  
  if (recentDetections.length === 0) {
    return (
      <div className="bg-white rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Recent Detections</h3>
        <div className="text-gray-500 text-center py-8">
          No recent detections
        </div>
      </div>
    )
  }
  
  return (
    <div className="bg-white rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Recent Detections</h3>
        <span className="text-sm text-gray-500">
          {recentDetections.length} detections
        </span>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="text-left p-2">Time</th>
              <th className="text-left p-2">Class</th>
              <th className="text-left p-2">Confidence</th>
              <th className="text-left p-2">Position</th>
            </tr>
          </thead>
          <tbody>
            {recentDetections.map((detection) => (
              <DetectionRow key={detection.id} detection={detection} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function DetectionRow({ detection }: { detection: any }) {
  const age = Date.now() - detection.timestamp
  const timeAgo = formatTimeAgo(age)
  
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-2 text-gray-600">{timeAgo}</td>
      <td className="p-2">
        <span 
          className="inline-block w-3 h-3 rounded-full mr-2"
          style={{ backgroundColor: getClassColorHex(detection.class) }}
        />
        {detection.class}
      </td>
      <td className="p-2">
        <div className="flex items-center gap-2">
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${detection.confidence * 100}%` }}
            />
          </div>
          <span className="text-xs">{(detection.confidence * 100).toFixed(0)}%</span>
        </div>
      </td>
      <td className="p-2 text-gray-600 font-mono text-xs">
        {Math.round(detection.x)}, {Math.round(detection.y)}
      </td>
    </tr>
  )
}

function formatTimeAgo(ms: number): string {
  if (ms < 1000) return 'now'
  if (ms < 60000) return `${Math.floor(ms / 1000)}s`
  if (ms < 3600000) return `${Math.floor(ms / 60000)}m`
  return `${Math.floor(ms / 3600000)}h`
}

function getClassColorHex(className: string): string {
  const hash = className.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  
  const colors = [
    '#ff6384', '#36a2eb', '#ffcd56', '#4bc0c0',
    '#9966ff', '#ff9f40', '#c7c7c7', '#5362ff'
  ]
  
  return colors[Math.abs(hash) % colors.length]
}