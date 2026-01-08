# Project Structure

## Directory Organization

```
deadline-web/
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # Reusable UI primitives (buttons, cards, etc.)
│   │   └── *.tsx         # Feature components (editors, games, modals)
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities and external service integrations
│   │   └── audio/        # Audio management classes
│   ├── data/             # Static data and configuration
│   ├── pages/            # Route-level page components
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Helper functions
│   ├── App.tsx           # Root component with routing
│   └── main.tsx          # Application entry point
├── public/               # Static assets (images, audio, 3D models)
├── scripts/              # Build and utility scripts
└── .kiro/                # Kiro AI assistant configuration
    └── steering/         # AI guidance documents
```

## Component Conventions

- **Naming**: PascalCase for components (e.g., `GothicIcon.tsx`, `TheDarkRoom.tsx`)
- **Co-location**: Related files grouped together (e.g., `GothicIcon.tsx`, `GothicIcon.test.tsx`, `GothicIcon.md`)
- **Lazy Loading**: Heavy editor components are lazy-loaded in App.tsx for performance
- **Composition**: UI primitives in `ui/` folder, feature components at root level

## Routing Structure

- `/` - Landing page (universal entry point)
- `/onboarding` - New user onboarding flow
- `/hub` - Main navigation hub (protected)
- `/noctuary` - Minimalist horror writing mode (protected)
- `/veil-typer` - 3D typing horror game (protected)
- `/haunting` - Typing defense game (protected)
- `/silent-vigil` - Psychological horror endurance mode (protected)
- `/profile` - User profile (protected)
- `/settings` - App settings (protected)

Protected routes require onboarding completion.

## Data Management

- **Local Storage**: User preferences, onboarding state, anonymous user IDs
- **Supabase**: Authenticated user data, game progress, writing drafts, document storage
- **Fallback Pattern**: App works offline/without auth using localStorage

## Naming Patterns

- **Components**: Descriptive, thematic names (e.g., `TheSilentVigil`, `AltarOfWhispers`, `ReaperBar`)
- **Hooks**: `use` prefix (e.g., `useAuth`, `useDarkRoomEngine`, `useReaper`)
- **Types**: Interfaces for props, data models (e.g., `GothicIconProps`, `GameProgress`)
- **Files**: Match component/export name exactly

## Gothic Theme Conventions

- Dark color palette (zinc-950 backgrounds, red/purple/teal accents)
- Skull and death iconography throughout
- Horror-themed naming (Crypt, Grimoire, Ritual, Séance, etc.)
- Atmospheric effects (fog, dust, glitches, corruption)
- Custom cursor and page transitions for immersion
