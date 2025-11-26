# Navigation System - Quick Start Guide

## Where to See the Navigation

The navigation system is now live in your app! Here's where you can see it:

### 1. **DeadLineHub** (`/hub`)
- **Full Navigation Bar** at the top
- Shows all menu items: Hub, Haunting, Grimoire, Profile, Settings
- Active tab highlighting
- User authentication status
- Mobile hamburger menu on small screens

**To see it:**
1. Start your dev server: `npm run dev`
2. Navigate to the app
3. Complete onboarding (or if already done, you'll go straight to hub)
4. Look at the top of the screen - you'll see the full navigation bar

### 2. **Profile Page** (`/profile`)
- **Minimal Navigation** with back button
- Clean header with "← Back" button
- User menu on the right
- Less distracting for focused content

**To see it:**
1. From the Hub, click "THE SCRIBE'S SANCTUM" card
2. OR click "Profile" in the navigation bar
3. Look at the top - you'll see the minimal nav with back button

### 3. **Settings Page** (`/settings`)
- **Minimal Navigation** with back button
- Same clean design as Profile
- Easy return to hub

**To see it:**
1. From the Hub, click "SETTINGS / ABJURATIONS" card
2. OR click "Settings" in the navigation bar
3. Look at the top - you'll see the minimal nav with back button

## Visual Guide

### Full Navigation (Desktop)
```
┌────────────────────────────────────────────────────────────────┐
│ [💀 DEADLINE] [Hub] [Haunting] [Grimoire] [Profile] [Settings] [👤 User] │
└────────────────────────────────────────────────────────────────┘
```

### Full Navigation (Mobile)
```
┌──────────────────────────┐
│ [💀 DEADLINE]    [☰ Menu] │
└──────────────────────────┘
```
When you tap the menu:
```
┌──────────────────────────┐
│ [💀 DEADLINE]    [✕ Close] │
├──────────────────────────┤
│ 🏠 Hub                   │
│    Main Menu             │
├──────────────────────────┤
│ 💀 Haunting              │
│    Game Mode             │
├──────────────────────────┤
│ 📖 Grimoire              │
│    Free Writing          │
├──────────────────────────┤
│ 🏆 Profile               │
│    Your Progress         │
├──────────────────────────┤
│ ⚙️ Settings              │
│    Configuration         │
├──────────────────────────┤
│ Signed in as:            │
│ user@example.com         │
│ [Sign Out]               │
└──────────────────────────┘
```

### Minimal Navigation
```
┌──────────────────────────────────┐
│ [← Back]              [👤 User Menu] │
└──────────────────────────────────┘
```

## Features You'll See

### 1. Active Tab Highlighting
- Current page is highlighted with a white background
- Smooth animation when switching tabs
- Clear visual feedback

### 2. User Authentication
**When Signed In:**
- Green dot indicator
- Email address displayed
- Dropdown menu with:
  - View Profile
  - Settings
  - Sign Out

**When Not Signed In:**
- Red "Sign In" button
- Opens authentication modal

### 3. Mobile Responsiveness
- On screens < 1024px, navigation switches to hamburger menu
- Tap the menu icon to see all options
- Smooth slide-down animation
- Auto-closes when you navigate

### 4. Smooth Animations
- Tab indicator slides between items
- Dropdowns fade in/out
- Mobile menu slides down/up
- Hover effects on all buttons

## Testing the Navigation

### Desktop Testing
1. Open the app in your browser
2. Navigate to `/hub`
3. Try clicking each navigation item
4. Watch the active indicator slide
5. Click your user email to see the dropdown
6. Try signing in/out

### Mobile Testing
1. Resize your browser to < 1024px width
2. OR open on a mobile device
3. Tap the hamburger menu (☰)
4. See the full menu slide down
5. Tap any item to navigate
6. Menu auto-closes

### Responsive Breakpoints
- **Desktop:** ≥ 1024px - Full horizontal navigation
- **Mobile:** < 1024px - Hamburger menu

## Customization

### Change Navigation Variant
```tsx
// Full navigation (all menu items)
<Navigation variant="full" />

// Minimal navigation (just back button and user)
<Navigation variant="minimal" showBackButton backTo="/hub" />
```

### Add to New Pages
```tsx
import { Navigation } from '../components/Navigation';

export function MyNewPage() {
  return (
    <div>
      <Navigation variant="minimal" showBackButton backTo="/hub" />
      <div className="pt-24"> {/* Add padding for fixed nav */}
        {/* Your content */}
      </div>
    </div>
  );
}
```

## Troubleshooting

### "I don't see the navigation"
- Make sure you're on `/hub`, `/profile`, or `/settings`
- Check that the Navigation component is imported
- Look at the very top of the page (it's fixed position)

### "Navigation is behind other content"
- Add `pt-16` or `pt-24` class to your content container
- Navigation has `z-50`, ensure content has lower z-index

### "Mobile menu not working"
- Resize browser to < 1024px width
- Check browser console for errors
- Ensure Framer Motion is installed

### "Active tab not highlighting"
- Check that route paths match exactly
- Verify React Router is working
- Look for console errors

## Next Steps

1. **Test on mobile** - Resize your browser or use a phone
2. **Try all navigation items** - Click through each section
3. **Test authentication** - Sign in/out to see the changes
4. **Check responsiveness** - Resize browser to see breakpoints

The navigation system is production-ready and follows modern web standards!
