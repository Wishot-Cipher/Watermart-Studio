/* eslint-disable @typescript-eslint/no-explicit-any */
// ===================================================================
// src/components/ModernWatermarkControlsWrapper.tsx
// FULLY CORRECTED - ALL BUGS FIXED
// ===================================================================

import React from 'react';
import WatermarkControls from './WatermarkControls';
import { WatermarkConfig, ImageAdjustments, FontKey, WatermarkStyle, WatermarkLogo, DEFAULT_ADJUSTMENTS } from '@/types/watermark';

interface WrapperProps {
  watermarkText: string;
  setWatermarkText: (s: string) => void;
  logoUrl: string | null;
  logoUrls: string[];
  logos?: WatermarkLogo[];
  setLogoUrl: (u: string | null) => void;
  setLogoUrls: (u: string[]) => void;
  setLogos?: (v: WatermarkLogo[]) => void;
  logoInputRef: React.RefObject<HTMLInputElement | null>;
  style: WatermarkStyle;
  setStyle: (s: WatermarkStyle) => void;
  fontFamily: FontKey;
  setFontFamily: (k: FontKey) => void;
  fontWeight: '400' | '600' | '700' | '800';
  setFontWeight: (w: '400' | '600' | '700' | '800') => void;
  color: string;
  setColor: (c: string) => void;
  size: number;
  setSize: (n: number) => void;
  opacity: number;
  setOpacity: (n: number) => void;
  rotation: number;
  setRotation: (n: number) => void;
  position: string;
  setPosition: (s: string) => void;
  aiPlacement: boolean;
  setAiPlacement: (b: boolean) => void;
  blendMode: string;
  setBlendMode: (s: string) => void;
  shadowIntensity: number;
  setShadowIntensity: (n: number) => void;
  glowEffect: boolean;
  setGlowEffect: (b: boolean) => void;
  imageScale: number;
  setImageScale: (n: number) => void;
  exposure: number;
  setExposure: (n: number) => void;
  contrast: number;
  setContrast: (n: number) => void;
  saturation: number;
  setSaturation: (n: number) => void;
  temperature: number;
  setTemperature: (n: number) => void;
  highlights: number;
  setHighlights: (n: number) => void;
  shadows: number;
  setShadows: (n: number) => void;
  whites: number;
  setWhites: (n: number) => void;
  blacks: number;
  setBlacks: (n: number) => void;
  vibrance: number;
  setVibrance: (n: number) => void;
  clarity: number;
  setClarity: (n: number) => void;
  dehaze: number;
  setDehaze: (n: number) => void;
  vignette: number;
  setVignette: (n: number) => void;
  grain: number;
  setGrain: (n: number) => void;
  sharpen: number;
  setSharpen: (n: number) => void;
  tint: number;
  setTint: (n: number) => void;
  hue: number;
  setHue: (n: number) => void;
  filterPreset: ImageAdjustments['filterPreset'];
  setFilterPreset: (p: ImageAdjustments['filterPreset']) => void;
  gradientFrom?: string;
  setGradientFrom?: (c: string) => void;
  gradientTo?: string;
  setGradientTo?: (c: string) => void;
  strokeWidth?: number;
  setStrokeWidth?: (n: number) => void;
  strokeColor?: string;
  setStrokeColor?: (c: string) => void;
}

export default function ModernWatermarkControlsWrapper(props: WrapperProps) {
  // BUG FIX #1: Use props.logoUrl instead of null
  // map legacy logoUrls into WatermarkLogo objects in a stable way
  const mappedFromUrls = React.useMemo<WatermarkLogo[]>(() => {
    return (props.logoUrls || []).map((u, idx) => ({ id: `logo-${idx}-${String(u).slice(0,8)}`, dataUrl: u, position: { x: 0.5, y: 0.5 }, size: 100, rotation: 0, opacity: 100 } as WatermarkLogo));
  }, [props.logoUrls]);

  const config: WatermarkConfig = {
    text: props.watermarkText,
    // prefer richer logos passed down; otherwise use the mapped legacy urls
    logos: (props.logos && props.logos.length > 0) ? props.logos : mappedFromUrls,
    style: props.style,
    fontFamily: props.fontFamily,
    fontWeight: props.fontWeight,
    color: props.color,
    size: props.size,
    opacity: props.opacity,
    rotation: props.rotation,
    position: props.position,
    aiPlacement: props.aiPlacement,
    blendMode: props.blendMode,
    shadowIntensity: props.shadowIntensity,
    glowEffect: props.glowEffect
    ,
    gradientFrom: props.gradientFrom,
    gradientTo: props.gradientTo
    ,
    strokeWidth: props.strokeWidth,
    strokeColor: props.strokeColor
  };

  const adjustments: ImageAdjustments = {
    ...DEFAULT_ADJUSTMENTS,
    exposure: props.exposure,
    contrast: props.contrast,
    saturation: props.saturation,
    temperature: props.temperature,
    highlights: props.highlights,
    shadows: props.shadows,
    whites: props.whites,
    blacks: props.blacks,
    vibrance: props.vibrance,
    clarity: props.clarity,
    dehaze: props.dehaze,
    vignette: props.vignette,
    grain: props.grain,
    sharpen: props.sharpen,
    tint: props.tint,
    hue: props.hue,
    filterPreset: props.filterPreset
  };

  const setConfig = (newConfig: WatermarkConfig) => {
    console.log('Controls -> setConfig called:', newConfig);
    if (newConfig.text !== config.text) {
      props.setWatermarkText(newConfig.text);
    }
    // multiple logos
    // support both legacy logoUrls and new logos array
    // sync logos array if it changed
    if (newConfig.logos && JSON.stringify(newConfig.logos) !== JSON.stringify(config.logos || [])) {
      if (props.setLogos) props.setLogos(newConfig.logos || []);
      // also keep legacy logoUrls in sync for components still using them
      props.setLogoUrls((newConfig.logos || []).map((l: any) => (l.dataUrl || (l.url as string))));
    }
    if (newConfig.style !== config.style) {
      props.setStyle(newConfig.style);
    }
    if (newConfig.fontFamily !== config.fontFamily) {
      props.setFontFamily(newConfig.fontFamily);
    }
    if (newConfig.fontWeight !== config.fontWeight) {
      props.setFontWeight(newConfig.fontWeight);
    }
    if (newConfig.color !== config.color) {
      props.setColor(newConfig.color);
    }
    if (newConfig.size !== config.size) {
      props.setSize(newConfig.size);
    }
    if (newConfig.opacity !== config.opacity) {
      props.setOpacity(newConfig.opacity);
    }
    if (newConfig.rotation !== config.rotation) {
      props.setRotation(newConfig.rotation);
    }
    if (newConfig.position !== config.position) {
      props.setPosition(newConfig.position);
    }
    if (newConfig.aiPlacement !== config.aiPlacement) {
      props.setAiPlacement(newConfig.aiPlacement);
    }
    if (newConfig.blendMode !== config.blendMode) {
      props.setBlendMode(newConfig.blendMode);
    }
    if (newConfig.shadowIntensity !== config.shadowIntensity) {
      props.setShadowIntensity(newConfig.shadowIntensity);
    }
    if (newConfig.glowEffect !== config.glowEffect) {
      props.setGlowEffect(newConfig.glowEffect);
    }
    if (typeof newConfig.strokeWidth !== 'undefined' && newConfig.strokeWidth !== config.strokeWidth && props.setStrokeWidth) {
      props.setStrokeWidth(newConfig.strokeWidth);
    }
    if (typeof newConfig.strokeColor !== 'undefined' && newConfig.strokeColor !== config.strokeColor && props.setStrokeColor) {
      props.setStrokeColor(newConfig.strokeColor);
    }
  };

  const setAdjustments = (newAdj: ImageAdjustments) => {
    console.log('Controls -> setAdjustments called:', newAdj);
    if (newAdj.exposure !== adjustments.exposure) {
      props.setExposure(newAdj.exposure);
    }
    if (newAdj.contrast !== adjustments.contrast) {
      props.setContrast(newAdj.contrast);
    }
    if (newAdj.saturation !== adjustments.saturation) {
      props.setSaturation(newAdj.saturation);
    }
    if (newAdj.temperature !== adjustments.temperature) {
      props.setTemperature(newAdj.temperature);
    }
    if (newAdj.highlights !== adjustments.highlights) props.setHighlights(newAdj.highlights);
    if (newAdj.shadows !== adjustments.shadows) props.setShadows(newAdj.shadows);
    if (newAdj.whites !== adjustments.whites) props.setWhites(newAdj.whites);
    if (newAdj.blacks !== adjustments.blacks) props.setBlacks(newAdj.blacks);
    if (newAdj.vibrance !== adjustments.vibrance) props.setVibrance(newAdj.vibrance);
    if (newAdj.clarity !== adjustments.clarity) props.setClarity(newAdj.clarity);
    if (newAdj.dehaze !== adjustments.dehaze) props.setDehaze(newAdj.dehaze);
    if (newAdj.vignette !== adjustments.vignette) props.setVignette(newAdj.vignette);
    if (newAdj.grain !== adjustments.grain) props.setGrain(newAdj.grain);
    if (newAdj.sharpen !== adjustments.sharpen) props.setSharpen(newAdj.sharpen);
    if (newAdj.tint !== adjustments.tint) props.setTint(newAdj.tint);
    if (newAdj.hue !== adjustments.hue) props.setHue(newAdj.hue);
    if (newAdj.filterPreset !== adjustments.filterPreset) props.setFilterPreset(newAdj.filterPreset);
  };

  // BUG FIX #2: Handle null correctly - signature matches ProfessionalWatermarkControls
  // New API: controls will call this with the updated logos array
  const handleLogosUpdated = (logos: WatermarkLogo[]) => {
    console.log('Controls -> handleLogosUpdated:', logos);
    if (props.setLogos) props.setLogos(logos);
    // keep legacy logoUrls and single logoUrl in sync for older consumers
    const urls = (logos || []).map(l => l.dataUrl || '');
    props.setLogoUrls(urls);
    props.setLogoUrl(urls[urls.length - 1] ?? null);
  };

  

  return (
    <WatermarkControls
      config={config}
      setConfig={setConfig}
      adjustments={adjustments}
      setAdjustments={setAdjustments}
      onLogoUpload={handleLogosUpdated}
      logoInputRef={props.logoInputRef}
      // Hide image editing in the watermark tab (moved to Enhance)
      showImageEditing={false}
      strokeWidth={props.strokeWidth}
      setStrokeWidth={props.setStrokeWidth}
      strokeColor={props.strokeColor}
      setStrokeColor={props.setStrokeColor}
    />
  );
}