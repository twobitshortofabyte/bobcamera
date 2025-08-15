import { VideoPlayer } from '../components/VideoPlayer'
import { DetectionTable } from '../components/DetectionTable'
import { ControlsPanel } from '../components/ControlsPanel'

export function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Stream - Takes up 2/3 of the width on large screens */}
        <div className="lg:col-span-2">
          <VideoPlayer />
        </div>
        
        {/* Controls Panel */}
        <div className="space-y-6">
          <ControlsPanel />
        </div>
      </div>
      
      {/* Detection Table - Full width below */}
      <DetectionTable />
    </div>
  )
}