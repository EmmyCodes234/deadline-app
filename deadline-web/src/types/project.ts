export interface ProjectDocument {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  parentId?: string | null; // For nested structure
}

export interface ProjectFolder {
  id: string;
  name: string;
  parentId?: string | null;
  isExpanded?: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  documents: ProjectDocument[];
  folders: ProjectFolder[];
  lastEdited: Date;
  createdAt: Date;
}

export interface CreateProjectData {
  name: string;
  description: string;
}

export interface CreateDocumentData {
  title: string;
  content?: string;
  parentId?: string | null;
}

export interface CreateFolderData {
  name: string;
  parentId?: string | null;
}