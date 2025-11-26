# Icon Migration Analysis

## Overview
This document identifies all existing icon usage in the DeadLine application and maps them to the appropriate GothicIcon variants for migration.

## Current Icon Libraries
The application currently uses two icon libraries:
1. **@iconify/react** - Primary icon library (game-icons, solar icons)
2. **lucide-react** - Secondary library (used in a few components)

## Icon Usage by Component

### High Priority Components (Task 10.2)

#### 1. DeadLineHub.tsx
**Current Usage:** @iconify/react
**Icons Found:**
- `game-icons:stone-arch` - Decorative
- `game-icons:stone-pillar` - Decorative
- `game-icons:spider-web` - Decorative
- `game-icons:gargoyle` - Decorative
- `game-icons:torch` - Decorative
- `game-icons:chain` - Decorative
- `game-icons:skeletal-hand` - Mode icon (Haunting Ritual)
- `game-icons:spell-book` - Mode icon (Grimoire Editor)
- `game-icons:laurel-crown` - Mode icon (Scribe's Sanctum)
- `game-icons:pentagram-rose` - Mode icon (Settings)
- `game-icons:rune-stone` - Decorative divider
- `game-icons:broken-chain` - Sign out button
- `game-icons:locked-chest` - Sign in button

**Migration Strategy:**
- Mode icons → Keep as @iconify (thematic, not in registry)
- Decorative icons → Keep as @iconify (atmospheric)
- Sign out button → Migrate to GothicIcon with `auth-logout-ghost` (variant: soul)
- Sign in button → Migrate to GothicIcon with `auth-login-key` (variant: soul)

#### 2. Sidebar.tsx
**Current Usage:** @iconify/react (solar icons)
**Icons Found:**
- `solar:alt-arrow-down-bold` - Expand/collapse
- `solar:alt-arrow-right-bold` - Expand/collapse
- `solar:door-opened-bold` - Mausoleum icon
- `solar:trash-bin-trash-bold` - Delete button
- `solar:ghost-bold` - Active document indicator
- `solar:document-text-bold` - Document icon
- `solar:add-circle-bold` - Add new document
- `solar:folder-bold` - Crypt header
- `solar:close-circle-bold` - Close sidebar (mobile)
- `solar:pen-new-square-bold` - New tome page button
- `solar:hammer-bold` - Build mausoleum button
- `solar:book-open-bold` - Open in tab button

**Migration Strategy:**
- Expand/collapse arrows → Migrate to GothicIcon with `nav-back-chevron` (variant: soul)
- Door icon → Migrate to GothicIcon with `nav-home-door` (variant: soul)
- Trash icon → Migrate to GothicIcon with `grimoire-delete` (variant: blood)
- Ghost icon → Keep as solar (thematic indicator)
- Document icon → Keep as solar (file type indicator)
- Add circle → Keep as solar (action button)
- Folder icon → Keep as solar (category icon)
- Close icon → Migrate to GothicIcon with `action-close-x` (variant: blood)
- Pen icon → Migrate to GothicIcon with `grimoire-new-pen` (variant: arcane)
- Hammer icon → Keep as solar (construction metaphor)
- Book open icon → Migrate to GothicIcon with `grimoire-mode-icon` (variant: arcane)

#### 3. AuthModal.tsx
**Current Usage:** lucide-react
**Icons Found:**
- `Mail` - Email input label
- `Lock` - Password input label
- `X` - Close button
- `Loader2` - Loading spinner
- `@iconify/react` `game-icons:pentagram-rose` - Header icon
- `@iconify/react` `logos:google-icon` - Google sign-in

**Migration Strategy:**
- Mail icon → Migrate to GothicIcon (create new registry entry or use existing)
- Lock icon → Migrate to GothicIcon with `ritual-locked` (variant: blood) or `auth-login-key` (variant: soul)
- X icon → Migrate to GothicIcon with `action-close-x` (variant: blood)
- Loader2 → Migrate to GothicIcon with `status-loading` (variant: neutral)
- Pentagram → Keep as @iconify (thematic)
- Google icon → Keep as @iconify (brand logo)

### Medium Priority Components (Task 10.3)

#### 4. LevelSelect.tsx
**Current Usage:** lucide-react
**Icons Found:**
- `Skull` - Skull counter, level rewards
- `Lock` - Locked levels
- `Play` - Start part button
- `X` - Close modal
- `Flame` - Decorative torch
- `ChevronRight` - Button arrow
- `Award` - Achievement indicator

**Migration Strategy:**
- Skull → Migrate to GothicIcon with `ritual-mode-icon` (variant: blood)
- Lock → Migrate to GothicIcon with `ritual-locked` (variant: blood)
- Play → Migrate to GothicIcon with `ritual-play` (variant: blood)
- X → Migrate to GothicIcon with `action-close-x` (variant: blood)
- Flame → Migrate to GothicIcon with `ritual-play-flame` (variant: blood)
- ChevronRight → Migrate to GothicIcon with `nav-back-chevron` (rotated, variant: soul)
- Award → Migrate to GothicIcon with `reward-achievement-medal` (variant: relic)

#### 5. HauntingEditor.tsx
**Current Usage:** Mixed (@iconify/react and lucide-react)
**Icons Found:**
- `@iconify/react` `solar:book-bold` - Level info
- `@iconify/react` `game-icons:skull` - Patience bar
- `@iconify/react` `game-icons:pentagram-rose` - Focusing state
- `ArrowLeft` (lucide) - Back button
- `User` (lucide) - Profile button
- `LogOut` (lucide) - Sign out button

**Migration Strategy:**
- Book icon → Migrate to GothicIcon with `grimoire-mode-icon` (variant: arcane)
- Skull icon → Migrate to GothicIcon with `ritual-mode-icon` (variant: blood)
- Pentagram → Keep as @iconify (thematic)
- ArrowLeft → Migrate to GothicIcon with `nav-back-arrow` (variant: soul)
- User → Migrate to GothicIcon with `user-profile` (variant: soul)
- LogOut → Migrate to GothicIcon with `auth-logout` (variant: soul)

#### 6. Other Components
**Components with icon usage:**
- AltarOfWhispers.tsx - @iconify/react (decorative)
- CompileModal.tsx - @iconify/react (decorative)
- ContinuousScroll.tsx - @iconify/react (decorative)
- CorkboardView.tsx - @iconify/react (decorative)
- CryptItemCard.tsx - @iconify/react (decorative)
- ExorcistTypewriter.tsx - @iconify/react (decorative)
- GrimoireEditor.tsx - @iconify/react (decorative)

**Migration Strategy:**
- Review each component individually
- Decorative icons can remain as @iconify
- Functional icons should be migrated to GothicIcon

## Icon Registry Mapping

### Icons Ready for Migration

| Component | Current Icon | Registry Key | Variant | Priority |
|-----------|-------------|--------------|---------|----------|
| AuthModal | `X` (lucide) | `action-close-x` | blood | High |
| AuthModal | `Lock` (lucide) | `auth-login-key` | soul | High |
| AuthModal | `Loader2` (lucide) | `status-loading` | neutral | High |
| Sidebar | `solar:close-circle-bold` | `action-close-x` | blood | High |
| Sidebar | `solar:trash-bin-trash-bold` | `grimoire-delete` | blood | High |
| Sidebar | `solar:pen-new-square-bold` | `grimoire-new-pen` | arcane | High |
| Sidebar | `solar:book-open-bold` | `grimoire-mode-icon` | arcane | High |
| Sidebar | `solar:door-opened-bold` | `nav-home-door` | soul | High |
| LevelSelect | `Skull` (lucide) | `ritual-mode-icon` | blood | Medium |
| LevelSelect | `Lock` (lucide) | `ritual-locked` | blood | Medium |
| LevelSelect | `Play` (lucide) | `ritual-play` | blood | Medium |
| LevelSelect | `X` (lucide) | `action-close-x` | blood | Medium |
| LevelSelect | `Flame` (lucide) | `ritual-play-flame` | blood | Medium |
| LevelSelect | `Award` (lucide) | `reward-achievement-medal` | relic | Medium |
| HauntingEditor | `ArrowLeft` (lucide) | `nav-back-arrow` | soul | Medium |
| HauntingEditor | `User` (lucide) | `user-profile` | soul | Medium |
| HauntingEditor | `LogOut` (lucide) | `auth-logout` | soul | Medium |

### Icons to Keep as @iconify/react
- All decorative game-icons (skeletal-hand, spell-book, etc.)
- All thematic icons (pentagram-rose, etc.)
- Brand logos (Google, etc.)
- Solar icons used for file/folder metaphors

## Migration Steps

### Phase 1: High Priority (Task 10.2)
1. Migrate AuthModal icons
2. Migrate Sidebar functional icons
3. Test authentication flow
4. Test sidebar interactions

### Phase 2: Medium Priority (Task 10.3)
1. Migrate LevelSelect icons
2. Migrate HauntingEditor icons
3. Test game flow
4. Test navigation

### Phase 3: Cleanup (Task 10.3)
1. Review remaining components
2. Remove unused lucide-react imports
3. Update icon registry usage tracking
4. Generate final migration report

## Testing Checklist
- [ ] All migrated icons render correctly
- [ ] Icon sizes are appropriate
- [ ] Glow effects are visible
- [ ] Interactive states work (hover, active, disabled)
- [ ] Accessibility labels are present
- [ ] No console errors
- [ ] Visual regression tests pass

## Notes
- The application has a strong thematic design with many decorative icons
- Not all icons should be migrated - preserve the artistic vision
- Focus on functional, interactive icons for migration
- Keep decorative and thematic icons as @iconify/react
