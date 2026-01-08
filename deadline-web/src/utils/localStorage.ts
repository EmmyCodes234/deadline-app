/**
 * LocalStorage persistence layer for Noctuary Editor
 * Handles saving, loading, and error handling for document storage
 */

import type { Document, EditorSettings } from '../types/noctuary';

// Storage keys
export const STORAGE_KEYS = {
  DOCUMENTS: 'noctuary:documents',
  SETTINGS: 'noctuary:settings',
  ACTIVE_DOCUMENT_ID: 'noctuary:activeDocumentId',
} as const;

// Storage quota threshold (in bytes) - warn when 80% full
const QUOTA_WARNING_THRESHOLD = 0.8;

/**
 * Error types for storage operations
 */
export class StorageQuotaExceededError extends Error {
  constructor(message: string = 'Storage quota exceeded') {
    super(message);
    this.name = 'StorageQuotaExceededError';
  }
}

export class StorageUnavailableError extends Error {
  constructor(message: string = 'LocalStorage is unavailable') {
    super(message);
    this.name = 'StorageUnavailableError';
  }
}

/**
 * Check if LocalStorage is available
 */
export function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Get storage quota information
 * Returns null if StorageManager API is not available
 */
export async function getStorageQuota(): Promise<{
  usage: number;
  quota: number;
  percentUsed: number;
} | null> {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    try {
      const estimate = await navigator.storage.estimate();
      const usage = estimate.usage || 0;
      const quota = estimate.quota || 0;
      const percentUsed = quota > 0 ? usage / quota : 0;

      return { usage, quota, percentUsed };
    } catch (e) {
      console.error('Failed to estimate storage quota:', e);
      return null;
    }
  }
  return null;
}

/**
 * Check if storage is approaching quota limit
 */
export async function isStorageNearQuota(): Promise<boolean> {
  const quota = await getStorageQuota();
  if (!quota) return false;
  return quota.percentUsed >= QUOTA_WARNING_THRESHOLD;
}

/**
 * Save data to LocalStorage with error handling
 */
export function saveToStorage<T>(key: string, data: T): void {
  if (!isStorageAvailable()) {
    throw new StorageUnavailableError();
  }

  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);
  } catch (error) {
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      throw new StorageQuotaExceededError();
    }
    throw error;
  }
}

/**
 * Load data from LocalStorage with error handling
 */
export function loadFromStorage<T>(key: string): T | null {
  if (!isStorageAvailable()) {
    throw new StorageUnavailableError();
  }

  try {
    const serialized = localStorage.getItem(key);
    if (serialized === null) {
      return null;
    }
    return JSON.parse(serialized) as T;
  } catch (error) {
    console.error(`Failed to load from storage (key: ${key}):`, error);
    return null;
  }
}

/**
 * Delete data from LocalStorage
 */
export function deleteFromStorage(key: string): void {
  if (!isStorageAvailable()) {
    throw new StorageUnavailableError();
  }

  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to delete from storage (key: ${key}):`, error);
    throw error;
  }
}

/**
 * Save documents to LocalStorage
 */
export function saveDocuments(documents: Document[]): void {
  saveToStorage(STORAGE_KEYS.DOCUMENTS, documents);
}

/**
 * Load documents from LocalStorage
 */
export function loadDocuments(): Document[] | null {
  return loadFromStorage<Document[]>(STORAGE_KEYS.DOCUMENTS);
}

/**
 * Save settings to LocalStorage
 */
export function saveSettings(settings: EditorSettings): void {
  saveToStorage(STORAGE_KEYS.SETTINGS, settings);
}

/**
 * Load settings from LocalStorage
 */
export function loadSettings(): EditorSettings | null {
  return loadFromStorage<EditorSettings>(STORAGE_KEYS.SETTINGS);
}

/**
 * Save active document ID to LocalStorage
 */
export function saveActiveDocumentId(id: string | null): void {
  saveToStorage(STORAGE_KEYS.ACTIVE_DOCUMENT_ID, id);
}

/**
 * Load active document ID from LocalStorage
 */
export function loadActiveDocumentId(): string | null {
  return loadFromStorage<string | null>(STORAGE_KEYS.ACTIVE_DOCUMENT_ID);
}

/**
 * Clear all Noctuary data from LocalStorage
 */
export function clearAllStorage(): void {
  deleteFromStorage(STORAGE_KEYS.DOCUMENTS);
  deleteFromStorage(STORAGE_KEYS.SETTINGS);
  deleteFromStorage(STORAGE_KEYS.ACTIVE_DOCUMENT_ID);
}

/**
 * Migration utilities for importing from old editor formats
 */

/**
 * Old GrimoireEditor format (if it exists)
 */
interface OldGrimoireDocument {
  id?: string;
  title?: string;
  content?: string;
  timestamp?: number;
}

/**
 * Old NoctuaryEditor format (if it exists)
 */
interface OldNoctuaryDocument {
  id?: string;
  name?: string;
  text?: string;
  created?: number;
}

/**
 * Migrate documents from old editor formats to new unified format
 * Checks for old storage keys and converts them to new format
 */
export function migrateFromOldFormats(): Document[] {
  const migratedDocuments: Document[] = [];

  // Try to migrate from old Grimoire format
  try {
    const oldGrimoireData = localStorage.getItem('grimoire:documents');
    if (oldGrimoireData) {
      const oldDocs = JSON.parse(oldGrimoireData) as OldGrimoireDocument[];
      oldDocs.forEach((oldDoc) => {
        if (oldDoc.content || oldDoc.title) {
          const newDoc: Document = {
            id: oldDoc.id || crypto.randomUUID(),
            title: oldDoc.title || 'Untitled (Migrated)',
            content: oldDoc.content || '',
            folderId: null,
            tags: ['migrated', 'grimoire'],
            wordGoal: null,
            synopsis: '',
            snapshots: [],
            createdAt: oldDoc.timestamp || Date.now(),
            updatedAt: Date.now(),
          };
          migratedDocuments.push(newDoc);
        }
      });
      console.log(`Migrated ${migratedDocuments.length} documents from Grimoire format`);
    }
  } catch (error) {
    console.error('Failed to migrate from Grimoire format:', error);
  }

  // Try to migrate from old Noctuary format
  try {
    const oldNoctuaryData = localStorage.getItem('noctuary:old:documents');
    if (oldNoctuaryData) {
      const oldDocs = JSON.parse(oldNoctuaryData) as OldNoctuaryDocument[];
      oldDocs.forEach((oldDoc) => {
        if (oldDoc.text || oldDoc.name) {
          const newDoc: Document = {
            id: oldDoc.id || crypto.randomUUID(),
            title: oldDoc.name || 'Untitled (Migrated)',
            content: oldDoc.text || '',
            folderId: null,
            tags: ['migrated', 'noctuary-old'],
            wordGoal: null,
            synopsis: '',
            snapshots: [],
            createdAt: oldDoc.created || Date.now(),
            updatedAt: Date.now(),
          };
          migratedDocuments.push(newDoc);
        }
      });
      console.log(`Migrated ${oldDocs.length} documents from old Noctuary format`);
    }
  } catch (error) {
    console.error('Failed to migrate from old Noctuary format:', error);
  }

  return migratedDocuments;
}

/**
 * Check if migration is needed
 * Returns true if old format data exists and new format is empty
 */
export function needsMigration(): boolean {
  const currentDocuments = loadDocuments();
  const hasCurrentData = currentDocuments && currentDocuments.length > 0;
  
  if (hasCurrentData) {
    return false; // Already have data in new format
  }

  // Check for old format data
  const hasOldGrimoire = localStorage.getItem('grimoire:documents') !== null;
  const hasOldNoctuary = localStorage.getItem('noctuary:old:documents') !== null;

  return hasOldGrimoire || hasOldNoctuary;
}

/**
 * Perform migration if needed and return documents
 * This should be called on app initialization
 */
export function initializeStorage(): Document[] {
  if (needsMigration()) {
    console.log('Migration needed, importing from old formats...');
    const migratedDocs = migrateFromOldFormats();
    
    if (migratedDocs.length > 0) {
      saveDocuments(migratedDocs);
      console.log(`Migration complete: ${migratedDocs.length} documents imported`);
    }
    
    return migratedDocs;
  }

  // Load existing documents
  const existingDocs = loadDocuments();
  return existingDocs || [];
}
