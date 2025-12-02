import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
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
import JSZip from 'jszip';
import { ArrowLeft, Download, RotateCcw, Sparkles, Image as ImageIcon, Layers, Save, Palette, Sun, Scissors, X, FileArchive, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useImages } from '@/contexts/ImagesContext';
import ModernWatermarkControlsWrapper from '@/components/ModernWatermarkControlsWrapper';
import WatermarkPreview from '@/components/WatermarkPreview';
import { renderWatermark } from '@/utils/watermarkEngine';
import { getFilterString } from '@/utils/filterString';
import { DEFAULT_ADJUSTMENTS } from '@/types/watermark';
export default function EditorPage() {
    const { images, selectIndex, setSelectIndex, updateImage } = useImages();
    const navigate = useNavigate();
    const current = images?.[selectIndex];
    const canvasRef = useRef(null);
    const imgRef = useRef(null);
    const containerRef = useRef(null);
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
    const [filterPreset, setFilterPreset] = useState('none');
    // Bridge between component prop type (may pass undefined) and local state
    const handleSetFilterPreset = (p) => {
        setFilterPreset((p ?? 'none'));
    };
    const [enhanceSection, setEnhanceSection] = useState('basic');
    const [applyAll, setApplyAll] = useState(false);
    const [watermarkText, setWatermarkText] = useState('Youth Summit 2025');
    const [logoUrl, setLogoUrl] = useState(null);
    const [logoUrls, setLogoUrls] = useState([]);
    // Use canonical WatermarkLogo[] shape across the editor
    const [logos, setLogos] = useState([]);
    useEffect(() => {
        console.log('Editor logoUrl changed:', logoUrl);
    }, [logoUrl]);
    const logoInputRef = React.useRef(null);
    const [previewImgWidth, setPreviewImgWidth] = useState(600);
    const [aiPlacement, setAiPlacement] = useState(false);
    const [style, setStyle] = useState('modern-glass');
    const [rotation, setRotation] = useState(0);
    const [imageScale, setImageScale] = useState(1);
    const faceModelRef = useRef(null);
    const [fontFamily, setFontFamily] = useState('inter');
    const [watermarkColor, setWatermarkColor] = useState('#FFFFFF');
    const [strokeWidth, setStrokeWidth] = useState(0);
    const [strokeColor, setStrokeColor] = useState('#000000');
    const [fontWeightState, setFontWeightState] = useState('600');
    const [customPos, setCustomPos] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    // Placement history (undo stack) for watermark position and logos
    const [, setPlacementHistory] = useState([]);
    const MAX_HISTORY = 30;
    const [processing, setProcessing] = useState(false);
    const [previewDataUrl, setPreviewDataUrl] = useState(null);
    const [useEnginePreview, setUseEnginePreview] = useState(true);
    const [previewQuality, setPreviewQuality] = useState('small');
    const [previewFullscreen, setPreviewFullscreen] = useState(false);
    // Ref used to request the preview component flush any pending pointer positions
    const placementFlushRef = useRef(null);
    const fullscreenContainerRef = useRef(null);
    // Close fullscreen on Escape for easier mobile/keyboard dismissal
    useEffect(() => {
        if (!previewFullscreen)
            return;
        const onKey = (e) => { if (e.key === 'Escape')
            setPreviewFullscreen(false); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [previewFullscreen]);
    // On mobile, prefer inline/CSS preview for responsiveness and default to smaller preview quality
    useEffect(() => {
        try {
            if (window.innerWidth < 900) {
                setUseEnginePreview(false);
                setPreviewQuality('small');
            }
        }
        catch (err) {
            console.debug('mobile preview default check failed', err);
        }
    }, []);
    const [selectedIds, setSelectedIds] = useState([]);
    const [batchModalOpen, setBatchModalOpen] = useState(false);
    const [showShortcuts, setShowShortcuts] = useState(false);
    const [exportQuality, setExportQuality] = useState('standard');
    const [batchProgress, setBatchProgress] = useState({ done: 0, total: 0 });
    const [gradientFrom, setGradientFrom] = useState('#1A7CFF');
    const [gradientTo, setGradientTo] = useState('#A24BFF');
    // BUG FIX #3: Calculate watermarkType correctly
    const watermarkType = React.useMemo(() => {
        const hasText = watermarkText.trim().length > 0;
        const hasLogo = logoUrl !== null || (logoUrls && logoUrls.length > 0) || (logos && logos.length > 0);
        if (hasText && hasLogo)
            return 'both';
        if (hasLogo)
            return 'logo';
        if (hasText)
            return 'text';
        return 'none';
    }, [watermarkText, logoUrl, logoUrls, logos]);
    const buildConfig = useCallback((override) => {
        const mappedLogos = (logos || []).map((l, idx) => ({
            id: l.id || `logo-${idx}-${String(l.dataUrl || '').slice(0, 8)}`,
            dataUrl: l.dataUrl || '',
            position: l.position || { x: 0.5 + idx * 0.03, y: 0.5 + idx * 0.03 },
            size: typeof l.size === 'number' ? l.size : 180,
            rotation: typeof l.rotation === 'number' ? l.rotation : 0,
            opacity: typeof l.opacity === 'number' ? l.opacity : 100
        }));
        const cfg = {
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
    const buildAdjustments = useCallback(() => ({
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
        if (!current || processing)
            return;
        setProcessing(true);
        try {
            const cfg = buildConfig();
            const adj = buildAdjustments();
            const exportOpts = { quality: 'standard', format: 'jpg', watermarkEnabled: true };
            console.log('ApplyToCurrent: rendering with adjustments:', adj.filterPreset, adj);
            const dataUrl = await renderWatermark(current.url, cfg, adj, faceModelRef.current, customPos || undefined, exportOpts);
            updateImage(current.id, { watermarkedUrl: dataUrl });
        }
        catch (err) {
            console.error('Watermark failed:', err);
            alert('Failed to apply watermark. Please try again.');
        }
        finally {
            setProcessing(false);
        }
    };
    // Apply only image adjustments (no watermark) to the current image and save result
    const applyEnhanceToCurrent = async () => {
        if (!current || processing)
            return;
        setProcessing(true);
        try {
            // Use buildConfig but strip watermarks so only image adjustments are applied
            const cfg = buildConfig({ text: '', logos: [] });
            const adj = buildAdjustments();
            const exportOpts = { quality: 'standard', format: 'jpg', watermarkEnabled: false };
            console.log('ApplyEnhanceToCurrent: rendering with adjustments:', adj.filterPreset, adj);
            const dataUrl = await renderWatermark(current.url, cfg, adj, faceModelRef.current, undefined, exportOpts);
            updateImage(current.id, { watermarkedUrl: dataUrl });
        }
        catch (err) {
            console.error('Enhance failed:', err);
            alert('Failed to apply enhancement. Please try again.');
        }
        finally {
            setProcessing(false);
        }
    };
    // Apply watermark to all images; optional qualityParam lets callers request HD output
    const applyToAll = async (qualityParam = 'standard') => {
        if (!images || images.length === 0 || processing)
            return;
        setProcessing(true);
        try {
            for (const img of images) {
                const cfg = buildConfig();
                const adj = buildAdjustments();
                const exportOpts = { quality: qualityParam, format: qualityParam === 'hd' ? 'png' : 'jpg', watermarkEnabled: true };
                const dataUrl = await renderWatermark(img.url, cfg, adj, faceModelRef.current, customPos || undefined, exportOpts);
                updateImage(img.id, { watermarkedUrl: dataUrl });
            }
        }
        catch (err) {
            console.error('Batch watermark failed:', err);
            alert('Some images failed to process.');
        }
        finally {
            setProcessing(false);
        }
    };
    const applyToSelected = async (ids, qualityParam = 'standard') => {
        if (!images || ids.length === 0 || processing)
            return;
        setProcessing(true);
        setBatchProgress({ done: 0, total: ids.length });
        try {
            for (let i = 0; i < ids.length; i++) {
                const id = ids[i];
                const img = images.find(x => x.id === id);
                if (!img)
                    continue;
                const cfg = buildConfig();
                const adj = buildAdjustments();
                const exportOpts = { quality: qualityParam, format: qualityParam === 'hd' ? 'png' : 'jpg', watermarkEnabled: true };
                const dataUrl = await renderWatermark(img.url, cfg, adj, faceModelRef.current, customPos || undefined, exportOpts);
                updateImage(img.id, { watermarkedUrl: dataUrl });
                setBatchProgress(prev => ({ ...prev, done: prev.done + 1 }));
            }
        }
        catch (err) {
            console.error('Batch watermark failed:', err);
            alert('Some images failed to process.');
        }
        finally {
            setProcessing(false);
            setBatchModalOpen(false);
            setBatchProgress({ done: 0, total: 0 });
        }
    };
    const exportSelected = async (ids, qualityParam = 'standard', asZip = false) => {
        if (!images || ids.length === 0 || processing)
            return;
        setProcessing(true);
        try {
            if (asZip && ids.length > 1) {
                // Batch ZIP export for maintaining quality
                const zip = new JSZip();
                const folder = zip.folder('watermarked-images');
                if (!folder)
                    throw new Error('Failed to create ZIP folder');
                setBatchProgress({ done: 0, total: ids.length });
                for (let i = 0; i < ids.length; i++) {
                    const id = ids[i];
                    const img = images.find(x => x.id === id);
                    if (!img)
                        continue;
                    const adj = buildAdjustments();
                    const url = await renderWatermark(img.url, {
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
                        glowEffect,
                        strokeWidth,
                        strokeColor
                    }, adj, faceModelRef.current, customPos || undefined, qualityParam);
                    // Convert data URL to blob
                    const blob = await fetch(url).then(r => r.blob());
                    const baseName = img.file?.name ? img.file.name.replace(/\.[^/.]+$/, '') : `image-${i + 1}`;
                    const isPng = qualityParam === 'hd' || qualityParam === 'ultra' || url.startsWith('data:image/png');
                    const fileName = `${baseName}-watermarked.${isPng ? 'png' : 'jpg'}`;
                    folder.file(fileName, blob);
                    setBatchProgress(prev => ({ ...prev, done: prev.done + 1 }));
                }
                // Generate and download ZIP
                const zipBlob = await zip.generateAsync({
                    type: 'blob',
                    compression: 'DEFLATE',
                    compressionOptions: { level: 6 }
                });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(zipBlob);
                a.download = `watermarked-batch-${qualityParam}-${new Date().getTime()}.zip`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(a.href);
            }
            else {
                // Individual downloads
                for (const id of ids) {
                    const img = images.find(x => x.id === id);
                    if (!img)
                        continue;
                    const adj = buildAdjustments();
                    const url = await renderWatermark(img.url, {
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
                        glowEffect,
                        strokeWidth,
                        strokeColor
                    }, adj, faceModelRef.current, customPos || undefined, qualityParam);
                    const a = document.createElement('a');
                    a.href = url;
                    const baseName = img.file?.name ? img.file.name.replace(/\.[^/.]+$/, '') : 'image';
                    const isPng = qualityParam === 'hd' || qualityParam === 'ultra' || url.startsWith('data:image/png');
                    a.download = `${baseName}-watermarked.${isPng ? 'png' : 'jpg'}`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                }
            }
        }
        catch (err) {
            console.warn('Failed to export selected', err);
        }
        finally {
            setProcessing(false);
            setBatchModalOpen(false);
            setBatchProgress({ done: 0, total: 0 });
        }
    };
    const exportImages = useCallback(async (all = false, qualityParam = 'standard') => {
        const toExport = all ? images : (current ? [current] : []);
        for (const img of toExport) {
            try {
                // Always re-render for export to ensure requested quality applies to the full image
                const cfg = buildConfig();
                const adj = buildAdjustments();
                const exportOpts = { quality: qualityParam, format: qualityParam === 'hd' || qualityParam === 'ultra' ? 'png' : 'jpg', watermarkEnabled: true };
                const cfgWithGradient = { ...cfg, gradientFrom, gradientTo };
                const url = await renderWatermark(img.url, cfgWithGradient, adj, faceModelRef.current, customPos || undefined, exportOpts);
                const a = document.createElement('a');
                a.href = url;
                const baseName = img.file?.name ? img.file.name.replace(/\.[^/.]+$/, '') : 'image';
                const isPng = qualityParam === 'hd' || qualityParam === 'ultra' || url.startsWith('data:image/png');
                a.download = `${baseName}-watermarked.${isPng ? 'png' : 'jpg'}`;
                document.body.appendChild(a);
                a.click();
                a.remove();
            }
            catch (err) {
                console.warn('Failed to export', img.id, err);
            }
        }
    }, [images, current, buildConfig, buildAdjustments, gradientFrom, gradientTo, customPos]);
    useEffect(() => {
        if (!current)
            return;
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
        // Skip heavy engine preview while user is in fullscreen placement mode to reduce CPU and jank
        const shouldPreview = useEnginePreview && (activeTab === 'enhance' || adjustmentsExist) && !previewFullscreen;
        if (!shouldPreview) {
            setPreviewDataUrl(null);
            return;
        }
        let cancelled = false;
        let lastUrl = null;
        const id = setTimeout(async () => {
            try {
                const cfg = buildConfig({ text: '', logos: [] });
                const adj = buildAdjustments();
                // use legacy small preview for speed
                // Map previewQuality to engine parameters (legacy string or ExportOptions)
                let qualityParam = 'small';
                if (previewQuality === 'small')
                    qualityParam = 'small';
                else if (previewQuality === 'standard')
                    qualityParam = 'standard';
                else
                    qualityParam = 'hd';
                const dataUrl = await renderWatermark(current.url, cfg, adj, faceModelRef.current, undefined, qualityParam);
                if (!cancelled) {
                    try {
                        // Revoke previous preview blob URL to avoid accumulating memory
                        if (lastUrl && lastUrl.startsWith('blob:'))
                            URL.revokeObjectURL(lastUrl);
                    }
                    catch (err) {
                        console.debug('revoking previous preview URL failed', err);
                    }
                    lastUrl = dataUrl;
                    setPreviewDataUrl(dataUrl);
                }
            }
            catch (err) {
                console.warn('Preview render failed', err);
            }
        }, 350);
        return () => {
            cancelled = true;
            clearTimeout(id);
            try {
                if (lastUrl && lastUrl.startsWith('blob:'))
                    URL.revokeObjectURL(lastUrl);
            }
            catch (err) {
                console.debug('revoking preview URL failed', err);
            }
        };
    }, [current, activeTab, exposure, contrast, saturation, temperature, highlights, shadows, whites, blacks, vibrance, clarity, dehaze, vignette, grain, sharpen, tint, hue, filterPreset, buildConfig, buildAdjustments, useEnginePreview, previewQuality, previewFullscreen]);
    // Lazy-load face model only when AI placement is enabled to avoid loading heavy TFJS code eagerly
    useEffect(() => {
        let cancelled = false;
        (async () => {
            if (!aiPlacement) {
                // If user disabled AI placement, dispose model to free memory
                try {
                    const m = faceModelRef.current;
                    if (m && typeof m.dispose === 'function')
                        m.dispose();
                }
                catch (err) {
                    console.debug('disposing face model failed', err);
                }
                faceModelRef.current = null;
                return;
            }
            try {
                const model = await blazeface.load();
                if (!cancelled)
                    faceModelRef.current = model;
            }
            catch (err) {
                console.warn('Failed to load face model', err);
            }
        })();
        return () => { cancelled = true; };
    }, [aiPlacement]);
    // Push current placement state to history (call before making a change)
    const pushPlacementHistory = useCallback(() => {
        setPlacementHistory(prev => {
            const next = [{ position, customPos, logos: JSON.parse(JSON.stringify(logos || [])) }, ...prev];
            if (next.length > MAX_HISTORY)
                next.pop();
            return next;
        });
    }, [position, customPos, logos]);
    // Wrapped setters that record history
    const setPositionWithHistory = useCallback((p) => {
        pushPlacementHistory();
        setPosition(p);
        // clear customPos when switching to named positions
        if (p !== 'custom')
            setCustomPos(null);
    }, [pushPlacementHistory]);
    const setCustomPosWithHistory = useCallback((pos) => {
        pushPlacementHistory();
        setCustomPos(pos);
        if (pos)
            setPosition('custom');
    }, [pushPlacementHistory]);
    const setLogosWithHistory = useCallback((nextLogos) => {
        pushPlacementHistory();
        setLogos(nextLogos);
    }, [pushPlacementHistory]);
    // Undo the last placement change
    const undoPlacement = useCallback(() => {
        setPlacementHistory(prev => {
            if (!prev || prev.length === 0)
                return prev;
            const [last, ...rest] = prev;
            setPosition(last.position);
            setCustomPos(last.customPos);
            setLogos(last.logos || []);
            return rest;
        });
    }, []);
    // Reset placement to defaults (bottom-right, no customPos)
    const resetPlacement = useCallback(() => {
        pushPlacementHistory();
        setPosition('bottom-right');
        setCustomPos(null);
        // Optionally reset logos to center-ish defaults
        setLogos(prev => (prev || []).map((l, idx) => ({ ...l, position: { x: 0.5 + idx * 0.03, y: 0.5 + idx * 0.03 } })));
    }, [pushPlacementHistory]);
    // Keyboard shortcuts: Ctrl+Z (undo), Ctrl+E (export), Ctrl+B (batch), ? (help)
    useEffect(() => {
        const onKey = (e) => {
            const isMac = navigator.platform.toUpperCase().includes('MAC');
            const mod = isMac ? e.metaKey : e.ctrlKey;
            // Undo: Ctrl/Cmd + Z
            if (mod && e.key.toLowerCase() === 'z') {
                e.preventDefault();
                undoPlacement();
            }
            // Export: Ctrl/Cmd + E
            if (mod && e.key.toLowerCase() === 'e') {
                e.preventDefault();
                if (current)
                    exportImages(false, exportQuality);
            }
            // Batch: Ctrl/Cmd + B
            if (mod && e.key.toLowerCase() === 'b') {
                e.preventDefault();
                if (images.length > 1)
                    setBatchModalOpen(true);
            }
            // Help: ? key
            if (e.key === '?' && !mod) {
                e.preventDefault();
                setShowShortcuts(true);
            }
            // Escape: Close modals
            if (e.key === 'Escape') {
                setBatchModalOpen(false);
                setShowShortcuts(false);
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [undoPlacement, current, images, exportQuality, exportImages]);
    return (_jsxs("div", { className: "min-h-screen relative overflow-hidden bg-[#000913]", children: [previewFullscreen && current && (_jsx("div", { className: "fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4", onClick: (e) => {
                    if (e.target === e.currentTarget) {
                        try {
                            placementFlushRef.current?.();
                        }
                        catch (err) {
                            console.debug('flush placement failed', err);
                        }
                        setPreviewFullscreen(false);
                    }
                }, children: _jsxs("div", { ref: fullscreenContainerRef, className: "relative w-full h-full max-w-[100vw] max-h-screen", children: [_jsxs("button", { onClick: () => { try {
                                placementFlushRef.current?.();
                            }
                            catch (err) {
                                console.debug('flush placement failed', err);
                            } setPreviewFullscreen(false); }, "aria-label": "Close preview", 
                            // Use fixed positioning and explicit zIndex to guarantee visibility across screen sizes
                            style: { position: 'fixed', top: 12, right: 12, zIndex: 9999 }, className: "bg-white text-black px-3 py-2 rounded-md shadow-lg flex items-center gap-2", children: [_jsx(X, { className: "w-4 h-4" }), "Done"] }), _jsx("div", { className: "w-full h-full flex items-center justify-center", children: _jsxs("div", { className: "relative w-full h-full", children: [_jsx("img", { src: (useEnginePreview && activeTab === 'enhance' && previewDataUrl) ? previewDataUrl : current.url, alt: "fullscreen preview", className: "w-full h-full object-contain cursor-pointer", onClick: () => setPreviewFullscreen(false) }), _jsx("button", { onClick: () => { try {
                                            placementFlushRef.current?.();
                                        }
                                        catch (err) {
                                            console.debug('flush placement failed', err);
                                        } setPreviewFullscreen(false); }, "aria-label": "Done and return to editor", style: { position: 'absolute', bottom: 18, right: 18, zIndex: 9999 }, className: "bg-white text-black px-4 py-2 rounded-full shadow-lg inline-flex", children: "Done" }), _jsx("div", { className: "absolute inset-0 pointer-events-auto", children: _jsx(WatermarkPreview, { watermarkType: watermarkType, currentUrl: (useEnginePreview && activeTab === 'enhance' && previewDataUrl) ? previewDataUrl : current.url, faceModelRef: faceModelRef, watermarkText: watermarkText, logoUrl: logoUrl, logoUrls: logoUrls, logos: logos, setLogos: setLogosWithHistory, imageScale: 1, previewImgWidth: previewImgWidth, size: size, watermarkColor: watermarkColor, fontWeightState: fontWeightState, fontFamily: fontFamily, style: style, rotation: rotation, adaptiveBlend: false, glowEffect: glowEffect, position: position, customPos: customPos, setCustomPos: setCustomPosWithHistory, setIsDragging: setIsDragging, isDragging: isDragging, setPosition: setPositionWithHistory, containerRef: fullscreenContainerRef, flushRef: placementFlushRef, blendMode: blendMode, opacity: opacity, strokeWidth: strokeWidth, strokeColor: strokeColor }) })] }) })] }) })), _jsx(motion.header, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, className: "relative z-20 bg-[#031B2F]/80 backdrop-blur-xl border-b border-white/5", children: _jsx("div", { className: "max-w-[1800px] mx-auto px-4 py-3 md:px-6 md:py-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx(motion.button, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, className: "p-3 rounded-xl bg-[#0A2540]/50 hover:bg-[#0F2F50] border border-white/5 transition-colors", onClick: () => navigate(-1), children: _jsx(ArrowLeft, { className: "w-5 h-5 text-[#F4F8FF]" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-[#F4F8FF]", children: "Image Editor" }), _jsxs("p", { className: "text-sm text-[#9FB2C8]", children: [current?.file?.name ?? 'No image', " \u2022 Image ", images?.length ? selectIndex + 1 : 0, " of ", images?.length ?? 0] })] })] }), _jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [_jsx(motion.button, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, className: "p-2 rounded-xl bg-[#0A2540]/50 hover:bg-[#0F2F50] border border-white/5 text-[#F4F8FF] transition-colors", onClick: () => setShowShortcuts(true), title: "Keyboard shortcuts (?)", children: _jsx(Zap, { className: "w-5 h-5" }) }), _jsxs(motion.button, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, className: "px-4 py-2 rounded-xl bg-[#0A2540]/50 hover:bg-[#0F2F50] border border-white/5 text-[#F4F8FF] font-medium transition-colors flex items-center gap-2", onClick: () => {
                                            setExposure(0);
                                            setContrast(0);
                                            setSaturation(0);
                                            setTemperature(0);
                                        }, children: [_jsx(RotateCcw, { className: "w-4 h-4" }), "Reset"] }), _jsx(motion.button, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, className: "px-4 py-2 rounded-xl bg-[#0A2540]/50 hover:bg-[#0F2F50] border border-white/5 text-[#F4F8FF] font-medium transition-colors items-center gap-2 hidden md:inline-flex", onClick: () => undoPlacement(), children: "Undo Placement" }), _jsx(motion.button, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, className: "px-4 py-2 rounded-xl bg-[#0A2540]/50 hover:bg-[#0F2F50] border border-white/5 text-[#F4F8FF] font-medium transition-colors items-center gap-2 hidden md:inline-flex", onClick: () => resetPlacement(), children: "Reset Placement" }), _jsxs(motion.button, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, className: "px-4 py-2 rounded-xl bg-linear-to-r from-[#1A7CFF] to-[#0D6EF5] text-white font-semibold shadow-[0_0_20px_rgba(26,124,255,0.4)] flex items-center gap-2", onClick: () => applyToCurrent(), children: [_jsx(Save, { className: "w-4 h-4" }), "Save"] })] })] }) }) }), _jsx("div", { className: "relative z-10 max-w-[1800px] mx-auto px-6 py-6", children: _jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-3 gap-6", children: [_jsx("div", { className: "xl:col-span-2", children: _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.5 }, className: "relative", children: [_jsx("div", { className: "absolute inset-0 bg-linear-to-br from-[#1A7CFF]/10 to-[#A24BFF]/5 rounded-3xl blur-2xl" }), _jsxs("div", { className: "relative bg-[#031B2F]/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6", children: [_jsxs("div", { ref: containerRef, className: "relative aspect-video bg-[#0A2540] rounded-2xl overflow-hidden group", children: [current ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "absolute inset-0 flex items-center justify-center", children: [_jsx("img", { ref: imgRef, src: (useEnginePreview && activeTab === 'enhance' && previewDataUrl) ? previewDataUrl : current.url, alt: "editing", onLoad: () => setPreviewImgWidth(imgRef.current?.clientWidth || 600), onClick: () => {
                                                                            // allow tapping image to enter fullscreen on mobile
                                                                            if (window.innerWidth < 900)
                                                                                setPreviewFullscreen(true);
                                                                        }, style: {
                                                                            // When we're showing an engine-generated preview (`previewDataUrl`),
                                                                            // the image already contains the adjustments baked in. Avoid applying
                                                                            // the inline CSS filter again to prevent double-processing (appears
                                                                            // too bright or otherwise incorrect compared to the exported image).
                                                                            filter: (useEnginePreview && activeTab === 'enhance' && previewDataUrl)
                                                                                ? undefined
                                                                                : getFilterString(buildAdjustments()),
                                                                            width: `${(imageScale || 1) * 100}%`,
                                                                            height: 'auto',
                                                                            maxHeight: '100%',
                                                                            objectFit: 'contain',
                                                                            transition: 'width 160ms ease'
                                                                        } }), _jsx("button", { type: "button", onClick: () => setPreviewFullscreen(true), className: "absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded-md md:hidden", children: "Fullscreen" })] }), _jsx(WatermarkPreview, { watermarkType: watermarkType, currentUrl: (useEnginePreview && activeTab === 'enhance' && previewDataUrl) ? previewDataUrl : current.url, faceModelRef: faceModelRef, watermarkText: watermarkText, logoUrl: logoUrl, logoUrls: logoUrls, logos: logos, setLogos: setLogosWithHistory, imageScale: imageScale, previewImgWidth: previewImgWidth, size: size, watermarkColor: watermarkColor, fontWeightState: fontWeightState, fontFamily: fontFamily, style: style, rotation: rotation, adaptiveBlend: false, glowEffect: glowEffect, position: position, customPos: customPos, setCustomPos: setCustomPosWithHistory, setIsDragging: setIsDragging, isDragging: isDragging, setPosition: setPositionWithHistory, containerRef: containerRef, flushRef: placementFlushRef, blendMode: blendMode, opacity: opacity, strokeWidth: strokeWidth, strokeColor: strokeColor })] })) : (_jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx(ImageIcon, { className: "w-16 h-16 text-[#9FB2C8]/30 mx-auto mb-4" }), _jsx("p", { className: "text-[#9FB2C8]/50", children: "Your image will appear here" })] }) })), _jsx("canvas", { ref: canvasRef, className: "hidden" }), images && images.length > 1 && (_jsxs("div", { className: "absolute inset-0 pointer-events-none flex items-center justify-between px-4 z-40", children: [_jsx("button", { onClick: () => setSelectIndex(Math.max(0, selectIndex - 1)), disabled: selectIndex === 0, className: "pointer-events-auto p-3 rounded-full bg-[#000000]/60 hover:bg-[#000000]/80 text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed", children: "\u25C0" }), _jsx("button", { onClick: () => setSelectIndex(Math.min(images.length - 1, selectIndex + 1)), disabled: selectIndex === images.length - 1, className: "pointer-events-auto p-3 rounded-full bg-[#000000]/60 hover:bg-[#000000]/80 text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed", children: "\u25B6" })] })), _jsx("div", { className: "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none", children: _jsx("div", { className: "absolute inset-0 grid grid-cols-3 grid-rows-3", children: [...Array(9)].map((_, i) => (_jsx("div", { className: "border border-white/10" }, i))) }) })] }), _jsxs("div", { className: "mt-4 flex items-center justify-between gap-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: () => setImageScale(prev => Math.max(0.2, +(prev - 0.1).toFixed(2))), className: "px-3 py-1.5 rounded-lg bg-[#0A2540] hover:bg-[#0F2F50] text-xs text-[#9FB2C8] transition-colors", children: "-" }), _jsx("input", { type: "range", min: 0.2, max: 2, step: 0.01, value: imageScale, onChange: (e) => setImageScale(Number(e.target.value)), className: "w-44" }), _jsx("button", { onClick: () => setImageScale(prev => Math.min(2, +(prev + 0.1).toFixed(2))), className: "px-3 py-1.5 rounded-lg bg-[#0A2540] hover:bg-[#0F2F50] text-xs text-[#9FB2C8] transition-colors", children: "+" }), _jsxs("div", { className: "text-xs text-[#9FB2C8] ml-2", children: [Math.round(imageScale * 100), "%"] }), _jsx("button", { onClick: () => setImageScale(1), className: "ml-2 px-3 py-1.5 rounded-lg bg-[#0A2540] hover:bg-[#0F2F50] text-xs text-[#9FB2C8] transition-colors", children: "Reset" })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("label", { className: "flex items-center gap-2 text-xs text-[#9FB2C8]", children: [_jsx("input", { type: "checkbox", checked: useEnginePreview, onChange: (e) => setUseEnginePreview(e.target.checked), className: "w-4 h-4" }), "Engine Preview"] }), _jsxs("select", { value: previewQuality, onChange: (e) => setPreviewQuality(e.target.value), className: "bg-[#0A2540] text-xs text-white px-2 py-1 rounded", children: [_jsx("option", { value: "small", children: "Preview: Small" }), _jsx("option", { value: "standard", children: "Preview: Medium" }), _jsx("option", { value: "hd", children: "Preview: Full" })] }), _jsx("div", { className: "text-xs text-[#9FB2C8]", children: watermarkType !== 'none' ? 'Watermark Active' : 'No Watermark' })] })] })] })] }) }), _jsxs("div", { className: "space-y-4", children: [_jsxs(motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.2 }, className: "relative", children: [_jsx("div", { className: "absolute inset-0 bg-linear-to-br from-[#1A7CFF]/10 to-transparent rounded-2xl blur-xl" }), _jsx("div", { className: "relative bg-[#031B2F]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2", children: _jsx("div", { className: "grid grid-cols-2 gap-2", children: [
                                                    { id: 'watermark', label: 'Watermark', icon: Layers },
                                                    { id: 'enhance', label: 'Enhance', icon: Sparkles }
                                                ].map((tab) => (_jsx(motion.button, { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, onClick: () => setActiveTab(tab.id), className: `relative px-4 py-3 rounded-xl font-medium transition-all ${activeTab === tab.id
                                                        ? 'bg-linear-to-r from-[#1A7CFF] to-[#0D6EF5] text-white shadow-[0_0_20px_rgba(26,124,255,0.4)]'
                                                        : 'text-[#9FB2C8] hover:text-[#F4F8FF]'}`, children: _jsxs("div", { className: "flex items-center justify-center gap-2", children: [_jsx(tab.icon, { className: "w-4 h-4" }), _jsx("span", { className: "text-sm", children: tab.label })] }) }, tab.id))) }) })] }), _jsx(AnimatePresence, { mode: "wait", children: activeTab === 'watermark' && (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, children: _jsx(ModernWatermarkControlsWrapper, { watermarkText: watermarkText, setWatermarkText: setWatermarkText, logoUrl: logoUrl, logoUrls: logoUrls, logos: logos, setLogoUrl: setLogoUrl, setLogoUrls: setLogoUrls, setLogos: setLogosWithHistory, logoInputRef: logoInputRef, style: style, setStyle: setStyle, fontFamily: fontFamily, setFontFamily: setFontFamily, fontWeight: fontWeightState, setFontWeight: setFontWeightState, color: watermarkColor, setColor: setWatermarkColor, size: size, setSize: setSize, opacity: opacity, setOpacity: setOpacity, rotation: rotation, setRotation: setRotation, position: position, setPosition: setPositionWithHistory, aiPlacement: aiPlacement, setAiPlacement: setAiPlacement, blendMode: blendMode, setBlendMode: setBlendMode, shadowIntensity: shadowIntensity, setShadowIntensity: setShadowIntensity, glowEffect: glowEffect, setGlowEffect: setGlowEffect, exposure: exposure, setExposure: setExposure, contrast: contrast, setContrast: setContrast, saturation: saturation, setSaturation: setSaturation, temperature: temperature, setTemperature: setTemperature, highlights: highlights, setHighlights: setHighlights, shadows: shadows, setShadows: setShadows, whites: whites, setWhites: setWhites, blacks: blacks, setBlacks: setBlacks, vibrance: vibrance, setVibrance: setVibrance, clarity: clarity, setClarity: setClarity, dehaze: dehaze, setDehaze: setDehaze, vignette: vignette, setVignette: setVignette, grain: grain, setGrain: setGrain, sharpen: sharpen, setSharpen: setSharpen, tint: tint, setTint: setTint, hue: hue, setHue: setHue, filterPreset: filterPreset, setFilterPreset: handleSetFilterPreset, gradientFrom: gradientFrom, setGradientFrom: setGradientFrom, gradientTo: gradientTo, setGradientTo: setGradientTo, imageScale: imageScale, setImageScale: setImageScale, strokeWidth: strokeWidth, setStrokeWidth: setStrokeWidth, strokeColor: strokeColor, setStrokeColor: setStrokeColor }) }, "watermark")) }), _jsx(AnimatePresence, { mode: "wait", children: activeTab === 'enhance' && (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, children: _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-0 bg-linear-to-br from-[#1A7CFF]/10 to-transparent rounded-2xl blur-xl" }), _jsxs("div", { className: "relative bg-[#031B2F]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 space-y-4", children: [_jsxs("h3", { className: "text-sm font-bold text-[#F4F8FF] uppercase tracking-wide flex items-center gap-2", children: [_jsx(Palette, { className: "w-4 h-4 text-[#1A7CFF]" }), "Image Editing"] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-[#9FB2C8] mb-2 block", children: "Quick Filters" }), _jsx("div", { className: "grid grid-cols-4 gap-2", children: [
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
                                                                    ].map((filter) => (_jsxs("button", { onClick: () => setFilterPreset(filter.id), title: filter.label, className: `p-2 rounded-lg transition-all flex flex-col items-center justify-center gap-1 ${filterPreset === filter.id ? 'bg-linear-to-br from-[#1A7CFF]/30 to-[#A24BFF]/20 border-2 border-[#1A7CFF]' : 'bg-[#0A2540]/50 border border-white/5'}`, children: [_jsx("div", { className: "text-[16px] leading-none", children: filter.emoji }), _jsx("div", { className: "text-[10px] font-medium text-[#9FB2C8]", children: filter.label })] }, filter.id))) })] }), _jsx("div", { className: "flex gap-1 p-1 bg-[#0A2540]/50 rounded-lg", children: [
                                                                { id: 'basic', label: 'Basic', icon: Sun },
                                                                { id: 'advanced', label: 'Advanced', icon: Scissors },
                                                                { id: 'color', label: 'Color', icon: Palette }
                                                            ].map((tab) => {
                                                                const IconComp = tab.icon;
                                                                return (_jsxs("button", { onClick: () => setEnhanceSection(tab.id), className: `flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-2 ${enhanceSection === tab.id ? 'bg-[#1A7CFF] text-white' : 'text-[#9FB2C8] hover:text-[#F4F8FF]'}`, children: [_jsx(IconComp, { className: "w-3 h-3" }), _jsx("span", { children: tab.label })] }, tab.id));
                                                            }) }), enhanceSection === 'basic' && (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm text-[#F4F8FF] font-medium", children: "Exposure" }), _jsx("input", { type: "range", min: -100, max: 100, value: exposure, onChange: (e) => setExposure(Number(e.target.value)), className: "w-full" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm text-[#F4F8FF] font-medium", children: "Contrast" }), _jsx("input", { type: "range", min: -100, max: 100, value: contrast, onChange: (e) => setContrast(Number(e.target.value)), className: "w-full" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm text-[#F4F8FF] font-medium", children: "Saturation" }), _jsx("input", { type: "range", min: -100, max: 100, value: saturation, onChange: (e) => setSaturation(Number(e.target.value)), className: "w-full" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm text-[#F4F8FF] font-medium", children: "Temperature" }), _jsx("input", { type: "range", min: -100, max: 100, value: temperature, onChange: (e) => setTemperature(Number(e.target.value)), className: "w-full" })] })] })), enhanceSection === 'advanced' && (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm text-[#F4F8FF] font-medium", children: "Highlights" }), _jsx("input", { type: "range", min: -100, max: 100, value: highlights, onChange: (e) => setHighlights(Number(e.target.value)), className: "w-full" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm text-[#F4F8FF] font-medium", children: "Shadows" }), _jsx("input", { type: "range", min: -100, max: 100, value: shadows, onChange: (e) => setShadows(Number(e.target.value)), className: "w-full" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm text-[#F4F8FF] font-medium", children: "Clarity" }), _jsx("input", { type: "range", min: -100, max: 100, value: clarity, onChange: (e) => setClarity(Number(e.target.value)), className: "w-full" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm text-[#F4F8FF] font-medium", children: "Sharpen" }), _jsx("input", { type: "range", min: 0, max: 100, value: sharpen, onChange: (e) => setSharpen(Number(e.target.value)), className: "w-full" })] })] })), enhanceSection === 'color' && (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm text-[#F4F8FF] font-medium", children: "Vibrance" }), _jsx("input", { type: "range", min: -100, max: 100, value: vibrance, onChange: (e) => setVibrance(Number(e.target.value)), className: "w-full" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm text-[#F4F8FF] font-medium", children: "Dehaze" }), _jsx("input", { type: "range", min: 0, max: 100, value: dehaze, onChange: (e) => setDehaze(Number(e.target.value)), className: "w-full" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm text-[#F4F8FF] font-medium", children: "Vignette" }), _jsx("input", { type: "range", min: -100, max: 100, value: vignette, onChange: (e) => setVignette(Number(e.target.value)), className: "w-full" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm text-[#F4F8FF] font-medium", children: "Grain" }), _jsx("input", { type: "range", min: 0, max: 100, value: grain, onChange: (e) => setGrain(Number(e.target.value)), className: "w-full" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm text-[#F4F8FF] font-medium", children: "Tint" }), _jsx("input", { type: "range", min: -100, max: 100, value: tint, onChange: (e) => setTint(Number(e.target.value)), className: "w-full" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm text-[#F4F8FF] font-medium", children: "Hue" }), _jsx("input", { type: "range", min: -180, max: 180, value: hue, onChange: (e) => setHue(Number(e.target.value)), className: "w-full" })] })] })), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("button", { onClick: () => {
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
                                                                    }, className: "px-3 py-2 rounded-lg bg-[#0A2540] text-sm text-[#9FB2C8]", children: "Reset Adjustments" }), _jsx("div", { className: "ml-auto flex items-center gap-2", children: _jsx("button", { onClick: async () => {
                                                                            if (applyAll) {
                                                                                for (const img of images) {
                                                                                    if (!img)
                                                                                        continue;
                                                                                    const cfg = buildConfig({ text: '', logos: [] });
                                                                                    const adj = buildAdjustments();
                                                                                    const exportOpts = { quality: 'standard', format: 'jpg', watermarkEnabled: false };
                                                                                    const dataUrl = await renderWatermark(img.url, cfg, adj, faceModelRef.current, undefined, exportOpts);
                                                                                    updateImage(img.id, { watermarkedUrl: dataUrl });
                                                                                }
                                                                            }
                                                                            else {
                                                                                await applyEnhanceToCurrent();
                                                                            }
                                                                        }, disabled: processing || !current, className: "px-4 py-2 rounded-lg bg-linear-to-r from-[#1A7CFF] to-[#0D6EF5] text-white font-semibold", children: processing ? 'Applying...' : applyAll ? 'Apply Enhancements to All' : 'Apply Enhancement' }) })] })] })] }) }, "enhance")) }), _jsxs("div", { className: "flex items-center gap-3 px-2", children: [_jsxs("label", { className: "flex items-center gap-2 text-sm text-[#9FB2C8] cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: applyAll, onChange: (e) => setApplyAll(e.target.checked), className: "w-4 h-4 rounded border-white/20 bg-[#0A2540] text-[#1A7CFF] focus:ring-[#1A7CFF] focus:ring-offset-0" }), "Apply to all ", images?.length || 0, " images"] }), _jsx("div", { className: "ml-auto flex items-center gap-2", children: _jsx("button", { onClick: () => setBatchModalOpen(true), className: "px-3 py-1.5 rounded-lg bg-[#0A2540] hover:bg-[#0F2F50] text-xs text-[#9FB2C8] transition-colors", children: "Select Images" }) })] }), _jsxs(motion.button, { whileHover: { scale: processing ? 1 : 1.02 }, whileTap: { scale: processing ? 1 : 0.98 }, disabled: processing || !current, className: "w-full py-4 rounded-2xl bg-linear-to-r from-[#1A7CFF] to-[#0D6EF5] text-white text-lg font-semibold shadow-[0_0_30px_rgba(26,124,255,0.4)] hover:shadow-[0_0_40px_rgba(26,124,255,0.6)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed", onClick: async () => {
                                        if (applyAll) {
                                            // apply to all at the selected export quality, then export at that quality
                                            await applyToAll(exportQuality);
                                            await exportImages(true, exportQuality);
                                        }
                                        else {
                                            await applyToCurrent();
                                            await exportImages(false, exportQuality);
                                        }
                                    }, children: [_jsx(Download, { className: "w-5 h-5" }), processing ? 'Processing...' : applyAll ? 'Apply & Export All' : 'Apply & Export'] }), batchModalOpen && (_jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "fixed inset-0 z-50 flex items-center justify-center", children: [_jsx("div", { className: "absolute inset-0 bg-black/70 backdrop-blur-sm", onClick: () => !processing && setBatchModalOpen(false) }), _jsxs(motion.div, { initial: { scale: 0.9, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.9, opacity: 0 }, className: "relative z-60 bg-gradient-to-br from-[#02121b] to-[#031B2F] border border-[#1A7CFF]/20 rounded-2xl p-6 w-[90%] max-w-3xl shadow-[0_0_50px_rgba(26,124,255,0.3)]", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx("div", { className: "p-3 rounded-xl bg-linear-to-br from-[#1A7CFF]/20 to-[#A24BFF]/10", children: _jsx(FileArchive, { className: "w-6 h-6 text-[#1A7CFF]" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-xl font-bold text-white", children: "Batch Export" }), _jsx("p", { className: "text-sm text-[#9FB2C8]", children: "Process multiple images at once" })] }), _jsx("button", { onClick: () => !processing && setBatchModalOpen(false), className: "p-2 rounded-lg hover:bg-white/5 transition-colors", disabled: processing, children: _jsx(X, { className: "w-5 h-5 text-[#9FB2C8]" }) })] }), _jsxs("div", { className: "mb-4 flex items-center gap-2", children: [_jsxs("button", { onClick: () => setSelectedIds(images.map(i => i.id)), className: "px-4 py-2 rounded-lg bg-[#0A2540] text-sm text-[#F4F8FF] hover:bg-[#0F2F50] transition-colors font-medium", children: ["Select All (", images.length, ")"] }), _jsx("button", { onClick: () => setSelectedIds([]), className: "px-4 py-2 rounded-lg bg-[#0A2540] text-sm text-[#9FB2C8] hover:bg-[#0F2F50] transition-colors", children: "Clear" }), _jsxs("div", { className: "ml-auto text-sm text-[#1A7CFF] font-semibold", children: [selectedIds.length, " selected", batchProgress.total > 0 && ` • Processing: ${batchProgress.done}/${batchProgress.total}`] })] }), _jsx(AnimatePresence, { children: batchProgress.total > 0 && (_jsxs(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, className: "mb-4", children: [_jsx("div", { className: "w-full h-3 bg-[#0A2540] rounded-full overflow-hidden shadow-inner", children: _jsx(motion.div, { className: "h-full bg-linear-to-r from-[#1A7CFF] via-[#6B46FF] to-[#A24BFF] shadow-[0_0_10px_rgba(26,124,255,0.5)]", initial: { width: 0 }, animate: { width: `${(batchProgress.done / batchProgress.total) * 100}%` }, transition: { duration: 0.3 } }) }), _jsxs("div", { className: "text-xs text-[#9FB2C8] mt-1 text-center", children: [Math.round((batchProgress.done / batchProgress.total) * 100), "% Complete"] })] })) }), _jsx("div", { className: "grid grid-cols-3 gap-2 max-h-72 overflow-auto mb-5 pr-2 custom-scrollbar", children: images.map(img => (_jsxs(motion.label, { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, className: `relative flex flex-col gap-2 p-3 rounded-xl transition-all cursor-pointer ${selectedIds.includes(img.id)
                                                            ? 'bg-linear-to-br from-[#1A7CFF]/20 to-[#A24BFF]/10 border-2 border-[#1A7CFF] shadow-[0_0_15px_rgba(26,124,255,0.3)]'
                                                            : 'bg-[#0A2540]/50 border-2 border-transparent hover:border-white/10'}`, children: [_jsxs("div", { className: "relative aspect-video rounded-lg overflow-hidden", children: [_jsx("img", { src: img.url, alt: img.file?.name || img.id, className: "w-full h-full object-cover" }), _jsx("div", { className: "absolute top-2 left-2", children: _jsx("input", { type: "checkbox", checked: selectedIds.includes(img.id), onChange: (e) => {
                                                                                if (e.target.checked)
                                                                                    setSelectedIds(prev => [...prev, img.id]);
                                                                                else
                                                                                    setSelectedIds(prev => prev.filter(id => id !== img.id));
                                                                            }, className: "w-5 h-5 accent-[#1A7CFF] cursor-pointer" }) })] }), _jsx("div", { className: "text-xs text-[#9FB2C8] truncate font-medium", children: img.file?.name || img.id })] }, img.id))) }), _jsxs("div", { className: "bg-[#0A2540]/30 rounded-xl p-4 space-y-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Zap, { className: "w-5 h-5 text-[#1A7CFF]" }), _jsx("label", { className: "text-sm font-medium text-[#F4F8FF]", children: "Export Quality:" }), _jsxs("select", { value: exportQuality, onChange: (e) => setExportQuality(e.target.value), className: "flex-1 bg-[#031B2F] text-sm text-white px-4 py-2 rounded-lg border border-[#1A7CFF]/30 outline-none focus:border-[#1A7CFF] transition-colors font-medium", children: [_jsx("option", { value: "normal", children: "\uD83D\uDCF1 Normal (1280px) - Fast" }), _jsx("option", { value: "standard", children: "\uD83D\uDCBB Standard (1920px) - Balanced" }), _jsx("option", { value: "hd", children: "\u2B50 HD (2K) - Sharp & Clear" }), _jsx("option", { value: "ultra", children: "\uD83C\uDFC6 Ultra (4K) - Premium Quality" })] })] }), _jsxs("div", { className: "flex items-center gap-2 pt-2 border-t border-white/5", children: [_jsxs("button", { onClick: () => exportSelected(selectedIds, exportQuality, false), disabled: processing || selectedIds.length === 0, className: "flex-1 px-4 py-3 rounded-lg bg-[#0A2540] text-white font-semibold hover:bg-[#0F2F50] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2", children: [_jsx(Download, { className: "w-4 h-4" }), "Download Individual"] }), _jsxs("button", { onClick: () => exportSelected(selectedIds, exportQuality, true), disabled: processing || selectedIds.length < 2, className: "flex-1 px-4 py-3 rounded-lg bg-linear-to-r from-[#1A7CFF] to-[#6B46FF] text-white font-semibold hover:shadow-[0_0_20px_rgba(26,124,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2", children: [_jsx(FileArchive, { className: "w-4 h-4" }), "Download as ZIP"] })] })] })] })] })), showShortcuts && (_jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "fixed inset-0 z-50 flex items-center justify-center", children: [_jsx("div", { className: "absolute inset-0 bg-black/70 backdrop-blur-sm", onClick: () => setShowShortcuts(false) }), _jsxs(motion.div, { initial: { scale: 0.9, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.9, opacity: 0 }, className: "relative z-60 bg-gradient-to-br from-[#02121b] to-[#031B2F] border border-[#1A7CFF]/20 rounded-2xl p-6 w-[90%] max-w-2xl shadow-[0_0_50px_rgba(26,124,255,0.3)]", children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx("div", { className: "p-3 rounded-xl bg-linear-to-br from-[#1A7CFF]/20 to-[#A24BFF]/10", children: _jsx(Zap, { className: "w-6 h-6 text-[#1A7CFF]" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-xl font-bold text-white", children: "Keyboard Shortcuts" }), _jsx("p", { className: "text-sm text-[#9FB2C8]", children: "Work faster with professional shortcuts" })] }), _jsx("button", { onClick: () => setShowShortcuts(false), className: "p-2 rounded-lg hover:bg-white/5 transition-colors", children: _jsx(X, { className: "w-5 h-5 text-[#9FB2C8]" }) })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "bg-[#0A2540]/30 rounded-xl p-4 space-y-3", children: [_jsx("h4", { className: "text-sm font-semibold text-[#1A7CFF] mb-3", children: "General" }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-[#F4F8FF]", children: "Show this help" }), _jsx("kbd", { className: "px-3 py-1 rounded-lg bg-[#031B2F] border border-[#1A7CFF]/30 text-xs font-mono text-[#1A7CFF]", children: "?" })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-[#F4F8FF]", children: "Close modal / Exit" }), _jsx("kbd", { className: "px-3 py-1 rounded-lg bg-[#031B2F] border border-[#1A7CFF]/30 text-xs font-mono text-[#1A7CFF]", children: "Esc" })] })] }), _jsxs("div", { className: "bg-[#0A2540]/30 rounded-xl p-4 space-y-3", children: [_jsx("h4", { className: "text-sm font-semibold text-[#1A7CFF] mb-3", children: "Editing" }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-[#F4F8FF]", children: "Undo placement" }), _jsx("kbd", { className: "px-3 py-1 rounded-lg bg-[#031B2F] border border-[#1A7CFF]/30 text-xs font-mono text-[#1A7CFF]", children: "Ctrl + Z" })] })] }), _jsxs("div", { className: "bg-[#0A2540]/30 rounded-xl p-4 space-y-3", children: [_jsx("h4", { className: "text-sm font-semibold text-[#1A7CFF] mb-3", children: "Export" }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-[#F4F8FF]", children: "Export current image" }), _jsx("kbd", { className: "px-3 py-1 rounded-lg bg-[#031B2F] border border-[#1A7CFF]/30 text-xs font-mono text-[#1A7CFF]", children: "Ctrl + E" })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-[#F4F8FF]", children: "Batch export" }), _jsx("kbd", { className: "px-3 py-1 rounded-lg bg-[#031B2F] border border-[#1A7CFF]/30 text-xs font-mono text-[#1A7CFF]", children: "Ctrl + B" })] })] }), _jsxs("div", { className: "text-xs text-[#9FB2C8] text-center pt-2", children: [_jsx("kbd", { className: "text-[#1A7CFF]", children: "Ctrl" }), " is ", _jsx("kbd", { className: "text-[#1A7CFF]", children: "\u2318 Cmd" }), " on Mac"] })] })] })] }))] })] }) })] }));
}
