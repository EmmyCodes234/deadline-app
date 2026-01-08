# MetadataPanel Component

The `MetadataPanel` component displays document statistics and metadata for the Noctuary Editor. It provides real-time word count, character count, reading time estimation, word goal tracking, synopsis editing, and tag management.

## Features

- **Real-time Statistics**: Displays word count, character count, and estimated reading time
- **Word Goal Tracking**: Set and track progress toward word count goals with a visual progress bar
- **Synopsis Management**: Edit document synopsis with character count (max 1000 characters)
- **Tag Management**: Add, remove, and display document tags
- **Accessibility**: Full ARIA support with proper labels and roles
- **Gothic Theme**: Styled with subtle horror aesthetics that enhance without distracting

## Usage

```tsx
import { MetadataPanel } from './components/MetadataPanel';
import { useNoctuary } from './contexts/NoctuaryContext';

function MyEditor() {
  const { documents, activeDocumentId, updateDocument } = useNoctuary();
  const activeDocument = documents.find(doc => doc.id === activeDocumentId) || null;

  return (
    <MetadataPanel
      document={activeDocument}
      onUpdateSynopsis={(synopsis) => {
        if (activeDocument) {
          updateDocument(activeDocument.id, { synopsis });
        }
      }}
      onUpdateTags={(tags) => {
        if (activeDocument) {
          updateDocument(activeDocument.id, { tags });
        }
      }}
      onUpdateWordGoal={(wordGoal) => {
        if (activeDocument) {
          updateDocument(activeDocument.id, { wordGoal });
        }
      }}
    />
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `document` | `Document \| null` | Yes | The active document to display metadata for |
| `onUpdateSynopsis` | `(synopsis: string) => void` | Yes | Callback when synopsis is updated |
| `onUpdateTags` | `(tags: string[]) => void` | Yes | Callback when tags are updated |
| `onUpdateWordGoal` | `(goal: number \| null) => void` | Yes | Callback when word goal is updated |
| `className` | `string` | No | Additional CSS classes (e.g., 'focus-mode') |

## Statistics Calculations

### Word Count
Words are counted by splitting content by whitespace and counting non-empty strings:
```typescript
content.trim().split(/\s+/).filter(w => w.length > 0).length
```

### Character Count
Characters are counted using the string length:
```typescript
content.length
```

### Reading Time
Reading time is estimated at 200 words per minute, rounded up:
```typescript
Math.ceil(wordCount / 200)
```

### Word Goal Progress
Progress is calculated as a percentage, capped at 100%:
```typescript
Math.min(100, (currentWordCount / wordGoal) * 100)
```

## Focus Mode

The component supports focus mode by adding the `focus-mode` class:

```tsx
<MetadataPanel
  document={activeDocument}
  className={isFocusMode ? 'focus-mode' : ''}
  {...handlers}
/>
```

In focus mode, the panel opacity reduces to 30% and restores to 100% on hover.

## Accessibility

The component follows WCAG 2.1 AA standards:

- All interactive elements have proper ARIA labels
- Progress bar uses `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- Form inputs have associated labels
- Color contrast ratios meet 4.5:1 minimum
- Keyboard navigation is fully supported

## Testing

The component has comprehensive test coverage:

### Property-Based Tests
- **Property 9**: Word count accuracy (Requirements 5.1)
- **Property 10**: Character count accuracy (Requirements 5.2)
- **Property 11**: Reading time calculation (Requirements 5.3)
- **Property 12**: Word goal progress (Requirements 5.4)
- **Property 20**: Tag storage round-trip (Requirements 8.3)

### Integration Tests
- Renders statistics correctly
- Displays word goal progress
- Shows synopsis textarea
- Displays tags list
- Shows empty state when no document selected

Run tests with:
```bash
npm test -- MetadataPanel
```

## Styling

The component uses `MetadataPanel.css` for styling. Key features:

- Gothic horror theme with parchment texture
- Dark color scheme with proper contrast
- Smooth transitions for interactive elements
- Custom scrollbar styling
- Responsive design (hidden on mobile <768px)

## Requirements Validation

This component validates the following requirements:

- **5.1**: Real-time word count display
- **5.2**: Real-time character count display
- **5.3**: Estimated reading time display
- **5.4**: Word goal progress tracking
- **8.3**: Tag storage and retrieval

## Related Components

- `EditorCanvas`: Main writing area
- `NoctuarySidebar`: Document navigation
- `NoctuaryContext`: Global state management
