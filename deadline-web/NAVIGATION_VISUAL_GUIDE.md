# Navigation System - Visual Guide

## 🎯 Where to Look

When you open your app, the navigation appears at the **very top** of the screen as a fixed bar.

## 📍 Current Implementation

### Hub Page (`/hub`)
```
┌─────────────────────────────────────────────────────────────────────┐
│ 💀 DEADLINE  [Hub] [Haunting] [Grimoire] [Profile] [Settings]  👤 User │ ← NAVIGATION BAR
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│                         THE DEADLINE                                  │
│                                                                       │
│     ┌──────────────┐  ┌──────────────┐                              │
│     │ 💀 HAUNTING  │  │ 📖 GRIMOIRE  │                              │
│     │   RITUAL     │  │   EDITOR     │                              │
│     └──────────────┘  └──────────────┘                              │
│                                                                       │
│     ┌──────────────┐  ┌──────────────┐                              │
│     │ 🏆 PROFILE   │  │ ⚙️ SETTINGS  │                              │
│     │   SANCTUM    │  │  ABJURATIONS │                              │
│     └──────────────┘  └──────────────┘                              │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

### Profile Page (`/profile`)
```
┌─────────────────────────────────────────────────────────────────────┐
│ ← Back                                                    👤 User Menu │ ← MINIMAL NAV
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│                   THE SCRIBE'S SANCTUM                               │
│                                                                       │
│     ┌──────────────────────────────────────────────────┐            │
│     │ 👤 user@example.com                              │            │
│     │ Wanderer of the Void                             │            │
│     └──────────────────────────────────────────────────┘            │
│                                                                       │
│     ┌─────────┐  ┌─────────┐  ┌─────────┐                          │
│     │ Rituals │  │  Words  │  │  Souls  │                          │
│     │  3 / 10 │  │   1,500 │  │    42   │                          │
│     └─────────┘  └─────────┘  └─────────┘                          │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

### Settings Page (`/settings`)
```
┌─────────────────────────────────────────────────────────────────────┐
│ ← Back                                                    👤 User Menu │ ← MINIMAL NAV
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│                 SETTINGS / ABJURATIONS                               │
│                                                                       │
│     ┌──────────────────────────────────────────────────┐            │
│     │ 🔊 Audio Settings                                │            │
│     │                                                   │            │
│     │ Sound Effects                          [ON/OFF]  │            │
│     └──────────────────────────────────────────────────┘            │
│                                                                       │
│     ┌──────────────────────────────────────────────────┐            │
│     │ 🌙 Appearance                                    │            │
│     │                                                   │            │
│     │ Dark Mode                              [ON/OFF]  │            │
│     └──────────────────────────────────────────────────┘            │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

## 📱 Mobile View

### Hub (Mobile)
```
┌──────────────────────────┐
│ 💀 DEADLINE      ☰ Menu  │ ← TAP HERE
└──────────────────────────┘

When you tap the menu:

┌──────────────────────────┐
│ 💀 DEADLINE      ✕ Close │
├──────────────────────────┤
│                          │
│ 🏠 Hub                   │
│    Main Menu             │
│                          │
│ 💀 Haunting              │
│    Game Mode             │
│                          │
│ 📖 Grimoire              │
│    Free Writing          │
│                          │
│ 🏆 Profile               │
│    Your Progress         │
│                          │
│ ⚙️ Settings              │
│    Configuration         │
│                          │
├──────────────────────────┤
│ Signed in as:            │
│ user@example.com         │
│ [Sign Out]               │
└──────────────────────────┘
```

## 🎨 Visual Features

### Active Tab Indicator
```
Before clicking:
[Hub] [Haunting] [Grimoire] [Profile] [Settings]

After clicking Grimoire:
[Hub] [Haunting] [Grimoire] [Profile] [Settings]
                  ▔▔▔▔▔▔▔▔▔  ← Animated underline
```

### User Dropdown (Desktop)
```
Click on your email:

┌──────────────────────┐
│ 👤 user@example.com  │ ← CLICK HERE
└──────────────────────┘
         ↓
┌──────────────────────┐
│ Signed in as:        │
│ user@example.com     │
├──────────────────────┤
│ 🏆 View Profile      │
│ ⚙️ Settings          │
│ 🚪 Sign Out          │
└──────────────────────┘
```

### Sign In Button (Guest)
```
When not signed in:

┌──────────────────────┐
│ 👤 Sign In           │ ← CLICK TO SIGN IN
└──────────────────────┘
```

## 🔍 How to Find It

### Step 1: Start Your App
```bash
cd deadline-web
npm run dev
```

### Step 2: Open Browser
Navigate to: `http://localhost:5173`

### Step 3: Complete Onboarding
If it's your first time, go through the onboarding steps.

### Step 4: Look at the Top
Once you're at the Hub, **look at the very top of the screen**.

You should see:
```
💀 DEADLINE  [Hub] [Haunting] [Grimoire] [Profile] [Settings]  👤
```

### Step 5: Test It
- Click on different menu items
- Watch the active indicator slide
- Click your user email to see dropdown
- Resize browser to see mobile menu

## 🎯 What to Look For

### Desktop (Wide Screen)
✅ Horizontal menu bar at top
✅ All 5 menu items visible
✅ Active tab has white background
✅ User email on the right
✅ Smooth animations

### Mobile (Narrow Screen)
✅ Logo on left, hamburger on right
✅ Tap hamburger to open menu
✅ Menu slides down smoothly
✅ All items listed vertically
✅ Tap item to navigate

### Profile/Settings Pages
✅ "← Back" button on left
✅ User menu on right
✅ Clean, minimal design
✅ No distraction from content

## 🐛 Troubleshooting

### "I don't see anything at the top"
- Scroll to the very top of the page
- The navigation is fixed position
- It should always be visible

### "The navigation looks broken"
- Check browser console for errors
- Make sure all dependencies are installed
- Try refreshing the page

### "Mobile menu doesn't work"
- Make sure browser width is < 1024px
- Try clicking the hamburger icon (☰)
- Check if JavaScript is enabled

### "Active tab not highlighting"
- Make sure you're on one of the pages
- Check the URL in the address bar
- Try clicking a different menu item

## ✨ Pro Tips

1. **Keyboard Navigation** - Use Tab key to navigate through menu items
2. **Quick Access** - Click logo to return to hub
3. **Mobile Swipe** - Swipe down to close mobile menu
4. **Dropdown** - Click outside to close user dropdown
5. **Responsive** - Resize browser to see breakpoints

## 📊 Success Indicators

You'll know it's working when you see:
- ✅ Navigation bar at the top
- ✅ Menu items are clickable
- ✅ Active tab is highlighted
- ✅ User status is displayed
- ✅ Mobile menu works
- ✅ Smooth animations
- ✅ No console errors

---

**The navigation is there - just look at the very top of your screen!** 🎉
