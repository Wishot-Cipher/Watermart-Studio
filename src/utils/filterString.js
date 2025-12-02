export function getFilterString(adj) {
    const presetMap = {
        vivid: 'saturate(1.3) contrast(1.1)',
        dramatic: 'contrast(1.3) brightness(0.9) saturate(0.8)',
        warm: 'sepia(0.3) saturate(1.2)',
        cool: 'hue-rotate(180deg) saturate(1.1)',
        vintage: 'sepia(0.5) contrast(0.9) brightness(1.1)',
        bw: 'grayscale(1) contrast(1.2)',
        cinematic: 'contrast(1.15) saturate(1.05) sepia(0.08) brightness(0.95) hue-rotate(-5deg)',
        portrait: 'contrast(1.05) saturate(1.08) brightness(1.02)',
        hdr: 'contrast(1.25) saturate(1.2) brightness(1.05)',
        matte: 'contrast(0.92) saturate(0.9) brightness(0.98) sepia(0.05)',
        film: 'contrast(1.1) saturate(0.95) sepia(0.2) brightness(0.98)',
        moody: 'contrast(1.2) brightness(0.9) saturate(0.82) hue-rotate(-10deg)',
        pro: 'contrast(1.06) saturate(1.05) brightness(1.02) hue-rotate(-2deg)',
        'golden-hour': 'sepia(0.18) saturate(1.12) brightness(1.04) contrast(1.03)',
        'magazine-cover': 'contrast(1.18) saturate(1.15) brightness(1.02) hue-rotate(-2deg)',
        'teal-orange': 'sepia(0.06) saturate(1.2) contrast(1.05) hue-rotate(10deg)',
        'fashion-editorial': 'contrast(1.12) saturate(1.08) brightness(1.03) sepia(0.04)',
        'neon-pop': 'saturate(1.4) contrast(1.2) brightness(1.06) hue-rotate(10deg)',
        'cyberpunk': 'saturate(1.25) contrast(1.15) brightness(1.02) hue-rotate(200deg)',
        'tropical-vibes': 'saturate(1.3) brightness(1.05) contrast(1.02)',
        'ocean-depth': 'saturate(0.95) contrast(1.05) brightness(0.95) hue-rotate(200deg)',
        'autumn-warmth': 'sepia(0.25) saturate(1.15) brightness(1.01) contrast(1.03)',
        'sunset-glow': 'sepia(0.16) saturate(1.18) brightness(1.06) contrast(1.02) hue-rotate(-8deg)',
        'luxury-gold': 'sepia(0.28) saturate(1.2) contrast(1.08) brightness(1.02)',
        'arctic-blue': 'saturate(0.9) contrast(1.05) brightness(1.02) hue-rotate(180deg)',
        'nordic-minimal': 'contrast(0.95) saturate(0.9) brightness(1.02)',
        'pastel-dream': 'saturate(0.85) contrast(0.95) brightness(1.06) hue-rotate(-10deg)',
        'urban-grit': 'contrast(1.2) saturate(0.85) brightness(0.95) sepia(0.06)'
    };
    const filters = [];
    if (adj.filterPreset && adj.filterPreset !== 'none') {
        const preset = presetMap[adj.filterPreset] || '';
        if (preset)
            filters.push(preset);
    }
    const brightnessVal = Math.max(0.2, 1 + (adj.exposure || 0) / 200);
    filters.push(`brightness(${brightnessVal})`);
    const contrastVal = Math.max(0.2, 1 + (adj.contrast || 0) / 200 + (adj.clarity || 0) / 800);
    filters.push(`contrast(${contrastVal})`);
    const saturateVal = Math.max(0, 1 + (adj.saturation || 0) / 150 + (adj.vibrance || 0) / 300);
    filters.push(`saturate(${saturateVal})`);
    filters.push(`hue-rotate(${(adj.temperature * 0.3 + adj.hue + adj.tint * 0.5) || 0}deg)`);
    if (adj.sharpen && adj.sharpen > 0) {
        const subtle = Math.min(0.06, (adj.sharpen || 0) / 3000);
        if (subtle > 0)
            filters.push(`contrast(${1 + subtle})`);
    }
    return filters.join(' ');
}
