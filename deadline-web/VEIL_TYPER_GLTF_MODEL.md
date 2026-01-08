# 👻 Veil Typer - GLTF Ghost Model Integration

## Overview

The VeilGhost component now uses a real 3D GLTF model instead of simple sphere geometry, with material override to ensure the glowing holographic look.

## Model Location

```
public/
└── models/
    └── ghost/
        ├── scene.gltf       # Main model file
        ├── scene.bin        # Binary data
        ├── textures/        # Original textures (overridden)
        └── license.txt      # Model license
```

## Implementation Details

### Model Loading

```typescript
import { useGLTF } from '@react-three/drei';

// Preload for better performance
useGLTF.preload('/models/ghost/scene.gltf');

// Load in component
const { scene } = useGLTF('/models/ghost/scene.gltf');
const ghostScene = useMemo(() => scene.clone(), [scene]);
```

### Material Override

The model comes with its own textures, but we override them to create the glowing holographic effect:

```typescript
useEffect(() => {
  ghostScene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      mesh.material = new THREE.MeshStandardMaterial({
        color: ghost.isBoss ? '#ef4444' : '#d8b4fe',      // Lavender/Red
        emissive: ghost.isBoss ? '#dc2626' : '#22d3ee',   // Cyan/Red glow
        emissiveIntensity: 2,                              // BRIGHT
        transparent: true,
        opacity: 0.9,
        roughness: 0.2,
        metalness: 0.1,
      });
      mesh.castShadow = true;
    }
  });
}, [ghostScene, ghost.isBoss]);
```

### Scaling

- **Normal ghosts**: `scale={[1, 1, 1]}`
- **Boss ghosts**: `scale={[2, 2, 2]}` (2x larger)

If the model appears too large or small, adjust these values:
- Too big: Try `[0.5, 0.5, 0.5]` or `[0.1, 0.1, 0.1]`
- Too small: Try `[5, 5, 5]` or `[10, 10, 10]`

### Rotation

Model is rotated 180° on Y-axis: `rotation={[0, Math.PI, 0]}`

This ensures the ghost faces the camera.

## Visual Features

### Glowing Effect
- **Emissive color**: Bright cyan (#22d3ee) for normal, red for boss
- **Emissive intensity**: 2 (very bright)
- **Point light**: Intensity 2-4, distance 8, with decay

### Text Labels
- **Position**: Higher (y: 2.5-3) to avoid clipping with model
- **Size**: 0.6-0.8 (large and readable)
- **Color**: White, turns gold when typed
- **Emissive**: Glows when typed (intensity: 2)

### Boss Indicator
- **Position**: y: 4 (above text)
- **Text**: "☠ BOSS ☠"
- **Color**: Red

## Performance

### Optimization
- Model is cloned using `useMemo` to avoid re-loading
- Preloaded at module level for instant availability
- Material override happens once per ghost spawn

### Considerations
- GLTF models are more GPU-intensive than simple geometry
- Each ghost creates a cloned scene graph
- Limit concurrent ghosts to 8 for smooth performance

## Troubleshooting

### Model Not Visible
1. Check scale - try `[0.1, 0.1, 0.1]` or `[10, 10, 10]`
2. Check rotation - model might be facing away
3. Check position - might be too high/low
4. Open browser console for loading errors

### Model Too Dark
- Material override should handle this
- Check emissiveIntensity is set to 2
- Verify Bloom post-processing is active

### Performance Issues
- Reduce max concurrent ghosts in game engine
- Lower model poly count if possible
- Disable shadows: Remove `castShadow` from material override

## Alternative: Fallback to Spheres

If the GLTF model causes issues, you can easily revert to sphere geometry by replacing the `<primitive>` with:

```typescript
<mesh ref={groupRef} castShadow>
  <sphereGeometry args={[ghost.isBoss ? 1.5 : 0.8, 32, 32]} />
  <meshStandardMaterial
    color={ghost.isBoss ? '#ef4444' : '#d8b4fe'}
    emissive={ghost.isBoss ? '#dc2626' : '#22d3ee'}
    emissiveIntensity={2}
    transparent
    opacity={0.9}
    roughness={0.2}
    metalness={0.1}
  />
</mesh>
```

## Model Credits

Check `public/models/ghost/license.txt` for attribution and licensing information.

---

**Result**: The ghosts now use a proper 3D model while maintaining the glowing holographic aesthetic!
