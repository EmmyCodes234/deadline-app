import React from 'react';
import { DocumentEditor } from '../components/DocumentEditor';

export const DocumentEditorDemo: React.FC = () => {
  return (
    <div className="w-full h-screen overflow-hidden">
      <DocumentEditor className="h-full" />
    </div>
  );
};