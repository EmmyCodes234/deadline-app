# Master Icon Definition List

This document serves as the **source of truth** for all icon implementations in the DeadLine application. Every icon is mapped to its gothic metaphor, base shape (from lucide-react), and required color variant according to the Gothic Iconography System.

## A. GLOBAL NAVIGATION & UTILITY

| Function | Gothic Metaphor | Base Shape (Lucide) | Color Variant |
|----------|----------------|---------------------|---------------|
| DeadLine Hub (Home) | The Crypt Portal | `landmark` / `door-open` | 🟢 Green/Teal (soul) |
| Back / Return | Reversed Runic Arrow | `arrow-left` / `chevron-left` | 🟢 Green/Teal (soul) |
| Close / Cancel | Shattered Bones 'X' | `x` / `x-circle` | 🔴 Red/Orange (blood) |
| Menu / Options | The Stacked Tablets | `menu` / `align-justify` | 🟢 Green/Teal (soul) |
| Info / Help | The Whispering Eye | `info` / `help-circle` | 🟢 Green/Teal (soul) |

## B. AUTHENTICATION & USER

| Function | Gothic Metaphor | Base Shape (Lucide) | Color Variant |
|----------|----------------|---------------------|---------------|
| Profile / User | The Scribe's Hood | `user` / `user-circle-2` | 🟢 Green/Teal (soul) |
| Sign In / Login | Unlocking the Spectral Gate | `log-in` / `key` | 🟢 Green/Teal (soul) |
| Sign Out / Logout | The Vanishing Spirit | `log-out` / `ghost` | 🟢 Green/Teal (soul) |
| Settings | The Arcane Clockwork | `settings` / `cog` | 🟢 Green/Teal (soul) |

## C. HAUNTING RITUAL MODE

| Function | Gothic Metaphor | Base Shape (Lucide) | Color Variant |
|----------|----------------|---------------------|---------------|
| Mode Icon | The Chronos Skull | `skull` | 🔴 Red/Orange (blood) |
| Play / Begin | The Ignite Rune | `play` / `flame` | 🔴 Red/Orange (blood) |
| Pause | The Time Freeze Sigil | `pause` | 🔴 Red/Orange (blood) |
| Retry / Replay | The Resurrection Cycle | `refresh-cw` / `rotate-ccw` | 🔴 Red/Orange (blood) |
| Locked Level | Rusted Chains & Padlock | `lock` | 🔴 Red/Orange (blood, dimmed) |
| Unlocked Level | The Open Cemetery Gate | `unlock` / `door-open` | 🔴 Red/Orange (blood, bright) |
| Patience/Sanity | The Vitality Vial | `heart` / `activity` | 🔴 Red/Orange (blood) |
| Speed / WPM | The Lightning Quill | `zap` / `timer` | 🔴 Red/Orange (blood) |

## D. GRIMOIRE EDITOR MODE

| Function | Gothic Metaphor | Base Shape (Lucide) | Color Variant |
|----------|----------------|---------------------|---------------|
| Mode Icon | The Arcane Tome | `book-open` / `scroll-text` | 🟣 Purple/Blue (arcane) |
| New Page/Story | The Blank Parchment | `file-plus` / `pen-tool` | 🟣 Purple/Blue (arcane) |
| Edit | The Blood Quill | `edit` / `pencil` | 🟣 Purple/Blue (arcane) |
| Save | The Wax Seal | `save` / `hard-drive` | 🟣 Purple/Blue (arcane) |
| Delete / Trash | The Banishing Flame | `trash-2` / `flame` | 🔴 Red/Orange (blood, destructive) |
| Word Count | The Rune Tally | `hash` / `tally-5` | 🟣 Purple/Blue (arcane) |

## E. REWARDS & STATUS

| Function | Gothic Metaphor | Base Shape (Lucide) | Color Variant |
|----------|----------------|---------------------|---------------|
| Skull Score | The Golden Relic Skull | `skull` | 🟡 Gold/Bone (relic) |
| Achievement | The Medallion of Favor | `medal` / `trophy` | 🟡 Gold/Bone (relic) |
| Success / Saved | The Glowing Mark | `check` / `check-circle` | 🟢 Green/Teal (soul) |
| Error / Warning | The Cursed Mark | `alert-triangle` / `alert-octagon` | 🔴 Red/Orange (blood) |
| Loading | The Summoning Circle | `loader-2` (spinning) | Context Dependent |

## Implementation Notes

### Variant Mapping
- **🔴 Red/Orange (blood)**: `variant="blood"` - Haunting Ritual mode, danger, destructive actions
- **🟣 Purple/Blue (arcane)**: `variant="arcane"` - Grimoire Editor mode, creative actions
- **🟢 Green/Teal (soul)**: `variant="soul"` - Profile, Settings, navigation, success states
- **🟡 Gold/Bone (relic)**: `variant="relic"` - Currency, achievements, rewards

### Usage Example

```tsx
import { Skull } from 'lucide-react';
import { GothicIcon } from '@/components/GothicIcon';

// Haunting Ritual Mode Icon
<GothicIcon variant="blood" size="lg" interactive aria-label="Haunting Ritual Mode">
  <Skull />
</GothicIcon>

// Profile Icon
<GothicIcon variant="soul" size="md" interactive aria-label="User Profile">
  <User />
</GothicIcon>

// Achievement Icon
<GothicIcon variant="relic" size="xl" aria-label="Achievement Unlocked">
  <Medal />
</GothicIcon>
```

### Special Cases

#### Locked vs Unlocked States
For locked/unlocked levels, use the same `blood` variant but adjust opacity:
- **Locked**: `disabled={true}` (automatically reduces opacity)
- **Unlocked**: `disabled={false}` (full brightness)

#### Context-Dependent Icons
The Loading icon (`loader-2`) should use the variant appropriate to its context:
- Loading in Haunting Ritual: `variant="blood"`
- Loading in Grimoire Editor: `variant="arcane"`
- Loading in Profile/Settings: `variant="soul"`

#### Destructive Actions
Delete/Trash actions always use `variant="blood"` regardless of mode, as they represent destructive operations.

## Migration Checklist

When migrating existing icons to the Gothic Iconography System:

1. ✅ Identify the icon's function from this registry
2. ✅ Import the corresponding lucide-react icon
3. ✅ Wrap with `<GothicIcon>` using the specified variant
4. ✅ Add appropriate `aria-label` for accessibility
5. ✅ Set `interactive={true}` if the icon is clickable
6. ✅ Test hover states and glow effects
7. ✅ Verify color matches the thematic coding
8. ✅ Update the icon registry entry to mark as migrated

## Icon Registry Status

Track migration progress here:

- [ ] A. Global Navigation & Utility (0/5 migrated)
- [ ] B. Authentication & User (0/4 migrated)
- [ ] C. Haunting Ritual Mode (0/8 migrated)
- [ ] D. Grimoire Editor Mode (0/6 migrated)
- [ ] E. Rewards & Status (0/5 migrated)

**Total Progress: 0/28 icons migrated**
