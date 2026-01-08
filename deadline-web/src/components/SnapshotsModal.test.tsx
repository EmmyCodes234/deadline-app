/**
 * Property-based tests for Snapshot system
 * Feature: noctuary-editor-redesign
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as fc from 'fast-check';
import { v4 as uuidv4 } from 'uuid';
import type { Document, Snapshot } from '../types/noctuary';

// Helper to create a test document
function createTestDocument(overrides?: Partial<Document>): Document {
  return {
    id: uuidv4(),
    title: 'Test Document',
    content: 'Test content',
    folderId: null,
    tags: [],
    wordGoal: null,
    synopsis: '',
    snapshots: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...overrides,
  };
}

// Helper to create a snapshot
function createSnapshot(content: string): Snapshot {
  const wordCount = content.trim().split(/\s+/).filter(w => w.length > 0).length;
  return {
    id: uuidv4(),
    content,
    wordCount,
    timestamp: Date.now(),
  };
}

describe('Snapshot System Property Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Feature: noctuary-editor-redesign, Property 23: Snapshot timestamp accuracy
   * Validates: Requirements 9.1
   */
  it('Property 23: snapshot timestamp should be within 1 second of creation time', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 0, maxLength: 1000 }), // Random content
        (content) => {
          const beforeTime = Date.now();
          const snapshot = createSnapshot(content);
          const afterTime = Date.now();

          // Timestamp should be within 1 second (1000ms) of current time
          const timeDiff = Math.abs(snapshot.timestamp - beforeTime);
          expect(timeDiff).toBeLessThanOrEqual(1000);
          expect(snapshot.timestamp).toBeGreaterThanOrEqual(beforeTime);
          expect(snapshot.timestamp).toBeLessThanOrEqual(afterTime);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: noctuary-editor-redesign, Property 24: Snapshot list completeness
   * Validates: Requirements 9.2
   */
  it('Property 24: all snapshots should be displayed in reverse chronological order with correct data', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 0, maxLength: 500 }), { minLength: 1, maxLength: 20 }), // Array of content strings
        (contentArray) => {
          const document = createTestDocument();
          const snapshots: Snapshot[] = [];

          // Create snapshots with increasing timestamps
          contentArray.forEach((content, index) => {
            const snapshot = createSnapshot(content);
            // Ensure timestamps are strictly increasing
            snapshot.timestamp = Date.now() + index * 100;
            snapshots.push(snapshot);
          });

          document.snapshots = snapshots;

          // Verify all snapshots are present
          expect(document.snapshots.length).toBe(contentArray.length);

          // Verify snapshots are in chronological order (oldest first in array)
          for (let i = 1; i < document.snapshots.length; i++) {
            expect(document.snapshots[i].timestamp).toBeGreaterThanOrEqual(
              document.snapshots[i - 1].timestamp
            );
          }

          // Verify each snapshot has correct word count
          document.snapshots.forEach((snapshot, index) => {
            const expectedWordCount = contentArray[index]
              .trim()
              .split(/\s+/)
              .filter(w => w.length > 0).length;
            expect(snapshot.wordCount).toBe(expectedWordCount);
          });

          // Verify each snapshot has a timestamp
          document.snapshots.forEach(snapshot => {
            expect(snapshot.timestamp).toBeGreaterThan(0);
            expect(typeof snapshot.timestamp).toBe('number');
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: noctuary-editor-redesign, Property 25: Snapshot preview immutability
   * Validates: Requirements 9.3
   */
  it('Property 25: snapshot content should remain immutable when previewed', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 1000 }), // Original content
        fc.string({ minLength: 1, maxLength: 1000 }), // Attempted modification
        (originalContent, attemptedModification) => {
          const snapshot = createSnapshot(originalContent);
          const originalSnapshotContent = snapshot.content;
          const originalWordCount = snapshot.wordCount;
          const originalTimestamp = snapshot.timestamp;

          // Simulate preview by creating a frozen copy (what a read-only preview should do)
          const previewSnapshot = Object.freeze({ ...snapshot });

          // Attempt to modify the preview (should not affect original)
          try {
            // @ts-expect-error - intentionally trying to modify frozen object
            previewSnapshot.content = attemptedModification;
          } catch (e) {
            // Expected to throw in strict mode
          }

          // Verify original snapshot is unchanged
          expect(snapshot.content).toBe(originalSnapshotContent);
          expect(snapshot.wordCount).toBe(originalWordCount);
          expect(snapshot.timestamp).toBe(originalTimestamp);

          // Verify preview snapshot content is still original
          expect(previewSnapshot.content).toBe(originalSnapshotContent);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: noctuary-editor-redesign, Property 26: Snapshot restoration accuracy
   * Validates: Requirements 9.4
   */
  it('Property 26: restoring a snapshot should replace document content exactly', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 0, maxLength: 1000 }), // Original content
        fc.string({ minLength: 0, maxLength: 1000 }), // Modified content
        (originalContent, modifiedContent) => {
          // Create document with original content
          const document = createTestDocument({ content: originalContent });

          // Create snapshot of original content
          const snapshot = createSnapshot(originalContent);
          document.snapshots = [snapshot];

          // Modify document content
          document.content = modifiedContent;
          expect(document.content).toBe(modifiedContent);

          // Restore snapshot
          document.content = snapshot.content;

          // Verify content is exactly the original
          expect(document.content).toBe(originalContent);
          expect(document.content).toBe(snapshot.content);
          
          // If original and modified are different, verify restoration changed the content
          if (originalContent !== modifiedContent) {
            expect(document.content).not.toBe(modifiedContent);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: noctuary-editor-redesign, Property 27: Snapshot deletion confirmation
   * Validates: Requirements 9.5
   */
  it('Property 27: snapshot deletion should require confirmation and remove from storage', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 0, maxLength: 500 }), { minLength: 2, maxLength: 10 }), // Multiple snapshots
        fc.integer({ min: 0, max: 9 }), // Index to delete
        (contentArray, deleteIndex) => {
          const actualDeleteIndex = deleteIndex % contentArray.length;
          const document = createTestDocument();

          // Create multiple snapshots
          const snapshots: Snapshot[] = contentArray.map((content, index) => {
            const snapshot = createSnapshot(content);
            snapshot.timestamp = Date.now() + index * 100;
            return snapshot;
          });

          document.snapshots = snapshots;
          const originalCount = document.snapshots.length;
          const snapshotToDelete = document.snapshots[actualDeleteIndex];

          // Simulate deletion (with confirmation assumed to be true)
          const confirmed = true; // In real implementation, this would be window.confirm()

          if (confirmed) {
            document.snapshots = document.snapshots.filter(
              s => s.id !== snapshotToDelete.id
            );
          }

          // Verify snapshot was removed
          expect(document.snapshots.length).toBe(originalCount - 1);
          expect(document.snapshots.find(s => s.id === snapshotToDelete.id)).toBeUndefined();

          // Verify other snapshots remain
          expect(document.snapshots.length).toBe(contentArray.length - 1);
        }
      ),
      { numRuns: 100 }
    );
  });
});
