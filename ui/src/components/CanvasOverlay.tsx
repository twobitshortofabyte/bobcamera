import { useEffect, useRef } from 'react'
import { useAppStore } from '../store/useAppStore'

interface CanvasOverlayProps {
  width: number
  height: number
  className?: string
}

export function CanvasOverlay({ width, height, className }: CanvasOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { detections, settings } = useAppStore()
  const animationFrameRef = useRef<number | undefined>(undefined)
  
  useEffect(() => {
    if (!canvasRef.current) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Set canvas size to match video
    canvas.width = width
    canvas.height = height
    
    const drawDetections = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height)
      
      if (!settings.showOverlay) return
      
      // Get recent detections (last 2 seconds)
      const now = Date.now()
      const recentDetections = detections.filter(det => now - det.timestamp < 2000)
      
      // Draw detection boxes
      recentDetections.forEach(detection => {
        const age = now - detection.timestamp
        const alpha = Math.max(0, 1 - age / 2000) // Fade out over 2 seconds
        
        if (settings.showBoxes) {
          // Box color based on class
          let color = getClassColor(detection.class)
          ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`
          ctx.lineWidth = 2
          ctx.strokeRect(detection.x, detection.y, detection.width, detection.height)
          
          // Confidence bar
          const confidenceWidth = detection.width * detection.confidence
          ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha * 0.3})`
          ctx.fillRect(detection.x, detection.y - 4, confidenceWidth, 4)
        }
        
        if (settings.showLabels) {
          // Label background
          const label = `${detection.class} ${(detection.confidence * 100).toFixed(0)}%`
          ctx.font = '12px sans-serif'
          const metrics = ctx.measureText(label)
          const labelWidth = metrics.width + 8
          const labelHeight = 16
          
          ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.7})`
          ctx.fillRect(detection.x, detection.y - labelHeight - 4, labelWidth, labelHeight)
          
          // Label text
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
          ctx.fillText(label, detection.x + 4, detection.y - 8)
        }
      })
      
      // Continue animation
      animationFrameRef.current = requestAnimationFrame(drawDetections)
    }
    
    drawDetections()
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [detections, settings, width, height])
  
  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: '100%', height: '100%' }}
    />
  )
}

function getClassColor(className: string): { r: number; g: number; b: number } {
  // Generate consistent colors for each class
  const hash = className.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  
  const colors = [
    { r: 255, g: 99, b: 132 },   // Red-ish
    { r: 54, g: 162, b: 235 },   // Blue-ish
    { r: 255, g: 205, b: 86 },   // Yellow-ish
    { r: 75, g: 192, b: 192 },   // Teal-ish
    { r: 153, g: 102, b: 255 },  // Purple-ish
    { r: 255, g: 159, b: 64 },   // Orange-ish
    { r: 199, g: 199, b: 199 },  // Gray-ish
    { r: 83, g: 102, b: 255 },   // Indigo-ish
  ]
  
  return colors[Math.abs(hash) % colors.length]
}