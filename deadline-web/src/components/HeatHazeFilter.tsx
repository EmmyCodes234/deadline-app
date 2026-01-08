import { useEffect, useRef } from 'react';

export function HeatHazeFilter() {
  const turbulenceRef = useRef<SVGFETurbulenceElement>(null);

  useEffect(() => {
    let animationFrameId: number;
    let time = 0;

    const animate = () => {
      if (turbulenceRef.current) {
        time += 0.001;
        
        // Animate baseFrequency for flowing water/heat effect
        const baseFreqX = 0.01 + Math.sin(time) * 0.005;
        const baseFreqY = 0.003 + Math.cos(time * 0.7) * 0.002;
        
        turbulenceRef.current.setAttribute(
          'baseFrequency',
          `${baseFreqX} ${baseFreqY}`
        );
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <svg style={{ display: 'none' }}>
      <defs>
        <filter id="noise-warp">
          <feTurbulence
            ref={turbulenceRef}
            type="fractalNoise"
            baseFrequency="0.01 0.003"
            numOctaves="1"
            result="warp"
          />
          <feDisplacementMap
            xChannelSelector="R"
            yChannelSelector="G"
            scale="20"
            in="SourceGraphic"
            in2="warp"
          />
        </filter>
      </defs>
    </svg>
  );
}
