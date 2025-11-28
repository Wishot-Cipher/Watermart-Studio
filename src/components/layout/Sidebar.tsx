import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  Layout, 
  Image, 
  Settings,
  Sparkles,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const activeRoute = location.pathname || '/';

  interface NavItem {
    to: string;
    label: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    color: string;
    gradient: string;
  }

  const nav: NavItem[] = [
    { to: '/', label: 'Home', icon: Home, color: '#1A7CFF', gradient: 'from-[#1A7CFF] to-[#0D6EF5]' },
    { to: '/templates', label: 'Templates', icon: Layout, color: '#18E2FF', gradient: 'from-[#18E2FF] to-[#1A7CFF]' },
    { to: '/editor', label: 'Editor', icon: Image, color: '#A24BFF', gradient: 'from-[#A24BFF] to-[#1A7CFF]' },
    { to: '/settings', label: 'Settings', icon: Settings, color: '#9FB2C8', gradient: 'from-[#9FB2C8] to-[#5A7089]' },
  ];

  const handleNavClick = (): void => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed top-0 left-0 h-screen w-24 z-50 flex-col items-center py-8 bg-[#031B2F]/80 backdrop-blur-xl border-r border-white/5">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative mb-12 group cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#1A7CFF] to-[#A24BFF] rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />
          <div className="relative w-14 h-14 bg-gradient-to-br from-[#1A7CFF] to-[#A24BFF] rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(26,124,255,0.3)]">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
        </motion.div>

        {/* Navigation Items */}
        <nav className="flex flex-col items-center gap-3 flex-1">
          {nav.map((item, index) => {
            const isActive = activeRoute === item.to;
            return (
              <motion.div
                key={item.to}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <NavLink to={item.to} onClick={() => handleNavClick()} className="relative block">
                {/* Active Indicator */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute -left-6 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[#1A7CFF] to-[#A24BFF] rounded-r-full"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </AnimatePresence>

                {/* Glow Effect */}
                {isActive && (
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${item.gradient} rounded-2xl blur-xl opacity-40`}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.4, 0.6, 0.4],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}

                {/* Button */}
                <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  isActive 
                    ? `bg-gradient-to-br ${item.gradient} shadow-[0_0_20px_${item.color}40]` 
                    : 'bg-[#0A2540]/50 hover:bg-[#0F2F50]'
                }`}>
                  <item.icon 
                    className={`w-6 h-6 transition-all duration-300 ${
                      isActive ? 'text-white scale-110' : 'text-[#9FB2C8] group-hover:text-[#F4F8FF]'
                    }`} 
                  />
                </div>

                {/* Tooltip */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  className="absolute left-20 top-1/2 -translate-y-1/2 px-3 py-2 bg-[#031B2F] backdrop-blur-xl border border-white/10 rounded-lg whitespace-nowrap pointer-events-none shadow-xl"
                >
                  <span className="text-sm font-medium text-[#F4F8FF]">{item.label}</span>
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#031B2F]" />
                </motion.div>
                </NavLink>
              </motion.div>
            );
          })}
        </nav>

        {/* Bottom Decoration */}
        <motion.div
          animate={{
            y: [0, -5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-10 h-1 bg-gradient-to-r from-transparent via-[#1A7CFF] to-transparent rounded-full opacity-30"
        />
      </aside>

      {/* Mobile Header with Menu Button */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#031B2F]/95 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1A7CFF] to-[#A24BFF] rounded-xl blur-lg opacity-50" />
              <div className="relative w-10 h-10 bg-gradient-to-br from-[#1A7CFF] to-[#A24BFF] rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#F4F8FF]">WaterMark Studio</h1>
              <p className="text-xs text-[#9FB2C8]">Professional Edition</p>
            </div>
          </motion.div>

          {/* Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(!isOpen)}
            className="relative w-12 h-12 rounded-xl bg-[#0A2540]/50 border border-white/5 flex items-center justify-center"
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6 text-[#F4F8FF]" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6 text-[#F4F8FF]" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            {/* Sidebar */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="lg:hidden fixed top-0 right-0 bottom-0 w-80 z-50 bg-[#000913]/95 backdrop-blur-xl border-l border-white/10"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/5">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-[#F4F8FF]">Navigation</h2>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(false)}
                    className="w-10 h-10 rounded-xl bg-[#0A2540]/50 flex items-center justify-center"
                  >
                    <X className="w-5 h-5 text-[#9FB2C8]" />
                  </motion.button>
                </div>

                {/* Current Page Indicator */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1A7CFF]/10 to-[#A24BFF]/5 rounded-xl blur-lg" />
                  <div className="relative bg-[#031B2F]/50 backdrop-blur-xl border border-white/5 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      {(() => {
                        const currentNav = nav.find(n => n.to === activeRoute);
                        const Icon = currentNav?.icon || Home;
                        return (
                          <>
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${currentNav?.gradient} flex items-center justify-center`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-xs text-[#9FB2C8]">Current Page</p>
                              <p className="text-sm font-semibold text-[#F4F8FF]">{currentNav?.label}</p>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Items */}
              <nav className="p-6 space-y-2">
                {nav.map((item, index) => {
                  const isActive = activeRoute === item.to;
                  return (
                      <motion.div
                        key={item.to}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="w-full group relative"
                      >
                        <NavLink to={item.to} onClick={() => handleNavClick()} className="w-full block">
                      {isActive && (
                        <motion.div
                          layoutId="mobileActiveIndicator"
                          className={`absolute inset-0 bg-gradient-to-br ${item.gradient} rounded-2xl opacity-10`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.1 }}
                          exit={{ opacity: 0 }}
                        />
                      )}

                      <div className={`relative flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${
                        isActive 
                          ? 'bg-[#031B2F]/80 border border-white/10' 
                          : 'bg-[#0A2540]/30 border border-transparent hover:border-white/5 hover:bg-[#0F2F50]/50'
                      }`}>
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                            isActive 
                              ? `bg-gradient-to-br ${item.gradient} shadow-[0_0_20px_${item.color}30]` 
                              : 'bg-[#031B2F]/50'
                          }`}>
                            <item.icon 
                              className={`w-6 h-6 transition-all duration-300 ${
                                isActive ? 'text-white' : 'text-[#9FB2C8] group-hover:text-[#F4F8FF]'
                              }`} 
                            />
                          </div>
                          <div className="text-left">
                            <p className={`font-semibold transition-colors ${
                              isActive ? 'text-[#F4F8FF]' : 'text-[#9FB2C8] group-hover:text-[#F4F8FF]'
                            }`}>
                              {item.label}
                            </p>
                            <p className="text-xs text-[#9FB2C8]">
                              {item.to === '/' ? 'Dashboard' : `Manage ${item.label.toLowerCase()}`}
                            </p>
                          </div>
                        </div>

                        <ChevronRight className={`w-5 h-5 transition-all duration-300 ${
                          isActive 
                            ? 'text-[#1A7CFF] translate-x-0' 
                            : 'text-[#9FB2C8] -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                        }`} />
                      </div>
                        </NavLink>
                      </motion.div>
                  );
                })}
              </nav>

              {/* Footer */}
              <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/5">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#A24BFF]/10 to-transparent rounded-xl blur-lg" />
                  <div className="relative bg-[#031B2F]/50 backdrop-blur-xl border border-white/5 rounded-xl p-4 text-center">
                    <Sparkles className="w-8 h-8 text-[#A24BFF] mx-auto mb-2" />
                    <p className="text-sm font-semibold text-[#F4F8FF] mb-1">Upgrade to Pro</p>
                    <p className="text-xs text-[#9FB2C8] mb-3">Unlock all features</p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-2 rounded-lg bg-gradient-to-r from-[#A24BFF] to-[#1A7CFF] text-white text-sm font-semibold shadow-[0_0_20px_rgba(162,75,255,0.3)]"
                    >
                      Upgrade Now
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for Desktop */}
      <div className="hidden lg:block w-24" />

      {/* Spacer for Mobile */}
      <div className="lg:hidden h-[72px]" />
    </>
  );
}