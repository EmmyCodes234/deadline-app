# Design Document

## Overview

The Gothic Iconography System provides a unified, reusable component architecture for rendering icons with a consistent gothic aesthetic throughout the DeadLine application. The system wraps lucide-react icons with custom styling that creates the appearance of glowing, arcane artifacts.

## Architecture

### Component Hierarchy

```
GothicIcon (Wrapper Component)
├── Variant Styling Logic
├── Size Scaling Logic
├── Interaction State Management
└── lucide-react Icon (Child)
```

### Key Design Decisions

1. **Wrapper Pattern**: Use a wrapper component rather than modifying lucide-react icons directly, allowing flexibility and maintainability
2. **CSS-Based Effects**: Implement glows using CSS drop-shadow filters for performance
3. **Variant System**: Use a prop-based variant system for thematic color coding
4. **Composition Over Configuration**: Accept icon components as children rather than icon names as strings

## Components and Interfaces

### GothicIcon Component

```typescript
interface GothicIconProps {
  variant?: 'blood' | 'arcane' | 'soul' | 'relic' | 'neutral';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  interactive?: boolean;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  'aria-label'?: string;
  'aria-hidden'?: boolean;
  children: React.ReactElement; // lucide-react icon component
}
```

### Variant Configuration

```typescript
type VariantConfig = {
  color: string;           // Tailwind color class
  glowColor: string;       // RGB values for drop-shadow
  hoverGlowColor: string;  // RGB values for hover state
  intensity: number;       // Glow intensity multiplier
};

const VARIANTS: Record<string, VariantConfig> = {
  blood: {
    color: 'text-red-500',
    glowColor: 'rgba(239, 68, 68, 0.8)',
    hoverGlowColor: 'rgba(239, 68, 68, 1)',
    intensity: 1.2
  },
  arcane: {
    color: 'text-purple-400',
    glowColor: 'rgba(168, 85, 247, 0.8)',
    hoverGlowColor: 'rgba(168, 85, 247, 1)',
    intensity: 1.2
  },
  soul: {
    color: 'text-teal-400',
    glowColor: 'rgba(45, 212, 191, 0.8)',
    hoverGlowColor: 'rgba(45, 212, 191, 1)',
    intensity: 1.0
  },
  relic: {
    color: 'text-amber-300',
    glowColor: 'rgba(252, 211, 77, 0.8)',
    hoverGlowColor: 'rgba(252, 211, 77, 1)',
    intensity: 1.1
  },
  neutral: {
    color: 'text-gray-400',
    glowColor: 'rgba(156, 163, 175, 0.5)',
    hoverGlowColor: 'rgba(156, 163, 175, 0.7)',
    intensity: 0.8
  }
};
```

### Size Configuration

```typescript
const SIZES = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 48
};
```

## Data Models

### Icon Registry

For documentation and migration purposes, maintain a registry of all icons used in the application:

```typescript
interface IconRegistryEntry {
  name: string;
  component: LucideIcon;
  variant: GothicIconProps['variant'];
  usage: string[];
  migrated: boolean;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Variant Color Consistency
*For any* GothicIcon with a specified variant, the rendered icon color and glow color should match the variant's defined color scheme
**Validates: Requirements 2.1, 2.2, 2.3, 2.4**

### Property 2: Glow Effect Presence
*For any* GothicIcon that is not disabled, the rendered icon should have a visible drop-shadow filter applied
**Validates: Requirements 1.5, 7.2**

### Property 3: Interactive State Transitions
*For any* GothicIcon with interactive=true, hovering should increase the glow intensity and scale, and the transition should complete within 300ms
**Validates: Requirements 3.1, 3.2, 3.5**

### Property 4: Size Scaling Proportionality
*For any* GothicIcon with a specified size, the icon dimensions and glow radius should scale proportionally
**Validates: Requirements 1.3, 7.4, 7.5**

### Property 5: Disabled State Appearance
*For any* GothicIcon with disabled=true, the opacity should be reduced and glow effects should be removed
**Validates: Requirements 3.4**

### Property 6: Accessibility Label Requirement
*For any* GothicIcon that is not decorative (aria-hidden !== true), an aria-label should be present
**Validates: Requirements 8.1, 8.3**

### Property 7: No Flat Fill Rendering
*For any* GothicIcon, the rendered SVG should not contain solid fill colors without accompanying glow effects
**Validates: Requirements 7.1, 7.2**

### Property 8: Child Component Validation
*For any* GothicIcon, the children prop should be a valid React element (lucide-react icon)
**Validates: Requirements 1.1**

### Property 9: Style Prop Merging
*For any* GothicIcon with custom className or style props, the custom styles should be applied without overriding core gothic styling
**Validates: Requirements 1.4**

### Property 10: Touch Target Minimum Size
*For any* interactive GothicIcon, the clickable area should be at least 44x44px
**Validates: Requirements 8.5**

## Error Handling

### Invalid Variant
- **Error**: Variant prop contains invalid value
- **Handling**: Fall back to 'neutral' variant and log warning in development

### Missing Accessibility Label
- **Error**: Interactive icon without aria-label
- **Handling**: Log warning in development, require in TypeScript types

### Invalid Child Component
- **Error**: Children is not a valid React element
- **Handling**: Throw error with helpful message

### Size Conflicts
- **Error**: Both size prop and custom width/height in style
- **Handling**: Size prop takes precedence, log warning

## Testing Strategy

### Unit Tests
- Test variant color application for each variant type
- Test size scaling calculations
- Test prop merging logic
- Test disabled state styling
- Test accessibility attribute presence

### Property-Based Tests
- Generate random combinations of props and verify consistent rendering
- Generate random sizes and verify proportional glow scaling
- Generate random variants and verify color consistency
- Test that all interactive icons maintain minimum touch targets

### Visual Regression Tests
- Capture screenshots of each variant at each size
- Compare against baseline images
- Test hover and active states
- Test disabled states

### Integration Tests
- Test GothicIcon within actual application components
- Test icon rendering in different layout contexts
- Test performance with many icons on screen
- Test migration from legacy icons

### Accessibility Tests
- Verify screen reader announcements
- Test keyboard navigation and focus states
- Verify color contrast ratios
- Test with color blindness simulators

## Implementation Notes

### CSS Filter Performance
Use `will-change: filter` on interactive icons to optimize GPU acceleration:

```css
.gothic-icon-interactive {
  will-change: filter, transform;
}
```

### Glow Intensity Calculation
Glow radius should scale with icon size:

```typescript
const glowRadius = Math.max(8, size * 0.4);
```

### Migration Strategy
1. Create GothicIcon component
2. Add to component library with documentation
3. Identify high-traffic pages for initial migration
4. Create migration guide with before/after examples
5. Update icons incrementally by feature area
6. Remove legacy icon code once migration complete

### Bundle Optimization
Import lucide-react icons individually to enable tree-shaking:

```typescript
// Good
import { Skull, Flame, BookOpen } from 'lucide-react';

// Bad
import * as Icons from 'lucide-react';
```

## Usage Examples

### Basic Usage
```tsx
import { Skull } from 'lucide-react';
import { GothicIcon } from '@/components/GothicIcon';

<GothicIcon variant="relic" size="md">
  <Skull />
</GothicIcon>
```

### Interactive Button
```tsx
<button className="p-2">
  <GothicIcon variant="blood" size="lg" interactive aria-label="Delete item">
    <Trash2 />
  </GothicIcon>
</button>
```

### Navigation Icon
```tsx
<GothicIcon variant="soul" size="md" interactive aria-label="Settings">
  <Settings />
</GothicIcon>
```

### Decorative Icon
```tsx
<GothicIcon variant="arcane" size="sm" aria-hidden="true">
  <Sparkles />
</GothicIcon>
```
