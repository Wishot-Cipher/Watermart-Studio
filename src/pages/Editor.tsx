/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Download, ZoomIn, ZoomOut, RotateCcw, Image as ImageIcon, 
  Type, Layers, ChevronLeft, ChevronRight, X, Plus, Eye, EyeOff,
  Sliders, Sun, Moon, Contrast, Droplets, Thermometer, Film, Aperture, 
  Maximize2, Grid3X3, Sparkles, Copy, Check, LayoutGrid, Repeat, Wand2,
  Move, Lock, Unlock, Trash2, RotateCw
} from 'lucide-react';
import { useImages } from '@/contexts/ImagesContext';
import JSZip from 'jszip';

// Types
type WatermarkStyleType = 'modern' | 'classic' | 'minimal' | 'bold' | 'neon' | 'glass' | 'gradient' | 'outline' | 'shadow3d' | 'vintage' | 'futuristic' | 'elegant' | 'emboss' | 'metallic' | 'cinema' | 'handwritten' | 'glassDark' | 'glassLight' | 'frostedBlur' | 'pill' | 'badge' | 'ribbon' | 'stamp' | 'typewriter' | 'glitch' | 'holographic' | 'fire' | 'ice' | 'nature' | 'luxury' | 'sport' | 'tech';

interface WatermarkConfig {
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  opacity: number;
  rotation: number;
  position: { x: number; y: number };
  style: WatermarkStyleType;
  shadow: boolean;
  outline: boolean;
  outlineColor: string;
  tileMode: boolean;
  tileSpacing: number;
  letterSpacing: number;
  blur: number;
  // Background options applied to the watermark text
  bgStyle?: 'none' | 'solid' | 'gradient' | 'glass';
  bgColor?: string;
  bgColor2?: string;
  bgOpacity?: number; // 0-100
  bgRadius?: number; // px
  bgPadding?: number; // px
  bgGlow?: boolean;
  bgGlowColor?: string;
  bgGlowBlur?: number; // px
  // Text glow (applies to text itself)
  textGlow?: boolean;
  textGlowColor?: string;
  textGlowBlur?: number; // px
}

interface LogoConfig {
  id: string;
  dataUrl: string;
  size: number;
  opacity: number;
  rotation: number;
  position: { x: number; y: number };
  locked: boolean;
}

interface ImageAdjustments {
  brightness: number;
  contrast: number;
  saturation: number;
  exposure: number;
  temperature: number;
  highlights: number;
  shadows: number;
  sharpness: number;
  blur: number;
  vignette: number;
  grain: number;
  clarity: number;
}

const defaultWatermark: WatermarkConfig = {
  text: '',
  fontSize: 48,
  fontFamily: 'Inter',
  color: '#ffffff',
  opacity: 80,
  rotation: 0,
  position: { x: 50, y: 90 },
  style: 'modern',
  shadow: true,
  outline: false,
  outlineColor: '#000000',
  tileMode: false,
  tileSpacing: 150,
  letterSpacing: 0,
  blur: 0,
  bgStyle: 'none',
  bgColor: '#000000',
  bgColor2: '#ffffff',
  bgOpacity: 50,
  bgRadius: 12,
  bgPadding: 12,
  bgGlow: false,
  bgGlowColor: '#00d4ff',
  bgGlowBlur: 36,
  textGlow: false,
  textGlowColor: '#00d4ff',
  textGlowBlur: 28,
};

const defaultAdjustments: ImageAdjustments = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  exposure: 0,
  temperature: 0,
  highlights: 0,
  shadows: 0,
  sharpness: 0,
  blur: 0,
  vignette: 0,
  grain: 0,
  clarity: 0,
};

// Slider Component
const Slider = ({ 
  label, value, onChange, min = -100, max = 100, icon: Icon 
}: { 
  label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; icon: React.ElementType 
}) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-cyan-400" />
        <span className="text-sm text-slate-300">{label}</span>
      </div>
      <span className="text-sm font-mono text-cyan-400">{value > 0 ? '+' : ''}{value}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 bg-slate-800/50 rounded-full appearance-none cursor-pointer accent-cyan-500"
    />
  </div>
);

export default function Editor() {
  const navigate = useNavigate();
  const { images } = useImages();
  // Canvas ref for future export functionality
  const fileInputRef = useRef<HTMLInputElement>(null);
  const watermarkTextRef = useRef<HTMLInputElement | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'watermark' | 'enhance' | 'export'>('watermark');
  const [watermark, setWatermark] = useState<WatermarkConfig>(defaultWatermark);
  const [logos, setLogos] = useState<LogoConfig[]>([]);
  const [adjustments, setAdjustments] = useState<ImageAdjustments>(defaultAdjustments);
  const [zoom] = useState(100);
  const [showWatermark, setShowWatermark] = useState(true);
  const [selectedLogo, setSelectedLogo] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'PNG' | 'JPG' | 'WebP'>('PNG');
  const [exportQuality, setExportQuality] = useState(90);
  const [exportScale, setExportScale] = useState<1 | 2 | 4>(2); // HD scale multiplier
  const [exportProgress, setExportProgress] = useState(0);
  const [copiedSettings, setCopiedSettings] = useState(false);
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportErrorDetails, setExportErrorDetails] = useState<string | null>(null);
  const [exportPreviewUrl, setExportPreviewUrl] = useState<string | null>(null);
  const [exportPreviewFilename, setExportPreviewFilename] = useState<string | null>(null);
  const [batchZipUrl, setBatchZipUrl] = useState<string | null>(null);
  const [batchZipName, setBatchZipName] = useState<string | null>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const currentImage = images[currentIndex];

  // Get watermark style CSS based on selected style
  const getWatermarkStyle = useCallback(() => {
    // helper to convert hex to rgba (supports #rgb, #rrggbb)
    const hexToRgba = (hex: string, alpha = 1) => {
      if (!hex) return `rgba(0,0,0,${alpha})`;
      const h = hex.replace('#', '');
      let r = 0, g = 0, b = 0;
      if (h.length === 3) {
        r = parseInt(h[0] + h[0], 16);
        g = parseInt(h[1] + h[1], 16);
        b = parseInt(h[2] + h[2], 16);
      } else if (h.length === 6) {
        r = parseInt(h.substring(0, 2), 16);
        g = parseInt(h.substring(2, 4), 16);
        b = parseInt(h.substring(4, 6), 16);
      }
      return `rgba(${r},${g},${b},${alpha})`;
    };

    // Text color should respect watermark opacity independently from background
    const textColor = hexToRgba(watermark.color, Math.max(0, Math.min(1, (watermark.opacity ?? 100) / 100)));

    const baseStyle: React.CSSProperties = {
      fontFamily: watermark.fontFamily,
      fontSize: `${watermark.fontSize}px`,
      color: textColor,
      letterSpacing: `${watermark.letterSpacing}px`,
      filter: watermark.blur > 0 ? `blur(${watermark.blur}px)` : 'none',
      padding: undefined,
      borderRadius: undefined,
      display: 'inline-block',
      boxSizing: 'border-box',
    };

    switch (watermark.style) {
      case 'modern':
        return { ...baseStyle, textShadow: '0 2px 10px rgba(0,0,0,0.3)', fontWeight: 600 };
      case 'classic':
        return { ...baseStyle, textShadow: '1px 1px 2px rgba(0,0,0,0.5)', fontWeight: 400, fontStyle: 'italic' as const };
      case 'minimal':
        return { ...baseStyle, fontWeight: 300, opacity: 0.7 };
      case 'bold':
        return { ...baseStyle, fontWeight: 900, textShadow: '3px 3px 0px rgba(0,0,0,0.3)', textTransform: 'uppercase' as const };
      case 'neon':
        return { 
          ...baseStyle, 
          textShadow: `0 0 5px ${watermark.color}, 0 0 10px ${watermark.color}, 0 0 20px ${watermark.color}, 0 0 40px ${watermark.color}`,
          fontWeight: 700 
        };
      case 'glass':
        return { 
          ...baseStyle,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.1))',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          padding: '12px 24px',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.3)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)',
          fontWeight: 500
        };
      case 'glassDark':
        return { 
          ...baseStyle, 
          background: 'linear-gradient(135deg, rgba(0,0,0,0.6), rgba(0,0,0,0.3))',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          padding: '12px 24px',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
          fontWeight: 600,
          color: '#ffffff'
        };
      case 'glassLight':
        return { 
          ...baseStyle, 
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          padding: '12px 24px',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.5)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8)',
          fontWeight: 600,
          color: '#1a1a2e'
        };
      case 'frostedBlur':
        return { 
          ...baseStyle, 
          background: 'linear-gradient(135deg, rgba(255,255,255,0.4), rgba(200,200,255,0.2))',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          padding: '14px 28px',
          borderRadius: '16px',
          border: '2px solid rgba(255,255,255,0.3)',
          boxShadow: '0 8px 32px rgba(100,100,200,0.2)',
          fontWeight: 500
        };
      case 'pill':
        return { 
          ...baseStyle, 
          background: `linear-gradient(135deg, ${watermark.color}, ${watermark.color}dd)`,
          padding: '10px 28px',
          borderRadius: '50px',
          boxShadow: `0 4px 15px ${watermark.color}40`,
          fontWeight: 600,
          color: '#ffffff',
          border: 'none'
        };
      case 'badge':
        return { 
          ...baseStyle, 
          background: 'linear-gradient(135deg, #10b981, #059669)',
          padding: '8px 16px',
          borderRadius: '6px',
          boxShadow: '0 2px 8px rgba(16,185,129,0.4)',
          fontWeight: 700,
          color: '#ffffff',
          textTransform: 'uppercase' as const,
          fontSize: `${watermark.fontSize * 0.85}px`,
          letterSpacing: '1px'
        };
      case 'gradient':
        return { 
          ...baseStyle, 
          background: `linear-gradient(90deg, ${watermark.color}, #A24BFF, #1A7CFF)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 700
        };
      case 'outline':
        return { 
          ...baseStyle, 
          WebkitTextStroke: `2px ${watermark.color}`,
          color: 'transparent',
          fontWeight: 700
        };
      case 'shadow3d':
        return { 
          ...baseStyle, 
          textShadow: `1px 1px 0 #000, 2px 2px 0 #000, 3px 3px 0 #000, 4px 4px 0 #000, 5px 5px 10px rgba(0,0,0,0.5)`,
          fontWeight: 800,
          // subtle glass plate behind the 3D text to help it stand out on busy images
          background: 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
          backdropFilter: 'blur(6px) saturate(120%)',
          WebkitBackdropFilter: 'blur(6px) saturate(120%)',
          padding: '12px 20px',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 12px 36px rgba(2,6,23,0.6)'
        };
      case 'glitch':
        return { 
          ...baseStyle, 
          textShadow: '-2px 0 #ff0000, 2px 0 #00ffff',
          fontWeight: 800,
          animation: 'glitch 0.3s infinite',
          textTransform: 'uppercase' as const
        };
      case 'holographic':
        return { 
          ...baseStyle, 
          background: 'linear-gradient(90deg, #ff0080, #ff8c00, #40e0d0, #ff0080)',
          backgroundSize: '300% 100%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation: 'holographic 3s linear infinite',
          fontWeight: 700
        };
      case 'vintage':
        return { 
          ...baseStyle, 
          textShadow: '2px 2px 0 rgba(139,69,19,0.5)',
          fontWeight: 600,
          textTransform: 'uppercase' as const,
          letterSpacing: '4px'
        };
      case 'futuristic':
        return { 
          ...baseStyle, 
          textShadow: `0 0 10px ${watermark.color}, 0 0 20px ${watermark.color}`,
          fontWeight: 300,
          letterSpacing: '8px',
          textTransform: 'uppercase' as const
        };
      case 'elegant':
        return { 
          ...baseStyle, 
          textShadow: '0 2px 4px rgba(0,0,0,0.2)',
          fontWeight: 400,
          fontStyle: 'italic' as const,
          letterSpacing: '2px'
        };
      case 'luxury':
        return { 
          ...baseStyle, 
          background: 'linear-gradient(135deg, #D4AF37 0%, #F5E7A3 25%, #D4AF37 50%, #F5E7A3 75%, #D4AF37 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 2px 10px rgba(212,175,55,0.5)',
          fontWeight: 700,
          letterSpacing: '3px'
        };
      case 'emboss':
        return { 
          ...baseStyle, 
          textShadow: '-1px -1px 0 rgba(255,255,255,0.4), 1px 1px 0 rgba(0,0,0,0.4), 2px 2px 4px rgba(0,0,0,0.3)',
          fontWeight: 700
        };
      case 'metallic':
        return { 
          ...baseStyle, 
          background: 'linear-gradient(180deg, #BF953F 0%, #FCF6BA 25%, #B38728 50%, #FBF5B7 75%, #AA771C 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          fontWeight: 800
        };
      case 'cinema':
        return { 
          ...baseStyle, 
          textShadow: '0 0 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.6)',
          fontWeight: 600,
          letterSpacing: '6px',
          textTransform: 'uppercase' as const
        };
      case 'stamp':
        return { 
          ...baseStyle, 
          border: `3px solid ${watermark.color}`,
          borderRadius: '8px',
          padding: '8px 16px',
          textTransform: 'uppercase' as const,
          fontWeight: 800,
          transform: 'rotate(-12deg)',
          opacity: 0.85
        };
      case 'ribbon':
        return { 
          ...baseStyle, 
          background: `linear-gradient(135deg, ${watermark.color}, ${watermark.color}cc)`,
          padding: '8px 40px',
          fontWeight: 600,
          color: '#ffffff',
          boxShadow: '2px 2px 10px rgba(0,0,0,0.3)',
          clipPath: 'polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)'
        };
      case 'handwritten':
        return { 
          ...baseStyle, 
          fontFamily: 'Pacifico, cursive',
          textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
          fontWeight: 400,
          transform: 'rotate(-3deg)'
        };
      case 'typewriter':
        return { 
          ...baseStyle, 
          fontFamily: 'Roboto Mono, Courier New, monospace',
          background: 'rgba(255,255,240,0.9)',
          padding: '8px 16px',
          borderRadius: '2px',
          boxShadow: '2px 2px 0 rgba(0,0,0,0.2)',
          color: '#333',
          fontWeight: 500
        };
      case 'fire':
        return { 
          ...baseStyle, 
          background: 'linear-gradient(180deg, #ff0 0%, #f80 30%, #f00 60%, #800 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 10px #f80, 0 0 20px #f00, 0 0 30px #f00',
          fontWeight: 900
        };
      case 'ice':
        return { 
          ...baseStyle, 
          background: 'linear-gradient(180deg, #e0ffff 0%, #87ceeb 30%, #4169e1 70%, #1e90ff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 10px rgba(135,206,235,0.8), 0 0 20px rgba(65,105,225,0.6)',
          fontWeight: 700
        };
      case 'nature':
        return { 
          ...baseStyle, 
          background: 'linear-gradient(135deg, #228B22, #32CD32, #90EE90)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 2px 4px rgba(34,139,34,0.4)',
          fontWeight: 600
        };
      case 'sport':
        return { 
          ...baseStyle, 
          background: 'linear-gradient(135deg, #ff4500, #ff6347)',
          padding: '6px 20px',
          borderRadius: '4px',
          fontWeight: 900,
          color: '#ffffff',
          textTransform: 'uppercase' as const,
          letterSpacing: '2px',
          boxShadow: '0 4px 15px rgba(255,69,0,0.4)',
          transform: 'skewX(-5deg)'
        };
      case 'tech':
        return { 
          ...baseStyle, 
          background: 'linear-gradient(90deg, #00d4ff, #0099ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontFamily: 'Roboto Mono, monospace',
          fontWeight: 600,
          textShadow: '0 0 10px rgba(0,212,255,0.5)',
          letterSpacing: '2px'
        };
      default:
        return baseStyle;
    }
  }, [watermark]);

  // Merge universal background styling for preview (applies regardless of selected style)
  // Note: getWatermarkStyle returns inline CSS used for preview; post-process to add background
  const getMergedWatermarkStyle = useCallback(() => {
    const style = getWatermarkStyle();
    if (!watermark.bgStyle || watermark.bgStyle === 'none') return style;

    const hexToRgba = (hex: string, alpha = 1) => {
      if (!hex) return `rgba(0,0,0,${alpha})`;
      const h = hex.replace('#', '');
      let r = 0, g = 0, b = 0;
      if (h.length === 3) {
        r = parseInt(h[0] + h[0], 16);
        g = parseInt(h[1] + h[1], 16);
        b = parseInt(h[2] + h[2], 16);
      } else if (h.length === 6) {
        r = parseInt(h.substring(0, 2), 16);
        g = parseInt(h.substring(2, 4), 16);
        b = parseInt(h.substring(4, 6), 16);
      }
      return `rgba(${r},${g},${b},${alpha})`;
    };

    const bgOpacity = Math.max(0, Math.min(1, (watermark.bgOpacity ?? 50) / 100));
    const padding = `${(watermark.bgPadding ?? 12)}px`;
    const radius = `${(watermark.bgRadius ?? 12)}px`;

    const bg: React.CSSProperties = {};
    if (watermark.bgStyle === 'solid') {
      bg.background = hexToRgba(watermark.bgColor || '#000000', bgOpacity);
      bg.padding = padding;
      bg.borderRadius = radius;
    } else if (watermark.bgStyle === 'gradient') {
      const c1 = watermark.bgColor || '#000000';
      const c2 = watermark.bgColor2 || '#ffffff';
      bg.background = `linear-gradient(90deg, ${hexToRgba(c1, bgOpacity)}, ${hexToRgba(c2, bgOpacity)})`;
      bg.padding = padding;
      bg.borderRadius = radius;
    } else if (watermark.bgStyle === 'glass') {
      // Slight frosted glass approximation for preview
      bg.background = `linear-gradient(180deg, rgba(255,255,255,${bgOpacity * 0.18}), rgba(255,255,255,${bgOpacity * 0.06}))`;
      bg.border = `1px solid rgba(255,255,255,${Math.max(0.04, bgOpacity * 0.18)})`;
      bg.padding = padding;
      bg.borderRadius = radius;
      bg.backdropFilter = 'blur(8px) saturate(120%)';
      (bg as any).WebkitBackdropFilter = 'blur(8px) saturate(120%)';
    }

    // add glow preview if requested
    if (watermark.bgGlow) {
      const glowColor = watermark.bgGlowColor || '#00d4ff';
      const glowBlur = watermark.bgGlowBlur ?? 24;
      bg.boxShadow = `0 8px ${glowBlur}px ${hexToRgba(glowColor, 0.6)}`;
    }

    // text glow preview (applies to the text layer)
    if (watermark.textGlow) {
      const tg = watermark.textGlowColor || '#00d4ff';
      const tgb = watermark.textGlowBlur ?? 28;
      // make it subtle in preview
      const px = Math.max(6, Math.min(72, Math.round(tgb / 2)));
      const rgba = hexToRgba(tg, 0.7);
      bg.boxShadow = bg.boxShadow ? `${bg.boxShadow}, 0 0 ${px}px ${rgba}` : `0 0 ${px}px ${rgba}`;
    }

    return { ...style, ...bg };
  }, [getWatermarkStyle, watermark]);

  // Generate tile positions for tile mode
  const tilePositions = useMemo(() => {
    if (!watermark.tileMode) return [];
    const positions = [];
    const spacing = watermark.tileSpacing;
    for (let y = -50; y <= 150; y += spacing / 2) {
      for (let x = -50; x <= 150; x += spacing) {
        positions.push({ x: x + (y % 2 === 0 ? 0 : spacing / 4), y });
      }
    }
    return positions;
  }, [watermark.tileMode, watermark.tileSpacing]);

  const watermarkStyles = [
    // Basic Styles
    { id: 'modern', label: 'Modern', icon: '✨', desc: 'Clean & Sharp', color: 'from-cyan-500 to-blue-500', category: 'basic' },
    { id: 'classic', label: 'Classic', icon: '📜', desc: 'Timeless', color: 'from-amber-500 to-orange-500', category: 'basic' },
    { id: 'minimal', label: 'Minimal', icon: '○', desc: 'Subtle', color: 'from-slate-400 to-slate-500', category: 'basic' },
    { id: 'bold', label: 'Bold', icon: '💪', desc: 'Impactful', color: 'from-red-500 to-rose-600', category: 'basic' },
    // Glass & Background Styles
    { id: 'glass', label: 'Glass', icon: '🔮', desc: 'Frosted', color: 'from-sky-400 to-indigo-400', category: 'glass' },
    { id: 'glassDark', label: 'Dark Glass', icon: '🖤', desc: 'Dark Frosted', color: 'from-slate-700 to-slate-900', category: 'glass' },
    { id: 'glassLight', label: 'Light Glass', icon: '🤍', desc: 'Light Frosted', color: 'from-white to-slate-100', category: 'glass' },
    { id: 'frostedBlur', label: 'Frosted', icon: '❄️', desc: 'Blur Effect', color: 'from-blue-200 to-purple-200', category: 'glass' },
    { id: 'pill', label: 'Pill', icon: '💊', desc: 'Rounded BG', color: 'from-violet-500 to-purple-600', category: 'glass' },
    { id: 'badge', label: 'Badge', icon: '🏷️', desc: 'Tag Style', color: 'from-emerald-500 to-teal-600', category: 'glass' },
    // Effect Styles
    { id: 'neon', label: 'Neon', icon: '🌟', desc: 'Glowing', color: 'from-pink-500 to-purple-500', category: 'effects' },
    { id: 'gradient', label: 'Gradient', icon: '🌈', desc: 'Colorful', color: 'from-green-400 via-cyan-500 to-blue-500', category: 'effects' },
    { id: 'outline', label: 'Outline', icon: '◯', desc: 'Border Only', color: 'from-violet-500 to-purple-500', category: 'effects' },
    { id: 'shadow3d', label: '3D', icon: '🎲', desc: 'Dimensional', color: 'from-orange-500 to-red-500', category: 'effects' },
    { id: 'glitch', label: 'Glitch', icon: '📺', desc: 'Digital Error', color: 'from-red-500 via-green-500 to-blue-500', category: 'effects' },
    { id: 'holographic', label: 'Holo', icon: '🌈', desc: 'Rainbow Shift', color: 'from-pink-400 via-purple-400 to-cyan-400', category: 'effects' },
    // Premium Styles
    { id: 'metallic', label: 'Metallic', icon: '⚡', desc: 'Shiny', color: 'from-yellow-300 to-yellow-600', category: 'premium' },
    { id: 'elegant', label: 'Elegant', icon: '👑', desc: 'Premium', color: 'from-fuchsia-500 to-pink-500', category: 'premium' },
    { id: 'luxury', label: 'Luxury', icon: '💎', desc: 'High End', color: 'from-amber-300 via-yellow-500 to-amber-600', category: 'premium' },
    { id: 'emboss', label: 'Emboss', icon: '🏛️', desc: 'Raised', color: 'from-stone-400 to-stone-600', category: 'premium' },
    // Themed Styles
    { id: 'vintage', label: 'Vintage', icon: '📷', desc: 'Retro Feel', color: 'from-yellow-600 to-amber-700', category: 'themed' },
    { id: 'futuristic', label: 'Future', icon: '🚀', desc: 'Sci-Fi', color: 'from-emerald-400 to-cyan-500', category: 'themed' },
    { id: 'cinema', label: 'Cinema', icon: '🎬', desc: 'Movie Style', color: 'from-gray-700 to-gray-900', category: 'themed' },
    { id: 'stamp', label: 'Stamp', icon: '📮', desc: 'Postal Look', color: 'from-red-600 to-red-800', category: 'themed' },
    { id: 'ribbon', label: 'Ribbon', icon: '🎀', desc: 'Banner Style', color: 'from-rose-500 to-pink-600', category: 'themed' },
    // Creative Styles
    { id: 'handwritten', label: 'Script', icon: '✍️', desc: 'Personal', color: 'from-rose-400 to-pink-500', category: 'creative' },
    { id: 'typewriter', label: 'Typewriter', icon: '⌨️', desc: 'Retro Type', color: 'from-gray-600 to-gray-800', category: 'creative' },
    { id: 'fire', label: 'Fire', icon: '🔥', desc: 'Hot Effect', color: 'from-yellow-500 via-orange-500 to-red-600', category: 'creative' },
    { id: 'ice', label: 'Ice', icon: '🧊', desc: 'Cold Effect', color: 'from-cyan-300 via-blue-400 to-indigo-500', category: 'creative' },
    { id: 'nature', label: 'Nature', icon: '🌿', desc: 'Organic', color: 'from-green-400 to-emerald-600', category: 'creative' },
    { id: 'sport', label: 'Sport', icon: '⚽', desc: 'Athletic', color: 'from-orange-500 to-red-600', category: 'creative' },
    { id: 'tech', label: 'Tech', icon: '💻', desc: 'Digital', color: 'from-blue-500 to-indigo-600', category: 'creative' },
  ];

  const fonts = [
    { id: 'Inter', label: 'Inter', style: 'sans-serif' },
    { id: 'Playfair Display', label: 'Playfair', style: 'serif' },
    { id: 'Montserrat', label: 'Montserrat', style: 'sans-serif' },
    { id: 'Roboto Mono', label: 'Roboto Mono', style: 'monospace' },
    { id: 'Pacifico', label: 'Pacifico', style: 'cursive' },
    { id: 'Bebas Neue', label: 'Bebas Neue', style: 'display' },
    { id: 'Oswald', label: 'Oswald', style: 'sans-serif' },
    { id: 'Lora', label: 'Lora', style: 'serif' },
  ];

  const positions = [
    { id: 'tl', label: 'Top Left', x: 10, y: 10 },
    { id: 'tc', label: 'Top Center', x: 50, y: 10 },
    { id: 'tr', label: 'Top Right', x: 90, y: 10 },
    { id: 'cl', label: 'Center Left', x: 10, y: 50 },
    { id: 'cc', label: 'Center', x: 50, y: 50 },
    { id: 'cr', label: 'Center Right', x: 90, y: 50 },
    { id: 'bl', label: 'Bottom Left', x: 10, y: 90 },
    { id: 'bc', label: 'Bottom Center', x: 50, y: 90 },
    { id: 'br', label: 'Bottom Right', x: 90, y: 90 },
  ];

  const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newLogo: LogoConfig = {
          id: `logo-${Date.now()}-${Math.random()}`,
          dataUrl: event.target?.result as string,
          size: 100,
          opacity: 100,
          rotation: 0,
          position: { x: 85, y: 85 },
          locked: false,
        };
        setLogos((prev) => [...prev, newLogo]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const updateLogo = useCallback((id: string, updates: Partial<LogoConfig>) => {
    setLogos((prev) => prev.map((logo) => (logo.id === id ? { ...logo, ...updates } : logo)));
  }, []);

  const deleteLogo = useCallback((id: string) => {
    setLogos((prev) => prev.filter((logo) => logo.id !== id));
    if (selectedLogo === id) setSelectedLogo(null);
  }, [selectedLogo]);

  const resetAdjustments = useCallback(() => {
    setAdjustments(defaultAdjustments);
  }, []);

  // Handle logo dragging
  const handleLogoDrag = useCallback((e: React.MouseEvent, logoId: string) => {
    if (!imageContainerRef.current) return;
    
    const logo = logos.find(l => l.id === logoId);
    if (!logo || logo.locked) return;
    
    setIsDraggingLogo(true);
    setSelectedLogo(logoId);
    
    const container = imageContainerRef.current;
    const rect = container.getBoundingClientRect();
    
    const onMouseMove = (moveEvent: MouseEvent) => {
      const x = ((moveEvent.clientX - rect.left) / rect.width) * 100;
      const y = ((moveEvent.clientY - rect.top) / rect.height) * 100;
      
      updateLogo(logoId, {
        position: {
          x: Math.max(5, Math.min(95, x)),
          y: Math.max(5, Math.min(95, y))
        }
      });
    };
    
    const onMouseUp = () => {
      setIsDraggingLogo(false);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [logos, updateLogo]);

  // Canvas helper: rounded rectangle for drawing background plates
  const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) => {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();
  };

  // Real export functionality with HD support and proper style rendering
  const exportImage = useCallback(async (single = true, preview = false) => {
    if (!currentImage) return;
    
    setIsExporting(true);
    setExportProgress(0);
    setExportError(null);
    setExportErrorDetails(null);
    
    try {
      const imagesToExport = single ? [currentImage] : images;
      const totalImages = imagesToExport.length;
      const scale = preview ? 1 : exportScale; // Use 1x for preview to avoid sampling/blur scale mismatches
      
      const batchResults: { blob: Blob; filename: string }[] = [];

      // If user requested a preview for a batch export, we don't support showing a combined preview.
      if (!single && preview) {
        setExportError('Preview is not supported for batch ZIP exports. Please export a single image for preview.');
        setIsExporting(false);
        return;
      }

      for (let i = 0; i < totalImages; i++) {
        const img = imagesToExport[i];
        setExportProgress(Math.round(((i + 0.5) / totalImages) * 100));
        
        // Create canvas with HD scaling
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { alpha: true }) as CanvasRenderingContext2D;
        if (!ctx) throw new Error('Could not get canvas context');
        
        // Load the image
        const image = new Image();
        image.crossOrigin = 'anonymous';
        
        await new Promise<void>((resolve, reject) => {
          image.onload = () => resolve();
          image.onerror = () => reject(new Error('Failed to load image'));
          image.src = img.url;
        });
        
        // Apply HD scale for higher quality export
        canvas.width = image.naturalWidth * scale;
        canvas.height = image.naturalHeight * scale;
        
        // Enable image smoothing for better quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Scale context for HD
        ctx.scale(scale, scale);
        
        // Apply adjustments
        ctx.filter = `
          brightness(${100 + adjustments.brightness}%)
          contrast(${100 + adjustments.contrast}%)
          saturate(${100 + adjustments.saturation}%)
        `;
        ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
        ctx.filter = 'none';
        
        // Helper function to apply watermark style to canvas
        const applyWatermarkStyle = (text: string, x: number, y: number, fontSize: number) => {
          // small helper to convert hex to rgba for canvas
          const hexToRgbaCanvas = (hex: string, alpha = 1) => {
            if (!hex) return `rgba(0,0,0,${alpha})`;
            const h = hex.replace('#', '');
            let r = 0, g = 0, b = 0;
            if (h.length === 3) {
              r = parseInt(h[0] + h[0], 16);
              g = parseInt(h[1] + h[1], 16);
              b = parseInt(h[2] + h[2], 16);
            } else if (h.length === 6) {
              r = parseInt(h.substring(0, 2), 16);
              g = parseInt(h.substring(2, 4), 16);
              b = parseInt(h.substring(4, 6), 16);
            }
            return `rgba(${r},${g},${b},${alpha})`;
          };

          ctx.save();
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.translate(x, y);
          ctx.rotate((watermark.rotation * Math.PI) / 180);
          
          const scaledFontSize = fontSize;
          const fontWeight = (() => {
            switch (watermark.style) {
              case 'bold': case 'neon': case 'gradient': case 'outline': case 'shadow3d': case 'metallic': case 'emboss': return '800';
              case 'modern': case 'vintage': case 'cinema': return '600';
              case 'minimal': case 'futuristic': return '300';
              case 'classic': case 'elegant': case 'handwritten': return '400';
              default: return '500';
            }
          })();
          
          const fontStyle = ['classic', 'elegant'].includes(watermark.style) ? 'italic' : 'normal';
          const fontFamily = watermark.style === 'handwritten' ? 'Pacifico, cursive' : watermark.fontFamily;
          ctx.font = `${fontStyle} ${fontWeight} ${scaledFontSize}px ${fontFamily}`;
          
          // Apply letter spacing by drawing each character (canvas doesn't support letterSpacing natively)
          // For now we skip setting a non-standard property; manual letter spacing would draw each glyph separately.
          
          // Compute dimensions and metrics used for plates/glow regardless of universal bgStyle
          const pad = watermark.bgPadding ?? 12;
          const metrics = ctx.measureText(text);
          const w = metrics.width + pad * 2;
          const h = scaledFontSize + pad * 2;
          const radius = watermark.bgRadius ?? 12;
          const bgOpacity = Math.max(0, Math.min(1, (watermark.bgOpacity ?? 50) / 100));

          // helper to draw a blurred glow behind the plate using canvas filter
          const drawGlow = (plateW = w, plateH = h, plateRadius = radius) => {
            if (!watermark.bgGlow) return;
            const glowColor = watermark.bgGlowColor || '#00d4ff';
            const baseAlpha = 0.85; // stronger default
            const glowBlurPx = Math.max(8, (watermark.bgGlowBlur ?? 36) * scale);
            const padGlow = Math.max(8, glowBlurPx / scale);
            const _ctx = ctx as unknown as CanvasRenderingContext2D;
            // Draw several layered blurred fills to create a stronger visible halo
            if ('filter' in ctx) {
              _ctx.save();
              // layered passes: outer (big blur, low alpha) -> mid -> inner (smaller blur, higher alpha)
              const passes = [glowBlurPx * 1.2, glowBlurPx * 0.7, glowBlurPx * 0.35];
              const alphas = [baseAlpha * 0.35, baseAlpha * 0.55, baseAlpha * 0.9];
              for (let i = 0; i < passes.length; i++) {
                _ctx.filter = `blur(${passes[i]}px)`;
                _ctx.fillStyle = hexToRgbaCanvas(glowColor, alphas[i]);
                roundRect(_ctx, -plateW / 2 - padGlow - (i * 6), -plateH / 2 - padGlow - (i * 6), plateW + (padGlow + i * 6) * 2, plateH + (padGlow + i * 6) * 2, plateRadius + padGlow + (i * 4));
                _ctx.fill();
              }
              _ctx.restore();
            } else {
              // Shadow-based fallback: draw a single pass with larger blur and alpha
              _ctx.save();
              _ctx.fillStyle = hexToRgbaCanvas(glowColor, baseAlpha * 0.9);
              _ctx.shadowColor = hexToRgbaCanvas(glowColor, baseAlpha * 0.95);
              _ctx.shadowBlur = glowBlurPx * 1.6;
              roundRect(_ctx, -plateW / 2 - padGlow / 2, -plateH / 2 - padGlow / 2, plateW + padGlow, plateH + padGlow, plateRadius + padGlow / 2);
              _ctx.fill();
              _ctx.restore();
            }
          };

          // helper to draw a frosted/blurred background sampled from the image under the plate
          const drawFrostedGlass = (plateW = w, plateH = h, plateRadius = radius) => {
            try {
              if (!image) return;
              // clamp source coordinates based on image bounds
              const srcXraw = Math.round(x - plateW / 2);
              const srcYraw = Math.round(y - plateH / 2);
              const srcWraw = Math.round(plateW);
              const srcHraw = Math.round(plateH);
              const sx = Math.max(0, Math.min(image.naturalWidth, srcXraw));
              const sy = Math.max(0, Math.min(image.naturalHeight, srcYraw));
              const sWidth = Math.max(0, Math.min(srcWraw, image.naturalWidth - sx));
              const sHeight = Math.max(0, Math.min(srcHraw, image.naturalHeight - sy));
              if (sWidth <= 0 || sHeight <= 0) return;

              const off = document.createElement('canvas');
              off.width = sWidth;
              off.height = sHeight;
              const octx = off.getContext('2d');
              if (!octx) return;
              octx.imageSmoothingEnabled = true;
              octx.imageSmoothingQuality = 'high';

              const glassBlurPx = Math.max(6, (watermark.bgGlowBlur ?? 12) * scale);
              // Apply blur on offscreen canvas if supported. If not, fall back to drawing the source and we'll rely on overlay opacity
              try {
                if ('filter' in octx) {
                  (octx as CanvasRenderingContext2D).filter = `blur(${glassBlurPx}px)`;
                }
              } catch (err) {
                /* noop: fallback will proceed */
              }
              // draw portion of the image into the offscreen canvas
              octx.drawImage(image, sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight);

              // draw the blurred area back to the main canvas with translation
              ctx.save();
              ctx.globalCompositeOperation = 'source-over';
              // draw the sampled image centered on the plate
              ctx.drawImage(off, -plateW / 2 + (sx - srcXraw), -plateH / 2 + (sy - srcYraw), plateW, plateH);
              ctx.restore();
            } catch (err) {
              // As a last resort, draw a semi-transparent fallback so something is visible
              try {
                ctx.save();
                ctx.globalAlpha = 0.12;
                ctx.fillStyle = '#ffffff';
                roundRect(ctx, -plateW / 2, -plateH / 2, plateW, plateH, plateRadius);
                ctx.fill();
                ctx.restore();
              } catch (inner) {
                // swallow to avoid export failure
              }
            }
          };

          // Universal plate drawing (if set)
          if (watermark.bgStyle && watermark.bgStyle !== 'none') {
            if (watermark.bgStyle === 'solid') {
              drawGlow();
              ctx.fillStyle = hexToRgbaCanvas(watermark.bgColor || '#000000', bgOpacity);
              roundRect(ctx, -w / 2, -h / 2, w, h, radius);
              ctx.fill();
            } else if (watermark.bgStyle === 'gradient') {
              const c1 = watermark.bgColor || '#000000';
              const c2 = watermark.bgColor2 || '#ffffff';
              const g = ctx.createLinearGradient(-w / 2, 0, w / 2, 0);
              g.addColorStop(0, hexToRgbaCanvas(c1, bgOpacity));
              g.addColorStop(1, hexToRgbaCanvas(c2, bgOpacity));
              drawGlow();
              ctx.fillStyle = g as CanvasGradient | string;
              roundRect(ctx, -w / 2, -h / 2, w, h, radius);
              ctx.fill();
            } else if (watermark.bgStyle === 'glass') {
              const g = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
              g.addColorStop(0, `rgba(255,255,255,${Math.max(0.02, bgOpacity * 0.18)})`);
              g.addColorStop(1, `rgba(255,255,255,${Math.max(0.01, bgOpacity * 0.06)})`);
              // draw halo glow behind the plate first, then frosted background
              drawGlow(w, h, radius);
              drawFrostedGlass(w, h, radius);
              ctx.fillStyle = g as CanvasGradient | string;
              roundRect(ctx, -w / 2, -h / 2, w, h, radius);
              ctx.fill();
              ctx.strokeStyle = `rgba(255,255,255,${Math.max(0.03, bgOpacity * 0.12)})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }

          // Style-specific rendering
          // If textGlow is enabled and the chosen style doesn't provide its own glow,
          // draw a blurred halo first (so the style's text draws on top).
          if (watermark.textGlow) {
            const glowColor = watermark.textGlowColor || watermark.color;
            const glowBlurPx = (watermark.textGlowBlur ?? 28) * scale;
            const _ctx = ctx as unknown as CanvasRenderingContext2D;
            if ('filter' in ctx) {
              _ctx.save();
              _ctx.filter = `blur(${glowBlurPx}px)`;
              _ctx.fillStyle = hexToRgbaCanvas(glowColor, 0.7);
              _ctx.fillText(text, 0, 0);
              _ctx.restore();
            } else {
              _ctx.save();
              _ctx.shadowColor = hexToRgbaCanvas(glowColor, 0.85);
              _ctx.shadowBlur = glowBlurPx * 0.9;
              _ctx.fillStyle = hexToRgbaCanvas(glowColor, 0.6);
              _ctx.fillText(text, 0, 0);
              _ctx.restore();
            }
          }

          // Set text alpha separately so background opacity doesn't affect the text
          ctx.globalAlpha = watermark.opacity / 100;
          switch (watermark.style) {
            case 'neon':
              // Neon glow effect - multiple layers
              ctx.shadowColor = watermark.color;
              ctx.shadowBlur = 20 * scale;
              ctx.fillStyle = watermark.color;
              ctx.fillText(text, 0, 0);
              ctx.shadowBlur = 40 * scale;
              ctx.fillText(text, 0, 0);
              ctx.shadowBlur = 60 * scale;
              ctx.fillText(text, 0, 0);
              ctx.shadowBlur = 0;
              ctx.fillStyle = '#ffffff';
              ctx.fillText(text, 0, 0);
              break;
              
            case 'shadow3d': {
              // If user selected a custom bg plate, don't draw the built-in plate to avoid doubling
              if (watermark.bgStyle === 'none') {
                // Draw a subtle glass plate behind the 3D text to make it pop
                const pad = 18;
                const metrics = ctx.measureText(text);
                const w = metrics.width + pad * 2;
                const h = scaledFontSize + pad;
                // glass gradient
                const g = ctx.createLinearGradient(-w/2, -h/2, w/2, h/2);
                g.addColorStop(0, 'rgba(255,255,255,0.06)');
                g.addColorStop(1, 'rgba(255,255,255,0.02)');
                // draw frosted background & glow
                // draw glow behind, then frosted sample for per-style plate
                drawGlow(w, h, 12);
                drawFrostedGlass(w, h, 12);
                ctx.save();
                ctx.fillStyle = g;
                roundRect(ctx, -w/2, -h/2, w, h, 12);
                ctx.fill();
                ctx.strokeStyle = 'rgba(255,255,255,0.08)';
                ctx.lineWidth = 1;
                ctx.stroke();
                // subtle inner highlight
                ctx.globalCompositeOperation = 'source-over';
                ctx.restore();
              }

              // 3D layered shadow behind text
              for (let d = 6; d > 0; d--) {
                ctx.globalAlpha = (watermark.opacity / 100) * (0.12 + (6 - d) * 0.08);
                ctx.fillStyle = '#000000';
                ctx.fillText(text, d * 2, d * 2);
              }
              // final text
              ctx.globalAlpha = watermark.opacity / 100;
              ctx.fillStyle = watermark.color;
              ctx.fillText(text, 0, 0);
              break;
            }
              
            case 'outline':
              // Outline/stroke only
              ctx.strokeStyle = watermark.color;
              ctx.lineWidth = 3 * scale;
              ctx.strokeText(text, 0, 0);
              break;
              
            case 'emboss':
              // Emboss effect - highlight and shadow
              ctx.fillStyle = 'rgba(255,255,255,0.4)';
              ctx.fillText(text, -1, -1);
              ctx.fillStyle = 'rgba(0,0,0,0.4)';
              ctx.fillText(text, 1, 1);
              ctx.fillStyle = watermark.color;
              ctx.fillText(text, 0, 0);
              break;
              
            case 'metallic': {
              // Metallic gradient effect
              const gradient = ctx.createLinearGradient(0, -scaledFontSize/2, 0, scaledFontSize/2);
              gradient.addColorStop(0, '#BF953F');
              gradient.addColorStop(0.25, '#FCF6BA');
              gradient.addColorStop(0.5, '#B38728');
              gradient.addColorStop(0.75, '#FBF5B7');
              gradient.addColorStop(1, '#AA771C');
              ctx.fillStyle = gradient;
              ctx.shadowColor = 'rgba(0,0,0,0.3)';
              ctx.shadowBlur = 4 * scale;
              ctx.shadowOffsetY = 2 * scale;
              ctx.fillText(text, 0, 0);
              break;
            }
              
            case 'gradient': {
              // Gradient text
              const textGradient = ctx.createLinearGradient(-100, 0, 100, 0);
              textGradient.addColorStop(0, watermark.color);
              textGradient.addColorStop(0.5, '#A24BFF');
              textGradient.addColorStop(1, '#1A7CFF');
              ctx.fillStyle = textGradient;
              ctx.fillText(text, 0, 0);
              break;
            }
              
            case 'glass': {
              // If user didn't pick a universal bg plate, draw the per-style glass plate
              if (watermark.bgStyle === 'none') {
                ctx.fillStyle = 'rgba(255,255,255,0.15)';
                const padding = 15;
                const textMetrics = ctx.measureText(text);
                const boxWidth = textMetrics.width + padding * 2;
                const boxHeight = scaledFontSize + padding * 2;
                // draw a frosted glass backdrop and glow for the per-style plate
                drawGlow(boxWidth, boxHeight, 12);
                drawFrostedGlass(boxWidth, boxHeight, 12);
                ctx.fillRect(-boxWidth/2, -boxHeight/2, boxWidth, boxHeight);
                ctx.strokeStyle = 'rgba(255,255,255,0.3)';
                ctx.lineWidth = 1;
                ctx.strokeRect(-boxWidth/2, -boxHeight/2, boxWidth, boxHeight);
              }
              ctx.fillStyle = watermark.color;
              ctx.fillText(text, 0, 0);
              break;
            }
            case 'glassLight': {
              if (watermark.bgStyle === 'none') {
                const padding = 15;
                const textMetrics = ctx.measureText(text);
                const boxWidth = textMetrics.width + padding * 2;
                const boxHeight = scaledFontSize + padding * 2;
                drawGlow(boxWidth, boxHeight, 16);
                drawFrostedGlass(boxWidth, boxHeight, 16);
                const g = ctx.createLinearGradient(0, -boxHeight/2, 0, boxHeight/2);
                g.addColorStop(0, 'rgba(255,255,255,0.9)');
                g.addColorStop(1, 'rgba(255,255,255,0.7)');
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ctx.fillStyle = g as any;
                roundRect(ctx, -boxWidth/2, -boxHeight/2, boxWidth, boxHeight, 16);
                ctx.fill();
                ctx.strokeStyle = 'rgba(255,255,255,0.5)';
                ctx.lineWidth = 1;
                ctx.stroke();
              }
              ctx.fillStyle = watermark.color;
              ctx.fillText(text, 0, 0);
              break;
            }
            case 'glassDark': {
              if (watermark.bgStyle === 'none') {
                const padding = 15;
                const textMetrics = ctx.measureText(text);
                const boxWidth = textMetrics.width + padding * 2;
                const boxHeight = scaledFontSize + padding * 2;
                drawGlow(boxWidth, boxHeight, 16);
                drawFrostedGlass(boxWidth, boxHeight, 16);
                const g = ctx.createLinearGradient(0, -boxHeight/2, 0, boxHeight/2);
                g.addColorStop(0, 'rgba(0,0,0,0.6)');
                g.addColorStop(1, 'rgba(0,0,0,0.3)');
                ctx.fillStyle = g as any;
                roundRect(ctx, -boxWidth/2, -boxHeight/2, boxWidth, boxHeight, 16);
                ctx.fill();
                ctx.strokeStyle = 'rgba(255,255,255,0.1)';
                ctx.lineWidth = 1;
                ctx.stroke();
              }
              ctx.fillStyle = watermark.color;
              ctx.fillText(text, 0, 0);
              break;
            }
            case 'frostedBlur': {
              if (watermark.bgStyle === 'none') {
                const padding = 18;
                const textMetrics = ctx.measureText(text);
                const boxWidth = textMetrics.width + padding * 2;
                const boxHeight = scaledFontSize + padding * 2;
                // stronger blur for frostedBlur style
                const blurAmount = Math.max(16, (watermark.bgGlowBlur ?? 20));
                // draw glow behind, then the frosted sample
                drawGlow(boxWidth, boxHeight, 18);
                drawFrostedGlass(boxWidth, boxHeight, 18);
                const g = ctx.createLinearGradient(0, -boxHeight/2, 0, boxHeight/2);
                g.addColorStop(0, 'rgba(255,255,255,0.4)');
                g.addColorStop(1, 'rgba(200,200,255,0.2)');
                ctx.fillStyle = g as any;
                roundRect(ctx, -boxWidth/2, -boxHeight/2, boxWidth, boxHeight, 18);
                ctx.fill();
                ctx.strokeStyle = 'rgba(255,255,255,0.3)';
                ctx.lineWidth = 2;
                ctx.stroke();
              }
              ctx.fillStyle = watermark.color;
              ctx.fillText(text, 0, 0);
              break;
            }
              
            case 'cinema':
              // Cinematic style with letterboxing effect
              ctx.shadowColor = 'rgba(0,0,0,0.8)';
              ctx.shadowBlur = 20 * scale;
              ctx.fillStyle = watermark.color;
              ctx.fillText(text.toUpperCase(), 0, 0);
              ctx.shadowBlur = 40 * scale;
              ctx.fillText(text.toUpperCase(), 0, 0);
              break;
              
            case 'vintage':
              // Vintage/retro style
              ctx.shadowColor = 'rgba(139,69,19,0.5)';
              ctx.shadowBlur = 0;
              ctx.shadowOffsetX = 2 * scale;
              ctx.shadowOffsetY = 2 * scale;
              ctx.fillStyle = watermark.color;
              ctx.fillText(text.toUpperCase(), 0, 0);
              break;
              
            case 'futuristic':
              // Futuristic glow
              ctx.shadowColor = watermark.color;
              ctx.shadowBlur = 10 * scale;
              ctx.fillStyle = watermark.color;
              ctx.fillText(text.toUpperCase(), 0, 0);
              ctx.shadowBlur = 20 * scale;
              ctx.fillText(text.toUpperCase(), 0, 0);
              break;
              
            case 'modern':
              ctx.shadowColor = 'rgba(0,0,0,0.3)';
              ctx.shadowBlur = 10 * scale;
              ctx.shadowOffsetY = 2 * scale;
              ctx.fillStyle = watermark.color;
              ctx.fillText(text, 0, 0);
              break;
            
            case 'classic':
              ctx.shadowColor = 'rgba(0,0,0,0.5)';
              ctx.shadowBlur = 2 * scale;
              ctx.shadowOffsetX = 1 * scale;
              ctx.shadowOffsetY = 1 * scale;
              ctx.fillStyle = watermark.color;
              ctx.fillText(text, 0, 0);
              break;
              
            case 'elegant':
              ctx.shadowColor = 'rgba(0,0,0,0.2)';
              ctx.shadowBlur = 4 * scale;
              ctx.shadowOffsetY = 2 * scale;
              ctx.fillStyle = watermark.color;
              ctx.fillText(text, 0, 0);
              break;
              
            case 'bold':
              ctx.shadowColor = 'rgba(0,0,0,0.3)';
              ctx.shadowBlur = 0;
              ctx.shadowOffsetX = 3 * scale;
              ctx.shadowOffsetY = 3 * scale;
              ctx.fillStyle = watermark.color;
              ctx.fillText(text.toUpperCase(), 0, 0);
              break;
              
            case 'handwritten':
              ctx.shadowColor = 'rgba(0,0,0,0.3)';
              ctx.shadowBlur = 2 * scale;
              ctx.shadowOffsetX = 1 * scale;
              ctx.shadowOffsetY = 1 * scale;
              ctx.fillStyle = watermark.color;
              ctx.fillText(text, 0, 0);
              break;
              
            case 'minimal':
            default:
              ctx.fillStyle = watermark.color;
              if (watermark.shadow) {
                ctx.shadowColor = 'rgba(0,0,0,0.5)';
                ctx.shadowBlur = 10 * scale;
                ctx.shadowOffsetX = 2 * scale;
                ctx.shadowOffsetY = 2 * scale;
              }
              ctx.fillText(text, 0, 0);
              break;
          }
          ctx.restore();
        };
        
        // Draw text watermark
        if (watermark.text) {
          const baseFontSize = watermark.fontSize * (image.naturalWidth / 800);
          
          if (watermark.tileMode) {
            // Tile pattern
            const spacing = watermark.tileSpacing * (image.naturalWidth / 800);
            for (let ty = -spacing; ty < image.naturalHeight + spacing; ty += spacing) {
              for (let tx = -spacing; tx < image.naturalWidth + spacing; tx += spacing) {
                applyWatermarkStyle(watermark.text, tx, ty, baseFontSize);
              }
            }
          } else {
            // Single watermark
            const x = (watermark.position.x / 100) * image.naturalWidth;
            const y = (watermark.position.y / 100) * image.naturalHeight;
            applyWatermarkStyle(watermark.text, x, y, baseFontSize);
          }
        }
        
        // Draw logos with proper rendering
        for (const logo of logos) {
          const logoImg = new Image();
          logoImg.crossOrigin = 'anonymous';
          
          await new Promise<void>((resolve) => {
            logoImg.onload = () => resolve();
            logoImg.onerror = () => {
              console.warn('Failed to load logo, trying without crossOrigin');
              // Try again without crossOrigin for data URLs
              const retryImg = new Image();
              retryImg.onload = () => {
                Object.assign(logoImg, { naturalWidth: retryImg.naturalWidth, naturalHeight: retryImg.naturalHeight });
                resolve();
              };
              retryImg.onerror = () => resolve();
              retryImg.src = logo.dataUrl;
            };
            logoImg.src = logo.dataUrl;
          });
          
          if (logoImg.naturalWidth && logoImg.naturalHeight) {
            const logoSize = logo.size * (image.naturalWidth / 800);
            const aspectRatio = logoImg.naturalHeight / logoImg.naturalWidth;
            const logoWidth = logoSize;
            const logoHeight = logoSize * aspectRatio;
            const logoX = (logo.position.x / 100) * image.naturalWidth;
            const logoY = (logo.position.y / 100) * image.naturalHeight;
            
            ctx.save();
            ctx.globalAlpha = logo.opacity / 100;
            ctx.translate(logoX, logoY);
            ctx.rotate((logo.rotation * Math.PI) / 180);
            ctx.drawImage(logoImg, -logoWidth / 2, -logoHeight / 2, logoWidth, logoHeight);
            ctx.restore();
          }
        }
        
        // Export with high quality
        const mimeType = exportFormat === 'PNG' ? 'image/png' : exportFormat === 'JPG' ? 'image/jpeg' : 'image/webp';
        const quality = exportFormat === 'PNG' ? 1 : exportQuality / 100;
        
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((b) => {
            if (b) resolve(b);
            else reject(new Error('Failed to create blob'));
          }, mimeType, quality);
        });

        const originalName = img.file?.name?.replace(/\.[^/.]+$/, '') || `image_${i + 1}`;
        const scaleLabel = scale > 1 ? `_${scale}x` : '';
        const filename = `${originalName}_watermarked${scaleLabel}.${exportFormat.toLowerCase()}`;

        // If preview requested (single image only), show in-app preview instead of downloading
        if (preview && single) {
          if (exportPreviewUrl) URL.revokeObjectURL(exportPreviewUrl);
          const url = URL.createObjectURL(blob);
          setExportPreviewUrl(url);
          setExportPreviewFilename(filename);
          setExportProgress(100);
          setIsExporting(false);
          return;
        }

        // For batch exports, collect the blobs to create a ZIP later
        if (!single) {
          batchResults.push({ blob, filename });
          setExportProgress(Math.round(((i + 1) / totalImages) * 100));
          continue;
        }

        // Single-file download
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setExportProgress(Math.round(((i + 1) / totalImages) * 100));
      }

      // If batch results were collected, create a ZIP archive and download
      if (!single && batchResults.length > 0) {
        try {
          const zip = new JSZip();
          for (const item of batchResults) {
            zip.file(item.filename, item.blob);
          }
          const zipBlob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
          // Revoke previous batch URL if present
          if (batchZipUrl) {
            URL.revokeObjectURL(batchZipUrl);
          }
          const zipUrl = URL.createObjectURL(zipBlob);
          const zipName = `watermarked_batch_${Date.now()}.zip`;
          setBatchZipUrl(zipUrl);
          setBatchZipName(zipName);
          setExportProgress(100);
        } catch (zipErr) {
          console.error('ZIP export failed', zipErr);
          setExportError(zipErr instanceof Error ? zipErr.message : 'ZIP export failed');
          setExportErrorDetails(zipErr instanceof Error ? (zipErr.stack || zipErr.message) : String(zipErr));
        }
      }
      
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (error) {
      console.error('Export error:', error);
      setExportError(error instanceof Error ? error.message : 'Export failed');
      setExportErrorDetails(error instanceof Error ? (error.stack || error.message) : String(error));
      setTimeout(() => setExportError(null), 5000);
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  }, [currentImage, images, watermark, logos, adjustments, exportFormat, exportQuality, exportScale, exportPreviewUrl, batchZipUrl]);

  if (images.length === 0) {
    return (
      <LazyMotion features={domAnimation}>
        <div className="min-h-screen bg-[#080b12] flex items-center justify-center">
          <m.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-12"
          >
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-6 border border-white/10">
              <ImageIcon className="w-12 h-12 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">No Images</h2>
            <p className="text-slate-400 mb-6">Upload some images to start editing</p>
            <m.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-shadow"
            >
              Go to Upload
            </m.button>
          </m.div>
        </div>
      </LazyMotion>
    );
  }

  return (
    <LazyMotion features={domAnimation}>
      <div className="h-screen bg-[#080b12] text-white flex flex-col overflow-hidden">
        {/* Header */}
        <header className="shrink-0 h-16 bg-[#0d1219]/95 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <m.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </m.button>
            <div>
              <h1 className="font-semibold text-white">Watermark Studio</h1>
              <p className="text-xs text-slate-400">{images.length} images • Image {currentIndex + 1}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <m.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowWatermark(!showWatermark)}
              className={`p-2 rounded-xl transition-colors ${showWatermark ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-slate-400'}`}
            >
              {showWatermark ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </m.button>
            <div className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white/5">
              <ZoomOut className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-mono w-12 text-center">{zoom}%</span>
              <ZoomIn className="w-4 h-4 text-slate-400" />
            </div>
            <m.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('export')}
              disabled={isExporting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold shadow-lg shadow-violet-500/25 disabled:opacity-50"
            >
              {isExporting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Download className="w-5 h-5" />
              )}
              Export
            </m.button>
          </div>
        </header>

        <div className="flex-1 flex flex-col sm:flex-row overflow-auto sm:overflow-hidden">
          {/* Main Canvas Area */}
          <div className="flex-1 flex flex-col bg-[#0a0e15]">
            {/* Image Navigation */}
            {images.length > 1 && (
              <div className="shrink-0 h-20 bg-[#0d1219]/80 border-b border-white/5 flex items-center gap-2 px-4 overflow-x-auto">
                {images.map((img, i) => (
                  <m.button
                    key={img.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentIndex(i)}
                    className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                      i === currentIndex ? 'border-violet-500 shadow-lg shadow-violet-500/30' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </m.button>
                ))}
              </div>
            )}

            {/* Canvas */}
            <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
              <div className="relative max-w-full max-h-full" style={{ transform: `scale(${zoom / 100})` }}>
                {currentImage && (
                  <div 
                    ref={imageContainerRef}
                    className="relative rounded-xl overflow-hidden shadow-2xl"
                  >
                    <img
                      src={currentImage.url}
                      alt={currentImage.file?.name || 'Image'}
                      className="max-w-full max-h-[calc(100vh-250px)] object-contain"
                      style={{
                        filter: `
                          brightness(${100 + adjustments.brightness}%)
                          contrast(${100 + adjustments.contrast}%)
                          saturate(${100 + adjustments.saturation}%)
                        `,
                      }}
                    />
                    
                    {/* Text Watermark Overlay */}
                    {showWatermark && watermark.text && !watermark.tileMode && (
                      <div
                        className="absolute pointer-events-none"
                        style={{
                          left: `${watermark.position.x}%`,
                          top: `${watermark.position.y}%`,
                          transform: `translate(-50%, -50%) rotate(${watermark.rotation}deg)`,
                        }}
                      >
                        {/* Container applies background / glow / padding so preview matches export */}
                        {(() => {
                          const merged = getMergedWatermarkStyle();
                          const textOnly = getWatermarkStyle();
                          // Ensure container behaves like inline-block for proper padding/rounded corners
                          const containerStyle: React.CSSProperties = { display: 'inline-block', boxSizing: 'border-box', ...merged };
                          // Remove text-specific background from inner span to avoid double-drawing
                          const innerTextStyle: React.CSSProperties = { ...textOnly, background: 'transparent' };
                          return (
                            <div style={containerStyle} className="relative inline-block">
                              <span style={innerTextStyle} className="whitespace-nowrap">
                                {watermark.text}
                              </span>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {/* Tiled Watermark Pattern */}
                    {showWatermark && watermark.text && watermark.tileMode && (
                      <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {tilePositions.map((pos, i) => (
                          <div
                            key={i}
                            className="absolute"
                            style={{
                              left: `${pos.x}%`,
                              top: `${pos.y}%`,
                              transform: `translate(-50%, -50%) rotate(${watermark.rotation}deg)`,
                            }}
                          >
                            <span
                              style={getMergedWatermarkStyle()}
                              className="whitespace-nowrap"
                            >
                              {watermark.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Draggable Logo Overlays */}
                    {showWatermark && logos.map((logo) => (
                      <div
                        key={logo.id}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleLogoDrag(e, logo.id);
                        }}
                        className={`absolute transition-shadow ${
                          logo.locked ? 'cursor-not-allowed' : 'cursor-move'
                        } ${
                          selectedLogo === logo.id 
                            ? 'ring-2 ring-[#00D4FF] shadow-lg shadow-[#00D4FF]/30' 
                            : 'hover:ring-2 hover:ring-white/30'
                        } ${isDraggingLogo && selectedLogo === logo.id ? 'scale-105' : ''}`}
                        style={{
                          left: `${logo.position.x}%`,
                          top: `${logo.position.y}%`,
                          transform: `translate(-50%, -50%) rotate(${logo.rotation}deg)`,
                          opacity: logo.opacity / 100,
                          width: `${logo.size}px`,
                        }}
                      >
                        <img 
                          src={logo.dataUrl} 
                          alt="Logo" 
                          className="w-full h-auto pointer-events-none" 
                          draggable={false}
                        />
                        {selectedLogo === logo.id && (
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/80 text-xs text-white whitespace-nowrap">
                            <Move className="w-3 h-3" />
                            {logo.locked ? 'Locked' : 'Drag to move'}
                          </div>
                        )}
                        {logo.locked && (
                          <div className="absolute top-1 right-1 p-1 rounded bg-black/50">
                            <Lock className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                  className="absolute right-4 sm:right-[340px] top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Right Panel */}
          <div className="w-full sm:w-80 shrink-0 bg-[#0d1219]/95 backdrop-blur-xl border-l border-white/5 flex flex-col">
            {/* Tab Navigation */}
            <div className="flex border-b border-white/5">
              {[
                { id: 'watermark', label: 'Watermark', icon: Type },
                { id: 'enhance', label: 'Enhance', icon: Sliders },
                { id: 'export', label: 'Export', icon: Download },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-violet-400 border-b-2 border-violet-500 bg-violet-500/5'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              <AnimatePresence mode="wait">
                {activeTab === 'watermark' && (
                  <m.div
                    key="watermark"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Text Watermark */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                        <Type className="w-4 h-4 text-cyan-400" />
                        Text Watermark
                      </h3>
                      <input
                        ref={watermarkTextRef}
                        type="text"
                        value={watermark.text}
                        onChange={(e) => setWatermark({ ...watermark, text: e.target.value })}
                        placeholder="Enter watermark text..."
                        className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-white/10 text-white placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 transition-all"
                      />
                    </div>

                    {/* Style Presets */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <Sparkles className="w-3 h-3" />
                        Watermark Style
                      </h4>
                      <div className="grid grid-cols-4 gap-2 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
                        {watermarkStyles.map((style) => (
                          <button
                            key={style.id}
                            onClick={() => setWatermark({ ...watermark, style: style.id as WatermarkConfig['style'] })}
                            className={`group relative p-2.5 rounded-xl text-center transition-all overflow-hidden ${
                              watermark.style === style.id
                                ? 'ring-2 ring-cyan-400 shadow-lg shadow-cyan-500/20'
                                : 'hover:ring-1 hover:ring-white/30'
                            }`}
                          >
                            {/* Gradient background or glass preview for shadow3d */}
                            {style.id === 'shadow3d' ? (
                              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))', opacity: 0.75 }} />
                            ) : (
                              <div className={`absolute inset-0 bg-gradient-to-br ${style.color} opacity-20 group-hover:opacity-30 transition-opacity`} />
                            )}
                            <div className="absolute inset-0 bg-slate-900/60" />
                            
                            {/* Content */}
                            <div className="relative z-10">
                              <div className={`text-xl mb-1 ${watermark.style === style.id ? 'scale-110' : ''} transition-transform`}>
                                {style.icon}
                              </div>
                              <div className={`text-[9px] font-semibold uppercase tracking-wider ${
                                watermark.style === style.id ? 'text-cyan-300' : 'text-slate-400 group-hover:text-white'
                              }`}>
                                {style.label}
                              </div>
                              <div className="text-[8px] text-slate-500 mt-0.5">{style.desc}</div>
                            </div>
                            
                            {/* Selection indicator */}
                            {watermark.style === style.id && (
                              <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Font */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wider">Font</h4>
                      <select
                        value={watermark.fontFamily}
                        onChange={(e) => setWatermark({ ...watermark, fontFamily: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-white/10 text-white focus:border-cyan-500/50 focus:outline-none cursor-pointer"
                      >
                        {fonts.map((font) => (
                          <option key={font.id} value={font.id}>{font.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Size & Opacity */}
                    <div className="space-y-4">
                      <Slider
                        label="Size"
                        value={watermark.fontSize}
                        onChange={(v) => setWatermark({ ...watermark, fontSize: v })}
                        min={12}
                        max={120}
                        icon={Maximize2}
                      />
                      <Slider
                        label="Opacity"
                        value={watermark.opacity}
                        onChange={(v) => setWatermark({ ...watermark, opacity: v })}
                        min={0}
                        max={100}
                        icon={Eye}
                      />
                      <Slider
                        label="Rotation"
                        value={watermark.rotation}
                        onChange={(v) => setWatermark({ ...watermark, rotation: v })}
                        min={-180}
                        max={180}
                        icon={RotateCcw}
                      />
                      <Slider
                        label="Letter Spacing"
                        value={watermark.letterSpacing}
                        onChange={(v) => setWatermark({ ...watermark, letterSpacing: v })}
                        min={-10}
                        max={50}
                        icon={Type}
                      />
                    </div>

                    {/* Tile Mode */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2">
                          <Repeat className="w-3.5 h-3.5 text-cyan-400" />
                          Tile Pattern
                        </h4>
                        <button
                          onClick={() => setWatermark({ ...watermark, tileMode: !watermark.tileMode })}
                          className={`relative w-11 h-6 rounded-full transition-colors ${
                            watermark.tileMode ? 'bg-gradient-to-r from-cyan-500 to-purple-500' : 'bg-slate-800'
                          }`}
                        >
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                            watermark.tileMode ? 'left-6' : 'left-1'
                          }`} />
                        </button>
                      </div>
                      {watermark.tileMode && (
                        <Slider
                          label="Spacing"
                          value={watermark.tileSpacing}
                          onChange={(v) => setWatermark({ ...watermark, tileSpacing: v })}
                          min={50}
                          max={300}
                          icon={LayoutGrid}
                        />
                      )}
                    </div>

                    {/* Color */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wider">Color</h4>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={watermark.color}
                          onChange={(e) => setWatermark({ ...watermark, color: e.target.value })}
                          className="w-12 h-12 rounded-xl border border-white/10 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={watermark.color}
                          onChange={(e) => setWatermark({ ...watermark, color: e.target.value })}
                          className="flex-1 px-4 py-3 rounded-xl bg-slate-900/50 border border-white/10 text-white font-mono uppercase focus:border-cyan-500/50 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Background Options (applies to any text) */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wider">Background</h4>
                        <div className="flex items-center gap-2">
                          {(['none', 'solid', 'gradient', 'glass'] as const).map((b) => (
                            <button
                              key={b}
                              onClick={() => setWatermark({ ...watermark, bgStyle: b })}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${watermark.bgStyle === b ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/8'}`}
                            >
                              {b === 'none' ? 'None' : b === 'solid' ? 'Solid' : b === 'gradient' ? 'Gradient' : 'Glass'}
                            </button>
                          ))}

                          {/* Glow toggle */}
                          <button
                            onClick={() => setWatermark({ ...watermark, bgGlow: !watermark.bgGlow })}
                            className={`ml-auto px-2 py-2 rounded-lg text-sm font-medium transition-colors border ${watermark.bgGlow ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/8'}`}
                            title="Toggle background glow"
                          >
                            Glow
                          </button>
                        </div>

                      {(watermark.bgStyle === 'solid' || watermark.bgStyle === 'gradient') && (
                        <div className="flex gap-2 items-center">
                          <input
                            type="color"
                            value={watermark.bgColor}
                            onChange={(e) => setWatermark({ ...watermark, bgColor: e.target.value })}
                            className="w-12 h-12 rounded-xl border border-white/10 cursor-pointer"
                          />
                          {watermark.bgStyle === 'gradient' && (
                            <input
                              type="color"
                              value={watermark.bgColor2}
                              onChange={(e) => setWatermark({ ...watermark, bgColor2: e.target.value })}
                              className="w-12 h-12 rounded-xl border border-white/10 cursor-pointer"
                            />
                          )}
                          <div className="flex-1">
                            <Slider
                              label="Background Opacity"
                              value={watermark.bgOpacity ?? 50}
                              onChange={(v) => setWatermark({ ...watermark, bgOpacity: v })}
                              min={0}
                              max={100}
                              icon={Droplets}
                            />
                          </div>
                        </div>
                      )}

                      {watermark.bgStyle !== 'none' && (
                        <div className="space-y-2">
                          <Slider
                            label="Border Radius"
                            value={watermark.bgRadius ?? 12}
                            onChange={(v) => setWatermark({ ...watermark, bgRadius: v })}
                            min={0}
                            max={64}
                            icon={Maximize2}
                          />
                          <Slider
                            label="Padding"
                            value={watermark.bgPadding ?? 12}
                            onChange={(v) => setWatermark({ ...watermark, bgPadding: v })}
                            min={0}
                            max={64}
                            icon={LayoutGrid}
                          />
                          <div className="pt-2">
                            <Slider
                              label="Glow Blur"
                              value={watermark.bgGlowBlur ?? 24}
                              onChange={(v) => setWatermark({ ...watermark, bgGlowBlur: v })}
                              min={0}
                              max={160}
                              icon={Sparkles}
                            />
                            <div className="flex items-center gap-2 mt-2">
                              <input
                                type="color"
                                value={watermark.bgGlowColor}
                                onChange={(e) => setWatermark({ ...watermark, bgGlowColor: e.target.value })}
                                className="w-10 h-10 rounded-lg border border-white/10"
                              />
                              <span className="text-xs text-slate-400">Glow Color</span>
                            </div>
                          </div>
                              <div className="pt-3 border-t border-white/5 mt-3">
                                <h5 className="text-xs font-medium text-slate-400 mb-2">Text Glow</h5>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => setWatermark({ ...watermark, textGlow: !watermark.textGlow })}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${watermark.textGlow ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/8'}`}
                                  >
                                    Toggle Glow
                                  </button>
                                  <div className="flex items-center gap-2 ml-auto">
                                    <input
                                      type="color"
                                      value={watermark.textGlowColor}
                                      onChange={(e) => setWatermark({ ...watermark, textGlowColor: e.target.value })}
                                      className="w-10 h-10 rounded-lg border border-white/10"
                                    />
                                    <Slider
                                      label="Glow Blur"
                                      value={watermark.textGlowBlur ?? 28}
                                      onChange={(v) => setWatermark({ ...watermark, textGlowBlur: v })}
                                      min={0}
                                      max={160}
                                      icon={Sparkles}
                                    />
                                  </div>
                                </div>
                              </div>
                        </div>
                      )}
                    </div>

                    {/* Position Grid */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wider">Position</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {positions.map((pos) => (
                          <button
                            key={pos.id}
                            onClick={() => setWatermark({ ...watermark, position: { x: pos.x, y: pos.y } })}
                            className={`aspect-square rounded-lg transition-all ${
                              watermark.position.x === pos.x && watermark.position.y === pos.y
                                ? 'bg-linear-to-br from-cyan-500 to-purple-500 shadow-lg shadow-cyan-500/30'
                                : 'bg-slate-800/50 hover:bg-slate-700/50'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Logos Section */}
                    <div className="space-y-3 pt-4 border-t border-white/10">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                          <Layers className="w-4 h-4 text-purple-400" />
                          Logos ({logos.length})
                        </h3>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-400 text-xs font-medium hover:bg-purple-500/30 transition-colors border border-purple-500/20"
                        >
                          <Plus className="w-3 h-3" />
                          Add
                        </button>
                      </div>

                      {logos.length > 0 && (
                        <div className="grid grid-cols-3 gap-2">
                          {logos.map((logo) => (
                            <div
                              key={logo.id}
                              onClick={() => setSelectedLogo(logo.id)}
                              className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                                selectedLogo === logo.id ? 'border-cyan-500 shadow-lg shadow-cyan-500/20' : 'border-transparent hover:border-white/20'
                              }`}
                            >
                              <img src={logo.dataUrl} alt="" className="w-full h-full object-contain bg-slate-900/50 p-1" />
                              <button
                                onClick={(e) => { e.stopPropagation(); deleteLogo(logo.id); }}
                                className="absolute top-1 right-1 p-1 rounded-full bg-red-500/80 hover:bg-red-500"
                              >
                                <X className="w-3 h-3 text-white" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Selected Logo Controls */}
                      {selectedLogo && logos.find((l) => l.id === selectedLogo) && (
                        <div className="space-y-4 p-4 rounded-xl bg-gradient-to-br from-[#1a1f35] to-[#0d1220] border border-white/5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-white/70">Logo Settings</span>
                            <div className="flex gap-1">
                              <button
                                onClick={() => updateLogo(selectedLogo, { locked: !logos.find(l => l.id === selectedLogo)?.locked })}
                                className={`p-1.5 rounded-lg transition-colors ${
                                  logos.find(l => l.id === selectedLogo)?.locked 
                                    ? 'bg-amber-500/20 text-amber-400' 
                                    : 'bg-white/5 text-white/50 hover:text-white'
                                }`}
                                title={logos.find(l => l.id === selectedLogo)?.locked ? 'Unlock' : 'Lock'}
                              >
                                {logos.find(l => l.id === selectedLogo)?.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                onClick={() => deleteLogo(selectedLogo)}
                                className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          
                          <Slider
                            label="Size"
                            value={logos.find((l) => l.id === selectedLogo)!.size}
                            onChange={(v) => updateLogo(selectedLogo, { size: v })}
                            min={20}
                            max={400}
                            icon={Maximize2}
                          />
                          <Slider
                            label="Opacity"
                            value={logos.find((l) => l.id === selectedLogo)!.opacity}
                            onChange={(v) => updateLogo(selectedLogo, { opacity: v })}
                            min={0}
                            max={100}
                            icon={Eye}
                          />
                          <Slider
                            label="Rotation"
                            value={logos.find((l) => l.id === selectedLogo)!.rotation}
                            onChange={(v) => updateLogo(selectedLogo, { rotation: v })}
                            min={-180}
                            max={180}
                            icon={RotateCw}
                          />
                          
                          {/* Quick Position Grid */}
                          <div className="space-y-2">
                            <span className="text-xs font-medium text-white/50">Quick Position</span>
                            <div className="grid grid-cols-3 gap-1.5">
                              {[
                                { x: 10, y: 10 }, { x: 50, y: 10 }, { x: 90, y: 10 },
                                { x: 10, y: 50 }, { x: 50, y: 50 }, { x: 90, y: 50 },
                                { x: 10, y: 90 }, { x: 50, y: 90 }, { x: 90, y: 90 },
                              ].map((pos, i) => (
                                <button
                                  key={i}
                                  onClick={() => updateLogo(selectedLogo, { position: pos })}
                                  className={`aspect-square rounded-md transition-all ${
                                    Math.abs(logos.find(l => l.id === selectedLogo)!.position.x - pos.x) < 5 &&
                                    Math.abs(logos.find(l => l.id === selectedLogo)!.position.y - pos.y) < 5
                                      ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                                      : 'bg-white/5 hover:bg-white/10'
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-[10px] text-white/40 text-center">Or drag the logo on the image</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </m.div>
                )}

                {activeTab === 'enhance' && (
                  <m.div
                    key="enhance"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-white">Image Adjustments</h3>
                      <button
                        onClick={resetAdjustments}
                        className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        Reset All
                      </button>
                    </div>

                    <div className="space-y-4">
                      <Slider
                        label="Brightness"
                        value={adjustments.brightness}
                        onChange={(v) => setAdjustments({ ...adjustments, brightness: v })}
                        icon={Sun}
                      />
                      <Slider
                        label="Contrast"
                        value={adjustments.contrast}
                        onChange={(v) => setAdjustments({ ...adjustments, contrast: v })}
                        icon={Contrast}
                      />
                      <Slider
                        label="Saturation"
                        value={adjustments.saturation}
                        onChange={(v) => setAdjustments({ ...adjustments, saturation: v })}
                        icon={Droplets}
                      />
                      <Slider
                        label="Temperature"
                        value={adjustments.temperature}
                        onChange={(v) => setAdjustments({ ...adjustments, temperature: v })}
                        icon={Thermometer}
                      />
                      <Slider
                        label="Highlights"
                        value={adjustments.highlights}
                        onChange={(v) => setAdjustments({ ...adjustments, highlights: v })}
                        icon={Sun}
                      />
                      <Slider
                        label="Shadows"
                        value={adjustments.shadows}
                        onChange={(v) => setAdjustments({ ...adjustments, shadows: v })}
                        icon={Moon}
                      />
                      <Slider
                        label="Sharpness"
                        value={adjustments.sharpness}
                        onChange={(v) => setAdjustments({ ...adjustments, sharpness: v })}
                        icon={Aperture}
                      />
                      <Slider
                        label="Vignette"
                        value={adjustments.vignette}
                        onChange={(v) => setAdjustments({ ...adjustments, vignette: v })}
                        min={0}
                        max={100}
                        icon={Film}
                      />
                      <Slider
                        label="Grain"
                        value={adjustments.grain}
                        onChange={(v) => setAdjustments({ ...adjustments, grain: v })}
                        min={0}
                        max={100}
                        icon={Sparkles}
                      />
                      <Slider
                        label="Clarity"
                        value={adjustments.clarity}
                        onChange={(v) => setAdjustments({ ...adjustments, clarity: v })}
                        min={-100}
                        max={100}
                        icon={Wand2}
                      />
                    </div>

                    {/* Quick Presets */}
                    <div className="space-y-3 pt-4 border-t border-white/10">
                      <h4 className="text-xs font-medium text-[#9FB2C8] uppercase tracking-wider">Quick Presets</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { name: 'Vivid', b: 10, c: 15, s: 25 },
                          { name: 'Warm', b: 5, c: 0, s: 10, t: 30 },
                          { name: 'Cool', b: 0, c: 10, s: -10, t: -20 },
                          { name: 'B&W', b: 0, c: 20, s: -100 },
                          { name: 'Vintage', b: -5, c: -10, s: -20 },
                          { name: 'HDR', b: 0, c: 30, s: 20 },
                        ].map((preset) => (
                          <button
                            key={preset.name}
                            onClick={() => setAdjustments({
                              ...defaultAdjustments,
                              brightness: preset.b || 0,
                              contrast: preset.c || 0,
                              saturation: preset.s || 0,
                              temperature: (preset as { t?: number }).t || 0,
                            })}
                            className="px-3 py-2 rounded-lg bg-[#0A1628] border border-white/10 text-white text-xs font-medium hover:border-[#1A7CFF] transition-colors"
                          >
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </m.div>
                )}

                {activeTab === 'export' && (
                  <m.div
                    key="export"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-white">Export Options</h3>
                      
                      <div className="space-y-3">
                        <h4 className="text-xs font-medium text-[#9FB2C8] uppercase tracking-wider">Format</h4>
                        <div className="grid grid-cols-3 gap-2">
                          {(['PNG', 'JPG', 'WebP'] as const).map((format) => (
                            <button
                              key={format}
                              onClick={() => setExportFormat(format)}
                              className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                exportFormat === format
                                  ? 'bg-[#1A7CFF]/20 border-2 border-[#1A7CFF] text-white'
                                  : 'bg-[#0A1628] border border-white/10 text-[#9FB2C8] hover:border-white/20'
                              }`}
                            >
                              {format}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-medium text-[#9FB2C8] uppercase tracking-wider">Quality</h4>
                          <span className="text-sm font-mono text-[#1A7CFF]">{exportQuality}%</span>
                        </div>
                        <input
                          type="range"
                          min={10}
                          max={100}
                          value={exportQuality}
                          onChange={(e) => setExportQuality(Number(e.target.value))}
                          className="w-full h-2 bg-[#0A1628] rounded-full appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-[#9FB2C8]">
                          <span>Smaller File</span>
                          <span>Best Quality</span>
                        </div>
                      </div>

                      {/* HD Resolution Scale */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-medium text-[#9FB2C8] uppercase tracking-wider flex items-center gap-2">
                            <Sparkles className="w-3 h-3 text-cyan-400" />
                            Resolution Scale
                          </h4>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-medium">
                            {exportScale === 1 ? 'Standard' : exportScale === 2 ? 'HD' : '4K'}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {([
                            { scale: 1, label: '1x', desc: 'Standard', icon: '📱' },
                            { scale: 2, label: '2x', desc: 'HD', icon: '💻' },
                            { scale: 4, label: '4x', desc: '4K Ultra', icon: '🖥️' },
                          ] as const).map((option) => (
                            <button
                              key={option.scale}
                              onClick={() => setExportScale(option.scale)}
                              className={`relative p-3 rounded-xl text-center transition-all overflow-hidden group ${
                                exportScale === option.scale
                                  ? 'ring-2 ring-cyan-400 shadow-lg shadow-cyan-500/20'
                                  : 'hover:ring-1 hover:ring-white/30'
                              }`}
                            >
                              <div className={`absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 ${
                                exportScale === option.scale ? 'opacity-30' : 'opacity-0 group-hover:opacity-20'
                              } transition-opacity`} />
                              <div className="absolute inset-0 bg-slate-900/80" />
                              <div className="relative z-10">
                                <div className="text-xl mb-1">{option.icon}</div>
                                <div className={`text-sm font-bold ${
                                  exportScale === option.scale ? 'text-cyan-300' : 'text-white'
                                }`}>{option.label}</div>
                                <div className="text-[10px] text-slate-400">{option.desc}</div>
                              </div>
                              {exportScale === option.scale && (
                                <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                              )}
                            </button>
                          ))}
                        </div>
                        <p className="text-[10px] text-slate-500 text-center">
                          Higher scale = larger file size but sharper watermarks
                        </p>
                      </div>

                      {/* Copy Settings */}
                      <div className="space-y-3 pt-4 border-t border-white/10">
                        <h4 className="text-xs font-medium text-[#9FB2C8] uppercase tracking-wider">Batch Actions</h4>
                        <button
                          onClick={() => {
                            setCopiedSettings(true);
                            setTimeout(() => setCopiedSettings(false), 2000);
                          }}
                          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                            copiedSettings
                              ? 'bg-[#10D98E]/20 border-[#10D98E] text-[#10D98E]'
                              : 'bg-[#0A1628] border-white/10 text-[#9FB2C8] hover:border-white/20'
                          }`}
                        >
                          {copiedSettings ? (
                            <>
                              <Check className="w-4 h-4" />
                              Settings Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              Copy to All Images
                            </>
                          )}
                        </button>
                      </div>

                      {/* Export Progress */}
                      {isExporting && exportProgress > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[#9FB2C8]">Exporting...</span>
                            <span className="text-[#1A7CFF] font-mono">{exportProgress}%</span>
                          </div>
                          <div className="h-2 bg-[#0A1628] rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-linear-to-r from-[#1A7CFF] to-[#A24BFF] transition-all duration-300"
                              style={{ width: `${exportProgress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="pt-4 space-y-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => exportImage(true, true)}
                              disabled={isExporting}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white font-medium hover:bg-white/8 transition-all"
                            >
                              <Eye className="w-4 h-4" />
                              Preview Export
                            </button>
                          </div>
                        <button
                          onClick={() => exportImage(true)}
                          disabled={isExporting}
                          className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold disabled:opacity-50 transition-all hover:shadow-lg hover:shadow-cyan-500/30 hover:scale-[1.02]"
                        >
                          {isExporting ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Exporting... {exportProgress}%
                            </>
                          ) : (
                            <>
                              <Download className="w-5 h-5" />
                              Export Current ({exportFormat.toUpperCase()}) - {exportScale}x
                            </>
                          )}
                        </button>

                        {images.length > 1 && (
                          <button
                            onClick={() => exportImage(false)}
                            disabled={isExporting}
                            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400 font-semibold hover:bg-purple-500/30 transition-all hover:scale-[1.02] disabled:opacity-50"
                          >
                            <Grid3X3 className="w-5 h-5" />
                            Export All ({images.length} images)
                          </button>
                        )}
                        {batchZipUrl && (
                          <div className="flex gap-2">
                            <a
                              href={batchZipUrl}
                              download={batchZipName || `watermarked_batch.zip`}
                              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:opacity-95"
                            >
                              <Download className="w-4 h-4" />
                              Download ZIP
                            </a>
                            <button
                              onClick={() => {
                                if (batchZipUrl) URL.revokeObjectURL(batchZipUrl);
                                setBatchZipUrl(null);
                                setBatchZipName(null);
                              }}
                              className="px-3 py-3 rounded-xl bg-white/5 text-white"
                            >
                              Clear
                            </button>
                          </div>
                        )}
                        
                        {/* Success/Error Feedback */}
                        {exportSuccess && (
                          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm">
                            <Check className="w-4 h-4" />
                            Export completed successfully!
                          </div>
                        )}
                        {exportError && (
                          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
                            <X className="w-4 h-4" />
                            {exportError}
                          </div>
                        )}
                        {exportErrorDetails && (
                          <div className="mt-2 px-3 py-2 rounded bg-black/70 border border-white/6 text-xs text-slate-300 overflow-auto max-h-40">
                            <strong className="text-sm text-red-300">Details:</strong>
                            <pre className="text-[11px] whitespace-pre-wrap mt-1">{exportErrorDetails}</pre>
                          </div>
                        )}
                      </div>
                    </div>
                  </m.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      {/* Export Preview Modal */}
      {/* Mobile FAB and bottom action bar (mobile-only helpers) */}
      <>
        {/* Floating action button: open watermark tab + focus input */}
        <button
          onClick={() => { setActiveTab('watermark'); setTimeout(() => watermarkTextRef.current?.focus(), 150); }}
          className="sm:hidden fixed bottom-24 right-4 z-50 p-4 rounded-full bg-cyan-500 text-white shadow-2xl flex items-center justify-center"
          title="Edit Watermark"
        >
          <Type className="w-5 h-5" />
        </button>

        {/* Bottom action bar with quick actions for mobile */}
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-gradient-to-r from-[#071026] to-[#0d1219] border-t border-white/5 flex items-center gap-3">
          <button
            onClick={() => exportImage(true, true)}
            disabled={isExporting}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white font-medium hover:bg-white/8 disabled:opacity-50"
            title="Preview Export"
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>

          <button
            onClick={() => exportImage(true)}
            disabled={isExporting}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold disabled:opacity-50"
            title="Export Current"
          >
            <Download className="w-4 h-4" />
            Export
          </button>

          <button
            onClick={() => setShowWatermark(!showWatermark)}
            className={`p-3 rounded-lg ${showWatermark ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/5 text-white/60'}`}
            title="Toggle Watermark"
          >
            {showWatermark ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>
      </>
      {exportPreviewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-[#071026] rounded-xl p-4 max-w-[92vw] max-h-[92vh] w-full sm:w-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-white">Export Preview</div>
              <div className="flex items-center gap-2">
                <a
                  href={exportPreviewUrl}
                  download={exportPreviewFilename || 'preview.png'}
                  className="px-3 py-1 rounded-lg bg-cyan-500 text-white text-sm"
                >
                  Download
                </a>
                <button
                  onClick={() => {
                    if (exportPreviewUrl) URL.revokeObjectURL(exportPreviewUrl);
                    setExportPreviewUrl(null);
                    setExportPreviewFilename(null);
                  }}
                  className="px-3 py-1 rounded-lg bg-white/5 text-white text-sm"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="bg-black/10 rounded flex items-center justify-center p-2">
              <img src={exportPreviewUrl} alt="Export preview" className="max-h-[70vh] max-w-full object-contain rounded" />
            </div>
          </div>
        </div>
      )}
    </LazyMotion>
  );
}
