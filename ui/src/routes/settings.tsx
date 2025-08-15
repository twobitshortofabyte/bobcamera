import { useAppStore } from '../store/useAppStore'
import { apiClient } from '../lib/api'

export function Settings() {
  const { settings, updateSettings, mockMode } = useAppStore()
  
  const handleSliderChange = (key: keyof typeof settings, value: number) => {
    const newSettings = { [key]: value }
    updateSettings(newSettings)
    
    // Try to send to backend if available
    if (!mockMode) {
      apiClient.updateConfig(newSettings).catch(() => {
        // Silently fail - config API might not be available
      })
    }
  }
  
  const handleToggleChange = (key: keyof typeof settings, checked: boolean) => {
    const newSettings = { [key]: checked }
    updateSettings(newSettings)
    
    // Try to send to backend if available
    if (!mockMode) {
      apiClient.updateConfig(newSettings).catch(() => {
        // Silently fail - config API might not be available
      })
    }
  }
  
  const handleSourceChange = (source: string) => {
    const newSettings = { source }
    updateSettings(newSettings)
    
    // Try to send to backend if available
    if (!mockMode) {
      apiClient.updateConfig(newSettings).catch(() => {
        // Silently fail - config API might not be available
      })
    }
  }
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="space-y-8">
        {/* Detection Settings */}
        <SettingsSection title="Detection Parameters">
          <div className="space-y-6">
            <SliderSetting
              label="Confidence Threshold"
              value={settings.confidence}
              onChange={(value) => handleSliderChange('confidence', value)}
              min={0}
              max={1}
              step={0.05}
              description="Minimum confidence score for detections"
            />
            
            <SliderSetting
              label="NMS Threshold" 
              value={settings.nms}
              onChange={(value) => handleSliderChange('nms', value)}
              min={0}
              max={1}
              step={0.05}
              description="Non-maximum suppression threshold for overlapping detections"
            />
          </div>
        </SettingsSection>
        
        {/* Overlay Settings */}
        <SettingsSection title="Overlay Display">
          <div className="space-y-4">
            <ToggleSetting
              label="Show Overlay"
              checked={settings.showOverlay}
              onChange={(checked) => handleToggleChange('showOverlay', checked)}
              description="Display detection overlays on video stream"
            />
            
            <ToggleSetting
              label="Show Bounding Boxes"
              checked={settings.showBoxes}
              onChange={(checked) => handleToggleChange('showBoxes', checked)}
              description="Draw bounding boxes around detections"
              disabled={!settings.showOverlay}
            />
            
            <ToggleSetting
              label="Show Labels"
              checked={settings.showLabels}
              onChange={(checked) => handleToggleChange('showLabels', checked)}
              description="Display class labels and confidence scores"
              disabled={!settings.showOverlay}
            />
          </div>
        </SettingsSection>
        
        {/* Source Settings */}
        <SettingsSection title="Video Source">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Input Source
              </label>
              <select
                value={settings.source}
                onChange={(e) => handleSourceChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="camera">Camera</option>
                <option value="file">Video File</option>
                <option value="stream">Network Stream</option>
              </select>
              <p className="text-sm text-gray-500 mt-1">
                Select the video input source for detection
              </p>
            </div>
          </div>
        </SettingsSection>
        
        {/* Status */}
        {mockMode && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <span className="text-yellow-600">⚠️</span>
              <span className="font-medium text-yellow-800">Mock Mode Active</span>
            </div>
            <p className="text-sm text-yellow-700 mt-1">
              Settings are saved locally but won't be sent to the backend until it's available.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {children}
    </div>
  )
}

function SliderSetting({
  label,
  value,
  onChange,
  min,
  max,
  step,
  description
}: {
  label: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step: number
  description?: string
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm text-gray-600">{value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
      />
      {description && (
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      )}
    </div>
  )
}

function ToggleSetting({
  label,
  checked,
  onChange,
  description,
  disabled = false
}: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  description?: string
  disabled?: boolean
}) {
  return (
    <div className={`flex items-start gap-3 ${disabled ? 'opacity-50' : ''}`}>
      <div className="flex items-center h-5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
        />
      </div>
      <div className="flex-1">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>
    </div>
  )
}