# Design Document

## Overview

The Noctuary Editor redesign consolidates two separate editor implementations (NoctuaryEditor and GrimoireEditor) into a single, unified component that prioritizes usability, accessibility, and performance. The design eliminates hostile UX patterns (trope executioner, haunt messages, idle panic) and replaces them with subtle, non-intrusive horror theming that enhances rather than interrupts the writing experience.

### Key Design Principles

1. **Writer First**: Every feature must serve the writer's goal of producing text
2. **Subtle Horror**: Theme enhances atmosphere without disrupting flow
3. **Accessibility**: WCAG 2.1 AA compliance is non-negotiable
4. **Performance**: 60fps interactions, sub-500ms auto-save
5. **Progressive Enhancement**: Core functionality works without JavaScript

## Architecture

### Component Hierarchy

```
NoctuaryEditor (Container)
├── EditorHeader (Navigation, Actions)
├── Sidebar (Document List, Folders)
│   ├── DocumentTree
│   ├── SearchBar
│   └── CreateDocumentButton
├── EditorCanvas (Main Writing Area)
│   ├── DocumentTitle (Editable)
│   ├── ContentEditor (Contenteditable)
│   └── FocusMode (Opacity Controller)
├── MetadataPanel (Statistics, Notes)
│   ├── Statistics (Words, Characters, Reading Time)
│   ├── WordGoal (Progress Bar)
│   ├── Synopsis (Textarea)
│   └── Tags (Tag List)
├── ExportModal (Format Selection)
├── SnapshotsModal (Version History)
├── SettingsModal (Customization)
└── KeyboardShortcutsModal (Help)
```

### State Management

Use React Context for global state:

```typescript
interface NoctuaryState {
  documents: Document[];
  activeDocumentId: string | null;
  sidebarOpen: boolean;
  settings: EditorSettings;
  saveStatus: 'saved' | 'saving' | 'error';
}

interface Document {
  id: string;
  title: string;
  content: string;
  folderId: string | null;
  tags: string[];
  wordGoal: number | null;
  synopsis: string;
  snapshots: Snapshot[];
  createdAt: number;
  updatedAt: number;
}

interface EditorSettings {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  editorWidth: number;
  theme: 'dark' | 'light';
}
```

### Data Flow

1. **User Input** → ContentEditor → Debounced Save (500ms) → LocalStorage
2. **Document Switch** → Load from LocalStorage → Update State → Render
3. **Export** → Generate File → Trigger Download
4. **Snapshot** → Clone Document State → Save to LocalStorage

## Components and Interfaces

### EditorCanvas Component

**Purpose**: Main writing area with contenteditable element

**Props**:
```typescript
interface EditorCanvasProps {
  document: Document | null;
  onContentChange: (content: string) => void;
  onTitleChange: (title: string) => void;
  settings: EditorSettings;
  isFocused: boolean;
  onFocusChange: (focused: boolean) => void;
}
```

**Key Features**:
- Contenteditable with proper ARIA attributes
- Debounced auto-save (500ms)
- Keyboard shortcut handling
- Focus mode opacity transitions
- Undo/redo support via browser native

### Sidebar Component

**Purpose**: Document navigation and organization

**Props**:
```typescript
interface SidebarProps {
  documents: Document[];
  activeDocumentId: string | null;
  isOpen: boolean;
  onToggle: () => void;
  onSelectDocument: (id: string) => void;
  onCreateDocument: () => void;
  onDeleteDocument: (id: string) => void;
  onReorderDocuments: (newOrder: string[]) => void;
}
```

**Key Features**:
- Drag-and-drop reordering
- Folder support with nesting
- Search/filter by title, content, tags
- Keyboard navigation (arrow keys, Enter)
- Collapsible with Cmd+B

### MetadataPanel Component

**Purpose**: Display statistics and document metadata

**Props**:
```typescript
interface MetadataPanelProps {
  document: Document | null;
  onUpdateSynopsis: (synopsis: string) => void;
  onUpdateTags: (tags: string[]) => void;
  onUpdateWordGoal: (goal: number | null) => void;
}
```

**Key Features**:
- Real-time word/character count
- Reading time estimation (200 words/minute)
- Word goal progress bar
- Synopsis textarea
- Tag management

### ExportModal Component

**Purpose**: Export documents to various formats

**Props**:
```typescript
interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document;
}
```

**Supported Formats**:
- **TXT**: Plain text with UTF-8 encoding
- **DOCX**: Microsoft Word format using docx library
- **PDF**: Formatted PDF using jsPDF library

**Export Logic**:
```typescript
async function exportDocument(document: Document, format: 'txt' | 'docx' | 'pdf'): Promise<void> {
  switch (format) {
    case 'txt':
      return exportToTxt(document);
    case 'docx':
      return exportToDocx(document);
    case 'pdf':
      return exportToPdf(document);
  }
}
```

### SnapshotsModal Component

**Purpose**: Version history and restoration

**Props**:
```typescript
interface SnapshotsModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document;
  onTakeSnapshot: () => void;
  onRestoreSnapshot: (snapshotId: string) => void;
  onDeleteSnapshot: (snapshotId: string) => void;
}
```

**Snapshot Structure**:
```typescript
interface Snapshot {
  id: string;
  content: string;
  wordCount: number;
  timestamp: number;
}
```

## Data Models

### LocalStorage Schema

```typescript
interface LocalStorageSchema {
  'noctuary:documents': Document[];
  'noctuary:settings': EditorSettings;
  'noctuary:activeDocumentId': string | null;
}
```

### Document Model

```typescript
interface Document {
  id: string;                    // UUID v4
  title: string;                 // Max 200 characters
  content: string;               // Unlimited
  folderId: string | null;       // Parent folder ID
  tags: string[];                // Array of tag strings
  wordGoal: number | null;       // Target word count
  synopsis: string;              // Max 1000 characters
  snapshots: Snapshot[];         // Version history
  createdAt: number;             // Unix timestamp
  updatedAt: number;             // Unix timestamp
}
```

### Settings Model

```typescript
interface EditorSettings {
  fontFamily: string;            // 'IM Fell English' | 'Crimson Text' | 'Georgia' | 'Times New Roman'
  fontSize: number;              // 12-24px
  lineHeight: number;            // 1.2-2.0
  editorWidth: number;           // 60-80ch
  theme: 'dark' | 'light';       // Color scheme
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Document consistency across switches
*For any* sequence of document switches, the editor should always display the correct content for the currently active document without mixing content from previous documents.
**Validates: Requirements 1.3**

### Property 2: Auto-save timing guarantee
*For any* content change in the editor, the system should persist that change to local storage within 500 milliseconds of the last keystroke.
**Validates: Requirements 2.1**

### Property 3: Save status indicator accuracy
*For any* save operation, the system should display "Saving..." during the save and "Saved" after completion, with the "Saved" indicator visible for exactly 2 seconds.
**Validates: Requirements 2.2, 2.3**

### Property 4: Unsaved changes protection
*For any* document with unsaved changes, attempting to navigate away from the page should trigger a browser confirmation dialog.
**Validates: Requirements 2.4**

### Property 5: Document persistence round-trip
*For any* set of documents saved to local storage, restarting the application should restore all documents with identical content, metadata, and structure.
**Validates: Requirements 2.5**

### Property 6: Export format correctness
*For any* document content, exporting to TXT, DOCX, or PDF should produce a valid file in that format that can be opened by standard applications.
**Validates: Requirements 3.2, 3.3, 3.4**

### Property 7: Export filename generation
*For any* document export, the downloaded file should have a filename matching the pattern `{document-title}.{extension}` with special characters sanitized.
**Validates: Requirements 3.5**

### Property 8: Keyboard shortcut consistency
*For any* document, pressing Escape should close any open modal or panel, regardless of which modal is currently displayed.
**Validates: Requirements 4.6**

### Property 9: Word count accuracy
*For any* document content, the displayed word count should match the result of splitting the content by whitespace and counting non-empty strings.
**Validates: Requirements 5.1**

### Property 10: Character count accuracy
*For any* document content, the displayed character count should match the length of the content string.
**Validates: Requirements 5.2**

### Property 11: Reading time calculation
*For any* document content, the estimated reading time should be calculated as `wordCount / 200` minutes, rounded to the nearest minute.
**Validates: Requirements 5.3**

### Property 12: Word goal progress
*For any* document with a word goal set, the progress percentage should be `(currentWordCount / wordGoal) * 100`, capped at 100%.
**Validates: Requirements 5.4**

### Property 13: Focus indicator visibility
*For any* interactive element, when focused via keyboard navigation, the element should have a visible focus indicator with at least 2px border.
**Validates: Requirements 6.2**

### Property 14: Color contrast compliance
*For any* text element in the interface, the contrast ratio between text color and background color should be at least 4.5:1.
**Validates: Requirements 6.3**

### Property 15: ARIA live region updates
*For any* status change (saving, saved, error), the system should update an ARIA live region to announce the change to screen readers.
**Validates: Requirements 6.4**

### Property 16: Modal focus trap
*For any* open modal, pressing Tab should cycle focus only among elements within that modal, never escaping to elements behind it.
**Validates: Requirements 6.5**

### Property 17: Sidebar opacity during focus
*For any* editor focus event, the sidebar and metadata panel opacity should transition to 30% within 300ms.
**Validates: Requirements 7.2**

### Property 18: Folder nesting integrity
*For any* folder structure, documents should maintain their parent-child relationships after reordering or moving operations.
**Validates: Requirements 8.1**

### Property 19: Drag-and-drop order preservation
*For any* drag-and-drop reorder operation, the new order should be persisted to local storage and maintained across page reloads.
**Validates: Requirements 8.2**

### Property 20: Tag storage round-trip
*For any* set of tags added to a document, those tags should be stored in document metadata and retrieved identically when the document is loaded.
**Validates: Requirements 8.3**

### Property 21: Tag filtering correctness
*For any* tag filter applied, only documents containing that exact tag should be displayed in the sidebar.
**Validates: Requirements 8.4**

### Property 22: Search comprehensiveness
*For any* search query, the results should include all documents where the query appears in the title, content, or tags (case-insensitive).
**Validates: Requirements 8.5**

### Property 23: Snapshot timestamp accuracy
*For any* snapshot created, the timestamp should be within 1 second of the current system time when the snapshot was requested.
**Validates: Requirements 9.1**

### Property 24: Snapshot list completeness
*For any* document with snapshots, the snapshots modal should display all snapshots in reverse chronological order with correct timestamps and word counts.
**Validates: Requirements 9.2**

### Property 25: Snapshot preview immutability
*For any* snapshot preview, the content should be displayed in a read-only editor (contenteditable="false") that prevents modifications.
**Validates: Requirements 9.3**

### Property 26: Snapshot restoration accuracy
*For any* snapshot restoration, the current document content should be replaced with the exact content from the snapshot.
**Validates: Requirements 9.4**

### Property 27: Snapshot deletion confirmation
*For any* snapshot deletion request, the system should display a confirmation dialog before removing the snapshot from storage.
**Validates: Requirements 9.5**

### Property 28: No disruptive typing effects
*For any* keystroke in the editor, the system should not apply CSS transforms (translate, rotate, scale) to the editor or root element.
**Validates: Requirements 10.2**

### Property 29: No popup interruptions during writing
*For any* typing session, the system should not display modal dialogs, toasts, or notifications unless explicitly triggered by user action.
**Validates: Requirements 10.3**

### Property 30: Theme persistence round-trip
*For any* theme customization, the settings should be saved to local storage and restored identically on next application load.
**Validates: Requirements 10.5**

### Property 31: Mobile button size compliance
*For any* button element on mobile viewports, the computed width and height should both be at least 44px.
**Validates: Requirements 11.4**

### Property 32: Settings application immediacy
*For any* settings change, the new setting should be applied to the editor within 100ms without requiring a page reload.
**Validates: Requirements 12.5**

## Error Handling

### LocalStorage Errors

**Scenario**: LocalStorage quota exceeded
**Handling**: 
1. Display error toast: "Storage full. Please export and delete old documents."
2. Prevent new document creation
3. Allow export and deletion operations

**Scenario**: LocalStorage unavailable (private browsing)
**Handling**:
1. Display warning banner: "Private browsing detected. Changes will not persist."
2. Use in-memory storage as fallback
3. Disable auto-save indicator

### Export Errors

**Scenario**: Export library fails to load
**Handling**:
1. Display error toast: "Export failed. Please try again."
2. Log error to console for debugging
3. Fallback to TXT export if DOCX/PDF fails

**Scenario**: Invalid document content for export
**Handling**:
1. Sanitize content (remove invalid characters)
2. Retry export with sanitized content
3. If still fails, display error with details

### Snapshot Errors

**Scenario**: Snapshot restoration fails
**Handling**:
1. Display error toast: "Failed to restore snapshot. Content may be corrupted."
2. Do not modify current document content
3. Allow user to try different snapshot

## Testing Strategy

### Unit Testing

**Framework**: Vitest + React Testing Library

**Coverage Requirements**:
- All utility functions (word count, reading time, export) must have 100% coverage
- All React components must have >80% coverage
- All error handling paths must be tested

**Key Test Suites**:
1. **Document Management**: Create, update, delete, reorder
2. **Auto-Save**: Debouncing, timing, error handling
3. **Export**: Format generation, filename sanitization
4. **Snapshots**: Creation, restoration, deletion
5. **Keyboard Shortcuts**: All shortcuts trigger correct actions
6. **Accessibility**: ARIA attributes, focus management, contrast ratios

### Property-Based Testing

**Framework**: fast-check (JavaScript property-based testing library)

**Configuration**: Each property test should run minimum 100 iterations

**Property Test Suites**:

1. **Document Consistency** (Property 1)
   - Generate random sequences of document switches
   - Verify active document always shows correct content

2. **Auto-Save Timing** (Property 2)
   - Generate random typing patterns
   - Verify all changes saved within 500ms

3. **Export Round-Trip** (Property 6)
   - Generate random document content
   - Export to each format and verify validity

4. **Word Count Accuracy** (Property 9)
   - Generate random text with various whitespace patterns
   - Verify word count matches manual count

5. **Character Count Accuracy** (Property 10)
   - Generate random text with unicode characters
   - Verify character count matches string length

6. **Reading Time Calculation** (Property 11)
   - Generate random word counts
   - Verify reading time formula is correct

7. **Color Contrast** (Property 14)
   - Generate all text/background combinations
   - Verify all meet 4.5:1 ratio

8. **Tag Filtering** (Property 21)
   - Generate random documents with random tags
   - Verify filtering returns only matching documents

9. **Search Comprehensiveness** (Property 22)
   - Generate random documents and search queries
   - Verify all matches are found

10. **Snapshot Restoration** (Property 26)
    - Generate random document states
    - Create snapshot, modify document, restore
    - Verify content matches snapshot exactly

### Integration Testing

**Framework**: Playwright

**Test Scenarios**:
1. **Full Writing Session**: Create document → Write content → Auto-save → Export
2. **Document Organization**: Create folders → Move documents → Reorder → Persist
3. **Snapshot Workflow**: Write → Snapshot → Modify → Restore → Verify
4. **Keyboard Navigation**: Navigate entire app using only keyboard
5. **Mobile Responsive**: Test all features on mobile viewport

### Accessibility Testing

**Tools**: 
- axe-core (automated accessibility testing)
- NVDA/JAWS (screen reader testing)
- Keyboard-only navigation testing

**Test Cases**:
1. All interactive elements reachable via keyboard
2. All images have alt text
3. All forms have labels
4. All modals trap focus
5. All status changes announced to screen readers
6. All color contrasts meet WCAG 2.1 AA

## Performance Considerations

### Auto-Save Optimization

**Problem**: Saving on every keystroke causes performance issues
**Solution**: Debounce save operations to 500ms after last keystroke

```typescript
const debouncedSave = useMemo(
  () => debounce((content: string) => {
    localStorage.setItem(`noctuary:document:${documentId}`, content);
  }, 500),
  [documentId]
);
```

### Virtual Scrolling for Document List

**Problem**: Large document lists (>100 documents) cause slow rendering
**Solution**: Use react-window for virtual scrolling in sidebar

```typescript
<FixedSizeList
  height={600}
  itemCount={documents.length}
  itemSize={50}
  width="100%"
>
  {({ index, style }) => (
    <DocumentListItem
      document={documents[index]}
      style={style}
    />
  )}
</FixedSizeList>
```

### Lazy Loading for Export Libraries

**Problem**: DOCX and PDF libraries are large (>100KB each)
**Solution**: Lazy load export libraries only when needed

```typescript
async function exportToDocx(document: Document) {
  const { Document, Packer, Paragraph, TextRun } = await import('docx');
  // ... export logic
}
```

### Memoization for Statistics

**Problem**: Recalculating word count on every render is expensive
**Solution**: Memoize statistics calculations

```typescript
const statistics = useMemo(() => ({
  wordCount: content.trim().split(/\s+/).filter(w => w.length > 0).length,
  characterCount: content.length,
  readingTime: Math.ceil(wordCount / 200),
}), [content]);
```

## Security Considerations

### XSS Prevention

**Risk**: User content could contain malicious scripts
**Mitigation**: 
- Use contenteditable with textContent (not innerHTML)
- Sanitize content before export
- Use DOMPurify for any HTML rendering

### LocalStorage Limits

**Risk**: Malicious user could fill LocalStorage
**Mitigation**:
- Implement storage quota monitoring
- Limit document count to 1000
- Limit document size to 1MB each

### Export Filename Injection

**Risk**: Document titles could contain path traversal characters
**Mitigation**:
- Sanitize filenames: `title.replace(/[^a-z0-9]/gi, '-')`
- Limit filename length to 200 characters
- Validate file extension matches format

## Deployment Considerations

### Browser Compatibility

**Minimum Supported Versions**:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Polyfills Required**:
- None (all features supported in minimum versions)

### Bundle Size

**Target**: <200KB gzipped for initial load

**Optimization Strategies**:
- Code splitting for export libraries
- Tree shaking for unused utilities
- Minification and compression

### Progressive Web App

**Features**:
- Service worker for offline support
- Manifest for install prompt
- LocalStorage sync when online

## Future Enhancements

### Phase 2 Features (Not in Current Scope)

1. **Cloud Sync**: Sync documents across devices via Supabase
2. **Collaboration**: Real-time collaborative editing
3. **AI Writing Assistant**: Grammar checking, style suggestions
4. **Custom Themes**: User-created color schemes
5. **Plugin System**: Extensibility for third-party features
6. **Mobile Apps**: Native iOS/Android apps
7. **Voice Dictation**: Speech-to-text input
8. **Markdown Support**: Rich text formatting with Markdown syntax
