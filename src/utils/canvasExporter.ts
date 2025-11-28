import React from 'react'
import * as blazeface from '@tensorflow-models/blazeface'

export type FontKey = 'sans' | 'display' | 'montserrat' | 'slab' | 'script'

type DrawOpts = {
  text: string
  size: number
  opacity: number
  position: string
  blendMode: string
  shadowIntensity: number
  glowEffect: boolean
  adaptiveBlend: boolean
  logoUrl?: string | null
  autoPlace?: boolean
  fontFamily?: FontKey
  customPos?: { x: number; y: number }
  color?: string
  fontWeight?: string
  exposure: number
  contrast: number
  saturation: number
  temperature: number
}

export async function drawWatermarkOnCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement | null> | null,
  faceModel: blazeface.BlazeFaceModel | null,
  baseUrl: string,
  opts: DrawOpts
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.onload = async () => {
      const canvas = (canvasRef && canvasRef.current) || document.createElement('canvas')
      const ctx = canvas.getContext('2d', { alpha: true })!
      const DPR = window.devicePixelRatio || 1
      const logicalW = img.width
      const logicalH = img.height
      canvas.width = Math.max(1, Math.round(logicalW * DPR))
      canvas.height = Math.max(1, Math.round(logicalH * DPR))
      canvas.style.width = `${logicalW}px`
      canvas.style.height = `${logicalH}px`
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
      ctx.clearRect(0, 0, logicalW, logicalH)
      ctx.drawImage(img, 0, 0, logicalW, logicalH)

      const filters: string[] = []
      if (opts.exposure !== 0) filters.push(`brightness(${1 + opts.exposure / 100})`)
      if (opts.contrast !== 0) filters.push(`contrast(${1 + opts.contrast / 100})`)
      if (opts.saturation !== 0) filters.push(`saturate(${1 + opts.saturation / 100})`)
      if (opts.temperature !== 0) filters.push(`hue-rotate(${opts.temperature * 0.3}deg)`)
      ctx.filter = filters.join(' ')

      let avgBrightness = 128
      if (opts.adaptiveBlend) {
        try {
          const sampleData = ctx.getImageData(0, 0, logicalW, logicalH)
          let sum = 0
          const sampleSize = Math.min(10000, sampleData.data.length / 4)
          for (let i = 0; i < sampleSize * 4; i += 4) {
            sum += (sampleData.data[i] + sampleData.data[i + 1] + sampleData.data[i + 2]) / 3
          }
          avgBrightness = sum / sampleSize
        } catch (err) {
          // If getImageData fails (CORS), just leave avgBrightness default
          console.warn('adaptiveBlend sample failed', err)
        }
      }

      const FONT_SIZE_MULT = 0.045
      const LOGO_SIZE_MULT = 0.05
      const fontSize = Math.max(12, Math.round(logicalW * (opts.size / 100) * FONT_SIZE_MULT))
      const fontMap: Record<string, string> = {
        sans: "'Inter', ui-sans-serif, system-ui",
        display: "'Playfair Display', serif",
        montserrat: "'Montserrat', ui-sans-serif, system-ui",
        slab: "'Roboto Slab', serif",
        script: "'Pacifico', cursive",
      }
      const canvasFontFamily = opts.fontFamily ? fontMap[opts.fontFamily] : fontMap['sans']
      const weight = opts.fontWeight || '600'
      ctx.font = `${weight} ${fontSize}px ${canvasFontFamily}`
      ctx.textBaseline = 'bottom'
      ctx.globalCompositeOperation = opts.blendMode as GlobalCompositeOperation

      const baseOpacity = opts.opacity / 100
      const hexToRgb = (hex: string) => {
        const h = hex.replace('#', '')
        const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h
        const bigint = parseInt(full, 16)
        const r = (bigint >> 16) & 255
        const g = (bigint >> 8) & 255
        const b = bigint & 255
        return `${r},${g},${b}`
      }
      let watermarkColorRgb = '255,255,255'
      if (opts.color) {
        try { watermarkColorRgb = hexToRgb(opts.color) } catch { watermarkColorRgb = '255,255,255' }
      } else if (opts.adaptiveBlend) {
        watermarkColorRgb = (avgBrightness > 128) ? '0,0,0' : '255,255,255'
      }

      if (opts.glowEffect) {
        ctx.shadowColor = `rgba(26,124,255,${(opts.shadowIntensity / 100) * 0.8})`
        ctx.shadowBlur = 20
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0
      } else {
        const shadowColor = avgBrightness > 128 ? '255,255,255' : '0,0,0'
        ctx.shadowColor = `rgba(${shadowColor},${(opts.shadowIntensity / 100) * 0.7})`
        ctx.shadowBlur = 12
        ctx.shadowOffsetX = 2
        ctx.shadowOffsetY = 2
      }

      const text = opts.text
      const metrics = ctx.measureText(text)
      const textWidth = metrics.width
      const logoSize = Math.max(8, Math.round(logicalW * (opts.size / 100) * LOGO_SIZE_MULT))

      let preferPosition = opts.position
      try {
        const autoPlaceRequested = !!opts.autoPlace
        if (autoPlaceRequested && faceModel) {
          const model = faceModel
          const predictions = await model.estimateFaces(img, false)
          if (predictions && predictions.length > 0) {
            const corners = ['top-left','top-right','bottom-left','bottom-right'] as const
            const makeBoxFor = (c: string) =>
              c === 'top-left' ? { x: 0, y: 0, width: logicalW / 3, height: logicalH / 3 }
              : c === 'top-right' ? { x: logicalW * 2 / 3, y: 0, width: logicalW / 3, height: logicalH / 3 }
              : c === 'bottom-left' ? { x: 0, y: logicalH * 2 / 3, width: logicalW / 3, height: logicalH / 3 }
              : { x: logicalW * 2 / 3, y: logicalH * 2 / 3, width: logicalW / 3, height: logicalH / 3 }

            const scoreBox = (box: { x:number;y:number;width:number;height:number }) => {
              let s = 0
              for (const p of predictions) {
                const tl = (p.topLeft as number[])
                const br = (p.bottomRight as number[])
                const ab = { x: tl[0], y: tl[1], width: br[0] - tl[0], height: br[1] - tl[1] }
                const ix = Math.max(0, Math.min(box.x + box.width, ab.x + ab.width) - Math.max(box.x, ab.x))
                const iy = Math.max(0, Math.min(box.y + box.height, ab.y + ab.height) - Math.max(box.y, ab.y))
                s += ix * iy
              }
              return s
            }

            const userBox = makeBoxFor(opts.position)
            const userScore = scoreBox(userBox)
            const collisionThreshold = logicalW * logicalH * 0.005
            if (userScore <= collisionThreshold) {
              preferPosition = opts.position
            } else {
              let best: typeof corners[number] = corners[0]
              let bestScore = Infinity
              for (const c of corners) {
                const box = makeBoxFor(c)
                const s = scoreBox(box)
                if (s < bestScore) { bestScore = s; best = c }
              }
              preferPosition = best
            }
          }
        }
      } catch (err) {
        console.warn('auto placement failed', err)
      }

      let x = 20
      let y = canvas.height - 20
      if (opts.customPos && typeof opts.customPos.x === 'number' && typeof opts.customPos.y === 'number') {
        x = Math.round(opts.customPos.x * logicalW - (textWidth / 2))
        y = Math.round(opts.customPos.y * logicalH + (fontSize / 2))
      } else {
        switch (preferPosition) {
          case 'top-left': x = 20; y = fontSize + 20; break
          case 'top-right': x = logicalW - 20 - textWidth; y = fontSize + 20; break
          case 'center': x = (logicalW - textWidth) / 2; y = (logicalH / 2) + (fontSize / 2); break
          case 'bottom-left': x = 20; y = logicalH - 20; break
          case 'bottom-right': x = logicalW - 20 - textWidth; y = logicalH - 20; break
          default: x = logicalW - 20 - textWidth; y = logicalH - 20; break
        }
      }

      ctx.fillStyle = `rgba(${watermarkColorRgb},${baseOpacity})`
      if (opts.logoUrl) {
        const logoImg = new window.Image()
        logoImg.crossOrigin = 'anonymous'
        logoImg.onload = () => {
          let logoX = x
          let logoY = y - fontSize
          if (opts.position.includes('right')) {
            logoX = x + textWidth + 12
          } else if (opts.position.includes('left')) {
            logoX = x - logoSize - 12
          } else if (opts.position === 'center') {
            logoX = x + (textWidth / 2) - (logoSize / 2)
            logoY = y - fontSize - (logoSize / 2)
          }
          try {
            ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize)
          } catch (err) {
            console.warn('Failed to draw logo on canvas', err)
          }
          ctx.fillText(text, x, y)
          if (opts.shadowIntensity > 70) {
            ctx.globalCompositeOperation = 'source-over'
            ctx.strokeStyle = `rgba(${watermarkColorRgb},${baseOpacity * 0.3})`
            ctx.lineWidth = 2
            ctx.strokeText(text, x, y)
          }
          resolve(canvas.toDataURL('image/jpeg', 0.95))
        }
        logoImg.onerror = () => {
          ctx.fillText(text, x, y)
          if (opts.shadowIntensity > 70) {
            ctx.globalCompositeOperation = 'source-over'
            ctx.strokeStyle = `rgba(${watermarkColorRgb},${baseOpacity * 0.3})`
            ctx.lineWidth = 2
            ctx.strokeText(text, x, y)
          }
          resolve(canvas.toDataURL('image/jpeg', 0.95))
        }
        logoImg.src = opts.logoUrl
        return
      }
      ctx.fillText(text, x, y)
      if (opts.shadowIntensity > 70) {
        ctx.globalCompositeOperation = 'source-over'
        ctx.strokeStyle = `rgba(${watermarkColorRgb},${baseOpacity * 0.3})`
        ctx.lineWidth = 2
        ctx.strokeText(text, x, y)
      }
      resolve(canvas.toDataURL('image/jpeg', 0.95))
    }
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = baseUrl
  })
}
