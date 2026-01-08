import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Project, CreateProjectData, ProjectDocument, CreateDocumentData, ProjectFolder, CreateFolderData } from '@/types/project';

// Storage key for projects
const PROJECTS_STORAGE_KEY = 'deadline:projects';

// Utility functions for localStorage
const saveProjectsToStorage = (projects: Project[]) => {
  try {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error('Failed to save projects to localStorage:', error);
  }
};

const loadProjectsFromStorage = (): Project[] => {
  try {
    const stored = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects and migrate old projects
      return parsed.map((project: any) => ({
        ...project,
        folders: project.folders || [], // Migration: add folders array if missing
        documents: (project.documents || []).map((doc: any) => ({
          ...doc,
          parentId: doc.parentId || null, // Migration: add parentId if missing
        })),
        lastEdited: new Date(project.lastEdited),
        createdAt: new Date(project.createdAt),
      }));
    }
  } catch (error) {
    console.error('Failed to load projects from localStorage:', error);
  }
  return [];
};

interface ProjectContextType {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  createProject: (data: CreateProjectData) => Promise<Project>;
  getProject: (id: string) => Promise<Project | null>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  setCurrentProject: (project: Project | null) => void;
  createDocument: (projectId: string, data: CreateDocumentData) => Promise<ProjectDocument>;
  updateDocument: (projectId: string, documentId: string, updates: Partial<ProjectDocument>) => Promise<void>;
  deleteDocument: (projectId: string, documentId: string) => Promise<void>;
  getDocument: (projectId: string, documentId: string) => ProjectDocument | null;
  createFolder: (projectId: string, data: CreateFolderData) => Promise<ProjectFolder>;
  updateFolder: (projectId: string, folderId: string, updates: Partial<ProjectFolder>) => Promise<void>;
  deleteFolder: (projectId: string, folderId: string) => Promise<void>;
  toggleFolder: (projectId: string, folderId: string) => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);

  // Load projects from localStorage on mount
  useEffect(() => {
    const loadedProjects = loadProjectsFromStorage();
    setProjects(loadedProjects);
  }, []);

  // Save projects to localStorage whenever projects change
  useEffect(() => {
    if (projects.length > 0) {
      saveProjectsToStorage(projects);
    }
  }, [projects]);

  const createProject = useCallback(async (data: CreateProjectData): Promise<Project> => {
    setLoading(true);
    
    const newProject: Project = {
      id: crypto.randomUUID(),
      name: data.name,
      description: data.description,
      documents: [],
      folders: [],
      lastEdited: new Date(),
      createdAt: new Date(),
    };

    setProjects(prev => {
      const updated = [newProject, ...prev];
      saveProjectsToStorage(updated);
      return updated;
    });
    setLoading(false);
    
    return newProject;
  }, []);

  const getProject = useCallback(async (id: string): Promise<Project | null> => {
    setLoading(true);
    
    const project = projects.find(p => p.id === id) || null;
    setCurrentProject(project);
    setLoading(false);
    
    return project;
  }, [projects]);

  const updateProject = useCallback(async (id: string, updates: Partial<Project>): Promise<void> => {
    setLoading(true);
    
    setProjects(prev => {
      const updated = prev.map(project => 
        project.id === id 
          ? { ...project, ...updates, lastEdited: new Date() }
          : project
      );
      saveProjectsToStorage(updated);
      return updated;
    });
    
    // Update current project if it's the one being updated
    if (currentProject?.id === id) {
      setCurrentProject(prev => prev ? { ...prev, ...updates, lastEdited: new Date() } : null);
    }
    
    setLoading(false);
  }, [currentProject]);

  const deleteProject = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    
    setProjects(prev => {
      const updated = prev.filter(project => project.id !== id);
      saveProjectsToStorage(updated);
      return updated;
    });
    
    // Clear current project if it's the one being deleted
    if (currentProject?.id === id) {
      setCurrentProject(null);
    }
    
    setLoading(false);
  }, [currentProject]);

  const createDocument = useCallback(async (projectId: string, data: CreateDocumentData): Promise<ProjectDocument> => {
    setLoading(true);
    
    const newDocument: ProjectDocument = {
      id: crypto.randomUUID(),
      title: data.title,
      content: data.content || '',
      parentId: data.parentId || null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setProjects(prev => {
      const updated = prev.map(project => 
        project.id === projectId 
          ? { 
              ...project, 
              documents: [...project.documents, newDocument],
              lastEdited: new Date()
            }
          : project
      );
      saveProjectsToStorage(updated);
      return updated;
    });

    // Update current project if it's the one being updated
    if (currentProject?.id === projectId) {
      setCurrentProject(prev => prev ? {
        ...prev,
        documents: [...prev.documents, newDocument],
        lastEdited: new Date()
      } : null);
    }
    
    setLoading(false);
    return newDocument;
  }, [currentProject]);

  const updateDocument = useCallback(async (projectId: string, documentId: string, updates: Partial<ProjectDocument>): Promise<void> => {
    setLoading(true);
    
    setProjects(prev => {
      const updated = prev.map(project => 
        project.id === projectId 
          ? {
              ...project,
              documents: project.documents.map(doc =>
                doc.id === documentId
                  ? { ...doc, ...updates, updatedAt: Date.now() }
                  : doc
              ),
              lastEdited: new Date()
            }
          : project
      );
      saveProjectsToStorage(updated);
      return updated;
    });

    // Update current project if it's the one being updated
    if (currentProject?.id === projectId) {
      setCurrentProject(prev => prev ? {
        ...prev,
        documents: prev.documents.map(doc =>
          doc.id === documentId
            ? { ...doc, ...updates, updatedAt: Date.now() }
            : doc
        ),
        lastEdited: new Date()
      } : null);
    }
    
    setLoading(false);
  }, [currentProject]);

  const deleteDocument = useCallback(async (projectId: string, documentId: string): Promise<void> => {
    setLoading(true);
    
    setProjects(prev => {
      const updated = prev.map(project => 
        project.id === projectId 
          ? {
              ...project,
              documents: project.documents.filter(doc => doc.id !== documentId),
              lastEdited: new Date()
            }
          : project
      );
      saveProjectsToStorage(updated);
      return updated;
    });

    // Update current project if it's the one being updated
    if (currentProject?.id === projectId) {
      setCurrentProject(prev => prev ? {
        ...prev,
        documents: prev.documents.filter(doc => doc.id !== documentId),
        lastEdited: new Date()
      } : null);
    }
    
    setLoading(false);
  }, [currentProject]);

  const getDocument = useCallback((projectId: string, documentId: string): ProjectDocument | null => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return null;
    
    return project.documents.find(doc => doc.id === documentId) || null;
  }, [projects]);

  const createFolder = useCallback(async (projectId: string, data: CreateFolderData): Promise<ProjectFolder> => {
    setLoading(true);
    
    const newFolder: ProjectFolder = {
      id: crypto.randomUUID(),
      name: data.name,
      parentId: data.parentId || null,
      isExpanded: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setProjects(prev => {
      const updated = prev.map(project => 
        project.id === projectId 
          ? { 
              ...project, 
              folders: [...project.folders, newFolder],
              lastEdited: new Date()
            }
          : project
      );
      saveProjectsToStorage(updated);
      return updated;
    });

    // Update current project if it's the one being updated
    if (currentProject?.id === projectId) {
      setCurrentProject(prev => prev ? {
        ...prev,
        folders: [...prev.folders, newFolder],
        lastEdited: new Date()
      } : null);
    }
    
    setLoading(false);
    return newFolder;
  }, [currentProject]);

  const updateFolder = useCallback(async (projectId: string, folderId: string, updates: Partial<ProjectFolder>): Promise<void> => {
    setLoading(true);
    
    setProjects(prev => {
      const updated = prev.map(project => 
        project.id === projectId 
          ? {
              ...project,
              folders: project.folders.map(folder =>
                folder.id === folderId
                  ? { ...folder, ...updates, updatedAt: Date.now() }
                  : folder
              ),
              lastEdited: new Date()
            }
          : project
      );
      saveProjectsToStorage(updated);
      return updated;
    });

    // Update current project if it's the one being updated
    if (currentProject?.id === projectId) {
      setCurrentProject(prev => prev ? {
        ...prev,
        folders: prev.folders.map(folder =>
          folder.id === folderId
            ? { ...folder, ...updates, updatedAt: Date.now() }
            : folder
        ),
        lastEdited: new Date()
      } : null);
    }
    
    setLoading(false);
  }, [currentProject]);

  const deleteFolder = useCallback(async (projectId: string, folderId: string): Promise<void> => {
    setLoading(true);
    
    setProjects(prev => {
      const updated = prev.map(project => 
        project.id === projectId 
          ? {
              ...project,
              folders: project.folders.filter(folder => folder.id !== folderId),
              // Also remove any documents that were in this folder
              documents: project.documents.map(doc => 
                doc.parentId === folderId ? { ...doc, parentId: null } : doc
              ),
              lastEdited: new Date()
            }
          : project
      );
      saveProjectsToStorage(updated);
      return updated;
    });

    // Update current project if it's the one being updated
    if (currentProject?.id === projectId) {
      setCurrentProject(prev => prev ? {
        ...prev,
        folders: prev.folders.filter(folder => folder.id !== folderId),
        documents: prev.documents.map(doc => 
          doc.parentId === folderId ? { ...doc, parentId: null } : doc
        ),
        lastEdited: new Date()
      } : null);
    }
    
    setLoading(false);
  }, [currentProject]);

  const toggleFolder = useCallback(async (projectId: string, folderId: string): Promise<void> => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    const folder = project.folders.find(f => f.id === folderId);
    if (!folder) return;
    
    await updateFolder(projectId, folderId, { isExpanded: !folder.isExpanded });
  }, [projects, updateFolder]);

  const value: ProjectContextType = {
    projects,
    currentProject,
    loading,
    createProject,
    getProject,
    updateProject,
    deleteProject,
    setCurrentProject,
    createDocument,
    updateDocument,
    deleteDocument,
    getDocument,
    createFolder,
    updateFolder,
    deleteFolder,
    toggleFolder,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};