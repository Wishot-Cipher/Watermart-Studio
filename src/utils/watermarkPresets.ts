import { WatermarkConfig } from '@/types/watermark';

export interface WatermarkPreset {
  id: string;
  name: string;
  category: 'photographer' | 'brand' | 'copyright' | 'creative' | 'professional';
  description: string;
  config: Partial<WatermarkConfig>;
  thumbnail?: string;
}

export const WATERMARK_PRESETS: WatermarkPreset[] = [
  // PHOTOGRAPHER PRESETS
  {
    id: 'minimal-signature',
    name: 'Minimal Signature',
    category: 'photographer',
    description: 'Clean, unobtrusive watermark',
    config: {
      style: 'minimal-clean',
      fontFamily: 'inter',
      fontWeight: '400',
      size: 35,
      opacity: 60,
      color: '#FFFFFF',
      position: 'bottom-right',
      letterSpacing: 2,
      textTransform: 'uppercase',
      shadowIntensity: 20,
      shadowBlur: 4,
      shadowColor: '#000000',
    }
  },
  {
    id: 'elegant-serif',
    name: 'Elegant Serif',
    category: 'photographer',
    description: 'Sophisticated serif watermark',
    config: {
      style: 'elegant-serif',
      fontFamily: 'playfair',
      fontWeight: '600',
      size: 45,
      opacity: 70,
      color: '#FFFFFF',
      position: 'bottom-center',
      letterSpacing: 5,
      lineHeight: 1.2,
      shadowIntensity: 30,
      shadowBlur: 6,
      shadowColor: '#000000',
    }
  },
  {
    id: 'modern-bold',
    name: 'Modern Bold',
    category: 'photographer',
    description: 'Strong, impactful presence',
    config: {
      style: 'bold-impact',
      fontFamily: 'montserrat',
      fontWeight: '800',
      size: 55,
      opacity: 75,
      color: '#FFFFFF',
      position: 'center',
      letterSpacing: 3,
      textTransform: 'uppercase',
      strokeWidth: 2,
      strokeColor: '#000000',
      shadowIntensity: 40,
    }
  },

  // COPYRIGHT PRESETS
  {
    id: 'copyright-corner',
    name: 'Copyright Corner',
    category: 'copyright',
    description: 'Standard copyright notice',
    config: {
      style: 'minimal-clean',
      fontFamily: 'roboto-slab',
      fontWeight: '400',
      size: 28,
      opacity: 50,
      color: '#FFFFFF',
      position: 'bottom-left',
      letterSpacing: 1,
      shadowIntensity: 15,
      shadowBlur: 3,
    }
  },
  {
    id: 'copyright-stamp',
    name: 'Copyright Stamp',
    category: 'copyright',
    description: 'Official stamp style',
    config: {
      style: 'stamp-vintage',
      fontFamily: 'roboto-slab',
      fontWeight: '700',
      size: 40,
      opacity: 65,
      color: '#FF4444',
      position: 'bottom-right',
      rotation: -5,
      strokeWidth: 1,
      strokeColor: '#990000',
      shadowIntensity: 25,
    }
  },

  // BRAND PRESETS
  {
    id: 'brand-modern-glass',
    name: 'Brand Glass',
    category: 'brand',
    description: 'Frosted glass effect',
    config: {
      style: 'modern-glass',
      fontFamily: 'inter',
      fontWeight: '600',
      size: 50,
      opacity: 85,
      color: '#FFFFFF',
      position: 'center',
      letterSpacing: 4,
      textTransform: 'uppercase',
      shadowIntensity: 35,
      shadowBlur: 8,
      glowEffect: true,
      glowIntensity: 20,
      glowColor: '#1A7CFF',
    }
  },
  {
    id: 'brand-gradient',
    name: 'Brand Gradient',
    category: 'brand',
    description: 'Vibrant gradient colors',
    config: {
      style: 'gradient-fade',
      fontFamily: 'montserrat',
      fontWeight: '700',
      size: 60,
      opacity: 90,
      gradientFrom: '#FF0080',
      gradientTo: '#7928CA',
      position: 'center',
      letterSpacing: 6,
      textTransform: 'uppercase',
      shadowIntensity: 45,
      shadowBlur: 10,
    }
  },
  {
    id: 'brand-neon',
    name: 'Brand Neon',
    category: 'brand',
    description: 'Electric neon glow',
    config: {
      style: 'neon-glow',
      fontFamily: 'inter',
      fontWeight: '800',
      size: 65,
      opacity: 95,
      color: '#00FFFF',
      position: 'center',
      letterSpacing: 8,
      textTransform: 'uppercase',
      glowEffect: true,
      glowIntensity: 80,
      glowColor: '#00FFFF',
      shadowIntensity: 50,
      shadowBlur: 15,
      shadowColor: '#0000FF',
    }
  },

  // CREATIVE PRESETS
  {
    id: 'creative-handwritten',
    name: 'Handwritten',
    category: 'creative',
    description: 'Personal touch signature',
    config: {
      style: 'minimal-clean',
      fontFamily: 'pacifico',
      fontWeight: '400',
      size: 55,
      opacity: 70,
      color: '#FFFFFF',
      position: 'bottom-right',
      rotation: -3,
      letterSpacing: 0,
      shadowIntensity: 25,
      shadowBlur: 6,
    }
  },
  {
    id: 'creative-artistic',
    name: 'Artistic Flair',
    category: 'creative',
    description: 'Bold artistic statement',
    config: {
      style: 'neon-glow',
      fontFamily: 'playfair',
      fontWeight: '700',
      size: 70,
      opacity: 80,
      gradientFrom: '#FFD700',
      gradientTo: '#FF6B6B',
      position: 'center',
      rotation: -2,
      letterSpacing: 10,
      glowEffect: true,
      glowIntensity: 60,
      glowColor: '#FFD700',
      shadowIntensity: 40,
    }
  },
  {
    id: 'creative-vintage',
    name: 'Vintage Stamp',
    category: 'creative',
    description: 'Retro stamp effect',
    config: {
      style: 'stamp-vintage',
      fontFamily: 'roboto-slab',
      fontWeight: '800',
      size: 50,
      opacity: 75,
      color: '#8B4513',
      position: 'top-right',
      rotation: 8,
      letterSpacing: 2,
      textTransform: 'uppercase',
      strokeWidth: 2,
      strokeColor: '#5C2E0C',
      shadowIntensity: 30,
    }
  },

  // PROFESSIONAL PRESETS
  {
    id: 'pro-corporate',
    name: 'Corporate Clean',
    category: 'professional',
    description: 'Professional business style',
    config: {
      style: 'minimal-clean',
      fontFamily: 'inter',
      fontWeight: '600',
      size: 42,
      opacity: 65,
      color: '#2C3E50',
      position: 'bottom-right',
      letterSpacing: 3,
      textTransform: 'uppercase',
      shadowIntensity: 20,
      shadowBlur: 4,
      shadowColor: '#FFFFFF',
    }
  },
  {
    id: 'pro-tech',
    name: 'Tech Modern',
    category: 'professional',
    description: 'Futuristic tech style',
    config: {
      style: 'tech-futuristic',
      fontFamily: 'montserrat',
      fontWeight: '700',
      size: 48,
      opacity: 80,
      color: '#00D9FF',
      position: 'top-left',
      letterSpacing: 5,
      textTransform: 'uppercase',
      glowEffect: true,
      glowIntensity: 40,
      glowColor: '#0099FF',
      shadowIntensity: 35,
      shadowBlur: 8,
    }
  },
  {
    id: 'pro-luxury',
    name: 'Luxury Gold',
    category: 'professional',
    description: 'Premium gold finish',
    config: {
      style: 'elegant-serif',
      fontFamily: 'playfair',
      fontWeight: '700',
      size: 58,
      opacity: 90,
      gradientFrom: '#FFD700',
      gradientTo: '#FFA500',
      position: 'center',
      letterSpacing: 8,
      lineHeight: 1.3,
      shadowIntensity: 50,
      shadowBlur: 12,
      shadowColor: '#8B4500',
      glowEffect: true,
      glowIntensity: 30,
      glowColor: '#FFD700',
    }
  },
  {
    id: 'pro-tiled',
    name: 'Tiled Protection',
    category: 'professional',
    description: 'Full coverage tiled pattern',
    config: {
      style: 'minimal-clean',
      fontFamily: 'inter',
      fontWeight: '400',
      size: 40,
      opacity: 25,
      color: '#FFFFFF',
      pattern: 'tiled',
      patternSpacing: 200,
      rotation: -45,
      letterSpacing: 2,
      textTransform: 'uppercase',
      shadowIntensity: 15,
    }
  },
  {
    id: 'pro-diagonal',
    name: 'Diagonal Repeat',
    category: 'professional',
    description: 'Diagonal pattern coverage',
    config: {
      style: 'minimal-clean',
      fontFamily: 'montserrat',
      fontWeight: '600',
      size: 35,
      opacity: 30,
      color: '#FFFFFF',
      pattern: 'diagonal',
      patternSpacing: 250,
      letterSpacing: 3,
      textTransform: 'uppercase',
      shadowIntensity: 18,
      shadowBlur: 5,
    }
  },
];

export function getPresetsByCategory(category: WatermarkPreset['category']): WatermarkPreset[] {
  return WATERMARK_PRESETS.filter(preset => preset.category === category);
}

export function getPresetById(id: string): WatermarkPreset | undefined {
  return WATERMARK_PRESETS.find(preset => preset.id === id);
}

export function applyPreset(preset: WatermarkPreset, currentText: string): Partial<WatermarkConfig> {
  return {
    ...preset.config,
    text: currentText, // Preserve current text
  };
}
