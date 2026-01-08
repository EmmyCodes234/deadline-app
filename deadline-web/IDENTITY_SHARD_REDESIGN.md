# Identity Shard Profile Redesign

## Overview
Rebuilt the Profile Page with an ultra-simplified, diegetic "Identity Shard" design that focuses purely on identity with inscription-style inputs.

## Key Changes

### Layout
- **Single Centered Card**: Changed from wide 2xl container to compact `max-w-md` centered card
- **Identity Shard**: Heavy glassmorphism with `bg-black/60` and `backdrop-blur-xl`
- **Spectral Glow**: Faint red radial gradient overlay for atmospheric depth
- **Drop Shadow**: Subtle white and red glow (`0 0 60px rgba(255, 255, 255, 0.1), 0 0 100px rgba(220, 38, 38, 0.15)`)

### Visual Hierarchy

#### Top: Avatar (Focal Point) - "The Mirror"
- **Size**: `w-40 h-40` circular avatar
- **Shape**: Clean circle (`rounded-full`)
- **Glow**: Red spectral glow with soft shadows
- **Interactive**: Always clickable - hover shows "Reform Visage" overlay
- **Mirror Overlay**: Semi-transparent black (`bg-black/80`) with Camera icon and text
- **Upload State**: Shows spinning Upload icon with "Reforming..." text

#### Middle: Identity (Inscription Style)
- **Display Name**: Large serif font (`text-5xl`), white, centered, wide tracking
- **Handle**: Small sans-serif (`text-sm`), stone-500, centered
- **Read-only**: Name and handle are derived from profile/email (not editable)

#### Bottom: Epitaph (Bio) - Inscription Input
- **Style**: Transparent background (`bg-transparent`), no borders (`border-none`)
- **Typography**: Italic serif, stone-400 color, centered, `text-base`
- **Focus State**: Glowing underline appears (`border-b border-white/50` with subtle shadow)
- **Placeholder**: "Inscribe your epitaph..." in muted stone color
- **Max Length**: 200 characters
- **Auto-save**: Saves to backend on blur (when user clicks away)
- **No Buttons**: Seamless inscription experience

### Removed Elements
- ❌ Stats Grid (Words Exorcised, Ritual Streak, Sanity Level)
- ❌ Soul Metrics section
- ❌ The Grimoire tabs (Manuscripts/Abjurations)
- ❌ All manuscript listings
- ❌ Username editing (now derived from email/profile)
- ❌ Complex hexagon avatar shape
- ❌ Edit mode toggle
- ❌ Save/Cancel buttons (replaced with auto-save on blur)
- ❌ Background boxes around bio

### Inscription-Style Interactions
- **Avatar Upload**: Click avatar anytime - hover shows "Reform Visage"
- **Epitaph Editing**: Click directly into text to edit
- **Auto-save**: Changes save automatically when you click away (onBlur)
- **Focus Glow**: Subtle white underline appears when typing
- **No Forms**: Feels like inscribing on stone, not filling a web form

### Animation
- **Shard Float**: Gentle 8-second vertical float animation
- **Smooth Transitions**: All hover states use 300ms duration
- **Scale Entry**: Card scales in from 0.95 to 1.0 on mount
- **Focus Glow**: Underline fades in with subtle shadow on focus

### Technical Details
- **Local State**: Bio uses local state for immediate feedback
- **Blur Handler**: `handleBioBlur` saves to backend only if changed
- **Error Handling**: Shows error message below input, reverts on failure
- **Validation**: Trims whitespace before saving

## Design Philosophy
Pure identity focus with diegetic inscription mechanics. The user sees:
1. Their face (avatar) - clickable mirror
2. Their name (read-only inscription)
3. Their words (editable epitaph)

No buttons, no boxes, no forms. Just inscriptions on a spectral shard.
