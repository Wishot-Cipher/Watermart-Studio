/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Zap, Type, Image, Sparkles, Contrast, Droplets, Thermometer, RotateCcw, Palette, Wand2 } from 'lucide-react';
import { WatermarkConfig, ImageAdjustments, FontKey, WatermarkStyle } from '@/types/watermark';

interface Props {
  config: WatermarkConfig;
  setConfig: (config: WatermarkConfig) => void;
  adjustments: ImageAdjustments;
  setAdjustments: (adj: ImageAdjustments) => void;
  onLogoUpload: (dataUrl: string | null) => void;
  logoInputRef: React.RefObject<HTMLInputElement | null>;
  onRemoveLogo?: (index: number) => void;
}

const Slider = ({ label, value, onChange, min = 0, max = 100, icon: Icon }: any) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-[#1A7CFF]" />
        <span className="text-sm font-medium text-[#F4F8FF]">{label}</span>
      </div>
      <span className="text-sm font-semibold text-[#1A7CFF] tabular-nums">
        {value > 0 && min < 0 ? '+' : ''}{value}
      </span>
    </div>
    <div className="relative h-2 bg-[#0A2540] rounded-full overflow-hidden">
      <div
        className="absolute h-full bg-gradient-to-r from-[#1A7CFF] to-[#A24BFF] transition-all duration-200"
        style={{ width: `${((value - min) / (max - min)) * 100}%` }}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute inset-0 w-full opacity-0 cursor-pointer"
      />
    </div>
  </div>
);

export default function ProfessionalWatermarkControls({
  config,
  setConfig,
  adjustments,
  setAdjustments,
  logoInputRef,
  onLogoUpload,
  onRemoveLogo
}: Props) {
  const styles: { id: WatermarkStyle; label: string; icon: string }[] = [
    { id: 'modern-glass', label: 'Glass', icon: '🔮' },
    { id: 'neon-glow', label: 'Neon', icon: '✨' },
    { id: 'elegant-serif', label: 'Elegant', icon: '🎩' },
    { id: 'bold-impact', label: 'Bold', icon: '💥' },
    { id: 'minimal-clean', label: 'Minimal', icon: '⚪' },
    { id: 'gradient-fade', label: 'Gradient', icon: '🌈' },
    { id: 'stamp-vintage', label: 'Vintage', icon: '📮' },
    { id: 'tech-futuristic', label: 'Tech', icon: '🚀' },
  ];

  const fonts: { id: FontKey; label: string }[] = [
    { id: 'inter', label: 'Inter' },
    { id: 'playfair', label: 'Playfair Display' },
    { id: 'montserrat', label: 'Montserrat' },
    { id: 'roboto-slab', label: 'Roboto Slab' },
    { id: 'pacifico', label: 'Pacifico' },
  ];

  const positions = [
    'top-left', 'top-center', 'top-right',
    'center-left', 'center', 'center-right',
    'bottom-left', 'bottom-center', 'bottom-right'
  ];

  return (
    <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 custom-scrollbar">
      {/* Text & Logo */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A7CFF]/10 to-transparent rounded-2xl blur-xl" />
        <div className="relative bg-[#031B2F]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-[#F4F8FF] uppercase tracking-wide flex items-center gap-2">
            <Type className="w-4 h-4 text-[#1A7CFF]" />
            Content
          </h3>
          
          <input
            type="text"
            value={config.text}
            onChange={(e) => setConfig({ ...config, text: e.target.value })}
            placeholder="Enter watermark text..."
            className="w-full bg-[#0A2540]/80 border border-white/10 focus:border-[#1A7CFF]/50 rounded-xl px-4 py-3 text-sm text-[#F4F8FF] placeholder:text-[#5A7089] outline-none transition-colors"
          />

          <div className="flex gap-2">
            <>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const f = e.target.files?.[0]
                  if (!f) return onLogoUpload(null)
                  const reader = new FileReader()
                  reader.onload = () => onLogoUpload(String(reader.result))
                  reader.readAsDataURL(f)
                }}
              />
              <button
                onClick={() => logoInputRef.current?.click()}
                className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#1A7CFF]/20 to-[#A24BFF]/10 border border-[#1A7CFF]/30 hover:border-[#1A7CFF]/50 text-sm font-medium text-[#F4F8FF] transition-all flex items-center justify-center gap-2"
              >
                <Image className="w-4 h-4" />
                {config.logoUrls && config.logoUrls.length > 0 ? 'Add Another Logo' : (config.logoUrl ? 'Change Logo' : 'Upload Logo')}
              </button>
            </>
            {(config.logoUrls && config.logoUrls.length > 0) ? (
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => setConfig({ ...config, logoUrls: [] , logoUrl: null })}
                  className="px-4 py-2.5 rounded-xl bg-[#FF5C5C]/10 border border-[#FF5C5C]/30 hover:border-[#FF5C5C]/50 text-sm font-medium text-[#FF5C5C] transition-all"
                >
                  Remove All
                </button>
              </div>
            ) : config.logoUrl ? (
              <button
                onClick={() => setConfig({ ...config, logoUrl: null })}
                className="px-4 py-2.5 rounded-xl bg-[#FF5C5C]/10 border border-[#FF5C5C]/30 hover:border-[#FF5C5C]/50 text-sm font-medium text-[#FF5C5C] transition-all"
              >
                Remove
              </button>
            ) : null}
          </div>

          {( (config.logoUrls && config.logoUrls.length > 0) || (config.logos && config.logos.length > 0) || config.logoUrl ) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-[#0A2540]/50 border border-white/5 overflow-auto"
            >
              <div className="flex gap-2 items-center">
                {config.logos && config.logos.length > 0 ? (
                  config.logos.map((logo, i) => (
                    <div key={i} className="relative flex flex-col items-center">
                      <img src={logo.url} alt={`logo-${i}`} className="w-12 h-12 object-contain rounded-lg bg-white/5 p-1" />
                      <input
                        type="number"
                        value={Math.round(((logo.scale || 1) * 100))}
                        onChange={(e) => {
                          const v = Math.max(10, Math.min(500, Number(e.target.value) || 100));
                          const next = (config.logos || []).map((l, idx) => idx === i ? { ...l, scale: v / 100 } : l);
                          setConfig({ ...config, logos: next });
                        }}
                        className="mt-2 w-16 bg-[#0A2540]/80 border border-white/10 rounded px-2 py-1 text-sm text-white"
                      />
                      <button onClick={() => onRemoveLogo && onRemoveLogo(i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-[10px]">×</button>
                    </div>
                  ))
                ) : (config.logoUrls && config.logoUrls.length > 0) ? (
                  config.logoUrls.map((url, i) => (
                    <div key={i} className="relative">
                      <img src={url} alt={`logo-${i}`} className="w-12 h-12 object-contain rounded-lg bg-white/5 p-1" />
                      <button onClick={() => onRemoveLogo && onRemoveLogo(i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-[10px]">×</button>
                    </div>
                  ))
                ) : (
                  <>
                    <img src={config.logoUrl || undefined} alt="Logo" className="w-12 h-12 object-contain rounded-lg bg-white/5 p-1" />
                    <div className="flex-1 text-xs text-[#9FB2C8]">Logo ready</div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Style Presets */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#A24BFF]/10 to-transparent rounded-2xl blur-xl" />
        <div className="relative bg-[#031B2F]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-[#F4F8FF] uppercase tracking-wide flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#A24BFF]" />
            Style Preset
          </h3>
          
          <div className="grid grid-cols-4 gap-2">
            {styles.map((s) => (
              <motion.button
                key={s.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setConfig({ ...config, style: s.id })}
                className={`relative p-3 rounded-xl transition-all ${
                  config.style === s.id
                    ? 'bg-gradient-to-br from-[#1A7CFF]/30 to-[#A24BFF]/20 border-2 border-[#1A7CFF] shadow-[0_0_20px_rgba(26,124,255,0.3)]'
                    : 'bg-[#0A2540]/50 border border-white/5 hover:border-[#1A7CFF]/30'
                }`}
              >
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className={`text-[10px] font-medium ${
                  config.style === s.id ? 'text-[#F4F8FF]' : 'text-[#9FB2C8]'
                }`}>
                  {s.label}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Typography */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A7CFF]/10 to-transparent rounded-2xl blur-xl" />
        <div className="relative bg-[#031B2F]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-[#F4F8FF] uppercase tracking-wide flex items-center gap-2">
            <Type className="w-4 h-4 text-[#1A7CFF]" />
            Typography
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-[#9FB2C8] mb-2 block">Font</label>
              <select
                value={config.fontFamily}
                onChange={(e) => setConfig({ ...config, fontFamily: e.target.value as FontKey })}
                className="w-full bg-[#0A2540]/80 border border-white/10 rounded-xl px-3 py-2 text-sm text-[#F4F8FF] outline-none cursor-pointer"
              >
                {fonts.map((f) => (
                  <option key={f.id} value={f.id}>{f.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="text-xs font-medium text-[#9FB2C8] mb-2 block">Weight</label>
              <select
                value={config.fontWeight}
                onChange={(e) => setConfig({ ...config, fontWeight: e.target.value as any })}
                className="w-full bg-[#0A2540]/80 border border-white/10 rounded-xl px-3 py-2 text-sm text-[#F4F8FF] outline-none cursor-pointer"
              >
                <option value="400">Regular</option>
                <option value="600">Semibold</option>
                <option value="700">Bold</option>
                <option value="800">Extra Bold</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[#9FB2C8] mb-2 block">Color</label>
            <div className="flex gap-2">
              <div className="relative">
                <input
                  type="color"
                  value={config.color}
                  onChange={(e) => setConfig({ ...config, color: e.target.value })}
                  className="w-16 h-10 rounded-xl border-2 border-white/10 cursor-pointer bg-transparent"
                  style={{
                    WebkitAppearance: 'none',
                    appearance: 'none'
                  }}
                />
                <div
                  className="absolute inset-1 rounded-lg pointer-events-none"
                  style={{ backgroundColor: config.color }}
                />
              </div>
              <input
                type="text"
                value={config.color}
                onChange={(e) => {
                  const val = e.target.value
                  if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                    setConfig({ ...config, color: val })
                  }
                }}
                className="flex-1 bg-[#0A2540]/80 border border-white/10 rounded-xl px-3 py-2 text-sm text-[#F4F8FF] outline-none font-mono uppercase"
                placeholder="#FFFFFF"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Position */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A7CFF]/10 to-transparent rounded-2xl blur-xl" />
        <div className="relative bg-[#031B2F]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#F4F8FF] uppercase tracking-wide flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-[#1A7CFF]" />
              Position
            </h3>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.aiPlacement}
                onChange={(e) => setConfig({ ...config, aiPlacement: e.target.checked })}
                className="w-4 h-4 rounded border-white/20 bg-[#0A2540] text-[#1A7CFF] focus:ring-0"
              />
              <span className="text-xs font-medium text-[#9FB2C8]">AI Detect Faces</span>
            </label>
          </div>
          
          <div className="grid grid-cols-3 grid-rows-3 gap-2 aspect-square">
            {positions.map((pos) => (
              <motion.button
                key={pos}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setConfig({ ...config, position: pos })}
                className={`rounded-lg transition-all ${
                  config.position === pos
                    ? 'bg-gradient-to-br from-[#1A7CFF] to-[#A24BFF] shadow-[0_0_15px_rgba(26,124,255,0.5)]'
                    : 'bg-[#0A2540]/50 hover:bg-[#0F2F50]'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Transform */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A7CFF]/10 to-transparent rounded-2xl blur-xl" />
        <div className="relative bg-[#031B2F]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-[#F4F8FF] uppercase tracking-wide flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#1A7CFF]" />
            Transform
          </h3>
          
          <Slider
            label="Size"
            value={config.size}
            onChange={(v: number) => setConfig({ ...config, size: v })}
            icon={Zap}
          />
          <Slider
            label="Image Scale (%)"
            value={Math.round(((config.imageScale || 1) * 100))}
            onChange={(v: number) => setConfig({ ...config, imageScale: v / 100 })}
            icon={Image}
            min={50}
            max={200}
          />
          <Slider
            label="Opacity"
            value={config.opacity}
            onChange={(v: number) => setConfig({ ...config, opacity: v })}
            icon={Eye}
          />
          <Slider
            label="Rotation"
            value={config.rotation}
            onChange={(v: number) => setConfig({ ...config, rotation: v })}
            icon={RotateCcw}
            min={-45}
            max={45}
          />
        </div>
      </div>

      {/* Effects */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#A24BFF]/10 to-transparent rounded-2xl blur-xl" />
        <div className="relative bg-[#031B2F]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-[#F4F8FF] uppercase tracking-wide flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#A24BFF]" />
            Effects
          </h3>
          
          <div>
            <label className="text-xs font-medium text-[#9FB2C8] mb-2 block">Blend Mode</label>
            <div className="grid grid-cols-2 gap-2">
              {['normal', 'multiply', 'screen', 'overlay', 'soft-light', 'hard-light'].map((mode) => (
                <motion.button
                  key={mode}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setConfig({ ...config, blendMode: mode })}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    config.blendMode === mode
                      ? 'bg-gradient-to-r from-[#1A7CFF] to-[#0D6EF5] text-white'
                      : 'bg-[#0A2540]/50 text-[#9FB2C8] hover:bg-[#0F2F50]'
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1).replace('-', ' ')}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-sm font-medium text-[#F4F8FF]">Glow Effect</span>
            <label className="relative inline-block w-12 h-6 cursor-pointer">
              <input
                type="checkbox"
                checked={config.glowEffect}
                onChange={(e) => setConfig({ ...config, glowEffect: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-[#0A2540] rounded-full peer peer-checked:bg-gradient-to-r peer-checked:from-[#1A7CFF] peer-checked:to-[#0D6EF5] transition-all" />
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6 shadow-md" />
            </label>
          </div>

          <Slider
            label="Shadow"
            value={config.shadowIntensity}
            onChange={(v: number) => setConfig({ ...config, shadowIntensity: v })}
            icon={Contrast}
          />
        </div>
      </div>

      {/* Image Adjustments */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A7CFF]/10 to-transparent rounded-2xl blur-xl" />
        <div className="relative bg-[#031B2F]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-[#F4F8FF] uppercase tracking-wide flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#1A7CFF]" />
            Image Adjustments
          </h3>
          
          <Slider
            label="Exposure"
            value={adjustments.exposure}
            onChange={(v: number) => setAdjustments({ ...adjustments, exposure: v })}
            icon={Sparkles}
            min={-100}
            max={100}
          />
          <Slider
            label="Contrast"
            value={adjustments.contrast}
            onChange={(v: number) => setAdjustments({ ...adjustments, contrast: v })}
            icon={Contrast}
            min={-100}
            max={100}
          />
          <Slider
            label="Saturation"
            value={adjustments.saturation}
            onChange={(v: number) => setAdjustments({ ...adjustments, saturation: v })}
            icon={Droplets}
            min={-100}
            max={100}
          />
          <Slider
            label="Temperature"
            value={adjustments.temperature}
            onChange={(v: number) => setAdjustments({ ...adjustments, temperature: v })}
            icon={Thermometer}
            min={-100}
            max={100}
          />
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(10, 37, 64, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #1A7CFF, #A24BFF);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #0D6EF5, #8C3FCC);
        }
      `}</style>
    </div>
  );
}