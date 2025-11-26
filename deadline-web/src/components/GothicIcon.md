# GothicIcon Component Documentation

## Overview

The `GothicIcon` component is a wrapper that transforms standard lucide-react icons into glowing, arcane artifacts that fit the gothic aesthetic of the DeadLine application. Icons are not flat digital assets but physical, mystical objects—carved into crypt walls, forged in rusted metal, or glowing runes hovering in the mist.

## Installation

```bash
npm install lucide-react
```

## Basic Usage

```tsx
import { Skull } from 'lucide-react';
import { GothicIcon } from '@/components/GothicIcon';

function MyComponent() {
  return (
    <GothicIcon variant="relic" size="md">
      <Skull />
    </GothicIcon>
  );
}
```

## Props

### `variant`
**Type:** `'blood' | 'arcane' | 'soul' | 'relic' | 'neutral'`  
**Default:** `'neutral'`

Determines the thematic color and glow effect applied to the icon. Each variant has specific semantic meaning:

- **`blood`** (🔴 Red/Orange): Haunting Ritual mode, danger, destructive actions, time pressure
- **`arcane`** (🟣 Purple/Blue): Grimoire Editor mode, creative actions, magical elements
- **`soul`** (🟢 Green/Teal): User profile, settings, navigation, success states
- **`relic`** (🟡 Gold/Bone): Currency, achievements, rewards, valuable items
- **`neutral`** (⚪ Gray): Default fallback, non-thematic elements

```tsx
<GothicIcon variant="blood" size="md">
  <Flame />
</GothicIcon>
```

### `size`
**Type:** `'xs' | 'sm' | 'md' | 'lg' | 'xl' | number`  
**Default:** `'md'`

Controls the icon size. Use preset strings for consistency or a custom number for specific pixel dimensions.

**Size Presets:**
- `xs`: 16px
- `sm`: 20px
- `md`: 24px (default)
- `lg`: 32px
- `xl`: 48px

```tsx
{/* Using preset */}
<GothicIcon variant="soul" size="lg">
  <Settings />
</GothicIcon>

{/* Using custom size */}
<GothicIcon variant="arcane" size={40}>
  <BookOpen />
</GothicIcon>
```

### `interactive`
**Type:** `boolean`  
**Default:** `false`

Enables hover and active state animations. Set to `true` for clickable icons (buttons, links, etc.).

**Interactive Effects:**
- Hover: Glow intensifies, icon scales up 1.05x
- Active (click): Icon scales down to 0.95x for tactile feedback
- Focus: Same as hover for keyboard navigation
- Smooth 300ms transitions

```tsx
<button onClick={handleClick}>
  <GothicIcon variant="blood" size="md" interactive aria-label="Delete">
    <Trash2 />
  </GothicIcon>
</button>
```

### `disabled`
**Type:** `boolean`  
**Default:** `false`

Disables the icon, reducing opacity and removing glow effects. Use for unavailable actions.

```tsx
<GothicIcon variant="blood" size="md" disabled aria-label="Locked level">
  <Lock />
</GothicIcon>
```

### `className`
**Type:** `string`  
**Default:** `''`

Additional CSS classes to apply. These are merged with gothic styling without conflicts.

```tsx
<GothicIcon variant="soul" size="md" className="mr-2">
  <User />
</GothicIcon>
```

### `style`
**Type:** `React.CSSProperties`  
**Default:** `{}`

Custom inline styles. Merged with gothic styles; size prop takes precedence over width/height in style.

```tsx
<GothicIcon 
  variant="arcane" 
  size="md" 
  style={{ marginLeft: '8px' }}
>
  <Sparkles />
</GothicIcon>
```

### `aria-label`
**Type:** `string`  
**Default:** `undefined`

Accessibility label for screen readers. **Required for interactive icons** that convey meaning.

```tsx
<GothicIcon variant="soul" size="md" interactive aria-label="Open settings">
  <Settings />
</GothicIcon>
```

### `aria-hidden`
**Type:** `boolean`  
**Default:** `undefined`

Marks the icon as decorative, hiding it from screen readers. Use when the icon is purely visual and adjacent text provides context.

```tsx
<div>
  <GothicIcon variant="relic" size="sm" aria-hidden="true">
    <Skull />
  </GothicIcon>
  <span>100 Skull Score</span>
</div>
```

### `children`
**Type:** `React.ReactElement`  
**Required:** Yes

A lucide-react icon component. Must be a valid React element.

```tsx
import { Heart, Zap, BookOpen } from 'lucide-react';

<GothicIcon variant="blood" size="md">
  <Heart />
</GothicIcon>
```

## Variant Meanings & Usage Guidelines

### Blood Variant (🔴 Red/Orange)
**Semantic Meaning:** Danger, urgency, time pressure, destructive actions

**Use For:**
- Haunting Ritual mode icons
- Delete/trash actions
- Error states
- Warning indicators
- Timer/deadline indicators
- Locked states (with disabled prop)

**Examples:**
```tsx
{/* Haunting Ritual mode */}
<GothicIcon variant="blood" size="xl">
  <Skull />
</GothicIcon>

{/* Delete action */}
<GothicIcon variant="blood" size="md" interactive aria-label="Delete story">
  <Trash2 />
</GothicIcon>

{/* Error state */}
<GothicIcon variant="blood" size="sm">
  <AlertTriangle />
</GothicIcon>
```

### Arcane Variant (🟣 Purple/Blue)
**Semantic Meaning:** Creativity, magic, writing, mystical elements

**Use For:**
- Grimoire Editor mode icons
- Writing/editing actions
- Creative tools
- Magical/mystical elements
- Save/document actions

**Examples:**
```tsx
{/* Grimoire Editor mode */}
<GothicIcon variant="arcane" size="xl">
  <BookOpen />
</GothicIcon>

{/* Edit action */}
<GothicIcon variant="arcane" size="md" interactive aria-label="Edit story">
  <Edit />
</GothicIcon>

{/* Word count */}
<GothicIcon variant="arcane" size="sm" aria-hidden="true">
  <Hash />
</GothicIcon>
```

### Soul Variant (🟢 Green/Teal)
**Semantic Meaning:** Navigation, user identity, settings, success

**Use For:**
- Navigation icons
- User profile/authentication
- Settings and configuration
- Success states
- General utility actions
- Back/return navigation

**Examples:**
```tsx
{/* Profile */}
<GothicIcon variant="soul" size="md" interactive aria-label="User profile">
  <User />
</GothicIcon>

{/* Settings */}
<GothicIcon variant="soul" size="md" interactive aria-label="Settings">
  <Settings />
</GothicIcon>

{/* Success state */}
<GothicIcon variant="soul" size="lg">
  <CheckCircle />
</GothicIcon>
```

### Relic Variant (🟡 Gold/Bone)
**Semantic Meaning:** Value, rewards, achievements, currency

**Use For:**
- Skull score/currency
- Achievements and medals
- Rewards and unlocks
- Valuable items
- Special status indicators

**Examples:**
```tsx
{/* Skull score */}
<GothicIcon variant="relic" size="lg" aria-hidden="true">
  <Skull />
</GothicIcon>

{/* Achievement */}
<GothicIcon variant="relic" size="xl" aria-label="Achievement unlocked">
  <Medal />
</GothicIcon>
```

### Neutral Variant (⚪ Gray)
**Semantic Meaning:** Default, non-thematic, placeholder

**Use For:**
- Fallback when no specific variant applies
- Placeholder icons
- Non-thematic UI elements

**Examples:**
```tsx
<GothicIcon variant="neutral" size="md">
  <MoreHorizontal />
</GothicIcon>
```

## Accessibility Guidelines

### Interactive Icons
All interactive icons (buttons, links) **must** include an `aria-label`:

```tsx
{/* ✅ Good */}
<button>
  <GothicIcon variant="soul" size="md" interactive aria-label="Open menu">
    <Menu />
  </GothicIcon>
</button>

{/* ❌ Bad - missing aria-label */}
<button>
  <GothicIcon variant="soul" size="md" interactive>
    <Menu />
  </GothicIcon>
</button>
```

### Decorative Icons
Icons that are purely decorative (adjacent text provides context) should use `aria-hidden`:

```tsx
{/* ✅ Good */}
<button>
  <GothicIcon variant="blood" size="sm" aria-hidden="true">
    <Trash2 />
  </GothicIcon>
  <span>Delete</span>
</button>
```

### Touch Targets
Interactive icons automatically ensure a minimum 44x44px touch target for accessibility. Small icons receive padding to meet this requirement.

### Keyboard Navigation
Interactive icons are keyboard-focusable (tabIndex=0) and show focus states identical to hover states.

### Color Contrast
Do not rely solely on color to convey meaning. Always pair color-coded icons with text labels or aria-labels.

## Performance Considerations

### GPU Acceleration
Interactive icons use `will-change: filter, transform` for optimized animations. Transforms are used instead of position changes to leverage GPU acceleration.

### Tree Shaking
Import lucide-react icons individually to enable tree-shaking:

```tsx
// ✅ Good - tree-shakeable
import { Skull, Flame, BookOpen } from 'lucide-react';

// ❌ Bad - imports entire library
import * as Icons from 'lucide-react';
```

### CSS Filters
Glow effects use CSS `drop-shadow` filters instead of SVG filters for better performance with many icons.

## TypeScript Support

The component is fully typed with TypeScript:

```typescript
import { GothicIconProps, GothicIconVariant, GothicIconSize } from '@/components/GothicIcon';

// Type-safe variant
const variant: GothicIconVariant = 'blood';

// Type-safe size
const size: GothicIconSize = 'lg';

// Full props type
const props: GothicIconProps = {
  variant: 'arcane',
  size: 'md',
  interactive: true,
  'aria-label': 'Edit'
};
```

## Common Patterns

### Icon Button
```tsx
<button 
  onClick={handleClick}
  className="p-2 rounded hover:bg-gray-800 transition-colors"
>
  <GothicIcon variant="blood" size="lg" interactive aria-label="Delete item">
    <Trash2 />
  </GothicIcon>
</button>
```

### Navigation Link
```tsx
<Link to="/profile">
  <GothicIcon variant="soul" size="md" interactive aria-label="Go to profile">
    <User />
  </GothicIcon>
</Link>
```

### Status Indicator
```tsx
<div className="flex items-center gap-2">
  <GothicIcon variant="soul" size="sm" aria-hidden="true">
    <CheckCircle />
  </GothicIcon>
  <span>Story saved successfully</span>
</div>
```

### Decorative Header
```tsx
<h2 className="flex items-center gap-3">
  <GothicIcon variant="arcane" size="xl" aria-hidden="true">
    <BookOpen />
  </GothicIcon>
  <span>Grimoire Editor</span>
</h2>
```

### Loading State
```tsx
<GothicIcon variant="blood" size="md" className="animate-spin">
  <Loader2 />
</GothicIcon>
```

## Error Handling

### Invalid Variant
If an invalid variant is provided, the component falls back to `'neutral'` and logs a warning in development.

### Missing Accessibility Label
Interactive icons without `aria-label` or `aria-hidden` trigger a console warning in development.

### Invalid Child
If `children` is not a valid React element, the component throws an error with a helpful message.

## Browser Support

The component uses modern CSS features:
- CSS `filter` (drop-shadow)
- CSS `transform`
- CSS `will-change`
- CSS transitions

Supported in all modern browsers (Chrome, Firefox, Safari, Edge).

## Related Components

- **lucide-react**: Base icon library providing skeletal shapes
- **Icon Registry**: Master list of all application icons and their variants

## Further Reading

- [lucide-react Documentation](https://lucide.dev/guide/packages/lucide-react)
- [WCAG 2.1 Touch Target Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)
- [Icon Registry](../../../.kiro/specs/gothic-iconography-system/icon-registry.md)
