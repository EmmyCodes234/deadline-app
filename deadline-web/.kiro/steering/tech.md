# Tech Stack

## Core Technologies

- **Framework**: React 19.2.0 with TypeScript
- **Build Tool**: Vite 7.2.4
- **Styling**: Tailwind CSS 4.0 with custom gothic theme
- **Routing**: React Router DOM 7.9.6
- **State Management**: React hooks (no external state library)

## Key Libraries

- **3D Graphics**: Three.js + React Three Fiber + Drei (for 3D horror scenes)
- **Animation**: Framer Motion
- **Audio**: Howler.js
- **Icons**: Lucide React + custom GothicIcon wrapper
- **AI**: Google Generative AI (Gemini)
- **Backend**: Supabase (auth + database)
- **Code Editor**: Monaco Editor (for ritual/code editing features)
- **Document Export**: docx + file-saver

## Testing

- **Test Runner**: Vitest
- **Testing Library**: @testing-library/react
- **Property Testing**: fast-check

## Common Commands

```bash
# Development
npm run dev                    # Start dev server

# Build
npm run build                  # TypeScript check + production build
npm run preview                # Preview production build

# Testing
npm run test                   # Run tests once
npm run test:watch             # Run tests in watch mode
npm run test:ui                # Run tests with UI

# Linting
npm run lint                   # Run ESLint

# Migration Tools
npm run migration-report       # Generate icon migration report
npm run migration-report:json  # JSON format
npm run migration-report:console # Console output
```

## Environment Variables

Required in `.env`:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `VITE_GEMINI_API_KEY` - Google Gemini API key

## Path Aliases

- `@/*` maps to `./src/*` (configured in vite.config.ts and tsconfig.json)
