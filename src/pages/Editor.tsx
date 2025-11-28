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

import React, { useState, useRef, useEffect } from 'react';
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
  Save
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useImages } from '@/contexts/ImagesContext';
import ModernWatermarkControlsWrapper from '@/components/ModernWatermarkControlsWrapper';
import WatermarkPreview from '@/components/WatermarkPreview';
import { renderWatermark } from '@/utils/watermarkEngine';
import { FontKey, WatermarkStyle } from '@/types/watermark';

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

  const [applyAll, setApplyAll] = useState(false);
  const [watermarkText, setWatermarkText] = useState('Youth Summit 2025');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoUrls, setLogoUrls] = useState<string[]>([]);
  const [logos, setLogos] = useState<Array<{ url: string; scale?: number; x?: number; y?: number; opacity?: number; rotation?: number }>>([]);
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
  const [fontWeightState, setFontWeightState] = useState<'400'|'600'|'700'|'800'>('600');

  const [customPos, setCustomPos] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [exportQuality, setExportQuality] = useState<'hd'|'standard'|'small'>('standard');
  const [batchProgress, setBatchProgress] = useState<{ done: number; total: number }>({ done: 0, total: 0 });

  // BUG FIX #3: Calculate watermarkType correctly
  const watermarkType = React.useMemo(() => {
    const hasText = watermarkText.trim().length > 0;
    const hasLogo = logoUrl !== null || (logoUrls && logoUrls.length > 0) || (logos && logos.length > 0);
    if (hasText && hasLogo) return 'both';
    if (hasLogo) return 'logo';
    if (hasText) return 'text';
    return 'none';
  }, [watermarkText, logoUrl, logoUrls, logos]);

  const applyToCurrent = async () => {
    if (!current || processing) return;
    setProcessing(true);
    try {
      const dataUrl = await renderWatermark(
        current.url,
        {
          text: watermarkText,
          logoUrl,
             logoUrls,
             logos,
          style,
          fontFamily,
          fontWeight: fontWeightState,
          color: watermarkColor,
          size,
          opacity,
          rotation,
          position,
          aiPlacement,
          blendMode,
          shadowIntensity,
          glowEffect
        },
        {
          exposure,
          contrast,
          saturation,
          temperature
        },
        faceModelRef.current,
        customPos || undefined
      );
      updateImage(current.id, { watermarkedUrl: dataUrl });
    } catch (err) {
      console.error('Watermark failed:', err);
      alert('Failed to apply watermark. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // Apply watermark to all images; optional qualityParam lets callers request HD output
  const applyToAll = async (qualityParam: 'hd'|'standard'|'small' = 'standard') => {
    if (!images || images.length === 0 || processing) return;
    setProcessing(true);
    try {
      for (const img of images) {
        const dataUrl = await renderWatermark(
          img.url,
          {
            text: watermarkText,
            logoUrl,
               logoUrls,
               logos,
            style,
            fontFamily,
            fontWeight: fontWeightState,
            color: watermarkColor,
            size,
            opacity,
            rotation,
            position,
            aiPlacement,
            blendMode,
            shadowIntensity,
            glowEffect
          },
          {
            exposure,
            contrast,
            saturation,
            temperature
          },
          faceModelRef.current,
          customPos || undefined,
          qualityParam
        );
        updateImage(img.id, { watermarkedUrl: dataUrl });
      }
    } catch (err) {
      console.error('Batch watermark failed:', err);
      alert('Some images failed to process.');
    } finally {
      setProcessing(false);
    }
  };

  const applyToSelected = async (ids: string[], qualityParam: 'hd'|'standard'|'small' = 'standard') => {
    if (!images || ids.length === 0 || processing) return;
    setProcessing(true);
    setBatchProgress({ done: 0, total: ids.length });
    try {
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        const img = images.find(x => x.id === id);
        if (!img) continue;
        const dataUrl = await renderWatermark(
          img.url,
          {
            text: watermarkText,
            logoUrl,
            logoUrls,
            logos,
            style,
            fontFamily,
            fontWeight: fontWeightState,
            color: watermarkColor,
            size,
            opacity,
            rotation,
            position,
            aiPlacement,
            blendMode,
            shadowIntensity,
            glowEffect
          },
          {
            exposure,
            contrast,
            saturation,
            temperature
          },
          faceModelRef.current,
          customPos || undefined,
          qualityParam
        );
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

  const exportSelected = async (ids: string[], qualityParam: 'hd'|'standard'|'small' = 'standard') => {
    if (!images || ids.length === 0 || processing) return;
    setProcessing(true);
    try {
      for (const id of ids) {
        const img = images.find(x => x.id === id);
        if (!img) continue;
        // Always re-render for export so requested quality is applied to the full image
        const url = await renderWatermark(
          img.url,
          {
            text: watermarkText,
            logoUrl,
            logoUrls,
            logos,
            style,
            fontFamily,
            fontWeight: fontWeightState,
            color: watermarkColor,
            size,
            opacity,
            rotation,
            position,
            aiPlacement,
            blendMode,
            shadowIntensity,
            glowEffect
          },
          {
            exposure,
            contrast,
            saturation,
            temperature
          },
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

  const exportImages = async (all = false, qualityParam: 'hd'|'standard'|'small' = 'standard') => {
    const toExport = all ? images : (current ? [current] : []);
    for (const img of toExport) {
      try {
        // Always re-render for export to ensure requested quality applies to the full image
        const url = await renderWatermark(
          img.url,
          {
            text: watermarkText,
            logoUrl,
             logoUrls,
             logos,
            style,
            fontFamily,
            fontWeight: fontWeightState,
            color: watermarkColor,
            size,
             imageScale,
            opacity,
            rotation,
            position,
            aiPlacement,
            blendMode,
            shadowIntensity,
            glowEffect
          },
          {
            exposure,
            contrast,
            saturation,
            temperature
          },
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

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const model = await blazeface.load();
        if (!cancelled) faceModelRef.current = model;
      } catch (err) {
        console.warn('Failed to load face model', err);
      }
    })();
    return () => { cancelled = true };
  }, []);

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
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#1A7CFF] to-[#0D6EF5] text-white font-semibold shadow-[0_0_20px_rgba(26,124,255,0.4)] flex items-center gap-2"
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
              <div className="absolute inset-0 bg-gradient-to-br from-[#1A7CFF]/10 to-[#A24BFF]/5 rounded-3xl blur-2xl" />
              <div className="relative bg-[#031B2F]/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6">
                
                {/* IMAGE CONTAINER WITH WATERMARK PREVIEW */}
                <div ref={containerRef} className="relative aspect-video bg-[#0A2540] rounded-2xl overflow-hidden group">
                  {current ? (
                    <>
                      {/* BASE IMAGE WITH ADJUSTMENTS */}
                      <img
                        ref={imgRef}
                        src={current.url}
                        alt="editing"
                        className="w-full h-full object-contain"
                        onLoad={() => setPreviewImgWidth(imgRef.current?.clientWidth || 600)}
                        style={{
                          filter: `brightness(${1 + exposure / 100}) contrast(${1 + contrast / 100}) saturate(${1 + saturation / 100}) hue-rotate(${temperature * 0.3}deg)`,
                          transform: `scale(${imageScale || 1})`,
                          transformOrigin: 'center center',
                          transition: 'transform 160ms ease'
                        }}
                      />
                      
                      {/* CRITICAL FIX: WATERMARK PREVIEW OVERLAY */}
                      <WatermarkPreview
                        watermarkType={watermarkType}
                        currentUrl={current.url}
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
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 rounded-lg bg-[#0A2540] hover:bg-[#0F2F50] text-xs text-[#9FB2C8] transition-colors">
                      Fit to Screen
                    </button>
                    <button className="px-3 py-1.5 rounded-lg bg-[#0A2540] hover:bg-[#0F2F50] text-xs text-[#9FB2C8] transition-colors">
                      100%
                    </button>
                  </div>
                  <div className="text-xs text-[#9FB2C8]">
                    {watermarkType !== 'none' ? 'Watermark Active' : 'No Watermark'}
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
              <div className="absolute inset-0 bg-gradient-to-br from-[#1A7CFF]/10 to-transparent rounded-2xl blur-xl" />
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
                          ? 'bg-gradient-to-r from-[#1A7CFF] to-[#0D6EF5] text-white shadow-[0_0_20px_rgba(26,124,255,0.4)]'
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
                    imageScale={imageScale}
                    setImageScale={setImageScale}
                  />
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
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#1A7CFF] to-[#0D6EF5] text-white text-lg font-semibold shadow-[0_0_30px_rgba(26,124,255,0.4)] hover:shadow-[0_0_40px_rgba(26,124,255,0.6)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      <select value={exportQuality} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setExportQuality(e.target.value as 'hd'|'standard'|'small')} className="bg-[#0A2540] text-sm text-white px-2 py-1 rounded">
                        <option value="hd">HD</option>
                        <option value="standard">Standard</option>
                        <option value="small">Small</option>
                      </select>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <button
                        onClick={() => applyToSelected(selectedIds, exportQuality)}
                        disabled={processing || selectedIds.length === 0}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#1A7CFF] to-[#0D6EF5] text-white font-semibold"
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