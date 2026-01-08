/**
 * Property-based tests for LocalStorage persistence layer
 * Feature: noctuary-editor-redesign
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import {
  saveDocuments,
  loadDocuments,
  saveSettings,
  loadSettings,
  saveActiveDocumentId,
  loadActiveDocumentId,
  clearAllStorage,
  isStorageAvailable,
  StorageQuotaExceededError,
  StorageUnavailableError,
} from './localStorage';
import type { Document, EditorSettings } from '../types/noctuary';

describe('LocalStorage Persistence Layer', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    // Clean up after each test
    localStorage.clear();
  });

  describe('Storage Availability', () => {
    it('should detect that localStorage is available', () => {
      expect(isStorageAvailable()).toBe(true);
    });
  });

  describe('**Feature: noctuary-editor-redesign, Property 5: Document persistence round-trip**', () => {
    /**
     * Property 5: Document persistence round-trip
     * For any set of documents saved to local storage, restarting the application 
     * should restore all documents with identical content, metadata, and structure.
     * Validates: Requirements 2.5
     */
    it('should round-trip documents through localStorage preserving all data', () => {
      fc.assert(
        fc.property(
          // Generate arbitrary documents
          fc.array(
            fc.record({
              id: fc.uuid(),
              title: fc.string({ minLength: 0, maxLength: 200 }),
              content: fc.string({ minLength: 0, maxLength: 5000 }),
              folderId: fc.oneof(fc.constant(null), fc.uuid()),
              tags: fc.array(fc.string({ minLength: 1, maxLength: 50 }), { maxLength: 10 }),
              wordGoal: fc.oneof(fc.constant(null), fc.integer({ min: 1, max: 100000 })),
              synopsis: fc.string({ minLength: 0, maxLength: 1000 }),
              snapshots: fc.array(
                fc.record({
                  id: fc.uuid(),
                  content: fc.string({ minLength: 0, maxLength: 1000 }),
                  wordCount: fc.integer({ min: 0, max: 1000 }),
                  timestamp: fc.integer({ min: 0, max: Date.now() }),
                }),
                { maxLength: 5 }
              ),
              createdAt: fc.integer({ min: 0, max: Date.now() }),
              updatedAt: fc.integer({ min: 0, max: Date.now() }),
            }),
            { minLength: 0, maxLength: 20 }
          ),
          (documents) => {
            // Save documents to localStorage
            saveDocuments(documents);

            // Load documents from localStorage
            const loadedDocuments = loadDocuments();

            // Verify round-trip preserves all data
            expect(loadedDocuments).toEqual(documents);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should round-trip settings through localStorage preserving all data', () => {
      fc.assert(
        fc.property(
          // Generate arbitrary settings
          fc.record({
            fontFamily: fc.constantFrom(
              'IM Fell English',
              'Crimson Text',
              'Georgia',
              'Times New Roman'
            ),
            fontSize: fc.integer({ min: 12, max: 24 }),
            lineHeight: fc.double({ min: 1.2, max: 2.0, noNaN: true }),
            editorWidth: fc.integer({ min: 60, max: 80 }),
            theme: fc.constantFrom('dark', 'light'),
          }),
          (settings) => {
            // Save settings to localStorage
            saveSettings(settings as EditorSettings);

            // Load settings from localStorage
            const loadedSettings = loadSettings();

            // Verify round-trip preserves all data
            expect(loadedSettings).toEqual(settings);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should round-trip active document ID through localStorage', () => {
      fc.assert(
        fc.property(
          // Generate arbitrary document ID or null
          fc.oneof(fc.constant(null), fc.uuid()),
          (documentId) => {
            // Save active document ID to localStorage
            saveActiveDocumentId(documentId);

            // Load active document ID from localStorage
            const loadedId = loadActiveDocumentId();

            // Verify round-trip preserves the ID
            expect(loadedId).toEqual(documentId);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle empty document arrays correctly', () => {
      const emptyDocs: Document[] = [];
      saveDocuments(emptyDocs);
      const loaded = loadDocuments();
      expect(loaded).toEqual(emptyDocs);
    });

    it('should return null when loading non-existent data', () => {
      expect(loadDocuments()).toBeNull();
      expect(loadSettings()).toBeNull();
      expect(loadActiveDocumentId()).toBeNull();
    });

    it('should preserve document structure with nested snapshots', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              id: fc.uuid(),
              title: fc.string({ maxLength: 200 }),
              content: fc.string({ maxLength: 1000 }),
              folderId: fc.constant(null),
              tags: fc.array(fc.string({ minLength: 1, maxLength: 20 }), { maxLength: 5 }),
              wordGoal: fc.constant(null),
              synopsis: fc.string({ maxLength: 500 }),
              snapshots: fc.array(
                fc.record({
                  id: fc.uuid(),
                  content: fc.string({ maxLength: 500 }),
                  wordCount: fc.integer({ min: 0, max: 100 }),
                  timestamp: fc.integer({ min: 0, max: Date.now() }),
                }),
                { minLength: 1, maxLength: 3 }
              ),
              createdAt: fc.integer({ min: 0, max: Date.now() }),
              updatedAt: fc.integer({ min: 0, max: Date.now() }),
            }),
            { minLength: 1, maxLength: 5 }
          ),
          (documents) => {
            saveDocuments(documents);
            const loaded = loadDocuments();

            // Verify snapshots are preserved
            expect(loaded).toEqual(documents);
            loaded?.forEach((doc, index) => {
              expect(doc.snapshots).toEqual(documents[index].snapshots);
              expect(doc.snapshots.length).toBe(documents[index].snapshots.length);
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve special characters in document content', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 0, maxLength: 1000 }),
          (content) => {
            const doc: Document = {
              id: crypto.randomUUID(),
              title: 'Test',
              content,
              folderId: null,
              tags: [],
              wordGoal: null,
              synopsis: '',
              snapshots: [],
              createdAt: Date.now(),
              updatedAt: Date.now(),
            };

            saveDocuments([doc]);
            const loaded = loadDocuments();

            expect(loaded).not.toBeNull();
            expect(loaded![0].content).toBe(content);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle various string content including unicode', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 0, maxLength: 200 }),
          fc.string({ minLength: 0, maxLength: 1000 }),
          fc.string({ minLength: 0, maxLength: 500 }),
          (title, content, synopsis) => {
            const doc: Document = {
              id: crypto.randomUUID(),
              title,
              content,
              folderId: null,
              tags: [],
              wordGoal: null,
              synopsis,
              snapshots: [],
              createdAt: Date.now(),
              updatedAt: Date.now(),
            };

            saveDocuments([doc]);
            const loaded = loadDocuments();

            expect(loaded).not.toBeNull();
            expect(loaded![0].title).toBe(title);
            expect(loaded![0].content).toBe(content);
            expect(loaded![0].synopsis).toBe(synopsis);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle corrupted data gracefully', () => {
      // Manually set corrupted data
      localStorage.setItem('noctuary:documents', 'invalid json {{{');
      
      const loaded = loadDocuments();
      expect(loaded).toBeNull();
    });

    it('should clear all storage correctly', () => {
      const docs: Document[] = [{
        id: crypto.randomUUID(),
        title: 'Test',
        content: 'Content',
        folderId: null,
        tags: [],
        wordGoal: null,
        synopsis: '',
        snapshots: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }];

      saveDocuments(docs);
      saveActiveDocumentId('test-id');

      clearAllStorage();

      expect(loadDocuments()).toBeNull();
      expect(loadActiveDocumentId()).toBeNull();
    });
  });
});
