import React from 'react';
import { SimpleEditor } from './SimpleEditor';

interface EditorPaneProps {
  currentDocument: string | null;
}

export const EditorPane: React.FC<EditorPaneProps> = ({ currentDocument }) => {
  return <SimpleEditor currentDocument={currentDocument} />;
};