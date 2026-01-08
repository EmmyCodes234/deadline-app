# Grimoire Editor - Critical Fixes for Kiroween Hackathon

**Status:** In Progress  
**Priority:** P0 - Must complete before demo day  
**Judge Feedback Score:** 6.5/10 → Target: 8.5/10

---

## 🔴 Priority 1: MUST FIX (Blocking Issues)

### ✅ Task 1.1: Remove Cursed Clipboard Feature
**Issue:** Blocking copy-paste is user-hostile and will cause rage-quits  
**Action:** Remove the copy event listener that prevents copying  
**File:** `src/components/GrimoireEditor.tsx`  
**Estimate:** 5 minutes  
**Status:** ✅ COMPLETE

### ✅ Task 1.2: Make Flicker Animation Optional
**Issue:** Constant text flicker causes eye strain during long sessions  
**Action:** 
- Add user preference toggle for animations
- Default to OFF for flicker
- Keep subtle effects only
**Files:** 
- `src/index.css` (remove/disable flicker animation)
- `src/components/GrimoireEditor.tsx`
**Estimate:** 15 minutes  
**Status:** ✅ COMPLETE

### ✅ Task 1.3: Reduce Skull Icon Pulse
**Issue:** Pulsing skull is distracting and "on the nose"  
**Action:** 
- Remove pulse animation
- Use static skull or replace with subtle indicator
- Consider using a bookmark icon instead
**Files:** `src/components/Sidebar.tsx`  
**Estimate:** 10 minutes  
**Status:** ✅ COMPLETE

### ✅ Task 1.4: Further Reduce Vignette Intensity
**Issue:** Still too dark and claustrophobic  
**Action:** Cut opacity values in half again  
**File:** `src/index.css` (.gothic-vignette)  
**Estimate:** 5 minutes  
**Status:** ✅ COMPLETE

---

## 🟡 Priority 2: SHOULD FIX (Major Improvements)

### ✅ Task 2.1: Fix/Remove Flashlight Effect
**Issue:** Flashlight reveals nothing because editor isn't dark enough  
**Options:**
- A) Remove flashlight entirely
- B) Make editor MUCH darker and flashlight essential
- C) Make flashlight only appear when hovering over sidebars
**Recommendation:** Option A - Remove it  
**Files:** `src/components/CustomCursor.tsx`  
**Estimate:** 10 minutes  
**Status:** ✅ COMPLETE - Flashlight removed, quill cursor remains

### ✅ Task 2.2: Simplify Title Glow
**Issue:** 4 layers of text-shadow is excessive  
**Action:** Reduce to 2 layers max, tone down intensity  
**File:** `src/components/GrimoireEditor.tsx`  
**Estimate:** 5 minutes  
**Status:** ✅ COMPLETE - Reduced to single subtle glow

### ✅ Task 2.3: Optimize Sidebar Width
**Issue:** Sidebars take 40% of screen on laptops  
**Action:** 
- Reduce sidebar width from 320px to 280px
- Make sidebars collapsible with keyboard shortcut
- Add responsive breakpoints
**Files:** 
- `src/components/Sidebar.tsx`
- `src/components/AltarOfWhispers.tsx`
- `src/components/GrimoireEditor.tsx`
**Estimate:** 30 minutes  
**Status:** ✅ COMPLETE - Width reduced to 288px, Cmd+B shortcut added

### ✅ Task 2.4: Disable Atmospheric Effects by Default
**Issue:** Fog, dust motes, heat haze all running = performance hit  
**Action:** 
- Add settings toggle
- Default to OFF
- Allow users to enable individually
**Files:** 
- `src/components/GrimoireEditor.tsx`
- Create settings context/hook
**Estimate:** 45 minutes  
**Status:** ✅ COMPLETE - Toggle button in header, effects disabled by default

### ✅ Task 2.5: Clarify "Words Bleeding" Label
**Issue:** Metaphor is unclear  
**Action:** Change to "Writing Progress" or "Daily Goal"  
**File:** `src/components/AltarOfWhispers.tsx`  
**Estimate:** 2 minutes  
**Status:** ✅ COMPLETE - Changed to "Writing Progress"

---

## 🟢 Priority 3: NICE TO HAVE (Polish)

### ✅ Task 3.1: Add Auto-Save Indicator
**Action:** Show "Saved" / "Saving..." status  
**Estimate:** 20 minutes  
**Status:** ✅ COMPLETE - Shows real-time save status with icons

### ✅ Task 3.2: Add Keyboard Shortcuts
**Action:** 
- Cmd/Ctrl + S: Manual save
- Cmd/Ctrl + B: Toggle sidebar
- Cmd/Ctrl + /: Toggle focus mode
**Estimate:** 30 minutes  
**Status:** ✅ COMPLETE - Cmd+S and Cmd+B implemented

### Task 3.3: Add Export Format Options
**Action:** Support PDF, DOCX, not just text  
**Estimate:** 60 minutes  
**Status:** PENDING

### Task 3.4: Add Basic Markdown Support
**Action:** Bold, italic, headers at minimum  
**Estimate:** 90 minutes  
**Status:** PENDING

### Task 3.5: Performance Audit
**Action:** 
- Profile on mid-range laptop
- Lazy load atmospheric effects
- Virtualize long documents
**Estimate:** 120 minutes  
**Status:** PENDING

---

## 📊 Progress Tracker

**Completed:** 11/15 tasks (73%)  
**In Progress:** 0/15 tasks  
**Remaining:** 4/15 tasks (Export formats, Markdown, Performance audit)  

**Estimated Time Remaining:** ~4.5 hours (optional polish features)  
**Target Completion:** Core fixes COMPLETE ✅  

---

## 🎯 Success Metrics

- [ ] Judge score improvement: 6.5 → 8.5+
- [ ] No user-hostile features (copy-paste works)
- [ ] Smooth performance on 2019 MacBook Air
- [ ] Can write 1000+ words without eye strain
- [ ] Sidebars don't dominate screen space
- [ ] All animations are optional/subtle

---

## 📝 Notes

- Focus on usability over aesthetics
- Every feature should enhance writing, not hinder it
- "Spooky" should be atmospheric, not annoying
- Test with actual writing session (30+ minutes)
