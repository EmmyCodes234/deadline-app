# Project Steering Document: DeadLine (Kiroween 2023)

## 1. Core Aesthetic: "Cartoon Horror / Cursed Artifact"
- **Visual Theme:** Spooky, fun, slightly unsettling, but not truly terrifying. Think vintage Halloween cartoons, Tim Burton, or classic horror comics.
- **UI Inspiration:** Ancient, powerful artifacts (obsidian, dark metals, glowing runes, smoky glass), haunted typewriters, decaying grimoires.
- **Overall Feel:** Immersive, high-contrast, atmospheric, with subtle animations.

## 2. Brand Identity: EPITAPH
- **Product Name:** EPITAPH (Always capitalized, bold, prominent).
- **Tagline:** "WORDS CARVED IN STONE." (Always present with brand, distinct typography).
- **Core Concept:** Gothic writing experience where every keystroke echoes through eternity.

## 3. Color Palette (Tailwind CSS):
- **Primary Accent (Danger/Call to Action):** `bg-pumpkin` (Orange: `#FF7518`), `text-pumpkin`.
- **Secondary Accent (Safe/Progress):** `bg-slime` (Lime Green: `#6B8E23`), `text-slime`.
- **Tertiary Accent (Warning/Unsettling):** `bg-witch` (Deep Purple: `#6A0DAD`), `text-witch`.
- **Dark Backgrounds:** `bg-zinc-950`, `bg-black/90`, `bg-black/70`.
- **Text Colors:** `text-white`, `text-zinc-200`, `text-gray-400`.
- **Warning/Error:** `text-red-500`, `text-red-800`.

## 4. Typography:
- **Main Headlines/Brand:** `font-horror` (e.g., 'Creepster' or similar blocky, distressed font).
- **Taglines/Strong Statements:** `font-sans` (bold, uppercase, clean sans-serif for contrast).
- **Body/Editor Text:** `font-serif` (e.g., 'Merriweather', or a typewriter-style 'Special Elite').
- **Stats/Utility:** `font-mono` (for numbers, timestamps).

## 5. UI Elements & Patterns:
- **Buttons:** Always 3D-effect, chunky, with distinct `border-b-4` for depth, glowing shadows, and clear hover/active states. Use primary accent colors.
- **Cards/Modals:** Glassmorphism (`backdrop-blur-md`), dark backgrounds (`bg-black/50`), strong borders (often glowing).
- **Borders:** Use glowing outlines, often `red-500` or `pumpkin` for danger/focus. Avoid thin, clean borders.
- **Icons:** Use `lucide-react` icons, styled to match the theme (e.g., `text-pumpkin`, `text-slime`).

## 6. Tone of Voice (Microcopy):
- **Ominous & Thematic:** All placeholder text, tooltips, loading messages, and status updates should reflect the horror/graveyard theme.
    - *Examples:* "Summon new haunting," "Words lost to the void," "The ink is running dry...", "Resurrect Full Manuscript."
- **Direct & Urgent:** Messaging related to the timer or actions should be concise and convey pressure.

## 7. Animations:
- **Subtle but Present:** Drifting fog, pulsing glows, slight shakes, animated progress bars. Avoid jarring, overly fast animations.

## 8. Accessibility:
- Maintain high contrast for all text. Ensure interactive elements have sufficient touch targets.