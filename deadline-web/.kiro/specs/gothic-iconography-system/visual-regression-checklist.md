# Visual Regression Testing Checklist

## Overview
This document provides a checklist for manually testing the migrated GothicIcon components to ensure visual consistency and functionality.

## Test Environment Setup
1. Start the development server: `npm run dev`
2. Open the application in a browser
3. Test in both light and dark modes (if applicable)
4. Test on different screen sizes (mobile, tablet, desktop)

## Component Testing

### 1. AuthModal Component
**Location:** Accessible from landing page "Sign In" button or any auth-required action

**Icons to Test:**
- [ ] Close button (X icon) - Top right corner
  - Verify: Blood variant (red glow)
  - Verify: Hover state intensifies glow
  - Verify: Click closes modal
  - Verify: Accessible via keyboard (Tab + Enter)
  
- [ ] Loading spinner (Loader2) - Submit button when loading
  - Verify: Neutral variant (gray glow)
  - Verify: Spins smoothly
  - Verify: Visible during sign-in/sign-up process

**Visual Checks:**
- [ ] Icons maintain proper size and spacing
- [ ] Glow effects are visible but not overwhelming
- [ ] Icons don't cause layout shifts
- [ ] Accessibility labels are present

### 2. Sidebar Component
**Location:** Left sidebar (toggle with menu button if on mobile)

**Icons to Test:**
- [ ] Close button (X icon) - Mobile only, top right
  - Verify: Blood variant (red glow)
  - Verify: Only visible on mobile screens
  - Verify: Closes sidebar when clicked
  
- [ ] Expand/Collapse chevron - Mausoleum items
  - Verify: Soul variant (blue glow)
  - Verify: Rotates when expanded/collapsed
  - Verify: Smooth transition
  
- [ ] Door icon - Mausoleum indicator
  - Verify: Soul variant (blue glow)
  - Verify: Consistent size with other icons
  
- [ ] Trash icon - Delete buttons
  - Verify: Blood variant (red glow)
  - Verify: Appears on hover
  - Verify: Hover intensifies glow
  
- [ ] Book icon - Open in tab button (Grimoire mode)
  - Verify: Arcane variant (purple glow)
  - Verify: Appears on hover
  
- [ ] Pen icon - New tome page button
  - Verify: Arcane variant (purple glow)
  - Verify: Visible in button

**Visual Checks:**
- [ ] Icons align properly with text
- [ ] Hover states work correctly
- [ ] Icons don't overlap or clip
- [ ] Glow effects match variant colors

### 3. LevelSelect Component
**Location:** Haunting Ritual mode - Level selection screen

**Icons to Test:**
- [ ] Flame icon - Decorative torches
  - Verify: Blood variant (red/orange glow)
  - Verify: Animated pulse effect
  
- [ ] Skull icons - Level progress indicators
  - Verify: Blood variant for counter
  - Verify: Relic variant (gold) when earned
  - Verify: Neutral variant (gray) when not earned
  - Verify: Pulse animation on earned skulls
  
- [ ] Lock icon - Locked levels
  - Verify: Blood variant (red glow)
  - Verify: Floating animation
  
- [ ] Award icon - Achievement indicator
  - Verify: Relic variant (gold glow)
  - Verify: Appears when level has progress
  
- [ ] X icon - Close modal button
  - Verify: Blood variant (red glow)
  - Verify: Rotates on hover
  - Verify: Closes level details modal
  
- [ ] Play icon - Start part button
  - Verify: Blood variant (red glow)
  - Verify: Visible in button
  
- [ ] ChevronRight icon - Button arrow
  - Verify: Soul variant (blue glow)
  - Verify: Visible in button

**Visual Checks:**
- [ ] Icons scale appropriately with level cards
- [ ] Glow effects don't bleed into other elements
- [ ] Animations are smooth and not jarring
- [ ] Icons maintain visibility on dark backgrounds

### 4. HauntingEditor Component
**Location:** Haunting Ritual mode - Active game screen

**Icons to Test:**
- [ ] Book icon - Level info (top left)
  - Verify: Arcane variant (purple glow)
  - Verify: Proper size in HUD
  
- [ ] User icon - Profile button (top right)
  - Verify: Soul variant (blue glow)
  - Verify: Visible when signed in
  - Verify: Visible in sign-in button when not signed in
  
- [ ] LogOut icon - Sign out button (dropdown)
  - Verify: Soul variant (blue glow)
  - Verify: Visible in dropdown menu
  
- [ ] ArrowLeft icon - Back to level select button
  - Verify: Soul variant (blue glow)
  - Verify: Visible in multiple states (idle, game over)
  - Verify: Proper size in large buttons

**Visual Checks:**
- [ ] Icons don't interfere with game UI
- [ ] Glow effects are visible but not distracting
- [ ] Icons maintain readability during gameplay
- [ ] HUD icons are properly sized

## Cross-Component Checks

### Consistency
- [ ] Same icon types look identical across components
- [ ] Variant colors are consistent (blood=red, soul=blue, arcane=purple, relic=gold)
- [ ] Glow intensity is appropriate for each variant
- [ ] Icon sizes are proportional and consistent

### Accessibility
- [ ] All interactive icons have aria-labels
- [ ] Icons are keyboard accessible
- [ ] Focus states are visible
- [ ] Touch targets meet minimum size (44x44px)

### Performance
- [ ] No layout shifts when icons load
- [ ] Animations are smooth (60fps)
- [ ] No flickering or visual glitches
- [ ] Page load time is not significantly impacted

## Browser Testing
Test in the following browsers:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if available)

## Screen Size Testing
- [ ] Mobile (320px - 767px)
- [ ] Tablet (768px - 1023px)
- [ ] Desktop (1024px+)

## Known Issues
Document any visual discrepancies found during testing:

1. _Issue description_
   - Component: 
   - Icon:
   - Expected:
   - Actual:
   - Severity: (Low/Medium/High)

## Sign-off
- [ ] All critical issues resolved
- [ ] All medium issues documented
- [ ] Migration complete and approved

**Tester:** _________________
**Date:** _________________
**Notes:** _________________
