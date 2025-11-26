# DeadLine - Complete User Flow

## Professional User Journey

### 1. Landing Page (Entry Point)
**Route:** `/`
**Purpose:** First impression and mode selection
**Actions:**
- New users → Onboarding
- Returning users → Hub

**Navigation:**
- "The Haunting Ritual" button → Onboarding/Hub
- "The Grimoire Editor" button → Onboarding/Hub

---

### 2. Onboarding (First-Time Users)
**Route:** `/onboarding`
**Purpose:** Introduce the app and optional authentication
**Steps:**
1. Welcome & concept explanation
2. Optional sign-in/sign-up
3. Quick tutorial

**Navigation:**
- Complete → Hub
- Skip → Hub (with limited features)

---

### 3. The Hub (Central Navigation)
**Route:** `/hub`
**Purpose:** Main menu for all features
**Options:**
- The Haunting Ritual (timed writing game)
- The Grimoire Editor (distraction-free writing)
- Profile (stats and progress)
- Settings (preferences)

**Navigation:**
- Top-right: Profile, Settings icons
- Cards: Click to enter mode
- **Back:** None (this is home)

---

### 4. The Haunting Ritual (Game Mode)
**Route:** `/haunting`
**Purpose:** Timed writing challenges with progression
**Flow:**
1. Level Select Screen
2. Game Play (typing challenge)
3. Victory/Defeat Modal
4. Return to Level Select or Hub

**Navigation:**
- **Back to Hub:** Button in top-left (when idle)
- **Back to Level Select:** After completing level
- **Exit:** ESC key or button

---

### 5. The Grimoire Editor (Writing Mode)
**Route:** `/grimoire`
**Purpose:** Distraction-free long-form writing
**Features:**
- Sidebar (The Crypt) - collapsible file tree
- Main editor - borderless writing space
- Right panel (The Altar) - metadata and tools
- View modes: List, Chronicle, Corkboard

**Navigation:**
- **Back to Hub:** Button in header (NEW - needs to be added)
- **Sidebar toggle:** Hamburger menu
- **Export:** "Resurrect" button → Modal

---

### 6. Profile Page
**Route:** `/profile`
**Purpose:** View stats, progress, and achievements
**Content:**
- Rituals completed
- Words written
- Souls collected
- Level progress

**Navigation:**
- **Back to Hub:** Button in top-left (via Navigation component)

---

### 7. Settings Page
**Route:** `/settings`
**Purpose:** Configure app preferences
**Options:**
- Audio settings (mute/unmute)
- Appearance (dark mode)
- Account management

**Navigation:**
- **Back to Hub:** Button in top-left (via Navigation component)

---

## Navigation Patterns

### Primary Navigation (Navigation Component)
Used on: Profile, Settings
- **Minimal variant:** Logo + Back button
- **Full variant:** Logo + Profile + Settings icons

### Modal Navigation
- **Close button:** X in top-right
- **Cancel button:** Bottom-left
- **Primary action:** Bottom-right

### In-App Navigation
- **Hub:** Central hub for all features
- **Back buttons:** Always return to previous logical screen
- **ESC key:** Close modals and return to previous screen

---

## Current Status

### ✅ Complete
- Landing Page → Onboarding/Hub routing
- Hub → All modes
- Profile → Back to Hub
- Settings → Back to Hub
- Haunting Ritual → Back to Level Select/Hub

### ⚠️ Needs Addition
- **Grimoire Editor:** Add "Back to Hub" button in header
- **Consistency:** Ensure all pages have clear exit paths

---

## Design Principles

1. **Never trap the user:** Every screen has a clear way back
2. **Consistent patterns:** Back buttons always in top-left
3. **Visual hierarchy:** Primary actions are prominent
4. **Escape hatches:** ESC key works for modals
5. **Progressive disclosure:** Show features as needed

---

## Recommended Improvements

### High Priority
1. ✅ Add back button to Grimoire Editor header
2. Ensure ESC key works consistently across all modals
3. Add keyboard shortcuts guide (? key)

### Medium Priority
1. Add breadcrumb navigation for deep pages
2. Add "unsaved changes" warnings when navigating away
3. Add quick-switch between Haunting and Grimoire modes

### Low Priority
1. Add recent documents quick access
2. Add favorites/bookmarks system
3. Add search functionality in Hub
