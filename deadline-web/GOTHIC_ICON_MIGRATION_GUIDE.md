# Gothic Icon Migration Guide

## Overview

This guide provides step-by-step instructions for migrating from the current `@iconify/react` icon system to the new `GothicIcon` component with `lucide-react`. The migration ensures consistent gothic styling, improved accessibility, and better performance across the DeadLine application.

## Why Migrate?

### Current System (`@iconify/react`)
- ❌ Inconsistent styling across components
- ❌ Manual glow effects applied per-component
- ❌ No standardized color theming
- ❌ Accessibility features not enforced
- ❌ Performance overhead from large icon library

### New System (`GothicIcon` + `lucide-react`)
- ✅ Consistent gothic aesthetic with automatic glow effects
- ✅ Thematic color coding (blood, arcane, soul, relic)
- ✅ Built-in accessibility features
- ✅ Interactive states (hover, active, disabled)
- ✅ Tree-shakeable, optimized bundle size
- ✅ TypeScript support with full type safety

## Breaking Changes

### 1. Icon Library Change
**Before:** `@iconify/react`  
**After:** `lucide-react`

### 2. Icon Names
Icon names have changed. Use the [Icon Registry](./kiro/specs/gothic-iconography-system/icon-registry.md) for mappings.

### 3. Styling Approach
**Before:** Manual inline styles and filters  
**After:** Variant-based theming with automatic styling

### 4. Import Statements
**Before:**
```tsx
import { Icon } from '@iconify/react';
```

**After:**
```tsx
import { Skull, BookOpen, User } from 'lucide-react';
import { GothicIcon } from '@/components/GothicIcon';
```

## Migration Steps

### Step 1: Install Dependencies

```bash
npm install lucide-react
```

Note: You can keep `@iconify/react` installed during the migration for gradual transition.

### Step 2: Identify Icons to Migrate

Use the Icon Registry to map your current icons:

| Current (@iconify) | New (lucide-react) | Variant |
|-------------------|-------------------|---------|
| `game-icons:skeletal-hand` | `Skull` | blood |
| `game-icons:spell-book` | `BookOpen` | arcane |
| `game-icons:laurel-crown` | `Medal` | relic |
| `solar:user-bold` | `User` | soul |
| `solar:settings-bold` | `Settings` | soul |
| `solar:trash-bin-trash-bold` | `Trash2` | blood |
| `solar:document-text-bold` | `FileText` | arcane |
| `solar:ghost-bold` | `Ghost` | blood |
| `solar:pen-new-square-bold` | `PenTool` | arcane |
| `solar:folder-bold` | `Folder` | soul |
| `solar:door-opened-bold` | `DoorOpen` | arcane |
| `solar:add-circle-bold` | `PlusCircle` | arcane |
| `solar:book-open-bold` | `BookOpen` | arcane |
| `solar:close-circle-bold` | `X` | blood |
| `solar:alt-arrow-down-bold` | `ChevronDown` | soul |
| `solar:alt-arrow-right-bold` | `ChevronRight` | soul |
| `solar:hammer-bold` | `Hammer` | arcane |
| `game-icons:stone-arch` | `Landmark` | neutral |
| `game-icons:stone-pillar` | `Columns` | neutral |
| `game-icons:spider-web` | `Network` | neutral |
| `game-icons:gargoyle` | `Castle` | neutral |
| `game-icons:torch` | `Flame` | blood |
| `game-icons:chain` | `Link` | neutral |
| `game-icons:rune-stone` | `Hexagon` | relic |
| `game-icons:broken-chain` | `Unlink` | blood |
| `game-icons:locked-chest` | `Lock` | blood |
| `game-icons:pentagram-rose` | `Sparkles` | soul |

### Step 3: Migration Patterns

#### Pattern 1: Basic Icon Display

**Before:**
```tsx
<Icon 
  icon="game-icons:skeletal-hand"
  className="w-20 h-20 text-red-500"
  style={{ filter: 'drop-shadow(0 0 20px rgba(239, 68, 68, 0.8))' }}
/>
```

**After:**
```tsx
import { Skull } from 'lucide-react';
import { GothicIcon } from '@/components/GothicIcon';

<GothicIcon variant="blood" size="xl">
  <Skull />
</GothicIcon>
```

#### Pattern 2: Interactive Button Icon

**Before:**
```tsx
<button onClick={handleDelete}>
  <Icon 
    icon="solar:trash-bin-trash-bold" 
    className="size-4 text-red-500 hover:text-red-400"
  />
</button>
```

**After:**
```tsx
import { Trash2 } from 'lucide-react';
import { GothicIcon } from '@/components/GothicIcon';

<button onClick={handleDelete}>
  <GothicIcon variant="blood" size="md" interactive aria-label="Delete">
    <Trash2 />
  </GothicIcon>
</button>
```

#### Pattern 3: Decorative Icon with Text

**Before:**
```tsx
<div className="flex items-center gap-2">
  <Icon icon="solar:ghost-bold" className="size-5 text-cyan-400" />
  <span>Active Document</span>
</div>
```

**After:**
```tsx
import { Ghost } from 'lucide-react';
import { GothicIcon } from '@/components/GothicIcon';

<div className="flex items-center gap-2">
  <GothicIcon variant="blood" size="sm" aria-hidden="true">
    <Ghost />
  </GothicIcon>
  <span>Active Document</span>
</div>
```

#### Pattern 4: Conditional Icon States

**Before:**
```tsx
{isActive ? (
  <Icon icon="solar:ghost-bold" className="size-5 text-cyan-400 animate-bounce" />
) : (
  <Icon icon="solar:document-text-bold" className="size-5 text-zinc-500" />
)}
```

**After:**
```tsx
import { Ghost, FileText } from 'lucide-react';
import { GothicIcon } from '@/components/GothicIcon';

{isActive ? (
  <GothicIcon variant="blood" size="sm" className="animate-bounce">
    <Ghost />
  </GothicIcon>
) : (
  <GothicIcon variant="arcane" size="sm">
    <FileText />
  </GothicIcon>
)}
```

#### Pattern 5: Animated Icons

**Before:**
```tsx
<Icon 
  icon="game-icons:torch" 
  className="w-16 h-16 text-orange-600 animate-[torchFlicker_3s_ease-in-out_infinite]" 
/>
```

**After:**
```tsx
import { Flame } from 'lucide-react';
import { GothicIcon } from '@/components/GothicIcon';

<GothicIcon 
  variant="blood" 
  size="lg" 
  className="animate-[torchFlicker_3s_ease-in-out_infinite]"
>
  <Flame />
</GothicIcon>
```

#### Pattern 6: Size Mapping

| @iconify className | GothicIcon size | Pixels |
|-------------------|----------------|--------|
| `w-3 h-3` / `size-3` | `xs` | 16px |
| `w-4 h-4` / `size-4` | `sm` | 20px |
| `w-5 h-5` / `size-5` | `md` | 24px |
| `w-6 h-6` / `size-6` | `lg` | 32px |
| `w-8 h-8` / `size-8` | `xl` | 48px |
| `w-12 h-12` | `size={48}` | 48px |
| `w-16 h-16` | `size={64}` | 64px |
| `w-20 h-20` | `size={80}` | 80px |

### Step 4: Component-Specific Migration Examples

#### Example 1: DeadLineHub Navigation Cards

**Before:**
```tsx
<Icon 
  icon="game-icons:skeletal-hand"
  className="w-20 h-20 text-red-500 transition-all duration-300 group-hover:scale-110"
  style={{ filter: 'drop-shadow(0 0 20px rgba(239, 68, 68, 0.8))' }}
/>
```

**After:**
```tsx
import { Skull } from 'lucide-react';
import { GothicIcon } from '@/components/GothicIcon';

<GothicIcon variant="blood" size="xl" interactive>
  <Skull />
</GothicIcon>
```

**Changes:**
- Removed manual `filter` style (automatic with variant)
- Removed manual `group-hover:scale-110` (automatic with `interactive`)
- Simplified color management with `variant="blood"`

#### Example 2: Sidebar Document Icons

**Before:**
```tsx
{isActive ? (
  <Icon
    icon="solar:ghost-bold"
    className="size-5 text-cyan-400 animate-bounce"
  />
) : (
  <Icon icon="solar:document-text-bold" className="size-5 text-zinc-500" />
)}
```

**After:**
```tsx
import { Ghost, FileText } from 'lucide-react';
import { GothicIcon } from '@/components/GothicIcon';

{isActive ? (
  <GothicIcon variant="blood" size="sm" className="animate-bounce">
    <Ghost />
  </GothicIcon>
) : (
  <GothicIcon variant="arcane" size="sm">
    <FileText />
  </GothicIcon>
)}
```

#### Example 3: Sidebar Action Buttons

**Before:**
```tsx
<button
  onClick={(e) => {
    e.stopPropagation();
    onDeleteDoc(item.id);
  }}
  className="opacity-0 group-hover:opacity-100 transition-all p-2 text-zinc-600 hover:text-red-500 hover:scale-110 rounded"
  title="Bury this draft"
>
  <Icon icon="solar:trash-bin-trash-bold" className="size-4" />
</button>
```

**After:**
```tsx
import { Trash2 } from 'lucide-react';
import { GothicIcon } from '@/components/GothicIcon';

<button
  onClick={(e) => {
    e.stopPropagation();
    onDeleteDoc(item.id);
  }}
  className="opacity-0 group-hover:opacity-100 transition-all p-2 rounded"
  title="Bury this draft"
>
  <GothicIcon variant="blood" size="sm" interactive aria-label="Delete document">
    <Trash2 />
  </GothicIcon>
</button>
```

**Changes:**
- Removed manual color classes (handled by variant)
- Removed manual `hover:scale-110` (automatic with `interactive`)
- Added `aria-label` for accessibility

#### Example 4: Decorative Background Icons

**Before:**
```tsx
<div className="absolute top-8 left-8 w-24 h-24 opacity-15 pointer-events-none z-5 animate-[gentleSway_6s_ease-in-out_infinite]">
  <Icon icon="game-icons:spider-web" className="w-full h-full text-gray-400" />
</div>
```

**After:**
```tsx
import { Network } from 'lucide-react';
import { GothicIcon } from '@/components/GothicIcon';

<div className="absolute top-8 left-8 opacity-15 pointer-events-none z-5 animate-[gentleSway_6s_ease-in-out_infinite]">
  <GothicIcon variant="neutral" size={96} aria-hidden="true">
    <Network />
  </GothicIcon>
</div>
```

**Changes:**
- Use custom size for large decorative icons
- Added `aria-hidden` since it's decorative
- Simplified wrapper div (no need for w-24 h-24)

### Step 5: Accessibility Improvements

The new system enforces accessibility best practices:

#### Interactive Icons MUST Have Labels

**Before (No Accessibility):**
```tsx
<button onClick={handleSettings}>
  <Icon icon="solar:settings-bold" className="size-5" />
</button>
```

**After (Accessible):**
```tsx
<button onClick={handleSettings}>
  <GothicIcon variant="soul" size="md" interactive aria-label="Open settings">
    <Settings />
  </GothicIcon>
</button>
```

#### Decorative Icons Should Be Hidden

**Before:**
```tsx
<div className="flex items-center gap-2">
  <Icon icon="solar:ghost-bold" className="size-4" />
  <span>100 words</span>
</div>
```

**After:**
```tsx
<div className="flex items-center gap-2">
  <GothicIcon variant="blood" size="sm" aria-hidden="true">
    <Ghost />
  </GothicIcon>
  <span>100 words</span>
</div>
```

### Step 6: Testing Your Migration

After migrating a component, verify:

1. **Visual Appearance**
   - [ ] Icon displays at correct size
   - [ ] Glow effect is visible
   - [ ] Color matches thematic variant
   - [ ] Hover states work (for interactive icons)

2. **Accessibility**
   - [ ] Interactive icons have `aria-label`
   - [ ] Decorative icons have `aria-hidden="true"`
   - [ ] Keyboard navigation works (Tab key)
   - [ ] Focus states are visible

3. **Performance**
   - [ ] No console warnings
   - [ ] Smooth animations
   - [ ] No layout shifts

4. **Functionality**
   - [ ] Click handlers still work
   - [ ] Conditional rendering works
   - [ ] State changes reflect correctly

## Component Migration Checklist

Track your migration progress:

### High Priority (User-Facing)
- [ ] DeadLineHub.tsx - Navigation cards
- [ ] Sidebar.tsx - Document list and actions
- [ ] ReaperBar.tsx - Timer and stats
- [ ] ModeSelectionScreen.tsx - Mode selection
- [ ] LandingPage.tsx - Hero section

### Medium Priority (Modals & Overlays)
- [ ] AuthModal.tsx - Authentication UI
- [ ] CompileModal.tsx - Export dialog
- [ ] SnapshotsModal.tsx - Version history
- [ ] VictoryModal.tsx - Success screen
- [ ] OnboardingStepper.tsx - Tutorial

### Low Priority (Settings & Profile)
- [ ] SettingsPage.tsx - Configuration
- [ ] ProfilePage.tsx - User profile
- [ ] Editor.tsx - Writing interface
- [ ] GrimoireEditor.tsx - Story editor
- [ ] HauntingEditor.tsx - Ritual mode

## Common Issues & Solutions

### Issue 1: Icon Not Found

**Problem:** `Cannot find module 'lucide-react'` or icon not exported

**Solution:** Check the [lucide-react icon list](https://lucide.dev/icons/) for the correct name. Some icons may have different names.

```tsx
// ❌ Wrong
import { Document } from 'lucide-react';

// ✅ Correct
import { FileText } from 'lucide-react';
```

### Issue 2: Size Doesn't Match

**Problem:** Icon appears too large or too small

**Solution:** Use the size mapping table or custom pixel value:

```tsx
// Preset size
<GothicIcon variant="blood" size="lg">
  <Skull />
</GothicIcon>

// Custom size
<GothicIcon variant="blood" size={40}>
  <Skull />
</GothicIcon>
```

### Issue 3: Glow Effect Too Intense

**Problem:** Glow overwhelms the icon

**Solution:** Adjust variant or use neutral for subtle glow:

```tsx
// Intense glow
<GothicIcon variant="blood" size="xl">
  <Flame />
</GothicIcon>

// Subtle glow
<GothicIcon variant="neutral" size="xl">
  <Flame />
</GothicIcon>
```

### Issue 4: Animation Not Working

**Problem:** Custom animations don't apply

**Solution:** Use `className` prop for custom animations:

```tsx
<GothicIcon 
  variant="blood" 
  size="md" 
  className="animate-spin"
>
  <Loader2 />
</GothicIcon>
```

### Issue 5: TypeScript Errors

**Problem:** Type errors with props

**Solution:** Import types and use them:

```tsx
import { GothicIcon, type GothicIconProps } from '@/components/GothicIcon';

const iconProps: GothicIconProps = {
  variant: 'blood',
  size: 'md',
  interactive: true,
  'aria-label': 'Delete'
};

<GothicIcon {...iconProps}>
  <Trash2 />
</GothicIcon>
```

## Gradual Migration Strategy

You don't need to migrate everything at once:

### Phase 1: New Features (Week 1)
- Use `GothicIcon` for all new components
- Build familiarity with the system

### Phase 2: High-Traffic Pages (Week 2)
- Migrate DeadLineHub
- Migrate Sidebar
- Migrate main navigation

### Phase 3: Secondary Pages (Week 3)
- Migrate modals and overlays
- Migrate settings and profile

### Phase 4: Cleanup (Week 4)
- Remove `@iconify/react` dependency
- Remove legacy icon code
- Update documentation

## Performance Comparison

### Bundle Size Impact

**Before (@iconify/react):**
- Full icon library: ~500KB
- No tree-shaking
- Runtime icon loading

**After (lucide-react + GothicIcon):**
- Only imported icons: ~2KB per icon
- Full tree-shaking support
- Compile-time optimization

**Example:**
```tsx
// Before: Loads entire @iconify library
import { Icon } from '@iconify/react';

// After: Only loads Skull icon (~2KB)
import { Skull } from 'lucide-react';
```

### Runtime Performance

- **CSS Filters:** GPU-accelerated, better than SVG filters
- **Transform Animations:** Hardware-accelerated
- **Will-Change Hints:** Optimized for interactive icons

## Getting Help

### Resources
- [GothicIcon Documentation](./src/components/GothicIcon.md)
- [Visual Reference Guide](./src/components/GothicIconShowcase.tsx)
- [Usage Examples](./src/components/GothicIcon.examples.tsx)
- [Icon Registry](./kiro/specs/gothic-iconography-system/icon-registry.md)
- [lucide-react Docs](https://lucide.dev/guide/packages/lucide-react)

### Common Questions

**Q: Can I use both systems during migration?**  
A: Yes! Keep both libraries installed and migrate gradually.

**Q: What if I can't find a matching lucide icon?**  
A: Check the Icon Registry for alternatives, or request a new icon mapping.

**Q: Do I need to update CSS?**  
A: No, GothicIcon handles all styling internally.

**Q: Will this break existing functionality?**  
A: No, if you follow the migration patterns correctly.

## Conclusion

The Gothic Icon system provides:
- ✅ Consistent visual language
- ✅ Better accessibility
- ✅ Improved performance
- ✅ Easier maintenance
- ✅ Type safety

Take your time with the migration, test thoroughly, and refer to this guide whenever needed. The result will be a more polished, accessible, and maintainable application.

Happy migrating! 🦇
