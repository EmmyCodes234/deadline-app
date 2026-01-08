import { useRef, useLayoutEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import type { Ghost } from '@/hooks/useVeilTyperEngine';

interface VeilGhostProps {
  ghost: Ghost;
}

// Preload the ghost model
useGLTF.preload('/models/ghost/scene.gltf');

export function VeilGhost({ ghost }: VeilGhostProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [x, y, z] = ghost.position;

  // Load the GLTF model with error handling
  let gltf;
  try {
    gltf = useGLTF('/models/ghost/scene.gltf');
  } catch (error) {
    console.error('Failed to load ghost model:', error);
    return null;
  }

  const { scene } = gltf;
  const ghostScene = useMemo(() => scene.clone(), [scene]);

  // FORCE GLOWING MATERIAL - Override the model's textures (useLayoutEffect for immediate application)
  useLayoutEffect(() => {
    ghostScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = new THREE.MeshStandardMaterial({
          color: '#a5f3fc',      // Pale Cyan base
          emissive: '#22d3ee',   // GLOWING Cyan
          emissiveIntensity: 2,  // High intensity for Bloom
          roughness: 0.1,
          metalness: 0.8,
          transparent: true,
          opacity: 0.9,
        });
        mesh.castShadow = true;
      }
    });
  }, [ghostScene]);

  useFrame(() => {
    if (groupRef.current) {
      // Gentle rotation
      groupRef.current.rotation.y += 0.01;
    }
  });

  // Calculate which letters are typed
  const typedPart = ghost.word.slice(0, ghost.typedProgress);

  return (
    <group position={[x, y, z]}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        {/* Ghost Model - GLOWING */}
        <group ref={groupRef}>
          <primitive 
            object={ghostScene} 
            scale={ghost.isBoss ? [0.04, 0.04, 0.04] : [0.02, 0.02, 0.02]} 
            rotation={[0, Math.PI, 0]}
            position={[0, 0, 0]}
          />
        </group>

        {/* Target Word - TIGHTENED TYPOGRAPHY */}
        <Text
          position={[0, 1.5, 0]}
          fontSize={ghost.isBoss ? 0.6 : 0.5}
          color="white"
          anchorX="center"
          anchorY="bottom"
          outlineWidth={0.05}
          outlineColor="black"
        >
          <meshStandardMaterial 
            color={typedPart.length > 0 ? '#fbbf24' : '#ffffff'}
            emissive={typedPart.length > 0 ? '#fbbf24' : '#ffffff'}
            emissiveIntensity={typedPart.length > 0 ? 2 : 0.5}
          />
          {ghost.word}
        </Text>

        {/* Boss indicator */}
        {ghost.isBoss && (
          <Text
            position={[0, 2.5, 0]}
            fontSize={0.4}
            color="#ff0000"
            anchorX="center"
            anchorY="middle"
          >
            ☠ BOSS ☠
          </Text>
        )}

        {/* Point light for INTENSE glow */}
        <pointLight
          intensity={ghost.isBoss ? 4 : 2}
          distance={8}
          color={ghost.isBoss ? '#dc2626' : '#22d3ee'}
          decay={2}
        />
      </Float>
    </group>
  );
}
