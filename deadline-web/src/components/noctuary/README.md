# Noctuary Editor Components

This directory previously contained the unified Noctuary Editor implementation. The components have been consolidated into the main components directory.

## Current Implementation

The Noctuary editor is now implemented as:

- `UnifiedNoctuaryEditor.tsx` - Main container component (in `/src/components/`)
- `EditorCanvas.tsx` - Main writing area with contenteditable
- `NoctuarySidebar.tsx` - Document list and navigation
- `MetadataPanel.tsx` - Statistics and document metadata
- `ExportModal.tsx` - Export functionality
- `SnapshotsModal.tsx` - Version history
- `SettingsModal.tsx` - Editor customization
- `KeyboardShortcutsModal.tsx` - Help modal

## Usage

```tsx
import { NoctuaryProvider } from '@/contexts/NoctuaryContext';
import { UnifiedNoctuaryEditor } from '@/components/UnifiedNoctuaryEditor';

function App() {
  return (
    <NoctuaryProvider>
      <UnifiedNoctuaryEditor />
    </NoctuaryProvider>
  );
}
```
