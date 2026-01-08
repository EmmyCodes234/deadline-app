import React from 'react';
import { DocumentEditor } from './DocumentEditor';

// Standalone test component for the document editor
export const DocumentEditorStandalone: React.FC = () => {
  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh',
      margin: 0,
      padding: 0,
      overflow: 'hidden'
    }}>
      <DocumentEditor />
    </div>
  );
};