// ===================================================================
// src/pages/Editor.tsx
// COMPLETE FIXED VERSION WITH ALL BUGS RESOLVED
// ===================================================================
// BUG FIXES:
// 1. Added missing WatermarkPreview component render
// 2. Fixed watermarkType calculation
// 3. Added proper conditional rendering
// 4. Fixed image adjustments preview
// ===================================================================

import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as blazeface from '@tensorflow-models/blazeface';
import '@tensorflow/tfjs';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Download,
  RotateCcw,
  Sparkles,
  Image as ImageIcon,
  Layers,
  Save,
  Palette,
  Sun,
 
  Scissors,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useImages } from '@/contexts/ImagesContext';
import ModernWatermarkControlsWrapper from '@/components/ModernWatermarkControlsWrapper';
import WatermarkPreview from '@/components/WatermarkPreview';
import { renderWatermark } from '@/utils/watermarkEngine';
import { FontKey, WatermarkStyle, WatermarkLogo, DEFAULT_ADJUSTMENTS, ExportOptions, WatermarkConfig, ImageAdjustments } from '@/types/watermark';

export default function EditorPage() {
  const { images, selectIndex, setSelectIndex, updateImage } = useImages();
  const navigate = useNavigate();
  const current = images?.[selectIndex];
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeTab, setActiveTab] = useState('watermark');
  const [opacity, setOpacity] = useState(75);
  const [size, setSize] = useState(50);
  const [position, setPosition] = useState('bottom-right');
  const [blendMode, setBlendMode] = useState('normal');
  const [shadowIntensity, setShadowIntensity] = useState(60);
  const [glowEffect, setGlowEffect] = useState(false);
  
  const [exposure, setExposure] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [highlights, setHighlights] = useState(0);
  const [shadows, setShadows] = useState(0);
  const [whites, setWhites] = useState(0);
  const [blacks, setBlacks] = useState(0);
  const [vibrance, setVibrance] = useState(0);
  const [clarity, setClarity] = useState(0);
  const [dehaze, setDehaze] = useState(0);
  const [vignette, setVignette] = useState(0);
  const [grain, setGrain] = useState(0);
  const [sharpen, setSharpen] = useState(0);
  const [tint, setTint] = useState(0);
  const [hue, setHue] = useState(0);
  type LocalFilterPreset =
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
  const [filterPreset, setFilterPreset] = useState<LocalFilterPreset>('none');

  // Bridge between component prop type (may pass undefined) and local state
  const handleSetFilterPreset = (p: ImageAdjustments['filterPreset'] | undefined) => {
    setFilterPreset(((p ?? 'none') as unknown) as LocalFilterPreset);
  };
  const [enhanceSection, setEnhanceSection] = useState<'basic'|'advanced'|'color'>('basic');

  const [applyAll, setApplyAll] = useState(false);
  const [watermarkText, setWatermarkText] = useState('Youth Summit 2025');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoUrls, setLogoUrls] = useState<string[]>([]);
  // Use canonical WatermarkLogo[] shape across the editor
  const [logos, setLogos] = useState<WatermarkLogo[]>([]);
  useEffect(() => {
    console.log('Editor logoUrl changed:', logoUrl);
  }, [logoUrl]);
  const logoInputRef = React.useRef<HTMLInputElement | null>(null);
  const [previewImgWidth, setPreviewImgWidth] = useState<number>(600);
  const [aiPlacement, setAiPlacement] = useState<boolean>(false);
  const [style, setStyle] = useState<WatermarkStyle>('modern-glass');
  const [rotation, setRotation] = useState<number>(0);
  const [imageScale, setImageScale] = useState<number>(1);
  const faceModelRef = useRef<blazeface.BlazeFaceModel | null>(null);

  const [fontFamily, setFontFamily] = useState<FontKey>('inter');
  const [watermarkColor, setWatermarkColor] = useState<string>('#FFFFFF');
  const [strokeWidth, setStrokeWidth] = useState<number>(0);
  const [strokeColor, setStrokeColor] = useState<string>('#000000');
  const [fontWeightState, setFontWeightState] = useState<'400'|'600'|'700'|'800'>('600');

  const [customPos, setCustomPos] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [useEnginePreview, setUseEnginePreview] = useState<boolean>(true);
  const [previewQuality, setPreviewQuality] = useState<'small'|'standard'|'hd'>('small');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [exportQuality, setExportQuality] = useState<'normal'|'standard'|'hd'|'ultra'>('standard');
  const [batchProgress, setBatchProgress] = useState<{ done: number; total: number }>({ done: 0, total: 0 });
  const [gradientFrom, setGradientFrom] = useState<string>('#1A7CFF');
  const [gradientTo, setGradientTo] = useState<string>('#A24BFF');

  // BUG FIX #3: Calculate watermarkType correctly
  const watermarkType = React.useMemo(() => {
    const hasText = watermarkText.trim().length > 0;
    const hasLogo = logoUrl !== null || (logoUrls && logoUrls.length > 0) || (logos && logos.length > 0);
    if (hasText && hasLogo) return 'both';
    if (hasLogo) return 'logo';
    if (hasText) return 'text';
    return 'none';
  }, [watermarkText, logoUrl, logoUrls, logos]);

  const buildConfig = useCallback((override?: Partial<WatermarkConfig>) => {
    const mappedLogos: WatermarkLogo[] = (logos || []).map((l, idx) => ({
      id: l.id || `logo-${idx}-${String(l.dataUrl || '').slice(0,8)}`,
      dataUrl: l.dataUrl || '',
      position: l.position || { x: 0.5 + idx * 0.03, y: 0.5 + idx * 0.03 },
      size: typeof l.size === 'number' ? l.size : 180,
      rotation: typeof l.rotation === 'number' ? l.rotation : 0,
      opacity: typeof l.opacity === 'number' ? l.opacity : 100
    }));

    const cfg: WatermarkConfig = {
      text: watermarkText,
      logos: mappedLogos,
      style,
      fontFamily,
      fontWeight: fontWeightState,
      color: watermarkColor,
      gradientFrom,
      gradientTo,
      size,
      opacity,
      rotation,
      position,
      aiPlacement,
      blendMode,
      shadowIntensity,
      glowEffect,
      ...override
    };
    return cfg;
  }, [watermarkText, logos, style, fontFamily, fontWeightState, watermarkColor, size, opacity, rotation, position, aiPlacement, blendMode, shadowIntensity, glowEffect, gradientFrom, gradientTo]);
  // include gradient deps

  const buildAdjustments = useCallback((): ImageAdjustments => ({
    ...DEFAULT_ADJUSTMENTS,
    exposure,
    contrast,
    saturation,
    temperature,
    highlights,
    shadows,
    whites,
    blacks,
    vibrance,
    clarity,
    dehaze,
    vignette,
    grain,
    sharpen,
    tint,
    hue,
    filterPreset
  }), [exposure, contrast, saturation, temperature, highlights, shadows, whites, blacks, vibrance, clarity, dehaze, vignette, grain, sharpen, tint, hue, filterPreset]);

  const applyToCurrent = async () => {
    if (!current || processing) return;
    setProcessing(true);
    try {
      const cfg = buildConfig();
      const adj = buildAdjustments();
      const exportOpts: ExportOptions = { quality: 'standard', format: 'jpg', watermarkEnabled: true };
      console.log('ApplyToCurrent: rendering with adjustments:', adj.filterPreset, adj);
      const dataUrl = await renderWatermark(current.url, cfg, adj, faceModelRef.current, customPos || undefined, exportOpts);
      updateImage(current.id, { watermarkedUrl: dataUrl });
    } catch (err) {
      console.error('Watermark failed:', err);
      alert('Failed to apply watermark. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // Apply only image adjustments (no watermark) to the current image and save result
  const applyEnhanceToCurrent = async () => {
    if (!current || processing) return;
    setProcessing(true);
    try {
      // Use buildConfig but strip watermarks so only image adjustments are applied
      const cfg = buildConfig({ text: '', logos: [] });
      const adj = buildAdjustments();
      const exportOpts: ExportOptions = { quality: 'standard', format: 'jpg', watermarkEnabled: false };
      console.log('ApplyEnhanceToCurrent: rendering with adjustments:', adj.filterPreset, adj);
      const dataUrl = await renderWatermark(current.url, cfg, adj, faceModelRef.current, undefined, exportOpts);
      updateImage(current.id, { watermarkedUrl: dataUrl });
    } catch (err) {
      console.error('Enhance failed:', err);
      alert('Failed to apply enhancement. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // Apply watermark to all images; optional qualityParam lets callers request HD output
  const applyToAll = async (qualityParam: 'normal'|'hd'|'standard'|'ultra' = 'standard') => {
    if (!images || images.length === 0 || processing) return;
    setProcessing(true);
    try {
      for (const img of images) {
        const cfg = buildConfig();
        const adj = buildAdjustments();
        const exportOpts: ExportOptions = { quality: qualityParam, format: qualityParam === 'hd' ? 'png' : 'jpg', watermarkEnabled: true };
        const dataUrl = await renderWatermark(img.url, cfg, adj, faceModelRef.current, customPos || undefined, exportOpts);
        updateImage(img.id, { watermarkedUrl: dataUrl });
      }
    } catch (err) {
      console.error('Batch watermark failed:', err);
      alert('Some images failed to process.');
    } finally {
      setProcessing(false);
    }
  };

  const applyToSelected = async (ids: string[], qualityParam: 'normal'|'hd'|'standard'|'ultra' = 'standard') => {
    if (!images || ids.length === 0 || processing) return;
    setProcessing(true);
    setBatchProgress({ done: 0, total: ids.length });
    try {
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        const img = images.find(x => x.id === id);
        if (!img) continue;
        const cfg = buildConfig();
        const adj = buildAdjustments();
        const exportOpts: ExportOptions = { quality: qualityParam, format: qualityParam === 'hd' ? 'png' : 'jpg', watermarkEnabled: true };
        const dataUrl = await renderWatermark(img.url, cfg, adj, faceModelRef.current, customPos || undefined, exportOpts);
        updateImage(img.id, { watermarkedUrl: dataUrl });
        setBatchProgress(prev => ({ ...prev, done: prev.done + 1 }));
      }
    } catch (err) {
      console.error('Batch watermark failed:', err);
      alert('Some images failed to process.');
    } finally {
      setProcessing(false);
      setBatchModalOpen(false);
      setBatchProgress({ done: 0, total: 0 });
    }
  };

  const exportSelected = async (ids: string[], qualityParam: 'normal'|'hd'|'standard'|'ultra' = 'standard') => {
    if (!images || ids.length === 0 || processing) return;
    setProcessing(true);
    try {
      for (const id of ids) {
        const img = images.find(x => x.id === id);
        if (!img) continue;
        // Always re-render for export so requested quality is applied to the full image
        const adj = buildAdjustments();
        const url = await renderWatermark(
          img.url,
          {
            text: watermarkText,
            logos,
            style,
            fontFamily,
            fontWeight: fontWeightState,
            color: watermarkColor,
            gradientFrom,
            gradientTo,
            size,
            opacity,
            rotation,
            position,
            aiPlacement,
            blendMode,
            shadowIntensity,
            glowEffect
          },
          adj,
          faceModelRef.current,
          customPos || undefined,
          qualityParam
        );

        const a = document.createElement('a');
        a.href = url;
        const baseName = img.file?.name ? img.file.name.replace(/\.[^/.]+$/, '') : 'image';
        const isPng = qualityParam === 'hd' || url.startsWith('data:image/png');
        a.download = `${baseName}-watermarked.${isPng ? 'png' : 'jpg'}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch (err) {
      console.warn('Failed to export selected', err);
    } finally {
      setProcessing(false);
      setBatchModalOpen(false);
    }
  };

  const exportImages = async (all = false, qualityParam: 'normal'|'hd'|'standard'|'ultra' = 'standard') => {
    const toExport = all ? images : (current ? [current] : []);
    for (const img of toExport) {
      try {
          // Always re-render for export to ensure requested quality applies to the full image
          const cfg = buildConfig();
        const adj = buildAdjustments();
        const exportOpts: ExportOptions = { quality: qualityParam, format: qualityParam === 'hd' ? 'png' : 'jpg', watermarkEnabled: true };
        const cfgWithGradient = { ...cfg, gradientFrom, gradientTo };
        const url = await renderWatermark(img.url, cfgWithGradient, adj, faceModelRef.current, customPos || undefined, exportOpts);

        const a = document.createElement('a');
        a.href = url;
        const baseName = img.file?.name ? img.file.name.replace(/\.[^/.]+$/, '') : 'image';
        const isPng = qualityParam === 'hd' || url.startsWith('data:image/png');
        a.download = `${baseName}-watermarked.${isPng ? 'png' : 'jpg'}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } catch (err) {
        console.warn('Failed to export', img.id, err);
      }
    }
  };

  useEffect(() => {
    if (!current) return;
    const update = () => setPreviewImgWidth(imgRef.current?.clientWidth || 600);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [current]);

  // Debounced preview render for Enhance panel (renders adjustments onto a smaller preview)
  useEffect(() => {
    if (!current) {
      setPreviewDataUrl(null);
      return;
    }

    // Only generate preview when user has engine preview enabled and is in Enhance tab or when adjustments exist
    const adjustmentsExist = [exposure, contrast, saturation, temperature, highlights, shadows, vibrance, clarity, dehaze, vignette, grain, sharpen, tint, hue].some(v => v !== 0) || filterPreset !== 'none';
    const shouldPreview = useEnginePreview && (activeTab === 'enhance' || adjustmentsExist);
    if (!shouldPreview) {
      setPreviewDataUrl(null);
      return;
    }

    let cancelled = false;
    let lastUrl: string | null = null;
    const id = setTimeout(async () => {
      try {
        const cfg = buildConfig({ text: '', logos: [] });
        const adj = buildAdjustments();
        // use legacy small preview for speed
        // Map previewQuality to engine parameters (legacy string or ExportOptions)
        let qualityParam: ExportOptions | 'hd' | 'standard' | 'small' | 'ultra' = 'small';
        if (previewQuality === 'small') qualityParam = 'small';
        else if (previewQuality === 'standard') qualityParam = 'standard';
        else qualityParam = 'hd';

        const dataUrl = await renderWatermark(current.url, cfg, adj, faceModelRef.current, undefined, qualityParam);
        if (!cancelled) {
          try {
            // Revoke previous preview blob URL to avoid accumulating memory
            if (lastUrl && lastUrl.startsWith('blob:')) URL.revokeObjectURL(lastUrl);
          } catch (err) {
            console.debug('revoking previous preview URL failed', err);
          }
          lastUrl = dataUrl;
          setPreviewDataUrl(dataUrl);
        }
      } catch (err) {
        console.warn('Preview render failed', err);
      }
    }, 350);

    return () => {
      cancelled = true;
      clearTimeout(id);
      try { if (lastUrl && lastUrl.startsWith('blob:')) URL.revokeObjectURL(lastUrl); } catch (err) { console.debug('revoking preview URL failed', err); }
    };
  }, [current, activeTab, exposure, contrast, saturation, temperature, highlights, shadows, whites, blacks, vibrance, clarity, dehaze, vignette, grain, sharpen, tint, hue, filterPreset, buildConfig, buildAdjustments, useEnginePreview, previewQuality]);

  // Lazy-load face model only when AI placement is enabled to avoid loading heavy TFJS code eagerly
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!aiPlacement) {
        // If user disabled AI placement, dispose model to free memory
        try {
          const m = (faceModelRef.current as unknown) as { dispose?: () => void } | null;
          if (m && typeof m.dispose === 'function') m.dispose();
        } catch (err) {
          console.debug('disposing face model failed', err);
        }
        faceModelRef.current = null;
        return;
      }

      try {
        const model = await blazeface.load();
        if (!cancelled) faceModelRef.current = model;
      } catch (err) {
        console.warn('Failed to load face model', err);
      }
    })();
    return () => { cancelled = true };
  }, [aiPlacement]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#000913]">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-20 bg-[#031B2F]/80 backdrop-blur-xl border-b border-white/5"
      >
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-xl bg-[#0A2540]/50 hover:bg-[#0F2F50] border border-white/5 transition-colors"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="w-5 h-5 text-[#F4F8FF]" />
              </motion.button>
              <div>
                <h1 className="text-xl font-bold text-[#F4F8FF]">Image Editor</h1>
                <p className="text-sm text-[#9FB2C8]">
                  {current?.file?.name ?? 'No image'} • Image {images?.length ? selectIndex + 1 : 0} of {images?.length ?? 0}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-xl bg-[#0A2540]/50 hover:bg-[#0F2F50] border border-white/5 text-[#F4F8FF] font-medium transition-colors flex items-center gap-2"
                onClick={() => {
                  setExposure(0);
                  setContrast(0);
                  setSaturation(0);
                  setTemperature(0);
                }}
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-xl bg-linear-to-r from-[#1A7CFF] to-[#0D6EF5] text-white font-semibold shadow-[0_0_20px_rgba(26,124,255,0.4)] flex items-center gap-2"
                onClick={() => applyToCurrent()}
              >
                <Save className="w-4 h-4" />
                Save
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="relative z-10 max-w-[1800px] mx-auto px-6 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* LEFT SIDE - IMAGE PREVIEW */}
          <div className="xl:col-span-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-linear-to-br from-[#1A7CFF]/10 to-[#A24BFF]/5 rounded-3xl blur-2xl" />
              <div className="relative bg-[#031B2F]/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6">
                
                {/* IMAGE CONTAINER WITH WATERMARK PREVIEW */}
                <div ref={containerRef} className="relative aspect-video bg-[#0A2540] rounded-2xl overflow-hidden group">
                  {current ? (
                    <>
                      {/* BASE IMAGE WITH ADJUSTMENTS */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <img
                          ref={imgRef}
                          src={(useEnginePreview && activeTab === 'enhance' && previewDataUrl) ? previewDataUrl : current.url}
                          alt="editing"
                          onLoad={() => setPreviewImgWidth(imgRef.current?.clientWidth || 600)}
                          style={{
                            // When we're showing an engine-generated preview (`previewDataUrl`),
                            // the image already contains the adjustments baked in. Avoid applying
                            // the inline CSS filter again to prevent double-processing (appears
                            // too bright or otherwise incorrect compared to the exported image).
                            filter: (useEnginePreview && activeTab === 'enhance' && previewDataUrl)
                              ? undefined
                              : `brightness(${1 + exposure / 100}) contrast(${1 + contrast / 100}) saturate(${1 + saturation / 100}) hue-rotate(${temperature * 0.3}deg)`,
                            width: `${(imageScale || 1) * 100}%`,
                            height: 'auto',
                            maxHeight: '100%',
                            objectFit: 'contain',
                            transition: 'width 160ms ease'
                          }}
                        />
                      </div>
                      
                      {/* CRITICAL FIX: WATERMARK PREVIEW OVERLAY */}
                      <WatermarkPreview
                        watermarkType={watermarkType}
                        currentUrl={(useEnginePreview && activeTab === 'enhance' && previewDataUrl) ? previewDataUrl : current.url}
                        faceModelRef={faceModelRef}
                        watermarkText={watermarkText}
                        logoUrl={logoUrl}
                        logoUrls={logoUrls}
                        logos={logos}
                        setLogos={setLogos}
                        imageScale={imageScale}
                        previewImgWidth={previewImgWidth}
                        size={size}
                        watermarkColor={watermarkColor}
                        fontWeightState={fontWeightState}
                        fontFamily={fontFamily}
                        style={style}
                        rotation={rotation}
                        adaptiveBlend={false}
                        glowEffect={glowEffect}
                        position={position}
                        customPos={customPos}
                        setCustomPos={setCustomPos}
                        setIsDragging={setIsDragging}
                        isDragging={isDragging}
                        setPosition={setPosition}
                        containerRef={containerRef}
                        blendMode={blendMode}
                        opacity={opacity}
                        strokeWidth={strokeWidth}
                        strokeColor={strokeColor}
                      />
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <ImageIcon className="w-16 h-16 text-[#9FB2C8]/30 mx-auto mb-4" />
                        <p className="text-[#9FB2C8]/50">Your image will appear here</p>
                      </div>
                    </div>
                  )}
                  <canvas ref={canvasRef} className="hidden" />
                  
                  {/* IMAGE NAVIGATION */}
                  {images && images.length > 1 && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-between px-4 z-40">
                      <button
                        onClick={() => setSelectIndex(Math.max(0, selectIndex - 1))}
                        disabled={selectIndex === 0}
                        className="pointer-events-auto p-3 rounded-full bg-[#000000]/60 hover:bg-[#000000]/80 text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        ◀
                      </button>
                      <button
                        onClick={() => setSelectIndex(Math.min(images.length - 1, selectIndex + 1))}
                        disabled={selectIndex === images.length - 1}
                        className="pointer-events-auto p-3 rounded-full bg-[#000000]/60 hover:bg-[#000000]/80 text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        ▶
                      </button>
                    </div>
                  )}

                  {/* GRID OVERLAY ON HOVER */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                      {[...Array(9)].map((_, i) => (
                        <div key={i} className="border border-white/10" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* PREVIEW CONTROLS */}
                <div className="mt-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setImageScale(prev => Math.max(0.2, +(prev - 0.1).toFixed(2)))}
                      className="px-3 py-1.5 rounded-lg bg-[#0A2540] hover:bg-[#0F2F50] text-xs text-[#9FB2C8] transition-colors"
                    >-</button>
                    <input
                      type="range"
                      min={0.2}
                      max={2}
                      step={0.01}
                      value={imageScale}
                      onChange={(e) => setImageScale(Number(e.target.value))}
                      className="w-44"
                    />
                    <button
                      onClick={() => setImageScale(prev => Math.min(2, +(prev + 0.1).toFixed(2)))}
                      className="px-3 py-1.5 rounded-lg bg-[#0A2540] hover:bg-[#0F2F50] text-xs text-[#9FB2C8] transition-colors"
                    >+</button>
                    <div className="text-xs text-[#9FB2C8] ml-2">{Math.round(imageScale * 100)}%</div>
                    <button
                      onClick={() => setImageScale(1)}
                      className="ml-2 px-3 py-1.5 rounded-lg bg-[#0A2540] hover:bg-[#0F2F50] text-xs text-[#9FB2C8] transition-colors"
                    >Reset</button>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-xs text-[#9FB2C8]">
                      <input type="checkbox" checked={useEnginePreview} onChange={(e) => setUseEnginePreview(e.target.checked)} className="w-4 h-4" />
                      Engine Preview
                    </label>

                    <select value={previewQuality} onChange={(e) => setPreviewQuality(e.target.value as 'small'|'standard'|'hd')} className="bg-[#0A2540] text-xs text-white px-2 py-1 rounded">
                      <option value="small">Preview: Small</option>
                      <option value="standard">Preview: Medium</option>
                      <option value="hd">Preview: Full</option>
                    </select>

                    <div className="text-xs text-[#9FB2C8]">
                      {watermarkType !== 'none' ? 'Watermark Active' : 'No Watermark'}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT SIDE - CONTROLS */}
          <div className="space-y-4">
            {/* TAB SELECTOR */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-linear-to-br from-[#1A7CFF]/10 to-transparent rounded-2xl blur-xl" />
              <div className="relative bg-[#031B2F]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'watermark', label: 'Watermark', icon: Layers },
                    { id: 'enhance', label: 'Enhance', icon: Sparkles }
                  ].map((tab) => (
                    <motion.button
                      key={tab.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative px-4 py-3 rounded-xl font-medium transition-all ${
                        activeTab === tab.id
                          ? 'bg-linear-to-r from-[#1A7CFF] to-[#0D6EF5] text-white shadow-[0_0_20px_rgba(26,124,255,0.4)]'
                          : 'text-[#9FB2C8] hover:text-[#F4F8FF]'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <tab.icon className="w-4 h-4" />
                        <span className="text-sm">{tab.label}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* WATERMARK CONTROLS */}
            <AnimatePresence mode="wait">
              {activeTab === 'watermark' && (
                <motion.div
                  key="watermark"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <ModernWatermarkControlsWrapper
                    watermarkText={watermarkText}
                    setWatermarkText={setWatermarkText}
                    logoUrl={logoUrl}
                    logoUrls={logoUrls}
                    logos={logos}
                    setLogoUrl={setLogoUrl}
                    setLogoUrls={setLogoUrls}
                    setLogos={setLogos}
                    logoInputRef={logoInputRef}
                    style={style}
                    setStyle={setStyle}
                    fontFamily={fontFamily}
                    setFontFamily={setFontFamily}
                    fontWeight={fontWeightState}
                    setFontWeight={setFontWeightState}
                    color={watermarkColor}
                    setColor={setWatermarkColor}
                    size={size}
                    setSize={setSize}
                    opacity={opacity}
                    setOpacity={setOpacity}
                    rotation={rotation}
                    setRotation={setRotation}
                    position={position}
                    setPosition={setPosition}
                    aiPlacement={aiPlacement}
                    setAiPlacement={setAiPlacement}
                    blendMode={blendMode}
                    setBlendMode={setBlendMode}
                    shadowIntensity={shadowIntensity}
                    setShadowIntensity={setShadowIntensity}
                    glowEffect={glowEffect}
                    setGlowEffect={setGlowEffect}
                    exposure={exposure}
                    setExposure={setExposure}
                    contrast={contrast}
                    setContrast={setContrast}
                    saturation={saturation}
                    setSaturation={setSaturation}
                    temperature={temperature}
                    setTemperature={setTemperature}
                    highlights={highlights}
                    setHighlights={setHighlights}
                    shadows={shadows}
                    setShadows={setShadows}
                    whites={whites}
                    setWhites={setWhites}
                    blacks={blacks}
                    setBlacks={setBlacks}
                    vibrance={vibrance}
                    setVibrance={setVibrance}
                    clarity={clarity}
                    setClarity={setClarity}
                    dehaze={dehaze}
                    setDehaze={setDehaze}
                    vignette={vignette}
                    setVignette={setVignette}
                    grain={grain}
                    setGrain={setGrain}
                    sharpen={sharpen}
                    setSharpen={setSharpen}
                    tint={tint}
                    setTint={setTint}
                    hue={hue}
                    setHue={setHue}
                    filterPreset={filterPreset}
                    setFilterPreset={handleSetFilterPreset}
                    gradientFrom={gradientFrom}
                    setGradientFrom={setGradientFrom}
                    gradientTo={gradientTo}
                    setGradientTo={setGradientTo}
                    imageScale={imageScale}
                    setImageScale={setImageScale}
                    strokeWidth={strokeWidth}
                    setStrokeWidth={setStrokeWidth}
                    strokeColor={strokeColor}
                    setStrokeColor={setStrokeColor}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* ENHANCE CONTROLS */}
            <AnimatePresence mode="wait">
              {activeTab === 'enhance' && (
                <motion.div
                  key="enhance"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-linear-to-br from-[#1A7CFF]/10 to-transparent rounded-2xl blur-xl" />
                    <div className="relative bg-[#031B2F]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 space-y-4">
                      <h3 className="text-sm font-bold text-[#F4F8FF] uppercase tracking-wide flex items-center gap-2">
                        <Palette className="w-4 h-4 text-[#1A7CFF]" />
                        Image Editing
                      </h3>

                      {/* Filter Presets */}
                      <div>
                        <label className="text-xs font-medium text-[#9FB2C8] mb-2 block">Quick Filters</label>
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            { id: 'none', label: 'Original', emoji: '🟦' },
                            { id: 'vivid', label: 'Vivid', emoji: '✨' },
                            { id: 'dramatic', label: 'Dramatic', emoji: '🎭' },
                            { id: 'warm', label: 'Warm', emoji: '🌅' },
                            { id: 'cool', label: 'Cool', emoji: '❄️' },
                            { id: 'vintage', label: 'Vintage', emoji: '📼' },
                            { id: 'bw', label: 'B&W', emoji: '⚪️' },
                            // Professional / Additional presets
                            { id: 'cinematic', label: 'Cinematic', emoji: '🎬' },
                            { id: 'portrait', label: 'Portrait', emoji: '💁‍♀️' },
                            { id: 'hdr', label: 'HDR', emoji: '🌈' },
                            { id: 'matte', label: 'Matte', emoji: '🪄' },
                            { id: 'film', label: 'Film', emoji: '🎞️' },
                            { id: 'moody', label: 'Moody', emoji: '🌒' },
                            { id: 'pro', label: 'Pro', emoji: '📸' },
                            // Creative presets from FILTERS
                            { id: 'golden-hour', label: 'Golden Hour', emoji: '🌇' },
                            { id: 'magazine-cover', label: 'Magazine', emoji: '📰' },
                            { id: 'teal-orange', label: 'Teal & Orange', emoji: '🟦🟧' },
                            { id: 'fashion-editorial', label: 'Fashion', emoji: '👗' },
                            { id: 'neon-pop', label: 'Neon Pop', emoji: '💡' },
                            { id: 'cyberpunk', label: 'Cyberpunk', emoji: '🤖' },
                            { id: 'tropical-vibes', label: 'Tropical', emoji: '🌴' },
                            { id: 'ocean-depth', label: 'Ocean', emoji: '🌊' },
                            { id: 'autumn-warmth', label: 'Autumn', emoji: '🍂' },
                            { id: 'sunset-glow', label: 'Sunset', emoji: '🌇' },
                            { id: 'luxury-gold', label: 'Luxury Gold', emoji: '🥇' },
                            { id: 'arctic-blue', label: 'Arctic Blue', emoji: '🧊' },
                            { id: 'nordic-minimal', label: 'Nordic', emoji: '❄️' },
                            { id: 'pastel-dream', label: 'Pastel', emoji: '🌸' },
                            { id: 'urban-grit', label: 'Urban Grit', emoji: '🏙️' }
                          ].map((filter) => (
                            <button
                              key={filter.id}
                              onClick={() => setFilterPreset(filter.id as LocalFilterPreset)}
                              title={filter.label}
                              className={`p-2 rounded-lg transition-all flex flex-col items-center justify-center gap-1 ${filterPreset === filter.id ? 'bg-linear-to-br from-[#1A7CFF]/30 to-[#A24BFF]/20 border-2 border-[#1A7CFF]' : 'bg-[#0A2540]/50 border border-white/5'}`}>
                              <div className="text-[16px] leading-none">{filter.emoji}</div>
                              <div className="text-[10px] font-medium text-[#9FB2C8]">{filter.label}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Section Tabs */}
                      <div className="flex gap-1 p-1 bg-[#0A2540]/50 rounded-lg">
                        {[
                          { id: 'basic', label: 'Basic', icon: Sun },
                          { id: 'advanced', label: 'Advanced', icon: Scissors },
                          { id: 'color', label: 'Color', icon: Palette }
                        ].map((tab) => {
                          type IconType = (props: React.SVGProps<SVGSVGElement>) => React.ReactElement | null;
                          const IconComp = tab.icon as IconType;
                          return (
                            <button
                              key={tab.id}
                              onClick={() => setEnhanceSection(tab.id as 'basic'|'advanced'|'color')}
                              className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-2 ${enhanceSection === tab.id ? 'bg-[#1A7CFF] text-white' : 'text-[#9FB2C8] hover:text-[#F4F8FF]'}`}>
                              <IconComp className="w-3 h-3" />
                              <span>{tab.label}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Section Panels */}
                      {enhanceSection === 'basic' && (
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <label className="text-sm text-[#F4F8FF] font-medium">Exposure</label>
                            <input type="range" min={-100} max={100} value={exposure} onChange={(e) => setExposure(Number(e.target.value))} className="w-full" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm text-[#F4F8FF] font-medium">Contrast</label>
                            <input type="range" min={-100} max={100} value={contrast} onChange={(e) => setContrast(Number(e.target.value))} className="w-full" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm text-[#F4F8FF] font-medium">Saturation</label>
                            <input type="range" min={-100} max={100} value={saturation} onChange={(e) => setSaturation(Number(e.target.value))} className="w-full" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm text-[#F4F8FF] font-medium">Temperature</label>
                            <input type="range" min={-100} max={100} value={temperature} onChange={(e) => setTemperature(Number(e.target.value))} className="w-full" />
                          </div>
                        </div>
                      )}

                      {enhanceSection === 'advanced' && (
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <label className="text-sm text-[#F4F8FF] font-medium">Highlights</label>
                            <input type="range" min={-100} max={100} value={highlights} onChange={(e) => setHighlights(Number(e.target.value))} className="w-full" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm text-[#F4F8FF] font-medium">Shadows</label>
                            <input type="range" min={-100} max={100} value={shadows} onChange={(e) => setShadows(Number(e.target.value))} className="w-full" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm text-[#F4F8FF] font-medium">Clarity</label>
                            <input type="range" min={-100} max={100} value={clarity} onChange={(e) => setClarity(Number(e.target.value))} className="w-full" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm text-[#F4F8FF] font-medium">Sharpen</label>
                            <input type="range" min={0} max={100} value={sharpen} onChange={(e) => setSharpen(Number(e.target.value))} className="w-full" />
                          </div>
                        </div>
                      )}

                      {enhanceSection === 'color' && (
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <label className="text-sm text-[#F4F8FF] font-medium">Vibrance</label>
                            <input type="range" min={-100} max={100} value={vibrance} onChange={(e) => setVibrance(Number(e.target.value))} className="w-full" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm text-[#F4F8FF] font-medium">Dehaze</label>
                            <input type="range" min={0} max={100} value={dehaze} onChange={(e) => setDehaze(Number(e.target.value))} className="w-full" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm text-[#F4F8FF] font-medium">Vignette</label>
                            <input type="range" min={-100} max={100} value={vignette} onChange={(e) => setVignette(Number(e.target.value))} className="w-full" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm text-[#F4F8FF] font-medium">Grain</label>
                            <input type="range" min={0} max={100} value={grain} onChange={(e) => setGrain(Number(e.target.value))} className="w-full" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm text-[#F4F8FF] font-medium">Tint</label>
                            <input type="range" min={-100} max={100} value={tint} onChange={(e) => setTint(Number(e.target.value))} className="w-full" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm text-[#F4F8FF] font-medium">Hue</label>
                            <input type="range" min={-180} max={180} value={hue} onChange={(e) => setHue(Number(e.target.value))} className="w-full" />
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            setExposure(0);
                            setContrast(0);
                            setSaturation(0);
                            setTemperature(0);
                            setHighlights(0);
                            setShadows(0);
                            setWhites(0);
                            setBlacks(0);
                            setVibrance(0);
                            setClarity(0);
                            setDehaze(0);
                            setVignette(0);
                            setGrain(0);
                            setSharpen(0);
                            setTint(0);
                            setHue(0);
                            setFilterPreset('none');
                          }}
                          className="px-3 py-2 rounded-lg bg-[#0A2540] text-sm text-[#9FB2C8]"
                        >Reset Adjustments</button>

                        <div className="ml-auto flex items-center gap-2">
                          <button
                            onClick={async () => {
                              if (applyAll) {
                                for (const img of images) {
                                  if (!img) continue;
                                  const cfg = buildConfig({ text: '', logos: [] });
                                  const adj = buildAdjustments();
                                  const exportOpts: ExportOptions = { quality: 'standard', format: 'jpg', watermarkEnabled: false };
                                  const dataUrl = await renderWatermark(img.url, cfg, adj, faceModelRef.current, undefined, exportOpts);
                                  updateImage(img.id, { watermarkedUrl: dataUrl });
                                }
                              } else {
                                await applyEnhanceToCurrent();
                              }
                            }}
                            disabled={processing || !current}
                            className="px-4 py-2 rounded-lg bg-linear-to-r from-[#1A7CFF] to-[#0D6EF5] text-white font-semibold"
                          >{processing ? 'Applying...' : applyAll ? 'Apply Enhancements to All' : 'Apply Enhancement'}</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* APPLY OPTIONS */}
            <div className="flex items-center gap-3 px-2">
              <label className="flex items-center gap-2 text-sm text-[#9FB2C8] cursor-pointer">
                <input
                  type="checkbox"
                  checked={applyAll}
                  onChange={(e) => setApplyAll(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-[#0A2540] text-[#1A7CFF] focus:ring-[#1A7CFF] focus:ring-offset-0"
                />
                Apply to all {images?.length || 0} images
              </label>
              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={() => setBatchModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-[#0A2540] hover:bg-[#0F2F50] text-xs text-[#9FB2C8] transition-colors"
                >
                  Select Images
                </button>
              </div>
            </div>
            
            {/* EXPORT BUTTON */}
            <motion.button
              whileHover={{ scale: processing ? 1 : 1.02 }}
              whileTap={{ scale: processing ? 1 : 0.98 }}
              disabled={processing || !current}
              className="w-full py-4 rounded-2xl bg-linear-to-r from-[#1A7CFF] to-[#0D6EF5] text-white text-lg font-semibold shadow-[0_0_30px_rgba(26,124,255,0.4)] hover:shadow-[0_0_40px_rgba(26,124,255,0.6)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={async () => {
                if (applyAll) {
                  // apply to all at the selected export quality, then export at that quality
                  await applyToAll(exportQuality);
                  await exportImages(true, exportQuality);
                } else {
                  await applyToCurrent();
                  await exportImages(false, exportQuality);
                }
              }}
            >
              <Download className="w-5 h-5" />
              {processing ? 'Processing...' : applyAll ? 'Apply & Export All' : 'Apply & Export'}
            </motion.button>
            {/* Batch modal */}
            {batchModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/60" onClick={() => setBatchModalOpen(false)} />
                <div className="relative z-60 bg-[#02121b] border border-white/5 rounded-2xl p-6 w-[90%] max-w-2xl">
                  <h3 className="text-lg font-semibold text-white mb-3">Select images to process</h3>
                  <div className="mb-3 flex items-center gap-2">
                    <button
                      onClick={() => setSelectedIds(images.map(i => i.id))}
                      className="px-3 py-1 rounded bg-[#0A2540] text-sm text-[#9FB2C8]"
                    >Select All</button>
                    <button
                      onClick={() => setSelectedIds([])}
                      className="px-3 py-1 rounded bg-[#0A2540] text-sm text-[#9FB2C8]"
                    >Clear</button>
                    <div className="ml-auto text-sm text-[#9FB2C8]">Progress: {batchProgress.done}/{batchProgress.total}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 max-h-60 overflow-auto mb-4">
                    {images.map(img => (
                      <label key={img.id} className="flex items-center gap-2 p-2 rounded hover:bg-[#071726]/60">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(img.id)}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedIds(prev => [...prev, img.id]);
                            else setSelectedIds(prev => prev.filter(id => id !== img.id));
                          }}
                          className="w-4 h-4"
                        />
                        <img src={img.url} alt={img.file?.name || img.id} className="w-14 h-10 object-cover rounded" />
                        <div className="text-sm text-[#9FB2C8] truncate">{img.file?.name || img.id}</div>
                      </label>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-[#9FB2C8]">Quality:</label>
                      <select value={exportQuality} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setExportQuality(e.target.value as 'normal'|'standard'|'hd'|'ultra')} className="bg-[#0A2540] text-sm text-white px-2 py-1 rounded">
                        <option value="normal">Normal</option>
                        <option value="standard">Standard</option>
                        <option value="hd">HD</option>
                        <option value="ultra">Ultra</option>
                      </select>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <button
                        onClick={() => applyToSelected(selectedIds, exportQuality)}
                        disabled={processing || selectedIds.length === 0}
                        className="px-4 py-2 rounded-lg bg-linear-to-r from-[#1A7CFF] to-[#0D6EF5] text-white font-semibold"
                      >Apply to selected</button>
                      <button
                        onClick={() => exportSelected(selectedIds, exportQuality)}
                        disabled={processing || selectedIds.length === 0}
                        className="px-4 py-2 rounded-lg bg-[#0A2540] text-white"
                      >Export selected</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}