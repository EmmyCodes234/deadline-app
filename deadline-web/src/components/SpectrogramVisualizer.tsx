import { useEffect, useRef } from 'react';

interface SpectrogramVisualizerProps {
  analyser: AnalyserNode | null;
  signalStrength: number;
}

export function SpectrogramVisualizer({ analyser, signalStrength }: SpectrogramVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!analyser || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      // Clear with fade effect (creates trailing effect)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw frequency bars
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height * 0.8;

        // Color based on signal strength (green when strong, red when weak)
        const hue = 120 * signalStrength; // 0 (red) to 120 (green)
        const saturation = 70 + signalStrength * 30;
        const lightness = 30 + signalStrength * 20;
        
        ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        // Add glow effect
        if (dataArray[i] > 100) {
          ctx.shadowBlur = 10 + signalStrength * 20;
          ctx.shadowColor = `hsl(${hue}, ${saturation}%, ${lightness + 20}%)`;
        } else {
          ctx.shadowBlur = 0;
        }

        x += barWidth + 1;
      }

      // Draw waveform overlay
      ctx.lineWidth = 2;
      ctx.strokeStyle = `rgba(34, 197, 94, ${0.3 + signalStrength * 0.5})`;
      ctx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 255.0;
        const y = v * canvas.height;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.stroke();
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [analyser, signalStrength]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-40"
      style={{
        filter: 'blur(1px)',
      }}
    />
  );
}
