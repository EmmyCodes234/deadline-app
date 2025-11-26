# DeadLine App - Quick Start Guide

## For Developers

### Running the App
```bash
cd deadline-web
npm install
npm run dev
```

### Building for Production
```bash
npm run build
npm run preview
```

## User Flows at a Glance

### First-Time User
```
1. See landing page with video
2. Click "ENTER THE GRAVEYARD"
3. Complete 5-step onboarding
4. Choose: Sign up OR Continue as guest
5. Arrive at hub
6. Navigate to any section
```

### Returning User
```
1. See landing page with video
2. Click "ENTER THE GRAVEYARD"
3. Arrive at hub (skip onboarding)
4. Navigate to any section
```

## Routes

| Route | Component | Protected | Description |
|-------|-----------|-----------|-------------|
| `/` | LandingPage | No | Universal entry point |
| `/onboarding` | OnboardingStepper | No | 5-step tutorial |
| `/hub` | DeadLineHub | Yes | Main navigation |
| `/haunting` | HauntingEditor | Yes | Game mode |
| `/grimoire` | GrimoireEditor | Yes | Writing mode |
| `/profile` | ProfilePage | Yes | User stats |
| `/settings` | SettingsPage | Yes | App config |

**Protected** = Requires `hasCompletedOnboarding = true`

## Key Components

### DeadLineHub
Central navigation with 4 sections:
- Haunting Ritual (game)
- Grimoire Editor (writing)
- Profile (stats)
- Settings (config)

### OnboardingStepper
5 steps:
1. Invitation
2. Oath (rules)
3. First Glyph (demo)
4. Favor (rewards)
5. Covenant (auth choice)

### ProfilePage
Shows:
- User info
- Rituals completed
- Words written
- Souls collected
- Level progress

### SettingsPage
Controls:
- Audio (mute/unmute)
- Dark mode
- Difficulty
- Auto-save

## State Management

### localStorage
- `deadline_onboarding_completed` - Boolean
- `deadline_onboarding_step` - Number (0-4)

### Supabase (if authenticated)
- User auth session
- Game progress
- Level completion
- Earned rewards

## Auth States

1. **Authenticated** - Signed in, progress saved
2. **Guest** - No account, progress temporary
3. **Unauthenticated** - Completed onboarding, not signed in

## Testing Tips

### Test New User Flow
1. Clear localStorage
2. Refresh app
3. Should see onboarding

### Test Returning User Flow
1. Complete onboarding once
2. Refresh app
3. Should skip to hub

### Test Guest Mode
1. Complete onboarding
2. Choose "Delve as Wanderer"
3. Progress not saved to Supabase

### Test Auth Mode
1. Complete onboarding
2. Choose "FORGE A COVENANT"
3. Sign up/login
4. Progress saved to Supabase

## Common Issues

### Video not playing
- Check `/public/bg-graveyard-video.mp4` exists
- Browser may block autoplay
- Fallback image: `/public/bg-graveyard.jpg`

### Onboarding loops
- Check `localStorage.getItem('deadline_onboarding_completed')`
- Should be `'true'` after completion

### Routes not working
- Ensure BrowserRouter is wrapping app
- Check protected route logic
- Verify onboarding completion

### Auth not persisting
- Check Supabase connection
- Verify `.env` file has correct keys
- Check browser console for errors

## Quick Commands

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Clear localStorage (in browser console)
localStorage.clear()

# Check onboarding status (in browser console)
localStorage.getItem('deadline_onboarding_completed')
```

## File Structure

```
src/
├── components/
│   ├── DeadLineHub.tsx       # Main navigation hub
│   ├── LandingPage.tsx       # Entry point
│   ├── OnboardingStepper.tsx # Tutorial
│   ├── AuthModal.tsx         # Sign in/up
│   ├── HauntingEditor.tsx    # Game mode
│   └── GrimoireEditor.tsx    # Writing mode
├── pages/
│   ├── ProfilePage.tsx       # User stats
│   └── SettingsPage.tsx      # App config
├── hooks/
│   ├── useAuth.ts           # Auth management
│   ├── useOnboardingState.ts # Onboarding state
│   └── useGameProgress.ts   # Progress tracking
└── App.tsx                  # Main routing
```

## Documentation

- `ROUTING_IMPLEMENTATION.md` - Technical details
- `USER_FLOW_DIAGRAM.md` - Visual flow chart
- `PERFECT_FLOW_COMPLETE.md` - Complete summary
- `QUICK_START_GUIDE.md` - This file

## Support

For issues or questions:
1. Check browser console for errors
2. Verify Supabase connection
3. Clear localStorage and retry
4. Check documentation files
