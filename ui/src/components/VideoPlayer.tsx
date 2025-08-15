import { useEffect, useRef, useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { mockFrameSource } from '../lib/mock/mockFrameSource'
import { CanvasOverlay } from './CanvasOverlay'

export function VideoPlayer() {
  const { mockMode, isRunning, backendStatus } = useAppStore()
  const imgRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 640, height: 480 })
  const [imageError, setImageError] = useState(false)
  
  const getStreamUrl = () => {
    if (mockMode || backendStatus === 'offline') {
      return mockFrameSource.getVideoUrl()
    }
    return '/stream'
  }
  
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        // Maintain 4:3 aspect ratio
        const width = rect.width
        const height = (width * 3) / 4
        setDimensions({ width, height })
      }
    }
    
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])
  
  const handleImageLoad = () => {
    setImageError(false)
    if (imgRef.current) {
      setDimensions({
        width: imgRef.current.naturalWidth || 640,
        height: imgRef.current.naturalHeight || 480
      })
    }
  }
  
  const handleImageError = () => {
    setImageError(true)
    useAppStore.getState().setBackendStatus('offline')
    useAppStore.getState().setMockMode(true)
  }
  
  return (
    <div 
      ref={containerRef}
      className="relative bg-black rounded-lg overflow-hidden"
      style={{ aspectRatio: '4/3' }}
    >
      {/* Video Stream */}
      <img
        ref={imgRef}
        src={getStreamUrl()}
        alt="Video stream"
        className="w-full h-full object-contain"
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{ display: imageError ? 'none' : 'block' }}
      />
      
      {/* Error/Fallback State */}
      {imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white">
          <div className="text-center">
            <div className="text-4xl mb-4">📹</div>
            <div className="text-lg mb-2">Stream Unavailable</div>
            <div className="text-sm text-gray-400">
              {mockMode ? 'Using mock mode' : 'Trying to reconnect...'}
            </div>
          </div>
        </div>
      )}
      
      {/* Canvas Overlay for Detections */}
      <CanvasOverlay
        width={dimensions.width}
        height={dimensions.height}
        className="absolute inset-0 pointer-events-none"
      />
      
      {/* Status Overlay */}
      <div className="absolute top-4 left-4 flex gap-2">
        {mockMode && (
          <span className="bg-yellow-600 bg-opacity-90 text-white px-2 py-1 rounded text-sm">
            MOCK
          </span>
        )}
        {isRunning && (
          <span className="bg-red-600 bg-opacity-90 text-white px-2 py-1 rounded text-sm animate-pulse">
            ● REC
          </span>
        )}
      </div>
      
      {/* Frame Info */}
      <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
        {dimensions.width} × {dimensions.height}
      </div>
    </div>
  )
}