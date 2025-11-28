/* eslint-disable @typescript-eslint/no-explicit-any */
// ===================================================================
// src/components/ModernWatermarkControlsWrapper.tsx
// FULLY CORRECTED - ALL BUGS FIXED
// ===================================================================

import React from 'react';
import WatermarkControls from './WatermarkControls';
import { WatermarkConfig, ImageAdjustments, FontKey, WatermarkStyle } from '@/types/watermark';

interface WrapperProps {
  watermarkText: string;
  setWatermarkText: (s: string) => void;
  logoUrl: string | null;
  logoUrls: string[];
  logos?: Array<{ url: string; scale?: number; x?: number; y?: number; opacity?: number; rotation?: number }>;
  setLogoUrl: (u: string | null) => void;
  setLogoUrls: (u: string[]) => void;
  setLogos?: (v: Array<{ url: string; scale?: number; x?: number; y?: number; opacity?: number; rotation?: number }>) => void;
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
}

export default function ModernWatermarkControlsWrapper(props: WrapperProps) {
  // BUG FIX #1: Use props.logoUrl instead of null
  const config: WatermarkConfig = {
    text: props.watermarkText,
    logoUrl: props.logoUrl, // ← CRITICAL FIX: was hardcoded to null
    logoUrls: props.logoUrls,
    // map legacy url array into richer logos metadata with default scale=1
    logos: (props.logos && props.logos.length > 0) ? props.logos : (props.logoUrls || []).map(u => ({ url: u, scale: 1 })),
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
  };

  const adjustments: ImageAdjustments = {
    exposure: props.exposure,
    contrast: props.contrast,
    saturation: props.saturation,
    temperature: props.temperature
  };

  const setConfig = (newConfig: WatermarkConfig) => {
    console.log('Controls -> setConfig called:', newConfig);
    if (newConfig.text !== config.text) {
      props.setWatermarkText(newConfig.text);
    }
    if (newConfig.logoUrl !== config.logoUrl) {
      // keep single logoUrl in sync
      props.setLogoUrl(newConfig.logoUrl);
    }
    // multiple logos
    // support both legacy logoUrls and new logos array
    if (newConfig.logoUrls && JSON.stringify(newConfig.logoUrls) !== JSON.stringify(config.logoUrls || [])) {
      props.setLogoUrls(newConfig.logoUrls || []);
    }
    if (newConfig.logos && JSON.stringify(newConfig.logos) !== JSON.stringify(config.logos || [])) {
      // if parent provided a setLogos handler, pass full objects; otherwise sync urls
      if (props.setLogos) props.setLogos(newConfig.logos || []);
      else props.setLogoUrls((newConfig.logos || []).map((l: any) => l.url));
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
  };

  // BUG FIX #2: Handle null correctly - signature matches ProfessionalWatermarkControls
  const handleLogoUpload = (dataUrl: string | null) => {
    console.log('Controls -> handleLogoUpload:', dataUrl);
    if (!dataUrl) return props.setLogoUrl(null);
    // add to logoUrls list and also set legacy single url
    const next = [...(props.logoUrls || []), dataUrl];
    props.setLogoUrls(next);
    props.setLogoUrl(dataUrl);
    if (props.setLogos) {
      const full = [...(props.logos || []), { url: dataUrl, scale: 1 }];
      props.setLogos(full);
    }
  };

  const handleRemoveLogo = (index: number) => {
    const next = (props.logoUrls || []).filter((_, i) => i !== index);
    props.setLogoUrls(next);
    props.setLogoUrl(next[0] ?? null);
  };

  return (
    <WatermarkControls
      config={config}
      setConfig={setConfig}
      adjustments={adjustments}
      setAdjustments={setAdjustments}
      onLogoUpload={handleLogoUpload}
      logoInputRef={props.logoInputRef}
      onRemoveLogo={handleRemoveLogo}
    />
  );
}