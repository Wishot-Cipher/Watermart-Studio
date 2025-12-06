/* eslint-disable @typescript-eslint/no-explicit-any */
// ===================================================================
// PROFESSIONAL WATERMARK ENGINE V2
// Multi-logo support, perfect rendering, all features working
// ===================================================================

import * as blazeface from '@tensorflow-models/blazeface';
import { WatermarkConfig, ImageAdjustments, WatermarkStyle, WatermarkLogo, ExportOptions, EXPORT_QUALITY_SETTINGS } from '@/types/watermark';

const STYLE_CONFIGS: Record<WatermarkStyle, {
  background: string;
  border: string;
  borderRadius: number;
  padding: { vertical: number; horizontal: number };
  fontStyle?: 'normal' | 'italic';
  textTransform?: 'none' | 'uppercase' | 'lowercase';
  letterSpacing: number;
  textShadow?: { x: number; y: number; blur: number; color: string };
  boxShadow?: { x: number; y: number; blur: number; color: string };
}> = {
  'modern-glass': {
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: { vertical: 16, horizontal: 32 },
    letterSpacing: 0.5,
    boxShadow: { x: 0, y: 8, blur: 32, color: 'rgba(0, 0, 0, 0.15)' }
  },
  'neon-glow': {
    background: 'rgba(0, 0, 0, 0.6)',
    border: '2px solid #00ffff',
    borderRadius: 12,
    padding: { vertical: 14, horizontal: 28 },
    letterSpacing: 1,
    textShadow: { x: 0, y: 0, blur: 15, color: '#00ffff' },
    boxShadow: { x: 0, y: 0, blur: 25, color: 'rgba(0, 255, 255, 0.6)' }
  },
  'elegant-serif': {
    background: 'rgba(0, 0, 0, 0.75)',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    borderRadius: 6,
    padding: { vertical: 20, horizontal: 40 },
    fontStyle: 'italic',
    letterSpacing: 2,
    textShadow: { x: 2, y: 2, blur: 4, color: 'rgba(0, 0, 0, 0.5)' }
  },
  'bold-impact': {
    background: 'rgba(0, 0, 0, 0.9)',
    border: '4px solid #ffffff',
    borderRadius: 0,
    padding: { vertical: 24, horizontal: 48 },
    textTransform: 'uppercase',
    letterSpacing: 4,
    textShadow: { x: 4, y: 4, blur: 0, color: 'rgba(0, 0, 0, 0.8)' }
  },
  'minimal-clean': {
    background: 'rgba(255, 255, 255, 0.92)',
    border: 'none',
    borderRadius: 24,
    padding: { vertical: 12, horizontal: 24 },
    letterSpacing: 0.3,
    boxShadow: { x: 0, y: 4, blur: 16, color: 'rgba(0, 0, 0, 0.1)' }
  },
  'gradient-fade': {
    background: 'linear-gradient(135deg, rgba(26, 124, 255, 0.85), rgba(162, 75, 255, 0.85))',
    border: 'none',
    borderRadius: 20,
    padding: { vertical: 18, horizontal: 36 },
    letterSpacing: 1,
    boxShadow: { x: 0, y: 6, blur: 24, color: 'rgba(26, 124, 255, 0.4)' }
  },
  'stamp-vintage': {
    background: 'rgba(139, 69, 19, 0.35)',
    border: '5px double rgba(139, 69, 19, 0.85)',
    borderRadius: 999,
    padding: { vertical: 24, horizontal: 24 },
    textTransform: 'uppercase',
    letterSpacing: 3,
    textShadow: { x: 1, y: 1, blur: 3, color: 'rgba(0, 0, 0, 0.6)' }
  },
  'tech-futuristic': {
    background: 'linear-gradient(135deg, rgba(0, 255, 157, 0.25), rgba(0, 112, 243, 0.25))',
    border: '1.5px solid rgba(0, 255, 157, 0.6)',
    borderRadius: 22,
    padding: { vertical: 14, horizontal: 28 },
    letterSpacing: 1.5,
    boxShadow: { x: 0, y: 0, blur: 20, color: 'rgba(0, 255, 157, 0.4)' }
  }
};

const FONT_FAMILIES: Record<string, string> = {
  'inter': 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  'playfair': 'Playfair Display, Georgia, serif',
  'montserrat': 'Montserrat, -apple-system, sans-serif',
  'roboto-slab': 'Roboto Slab, Georgia, serif',
  'pacifico': 'Pacifico, cursive'
};

/**
 * MAIN RENDER FUNCTION with export quality options
 */
export async function renderWatermark(
  imageUrl: string,
  config: WatermarkConfig,
  adjustments: ImageAdjustments,
  faceModel: blazeface.BlazeFaceModel | null,
  customPosition?: { x: number; y: number },
  // backward-compatible: accept either an ExportOptions object or a legacy quality string ('hd'|'standard'|'small'|'ultra')
  exportOptions?: ExportOptions | 'normal' | 'hd' | 'standard' | 'small' | 'ultra'
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = async () => {
        try { console.log('renderWatermark: adjustments.filterPreset=', adjustments?.filterPreset, 'exportOptions=', exportOptions); } catch (err) { console.debug(err); }
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) throw new Error('Canvas context not available');

        // Apply export quality settings (backwards-compatible with legacy string)
        let qualityKey: keyof typeof EXPORT_QUALITY_SETTINGS = 'standard';
        let outFormat: ExportOptions['format'] = 'jpg';
        if (!exportOptions) {
          qualityKey = 'hd';
        } else if (typeof exportOptions === 'string') {
          // legacy API: just a quality string
          // map 'small' to a sane fallback if not defined in settings
          qualityKey = (exportOptions in EXPORT_QUALITY_SETTINGS) ? (exportOptions as any) : 'standard';
        } else {
          qualityKey = exportOptions.quality in EXPORT_QUALITY_SETTINGS ? exportOptions.quality : 'standard';
          outFormat = exportOptions.format || outFormat;
        }

        // If caller requested HD and didn't specify a format, prefer PNG for lossless-like output
        if ((qualityKey === 'hd' || qualityKey === 'ultra') && typeof exportOptions !== 'object') {
          outFormat = 'png';
        }

        let settings = EXPORT_QUALITY_SETTINGS[qualityKey];
        // backward compatibility: support a missing 'small' key by mapping to a smaller standard
        if (!settings) {
          if ((exportOptions as any) === 'small') {
            settings = { quality: 0.7, maxDimension: 1280 } as any;
          } else {
            settings = EXPORT_QUALITY_SETTINGS.standard;
          }
        }
        
        // Calculate dimensions with quality scaling.
        // For HD/Ultra exports we allow upscaling the source image to reach the target maxDimension
        let width = img.width;
        let height = img.height;
        const maxDim = settings.maxDimension;
        const largest = Math.max(width, height);
        if ((qualityKey === 'hd' || qualityKey === 'ultra') && largest !== 0) {
          // Upscale or downscale to fill the maxDimension while preserving aspect ratio
          const scale = maxDim / largest;
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        } else {
          // For normal/standard: only downscale images larger than the target
          if (largest > maxDim) {
            const scale = maxDim / largest;
            width = Math.round(width * scale);
            height = Math.round(height * scale);
          }
        }

        // Global safety cap: prevent exported images from being excessively large
        // (some users report very large downloads from HD/Ultra upscaling). This
        // enforces an upper bound while preserving aspect ratio. For HD/Ultra exports,
        // we allow much higher resolution to deliver professional quality.
        const isMobile = typeof navigator !== 'undefined' && /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
        let GLOBAL_MAX_EXPORT_DIMENSION: number;
        
        if (qualityKey === 'ultra') {
          // Ultra quality: no cap, use full resolution up to 4K
          GLOBAL_MAX_EXPORT_DIMENSION = 4096;
        } else if (qualityKey === 'hd') {
          // HD quality: cap at 2K for safety but allow high resolution
          GLOBAL_MAX_EXPORT_DIMENSION = 2560;
        } else {
          // Normal/Standard: modest cap to avoid large downloads
          GLOBAL_MAX_EXPORT_DIMENSION = isMobile ? 1280 : 1920;
        }
        
        const finalLargest = Math.max(width, height);
        if (finalLargest > GLOBAL_MAX_EXPORT_DIMENSION) {
          const gscale = GLOBAL_MAX_EXPORT_DIMENSION / finalLargest;
          width = Math.round(width * gscale);
          height = Math.round(height * gscale);
        }

        canvas.width = width;
        canvas.height = height;

        // Apply professional image adjustments
        applyImageAdjustments(ctx, img, adjustments, width, height);

        // Draw pattern watermark if enabled
        if (config.pattern && config.pattern !== 'none' && config.text && config.text.trim().length > 0) {
          await drawPatternWatermark(ctx, canvas, config);
        } else if (config.text && config.text.trim().length > 0) {
          // Draw single text watermark if no pattern
          const position = await calculatePosition(canvas, config, faceModel, customPosition);
          await drawTextWatermark(ctx, canvas, config, position);
        }

        // Draw all logos (support both new WatermarkLogo[] and legacy shapes)
        const logosToDraw: WatermarkLogo[] = Array.isArray((config as any).logos)
          ? (config as any).logos.map((l: any, idx: number) => {
              // If already matches WatermarkLogo shape, keep it
              if (l && (l.dataUrl || l.id)) return l as WatermarkLogo;
              // Legacy shape mapping
              const dataUrl = l?.dataUrl || l?.url || l?.logoUrl || l;
              const position = l?.position || (typeof l?.x === 'number' && typeof l?.y === 'number' ? { x: l.x, y: l.y } : { x: 0.9 - (idx * 0.02), y: 0.9 - (idx * 0.02) });
              const size = typeof l?.size === 'number' ? l.size : (typeof l?.scale === 'number' ? Math.round((l.scale || 1) * 100) : 100);
              const rotation = typeof l?.rotation === 'number' ? l.rotation : (l?.rot || 0);
              const opacity = typeof l?.opacity === 'number' ? l.opacity : (typeof l?.alpha === 'number' ? l.alpha : 100);
              return {
                id: l?.id || `logo-${idx}-${String(dataUrl).slice(0,8)}`,
                dataUrl,
                position,
                size,
                rotation,
                opacity
              } as WatermarkLogo;

          }) : [];

        if (logosToDraw.length > 0) {
          await drawMultipleLogos(ctx, canvas, logosToDraw, width, height, faceModel);
        }

        // Export with quality settings
        // HD/Ultra: NO automatic sharpening - preserve pristine original quality
        // Users can manually apply sharpening via the Enhance tab if desired

        // Use canvas.toBlob for better quality control (async)
        const mimeType = outFormat === 'png' ? 'image/png' : outFormat === 'webp' ? 'image/webp' : 'image/jpeg';
        const qualityParam = outFormat === 'png' ? undefined : settings.quality;
        
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to create blob'));
              return;
            }
            const url = URL.createObjectURL(blob);
            resolve(url);
          },
          mimeType,
          qualityParam
        );
      } catch (err) {
        console.error('Watermark render failed:', err);
        reject(err);
      }
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageUrl;
  });
}

/**
 * Apply professional image adjustments with filter presets
 */
function applyImageAdjustments(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  adj: ImageAdjustments,
  width: number,
  height: number
) {
  // Build filter string with all adjustments
  const filters: string[] = [];

  // If a filter preset is selected, include its filter string first
  if (adj.filterPreset && adj.filterPreset !== 'none') {
    const presetMap: Record<string, string> = {
      vivid: 'saturate(1.3) contrast(1.1)',
      dramatic: 'contrast(1.3) brightness(0.9) saturate(0.8)',
      warm: 'sepia(0.3) saturate(1.2)',
      cool: 'hue-rotate(180deg) saturate(1.1)',
      vintage: 'sepia(0.5) contrast(0.9) brightness(1.1)',
      bw: 'grayscale(1) contrast(1.2)',
      // Professional presets
      cinematic: 'contrast(1.15) saturate(1.05) sepia(0.08) brightness(0.95) hue-rotate(-5deg)',
      portrait: 'contrast(1.05) saturate(1.08) brightness(1.02)',
      hdr: 'contrast(1.25) saturate(1.2) brightness(1.05)',
      matte: 'contrast(0.92) saturate(0.9) brightness(0.98) sepia(0.05)',
      film: 'contrast(1.1) saturate(0.95) sepia(0.2) brightness(0.98)',
      moody: 'contrast(1.2) brightness(0.9) saturate(0.82) hue-rotate(-10deg)',
      // Pro (studio-grade) preset — toned-down, natural look
      // Subtle contrast/saturation/brightness tweaks to emulate high-end camera processing
       pro: 'contrast(1.06) saturate(1.05) brightness(1.02) hue-rotate(-2deg)'
      ,
      // Creative presets added from FILTERS
      'golden-hour': 'sepia(0.18) saturate(1.12) brightness(1.04) contrast(1.03)',
      'magazine-cover': 'contrast(1.18) saturate(1.15) brightness(1.02) hue-rotate(-2deg)',
      'teal-orange': 'sepia(0.06) saturate(1.2) contrast(1.05) hue-rotate(10deg)',
      'fashion-editorial': 'contrast(1.12) saturate(1.08) brightness(1.03) sepia(0.04)',
      'neon-pop': 'saturate(1.4) contrast(1.2) brightness(1.06) hue-rotate(10deg)',
      'cyberpunk': 'saturate(1.25) contrast(1.15) brightness(1.02) hue-rotate(200deg)',
      'tropical-vibes': 'saturate(1.3) brightness(1.05) contrast(1.02)',
      'ocean-depth': 'saturate(0.95) contrast(1.05) brightness(0.95) hue-rotate(200deg)',
      'autumn-warmth': 'sepia(0.25) saturate(1.15) brightness(1.01) contrast(1.03)',
      'sunset-glow': 'sepia(0.16) saturate(1.18) brightness(1.06) contrast(1.02) hue-rotate(-8deg)',
      'luxury-gold': 'sepia(0.28) saturate(1.2) contrast(1.08) brightness(1.02)',
      'arctic-blue': 'saturate(0.9) contrast(1.05) brightness(1.02) hue-rotate(180deg)',
      'nordic-minimal': 'contrast(0.95) saturate(0.9) brightness(1.02)',
      'pastel-dream': 'saturate(0.85) contrast(0.95) brightness(1.06) hue-rotate(-10deg)',
      'urban-grit': 'contrast(1.2) saturate(0.85) brightness(0.95) sepia(0.06)'
    };
    const presetStr = presetMap[adj.filterPreset] || '';
    if (presetStr) filters.push(presetStr);
  }
  
  // Basic adjustments (use gentler scaling to avoid over-bright results)
  // Exposure: user slider is -100..100; map to a mild brightness change
  const brightnessVal = Math.max(0.2, 1 + (adj.exposure || 0) / 200);
  filters.push(`brightness(${brightnessVal})`);

  // Contrast: gentler scaling; clarity is blended in but reduced influence
  const contrastVal = Math.max(0.2, 1 + (adj.contrast || 0) / 200 + (adj.clarity || 0) / 800);
  filters.push(`contrast(${contrastVal})`);

  // Saturation/vibrance: softer combined effect
  const saturateVal = Math.max(0, 1 + (adj.saturation || 0) / 150 + (adj.vibrance || 0) / 300);
  filters.push(`saturate(${saturateVal})`);

  // Color shifts: temperature, hue, tint combined (kept same magnitude)
  filters.push(`hue-rotate(${(adj.temperature * 0.3 + adj.hue + adj.tint * 0.5)}deg)`);

  // Advanced adjustments: keep sharpen influence on contrast extremely subtle
  if (adj.sharpen > 0) {
    // Use a slightly stronger mapping so user-sharpen has visible effect
    // but remains conservative — lowering divisor from 4000 -> 3000.
    const subtle = Math.min(0.06, adj.sharpen / 3000);
    if (subtle > 0) filters.push(`contrast(${1 + subtle})`);
  }
  
  ctx.filter = filters.join(' ');
  ctx.drawImage(img, 0, 0, width, height);

  // Extra pro processing for studio-grade look: a subtler unsharp mask / clarity boost
  if (adj.filterPreset === 'pro') {
    try {
      const amount = 0.18; // reduced strength to avoid shiny look
      const radius = 0.8; // smaller blur radius for finer detail

      const off = document.createElement('canvas');
      off.width = width;
      off.height = height;
      const offCtx = off.getContext('2d');
      if (offCtx) {
        // draw blurred version
        offCtx.filter = `blur(${radius}px)`;
        offCtx.drawImage(img, 0, 0, width, height);
        const orig = ctx.getImageData(0, 0, width, height);
        const blurred = offCtx.getImageData(0, 0, width, height);

        const data = orig.data;
        const bdata = blurred.data;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          // luminance to favor midtones for clarity (avoid sharpening highlights/shadows too much)
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          const midFactor = 1 - Math.abs((lum - 128) / 128); // 0..1, peaks at midtones
          const weighted = amount * (0.6 + 0.4 * midFactor); // keep base weight and emphasize midtones

          const dr = (data[i] - bdata[i]) * weighted;
          const dg = (data[i + 1] - bdata[i + 1]) * weighted;
          const db = (data[i + 2] - bdata[i + 2]) * weighted;

          data[i] = Math.min(255, Math.max(0, data[i] + dr));
          data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + dg));
          data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + db));
        }

        ctx.putImageData(orig, 0, 0);
      }
    } catch (err) {
      // fail gracefully — pro enhancement is optional
      console.warn('Pro preset processing failed', err);
    }
  }

  ctx.filter = 'none';

  // Apply highlights/shadows with gradient overlay
  if (adj.highlights !== 0 || adj.shadows !== 0) {
    applyTonalAdjustments(ctx, width, height, adj);
  }

  // Apply dehaze
  if (adj.dehaze > 0) {
    ctx.globalCompositeOperation = 'overlay';
    ctx.fillStyle = `rgba(255, 255, 255, ${adj.dehaze / 200})`;
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'source-over';
  }

  // Apply vignette
  if (adj.vignette !== 0) {
    applyVignette(ctx, width, height, adj.vignette);
  }

  // Apply grain
  if (adj.grain > 0) {
    applyGrain(ctx, width, height, adj.grain);
  }
}

// preset handling is now merged into applyImageAdjustments

/**
 * Apply tonal adjustments (highlights/shadows)
 */
function applyTonalAdjustments(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  adj: ImageAdjustments
) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const luminance = (r + g + b) / 3;

    // Adjust highlights (bright areas)
    if (luminance > 128 && adj.highlights !== 0) {
      const factor = ((luminance - 128) / 127) * (adj.highlights / 100);
      data[i] = Math.min(255, r + r * factor);
      data[i + 1] = Math.min(255, g + g * factor);
      data[i + 2] = Math.min(255, b + b * factor);
    }

    // Adjust shadows (dark areas)
    if (luminance < 128 && adj.shadows !== 0) {
      const factor = ((128 - luminance) / 128) * (adj.shadows / 100);
      data[i] = Math.max(0, r + r * factor);
      data[i + 1] = Math.max(0, g + g * factor);
      data[i + 2] = Math.max(0, b + b * factor);
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

/**
 * Apply vignette effect
 */
function applyVignette(ctx: CanvasRenderingContext2D, width: number, height: number, intensity: number) {
  const gradient = ctx.createRadialGradient(
    width / 2, height / 2, 0,
    width / 2, height / 2, Math.max(width, height) / 2
  );
  
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(1, `rgba(0, 0, 0, ${Math.abs(intensity) / 100})`);
  
  ctx.globalCompositeOperation = intensity < 0 ? 'lighter' : 'multiply';
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  ctx.globalCompositeOperation = 'source-over';
}

/**
 * Apply grain effect
 */
function applyGrain(ctx: CanvasRenderingContext2D, width: number, height: number, intensity: number) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const grainAmount = intensity / 100;

  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * grainAmount * 255;
    data[i] += noise;
    data[i + 1] += noise;
    data[i + 2] += noise;
  }

  ctx.putImageData(imageData, 0, 0);
}

/**
 * Calculate watermark position with AI face detection
 */
async function calculatePosition(
  canvas: HTMLCanvasElement,
  config: WatermarkConfig,
  faceModel: blazeface.BlazeFaceModel | null,
  customPosition?: { x: number; y: number }
): Promise<{ x: number; y: number }> {
  if (customPosition) {
    return {
      x: customPosition.x * canvas.width,
      y: customPosition.y * canvas.height
    };
  }

  if (config.aiPlacement && faceModel) {
    try {
      const faces = await faceModel.estimateFaces(canvas, false);
      if (faces.length > 0) {
        const face = faces[0];
        const resolvePoint = async (pt: any): Promise<[number, number]> => {
          if (Array.isArray(pt) && pt.length >= 2) return [pt[0], pt[1]];
          if (pt?.array) return await pt.array();
          if (pt?.dataSync) {
            const arr = pt.dataSync();
            return [arr[0], arr[1]];
          }
          return [0, 0];
        };

        const [tlx, tly] = await resolvePoint(face.topLeft);
        const [brx, bry] = await resolvePoint(face.bottomRight);
        const faceX = (tlx + brx) / 2;
        const faceY = (tly + bry) / 2;
        
        const margin = 60;
        if (faceX < canvas.width / 2 && faceY < canvas.height / 2) {
          return { x: canvas.width - margin, y: canvas.height - margin };
        } else if (faceX >= canvas.width / 2 && faceY < canvas.height / 2) {
          return { x: margin, y: canvas.height - margin };
        } else if (faceX < canvas.width / 2 && faceY >= canvas.height / 2) {
          return { x: canvas.width - margin, y: margin };
        } else {
          return { x: margin, y: margin };
        }
      }
    } catch (err) {
      console.warn('Face detection failed:', err);
    }
  }

  const margin = 50;
  const positions: Record<string, { x: number; y: number }> = {
    'top-left': { x: margin, y: margin },
    'top-center': { x: canvas.width / 2, y: margin },
    'top-right': { x: canvas.width - margin, y: margin },
    'center-left': { x: margin, y: canvas.height / 2 },
    'center': { x: canvas.width / 2, y: canvas.height / 2 },
    'center-right': { x: canvas.width - margin, y: canvas.height / 2 },
    'bottom-left': { x: margin, y: canvas.height - margin },
    'bottom-center': { x: canvas.width / 2, y: canvas.height - margin },
    'bottom-right': { x: canvas.width - margin, y: canvas.height - margin }
  };

  return positions[config.position] || positions['bottom-right'];
}

/**
 * Draw pattern watermark (tiled, diagonal, grid, etc.)
 */
async function drawPatternWatermark(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  config: WatermarkConfig
) {
  const pattern = config.pattern;
  const spacing = config.patternSpacing || 200;
  const width = canvas.width;
  const height = canvas.height;

  const positions: Array<{ x: number; y: number }> = [];

  switch (pattern) {
    case 'tiled': {
      // Grid pattern covering the entire canvas
      for (let y = spacing / 2; y < height; y += spacing) {
        for (let x = spacing / 2; x < width; x += spacing) {
          positions.push({ x, y });
        }
      }
      break;
    }

    case 'diagonal': {
      // Diagonal pattern from top-left to bottom-right
      const diagSpacing = spacing * 1.2;
      for (let y = -width; y < height + width; y += diagSpacing) {
        for (let x = -height; x < width + height; x += diagSpacing) {
          positions.push({ x, y });
        }
      }
      break;
    }

    case 'grid': {
      // Grid lines pattern
      for (let y = 0; y < height; y += spacing) {
        for (let x = 0; x < width; x += spacing / 3) {
          positions.push({ x, y });
        }
      }
      for (let x = 0; x < width; x += spacing) {
        for (let y = 0; y < height; y += spacing / 3) {
          positions.push({ x, y });
        }
      }
      break;
    }

    case 'scattered': {
      // Random scattered pattern
      const count = Math.floor((width * height) / (spacing * spacing));
      for (let i = 0; i < count; i++) {
        positions.push({
          x: Math.random() * width,
          y: Math.random() * height
        });
      }
      break;
    }

    case 'border': {
      // Border pattern around edges
      const borderSpacing = spacing / 2;
      // Top edge
      for (let x = borderSpacing; x < width; x += borderSpacing) {
        positions.push({ x, y: spacing / 2 });
      }
      // Bottom edge
      for (let x = borderSpacing; x < width; x += borderSpacing) {
        positions.push({ x, y: height - spacing / 2 });
      }
      // Left edge
      for (let y = spacing; y < height - spacing; y += borderSpacing) {
        positions.push({ x: spacing / 2, y });
      }
      // Right edge
      for (let y = spacing; y < height - spacing; y += borderSpacing) {
        positions.push({ x: width - spacing / 2, y });
      }
      break;
    }
  }

  // Draw watermark at each position with reduced opacity
  const originalOpacity = config.opacity;
  const patternOpacity = config.patternOpacity !== undefined ? config.patternOpacity : Math.max(20, originalOpacity / 2);
  
  for (const position of positions) {
    await drawTextWatermark(ctx, canvas, { ...config, opacity: patternOpacity }, position);
  }
}

/**
 * Draw text watermark with ALL features working
 */
async function drawTextWatermark(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  config: WatermarkConfig,
  position: { x: number; y: number }
) {
  const styleConfig = STYLE_CONFIGS[config.style];
  
  // Calculate font size (FIXED)
  const baseFontSize = canvas.width * 0.025;
  const fontSize = baseFontSize * (config.size / 50);
  const fontFamily = FONT_FAMILIES[config.fontFamily] || FONT_FAMILIES.inter;
  
  const fontWeight = config.fontWeight;
  const fontStyle = styleConfig.fontStyle || 'normal';
  ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Apply text transform from config (user-defined) or style (preset)
  let text = config.text || '';
  const textTransform = config.textTransform || styleConfig.textTransform;
  if (textTransform === 'uppercase') text = text.toUpperCase();
  if (textTransform === 'lowercase') text = text.toLowerCase();
  if (textTransform === 'capitalize') text = text.replace(/\b\w/g, l => l.toUpperCase());

  // Apply letter spacing if specified
  const letterSpacing = config.letterSpacing !== undefined ? config.letterSpacing : (styleConfig.letterSpacing || 0);
  
  const metrics = ctx.measureText(text);
  let textWidth = metrics.width;
  
  // Adjust text width for letter spacing
  if (letterSpacing && letterSpacing !== 0) {
    textWidth += (text.length - 1) * (letterSpacing * fontSize / 100);
  }
  
  const lineHeight = config.lineHeight !== undefined ? config.lineHeight : 1.3;
  const textHeight = fontSize * lineHeight;

  const bgWidth = textWidth + (styleConfig.padding.horizontal * 2);
  const bgHeight = textHeight + (styleConfig.padding.vertical * 2);

  ctx.save();
  // Ensure a clean transform state so logo drawing or other operations
  // cannot accidentally affect text sizing/measurement.
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  // CRITICAL: Apply opacity FIRST
  ctx.globalAlpha = config.opacity / 100;

  // Apply rotation (FIXED)
  if (config.rotation !== 0) {
    ctx.translate(position.x, position.y);
    ctx.rotate((config.rotation * Math.PI) / 180);
    ctx.translate(-position.x, -position.y);
  }

  ctx.globalCompositeOperation = config.blendMode as GlobalCompositeOperation;

  const bgX = position.x - bgWidth / 2;
  const bgY = position.y - bgHeight / 2;

  // Draw shadow/glow with user-defined values
  const glowEnabled = config.glowEffect;
  const glowIntensity = config.glowIntensity !== undefined ? config.glowIntensity : 50;
  const glowColor = config.glowColor || '#00FFFF';
  const shadowBlur = config.shadowBlur !== undefined ? config.shadowBlur : (styleConfig.boxShadow?.blur || 20);
  const shadowColor = config.shadowColor || (styleConfig.boxShadow?.color || 'rgba(0,0,0,0.5)');
  
  if (styleConfig.boxShadow || glowEnabled) {
    const shadow = styleConfig.boxShadow || { x: 0, y: 0, blur: shadowBlur, color: shadowColor };
    ctx.shadowOffsetX = config.shadowOffsetX !== undefined ? config.shadowOffsetX : shadow.x;
    ctx.shadowOffsetY = config.shadowOffsetY !== undefined ? config.shadowOffsetY : shadow.y;
    ctx.shadowBlur = shadowBlur + (glowEnabled ? (glowIntensity / 5) : 0);
    ctx.shadowColor = glowEnabled ? glowColor : shadowColor;
  }

  drawBackground(ctx, styleConfig, bgX, bgY, bgWidth, bgHeight);

  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.shadowBlur = 0;

  if (styleConfig.border && styleConfig.border !== 'none') {
    drawBorder(ctx, styleConfig, bgX, bgY, bgWidth, bgHeight);
  }

  // Text shadow with user-defined values
  if (styleConfig.textShadow || glowEnabled || config.shadowIntensity > 0) {
    const shadow = styleConfig.textShadow || { x: 0, y: 0, blur: shadowBlur, color: shadowColor };
    const shadowIntensity = config.shadowIntensity || 0;
    ctx.shadowOffsetX = config.shadowOffsetX !== undefined ? config.shadowOffsetX : (shadow.x * shadowIntensity / 100);
    ctx.shadowOffsetY = config.shadowOffsetY !== undefined ? config.shadowOffsetY : (shadow.y * shadowIntensity / 100);
    ctx.shadowBlur = shadowBlur * (shadowIntensity / 100) + (glowEnabled ? (glowIntensity / 5) : 0);
    ctx.shadowColor = glowEnabled ? glowColor : shadowColor;
  }

  // Apply gradient if specified
  let fillStyle: string | CanvasGradient = config.color;
  if (config.gradientFrom && config.gradientTo) {
    const gradient = ctx.createLinearGradient(bgX, bgY, bgX + bgWidth, bgY);
    gradient.addColorStop(0, config.gradientFrom);
    gradient.addColorStop(1, config.gradientTo);
    fillStyle = gradient;
  }
  ctx.fillStyle = fillStyle;
  
  // Draw text with stroke if enabled
  if (config.strokeWidth && config.strokeWidth > 0) {
    ctx.strokeStyle = config.strokeColor || '#000000';
    ctx.lineWidth = config.strokeWidth;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.miterLimit = 2;
    
    // Draw text with letter spacing
    if (letterSpacing && letterSpacing !== 0) {
      let currentX = position.x - (textWidth / 2);
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const charWidth = ctx.measureText(char).width;
        ctx.strokeText(char, currentX + charWidth / 2, position.y);
        currentX += charWidth + (letterSpacing * fontSize / 100);
      }
    } else {
      ctx.strokeText(text, position.x, position.y);
    }
  }

  // Draw filled text with letter spacing
  if (letterSpacing && letterSpacing !== 0) {
    let currentX = position.x - (textWidth / 2);
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const charWidth = ctx.measureText(char).width;
      ctx.fillText(char, currentX + charWidth / 2, position.y);
      currentX += charWidth + (letterSpacing * fontSize / 100);
    }
  } else {
    ctx.fillText(text, position.x, position.y);
  }

  ctx.restore();
}

/**
 * Draw multiple logos with individual controls
 */
async function drawMultipleLogos(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  logos: WatermarkLogo[],
  canvasWidth: number,
  canvasHeight: number,
  faceModel?: blazeface.BlazeFaceModel | null
) {
  // Compute a base size for logos depending on how many there are.
  let baseSize = canvasWidth * (logos.length === 1 ? 0.18 : 0.12);
  const minBase = 40;
  const maxBase = Math.max(180, Math.round(canvasWidth * 0.4));
  if (baseSize < minBase) baseSize = minBase;
  if (baseSize > maxBase) baseSize = maxBase;

  // Detect faces (if model provided) so we can avoid placing logos on top of faces
  const faceBoxes: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
  if (faceModel) {
    try {
      const faces = await faceModel.estimateFaces(canvas, false);
      const resolvePoint = async (pt: any): Promise<[number, number]> => {
        if (Array.isArray(pt) && pt.length >= 2) return [pt[0], pt[1]];
        if (pt?.array) return await pt.array();
        if (pt?.dataSync) {
          const arr = pt.dataSync();
          return [arr[0], arr[1]];
        }
        return [0, 0];
      };

      for (const f of faces) {
        try {
          const [tlx, tly] = await resolvePoint(f.topLeft);
          const [brx, bry] = await resolvePoint(f.bottomRight);
          faceBoxes.push({ x1: Math.min(tlx, brx), y1: Math.min(tly, bry), x2: Math.max(tlx, brx), y2: Math.max(tly, bry) });
        } catch {
          // ignore individual face resolution errors
        }
      }
    } catch (err) {
      console.warn('Face detection for logo placement failed', err);
    }
  }

  const chosenPositions: Array<{ x: number; y: number }> = [];

  // Candidate anchor points (pixels) around the image to prefer for logos
  const candidates = [
    { x: 40, y: 40 }, // top-left
    { x: canvasWidth / 2, y: 40 }, // top-center
    { x: canvasWidth - 40, y: 40 }, // top-right
    { x: 40, y: canvasHeight / 2 }, // center-left
    { x: canvasWidth - 40, y: canvasHeight / 2 }, // center-right
    { x: 40, y: canvasHeight - 40 }, // bottom-left
    { x: canvasWidth / 2, y: canvasHeight - 40 }, // bottom-center
    { x: canvasWidth - 40, y: canvasHeight - 40 } // bottom-right
  ];

  const isSafe = (x: number, y: number) => {
    const margin = Math.max(60, Math.round(Math.min(canvasWidth, canvasHeight) * 0.06));
    // avoid faces
    for (const b of faceBoxes) {
      if (x >= b.x1 - margin && x <= b.x2 + margin && y >= b.y1 - margin && y <= b.y2 + margin) return false;
    }
    // avoid overlapping other chosen logos
    for (const p of chosenPositions) {
      const dx = p.x - x;
      const dy = p.y - y;
      if (Math.sqrt(dx * dx + dy * dy) < Math.min(baseSize, 160)) return false;
    }
    // safe
    return true;
  };

  for (const logo of logos) {
    let targetX: number | undefined;
    let targetY: number | undefined;

    // If explicit absolute position provided (>1), use it directly
    const rawX = typeof logo.position?.x === 'number' ? logo.position.x : undefined;
    const rawY = typeof logo.position?.y === 'number' ? logo.position.y : undefined;

    if (typeof rawX === 'number' && typeof rawY === 'number') {
      // If both coords look like absolute pixel values (>1), use them directly
      if (rawX > 1 || rawY > 1) {
        targetX = rawX > 1 ? rawX : rawX * canvasWidth;
        targetY = rawY > 1 ? rawY : rawY * canvasHeight;
      } else {
        // Both coords are normalized (0..1) provided by user — respect them
        targetX = Math.min(Math.max(rawX, 0.02), 0.98) * canvasWidth;
        targetY = Math.min(Math.max(rawY, 0.02), 0.98) * canvasHeight;
      }
    } else {
      // No explicit user position: try to pick a safe candidate anchor
      let found = false;
      for (const c of candidates) {
        if (isSafe(c.x, c.y)) {
          targetX = c.x;
          targetY = c.y;
          found = true;
          break;
        }
      }
      // fallback: normalized default
      if (!found) {
        const defX = typeof rawX === 'number' ? rawX : 0.9;
        const defY = typeof rawY === 'number' ? rawY : 0.9;
        targetX = Math.min(Math.max(defX, 0.02), 0.98) * canvasWidth;
        targetY = Math.min(Math.max(defY, 0.02), 0.98) * canvasHeight;
      }
    }

    // ensure we have numbers
    if (typeof targetX === 'number' && typeof targetY === 'number') {
      chosenPositions.push({ x: targetX, y: targetY });
      // pass an adjusted logo object with absolute pixel position so drawSingleLogo uses it directly
      const adjustedLogo = { ...logo, position: { x: targetX, y: targetY } } as WatermarkLogo;
      await drawSingleLogo(ctx, adjustedLogo, canvasWidth, canvasHeight, baseSize);
    } else {
      // fallback to original drawing
      await drawSingleLogo(ctx, logo, canvasWidth, canvasHeight, baseSize);
    }
  }
}

/**
 * Draw single logo with full controls
 */
function drawSingleLogo(
  ctx: CanvasRenderingContext2D,
  logo: WatermarkLogo,
  canvasWidth: number,
  canvasHeight: number,
  baseSizeOverride?: number
): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        ctx.save();

        // Calculate position. Support both normalized (0..1) and absolute pixel values (>1).
        const marginPercent = 0.04; // keep logos away from the absolute edge (4% of dimension)
        const rawX = typeof logo.position?.x === 'number' ? logo.position.x : 0.9;
        const rawY = typeof logo.position?.y === 'number' ? logo.position.y : 0.9;

        // If normalized coords (0..1), clamp them into the safe margin area
        let normX = rawX;
        let normY = rawY;
        if (rawX <= 1) normX = Math.min(1 - marginPercent, Math.max(marginPercent, rawX));
        if (rawY <= 1) normY = Math.min(1 - marginPercent, Math.max(marginPercent, rawY));

        const x = normX > 1 ? normX : normX * canvasWidth;
        const y = normY > 1 ? normY : normY * canvasHeight;

        // Calculate size (responsive). `logo.size` is percent of base size. Use override computed by caller.
        const baseSize = typeof baseSizeOverride === 'number' ? baseSizeOverride : (canvasWidth * 0.12);
        const logoSize = baseSize * ((typeof logo.size === 'number' ? logo.size : 100) / 100);

        // Apply opacity
        ctx.globalAlpha = logo.opacity / 100;

        // Apply rotation
        if (logo.rotation !== 0) {
          ctx.translate(x, y);
          ctx.rotate((logo.rotation * Math.PI) / 180);
          ctx.translate(-x, -y);
        }

        // Draw logo
        ctx.drawImage(
          img,
          x - logoSize / 2,
          y - logoSize / 2,
          logoSize,
          logoSize
        );

        ctx.restore();
        resolve();
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => reject(new Error('Failed to load logo'));
    img.src = logo.dataUrl || (logo as any).url || '';
  });
}

function drawBackground(
  ctx: CanvasRenderingContext2D,
  styleConfig: typeof STYLE_CONFIGS[WatermarkStyle],
  x: number,
  y: number,
  width: number,
  height: number
) {
  const radius = styleConfig.borderRadius;

  if (styleConfig.background.startsWith('linear-gradient')) {
    const colors = styleConfig.background.match(/rgba?\([^)]+\)/g) || [];
    if (colors.length >= 2) {
      const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
      gradient.addColorStop(0, colors[0] ?? 'rgba(0,0,0,0.5)');
      gradient.addColorStop(1, colors[1] ?? 'rgba(0,0,0,0.25)');
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    }
  } else {
    ctx.fillStyle = styleConfig.background;
  }

  if (radius > 0) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.fillRect(x, y, width, height);
  }
}

function drawBorder(
  ctx: CanvasRenderingContext2D,
  styleConfig: typeof STYLE_CONFIGS[WatermarkStyle],
  x: number,
  y: number,
  width: number,
  height: number
) {
  const borderMatch = styleConfig.border.match(/(\d+(?:\.\d+)?)px\s+(\w+)\s+(.*)/);
  if (!borderMatch) return;

  const borderWidth = parseFloat(borderMatch[1]);
  const borderStyle = borderMatch[2];
  const borderColor = borderMatch[3];
  const radius = styleConfig.borderRadius;

  ctx.strokeStyle = borderColor;
  ctx.lineWidth = borderWidth;

  if (borderStyle === 'double') {
    ctx.lineWidth = borderWidth / 3;
    drawRoundedRectPath(ctx, x, y, width, height, radius);
    ctx.stroke();
    
    const inset = borderWidth;
    drawRoundedRectPath(ctx, x + inset, y + inset, width - inset * 2, height - inset * 2, Math.max(0, radius - inset));
    ctx.stroke();
  } else {
    drawRoundedRectPath(ctx, x, y, width, height, radius);
    ctx.stroke();
  }
}

function drawRoundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

export const drawWatermarkOnCanvas = renderWatermark;