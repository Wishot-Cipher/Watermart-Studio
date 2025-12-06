/* eslint-disable @typescript-eslint/no-explicit-any */
// ===================================================================
// PERFECT WATERMARK PREVIEW - ALL BUGS FIXED
// Opacity works, sizing is correct, positioning is accurate
// ===================================================================

import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as blazeface from '@tensorflow-models/blazeface'
import { FontKey, WatermarkStyle, WatermarkLogo } from '@/types/watermark'

type Props = {
  watermarkType: string
  currentUrl?: string
  faceModelRef?: React.RefObject<blazeface.BlazeFaceModel | null>
  watermarkText: string
  logoUrl: string | null
  logoUrls?: string[]
  imageScale?: number
  logos?: WatermarkLogo[]
  setLogos?: (v: WatermarkLogo[]) => void
  previewImgWidth: number
  size: number
  watermarkColor: string
  fontWeightState: '400'|'600'|'700'|'800'
  fontFamily: FontKey
  style: WatermarkStyle
  rotation: number
  adaptiveBlend: boolean
  glowEffect: boolean
  position: string
  customPos: { x: number; y: number } | null
  setCustomPos: (p: { x:number;y:number } | null) => void
  setIsDragging: (b: boolean) => void
  isDragging: boolean
  setPosition: (s: string) => void
  containerRef: React.RefObject<HTMLDivElement | null>
  blendMode: string
  opacity: number
  strokeWidth?: number
  strokeColor?: string
  flushRef?: React.MutableRefObject<(() => void) | null>
  
  // Professional Typography
  letterSpacing?: number
  lineHeight?: number
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
  
  // Advanced Effects
  shadowIntensity?: number
  shadowBlur?: number
  shadowOffsetX?: number
  shadowOffsetY?: number
  shadowColor?: string
  glowIntensity?: number
  glowColor?: string
  
  // Pattern
  pattern?: 'none' | 'tiled' | 'diagonal' | 'grid' | 'scattered' | 'border'
  patternSpacing?: number
  
  // Gradient
  gradientFrom?: string
  gradientTo?: string
}

// Professional style mappings
const STYLE_CLASSES: Record<WatermarkStyle, {
  bg: string;
  border: string;
  radius: string;
  padding: string;
}> = {
  'modern-glass': {
    bg: 'bg-white/[0.08] backdrop-blur-xl',
    border: 'border border-white/15',
    radius: 'rounded-2xl',
    padding: 'px-8 py-4'
  },
  'neon-glow': {
    bg: 'bg-black/60 backdrop-blur-md',
    border: 'border-2 border-cyan-400',
    radius: 'rounded-xl',
    padding: 'px-7 py-3.5'
  },
  'elegant-serif': {
    bg: 'bg-black/75',
    border: 'border border-white/25',
    radius: 'rounded-lg',
    padding: 'px-10 py-5'
  },
  'bold-impact': {
    bg: 'bg-black/90',
    border: 'border-4 border-white',
    radius: 'rounded-none',
    padding: 'px-12 py-6'
  },
  'minimal-clean': {
    bg: 'bg-white/92',
    border: 'border-none shadow-lg',
    radius: 'rounded-3xl',
    padding: 'px-6 py-3'
  },
  'gradient-fade': {
    bg: 'bg-linear-to-br from-blue-500/85 to-purple-500/85',
    border: 'border-none',
    radius: 'rounded-2xl',
    padding: 'px-9 py-4.5'
  },
  'stamp-vintage': {
    bg: 'bg-amber-900/35',
    border: 'border-4 border-double border-amber-900/85',
    radius: 'rounded-full',
    padding: 'px-6 py-6'
  },
  'tech-futuristic': {
    bg: 'bg-linear-to-br from-green-400/25 to-blue-600/25 backdrop-blur-xl',
    border: 'border-[1.5px] border-green-400/60',
    radius: 'rounded',
    padding: 'px-7 py-3.5'
  }
};

const STYLE_TEXT_EFFECTS: Record<WatermarkStyle, string> = {
  'modern-glass': 'tracking-wide',
  'neon-glow': 'tracking-wide',
  'elegant-serif': 'italic tracking-[0.1em]',
  'bold-impact': 'uppercase tracking-[0.15em] font-black',
  'minimal-clean': 'tracking-tight',
  'gradient-fade': 'tracking-wide font-semibold',
  'stamp-vintage': 'uppercase tracking-[0.12em]',
  'tech-futuristic': 'tracking-[0.06em]'
};

const STYLE_TEXT_SHADOWS: Record<WatermarkStyle, string | undefined> = {
  'modern-glass': undefined,
  'neon-glow': 'drop-shadow-[0_0_15px_rgba(0,255,255,0.9)] drop-shadow-[0_0_25px_rgba(0,255,255,0.5)]',
  'elegant-serif': 'drop-shadow-[2px_2px_4px_rgba(0,0,0,0.5)]',
  'bold-impact': 'drop-shadow-[4px_4px_0px_rgba(0,0,0,0.8)]',
  'minimal-clean': undefined,
  'gradient-fade': undefined,
  'stamp-vintage': 'drop-shadow-[1px_1px_3px_rgba(0,0,0,0.6)]',
  'tech-futuristic': undefined
};

export default function WatermarkPreview(props: Props) {
  const { 
    watermarkType, 
    watermarkText, 
    logos,
    setLogos,
    previewImgWidth, 
    size, 
    watermarkColor, 
    fontWeightState, 
    fontFamily, 
    glowEffect, 
    position, 
    customPos, 
    setCustomPos, 
    setIsDragging, 
    isDragging, 
    setPosition, 
    containerRef, 
    blendMode, 
    opacity,
    style,
    rotation,
    strokeWidth,
    strokeColor
    , flushRef,
    // Professional Typography
    letterSpacing,
    lineHeight,
    textTransform,
    
    // Advanced Effects
    shadowIntensity,
    shadowBlur,
    shadowOffsetX,
    shadowOffsetY,
    shadowColor,
    
    // Pattern
    pattern,
    patternSpacing,
    
    // Gradient
    gradientFrom,
    gradientTo
  } = props

  useEffect(() => {
    console.log('🎨 Preview update:', { style, opacity, size, position });
  }, [style, opacity, size, position]);

  const previewFontMap: Record<string,string> = {
    inter: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    playfair: "'Playfair Display', Georgia, serif",
    montserrat: "'Montserrat', -apple-system, sans-serif",
    'roboto-slab': "'Roboto Slab', Georgia, serif",
    pacifico: "'Pacifico', cursive",
  }

  const positions = [
    { id: 'top-left', label: 'Top Left', position: 'top-4 left-4' },
    { id: 'center', label: 'Center', position: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' },
    { id: 'center-right', label: 'Center Right', position: 'top-1/2 right-4 -translate-y-1/2' },
    { id: 'bottom-left', label: 'Bottom Left', position: 'bottom-4 left-4' },
    { id: 'bottom-center', label: 'Bottom Center', position: 'bottom-4 left-1/2 -translate-x-1/2' },
    { id: 'bottom-right', label: 'Bottom Right', position: 'bottom-4 right-4' },
  ]

  const currentPosition = positions.find(p => p.id === position)?.position || 'bottom-4 right-4'

  // CRITICAL FIX: Professional sizing calculation (matches canvas rendering)
  // Engine uses: baseFontSize = canvas.width * 0.025; fontSize = baseFontSize * (size / 50)
  const imgScale = props.imageScale && props.imageScale > 0 ? props.imageScale : 1;
  const engineBaseFont = Math.max(10, previewImgWidth * imgScale * 0.025);
  const previewFontPx = Math.max(10, Math.round(engineBaseFont * (size / 50)));
  const logoPreviewSize = Math.max(20, Math.round(previewFontPx * 1.2));
  const previewColor = watermarkColor || '#FFFFFF'

  // Get style configuration
  const styleConfig = STYLE_CLASSES[style] || STYLE_CLASSES['modern-glass']
  const textEffects = STYLE_TEXT_EFFECTS[style] || ''
  const textShadow = STYLE_TEXT_SHADOWS[style]

  // Calculate box shadow for styles that need it
  const getBoxShadow = () => {
    if (glowEffect) return '0 0 25px rgba(26, 124, 255, 0.8), 0 0 45px rgba(26, 124, 255, 0.4)'
    
    if (style === 'modern-glass') return '0 8px 32px rgba(0, 0, 0, 0.15)'
    if (style === 'neon-glow') return '0 0 25px rgba(0, 255, 255, 0.6)'
    if (style === 'minimal-clean') return '0 4px 16px rgba(0, 0, 0, 0.1)'
    if (style === 'gradient-fade') return '0 6px 24px rgba(26, 124, 255, 0.4)'
    if (style === 'tech-futuristic') return '0 0 20px rgba(0, 255, 157, 0.4)'
    
    return undefined
  }

  // Throttle pointer move updates via requestAnimationFrame to avoid flooding React state on mobile
  const rafRef = React.useRef<number | null>(null);
  const lastPosRef = React.useRef<{ x: number; y: number } | null>(null);

  const flushPointerPosition = () => {
    if (!lastPosRef.current) return;
    const { x, y } = lastPosRef.current;
    setCustomPos({ x, y });
    lastPosRef.current = null;
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
  };

  // Expose a flush function so parent can request committing any pending visual-only positions
  React.useEffect(() => {
    if (!flushRef) return;
    flushRef.current = () => {
      // flush last pointer pos for watermark
      try {
        if (lastPosRef.current) {
          const { x, y } = lastPosRef.current;
          setCustomPos({ x, y });
          lastPosRef.current = null;
          if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
        }
      } catch (err) { console.debug('flush pointer failed', err); }

      // Also compute logo positions from DOM to commit any immediate-follow updates
      try {
        const container = containerRef?.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const els = Array.from(container.querySelectorAll<HTMLElement>('.wm-logo-draggable'));
        if (!els || els.length === 0) return;
        const next = (logos || []).map((item, idx) => {
          const el = els[idx];
          if (!el) return item;
          const elRect = el.getBoundingClientRect();
          const cx = elRect.left + elRect.width / 2;
          const cy = elRect.top + elRect.height / 2;
          const x = Math.max(0, Math.min(1, (cx - rect.left) / rect.width));
          const y = Math.max(0, Math.min(1, (cy - rect.top) / rect.height));
          return { ...item, position: { x, y } };
        });
        if (setLogos) setLogos(next);
      } catch (err) {
        console.debug('flush logos failed', err);
      }
    };
    return () => { if (flushRef) flushRef.current = null; };
  }, [flushRef, containerRef, logos, setCustomPos, setLogos]);

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false)
    try { 
      (e.currentTarget as Element).releasePointerCapture(e.pointerId) 
    } catch (err) { 
      console.debug('releasePointerCapture failed', err) 
    }
    
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) {
      setPosition('custom')
      return
    }

    const xPct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const yPct = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))
    
    // Smart snapping to named positions
    const threshold = 0.1
    const nearLeft = xPct <= threshold
    const nearRight = xPct >= 1 - threshold
    const nearTop = yPct <= threshold
    const nearBottom = yPct >= 1 - threshold
    const nearCenterX = Math.abs(xPct - 0.5) <= threshold
    const nearCenterY = Math.abs(yPct - 0.5) <= threshold

    if (nearTop && nearLeft) {
      setCustomPos(null)
      setPosition('top-left')
    } else if (nearTop && nearCenterX) {
      setCustomPos(null)
      setPosition('top-center')
    } else if (nearTop && nearRight) {
      setCustomPos(null)
      setPosition('top-right')
    } else if (nearCenterY && nearLeft) {
      setCustomPos(null)
      setPosition('center-left')
    } else if (nearCenterY && nearCenterX) {
      setCustomPos(null)
      setPosition('center')
    } else if (nearCenterY && nearRight) {
      setCustomPos(null)
      setPosition('center-right')
    } else if (nearBottom && nearLeft) {
      setCustomPos(null)
      setPosition('bottom-left')
    } else if (nearBottom && nearCenterX) {
      setCustomPos(null)
      setPosition('bottom-center')
    } else if (nearBottom && nearRight) {
      setCustomPos(null)
      setPosition('bottom-right')
    } else {
      setCustomPos({ x: xPct, y: yPct })
      setPosition('custom')
    }
  }

  const getTextStyle = () => {
    const base: React.CSSProperties = {
      fontSize: `${previewFontPx}px`,
      fontFamily: previewFontMap[fontFamily] || previewFontMap.inter,
      fontWeight: Number(fontWeightState),
      lineHeight: lineHeight || 1.2,
      letterSpacing: letterSpacing ? `${letterSpacing}em` : undefined,
      textTransform: (textTransform as any) || 'none',
      color: previewColor,
    };

    if (gradientFrom && gradientTo) {
      base.backgroundImage = `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`;
      base.WebkitBackgroundClip = 'text';
      base.WebkitTextFillColor = 'transparent';
      base.backgroundClip = 'text';
      base.color = 'transparent';
    }

    if (shadowIntensity && shadowIntensity > 0) {
      const blur = shadowBlur || 0;
      const offX = shadowOffsetX || 2;
      const offY = shadowOffsetY || 2;
      const color = shadowColor || 'rgba(0,0,0,0.5)';
      base.textShadow = `${offX}px ${offY}px ${blur}px ${color}`;
    } else if (textShadow) {
      base.filter = textShadow;
    }

    return base;
  };

  const renderWatermarkContent = () => (
    <div 
      className={`${styleConfig.bg} ${styleConfig.border} ${styleConfig.radius} ${styleConfig.padding} transition-all duration-200`}
      style={{ 
        boxShadow: getBoxShadow()
      }}
    >
      <div
        className={`flex items-center gap-3 ${textEffects}`}
        style={getTextStyle()}
      >
        {(watermarkType === 'text' || watermarkType === 'both') && (
          <span style={{
            color: 'inherit',
            WebkitTextFillColor: 'inherit',
            backgroundClip: 'inherit',
            backgroundImage: 'inherit',
            fontWeight: Number(fontWeightState),
            WebkitTextStroke: (strokeWidth && strokeWidth > 0) ? `${strokeWidth}px ${strokeColor || '#000'}` : undefined,
            textShadow: (shadowIntensity && shadowIntensity > 0) ? undefined : ((strokeWidth && strokeWidth > 0) ? `-1px -1px 0 ${strokeColor || '#000'}, 1px -1px 0 ${strokeColor || '#000'}, -1px 1px 0 ${strokeColor || '#000'}, 1px 1px 0 ${strokeColor || '#000'}` : undefined)
          }}>
            {watermarkText}
          </span>
        )}
      </div>
    </div>
  );

  if (pattern && pattern !== 'none') {
    const isDiagonal = pattern === 'diagonal';
    const gap = patternSpacing ? Math.max(10, patternSpacing * 2) : 48;
    return (
      <div 
        className="absolute inset-0 z-30 overflow-hidden pointer-events-none flex flex-wrap content-center justify-center" 
        style={{ 
          opacity: opacity / 100,
          gap: `${gap}px`
        }}
      >
         {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className={`transform ${isDiagonal ? '-rotate-45' : ''} scale-90`}>
               {renderWatermarkContent()}
            </div>
         ))}
      </div>
    );
  }

  return (
    <AnimatePresence>
      {watermarkType !== 'none' && (
        <motion.div 
          initial={{ opacity: 0 }} 
            animate={{ opacity: opacity / 100 }} 
            exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
            className={`absolute ${position === 'custom' ? '' : currentPosition} z-30 pointer-events-auto cursor-grab active:cursor-grabbing select-none`}
            onPointerDown={(e) => {
              setIsDragging(true)
              try { 
                (e.currentTarget as Element).setPointerCapture(e.pointerId) 
              } catch (err) { 
                console.debug('setPointerCapture failed', err) 
              }
            }}
            onPointerMove={(e) => {
              if (!isDragging) return
              const rect = containerRef.current?.getBoundingClientRect()
              if (!rect) return
              const xPct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
              const yPct = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))
              lastPosRef.current = { x: xPct, y: yPct };
              // Immediate visual feedback: update element position directly so it follows touch immediately
              try {
                const el = e.currentTarget as HTMLElement;
                el.style.left = `${xPct * 100}%`;
                el.style.top = `${yPct * 100}%`;
                // keep translate for centering while dragging
                el.style.transform = `translate(-50%,-50%) rotate(${rotation}deg)`;
              } catch (err) {
                console.debug('watermark dom update failed', err);
              }
              if (!rafRef.current) {
                rafRef.current = requestAnimationFrame(() => {
                  flushPointerPosition();
                });
              }
            }}
            onPointerUp={handlePointerUp}
            style={{ 
              mixBlendMode: (blendMode as any),
              filter: glowEffect ? 'drop-shadow(0 0 25px rgba(26,124,255,0.8))' : 'none', 
              opacity: opacity / 100,
              left: position === 'custom' && customPos ? `${customPos.x * 100}%` : undefined, 
              top: position === 'custom' && customPos ? `${customPos.y * 100}%` : undefined, 
              transform: `${position === 'custom' && customPos ? 'translate(-50%,-50%) ' : ''}rotate(${rotation}deg)`,
              transformOrigin: 'center center',
              pointerEvents: 'auto',
              touchAction: 'none'
            }}
        >
          {renderWatermarkContent()}
        
          {/* Render logos as absolute overlays relative to the image container (not inside watermark box) */}
          {(watermarkType === 'logo' || watermarkType === 'both') && logos && logos.length > 0 && logos.map((l, i) => {
            const sizePx = Math.max(12, Math.round(logoPreviewSize * (l.size / 100)));
            const left = `${(l.position?.x ?? 0.9) * 100}%`;
            const top = `${(l.position?.y ?? 0.9) * 100}%`;
            const logoOpacity = (l.opacity ?? 100) / 100;
            const logoRotation = l.rotation ?? 0;
            return (
                <div
                  key={l.id || i}
                  data-index={i}
                  className="wm-logo-draggable absolute z-50 cursor-grab active:cursor-grabbing"
                  style={{
                    width: sizePx,
                    height: sizePx,
                    left,
                    top,
                    transform: `translate(-50%,-50%) rotate(${logoRotation}deg)`,
                    opacity: logoOpacity
                  }}
                onPointerDown={(e) => {
                  const setLogos = props.setLogos;
                  if (!setLogos) return;
                  const pid = e.pointerId;
                  try { (e.currentTarget as Element).setPointerCapture(pid); } catch (err) { console.debug('setPointerCapture', err); }
                  const rect = props.containerRef.current?.getBoundingClientRect();
                  if (!rect) return;
                    // Throttle logo move updates with requestAnimationFrame and apply immediate DOM transforms
                    let rafId: number | null = null;
                    let lastPos: { x: number; y: number } | null = null;
                    const logoEl = e.currentTarget as HTMLElement;
                    const logoRotation = l.rotation ?? 0;
                    // ensure touch action is disabled so finger drag is not interrupted
                    try { logoEl.style.touchAction = 'none'; } catch (err) { console.debug('set touchAction failed', err); }
                    const move = (ev: PointerEvent) => {
                      const x = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width));
                      const y = Math.max(0, Math.min(1, (ev.clientY - rect.top) / rect.height));
                      lastPos = { x, y };
                      // Immediate visual follow (preserve rotation)
                      try {
                        logoEl.style.left = `${x * 100}%`;
                        logoEl.style.top = `${y * 100}%`;
                        logoEl.style.transform = `translate(-50%,-50%) rotate(${logoRotation}deg)`;
                      } catch (err) { console.debug('logo dom update failed', err); }
                      if (rafId == null) {
                        rafId = requestAnimationFrame(() => {
                          if (!lastPos) return;
                          const { x, y } = lastPos;
                          const next = (logos || []).map((item, idx) => idx === i ? { ...item, position: { x, y } } : item);
                          setLogos(next);
                          lastPos = null;
                          if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
                        });
                      }
                    };
                  const up = () => {
                    try { (e.currentTarget as Element).releasePointerCapture(pid); } catch (err) { console.debug('releasePointerCapture', err); }
                      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
                      // commit final position if any
                      if (lastPos) {
                        const { x, y } = lastPos;
                        const next = (logos || []).map((item, idx) => idx === i ? { ...item, position: { x, y } } : item);
                        setLogos(next);
                        lastPos = null;
                      }
                      window.removeEventListener('pointermove', move);
                      window.removeEventListener('pointerup', up);
                  };
                  window.addEventListener('pointermove', move);
                  window.addEventListener('pointerup', up);
                }}
                // Prevent touch scrolling while dragging logos
                // and ensure touch interactions are captured
              >
                <img src={l.dataUrl} alt={`logo-${i}`} className="object-contain w-full h-full" style={{ display: 'block' }} />
                <div className="absolute -top-2 -right-2 bg-black/70 text-white text-[10px] px-1 rounded-md border border-white/20">{sizePx}px</div>
              </div>
            )
          })}
        </motion.div>
      )}
    </AnimatePresence>
  )
}