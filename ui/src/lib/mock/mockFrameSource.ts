export interface MockFrameSource {
  getVideoUrl(): string
  isAvailable(): boolean
}

class MockFrameSourceImpl implements MockFrameSource {
  private videoUrl: string
  
  constructor() {
    // Use a placeholder video or image for mock mode
    // This could be a sample video of birds or a static image
    this.videoUrl = this.generateMockVideoUrl()
  }
  
  getVideoUrl(): string {
    return this.videoUrl
  }
  
  isAvailable(): boolean {
    return true
  }
  
  private generateMockVideoUrl(): string {
    // Generate a data URL for a simple colored canvas as MJPEG placeholder
    // In a real implementation, this could point to a sample video file
    return 'data:image/svg+xml;base64,' + btoa(`
      <svg width="640" height="480" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#87CEEB;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#98FB98;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="640" height="480" fill="url(#grad1)" />
        <text x="320" y="200" font-family="Arial, sans-serif" font-size="24" fill="#333" text-anchor="middle">
          BOB Camera - Mock Mode
        </text>
        <text x="320" y="240" font-family="Arial, sans-serif" font-size="16" fill="#666" text-anchor="middle">
          Live detections simulated
        </text>
        <text x="320" y="260" font-family="Arial, sans-serif" font-size="16" fill="#666" text-anchor="middle">
          Backend offline - using mock data
        </text>
        <circle cx="100" cy="100" r="20" fill="#FF6B6B" opacity="0.7">
          <animate attributeName="cx" values="100;540;100" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="300" cy="150" r="15" fill="#4ECDC4" opacity="0.7">
          <animate attributeName="cy" values="150;350;150" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="500" cy="300" r="25" fill="#45B7D1" opacity="0.7">
          <animate attributeName="cx" values="500;140;500" dur="5s" repeatCount="indefinite" />
        </circle>
      </svg>
    `)
  }
}

export const mockFrameSource = new MockFrameSourceImpl()