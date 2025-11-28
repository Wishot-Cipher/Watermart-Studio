// src/types/watermark.ts - Clean type definitions

export type FontKey = 'inter' | 'playfair' | 'montserrat' | 'roboto-slab' | 'pacifico'

export type WatermarkStyle = 
  | 'modern-glass'
  | 'neon-glow'
  | 'elegant-serif'
  | 'bold-impact'
  | 'minimal-clean'
  | 'gradient-fade'
  | 'stamp-vintage'
  | 'tech-futuristic'

export interface WatermarkConfig {
  text: string
  // Keep legacy single logo for compatibility, and add multiple logos support
  logoUrl: string | null
  // New richer logo objects allow per-logo scale/position/opacity
  logoUrls?: string[]
  logos?: Array<{
    url: string
    // size multiplier relative to computed base logo size (1 = default)
    scale?: number
    // optional custom position in CSS pixels (x,y)
    x?: number
    y?: number
    // per-logo opacity (0-100)
    opacity?: number
    // rotation in degrees
    rotation?: number
  }>
  // Image scale multiplier (1 = original size, 2 = 2x larger)
  imageScale?: number
  style: WatermarkStyle
  fontFamily: FontKey
  fontWeight: '400' | '600' | '700' | '800'
  color: string
  size: number
  opacity: number
  rotation: number
  position: string
  aiPlacement: boolean
  blendMode: string
  shadowIntensity: number
  glowEffect: boolean
}

export interface ImageAdjustments {
  exposure: number
  contrast: number
  saturation: number
  temperature: number
}

export interface WatermarkMeta extends WatermarkConfig {
  customPos?: { x: number; y: number }
}