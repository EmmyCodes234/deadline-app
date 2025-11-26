# Project Specification Document: DeadLine Core Logic

## 1. The Reaper Engine (`useReaper` Hook)

**Purpose:** Manages the game timer, status, and dynamic decay based on user input.

-   **States:**
    -   `timeLeft: number` (milliseconds remaining).
    -   `status: 'SAFE' | 'WARNING' | 'CRITICAL' | 'DEAD'`
    -   `isActive: boolean` (timer running).
    -   `hasStartedTyping: boolean` (tracks if user has typed anything yet).
    -   `lastKeystrokeTime: number` (timestamp of last input).
    -   `currentDecayMultiplier: number` (1x, 2x, 3x drain).

-   **Core Mechanics:**
    -   **Grace Period:** `timeLeft` only starts decaying AFTER `hasStartedTyping` becomes `true` (on first keystroke).
    -   **Dynamic Decay ("Heartbeat Tax"):**
        -   `BASE_DECAY_RATE_MS = 100` (ms per tick).
        -   `HESITATION_THRESHOLD_MS = 2000` (2 seconds).
        -   If `(Date.now() - lastKeystrokeTime) > HESITATION_THRESHOLD_MS`, then `currentDecayMultiplier = 3`.
        -   Else, `currentDecayMultiplier = 1`.
        -   `timeLeft` is reduced by `BASE_DECAY_RATE_MS * currentDecayMultiplier` per interval tick.
    -   **Status Thresholds:**
        -   `SAFE`: `timeLeft > 10000` (10 seconds).
        -   `WARNING`: `timeLeft <= 10000 && > 5000` (10-5 seconds).
        -   `CRITICAL`: `timeLeft <= 5000` (0-5 seconds).
        -   `DEAD`: `timeLeft <= 0`.
    -   **Input Reward:** `stroke()` function (on keystroke) resets `lastKeystrokeTime` and adds a fixed amount of time to `timeLeft`.

## 2. The Catacombs (Hierarchical Project Structure - `useCrypt` Hook)

**Purpose:** Manages a nested collection of writing documents (Tombstones) and organizational folders (Mausoleums).

-   **Data Structure (`CryptItem` Interface):**
    ```typescript
    interface CryptItem {
      id: string;
      type: 'mausoleum' | 'tombstone'; // Folder or File
      title: string;
      content?: string; // Only for 'tombstone' type
      parentId: string | null; // `null` for root-level items
      expanded?: boolean; // For UI state of mausoleums
      wordCount?: number; // Calculated for 'tombstone'
    }
    ```
-   **Core Functions:**
    -   `createMausoleum(title: string, parentId: string | null)`: Adds a new folder.
    -   `createDoc(parentId: string | null)`: Adds a new document/file, assigning `parentId`.
    -   `deleteItem(id: string)`: Deletes item and all its children.
    -   `updateItem(id: string, updates: Partial<CryptItem>)`: Modifies an item.
    -   `toggleExpand(id: string)`: Toggles `expanded` state for a mausoleum.
    -   `selectItem(id: string)`: Sets the currently active item.
    -   `totalProjectWords: number`: Calculated sum of `wordCount` for all `tombstone` items.

-   **UI Rendering (Sidebar):**
    -   Uses a recursive component to render `CryptItem[]`.
    -   Mausoleums are collapsible.
    -   Nested items are visually indented based on depth.
    -   A "Ghost Slot" UI element is rendered at the end of an expanded Mausoleum's children list to create new nested items.

## 3. The Grand Resurrection (Project Compilation - `compileProject.ts`)

**Purpose:** Generates a single, formatted `.docx` file from the entire hierarchical project structure.

-   **Dependencies:** `docx` library (`Document`, `Packer`, `Paragraph`, `TextRun`, `HeadingLevel`, `PageBreak`), `file-saver` (`saveAs`).
-   **Function Signature:** `exportProjectToDocx(documents: CryptItem[], projectTitle: string)`
-   **Logic Flow:**
    1.  Initialize `new Document()`.
    2.  Add a Title Page: Project Title (H1), Total Word Count, current date.
    3.  Recursive `processItems(items: CryptItem[], parentId: string | null, headingLevel: HeadingLevel)`:
        -   Filters `documents` for items matching `parentId`.
        -   Sorts items for consistent output order.
        -   **For `mausoleum`:**
            -   Adds a `Paragraph` with `heading: headingLevel` using `mausoleum.title`.
            -   Recursively calls `processItems` for children with `headingLevel` incremented.
        -   **For `tombstone`:**
            -   Adds a `Paragraph` with `heading: (headingLevel + 1)` using `tombstone.title`.
            -   Splits `tombstone.content` by newlines, creating a new `Paragraph` for each line.
            -   Adds a `PageBreak` after each `tombstone` for clean chapter separation.
    4.  Uses `Packer.toBlob(doc)` and `saveAs(blob, filename)`.

## 4. The Poltergeist (Keyboard Sabotage - `App.tsx`)

**Purpose:** Introduces chaotic keyboard interference when the user is in `CRITICAL` state.

-   **Trigger:** `status === 'CRITICAL'`.
-   **Interception:** `onChange` or `onKeyDown` event handler on the editor.
-   **Randomization:** `Math.random()` check for a 20% chance of sabotage.
-   **Sabotage Effects (Randomly Chosen):**
    1.  **Backspace:** Deletes the last character from the editor's text state.
    2.  **Jumble:** Replaces the intended character with a random 'curse' character (`#`, `&`, `!`, `?`, `6`).
    3.  **Flicker & Scream:** Triggers a `CSS animation` (`animate-flicker-black`) on the editor for 200ms and plays a `SHORT_GLITCH_SOUND` via `useAudio`.