/**
 * Property-based tests for Noctuary Context
 * Feature: noctuary-editor-redesign
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ReactNode } from 'react';
import * as fc from 'fast-check';
import { NoctuaryProvider, useNoctuary } from './NoctuaryContext';

// Wrapper component for testing hooks
function wrapper({ children }: { children: ReactNode }) {
  return <NoctuaryProvider>{children}</NoctuaryProvider>;
}

describe('NoctuaryContext Property Tests', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  /**
   * Feature: noctuary-editor-redesign, Property 1: Document consistency across switches
   * Validates: Requirements 1.3
   * 
   * Property: For any sequence of document switches, the editor should always display
   * the correct content for the currently active document without mixing content from
   * previous documents.
   */
  it('Property 1: Document consistency across switches', () => {
    fc.assert(
      fc.property(
        // Generate an array of document contents (strings)
        fc.array(
          fc.record({
            title: fc.string({ minLength: 1, maxLength: 50 }),
            content: fc.string({ minLength: 0, maxLength: 500 }),
          }),
          { minLength: 2, maxLength: 10 }
        ),
        // Generate a sequence of document indices to switch between
        (documentData) => {
          const { result } = renderHook(() => useNoctuary(), { wrapper });

          // Create documents
          const documentIds: string[] = [];
          act(() => {
            documentData.forEach((data) => {
              const id = result.current.createDocument();
              documentIds.push(id);
              result.current.updateDocument(id, {
                title: data.title,
                content: data.content,
              });
            });
          });

          // Generate a sequence of switches (indices into documentIds array)
          const switchSequence = fc.sample(
            fc.integer({ min: 0, max: documentIds.length - 1 }),
            Math.min(20, documentIds.length * 3)
          );

          // Perform switches and verify consistency
          switchSequence.forEach((index) => {
            const expectedDocId = documentIds[index];
            const expectedContent = documentData[index].content;
            const expectedTitle = documentData[index].title;

            act(() => {
              result.current.setActiveDocument(expectedDocId);
            });

            // Verify the active document ID is correct
            expect(result.current.activeDocumentId).toBe(expectedDocId);

            // Verify the document content matches what we set
            const activeDoc = result.current.documents.find(
              (d) => d.id === expectedDocId
            );
            expect(activeDoc).toBeDefined();
            expect(activeDoc?.content).toBe(expectedContent);
            expect(activeDoc?.title).toBe(expectedTitle);

            // Verify no content mixing - the content should be exactly what we set
            // The key invariant is that the content matches exactly, not that it's different
            // from other documents (since documents could legitimately have the same content)
          });
        }
      ),
      { numRuns: 100 } // Run 100 iterations as specified in design doc
    );
  });

  it('Property 1 (edge case): Switching to null and back maintains document state', () => {
    fc.assert(
      fc.property(
        fc.record({
          title: fc.string({ minLength: 1, maxLength: 50 }),
          content: fc.string({ minLength: 1, maxLength: 500 }),
        }),
        (documentData) => {
          const { result } = renderHook(() => useNoctuary(), { wrapper });

          // Create a document
          let documentId = '';
          act(() => {
            documentId = result.current.createDocument();
            result.current.updateDocument(documentId, {
              title: documentData.title,
              content: documentData.content,
            });
          });

          // Switch to null (no active document)
          act(() => {
            result.current.setActiveDocument(null);
          });

          expect(result.current.activeDocumentId).toBe(null);

          // Switch back to the document
          act(() => {
            result.current.setActiveDocument(documentId);
          });

          // Verify the document content is unchanged
          expect(result.current.activeDocumentId).toBe(documentId);
          const activeDoc = result.current.documents.find(
            (d) => d.id === documentId
          );
          expect(activeDoc?.content).toBe(documentData.content);
          expect(activeDoc?.title).toBe(documentData.title);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 1 (edge case): Rapid document switches maintain consistency', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            title: fc.string({ minLength: 1, maxLength: 50 }),
            content: fc.string({ minLength: 1, maxLength: 500 }),
          }),
          { minLength: 3, maxLength: 5 }
        ),
        (documentData) => {
          const { result } = renderHook(() => useNoctuary(), { wrapper });

          // Create documents
          const documentIds: string[] = [];
          act(() => {
            documentData.forEach((data) => {
              const id = result.current.createDocument();
              documentIds.push(id);
              result.current.updateDocument(id, {
                title: data.title,
                content: data.content,
              });
            });
          });

          // Perform rapid switches (all documents in sequence, multiple times)
          for (let round = 0; round < 3; round++) {
            documentIds.forEach((docId, index) => {
              act(() => {
                result.current.setActiveDocument(docId);
              });

              // Verify consistency after each switch
              expect(result.current.activeDocumentId).toBe(docId);
              const activeDoc = result.current.documents.find(
                (d) => d.id === docId
              );
              expect(activeDoc?.content).toBe(documentData[index].content);
              expect(activeDoc?.title).toBe(documentData[index].title);
            });
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
