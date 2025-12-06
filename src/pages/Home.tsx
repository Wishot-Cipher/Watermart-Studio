import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';
import {
  Upload, Image as ImageIcon, Sparkles, Layers, Zap, 
   ArrowRight, CheckCircle2, X,
  Wand2, Grid3X3
} from 'lucide-react';
import { useImages } from '@/contexts/ImagesContext';

export default function Home() {
  const navigate = useNavigate();
  const { images, addImages, clear } = useImages();
  const [isDragging, setIsDragging] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (files.length > 0) {
      addImages(files);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  }, [addImages]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(f => f.type.startsWith('image/'));
    if (files.length > 0) {
      addImages(files);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  }, [addImages]);

  const features = [
    { icon: Layers, title: 'Multi-Layer', desc: 'Stack logos & text', color: '#22d3ee' },
    { icon: Sparkles, title: 'AI Placement', desc: 'Smart positioning', color: '#a855f7' },
    { icon: Zap, title: 'Batch Process', desc: 'Process 100s at once', color: '#10b981' },
    { icon: Wand2, title: 'Pro Effects', desc: '12+ stunning styles', color: '#f97316' },
  ];

  const stats = [
    { label: 'Images', value: images.length, icon: ImageIcon, color: '#22d3ee' },
    { label: 'Styles', value: '12+', icon: Sparkles, color: '#a855f7' },
    { label: 'Batch', value: '500', icon: Grid3X3, color: '#10b981' },
  ];

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-[#080b12] text-white overflow-x-hidden">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#151c28_0%,#080b12_60%)]" />
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/8 rounded-full blur-[150px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/8 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <m.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <m.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-cyan-500/20 to-purple-600/20 border border-cyan-500/30 mb-6">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm font-medium bg-linear-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Professional Watermark Studio</span>
            </m.div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Watermark</span><br/>
              <span className="bg-linear-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Studio Pro</span>
            </h1>
            <p className="text-base text-slate-400 max-w-2xl mx-auto">Professional watermarking with AI placement, batch processing, and stunning effects</p>
          </m.div>

          <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="grid grid-cols-3 gap-3 mb-10">
            {stats.map((stat, i) => (
              <m.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }}
                className="relative bg-[#0d1219]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 sm:p-6 hover:border-white/10 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-xl" style={{ backgroundColor: stat.color + '20' }}>
                    <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-xs sm:text-sm text-slate-400">{stat.label}</div>
              </m.div>
            ))}
          </m.div>

          <m.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="relative mb-12">
            <div className="absolute -inset-1 bg-linear-to-r from-cyan-500/20 via-purple-600/15 to-cyan-500/20 rounded-3xl blur-2xl opacity-60" />
            <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
              className={`relative bg-[#0d1219]/90 backdrop-blur-xl border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer ${isDragging ? 'border-cyan-500 bg-cyan-500/10 scale-[1.01]' : 'border-white/10 hover:border-cyan-500/50'}`}>
              <input type="file" accept="image/*" multiple onChange={handleFileSelect} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
              <m.div animate={{ y: isDragging ? -10 : 0 }} className="relative flex flex-col items-center">
                <m.div animate={{ scale: isDragging ? 1.1 : 1 }} className="relative mb-6">
                  <div className="absolute inset-0 bg-linear-to-br from-cyan-500 to-purple-600 rounded-2xl blur-xl opacity-50" />
                  <div className="relative w-20 h-20 rounded-2xl bg-linear-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-cyan-500/25">
                    <Upload className="w-10 h-10 text-white" />
                  </div>
                </m.div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">{isDragging ? 'Drop here' : 'Upload Images'}</h3>
                <p className="text-slate-400 mb-4 text-sm">Drag & drop or click  PNG, JPG, WebP</p>
              </m.div>
            </div>
          </m.div>

          <AnimatePresence>
            {images.length > 0 && (
              <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-12">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white">Your Images</h2>
                    <p className="text-slate-400 text-sm">{images.length} ready</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <m.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => clear()}
                      className="px-4 py-2 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400 text-sm font-medium">Clear</m.button>
                    <m.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => navigate('/editor')}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-cyan-500 to-purple-600 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-shadow">
                      <Wand2 className="w-4 h-4" />Open Editor<ArrowRight className="w-4 h-4" />
                    </m.button>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                  {images.slice(0, 11).map((img, i) => (
                    <m.div key={img.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }}
                      className="relative group aspect-square rounded-xl overflow-hidden bg-slate-900 border border-white/5 hover:border-cyan-500/50">
                      <img src={img.url} alt={img.file?.name || 'Image'} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    </m.div>
                  ))}
                  {images.length > 11 && (
                    <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => navigate('/editor')}
                      className="aspect-square rounded-xl bg-linear-to-br from-cyan-500/20 to-purple-600/20 border border-white/5 flex items-center justify-center cursor-pointer hover:border-cyan-500/30 transition-colors">
                      <div className="text-center">
                        <div className="text-3xl font-bold bg-linear-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">+{images.length - 11}</div>
                        <div className="text-sm text-slate-400">more</div>
                      </div>
                    </m.div>
                  )}
                </div>
              </m.div>
            )}
          </AnimatePresence>

          <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-3">Powerful Features</h2>
              <p className="text-slate-400">Everything for professional watermarking</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {features.map((feature, i) => (
                <m.div key={feature.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 + i * 0.1 }}
                  className="relative bg-[#0d1219]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: feature.color + '20' }}>
                    <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-400">{feature.desc}</p>
                </m.div>
              ))}
            </div>
          </m.div>
        </div>

        <AnimatePresence>
          {images.length > 0 && (
            <m.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
              <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/10 shadow-2xl shadow-cyan-500/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{images.length} images</div>
                    <div className="text-xs text-slate-400">Ready</div>
                  </div>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <m.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/editor')}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-cyan-500 to-purple-600 text-white font-semibold shadow-lg shadow-cyan-500/25">
                  <Zap className="w-4 h-4" />Start Editing
                </m.button>
              </div>
            </m.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showSuccess && (
            <m.div initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50">
              <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-emerald-500 text-white font-medium shadow-lg shadow-emerald-500/25">
                <CheckCircle2 className="w-5 h-5" /><span>Images added!</span>
                <button onClick={() => setShowSuccess(false)} className="ml-2"><X className="w-4 h-4" /></button>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </LazyMotion>
  );
}
