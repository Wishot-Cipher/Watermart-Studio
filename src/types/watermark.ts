// ===================================================================
// src/types/watermark.ts
// ENHANCED WITH MULTI-LOGO AND ADVANCED FEATURES
// ===================================================================

export type FontKey = 'inter' | 'playfair' | 'montserrat' | 'roboto-slab' | 'pacifico';

export type WatermarkStyle = 
  | 'modern-glass'
  | 'neon-glow'
  | 'elegant-serif'
  | 'bold-impact'
  | 'minimal-clean'
  | 'gradient-fade'
  | 'stamp-vintage'
  | 'tech-futuristic';

// Enhanced Logo with individual controls
export interface WatermarkLogo {
  id: string;
  dataUrl: string;
  position: { x: number; y: number };
  size: number; // 1-200 scale
  rotation: number; // -180 to 180
  opacity: number; // 0-100
  locked?: boolean; // Lock position/size
}

export interface WatermarkConfig {
  text: string;
  logos: WatermarkLogo[]; // Support multiple logos
  style: WatermarkStyle;
  fontFamily: FontKey;
  fontWeight: '400' | '600' | '700' | '800';
  color: string;
  size: number;
  opacity: number;
  rotation: number;
  position: string;
  aiPlacement: boolean;
  blendMode: string;
  shadowIntensity: number;
  glowEffect: boolean;
  gradientFrom?: string;
  gradientTo?: string;
  strokeWidth?: number;
  strokeColor?: string;
  
  // Professional typography
  letterSpacing?: number;
  lineHeight?: number;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';

  // Dropcap (large first-letter) styling
  dropcap?: boolean;
  dropcapSize?: number;
  
  // Advanced shadow controls
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  shadowColor?: string;
  
  // Advanced glow controls
  glowIntensity?: number;
  glowColor?: string;
  
  // Pattern controls
  pattern?: 'none' | 'tiled' | 'diagonal' | 'grid' | 'scattered' | 'border';
  patternSpacing?: number;
  patternOpacity?: number;
  
  // Preset
  preset?: string;
}

// Enhanced image adjustments with professional controls
export interface ImageAdjustments {
  // Basic adjustments
  exposure: number;
  contrast: number;
  saturation: number;
  temperature: number;
  
  // Professional adjustments
  highlights: number;
  shadows: number;
  whites: number;
  blacks: number;
  vibrance: number;
  clarity: number;
  dehaze: number;
  vignette: number;
  grain: number;
  sharpen: number;
  
  // Color grading
  tint: number;
  hue: number;
  
  // Filters
  filterPreset?:
    | 'none'
    | 'vivid'
    | 'dramatic'
    | 'warm'
    | 'cool'
    | 'vintage'
    | 'bw'
    | 'cinematic'
    | 'portrait'
    | 'hdr'
    | 'matte'
    | 'film'
    | 'moody'
    | 'pro'
    // Additional creative presets
    | 'golden-hour'
    | 'magazine-cover'
    | 'teal-orange'
    | 'fashion-editorial'
    | 'neon-pop'
    | 'cyberpunk'
    | 'tropical-vibes'
    | 'ocean-depth'
    | 'autumn-warmth'
    | 'sunset-glow'
    | 'luxury-gold'
    | 'arctic-blue'
    | 'nordic-minimal'
    | 'pastel-dream'
    | 'urban-grit';
}

export interface ExportOptions {
  quality: 'normal' | 'standard' | 'hd' | 'ultra';
  format: 'jpg' | 'png' | 'webp';
  watermarkEnabled: boolean;
}

export const DEFAULT_ADJUSTMENTS: ImageAdjustments = {
  exposure: 0,
  contrast: 0,
  saturation: 0,
  temperature: 0,
  highlights: 0,
  shadows: 0,
  whites: 0,
  blacks: 0,
  vibrance: 0,
  clarity: 0,
  dehaze: 0,
  vignette: 0,
  grain: 0,
  sharpen: 0,
  tint: 0,
  hue: 0,
  filterPreset: 'none'
};

export const EXPORT_QUALITY_SETTINGS = {
  normal: { quality: 0.85, maxDimension: 1280 },
  standard: { quality: 0.92, maxDimension: 1920 },
  // Professional quality: HD and Ultra use maximum quality for pristine results
  hd: { quality: 1.0, maxDimension: 2560 },
  ultra: { quality: 1.0, maxDimension: 4096 }
};
