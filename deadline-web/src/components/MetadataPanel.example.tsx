/**
 * Example usage of MetadataPanel component
 * 
 * This file demonstrates how to integrate the MetadataPanel
 * into the Noctuary Editor.
 */

import React from 'react';
import { MetadataPanel } from './MetadataPanel';
import { useNoctuary } from '../contexts/NoctuaryContext';

export function MetadataPanelExample() {
  const { documents, activeDocumentId, updateDocument } = useNoctuary();

  // Get the active document
  const activeDocument = documents.find(doc => doc.id === activeDocumentId) || null;

  // Handler for updating synopsis
  const handleUpdateSynopsis = (synopsis: string) => {
    if (activeDocument) {
      updateDocument(activeDocument.id, { synopsis });
    }
  };

  // Handler for updating tags
  const handleUpdateTags = (tags: string[]) => {
    if (activeDocument) {
      updateDocument(activeDocument.id, { tags });
    }
  };

  // Handler for updating word goal
  const handleUpdateWordGoal = (wordGoal: number | null) => {
    if (activeDocument) {
      updateDocument(activeDocument.id, { wordGoal });
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Main editor area would go here */}
      <div style={{ flex: 1, padding: '2rem' }}>
        <h1>Editor Area</h1>
        <p>This is where the main editor would be.</p>
      </div>

      {/* MetadataPanel on the right */}
      <MetadataPanel
        document={activeDocument}
        onUpdateSynopsis={handleUpdateSynopsis}
        onUpdateTags={handleUpdateTags}
        onUpdateWordGoal={handleUpdateWordGoal}
      />
    </div>
  );
}

/**
 * Example with focus mode
 */
export function MetadataPanelWithFocusMode() {
  const { documents, activeDocumentId, updateDocument } = useNoctuary();
  const [isFocusMode, setIsFocusMode] = React.useState(false);

  const activeDocument = documents.find(doc => doc.id === activeDocumentId) || null;

  const handleUpdateSynopsis = (synopsis: string) => {
    if (activeDocument) {
      updateDocument(activeDocument.id, { synopsis });
    }
  };

  const handleUpdateTags = (tags: string[]) => {
    if (activeDocument) {
      updateDocument(activeDocument.id, { tags });
    }
  };

  const handleUpdateWordGoal = (wordGoal: number | null) => {
    if (activeDocument) {
      updateDocument(activeDocument.id, { wordGoal });
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 1, padding: '2rem' }}>
        <button onClick={() => setIsFocusMode(!isFocusMode)}>
          Toggle Focus Mode
        </button>
        <h1>Editor Area</h1>
        <p>Click the button to toggle focus mode.</p>
      </div>

      <MetadataPanel
        document={activeDocument}
        onUpdateSynopsis={handleUpdateSynopsis}
        onUpdateTags={handleUpdateTags}
        onUpdateWordGoal={handleUpdateWordGoal}
        className={isFocusMode ? 'focus-mode' : ''}
      />
    </div>
  );
}
