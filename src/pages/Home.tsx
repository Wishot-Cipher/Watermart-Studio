import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useImages } from '../contexts/ImagesContext';
import {
  Upload,
  Image,
  Sparkles,
  Clock,
  Zap,
  ChevronRight,
  Plus,
  Star,
  TrendingUp,
  Folder,
  BarChart3,
  Settings,
  Bell,
  Search,
  X,
  Check
} from 'lucide-react';

export default function HomePage() {
  const [isDragging, setIsDragging] = useState(false);
  const [showUploadSuccess, setShowUploadSuccess] = useState(false);
  const { images, addImages, setSelectIndex } = useImages();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const recentBatches = [
    { id: 1, name: 'Youth Summit 2025', images: 124, date: '2 hours ago', status: 'completed' },
    { id: 2, name: 'Product Catalog', images: 89, date: '1 day ago', status: 'completed' },
    { id: 3, name: 'Event Photos', images: 256, date: '3 days ago', status: 'completed' },
  ];

  const savedWatermarks = [
    { id: 1, name: 'Corporate', uses: '1.2k', type: 'text', emoji: '🏢' },
    { id: 2, name: 'Logo Dark', uses: '856', type: 'logo', emoji: '🎨' },
    { id: 3, name: 'Minimal', uses: '2.1k', type: 'text', emoji: '✨' },
    { id: 4, name: 'Vintage', uses: '634', type: 'logo', emoji: '📷' },
  ];

  const stats = [
    { label: 'Images Processed', value: '2,847', icon: Image, color: '#1A7CFF', trend: '+12.5%' },
    { label: 'Time Saved', value: '43h', icon: Clock, color: '#18E2FF', trend: '+8.3%' },
    { label: 'Active Templates', value: '12', icon: Sparkles, color: '#A24BFF', trend: '+3' },
  ];

  const handleFilesAdded = async (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      alert('Please select valid image files');
      return;
    }

    await addImages(imageFiles);
    setShowUploadSuccess(true);
    setTimeout(() => setShowUploadSuccess(false), 3000);
  };

  const handleEditAll = () => {
    if (images.length === 0) {
      alert('Please upload images first');
      return;
    }
    setSelectIndex(0);
    navigate('/editor');
  };

  const handleEditImage = (index: number) => {
    setSelectIndex(index);
    navigate('/editor');
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#000913]">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#1A7CFF]/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#A24BFF]/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {showUploadSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 right-6 z-50 bg-[#031B2F]/95 backdrop-blur-xl border border-[#10D98E]/30 rounded-2xl p-4 shadow-[0_0_40px_rgba(16,217,142,0.3)]"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#10D98E]/20">
                <Check className="w-5 h-5 text-[#10D98E]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#F4F8FF]">Images Uploaded Successfully!</p>
                <p className="text-xs text-[#9FB2C8]">{images.length} image{images.length !== 1 ? 's' : ''} ready to edit</p>
              </div>
              <button
                onClick={() => setShowUploadSuccess(false)}
                className="ml-4 p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-[#9FB2C8]" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-20 bg-[#031B2F]/50 backdrop-blur-xl border-b border-white/5"
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#1A7CFF] to-[#A24BFF] flex items-center justify-center shadow-[0_0_20px_rgba(26,124,255,0.4)]">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-[#F4F8FF]">WaterMark Studio</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-xl bg-[#0A2540]/50 border border-white/5">
                <Search className="w-4 h-4 text-[#9FB2C8]" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  className="bg-transparent border-none outline-none text-sm text-[#F4F8FF] placeholder:text-[#9FB2C8] w-64"
                />
              </div>
              <button className="p-2.5 rounded-xl bg-[#0A2540]/50 hover:bg-[#0F2F50] border border-white/5 transition-colors">
                <Bell className="w-5 h-5 text-[#9FB2C8]" />
              </button>
              <button className="p-2.5 rounded-xl bg-[#0A2540]/50 hover:bg-[#0F2F50] border border-white/5 transition-colors">
                <Settings className="w-5 h-5 text-[#9FB2C8]" />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="relative z-10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-8 lg:py-12">
          
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-[#F4F8FF] mb-3">
                  Welcome back, <span className="bg-linear-to-r from-[#1A7CFF] to-[#A24BFF] bg-clip-text text-transparent">Media Team</span>
                </h1>
                <p className="text-lg text-[#9FB2C8]">Transform your images with professional watermarks in seconds</p>
              </div>

                <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden lg:flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-[#1A7CFF] to-[#0D6EF5] text-white font-semibold shadow-[0_0_30px_rgba(26,124,255,0.4)] whitespace-nowrap"
              >
                <Zap className="w-5 h-5" />
                Upgrade to Pro
              </motion.button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-linear-to-br from-[#1A7CFF]/20 to-[#A24BFF]/10 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
                  <div className="relative bg-[#031B2F]/80 backdrop-blur-xl border border-white/10 group-hover:border-[#1A7CFF]/30 rounded-2xl p-6 transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-xl bg-linear-to-br from-[#1A7CFF]/20 to-transparent">
                        <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#10D98E]/10">
                        <TrendingUp className="w-3 h-3 text-[#10D98E]" />
                        <span className="text-xs font-semibold text-[#10D98E]">{stat.trend}</span>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-[#F4F8FF] mb-1">{stat.value}</div>
                    <div className="text-sm text-[#9FB2C8]">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-10"
          >
            <div
              className={`relative group cursor-pointer transition-all duration-300 ${
                isDragging ? 'scale-[1.02]' : 'hover:scale-[1.005]'
              }`}
              onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={async (e) => {
                e.preventDefault();
                setIsDragging(false);
                const files = e.dataTransfer?.files ? Array.from(e.dataTransfer.files) : [];
                if (files.length) await handleFilesAdded(files);
              }}
            >
              <div className="absolute inset-0 bg-linear-to-br from-[#1A7CFF] to-[#A24BFF] rounded-3xl blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
              <div className={`relative bg-linear-to-br from-[#0A2540]/90 to-[#031B2F]/90 backdrop-blur-xl border-2 ${
                isDragging ? 'border-[#1A7CFF] bg-[#1A7CFF]/5' : 'border-dashed border-[#1A7CFF]/30'
              } rounded-3xl p-12 lg:p-20 transition-all duration-300`}>
                <div className="flex flex-col items-center text-center space-y-6">
                  <motion.div
                    animate={{ y: isDragging ? -10 : [0, -10, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-linear-to-br from-[#1A7CFF] to-[#A24BFF] rounded-3xl blur-2xl opacity-60" />
                    <div className="relative bg-linear-to-br from-[#1A7CFF] to-[#A24BFF] p-8 rounded-3xl shadow-[0_0_60px_rgba(26,124,255,0.4)]">
                      <Upload className="w-16 h-16 text-white" />
                    </div>
                  </motion.div>

                  <div className="max-w-2xl">
                    <h3 className="text-3xl font-bold text-[#F4F8FF] mb-3">
                      {isDragging ? 'Drop your images here' : 'Upload Your Images'}
                    </h3>
                    <p className="text-base text-[#9FB2C8] mb-8">
                      Drag & drop your images or click to browse • Supports JPG, PNG, WebP, and more
                    </p>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-10 py-4 rounded-2xl bg-linear-to-r from-[#1A7CFF] to-[#0D6EF5] text-white text-lg font-semibold shadow-[0_0_40px_rgba(26,124,255,0.5)] hover:shadow-[0_0_60px_rgba(26,124,255,0.7)] transition-all duration-300"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Choose Files
                    </motion.button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={async (e) => {
                        const files = e.target.files ? Array.from(e.target.files) : [];
                        if (files.length) await handleFilesAdded(files);
                      }}
                      className="hidden"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[#9FB2C8]">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-[#18E2FF]" />
                      <span>Batch Processing</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-[#9FB2C8]" />
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#A24BFF]" />
                      <span>AI-Powered</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-[#9FB2C8]" />
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#10D98E]" />
                      <span>Lightning Fast</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Uploaded Images Preview */}
          <AnimatePresence>
            {images && images.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-10"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-linear-to-br from-[#1A7CFF]/10 to-[#A24BFF]/5 rounded-3xl blur-2xl" />
                  <div className="relative bg-[#031B2F]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-linear-to-br from-[#10D98E]/20 to-transparent">
                          <Check className="w-5 h-5 text-[#10D98E]" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-[#F4F8FF]">
                            Ready to Edit
                          </h3>
                          <p className="text-sm text-[#9FB2C8]">{images.length} image{images.length !== 1 ? 's' : ''} uploaded</p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 rounded-xl bg-linear-to-r from-[#1A7CFF] to-[#0D6EF5] text-white font-semibold shadow-[0_0_20px_rgba(26,124,255,0.4)] flex items-center gap-2"
                        onClick={handleEditAll}
                      >
                        <Sparkles className="w-4 h-4" />
                        Edit All Images
                        <ChevronRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                    
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                      {images.map((img: { id: React.Key | null | undefined; url: string | undefined; }, idx: number) => (
                        <motion.button
                          key={img.id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          whileHover={{ scale: 1.05, y: -4 }}
                          onClick={() => handleEditImage(idx)}
                          className="relative aspect-square overflow-hidden bg-[#0A2540]/50 border border-white/5 hover:border-[#1A7CFF]/50 rounded-2xl transition-all duration-300 group"
                        >
                          <img src={img.url} alt={`upload-${idx}`} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute bottom-2 left-2 right-2">
                              <div className="text-xs text-white font-semibold mb-1">Image #{idx + 1}</div>
                              <div className="flex items-center gap-1">
                                <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                                  <div className="h-full bg-[#1A7CFF] rounded-full" style={{ width: '100%' }} />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="p-1.5 rounded-lg bg-[#1A7CFF] shadow-lg">
                              <Sparkles className="w-3 h-3 text-white" />
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Recent Batches */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="lg:col-span-2"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-linear-to-br from-[#1A7CFF]/20 to-transparent">
                    <Folder className="w-5 h-5 text-[#1A7CFF]" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#F4F8FF]">Recent Batches</h2>
                </div>
                <button className="flex items-center gap-2 text-sm text-[#1A7CFF] hover:text-[#0D6EF5] font-medium transition-colors">
                  View All
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {recentBatches.map((batch, index) => (
                  <motion.div
                    key={batch.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                    whileHover={{ scale: 1.01 }}
                    className="group cursor-pointer"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-linear-to-r from-[#1A7CFF]/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative bg-[#031B2F]/60 backdrop-blur-xl border border-white/5 group-hover:border-[#1A7CFF]/30 rounded-2xl p-5 transition-all duration-300">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-linear-to-br from-[#1A7CFF]/20 to-transparent">
                              <Image className="w-5 h-5 text-[#1A7CFF]" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-[#F4F8FF] mb-1">{batch.name}</h3>
                              <div className="flex items-center gap-3 text-sm text-[#9FB2C8]">
                                <span>{batch.images} images</span>
                                <span>•</span>
                                <span>{batch.date}</span>
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-[#9FB2C8] group-hover:text-[#1A7CFF] transition-colors" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Templates */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-linear-to-br from-[#A24BFF]/20 to-transparent">
                    <BarChart3 className="w-5 h-5 text-[#A24BFF]" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#F4F8FF]">Templates</h2>
                </div>
                <button className="p-2 rounded-xl bg-linear-to-br from-[#1A7CFF]/20 to-transparent hover:from-[#1A7CFF]/30 transition-all">
                  <Plus className="w-5 h-5 text-[#1A7CFF]" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {savedWatermarks.map((watermark, index) => (
                  <motion.div
                    key={watermark.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-square">
                      <div className="absolute inset-0 bg-linear-to-br from-[#1A7CFF]/20 to-[#A24BFF]/10 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative h-full bg-[#031B2F]/60 backdrop-blur-xl border border-white/5 group-hover:border-[#1A7CFF]/30 rounded-2xl p-4 transition-all duration-300">
                        <div className="h-full flex flex-col items-center justify-center">
                          <div className="text-4xl mb-3">{watermark.emoji}</div>
                          <div className="text-center">
                            <div className="text-sm font-semibold text-[#F4F8FF] mb-1">{watermark.name}</div>
                            <div className="flex items-center justify-center gap-1 text-xs text-[#9FB2C8]">
                              <Star className="w-3 h-3 fill-[#FFB020] text-[#FFB020]" />
                              {watermark.uses} uses
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}