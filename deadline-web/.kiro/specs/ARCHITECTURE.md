# DeadLine Architecture Overview

## System Architecture

DeadLine is a React-based single-page application with a modular architecture organized around distinct feature areas.

## High-Level Structure

```
┌─────────────────────────────────────────────────────────┐
│                    Landing Page                         │
│                  (Universal Entry)                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  Onboarding Flow                        │
│            (Optional Authentication)                    │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   DeadLine Hub                          │
│              (Main Navigation)                          │
└─────┬───────┬───────┬───────┬───────┬──────────────────┘
      │       │       │       │       │
      ▼       ▼       ▼       ▼       ▼
   ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐
   │Game│ │Game│ │Game│ │Edit│ │Edit│
   │ 1  │ │ 2  │ │ 3  │ │ 1  │ │ 2  │
   └────┘ └────┘ └────┘ └────┘ └────┘
```

## Core Layers

### 1. Presentation Layer
**Components** (`src/components/`)
- Feature components (editors, games, modals)
- UI primitives (`ui/` folder)
- Layout components (navigation, sidebar)
- Visual effects (particles, fog, glitches)

### 2. Business Logic Layer
**Hooks** (`src/hooks/`)
- Game engines (`useExorcismGame`, `useVeilTyperEngine`, `useVigilEngine`)
- State management (`useAuth`, `useCrypt`, `useGameProgress`)
- Feature logic (`useReaper`, `useSeance`, `useRitualLinter`)
- Audio management (`useAudio`)

### 3. Data Layer
**Services & Utilities** (`src/lib/`, `src/utils/`)
- External integrations (`supabase.ts`, `gemini.ts`)
- Audio systems (`audio/` folder)
- Utilities (`compileProject.ts`, `exportUtils.ts`)
- Helper functions (`utils.ts`, `moonPhase.ts`)

### 4. Data Definitions
**Static Data** (`src/data/`)
- Game content (`gameLevels.ts`, `horrorWords.ts`, `ghostMessages.ts`)
- Configuration (`iconRegistry.ts`, `ritualSpecs.ts`, `sensoryLexicon.ts`)
- Audio fragments (`radioFragments.ts`, `fragments.ts`)

## Feature Modules

### Authentication Module
```
AuthModal ──► useAuth ──► Supabase
    │
    └──► OnboardingStepper
    └──► Profile Dropdowns
```

### Typing Games Module
```
HauntingEditor ──► useExorcismGame ──► useGameProgress ──► Supabase
VeilTyper ──────► useVeilTyperEngine
TheSilentVigil ─► useVigilEngine ──► VigilAudio
```

### Writing Modes Module
```
GrimoireEditor ──► Monaco Editor
SeanceEditor ───► useSeance ──► Gemini AI
RitualSelector ─► useRitualLinter
    │
    └──► useCrypt ──► Supabase
    └──► ExportRitual ──► compileProject
```

### Document Management Module
```
Sidebar ──► useCrypt ──► Supabase
    │
    ├──► CryptItemCard
    ├──► CorkboardView
    └──► ExportRitual
```

## Data Flow

### Authentication Flow
```
User Action → AuthModal → useAuth → Supabase Auth
                                        │
                                        ▼
                                   Session Token
                                        │
                                        ▼
                              Protected Components
```

### Game Progress Flow
```
Game Event → useGameProgress → Supabase (if auth)
                             → localStorage (if guest)
```

### Document Flow
```
User Edit → Component State → useCrypt → Supabase (if auth)
                                       → localStorage (if guest)
```

### Audio Flow
```
Game Event → useAudio → AudioManager → Howler.js
                                    → Web Audio API
```

## State Management Strategy

### Local State (useState)
- Component-specific UI state
- Form inputs
- Modal visibility
- Animation states

### Custom Hooks (useEffect + useState)
- Feature-specific logic
- External service integration
- Complex state machines
- Side effect management

### Context (Minimal Use)
- No global context currently
- All state localized to features
- Props drilling avoided via composition

### Persistence
- **Supabase** - Authenticated user data
- **localStorage** - Guest data, preferences, onboarding state
- **sessionStorage** - Temporary session data

## Routing Architecture

### Route Protection
```typescript
<Route path="/protected" element={
  <ProtectedRoute>
    <Component />
  </ProtectedRoute>
} />
```

**ProtectedRoute Logic:**
1. Check onboarding completion
2. Redirect to landing if incomplete
3. Render component if complete

### Lazy Loading
```typescript
const Component = lazy(() => import('./Component'));

<Route path="/route" element={
  <Suspense fallback={<LoadingScreen />}>
    <Component />
  </Suspense>
} />
```

**Benefits:**
- Smaller initial bundle
- Faster first load
- On-demand feature loading

## Performance Optimizations

### Code Splitting
- Lazy-loaded routes
- Dynamic imports for heavy components
- Tree-shakeable icon imports

### Rendering Optimizations
- GPU-accelerated animations (transform, opacity)
- CSS filters over SVG filters
- RequestAnimationFrame for game loops
- Debounced input handlers

### Asset Optimization
- Compressed images
- Lazy-loaded 3D models
- On-demand audio loading
- Efficient font loading

### Bundle Optimization
- Vite for fast builds
- Tree-shaking unused code
- Code splitting by route
- Minimal dependencies

## Security Architecture

### Authentication
- Supabase handles password hashing
- OAuth tokens managed securely
- Session tokens in httpOnly cookies
- No sensitive data in localStorage

### Database Security
- Row Level Security (RLS) policies
- User-scoped queries
- Server-side validation
- No direct database access from client

### API Keys
- Environment variables for secrets
- No keys in source code
- Separate keys per environment
- Key rotation supported

## Error Handling

### Component Level
```typescript
try {
  await operation();
} catch (error) {
  console.error('Operation failed:', error);
  setError('User-friendly message');
}
```

### Hook Level
```typescript
const [error, setError] = useState<string | null>(null);
const [loading, setLoading] = useState(false);

// Return error state to component
return { data, error, loading };
```

### Global Level
- Error boundaries for crash recovery
- Fallback UI for broken components
- Error logging (console)
- User-friendly error messages

## Testing Strategy

### Unit Tests
- Property-based tests for core logic
- Component behavior tests
- Hook tests with React Testing Library

### Integration Tests
- Feature flow tests
- API integration tests
- Database interaction tests

### Manual Testing
- Visual regression checklists
- User flow testing
- Cross-browser testing
- Performance testing

## Deployment Architecture

### Build Process
```
npm run build
    │
    ├─► TypeScript compilation
    ├─► Vite bundling
    ├─► Asset optimization
    └─► Output to dist/
```

### Hosting (Netlify)
- Static site hosting
- Automatic deployments from git
- CDN distribution
- HTTPS by default
- Redirects for SPA routing

### Database (Supabase)
- PostgreSQL database
- Real-time subscriptions
- Authentication service
- Storage for assets
- Edge functions (future)

## Scalability Considerations

### Current Scale
- Single-page application
- Client-side rendering
- Serverless backend (Supabase)
- CDN-distributed assets

### Future Scale
- Server-side rendering (SSR)
- Edge computing for AI features
- Caching strategies
- Database optimization
- Load balancing (if needed)

## Development Workflow

### Local Development
```bash
npm run dev          # Start dev server
npm run test         # Run tests
npm run lint         # Check code quality
```

### Production Build
```bash
npm run build        # Build for production
npm run preview      # Preview production build
```

### Deployment
```bash
git push origin main # Auto-deploy via Netlify
```

## Technology Stack Summary

### Frontend
- React 19.2.0
- TypeScript
- Vite 7.2.4
- Tailwind CSS 4.0
- React Router 7.9.6

### 3D Graphics
- Three.js
- React Three Fiber
- @react-three/drei
- @react-three/postprocessing

### Audio
- Howler.js
- Web Audio API

### Backend
- Supabase (PostgreSQL)
- Google Gemini AI

### Development
- Vitest (testing)
- ESLint (linting)
- TypeScript (type checking)

---

**Last Updated:** November 29, 2025
**Architecture Version:** 1.0
