interface ScreenCorruptionProps {
  intensity: number; // 0 to 1
}

export function ScreenCorruption({ intensity }: ScreenCorruptionProps) {
  // Clamp intensity between 0 and 1
  const clampedIntensity = Math.max(0, Math.min(1, intensity));

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Vignette Effect - Darkens edges progressively */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at center, transparent ${100 - clampedIntensity * 60}%, rgba(0, 0, 0, 0.9) 100%)`,
          opacity: clampedIntensity * 0.8,
        }}
      />

      {/* Chromatic Aberration - Red/Blue color separation */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: clampedIntensity * 0.4,
          mixBlendMode: 'screen',
          background: `
            radial-gradient(circle at 30% 30%, rgba(255, 0, 0, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 70% 70%, rgba(0, 0, 255, 0.3) 0%, transparent 50%)
          `,
        }}
      />

      {/* Scanlines Effect - Old TV static */}
      {clampedIntensity > 0.3 && (
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            opacity: (clampedIntensity - 0.3) * 0.5,
            backgroundImage: `repeating-linear-gradient(
              0deg,
              rgba(0, 0, 0, 0.15) 0px,
              transparent 1px,
              transparent 2px,
              rgba(0, 0, 0, 0.15) 3px
            )`,
          }}
        />
      )}

      {/* Noise/Static Overlay */}
      {clampedIntensity > 0.5 && (
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            opacity: (clampedIntensity - 0.5) * 0.6,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />
      )}

      {/* Red Flash - Critical proximity warning */}
      {clampedIntensity > 0.8 && (
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            opacity: (clampedIntensity - 0.8) * 2,
            background: 'radial-gradient(circle at center, transparent 30%, rgba(255, 0, 0, 0.3) 100%)',
          }}
        />
      )}

      {/* Edge Distortion - Glitch effect */}
      {clampedIntensity > 0.6 && (
        <div
          className="absolute inset-0"
          style={{
            opacity: (clampedIntensity - 0.6) * 0.8,
            background: `
              linear-gradient(90deg, rgba(255, 0, 0, 0.2) 0%, transparent 5%, transparent 95%, rgba(0, 0, 255, 0.2) 100%),
              linear-gradient(0deg, rgba(0, 255, 0, 0.1) 0%, transparent 5%, transparent 95%, rgba(255, 0, 255, 0.1) 100%)
            `,
            mixBlendMode: 'overlay',
          }}
        />
      )}
    </div>
  );
}
