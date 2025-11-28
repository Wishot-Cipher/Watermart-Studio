import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

function hexToRgba(hex: string, alpha = 1) {
  const h = hex.replace('#', '').trim()
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h
  const bigint = parseInt(full, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const GridBackground: React.FC = () => {
  const [particles, setParticles] = useState<Array<{ left: string; top: string; duration: number; delay: number }>>([])
  const [colors, setColors] = useState({ primary: '#1A7CFF', accentMint: '#18E2FF' })

  useEffect(() => {
    const generated = Array.from({ length: 30 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 2,
    }))
    // avoid synchronous setState in effect
    const rootStyles = getComputedStyle(document.documentElement)
    const primary = rootStyles.getPropertyValue('--color-primary') || rootStyles.getPropertyValue('--primary') || '#1A7CFF'
    const accentMint = rootStyles.getPropertyValue('--color-secondary') || rootStyles.getPropertyValue('--secondary') || '#18E2FF'
    const computedColors = { primary: primary.trim() || '#1A7CFF', accentMint: accentMint.trim() || '#18E2FF' }
    setTimeout(() => {
      setParticles(generated)
      setColors(computedColors)
    }, 0)
  }, [])

  return (
    <>
      {/* LINES + PARTICLES (framer) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`v-${i}`}
            className="absolute h-full w-px"
            style={{ left: `${i * 5}%`, background: `linear-gradient(to bottom, transparent, ${hexToRgba(colors.primary, 0.18)}, transparent)` }}
            animate={{ opacity: [0.06, 0.28, 0.06], scaleY: [1, 1.15, 1] }}
            transition={{ duration: 3 + i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}

        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`h-${i}`}
            className="absolute w-full h-px"
            style={{ top: `${i * 5}%`, background: `linear-gradient(to right, transparent, ${hexToRgba(colors.primary, 0.12)}, transparent)` }}
            animate={{ opacity: [0.06, 0.28, 0.06], scaleX: [1, 1.12, 1] }}
            transition={{ duration: 2.5 + i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}

        {/* Scan line effect — dark-edged for depth */}
        <motion.div
          className="absolute w-full h-1"
          style={{
            background: `linear-gradient(to right, rgba(0,0,0,0.45), transparent 8%, ${hexToRgba(colors.primary, 0.45)} 50%, transparent 92%, rgba(0,0,0,0.45))`,
            boxShadow: 'inset 0 1px 6px rgba(0,0,0,0.6), inset 0 -1px 6px rgba(0,0,0,0.6)',
            borderRadius: '2px',
          }}
          animate={{ top: ['0%', '100%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />


        {particles.map((p, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 rounded-full"
            style={{ left: p.left, top: p.top, background: hexToRgba(colors.accentMint, 0.25) }}
            animate={{ y: [0, -30, 0], opacity: [0, 1, 0] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay }}
          />
        ))}
      </div>

      {/* GRID OVERLAY + ANIMATED ORBS (user-supplied design) */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${hexToRgba(colors.primary, 0.25)} 1px, transparent 1px), linear-gradient(90deg, ${hexToRgba(colors.primary, 0.25)} 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[500px] h-[500px] rounded-full blur-[120px] opacity-30 animate-pulse"
          style={{
            background: `radial-gradient(circle, ${colors.primary} 0%, transparent 70%)`,
            top: '-10%',
            right: '-5%',
            animationDuration: '4s',
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full blur-[100px] opacity-20"
          style={{
            background: `radial-gradient(circle, ${colors.accentMint} 0%, transparent 70%)`,
            bottom: '-5%',
            left: '-5%',
            animation: 'pulse 6s ease-in-out infinite',
          }}
        />

        <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-[0.08] pointer-events-none">
          <img
            src="/Ece picture.jpg"
            alt="ECE Background"
            className="w-full h-full object-contain"
            style={{
              filter: 'grayscale(0.5) brightness(0.8)',
              mixBlendMode: 'soft-light',
            }}
          />
        </div>
      </div>
    </>
  )
}

export default GridBackground

