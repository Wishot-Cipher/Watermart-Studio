import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Zap, Type, Image as ImageIcon, Sparkles, Contrast, Droplets, Thermometer, RotateCcw, Palette, Sun, Moon, Aperture, Scissors, Film, Wind, X, Plus, Lock, Unlock, RotateCw, Maximize2 } from 'lucide-react';
const Slider = ({ label, value, onChange, min = 0, max = 100, icon: Icon, step = 1 }) => (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Icon, { className: "w-4 h-4 text-[#1A7CFF]" }), _jsx("span", { className: "text-sm font-medium text-[#F4F8FF]", children: label })] }), _jsxs("span", { className: "text-sm font-semibold text-[#1A7CFF] tabular-nums", children: [value > 0 && min < 0 ? '+' : '', value] })] }), _jsxs("div", { className: "relative h-2 bg-[#0A2540] rounded-full overflow-hidden", children: [_jsx("div", { className: "absolute h-full bg-linear-to-r from-[#1A7CFF] to-[#A24BFF] transition-all duration-200", style: { width: `${((value - min) / (max - min)) * 100}%` } }), _jsx("input", { type: "range", min: min, max: max, step: step, value: value, onChange: (e) => onChange(Number(e.target.value)), className: "absolute inset-0 w-full opacity-0 cursor-pointer" })] })] }));
export default function EnhancedWatermarkControls({ config, setConfig, adjustments, setAdjustments, logoInputRef, onLogoUpload, showImageEditing, setStrokeWidth, setStrokeColor }) {
    const [selectedLogo, setSelectedLogo] = useState(null);
    const [activeSection, setActiveSection] = useState('basic');
    const styles = [
        { id: 'modern-glass', label: 'Glass', icon: '🔮' },
        { id: 'neon-glow', label: 'Neon', icon: '✨' },
        { id: 'elegant-serif', label: 'Elegant', icon: '🎩' },
        { id: 'bold-impact', label: 'Bold', icon: '💥' },
        { id: 'minimal-clean', label: 'Minimal', icon: '⚪' },
        { id: 'gradient-fade', label: 'Gradient', icon: '🌈' },
        { id: 'stamp-vintage', label: 'Vintage', icon: '📮' },
        { id: 'tech-futuristic', label: 'Tech', icon: '🚀' },
    ];
    const fonts = [
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
    const handleMultipleLogoUpload = async (files) => {
        if (!files || files.length === 0)
            return;
        const newLogos = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();
            await new Promise((resolve) => {
                reader.onload = () => {
                    const logo = {
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
    const updateLogo = (id, updates) => {
        const updated = config.logos.map(logo => logo.id === id ? { ...logo, ...updates } : logo);
        setConfig({ ...config, logos: updated });
    };
    const deleteLogo = (id) => {
        setConfig({ ...config, logos: config.logos.filter(l => l.id !== id) });
        if (selectedLogo === id)
            setSelectedLogo(null);
    };
    const selectedLogoData = config.logos.find(l => l.id === selectedLogo);
    return (_jsxs("div", { className: "space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 custom-scrollbar", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-0 bg-linear-to-br from-[#A24BFF]/10 to-transparent rounded-2xl blur-xl" }), _jsxs("div", { className: "relative bg-[#031B2F]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("h3", { className: "text-sm font-bold text-[#F4F8FF] uppercase tracking-wide flex items-center gap-2", children: [_jsx(ImageIcon, { className: "w-4 h-4 text-[#A24BFF]" }), "Logos (", config.logos.length, ")"] }), _jsx("input", { ref: logoInputRef, type: "file", accept: "image/*", multiple: true, className: "hidden", onChange: (e) => handleMultipleLogoUpload(e.target.files) }), _jsxs(motion.button, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, onClick: () => logoInputRef.current?.click(), className: "px-3 py-1.5 rounded-lg bg-linear-to-r from-[#1A7CFF]/30 to-[#A24BFF]/20 border border-[#1A7CFF]/40 text-xs font-medium text-[#F4F8FF] flex items-center gap-1", children: [_jsx(Plus, { className: "w-3 h-3" }), "Add Logo"] })] }), config.logos.length > 0 && (_jsx("div", { className: "grid grid-cols-3 gap-2", children: config.logos.map((logo) => (_jsxs(motion.div, { whileHover: { scale: 1.05 }, onClick: () => setSelectedLogo(logo.id), className: `relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all ${selectedLogo === logo.id
                                        ? 'ring-2 ring-[#1A7CFF] shadow-[0_0_15px_rgba(26,124,255,0.5)]'
                                        : 'ring-1 ring-white/10'}`, children: [_jsx("img", { src: logo.dataUrl, alt: "Logo", className: "w-full h-full object-contain bg-[#0A2540]/50 p-2" }), logo.locked && (_jsx("div", { className: "absolute top-1 left-1 p-1 rounded bg-[#1A7CFF]", children: _jsx(Lock, { className: "w-3 h-3 text-white" }) })), _jsx(motion.button, { whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 }, onClick: (e) => {
                                                e.stopPropagation();
                                                deleteLogo(logo.id);
                                            }, className: "absolute top-1 right-1 p-1 rounded-full bg-[#FF5C5C]/80 hover:bg-[#FF5C5C]", children: _jsx(X, { className: "w-3 h-3 text-white" }) })] }, logo.id))) })), _jsx(AnimatePresence, { children: selectedLogoData && (_jsxs(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, className: "space-y-3 pt-3 border-t border-white/10", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-xs font-medium text-[#9FB2C8]", children: "Logo Controls" }), _jsx(motion.button, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, onClick: () => updateLogo(selectedLogoData.id, { locked: !selectedLogoData.locked }), className: `p-1.5 rounded-lg transition-colors ${selectedLogoData.locked
                                                        ? 'bg-[#1A7CFF] text-white'
                                                        : 'bg-[#0A2540] text-[#9FB2C8]'}`, children: selectedLogoData.locked ? _jsx(Lock, { className: "w-3 h-3" }) : _jsx(Unlock, { className: "w-3 h-3" }) })] }), _jsx(Slider, { label: "Size", value: selectedLogoData.size, onChange: (v) => updateLogo(selectedLogoData.id, { size: v }), min: 10, max: 200, icon: Maximize2 }), _jsx(Slider, { label: "Opacity", value: selectedLogoData.opacity, onChange: (v) => updateLogo(selectedLogoData.id, { opacity: v }), icon: Eye }), _jsx(Slider, { label: "Rotation", value: selectedLogoData.rotation, onChange: (v) => updateLogo(selectedLogoData.id, { rotation: v }), min: -180, max: 180, icon: RotateCw }), _jsxs("div", { className: "pt-2 border-t border-white/5 space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-xs font-medium text-[#9FB2C8]", children: "Placement" }), _jsx("span", { className: "text-[11px] text-[#9FB2C8]", children: "Drag logo on preview to move" })] }), _jsx("div", { className: "grid grid-cols-3 gap-1", children: [
                                                        { id: 'top-left', x: 0.06, y: 0.06 },
                                                        { id: 'top-center', x: 0.5, y: 0.06 },
                                                        { id: 'top-right', x: 0.94, y: 0.06 },
                                                        { id: 'center-left', x: 0.06, y: 0.5 },
                                                        { id: 'center', x: 0.5, y: 0.5 },
                                                        { id: 'center-right', x: 0.94, y: 0.5 },
                                                        { id: 'bottom-left', x: 0.06, y: 0.94 },
                                                        { id: 'bottom-center', x: 0.5, y: 0.94 },
                                                        { id: 'bottom-right', x: 0.94, y: 0.94 }
                                                    ].map((a) => (_jsx("button", { onClick: () => updateLogo(selectedLogoData.id, { position: { x: a.x, y: a.y } }), className: "px-2 py-2 rounded-lg bg-[#0A2540]/50 hover:bg-[#0F2F50] text-xs text-[#9FB2C8]", children: a.id.replace('-', ' ') }, a.id))) }), _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsxs("label", { className: "text-[11px] text-[#9FB2C8]", children: ["X %", _jsx("input", { type: "number", min: 0, max: 100, value: Math.round((selectedLogoData.position?.x || 0) * 100), onChange: (e) => {
                                                                        const x = Math.max(0, Math.min(100, Number(e.target.value || 0))) / 100;
                                                                        updateLogo(selectedLogoData.id, { position: { x, y: selectedLogoData.position?.y ?? 0.9 } });
                                                                    }, className: "w-full mt-1 bg-[#0A2540]/80 border border-white/10 rounded-xl px-2 py-1 text-sm text-white" })] }), _jsxs("label", { className: "text-[11px] text-[#9FB2C8]", children: ["Y %", _jsx("input", { type: "number", min: 0, max: 100, value: Math.round((selectedLogoData.position?.y || 0) * 100), onChange: (e) => {
                                                                        const y = Math.max(0, Math.min(100, Number(e.target.value || 0))) / 100;
                                                                        updateLogo(selectedLogoData.id, { position: { x: selectedLogoData.position?.x ?? 0.9, y } });
                                                                    }, className: "w-full mt-1 bg-[#0A2540]/80 border border-white/10 rounded-xl px-2 py-1 text-sm text-white" })] })] })] })] })) })] })] }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-0 bg-linear-to-br from-[#1A7CFF]/10 to-transparent rounded-2xl blur-xl" }), _jsxs("div", { className: "relative bg-[#031B2F]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 space-y-4", children: [_jsxs("h3", { className: "text-sm font-bold text-[#F4F8FF] uppercase tracking-wide flex items-center gap-2", children: [_jsx(Type, { className: "w-4 h-4 text-[#1A7CFF]" }), "Text Watermark"] }), _jsx("input", { type: "text", value: config.text, onChange: (e) => setConfig({ ...config, text: e.target.value }), placeholder: "Enter watermark text...", className: "w-full bg-[#0A2540]/80 border border-white/10 focus:border-[#1A7CFF]/50 rounded-xl px-4 py-3 text-sm text-[#F4F8FF] placeholder:text-[#5A7089] outline-none transition-colors" }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-[#9FB2C8] mb-2 block", children: "Style Preset" }), _jsx("div", { className: "grid grid-cols-4 gap-2", children: styles.map((s) => (_jsxs(motion.button, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, onClick: () => {
                                                console.log('Style preset clicked:', s.id);
                                                setConfig({ ...config, style: s.id });
                                            }, className: `relative p-3 rounded-xl transition-all ${config.style === s.id
                                                ? 'bg-linear-to-br from-[#1A7CFF]/30 to-[#A24BFF]/20 border-2 border-[#1A7CFF] shadow-[0_0_20px_rgba(26,124,255,0.3)]'
                                                : 'bg-[#0A2540]/50 border border-white/5 hover:border-[#1A7CFF]/30'}`, children: [_jsx("div", { className: "text-2xl mb-1", children: s.icon }), _jsx("div", { className: `text-[10px] font-medium ${config.style === s.id ? 'text-[#F4F8FF]' : 'text-[#9FB2C8]'}`, children: s.label })] }, s.id))) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-[#9FB2C8] mb-2 block", children: "Font" }), _jsx("select", { value: config.fontFamily, onChange: (e) => setConfig({ ...config, fontFamily: e.target.value }), className: "w-full bg-[#0A2540]/80 border border-white/10 rounded-xl px-3 py-2 text-sm text-[#F4F8FF] outline-none cursor-pointer", children: fonts.map((f) => (_jsx("option", { value: f.id, children: f.label }, f.id))) })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-[#9FB2C8] mb-2 block", children: "Weight" }), _jsxs("select", { value: config.fontWeight, onChange: (e) => setConfig({ ...config, fontWeight: e.target.value }), className: "w-full bg-[#0A2540]/80 border border-white/10 rounded-xl px-3 py-2 text-sm text-[#F4F8FF] outline-none cursor-pointer", children: [_jsx("option", { value: "400", children: "Regular" }), _jsx("option", { value: "600", children: "Semibold" }), _jsx("option", { value: "700", children: "Bold" }), _jsx("option", { value: "800", children: "Extra Bold" })] })] })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-[#9FB2C8] mb-2 block", children: "Color" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "color", value: config.color, onChange: (e) => setConfig({ ...config, color: e.target.value }), className: "w-16 h-10 rounded-xl border-2 border-white/10 cursor-pointer" }), _jsx("input", { type: "text", value: config.color, onChange: (e) => {
                                                            if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) {
                                                                setConfig({ ...config, color: e.target.value });
                                                            }
                                                        }, className: "flex-1 bg-[#0A2540]/80 border border-white/10 rounded-xl px-3 py-2 text-sm text-[#F4F8FF] outline-none font-mono uppercase", placeholder: "#FFFFFF" })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: (config.strokeWidth || 0) > 0, onChange: (e) => {
                                                    const enabled = e.target.checked;
                                                    if (setStrokeWidth) {
                                                        setStrokeWidth(enabled ? 2 : 0);
                                                    }
                                                    setConfig({ ...config, strokeWidth: enabled ? 2 : 0 });
                                                }, className: "w-4 h-4 rounded border-white/20 bg-[#0A2540] text-[#1A7CFF]" }), _jsx("span", { className: "text-xs font-medium text-[#9FB2C8]", children: "Add Text Stroke" }), (config.strokeWidth || 0) > 0 && (_jsx("input", { type: "color", value: config.strokeColor || '#000000', onChange: (e) => {
                                                    const color = e.target.value;
                                                    if (setStrokeColor)
                                                        setStrokeColor(color);
                                                    setConfig({ ...config, strokeColor: color });
                                                }, className: "w-8 h-8 rounded-lg border border-white/10 cursor-pointer ml-auto" }))] })] })] })] }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-0 bg-linear-to-br from-[#1A7CFF]/10 to-transparent rounded-2xl blur-xl" }), _jsxs("div", { className: "relative bg-[#031B2F]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 space-y-4", children: [_jsxs("h3", { className: "text-sm font-bold text-[#F4F8FF] uppercase tracking-wide flex items-center gap-2", children: [_jsx(Zap, { className: "w-4 h-4 text-[#1A7CFF]" }), "Transform"] }), _jsx(Slider, { label: "Size", value: config.size, onChange: (v) => setConfig({ ...config, size: v }), min: 10, max: 150, icon: Zap }), _jsx(Slider, { label: "Opacity", value: config.opacity, onChange: (v) => setConfig({ ...config, opacity: v }), icon: Eye }), _jsx(Slider, { label: "Rotation", value: config.rotation, onChange: (v) => setConfig({ ...config, rotation: v }), icon: RotateCcw, min: -180, max: 180 }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-[#9FB2C8] mb-2 block", children: "Position" }), _jsx("div", { className: "grid grid-cols-3 grid-rows-3 gap-1 aspect-square", children: positions.map((pos) => (_jsx(motion.button, { whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 }, onClick: () => setConfig({ ...config, position: pos }), className: `rounded-lg transition-all ${config.position === pos
                                                ? 'bg-linear-to-br from-[#1A7CFF] to-[#A24BFF]'
                                                : 'bg-[#0A2540]/50 hover:bg-[#0F2F50]'}` }, pos))) })] }), _jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: config.aiPlacement, onChange: (e) => setConfig({ ...config, aiPlacement: e.target.checked }), className: "w-4 h-4 rounded border-white/20 bg-[#0A2540] text-[#1A7CFF]" }), _jsx("span", { className: "text-xs font-medium text-[#9FB2C8]", children: "AI Face Detection" })] })] })] }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-0 bg-linear-to-br from-[#A24BFF]/10 to-transparent rounded-2xl blur-xl" }), _jsxs("div", { className: "relative bg-[#031B2F]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 space-y-4", children: [_jsxs("h3", { className: "text-sm font-bold text-[#F4F8FF] uppercase tracking-wide flex items-center gap-2", children: [_jsx(Sparkles, { className: "w-4 h-4 text-[#A24BFF]" }), "Effects"] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-[#9FB2C8] mb-2 block", children: "Blend Mode" }), _jsx("div", { className: "grid grid-cols-2 gap-2", children: ['normal', 'multiply', 'screen', 'overlay', 'soft-light', 'hard-light'].map((mode) => (_jsx(motion.button, { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, onClick: () => setConfig({ ...config, blendMode: mode }), className: `px-3 py-2 rounded-lg text-xs font-medium transition-all ${config.blendMode === mode
                                                ? 'bg-linear-to-r from-[#1A7CFF] to-[#0D6EF5] text-white'
                                                : 'bg-[#0A2540]/50 text-[#9FB2C8] hover:bg-[#0F2F50]'}`, children: mode.charAt(0).toUpperCase() + mode.slice(1).replace('-', ' ') }, mode))) })] }), _jsxs("div", { className: "flex items-center justify-between pt-2", children: [_jsx("span", { className: "text-sm font-medium text-[#F4F8FF]", children: "Glow Effect" }), _jsxs("label", { className: "relative inline-block w-12 h-6 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: config.glowEffect, onChange: (e) => setConfig({ ...config, glowEffect: e.target.checked }), className: "sr-only peer" }), _jsx("div", { className: "w-12 h-6 bg-[#0A2540] rounded-full peer peer-checked:bg-linear-to-r peer-checked:from-[#1A7CFF] peer-checked:to-[#0D6EF5] transition-all" }), _jsx("div", { className: "absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6 shadow-md" })] })] }), _jsx(Slider, { label: "Shadow", value: config.shadowIntensity, onChange: (v) => setConfig({ ...config, shadowIntensity: v }), icon: Contrast })] })] }), showImageEditing !== false && (_jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-0 bg-linear-to-br from-[#1A7CFF]/10 to-transparent rounded-2xl blur-xl" }), _jsxs("div", { className: "relative bg-[#031B2F]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 space-y-4", children: [_jsxs("h3", { className: "text-sm font-bold text-[#F4F8FF] uppercase tracking-wide flex items-center gap-2", children: [_jsx(Palette, { className: "w-4 h-4 text-[#1A7CFF]" }), "Image Editing"] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-[#9FB2C8] mb-2 block", children: "Quick Filters" }), _jsx("div", { className: "grid grid-cols-4 gap-2", children: filterPresets.map((filter) => (_jsxs(motion.button, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, onClick: () => setAdjustments({ ...adjustments, filterPreset: filter.id }), className: `p-2 rounded-lg transition-all ${adjustments.filterPreset === filter.id
                                                ? 'bg-linear-to-br from-[#1A7CFF]/30 to-[#A24BFF]/20 border-2 border-[#1A7CFF]'
                                                : 'bg-[#0A2540]/50 border border-white/5'}`, children: [_jsx("div", { className: "text-xl mb-1", children: filter.icon }), _jsx("div", { className: "text-[9px] font-medium text-[#9FB2C8]", children: filter.label })] }, filter.id))) })] }), _jsx("div", { className: "flex gap-1 p-1 bg-[#0A2540]/50 rounded-lg", children: [
                                    { id: 'basic', label: 'Basic' },
                                    { id: 'advanced', label: 'Advanced' },
                                    { id: 'color', label: 'Color' }
                                ].map((tab) => (_jsx("button", { onClick: () => setActiveSection(tab.id), className: `flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeSection === tab.id
                                        ? 'bg-[#1A7CFF] text-white'
                                        : 'text-[#9FB2C8] hover:text-[#F4F8FF]'}`, children: tab.label }, tab.id))) }), _jsxs(AnimatePresence, { mode: "wait", children: [activeSection === 'basic' && (_jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "space-y-3", children: [_jsx(Slider, { label: "Exposure", value: adjustments.exposure, onChange: (v) => setAdjustments({ ...adjustments, exposure: v }), icon: Sun, min: -100, max: 100 }), _jsx(Slider, { label: "Contrast", value: adjustments.contrast, onChange: (v) => setAdjustments({ ...adjustments, contrast: v }), icon: Contrast, min: -100, max: 100 }), _jsx(Slider, { label: "Saturation", value: adjustments.saturation, onChange: (v) => setAdjustments({ ...adjustments, saturation: v }), icon: Droplets, min: -100, max: 100 }), _jsx(Slider, { label: "Temperature", value: adjustments.temperature, onChange: (v) => setAdjustments({ ...adjustments, temperature: v }), icon: Thermometer, min: -100, max: 100 })] }, "basic")), activeSection === 'advanced' && (_jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "space-y-3", children: [_jsx(Slider, { label: "Highlights", value: adjustments.highlights, onChange: (v) => setAdjustments({ ...adjustments, highlights: v }), icon: Sun, min: -100, max: 100 }), _jsx(Slider, { label: "Shadows", value: adjustments.shadows, onChange: (v) => setAdjustments({ ...adjustments, shadows: v }), icon: Moon, min: -100, max: 100 }), _jsx(Slider, { label: "Whites", value: adjustments.whites, onChange: (v) => setAdjustments({ ...adjustments, whites: v }), icon: Sun, min: -100, max: 100 }), _jsx(Slider, { label: "Blacks", value: adjustments.blacks, onChange: (v) => setAdjustments({ ...adjustments, blacks: v }), icon: Moon, min: -100, max: 100 }), _jsx(Slider, { label: "Clarity", value: adjustments.clarity, onChange: (v) => setAdjustments({ ...adjustments, clarity: v }), icon: Aperture, min: -100, max: 100 }), _jsx(Slider, { label: "Sharpen", value: adjustments.sharpen, onChange: (v) => setAdjustments({ ...adjustments, sharpen: v }), icon: Scissors, min: 0, max: 100 })] }, "advanced")), activeSection === 'color' && (_jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "space-y-3", children: [_jsx(Slider, { label: "Vibrance", value: adjustments.vibrance, onChange: (v) => setAdjustments({ ...adjustments, vibrance: v }), icon: Aperture, min: -100, max: 100 }), _jsx(Slider, { label: "Dehaze", value: adjustments.dehaze, onChange: (v) => setAdjustments({ ...adjustments, dehaze: v }), icon: Wind, min: 0, max: 100 }), _jsx(Slider, { label: "Vignette", value: adjustments.vignette, onChange: (v) => setAdjustments({ ...adjustments, vignette: v }), icon: Film, min: -100, max: 100 }), _jsx(Slider, { label: "Grain", value: adjustments.grain, onChange: (v) => setAdjustments({ ...adjustments, grain: v }), icon: Film, min: 0, max: 100 }), _jsx(Slider, { label: "Tint", value: adjustments.tint, onChange: (v) => setAdjustments({ ...adjustments, tint: v }), icon: Thermometer, min: -100, max: 100 }), _jsx(Slider, { label: "Hue", value: adjustments.hue, onChange: (v) => setAdjustments({ ...adjustments, hue: v }), icon: RotateCw, min: -180, max: 180 })] }, "color"))] })] })] })), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: () => setAdjustments({ ...adjustments, exposure: 0, contrast: 0, saturation: 0, temperature: 0, highlights: 0, shadows: 0, whites: 0, blacks: 0, vibrance: 0, clarity: 0, dehaze: 0, vignette: 0, grain: 0, sharpen: 0, tint: 0, hue: 0, filterPreset: 'none' }), className: "px-4 py-2 rounded-lg bg-[#0A2540] text-sm text-[#9FB2C8]", children: "Reset Adjustments" }), _jsx("div", { className: "ml-auto flex items-center gap-2", children: _jsx("button", { onClick: () => {
                                // Re-emit config to parent to ensure state sync
                                setConfig({ ...config });
                            }, className: "px-4 py-2 rounded-lg bg-linear-to-r from-[#1A7CFF] to-[#0D6EF5] text-white font-semibold", children: "Apply" }) })] })] }));
}
