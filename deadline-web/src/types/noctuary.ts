/**
 * Core type definitions for the unified Noctuary Editor
 */

export interface Document {
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

export interface Snapshot {
  id: string;                    // UUID v4
  content: string;               // Document content at snapshot time
  wordCount: number;             // Word count at snapshot time
  timestamp: number;             // Unix timestamp
}

export interface EditorSettings {
  fontFamily: string;            // 'IM Fell English' | 'Crimson Text' | 'Georgia' | 'Times New Roman'
  fontSize: number;              // 12-24px
  lineHeight: number;            // 1.2-2.0
  editorWidth: number;           // 60-80ch
  theme: 'dark' | 'light';       // Color scheme
}

export interface NoctuaryState {
  documents: Document[];
  activeDocumentId: string | null;
  sidebarOpen: boolean;
  settings: EditorSettings;
  saveStatus: 'saved' | 'saving' | 'error';
}

export interface LocalStorageSchema {
  'noctuary:documents': Document[];
  'noctuary:settings': EditorSettings;
  'noctuary:activeDocumentId': string | null;
}

export interface DocumentStatistics {
  wordCount: number;
  characterCount: number;
  readingTime: number;           // In minutes
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: number;
}
