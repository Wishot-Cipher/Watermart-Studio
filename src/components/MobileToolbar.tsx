import React from 'react';
import { motion } from 'framer-motion';
import { Download, RotateCcw, Layers, Sparkles, Save, ArrowLeft, ArrowRight } from 'lucide-react';

interface MobileToolbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSave: () => void;
  onReset: () => void;
  onExport: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  canGoPrevious?: boolean;
  canGoNext?: boolean;
}

export default function MobileToolbar({
  activeTab,
  onTabChange,
  onSave,
  onReset,
  onExport,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext
}: MobileToolbarProps) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#031B2F]/95 backdrop-blur-xl border-t border-white/10">
      {/* Tab Selector */}
      <div className="grid grid-cols-2 gap-2 p-2 border-b border-white/5">
        <button
          onClick={() => onTabChange('watermark')}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
            activeTab === 'watermark'
              ? 'bg-linear-to-r from-[#1A7CFF] to-[#0D6EF5] text-white shadow-[0_0_20px_rgba(26,124,255,0.4)]'
              : 'bg-white/5 text-[#9FB2C8]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span className="text-sm">Watermark</span>
        </button>
        <button
          onClick={() => onTabChange('enhance')}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
            activeTab === 'enhance'
              ? 'bg-linear-to-r from-[#1A7CFF] to-[#0D6EF5] text-white shadow-[0_0_20px_rgba(26,124,255,0.4)]'
              : 'bg-white/5 text-[#9FB2C8]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-sm">Enhance</span>
        </button>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-5 gap-2 p-2">
        {/* Previous Image */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className={`flex flex-col items-center justify-center gap-1 py-2 rounded-lg transition-colors ${
            canGoPrevious
              ? 'bg-white/5 text-white active:bg-white/10'
              : 'bg-white/5 text-white/30 cursor-not-allowed'
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-[10px]">Prev</span>
        </motion.button>

        {/* Reset */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onReset}
          className="flex flex-col items-center justify-center gap-1 py-2 rounded-lg bg-white/5 text-white active:bg-white/10 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
          <span className="text-[10px]">Reset</span>
        </motion.button>

        {/* Save */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onSave}
          className="flex flex-col items-center justify-center gap-1 py-2 rounded-lg bg-linear-to-r from-[#1A7CFF] to-[#0D6EF5] text-white shadow-[0_0_20px_rgba(26,124,255,0.4)]"
        >
          <Save className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Save</span>
        </motion.button>

        {/* Export */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onExport}
          className="flex flex-col items-center justify-center gap-1 py-2 rounded-lg bg-white/5 text-white active:bg-white/10 transition-colors"
        >
          <Download className="w-5 h-5" />
          <span className="text-[10px]">Export</span>
        </motion.button>

        {/* Next Image */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          disabled={!canGoNext}
          className={`flex flex-col items-center justify-center gap-1 py-2 rounded-lg transition-colors ${
            canGoNext
              ? 'bg-white/5 text-white active:bg-white/10'
              : 'bg-white/5 text-white/30 cursor-not-allowed'
          }`}
        >
          <ArrowRight className="w-5 h-5" />
          <span className="text-[10px]">Next</span>
        </motion.button>
      </div>
    </div>
  );
}
