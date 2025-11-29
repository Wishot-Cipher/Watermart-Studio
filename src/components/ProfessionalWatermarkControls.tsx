import React from 'react'
import WatermarkControls from './WatermarkControls'
import { FontKey, WatermarkStyle, WatermarkLogo, DEFAULT_ADJUSTMENTS } from '@/types/watermark'

type Props = {
  watermarkText: string
  setWatermarkText: (s: string) => void
  logoUrl: string | null
  setLogoUrl: (u: string | null) => void
  logoInputRef: React.RefObject<HTMLInputElement | null>
  style: WatermarkStyle
  setStyle: (s: WatermarkStyle) => void
  fontFamily: FontKey
  setFontFamily: (k: FontKey) => void
  fontWeight: '400'|'600'|'700'|'800'
  setFontWeight: (w: '400'|'600'|'700'|'800') => void
  color: string
  setColor: (c: string) => void
  size: number
  setSize: (n: number) => void
  opacity: number
  setOpacity: (n: number) => void
  rotation: number
  setRotation: (n: number) => void
  position: string
  setPosition: (s: string) => void
  aiPlacement: boolean
  setAiPlacement: (b: boolean) => void
  blendMode: string
  setBlendMode: (s: string) => void
  shadowIntensity: number
  setShadowIntensity: (n: number) => void
  glowEffect: boolean
  setGlowEffect: (b: boolean) => void
  exposure: number
  setExposure: (n: number) => void
  contrast: number
  setContrast: (n: number) => void
  saturation: number
  setSaturation: (n: number) => void
  temperature: number
  setTemperature: (n: number) => void
  // pass-through state not managed here but required by WatermarkPreview
  watermarkType?: string
}

export default function ModernWatermarkControls(props: Props) {
  const {
    watermarkText, setWatermarkText, logoUrl, setLogoUrl, logoInputRef,
    style, setStyle, fontFamily, setFontFamily, fontWeight, setFontWeight,
    color, setColor, size, setSize, opacity, setOpacity, rotation, setRotation,
    position, setPosition, aiPlacement, setAiPlacement, blendMode, setBlendMode,
    shadowIntensity, setShadowIntensity, glowEffect, setGlowEffect,
    exposure, setExposure, contrast, setContrast, saturation, setSaturation, temperature, setTemperature,
  } = props

  // Map the prop names expected by the existing `WatermarkControls` component
  // Build `config` and `adjustments` objects expected by `WatermarkControls`
  const config = {
    text: watermarkText,
    // prefer passing logos array to new controls; if a single `logoUrl` exists map it to a single WatermarkLogo
    logos: (logoUrl ? [{ id: `logo-0-${String(logoUrl).slice(0,8)}`, dataUrl: logoUrl, position: { x: 0.9, y: 0.9 }, size: 100, rotation: 0, opacity: 100 } as WatermarkLogo] : []) as WatermarkLogo[],
    style,
    fontFamily,
    fontWeight,
    color,
    size,
    opacity,
    rotation,
    position,
    aiPlacement,
    blendMode,
    shadowIntensity,
    glowEffect
  }

  const adjustments = {
    ...DEFAULT_ADJUSTMENTS,
    exposure,
    contrast,
    saturation,
    temperature
  }

  const setConfig = (c: Partial<import('@/types/watermark').WatermarkConfig>) => {
    if (typeof c.text === 'string') setWatermarkText(c.text)
    if ('logos' in c && Array.isArray(c.logos)) {
      const last = c.logos.length > 0 ? (c.logos[c.logos.length - 1] as WatermarkLogo) : null;
      setLogoUrl(last ? last.dataUrl : null);
    }
    if (c.style) setStyle(c.style)
    if (c.fontFamily) setFontFamily(c.fontFamily)
    if (c.fontWeight) setFontWeight(c.fontWeight)
    if (c.color) setColor(c.color)
    if (typeof c.size === 'number') setSize(c.size)
    if (typeof c.opacity === 'number') setOpacity(c.opacity)
    if (typeof c.rotation === 'number') setRotation(c.rotation)
    if (c.position) setPosition(c.position)
    if (typeof c.aiPlacement === 'boolean') setAiPlacement(c.aiPlacement)
    if (c.blendMode) setBlendMode(c.blendMode)
    if (typeof c.shadowIntensity === 'number') setShadowIntensity(c.shadowIntensity)
    if (typeof c.glowEffect === 'boolean') setGlowEffect(c.glowEffect)
  }

  const setAdjustments = (a: Partial<import('@/types/watermark').ImageAdjustments>) => {
    if (typeof a.exposure === 'number') setExposure(a.exposure)
    if (typeof a.contrast === 'number') setContrast(a.contrast)
    if (typeof a.saturation === 'number') setSaturation(a.saturation)
    if (typeof a.temperature === 'number') setTemperature(a.temperature)
  }

  return (
    <WatermarkControls
      config={config}
      setConfig={setConfig}
      adjustments={adjustments}
      setAdjustments={setAdjustments}
      onLogoUpload={(logos: WatermarkLogo[]) => {
        // controls emit full logos array; map to single legacy logoUrl for callers that expect it
        const last = logos && logos.length > 0 ? logos[logos.length - 1].dataUrl : null;
        setLogoUrl(last);
      }}
      logoInputRef={logoInputRef}
    />
  )
}
