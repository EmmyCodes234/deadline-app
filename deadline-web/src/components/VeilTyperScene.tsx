import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sparkles, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import { VeilGhost } from './VeilGhost';
import type { Ghost } from '@/hooks/useVeilTyperEngine';

interface VeilTyperSceneProps {
  ghosts: Ghost[];
  comboStreak: number;
}

export function VeilTyperScene({ ghosts, comboStreak }: VeilTyperSceneProps) {
  // Wand glow color based on combo
  const wandGlowColor = 
    comboStreak > 20 ? '#ffffff' :
    comboStreak > 10 ? '#60a5fa' :
    '#fbbf24';

  return (
    <div className="absolute inset-0">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 2, 5]} />
        
        {/* Fog - PURE BLACK, CLOSER */}
        <fog attach="fog" args={['#000000', 5, 25]} />

        {/* Lighting - MINIMAL (Let ghosts glow) */}
        <ambientLight intensity={0.1} />
        <directionalLight
          position={[0, 10, 5]}
          intensity={0.3}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        {/* Wet Obsidian Floor - GOTHIC HORROR */}
        <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial
            color="#000000"
            roughness={0.1}
            metalness={0.8}
          />
        </mesh>

        {/* Ambient Particles */}
        <Sparkles
          count={100}
          scale={20}
          size={2}
          speed={0.3}
          opacity={0.3}
          color="#a855f7"
        />

        {/* Ghosts - Wrapped in Suspense for GLTF loading */}
        <Suspense fallback={null}>
          {ghosts.map(ghost => (
            <VeilGhost key={ghost.id} ghost={ghost} />
          ))}
        </Suspense>

        {/* Wizard Wand (Fixed to camera) */}
        <group position={[1.5, -1, -2]}>
          <mesh rotation={[0, 0, Math.PI / 4]}>
            {/* Wand stick */}
            <cylinderGeometry args={[0.02, 0.03, 1, 8]} />
            <meshStandardMaterial color="#4a3020" />
          </mesh>
          
          {/* Wand tip glow */}
          <mesh position={[0, 0.5, 0]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial
              color={wandGlowColor}
              emissive={wandGlowColor}
              emissiveIntensity={2}
            />
          </mesh>
          
          {/* Tip light */}
          <pointLight
            position={[0, 0.5, 0]}
            intensity={comboStreak > 10 ? 3 : 1.5}
            distance={3}
            color={wandGlowColor}
          />
        </group>

        {/* Post-processing - INTENSE BLOOM */}
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.1}
            luminanceSmoothing={0.9}
            intensity={2.5}
            radius={0.8}
          />
          <Noise opacity={0.15} />
          <Vignette eskil={false} offset={0.1} darkness={0.9} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
