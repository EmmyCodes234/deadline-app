# Requirements Document

## Introduction

The Noctuary Editor is a focused, distraction-free writing environment for horror fiction writers. It combines minimalist design with subtle horror aesthetics to create an immersive writing experience without interrupting flow. The current implementation suffers from feature bloat, code duplication, and hostile UX patterns that actively fight users. This redesign will create a single, unified editor that serves writers first and theme second.

## Glossary

- **Noctuary**: The unified writing editor component
- **System**: The Noctuary Editor application
- **User**: A writer using the Noctuary Editor
- **Document**: A single writing project or story
- **Session**: A continuous period of writing activity
- **Flow State**: Uninterrupted writing with high productivity
- **Sidebar**: The collapsible navigation panel showing document list
- **Metadata Panel**: The right panel showing document statistics and notes
- **Auto-Save**: Automatic persistence of content to local storage
- **Export**: Converting document content to downloadable file formats
- **Accessibility**: Compliance with WCAG 2.1 AA standards

## Requirements

### Requirement 1

**User Story:** As a writer, I want a single, unified editor interface, so that I can focus on writing without choosing between confusing modes.

#### Acceptance Criteria

1. WHEN the System loads THEN the System SHALL present exactly one editor interface
2. WHEN a User creates a document THEN the System SHALL open it in the unified editor
3. WHEN a User switches documents THEN the System SHALL maintain consistent editor behavior
4. WHEN the System displays the editor THEN the System SHALL use contenteditable with proper accessibility attributes
5. WHERE the editor is active THEN the System SHALL provide consistent keyboard shortcuts across all documents

### Requirement 2

**User Story:** As a writer, I want my work to save automatically, so that I never lose progress due to crashes or mistakes.

#### Acceptance Criteria

1. WHEN a User types in the editor THEN the System SHALL save content to local storage within 500 milliseconds
2. WHEN content is being saved THEN the System SHALL display a subtle "Saving..." indicator
3. WHEN content save completes THEN the System SHALL display a "Saved" indicator for 2 seconds
4. WHEN the System detects unsaved changes THEN the System SHALL prevent browser navigation without confirmation
5. WHEN the System restarts THEN the System SHALL restore all documents from local storage

### Requirement 3

**User Story:** As a writer, I want to export my work in multiple formats, so that I can share or publish my stories.

#### Acceptance Criteria

1. WHEN a User requests export THEN the System SHALL provide options for TXT, DOCX, and PDF formats
2. WHEN a User selects TXT export THEN the System SHALL generate a plain text file with UTF-8 encoding
3. WHEN a User selects DOCX export THEN the System SHALL generate a Microsoft Word compatible document
4. WHEN a User selects PDF export THEN the System SHALL generate a formatted PDF with proper typography
5. WHEN export completes THEN the System SHALL trigger browser download with appropriate filename

### Requirement 4

**User Story:** As a writer, I want keyboard shortcuts for common actions, so that I can work efficiently without reaching for the mouse.

#### Acceptance Criteria

1. WHEN a User presses Cmd+B or Ctrl+B THEN the System SHALL toggle sidebar visibility
2. WHEN a User presses Cmd+S or Ctrl+S THEN the System SHALL trigger manual save with visual feedback
3. WHEN a User presses Cmd+E or Ctrl+E THEN the System SHALL open the export modal
4. WHEN a User presses Cmd+K or Ctrl+K THEN the System SHALL open the quick document switcher
5. WHEN a User presses ? THEN the System SHALL display keyboard shortcuts help modal
6. WHEN a User presses Escape THEN the System SHALL close any open modal or panel

### Requirement 5

**User Story:** As a writer, I want to see my writing statistics, so that I can track my progress toward goals.

#### Acceptance Criteria

1. WHEN a document is active THEN the System SHALL display current word count
2. WHEN a document is active THEN the System SHALL display current character count
3. WHEN a document is active THEN the System SHALL display estimated reading time
4. WHEN a User sets a word goal THEN the System SHALL display progress toward that goal
5. WHEN a User writes THEN the System SHALL update statistics in real-time without lag

### Requirement 6

**User Story:** As a writer with visual impairments, I want the editor to be accessible, so that I can use screen readers and keyboard navigation.

#### Acceptance Criteria

1. WHEN the System renders the editor THEN the System SHALL include proper ARIA labels on all interactive elements
2. WHEN a User navigates with keyboard THEN the System SHALL provide visible focus indicators
3. WHEN the System displays text THEN the System SHALL maintain minimum 4.5:1 contrast ratio per WCAG 2.1 AA
4. WHEN a User uses a screen reader THEN the System SHALL announce document changes and status updates
5. WHEN the System displays modals THEN the System SHALL trap focus within the modal until dismissed

### Requirement 7

**User Story:** As a writer, I want the interface to fade away during writing, so that I can maintain flow state without distractions.

#### Acceptance Criteria

1. WHEN a User focuses the editor THEN the System SHALL reduce opacity of sidebar and metadata panel to 30%
2. WHEN a User moves mouse over sidebar or metadata panel THEN the System SHALL restore full opacity
3. WHEN a User is idle for 30 seconds THEN the System SHALL hide the cursor
4. WHEN a User resumes typing THEN the System SHALL restore the cursor immediately
5. WHEN the editor is focused THEN the System SHALL hide all non-essential UI elements

### Requirement 8

**User Story:** As a writer, I want to organize my work with folders and tags, so that I can manage multiple projects efficiently.

#### Acceptance Criteria

1. WHEN a User creates a folder THEN the System SHALL allow nesting documents within that folder
2. WHEN a User drags a document THEN the System SHALL allow reordering within the sidebar
3. WHEN a User adds tags to a document THEN the System SHALL store tags in document metadata
4. WHEN a User filters by tag THEN the System SHALL display only documents with matching tags
5. WHEN a User searches THEN the System SHALL search document titles, content, and tags

### Requirement 9

**User Story:** As a writer, I want document snapshots, so that I can experiment with changes without fear of losing previous versions.

#### Acceptance Criteria

1. WHEN a User requests a snapshot THEN the System SHALL save current document state with timestamp
2. WHEN a User views snapshots THEN the System SHALL display list of all snapshots with timestamps and word counts
3. WHEN a User previews a snapshot THEN the System SHALL display snapshot content in read-only mode
4. WHEN a User restores a snapshot THEN the System SHALL replace current content with snapshot content
5. WHEN a User deletes a snapshot THEN the System SHALL remove snapshot from storage after confirmation

### Requirement 10

**User Story:** As a writer, I want the horror theme to enhance rather than interrupt my writing, so that I stay immersed without distraction.

#### Acceptance Criteria

1. WHEN the System displays the editor THEN the System SHALL use subtle parchment texture without animation
2. WHEN a User types THEN the System SHALL NOT trigger screen shake, tremor, or other disruptive effects
3. WHEN a User is writing THEN the System SHALL NOT display popup messages or notifications
4. WHEN the System applies theme THEN the System SHALL maintain readability with proper contrast
5. WHEN a User customizes theme THEN the System SHALL persist theme preferences to local storage

### Requirement 11

**User Story:** As a writer, I want responsive design, so that I can write on tablets and mobile devices.

#### Acceptance Criteria

1. WHEN the viewport width is less than 768px THEN the System SHALL hide sidebar by default
2. WHEN the viewport width is less than 768px THEN the System SHALL hide metadata panel
3. WHEN a User taps menu icon on mobile THEN the System SHALL display sidebar as overlay
4. WHEN the System displays on mobile THEN the System SHALL use touch-friendly button sizes (minimum 44x44px)
5. WHEN the System displays on mobile THEN the System SHALL prevent horizontal scrolling

### Requirement 12

**User Story:** As a writer, I want to customize editor appearance, so that I can create my ideal writing environment.

#### Acceptance Criteria

1. WHEN a User opens settings THEN the System SHALL provide font family selection
2. WHEN a User opens settings THEN the System SHALL provide font size adjustment (12px to 24px)
3. WHEN a User opens settings THEN the System SHALL provide line height adjustment (1.2 to 2.0)
4. WHEN a User opens settings THEN the System SHALL provide editor width adjustment (60ch to 80ch)
5. WHEN a User changes settings THEN the System SHALL apply changes immediately without page reload
