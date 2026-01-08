# Dark Room Layout Fix - Complete

## Problem
The flashlight/darkness overlay was covering the Sidebar, making it invisible during gameplay.

## Solution

### 1. Layout Restructure
- Changed from single container to **flex row layout**
- **Sidebar (left)**: `w-80` with `z-50`, solid `bg-zinc-900` background
- **Game Board (right)**: `flex-1 relative overflow-hidden`

### 2. Flashlight Overlay Fix
- Moved from `fixed inset-0` to **`absolute inset-0`** inside Game Board Wrapper
- Now only covers the game area, not the entire screen
- Sidebar remains fully visible and legible at all times

### 3. Mouse Position Adjustment
- Updated `useDarkRoomEngine` to account for 320px sidebar width
- Word positions now calculated relative to game area: `wordX = (word.x / 100) * gameAreaWidth + SIDEBAR_WIDTH`
- Flashlight tracking properly aligned with word positions

### 4. Z-Index Hierarchy
- Sidebar: `z-50` (highest)
- Flashlight overlay: `z-40`
- Shattered glass: `z-30`
- Words: default stacking

## Files Modified
- `src/components/TheDarkRoom.tsx` - Layout restructure
- `src/hooks/useDarkRoomEngine.ts` - Mouse position calculation

## Result
✅ Sidebar always visible with dim but legible styling
✅ Flashlight only affects game board area
✅ Proper mouse tracking with sidebar offset
✅ Clean visual separation between UI and game area
