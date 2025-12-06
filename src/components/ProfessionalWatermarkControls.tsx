import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontKey, WatermarkStyle } from '@/types/watermark';
import { Palette, Type, Sparkles, Wand2, LayoutGrid } from 'lucide-react';
import { getPresetsByCategory, applyPreset } from '../utils/watermarkPresets';

interface ProfessionalWatermarkControlsProps {
  // Text controls
  text: string;
  setText: (text: string) => void;
  fontFamily: FontKey;
  setFontFamily: (font: FontKey) => void;
  fontWeight: '400' | '600' | '700' | '800';
  setFontWeight: (weight: '400' | '600' | '700' | '800') => void;
  
  // Style controls
  style: WatermarkStyle;
  setStyle: (style: WatermarkStyle) => void;
  color: string;
  setColor: (color: string) => void;
  size: number;
  setSize: (size: number) => void;
  opacity: number;
  setOpacity: (opacity: number) => void;
  rotation: number;
  setRotation: (rotation: number) => void;
  
  // Typography controls
  letterSpacing: number;
  setLetterSpacing: (spacing: number) => void;
  lineHeight: number;
  setLineHeight: (height: number) => void;
  textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  setTextTransform: (transform: 'none' | 'uppercase' | 'lowercase' | 'capitalize') => void;
  
  // Shadow controls
  shadowIntensity: number;
  setShadowIntensity: (intensity: number) => void;
  shadowBlur: number;
  setShadowBlur: (blur: number) => void;
  shadowColor: string;
  setShadowColor: (color: string) => void;
  
  // Glow controls
  glowEffect: boolean;
  setGlowEffect: (enabled: boolean) => void;
  glowIntensity: number;
  setGlowIntensity: (intensity: number) => void;
  glowColor: string;
  setGlowColor: (color: string) => void;
  
  // Stroke controls
  strokeWidth: number;
  setStrokeWidth: (width: number) => void;
  strokeColor: string;
  setStrokeColor: (color: string) => void;
  
  // Pattern controls
  pattern: 'none' | 'tiled' | 'diagonal' | 'grid' | 'scattered' | 'border';
  setPattern: (pattern: 'none' | 'tiled' | 'diagonal' | 'grid' | 'scattered' | 'border') => void;
  patternSpacing: number;
  setPatternSpacing: (spacing: number) => void;
  
  // Gradient controls
  gradientFrom?: string;
  setGradientFrom?: (color: string) => void;
  gradientTo?: string;
  setGradientTo?: (color: string) => void;
}

type TabKey = 'text' | 'style' | 'effects' | 'presets';

const FONT_CATEGORIES = {
  serif: ['playfair', 'roboto-slab'] as FontKey[],
  'sans-serif': ['inter', 'montserrat'] as FontKey[],
  script: ['pacifico'] as FontKey[],
};

const STYLE_GROUPS = {
  modern: ['modern-glass', 'minimal-clean', 'tech-futuristic'] as WatermarkStyle[],
  professional: ['elegant-serif', 'bold-impact'] as WatermarkStyle[],
  artistic: ['neon-glow', 'gradient-fade'] as WatermarkStyle[],
  vintage: ['stamp-vintage'] as WatermarkStyle[],
};

const ProfessionalWatermarkControls = memo(function ProfessionalWatermarkControls(props: ProfessionalWatermarkControlsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('text');

  const tabs = [
    { key: 'text' as TabKey, label: 'Text', icon: Type },
    { key: 'style' as TabKey, label: 'Style', icon: Palette },
    { key: 'effects' as TabKey, label: 'Effects', icon: Sparkles },
    { key: 'presets' as TabKey, label: 'Presets', icon: Wand2 },
  ];

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex gap-2 p-1 bg-slate-800/50 rounded-lg">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all ${
              activeTab === tab.key
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="text-sm font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          {activeTab === 'text' && (
            <>
              {/* Watermark Text */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Watermark Text</label>
                <input
                  type="text"
                  value={props.text}
                  onChange={(e) => props.setText(e.target.value)}
                  placeholder="Enter watermark text..."
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Font Family */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Font</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(FONT_CATEGORIES).map(([category, fonts]) => (
                    <div key={category} className="space-y-1">
                      <span className="text-xs text-slate-500 uppercase tracking-wider">{category}</span>
                      {fonts.map(font => (
                        <button
                          key={font}
                          onClick={() => props.setFontFamily(font)}
                          className={`w-full px-3 py-2 rounded-md text-sm transition-all ${
                            props.fontFamily === font
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700'
                          }`}
                          style={{ fontFamily: font }}
                        >
                          {font}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Font Weight */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Font Weight</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['400', '600', '700', '800'] as const).map(weight => (
                    <button
                      key={weight}
                      onClick={() => props.setFontWeight(weight)}
                      className={`px-3 py-2 rounded-md text-sm transition-all ${
                        props.fontWeight === weight
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {weight}
                    </button>
                  ))}
                </div>
              </div>

              {/* Typography Controls */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Letter Spacing</label>
                  <input
                    type="range"
                    min="-50"
                    max="100"
                    value={props.letterSpacing}
                    onChange={(e) => props.setLetterSpacing(Number(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-xs text-slate-500">{props.letterSpacing}</span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Line Height</label>
                  <input
                    type="range"
                    min="0.8"
                    max="2.0"
                    step="0.1"
                    value={props.lineHeight}
                    onChange={(e) => props.setLineHeight(Number(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-xs text-slate-500">{props.lineHeight.toFixed(1)}</span>
                </div>
              </div>

              {/* Text Transform */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Text Transform</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['none', 'uppercase', 'lowercase', 'capitalize'] as const).map(transform => (
                    <button
                      key={transform}
                      onClick={() => props.setTextTransform(transform)}
                      className={`px-3 py-2 rounded-md text-xs transition-all ${
                        props.textTransform === transform
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {transform}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'style' && (
            <>
              {/* Watermark Style */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Style</label>
                {Object.entries(STYLE_GROUPS).map(([group, styles]) => (
                  <div key={group} className="mb-4">
                    <span className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">{group}</span>
                    <div className="grid grid-cols-2 gap-2">
                      {styles.map(style => (
                        <button
                          key={style}
                          onClick={() => props.setStyle(style)}
                          className={`px-3 py-2 rounded-md text-sm transition-all ${
                            props.style === style
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {style.replace(/-/g, ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Color & Size */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Color</label>
                  <input
                    type="color"
                    value={props.color}
                    onChange={(e) => props.setColor(e.target.value)}
                    className="w-full h-10 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Size: {props.size}</label>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    value={props.size}
                    onChange={(e) => props.setSize(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Opacity & Rotation */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Opacity: {props.opacity}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={props.opacity}
                    onChange={(e) => props.setOpacity(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Rotation: {props.rotation}°</label>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    value={props.rotation}
                    onChange={(e) => props.setRotation(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Gradient Colors */}
              {props.gradientFrom && props.setGradientFrom && props.gradientTo && props.setGradientTo && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Gradient From</label>
                    <input
                      type="color"
                      value={props.gradientFrom}
                      onChange={(e) => props.setGradientFrom?.(e.target.value)}
                      className="w-full h-10 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Gradient To</label>
                    <input
                      type="color"
                      value={props.gradientTo}
                      onChange={(e) => props.setGradientTo?.(e.target.value)}
                      className="w-full h-10 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'effects' && (
            <>
              {/* Shadow Controls */}
              <div className="space-y-4 p-4 bg-slate-800/30 rounded-lg">
                <h3 className="text-sm font-semibold text-slate-300">Shadow</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Intensity: {props.shadowIntensity}</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={props.shadowIntensity}
                      onChange={(e) => props.setShadowIntensity(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Blur: {props.shadowBlur}</label>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={props.shadowBlur}
                      onChange={(e) => props.setShadowBlur(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Shadow Color</label>
                  <input
                    type="color"
                    value={props.shadowColor}
                    onChange={(e) => props.setShadowColor(e.target.value)}
                    className="w-full h-10 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Glow Controls */}
              <div className="space-y-4 p-4 bg-slate-800/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-300">Glow</h3>
                  <button
                    onClick={() => props.setGlowEffect(!props.glowEffect)}
                    className={`px-3 py-1 rounded-md text-xs transition-all ${
                      props.glowEffect
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-400'
                    }`}
                  >
                    {props.glowEffect ? 'On' : 'Off'}
                  </button>
                </div>
                {props.glowEffect && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Intensity: {props.glowIntensity}</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={props.glowIntensity}
                        onChange={(e) => props.setGlowIntensity(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Glow Color</label>
                      <input
                        type="color"
                        value={props.glowColor}
                        onChange={(e) => props.setGlowColor(e.target.value)}
                        className="w-full h-10 rounded-lg cursor-pointer"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Stroke Controls */}
              <div className="space-y-4 p-4 bg-slate-800/30 rounded-lg">
                <h3 className="text-sm font-semibold text-slate-300">Stroke</h3>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Width: {props.strokeWidth}</label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={props.strokeWidth}
                    onChange={(e) => props.setStrokeWidth(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                {props.strokeWidth > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Stroke Color</label>
                    <input
                      type="color"
                      value={props.strokeColor}
                      onChange={(e) => props.setStrokeColor(e.target.value)}
                      className="w-full h-10 rounded-lg cursor-pointer"
                    />
                  </div>
                )}
              </div>

              {/* Pattern Controls */}
              <div className="space-y-4 p-4 bg-slate-800/30 rounded-lg">
                <h3 className="text-sm font-semibold text-slate-300">Pattern</h3>
                <div className="grid grid-cols-3 gap-2">
                  {(['none', 'tiled', 'diagonal', 'grid', 'scattered', 'border'] as const).map(p => (
                    <button
                      key={p}
                      onClick={() => props.setPattern(p)}
                      className={`px-3 py-2 rounded-md text-xs transition-all ${
                        props.pattern === p
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                {props.pattern !== 'none' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Spacing: {props.patternSpacing}px</label>
                    <input
                      type="range"
                      min="50"
                      max="500"
                      step="10"
                      value={props.patternSpacing}
                      onChange={(e) => props.setPatternSpacing(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'presets' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Wand2 className="w-5 h-5 text-blue-500" />
                <h3 className="text-sm font-semibold text-slate-200">Professional Presets</h3>
              </div>

              {/* Preset Categories */}
              {(['photographer', 'brand', 'copyright', 'creative', 'professional'] as const).map(category => {
                const categoryPresets = getPresetsByCategory(category);
                if (categoryPresets.length === 0) return null;

                return (
                  <div key={category} className="space-y-3">
                    <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                      {category}
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {categoryPresets.map(preset => (
                        <motion.button
                          key={preset.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            const config = applyPreset(preset, props.text);
                            // Apply all preset values
                            if (config.style) props.setStyle(config.style);
                            if (config.fontFamily) props.setFontFamily(config.fontFamily);
                            if (config.fontWeight) props.setFontWeight(config.fontWeight);
                            if (config.size !== undefined) props.setSize(config.size);
                            if (config.opacity !== undefined) props.setOpacity(config.opacity);
                            if (config.color) props.setColor(config.color);
                            if (config.rotation !== undefined) props.setRotation(config.rotation);
                            if (config.letterSpacing !== undefined) props.setLetterSpacing(config.letterSpacing);
                            if (config.lineHeight !== undefined) props.setLineHeight(config.lineHeight);
                            if (config.textTransform) props.setTextTransform(config.textTransform);
                            if (config.shadowIntensity !== undefined) props.setShadowIntensity(config.shadowIntensity);
                            if (config.shadowBlur !== undefined) props.setShadowBlur(config.shadowBlur);
                            if (config.shadowColor) props.setShadowColor(config.shadowColor);
                            if (config.glowEffect !== undefined) props.setGlowEffect(config.glowEffect);
                            if (config.glowIntensity !== undefined) props.setGlowIntensity(config.glowIntensity);
                            if (config.glowColor) props.setGlowColor(config.glowColor);
                            if (config.strokeWidth !== undefined) props.setStrokeWidth(config.strokeWidth);
                            if (config.strokeColor) props.setStrokeColor(config.strokeColor);
                            if (config.pattern) props.setPattern(config.pattern);
                            if (config.patternSpacing !== undefined) props.setPatternSpacing(config.patternSpacing);
                            if (config.gradientFrom && props.setGradientFrom) props.setGradientFrom(config.gradientFrom);
                            if (config.gradientTo && props.setGradientTo) props.setGradientTo(config.gradientTo);
                          }}
                          className="relative p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/50 rounded-lg text-left transition-all group"
                        >
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Sparkles className="w-4 h-4 text-blue-400" />
                          </div>
                          <h5 className="text-sm font-semibold text-slate-200 mb-1">
                            {preset.name}
                          </h5>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            {preset.description}
                          </p>
                          
                          {/* Visual preview indicators */}
                          <div className="mt-3 flex gap-1">
                            {preset.config.glowEffect && (
                              <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                            )}
                            {preset.config.gradientFrom && preset.config.gradientTo && (
                              <div 
                                className="w-4 h-2 rounded-full"
                                style={{
                                  background: `linear-gradient(to right, ${preset.config.gradientFrom}, ${preset.config.gradientTo})`
                                }}
                              />
                            )}
                            {preset.config.pattern && preset.config.pattern !== 'none' && (
                              <LayoutGrid className="w-3 h-3 text-slate-400" />
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
});

export default ProfessionalWatermarkControls;
