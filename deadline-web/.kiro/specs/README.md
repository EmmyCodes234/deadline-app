# DeadLine Specifications

This directory contains formal specifications for all major features in the DeadLine application.

## Spec Structure

Each feature has its own folder with:
- **STATUS.md** - Current implementation status and overview
- **requirements.md** - User stories and acceptance criteria (if applicable)
- **design.md** - Technical design and architecture (if applicable)
- **tasks.md** - Implementation checklist (if applicable)
- Additional documentation as needed

## Feature Specs

### 1. Gothic Iconography System ✅
**Location:** `gothic-iconography-system/`

A unified visual language for icons throughout the application. Icons are rendered as glowing arcane artifacts with thematic color coding and interactive states.

**Status:** Complete with partial migration (17.3% of icons)
- Core GothicIcon component
- 5 thematic variants (blood, arcane, soul, relic, neutral)
- Interactive states and accessibility
- Migration tooling and tracking
- Property-based testing

**Key Files:**
- `src/components/GothicIcon.tsx`
- `src/data/iconRegistry.ts`
- `scripts/generate-migration-report.mjs`

### 2. Authentication System ✅
**Location:** `authentication-system/`

Full authentication with Supabase, supporting email/password and Google OAuth. Includes guest mode with seamless upgrade path.

**Status:** Complete
- Email/password authentication
- Google OAuth integration
- Guest mode with in-memory storage
- Automatic progress synchronization
- Onboarding flow integration

**Key Files:**
- `src/hooks/useAuth.ts`
- `src/components/AuthModal.tsx`
- `src/lib/supabase.ts`

### 3. Typing Games ✅
**Location:** `typing-games/`

Three distinct typing-based horror games with unique mechanics and atmospheres.

**Status:** Complete
- **Verbum Dei** - 2D typing defense with progression
- **The Veil Typer** - 3D survival horror with Three.js
- **The Silent Vigil** - Psychological endurance with mic input

**Key Files:**
- `src/components/HauntingEditor.tsx` (Verbum Dei)
- `src/components/VeilTyper.tsx` (Veil Typer)
- `src/components/TheSilentVigil.tsx` (Silent Vigil)
- `src/hooks/useExorcismGame.ts`
- `src/hooks/useVeilTyperEngine.ts`
- `src/hooks/useVigilEngine.ts`

### 4. Writing Modes ✅
**Location:** `writing-modes/`

Multiple writing environments with distinct aesthetics and mechanics.

**Status:** Complete
- **The Noctuary** - Minimalist Monaco Editor
- **The Séance** - AI-assisted writing with Gemini
- **Ritual Summoning** - Code-based creative writing

**Key Files:**
- `src/components/GrimoireEditor.tsx` (Noctuary)
- `src/components/SeanceEditor.tsx` (Séance)
- `src/components/RitualSelector.tsx` (Ritual Summoning)
- `src/hooks/useCrypt.ts` (Document management)
- `src/lib/compileProject.ts` (Export system)

## Core Systems

### Document Management (The Crypt)
Hierarchical document storage with folders (Mausoleums) and files (Tombstones).

**Components:**
- `src/components/Sidebar.tsx`
- `src/hooks/useCrypt.ts`

### Timer System (The Reaper)
Dynamic decay timer that responds to user activity.

**Components:**
- `src/components/ReaperBar.tsx`
- `src/hooks/useReaper.ts`

### Audio System
Comprehensive horror audio with ambient sounds and effects.

**Components:**
- `src/hooks/useAudio.ts`
- `src/lib/AudioManager.ts`
- `src/lib/audio/HorrorAudio.ts`
- `src/lib/audio/VigilAudio.ts`
- `src/lib/audio/RadioAudio.ts`
- `src/lib/audio/DarkRoomAudio.ts`

### Navigation & Routing
Protected routes with onboarding flow.

**Components:**
- `src/App.tsx`
- `src/components/Navigation.tsx`
- `src/components/DeadLineHub.tsx`
- `src/components/LandingPage.tsx`
- `src/components/OnboardingStepper.tsx`

## Documentation Index

### Completion Documents
Located in `deadline-web/` root:
- `*_COMPLETE.md` - Feature completion summaries
- `*_GUIDE.md` - Usage guides
- `*_SETUP.md` - Setup instructions

### Design Documents
- `USER_FLOW_COMPLETE.md` - User journey
- `USER_FLOW_DIAGRAM.md` - Flow diagrams
- `ROUTING_IMPLEMENTATION.md` - Route structure
- `NAVIGATION_SYSTEM.md` - Navigation design

### Technical Documents
- `OPTIMIZATION_SUMMARY.md` - Performance optimizations
- `SUBMISSION_CHECKLIST.md` - Deployment checklist
- `NETLIFY_DEPLOYMENT.md` - Deployment guide
- `SUPABASE_SETUP.md` - Database setup

## Spec Conventions

### Requirements Format
```markdown
### Requirement N

**User Story:** As a [role], I want [goal], so that [benefit].

#### Acceptance Criteria

1. WHEN [condition] THEN the system SHALL [behavior]
2. WHEN [condition] THEN the system SHALL [behavior]
```

### Status Document Format
- Overall status (Complete/In Progress/Planned)
- Summary of feature
- Implementation status by component
- Key deliverables
- Documentation references
- Future enhancements
- Metrics and quality indicators

### Gothic Terminology
- **Crypt** - Document storage
- **Tombstone** - Document/file
- **Mausoleum** - Folder
- **Reaper** - Timer/deadline
- **Resurrection** - Export/compilation
- **Poltergeist** - Chaos/interference
- **Grimoire** - Editor/book
- **Ritual** - Structured process
- **Séance** - AI communication
- **Vigil** - Endurance/watching

## Adding New Specs

When creating a new feature spec:

1. Create folder: `.kiro/specs/[feature-name]/`
2. Add `STATUS.md` with current state
3. Add `requirements.md` if defining new feature
4. Add `design.md` for technical decisions
5. Add `tasks.md` for implementation tracking
6. Update this README with feature entry

## Related Documentation

- **Steering Rules:** `.kiro/steering/` - AI assistant guidance
- **Root Spec:** `.kiro/spec.md` - Core system specifications
- **Completion Docs:** `deadline-web/*_COMPLETE.md` - Feature summaries

---

**Last Updated:** November 29, 2025
**Total Features Specified:** 4
**Completion Rate:** 100%
