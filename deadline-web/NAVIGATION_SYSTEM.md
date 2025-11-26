# Professional Navigation System

## Overview
A comprehensive, responsive navigation system for the DeadLine app with two variants: full navigation and minimal navigation.

## Components

### Navigation Component
**Location:** `src/components/Navigation.tsx`

A flexible navigation component that adapts to different contexts and screen sizes.

#### Props

```typescript
interface NavigationProps {
  variant?: 'full' | 'minimal';  // Navigation style
  showBackButton?: boolean;       // Show back button (minimal variant)
  backTo?: string;                // Back button destination
  className?: string;             // Additional CSS classes
}
```

#### Variants

##### 1. Full Navigation (`variant="full"`)
**Use Case:** Main app pages where users need access to all sections

**Features:**
- Desktop: Horizontal navigation bar with all menu items
- Mobile: Hamburger menu with slide-down navigation
- Active route highlighting with animated indicator
- User profile dropdown with quick actions
- Sign in/out functionality
- Responsive design (desktop/mobile)

**Desktop Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ [Logo] [Hub] [Haunting] [Grimoire] [Profile] [Settings] [User] │
└─────────────────────────────────────────────────────────────┘
```

**Mobile Layout:**
```
┌──────────────────────────┐
│ [Logo]          [☰ Menu] │
└──────────────────────────┘
```

##### 2. Minimal Navigation (`variant="minimal"`)
**Use Case:** Focused pages where minimal distraction is needed

**Features:**
- Compact header with back button or logo
- User profile menu
- Sign in button for guests
- Clean, unobtrusive design

**Layout:**
```
┌─────────────────────────────────────┐
│ [← Back / Logo]          [User Menu] │
└─────────────────────────────────────┘
```

## Navigation Items

| Path | Label | Icon | Description |
|------|-------|------|-------------|
| `/hub` | Hub | Home | Main navigation hub |
| `/haunting` | Haunting | Skull | Game mode with levels |
| `/grimoire` | Grimoire | BookOpen | Free writing mode |
| `/profile` | Profile | Award | User stats and progress |
| `/settings` | Settings | Settings | App configuration |

## Usage Examples

### Full Navigation (Hub, Main Pages)
```tsx
import { Navigation } from '../components/Navigation';

export function HubPage() {
  return (
    <div>
      <Navigation variant="full" />
      {/* Page content */}
    </div>
  );
}
```

### Minimal Navigation with Back Button
```tsx
import { Navigation } from '../components/Navigation';

export function ProfilePage() {
  return (
    <div>
      <Navigation 
        variant="minimal" 
        showBackButton 
        backTo="/hub" 
      />
      {/* Page content */}
    </div>
  );
}
```

### Minimal Navigation without Back Button
```tsx
import { Navigation } from '../components/Navigation';

export function SettingsPage() {
  return (
    <div>
      <Navigation variant="minimal" />
      {/* Page content */}
    </div>
  );
}
```

## Features

### 1. Active Route Highlighting
- Automatically detects current route
- Animated indicator slides between active tabs
- Visual feedback for user orientation

### 2. User Authentication Integration
- Shows user email when signed in
- "Sign In" button for guests
- Profile dropdown with quick actions:
  - View Profile
  - Settings
  - Sign Out

### 3. Responsive Design
- **Desktop (lg+):** Full horizontal navigation
- **Mobile (<lg):** Hamburger menu with slide-down panel
- Smooth animations and transitions
- Touch-friendly tap targets

### 4. Mobile Menu
- Slide-down animation
- Full-screen navigation items
- Item descriptions for clarity
- User info section at bottom
- Auto-closes on navigation

### 5. Profile Dropdown
- Appears on user avatar/email click
- Shows current user email
- Quick links to profile and settings
- Sign out action
- Click-outside to close

## Styling

### Theme
- Dark theme with zinc/gray palette
- Red accent for branding (Skull icon)
- White/zinc text with opacity variations
- Glassmorphism effects (backdrop-blur)

### Animations
- Framer Motion for smooth transitions
- Active tab indicator slides between items
- Mobile menu slides down/up
- Profile dropdown fades in/out
- Hover effects on all interactive elements

### Accessibility
- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Focus states on interactive elements
- High contrast text

## Integration with Pages

### Current Implementation

#### Pages with Full Navigation
- None currently (Hub uses custom layout)

#### Pages with Minimal Navigation
- **ProfilePage** - Back button to hub
- **SettingsPage** - Back button to hub

#### Pages without Navigation
- **LandingPage** - Full-screen immersive experience
- **OnboardingStepper** - Guided flow, no navigation needed
- **DeadLineHub** - Custom navigation cards
- **HauntingEditor** - Game mode with custom HUD
- **GrimoireEditor** - Writing mode, minimal UI

### Recommended Usage

**Add Full Navigation to:**
- Any new main section pages
- Dashboard-style pages
- Content browsing pages

**Add Minimal Navigation to:**
- Detail pages
- Settings/configuration pages
- Profile/account pages
- Any page that needs a back button

**No Navigation for:**
- Full-screen experiences
- Game modes
- Onboarding flows
- Landing pages

## Best Practices

### 1. Consistent Placement
- Always place Navigation as first child in page component
- Add appropriate padding-top to content (pt-16 or pt-24)

### 2. Variant Selection
- Use `full` for main navigation needs
- Use `minimal` for focused, distraction-free pages
- Consider user context and page purpose

### 3. Back Button Usage
- Always provide `backTo` prop when using back button
- Default is `/hub` but specify explicitly
- Use for pages accessed from specific contexts

### 4. Mobile Considerations
- Test navigation on mobile devices
- Ensure tap targets are large enough (44x44px minimum)
- Verify menu animations are smooth

### 5. Authentication States
- Navigation handles both authenticated and guest states
- No additional auth logic needed in pages
- AuthModal integration is built-in

## Future Enhancements

### Potential Additions
1. **Breadcrumb Navigation** - For deep page hierarchies
2. **Search Functionality** - Quick navigation to content
3. **Notifications Badge** - Show unread notifications
4. **Keyboard Shortcuts** - Power user navigation
5. **Navigation History** - Recently visited pages
6. **Favorites/Bookmarks** - Quick access to frequent pages

### Customization Options
1. **Theme Variants** - Light mode support
2. **Position Options** - Top, side, bottom navigation
3. **Size Options** - Compact, normal, large
4. **Animation Preferences** - Reduced motion support

## Technical Details

### Dependencies
- `react-router-dom` - Routing and navigation
- `framer-motion` - Animations
- `lucide-react` - Icons
- `clsx` - Conditional class names

### Performance
- Lazy loading not needed (small component)
- Minimal re-renders (local state only)
- Efficient animations (GPU-accelerated)
- No external API calls

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Responsive design works on all screen sizes

## Troubleshooting

### Navigation not showing
- Check if component is imported correctly
- Verify Navigation is rendered in component tree
- Check z-index conflicts with other elements

### Active route not highlighting
- Ensure route paths match exactly
- Check if `useLocation()` is working
- Verify router is properly configured

### Mobile menu not working
- Check viewport width (should be < 1024px)
- Verify Framer Motion is installed
- Check for JavaScript errors in console

### Back button not working
- Verify `backTo` prop is provided
- Check if route exists in router config
- Ensure `react-router-dom` is working

## Support

For issues or questions about the navigation system:
1. Check this documentation first
2. Review the component source code
3. Test in different browsers/devices
4. Check browser console for errors

