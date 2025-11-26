# DeadLine App - User Flow Diagram

## Visual Flow Chart

```
┌─────────────────────────────────────────────────────────────────┐
│                         APP LAUNCH                               │
│                              ↓                                   │
│                    LANDING PAGE (/)                              │
│              "ENTER THE GRAVEYARD" button                        │
│         [Atmospheric video, gothic branding]                     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    Check: hasCompletedOnboarding?
                              ↓
                ┌─────────────┴─────────────┐
                │                           │
            NO (New User)              YES (Returning User)
                │                           │
                ↓                           ↓
    ┌───────────────────────┐   ┌───────────────────────┐
    │  ONBOARDING (/onboarding)  │   │   DEADLINEHUB (/hub)   │
    │                       │   │                       │
    │  Step 0: Invitation   │   │  • Haunting Ritual    │
    │  Step 1: The Oath     │   │  • Grimoire Editor    │
    │  Step 2: First Glyph  │   │  • Profile            │
    │  Step 3: The Favor    │   │  • Settings           │
    │  Step 4: The Covenant │   │  • Auth Status        │
    │         ↓             │   └───────────────────────┘
    │    Auth Choice:       │              ↓
    │  ┌─────────────────┐ │         Navigate to:
    │  │ Sign Up/Login   │ │              ↓
    │  │  (AuthModal)    │ │   ┌──────────┴──────────┐
    │  └─────────────────┘ │   │                     │
    │         OR            │   ↓                     ↓
    │  ┌─────────────────┐ │  /haunting          /grimoire
    │  │ Continue Guest  │ │   │                     │
    │  └─────────────────┘ │   │  Level Select      │  Free Writing
    │         ↓             │   │  Gameplay          │  Manuscript
    └─────────┬─────────────┘   │                     │
              │                 ↓                     ↓
              │            /profile              /settings
              │                 │                     │
              │            User Stats           App Config
              │            Progress             Audio/Display
              │                 │                     │
              └─────────────────┴─────────────────────┘
                              ↓
                    DEADLINEHUB (/hub)
                    [Central Navigation]
```

## Flow Details

### 🎬 Landing Page (Universal Entry)
**Route:** `/`
- **All users** see this first
- Atmospheric video background
- Single CTA button
- No menus, no clutter
- Pure immersion

### 🆕 New User Path
```
Landing → Onboarding (5 steps) → Auth Choice → Hub
```

**Onboarding Steps:**
1. **The Invitation** - Welcome & lore
2. **The Oath** - Game rules
3. **The First Glyph** - Interactive demo
4. **The Favor** - Skulls & rewards
5. **The Covenant** - Auth prompt
   - Option A: Sign up/login
   - Option B: Continue as guest

### 🔄 Returning User Path
```
Landing → Hub (direct)
```
- Skips onboarding entirely
- Immediate access to all features
- Auth status preserved

### 🎮 Main Navigation (Hub)
**Route:** `/hub`

Four main sections:
1. **Haunting Ritual** (`/haunting`) - Game mode
2. **Grimoire Editor** (`/grimoire`) - Writing mode
3. **Profile** (`/profile`) - Stats & progress
4. **Settings** (`/settings`) - Configuration

### 🔒 Protected Routes
All routes except `/` and `/onboarding` are protected:
- Require `hasCompletedOnboarding = true`
- Redirect to `/` if not completed
- Landing page then routes to onboarding

### 🔙 Navigation Patterns
- **From Hub:** Navigate to any section
- **From Sections:** Back button returns to hub
- **Browser back/forward:** Fully supported
- **Direct links:** Work with protection

## State Management

### localStorage Keys
- `deadline_onboarding_completed` - Boolean
- `deadline_onboarding_step` - Number (0-4)

### Auth States
- **Authenticated:** User signed in, progress saved to Supabase
- **Guest:** No account, progress in memory only
- **Unauthenticated (returning):** Completed onboarding but not signed in

## Key Features

✅ **No Forced Registration** - Guest mode available
✅ **Smart Routing** - Based on user status
✅ **Lazy Loading** - Performance optimized
✅ **Deep Linking** - All routes bookmarkable
✅ **Browser History** - Back/forward supported
✅ **Audio Management** - Context unlocked on interaction
✅ **Thematic Consistency** - Gothic aesthetic throughout

## User Experience Goals

1. **Immediate Impact** - Landing page hooks instantly
2. **Smooth Onboarding** - Educational, not overwhelming
3. **Optional Commitment** - Auth not required
4. **Quick Access** - Returning users skip intro
5. **Clear Navigation** - Always know where you are
6. **Professional Polish** - Every transition smooth
