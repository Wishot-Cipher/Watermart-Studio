/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye, Zap, Type, Image as ImageIcon, Sparkles, Contrast, Droplets, 
  Thermometer, RotateCcw, Palette, Sun, Moon, Aperture,
  Scissors, Film, Wind, X, Plus, Lock, Unlock, RotateCw, Maximize2
} from 'lucide-react';
import { WatermarkConfig, ImageAdjustments, FontKey, WatermarkStyle, WatermarkLogo } from '@/types/watermark';

interface Props {
  config: WatermarkConfig;
  setConfig: (config: WatermarkConfig) => void;
  adjustments: ImageAdjustments;
  setAdjustments: (adj: ImageAdjustments) => void;
  onLogoUpload: (logos: WatermarkLogo[]) => void;
  logoInputRef: React.RefObject<HTMLInputElement | null>;
  showImageEditing?: boolean;
  strokeWidth?: number;
  setStrokeWidth?: (n: number) => void;
  strokeColor?: string;
  setStrokeColor?: (c: string) => void;
}

const Slider = ({ label, value, onChange, min = 0, max = 100, icon: Icon, step = 1 }: any) => (
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
        className="absolute h-full bg-linear-to-r from-[#1A7CFF] to-[#A24BFF] transition-all duration-200"
        style={{ width: `${((value - min) / (max - min)) * 100}%` }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute inset-0 w-full opacity-0 cursor-pointer"
      />
    </div>
  </div>
);

export default function EnhancedWatermarkControls({
  config,
  setConfig,
  adjustments,
  setAdjustments,
  logoInputRef,
  onLogoUpload,
  showImageEditing,
  setStrokeWidth,
  setStrokeColor
}: Props) {
  const [selectedLogo, setSelectedLogo] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'basic' | 'advanced' | 'color'>('basic');

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

  const filterPresets = [
    { id: 'none', label: 'Original', icon: '📷' },
    { id: 'vivid', label: 'Vivid', icon: '🎨' },
    { id: 'dramatic', label: 'Dramatic', icon: '🌃' },
    { id: 'warm', label: 'Warm', icon: '🌅' },
    { id: 'cool', label: 'Cool', icon: '❄️' },
    { id: 'vintage', label: 'Vintage', icon: '📸' },
    { id: 'bw', label: 'B&W', icon: '⚫' },
    { id: 'cinematic', label: 'Cinematic', icon: '🎬' },
    { id: 'portrait', label: 'Portrait', icon: '💁‍♀️' },
    { id: 'hdr', label: 'HDR', icon: '🌈' },
    { id: 'matte', label: 'Matte', icon: '🪄' },
    { id: 'film', label: 'Film', icon: '🎞️' },
    { id: 'moody', label: 'Moody', icon: '🌒' },
    { id: 'pro', label: 'Pro', icon: '📸' },
    { id: 'golden-hour', label: 'Golden Hour', icon: '🌇' },
    { id: 'magazine-cover', label: 'Magazine', icon: '📰' },
    { id: 'teal-orange', label: 'Teal & Orange', icon: '🟦🟧' },
    { id: 'fashion-editorial', label: 'Fashion', icon: '👗' },
    { id: 'neon-pop', label: 'Neon Pop', icon: '💡' },
    { id: 'cyberpunk', label: 'Cyberpunk', icon: '🤖' },
    { id: 'tropical-vibes', label: 'Tropical', icon: '🌴' },
    { id: 'ocean-depth', label: 'Ocean', icon: '🌊' },
    { id: 'autumn-warmth', label: 'Autumn', icon: '🍂' },
    { id: 'sunset-glow', label: 'Sunset', icon: '🌇' },
    { id: 'luxury-gold', label: 'Luxury Gold', icon: '🥇' },
    { id: 'arctic-blue', label: 'Arctic Blue', icon: '🧊' },
    { id: 'nordic-minimal', label: 'Nordic', icon: '❄️' },
    { id: 'pastel-dream', label: 'Pastel', icon: '🌸' },
    { id: 'urban-grit', label: 'Urban Grit', icon: '🏙️' }
  ];

  const handleMultipleLogoUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newLogos: WatermarkLogo[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      
      await new Promise<void>((resolve) => {
        reader.onload = () => {
          const logo: WatermarkLogo = {
            id: `logo-${Date.now()}-${i}`,
            dataUrl: String(reader.result),
            position: { x: 0.9, y: 0.9 - (i * 0.15) }, // Stack logos
            size: 100,
            rotation: 0,
            opacity: 100,
            locked: false
          };
          newLogos.push(logo);
          resolve();
        };
        reader.readAsDataURL(file);
      });
    }

    onLogoUpload([...config.logos, ...newLogos]);
  };

  const updateLogo = (id: string, updates: Partial<WatermarkLogo>) => {
    const updated = config.logos.map(logo =>
      logo.id === id ? { ...logo, ...updates } : logo
    );
    setConfig({ ...config, logos: updated });
  };

  const deleteLogo = (id: string) => {
    setConfig({ ...config, logos: config.logos.filter(l => l.id !== id) });
    if (selectedLogo === id) setSelectedLogo(null);
  };

  const selectedLogoData = config.logos.find(l => l.id === selectedLogo);

  return (
    <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 custom-scrollbar">
      
      {/* LOGO MANAGEMENT SECTION */}
      <div className="relative">
        <div className="absolute inset-0 bg-linear-to-br from-[#A24BFF]/10 to-transparent rounded-2xl blur-xl" />
        <div className="relative bg-[#031B2F]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#F4F8FF] uppercase tracking-wide flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#A24BFF]" />
              Logos ({config.logos.length})
            </h3>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleMultipleLogoUpload(e.target.files)}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => logoInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-linear-to-r from-[#1A7CFF]/30 to-[#A24BFF]/20 border border-[#1A7CFF]/40 text-xs font-medium text-[#F4F8FF] flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              Add Logo
            </motion.button>
          </div>

          {/* Logo Grid */}
          {config.logos.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {config.logos.map((logo) => (
                <motion.div
                  key={logo.id}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedLogo(logo.id)}
                  className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all ${
                    selectedLogo === logo.id
                      ? 'ring-2 ring-[#1A7CFF] shadow-[0_0_15px_rgba(26,124,255,0.5)]'
                      : 'ring-1 ring-white/10'
                  }`}
                >
                  <img
                    src={logo.dataUrl}
                    alt="Logo"
                    className="w-full h-full object-contain bg-[#0A2540]/50 p-2"
                  />
                  {logo.locked && (
                    <div className="absolute top-1 left-1 p-1 rounded bg-[#1A7CFF]">
                      <Lock className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteLogo(logo.id);
                    }}
                    className="absolute top-1 right-1 p-1 rounded-full bg-[#FF5C5C]/80 hover:bg-[#FF5C5C]"
                  >
                    <X className="w-3 h-3 text-white" />
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}

          {/* Selected Logo Controls */}
          <AnimatePresence>
            {selectedLogoData && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 pt-3 border-t border-white/10"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#9FB2C8]">Logo Controls</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateLogo(selectedLogoData.id, { locked: !selectedLogoData.locked })}
                    className={`p-1.5 rounded-lg transition-colors ${
                      selectedLogoData.locked
                        ? 'bg-[#1A7CFF] text-white'
                        : 'bg-[#0A2540] text-[#9FB2C8]'
                    }`}
                  >
                    {selectedLogoData.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                  </motion.button>
                </div>

                <Slider
                  label="Size"
                  value={selectedLogoData.size}
                  onChange={(v: number) => updateLogo(selectedLogoData.id, { size: v })}
                  min={10}
                  max={200}
                  icon={Maximize2}
                />
                <Slider
                  label="Opacity"
                  value={selectedLogoData.opacity}
                  onChange={(v: number) => updateLogo(selectedLogoData.id, { opacity: v })}
                  icon={Eye}
                />
                <Slider
                  label="Rotation"
                  value={selectedLogoData.rotation}
                  onChange={(v: number) => updateLogo(selectedLogoData.id, { rotation: v })}
                  min={-180}
                  max={180}
                  icon={RotateCw}
                />
                {/* Placement Panel */}
                <div className="pt-2 border-t border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[#9FB2C8]">Placement</span>
                    <span className="text-[11px] text-[#9FB2C8]">Drag logo on preview to move</span>
                  </div>

                  <div className="grid grid-cols-3 gap-1">
                    {[
                      { id: 'top-left', x: 0.06, y: 0.06 },
                      { id: 'top-center', x: 0.5, y: 0.06 },
                      { id: 'top-right', x: 0.94, y: 0.06 },
                      { id: 'center-left', x: 0.06, y: 0.5 },
                      { id: 'center', x: 0.5, y: 0.5 },
                      { id: 'center-right', x: 0.94, y: 0.5 },
                      { id: 'bottom-left', x: 0.06, y: 0.94 },
                      { id: 'bottom-center', x: 0.5, y: 0.94 },
                      { id: 'bottom-right', x: 0.94, y: 0.94 }
                    ].map((a) => (
                      <button
                        key={a.id}
                        onClick={() => updateLogo(selectedLogoData.id, { position: { x: a.x, y: a.y } })}
                        className="px-2 py-2 rounded-lg bg-[#0A2540]/50 hover:bg-[#0F2F50] text-xs text-[#9FB2C8]"
                      >
                        {a.id.replace('-', ' ')}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <label className="text-[11px] text-[#9FB2C8]">X %
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={Math.round((selectedLogoData.position?.x || 0) * 100)}
                        onChange={(e) => {
                          const x = Math.max(0, Math.min(100, Number(e.target.value || 0))) / 100;
                          updateLogo(selectedLogoData.id, { position: { x, y: selectedLogoData.position?.y ?? 0.9 } });
                        }}
                        className="w-full mt-1 bg-[#0A2540]/80 border border-white/10 rounded-xl px-2 py-1 text-sm text-white"
                      />
                    </label>

                    <label className="text-[11px] text-[#9FB2C8]">Y %
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={Math.round((selectedLogoData.position?.y || 0) * 100)}
                        onChange={(e) => {
                          const y = Math.max(0, Math.min(100, Number(e.target.value || 0))) / 100;
                          updateLogo(selectedLogoData.id, { position: { x: selectedLogoData.position?.x ?? 0.9, y } });
                        }}
                        className="w-full mt-1 bg-[#0A2540]/80 border border-white/10 rounded-xl px-2 py-1 text-sm text-white"
                      />
                    </label>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* TEXT & STYLE */}
      <div className="relative">
          <div className="absolute inset-0 bg-linear-to-br from-[#1A7CFF]/10 to-transparent rounded-2xl blur-xl" />
        <div className="relative bg-[#031B2F]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-[#F4F8FF] uppercase tracking-wide flex items-center gap-2">
            <Type className="w-4 h-4 text-[#1A7CFF]" />
            Text Watermark
          </h3>
          
          <input
            type="text"
            value={config.text}
            onChange={(e) => setConfig({ ...config, text: e.target.value })}
            placeholder="Enter watermark text..."
            className="w-full bg-[#0A2540]/80 border border-white/10 focus:border-[#1A7CFF]/50 rounded-xl px-4 py-3 text-sm text-[#F4F8FF] placeholder:text-[#5A7089] outline-none transition-colors"
          />

          {/* Style Presets */}
          <div>
            <label className="text-xs font-medium text-[#9FB2C8] mb-2 block">Style Preset</label>
            <div className="grid grid-cols-4 gap-2">
              {styles.map((s) => (
                <motion.button
                  key={s.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    console.log('Style preset clicked:', s.id);
                    setConfig({ ...config, style: s.id });
                  }}
                  className={`relative p-3 rounded-xl transition-all ${
                    config.style === s.id
                      ? 'bg-linear-to-br from-[#1A7CFF]/30 to-[#A24BFF]/20 border-2 border-[#1A7CFF] shadow-[0_0_20px_rgba(26,124,255,0.3)]'
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

          {/* Typography */}
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

          {/* Color & Stroke */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-[#9FB2C8] mb-2 block">Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={config.color}
                  onChange={(e) => setConfig({ ...config, color: e.target.value })}
                  className="w-16 h-10 rounded-xl border-2 border-white/10 cursor-pointer"
                />
                <input
                  type="text"
                  value={config.color}
                  onChange={(e) => {
                    if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) {
                      setConfig({ ...config, color: e.target.value });
                    }
                  }}
                  className="flex-1 bg-[#0A2540]/80 border border-white/10 rounded-xl px-3 py-2 text-sm text-[#F4F8FF] outline-none font-mono uppercase"
                  placeholder="#FFFFFF"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(config.strokeWidth || 0) > 0}
                onChange={(e) => {
                  const enabled = e.target.checked;
                  if (setStrokeWidth) {
                    setStrokeWidth(enabled ? 2 : 0);
                  }
                  setConfig({ ...config, strokeWidth: enabled ? 2 : 0 });
                }}
                className="w-4 h-4 rounded border-white/20 bg-[#0A2540] text-[#1A7CFF]"
              />
              <span className="text-xs font-medium text-[#9FB2C8]">Add Text Stroke</span>
              {(config.strokeWidth || 0) > 0 && (
                <input
                  type="color"
                  value={config.strokeColor || '#000000'}
                  onChange={(e) => {
                    const color = e.target.value;
                    if (setStrokeColor) setStrokeColor(color);
                    setConfig({ ...config, strokeColor: color });
                  }}
                  className="w-8 h-8 rounded-lg border border-white/10 cursor-pointer ml-auto"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* TRANSFORM */}
      <div className="relative">
        <div className="absolute inset-0 bg-linear-to-br from-[#1A7CFF]/10 to-transparent rounded-2xl blur-xl" />
        <div className="relative bg-[#031B2F]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-[#F4F8FF] uppercase tracking-wide flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#1A7CFF]" />
            Transform
          </h3>
          
          <Slider
            label="Size"
            value={config.size}
            onChange={(v: number) => setConfig({ ...config, size: v })}
            min={10}
            max={150}
            icon={Zap}
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
            min={-180}
            max={180}
          />

          {/* Position */}
          <div>
            <label className="text-xs font-medium text-[#9FB2C8] mb-2 block">Position</label>
            <div className="grid grid-cols-3 grid-rows-3 gap-1 aspect-square">
              {positions.map((pos) => (
                <motion.button
                  key={pos}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setConfig({ ...config, position: pos })}
                  className={`rounded-lg transition-all ${
                    config.position === pos
                      ? 'bg-linear-to-br from-[#1A7CFF] to-[#A24BFF]'
                      : 'bg-[#0A2540]/50 hover:bg-[#0F2F50]'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* AI Face Detection */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={config.aiPlacement}
              onChange={(e) => setConfig({ ...config, aiPlacement: e.target.checked })}
              className="w-4 h-4 rounded border-white/20 bg-[#0A2540] text-[#1A7CFF]"
            />
            <span className="text-xs font-medium text-[#9FB2C8]">AI Face Detection</span>
          </label>
        </div>
      </div>

      {/* EFFECTS */}
      <div className="relative">
        <div className="absolute inset-0 bg-linear-to-br from-[#A24BFF]/10 to-transparent rounded-2xl blur-xl" />
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
                      ? 'bg-linear-to-r from-[#1A7CFF] to-[#0D6EF5] text-white'
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
              <div className="w-12 h-6 bg-[#0A2540] rounded-full peer peer-checked:bg-linear-to-r peer-checked:from-[#1A7CFF] peer-checked:to-[#0D6EF5] transition-all" />
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

      {/* IMAGE ADJUSTMENTS (optional) */}
      {showImageEditing !== false && (
        <div className="relative">
          <div className="absolute inset-0 bg-linear-to-br from-[#1A7CFF]/10 to-transparent rounded-2xl blur-xl" />
          <div className="relative bg-[#031B2F]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-[#F4F8FF] uppercase tracking-wide flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#1A7CFF]" />
              Image Editing
            </h3>

            {/* Filter Presets */}
            <div>
              <label className="text-xs font-medium text-[#9FB2C8] mb-2 block">Quick Filters</label>
              <div className="grid grid-cols-4 gap-2">
                {filterPresets.map((filter) => (
                  <motion.button
                    key={filter.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setAdjustments({ ...adjustments, filterPreset: filter.id as any })}
                    className={`p-2 rounded-lg transition-all ${
                      adjustments.filterPreset === filter.id
                        ? 'bg-linear-to-br from-[#1A7CFF]/30 to-[#A24BFF]/20 border-2 border-[#1A7CFF]'
                        : 'bg-[#0A2540]/50 border border-white/5'
                    }`}
                  >
                    <div className="text-xl mb-1">{filter.icon}</div>
                    <div className="text-[9px] font-medium text-[#9FB2C8]">{filter.label}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Section Tabs */}
            <div className="flex gap-1 p-1 bg-[#0A2540]/50 rounded-lg">
              {[
                { id: 'basic', label: 'Basic' },
                { id: 'advanced', label: 'Advanced' },
                { id: 'color', label: 'Color' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id as any)}
                  className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeSection === tab.id
                      ? 'bg-[#1A7CFF] text-white'
                      : 'text-[#9FB2C8] hover:text-[#F4F8FF]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Basic Adjustments */}
            <AnimatePresence mode="wait">
              {activeSection === 'basic' && (
                <motion.div
                  key="basic"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  <Slider label="Exposure" value={adjustments.exposure} onChange={(v: number) => setAdjustments({ ...adjustments, exposure: v })} icon={Sun} min={-100} max={100} />
                  <Slider label="Contrast" value={adjustments.contrast} onChange={(v: number) => setAdjustments({ ...adjustments, contrast: v })} icon={Contrast} min={-100} max={100} />
                  <Slider label="Saturation" value={adjustments.saturation} onChange={(v: number) => setAdjustments({ ...adjustments, saturation: v })} icon={Droplets} min={-100} max={100} />
                  <Slider label="Temperature" value={adjustments.temperature} onChange={(v: number) => setAdjustments({ ...adjustments, temperature: v })} icon={Thermometer} min={-100} max={100} />
                </motion.div>
              )}

              {activeSection === 'advanced' && (
                <motion.div
                  key="advanced"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  <Slider label="Highlights" value={adjustments.highlights} onChange={(v: number) => setAdjustments({ ...adjustments, highlights: v })} icon={Sun} min={-100} max={100} />
                  <Slider label="Shadows" value={adjustments.shadows} onChange={(v: number) => setAdjustments({ ...adjustments, shadows: v })} icon={Moon} min={-100} max={100} />
                  <Slider label="Whites" value={adjustments.whites} onChange={(v: number) => setAdjustments({ ...adjustments, whites: v })} icon={Sun} min={-100} max={100} />
                  <Slider label="Blacks" value={adjustments.blacks} onChange={(v: number) => setAdjustments({ ...adjustments, blacks: v })} icon={Moon} min={-100} max={100} />
                  <Slider label="Clarity" value={adjustments.clarity} onChange={(v: number) => setAdjustments({ ...adjustments, clarity: v })} icon={Aperture} min={-100} max={100} />
                  <Slider label="Sharpen" value={adjustments.sharpen} onChange={(v: number) => setAdjustments({ ...adjustments, sharpen: v })} icon={Scissors} min={0} max={100} />
                </motion.div>
              )}

              {activeSection === 'color' && (
                <motion.div
                  key="color"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  <Slider label="Vibrance" value={adjustments.vibrance} onChange={(v: number) => setAdjustments({ ...adjustments, vibrance: v })} icon={Aperture} min={-100} max={100} />
                  <Slider label="Dehaze" value={adjustments.dehaze} onChange={(v: number) => setAdjustments({ ...adjustments, dehaze: v })} icon={Wind} min={0} max={100} />
                  <Slider label="Vignette" value={adjustments.vignette} onChange={(v: number) => setAdjustments({ ...adjustments, vignette: v })} icon={Film} min={-100} max={100} />
                  <Slider label="Grain" value={adjustments.grain} onChange={(v: number) => setAdjustments({ ...adjustments, grain: v })} icon={Film} min={0} max={100} />
                  <Slider label="Tint" value={adjustments.tint} onChange={(v: number) => setAdjustments({ ...adjustments, tint: v })} icon={Thermometer} min={-100} max={100} />
                  <Slider label="Hue" value={adjustments.hue} onChange={(v: number) => setAdjustments({ ...adjustments, hue: v })} icon={RotateCw} min={-180} max={180} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* End Image Adjustments */}
          </div>
        </div>
      )}

      {/* ACTIONS */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setAdjustments({ ...adjustments, exposure: 0, contrast: 0, saturation: 0, temperature: 0, highlights: 0, shadows: 0, whites: 0, blacks: 0, vibrance: 0, clarity: 0, dehaze: 0, vignette: 0, grain: 0, sharpen: 0, tint: 0, hue: 0, filterPreset: 'none' })}
          className="px-4 py-2 rounded-lg bg-[#0A2540] text-sm text-[#9FB2C8]"
        >Reset Adjustments</button>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => {
              // Re-emit config to parent to ensure state sync
              setConfig({ ...config });
            }}
            className="px-4 py-2 rounded-lg bg-linear-to-r from-[#1A7CFF] to-[#0D6EF5] text-white font-semibold"
          >Apply</button>
        </div>
      </div>
    </div>
  );
}