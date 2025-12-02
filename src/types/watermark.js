// ===================================================================
// src/types/watermark.ts
// ENHANCED WITH MULTI-LOGO AND ADVANCED FEATURES
// ===================================================================
export const DEFAULT_ADJUSTMENTS = {
    exposure: 0,
    contrast: 0,
    saturation: 0,
    temperature: 0,
    highlights: 0,
    shadows: 0,
    whites: 0,
    blacks: 0,
    vibrance: 0,
    clarity: 0,
    dehaze: 0,
    vignette: 0,
    grain: 0,
    sharpen: 0,
    tint: 0,
    hue: 0,
    filterPreset: 'none'
};
export const EXPORT_QUALITY_SETTINGS = {
    normal: { quality: 0.75, maxDimension: 1280 },
    standard: { quality: 0.85, maxDimension: 1920 },
    // Canva-like targets: keep HD and Ultra modest to avoid huge downloads
    hd: { quality: 0.87, maxDimension: 2036 },
    ultra: { quality: 1.0, maxDimension: 2548 }
};
