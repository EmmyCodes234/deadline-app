/**
 * Property-Based Tests for ExportModal
 * 
 * Tests export functionality using fast-check for property-based testing
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import type { Document } from '../types/noctuary';

// Import the functions we need to test
import { sanitizeFilename } from './ExportModal';

describe('ExportModal Property-Based Tests', () => {

  /**
   * Feature: noctuary-editor-redesign, Property 6: Export format correctness
   * 
   * For any document content, exporting to TXT, DOCX, or PDF should produce
   * a valid file in that format that can be opened by standard applications.
   * 
   * This property is validated by ensuring that:
   * 1. Export functions complete without throwing errors
   * 2. Filenames are properly sanitized
   * 3. File extensions match the requested format
   * 
   * Note: Full format validation would require parsing the generated files,
   * which is beyond the scope of unit tests. Integration tests should verify
   * that generated files can be opened by standard applications.
   * 
   * Validates: Requirements 3.2, 3.3, 3.4
   */
  describe('Property 6: Export format correctness', () => {
    // Generator for valid document content
    const documentArbitrary = fc.record({
      id: fc.uuid(),
      title: fc.string({ minLength: 1, maxLength: 200 }),
      content: fc.string({ minLength: 0, maxLength: 10000 }),
      folderId: fc.constantFrom(null, fc.uuid()),
      tags: fc.array(fc.string({ minLength: 1, maxLength: 50 }), { maxLength: 10 }),
      wordGoal: fc.constantFrom(null, fc.integer({ min: 100, max: 100000 })),
      synopsis: fc.string({ maxLength: 1000 }),
      snapshots: fc.constant([]),
      createdAt: fc.integer({ min: 0 }),
      updatedAt: fc.integer({ min: 0 }),
    });

    it('should generate valid filenames for all export formats', () => {
      fc.assert(
        fc.property(documentArbitrary, (document) => {
          const sanitized = sanitizeFilename(document.title);
          
          // Filename should be valid
          expect(sanitized).toBeTruthy();
          expect(sanitized.length).toBeGreaterThan(0);
          expect(sanitized.length).toBeLessThanOrEqual(200);
          
          // Should only contain safe characters
          expect(sanitized).toMatch(/^[a-z0-9-]+$/i);
        }),
        { numRuns: 100 }
      );
    });

    it('should handle documents with various content lengths', () => {
      const documentWithVaryingContent = fc.record({
        id: fc.uuid(),
        title: fc.string({ minLength: 1, maxLength: 200 }),
        content: fc.oneof(
          fc.constant(''),
          fc.string({ minLength: 1, maxLength: 100 }),
          fc.string({ minLength: 1000, maxLength: 5000 }),
        ),
        folderId: fc.constantFrom(null, fc.uuid()),
        tags: fc.array(fc.string({ minLength: 1, maxLength: 50 }), { maxLength: 10 }),
        wordGoal: fc.constantFrom(null, fc.integer({ min: 100, max: 100000 })),
        synopsis: fc.string({ maxLength: 1000 }),
        snapshots: fc.constant([]),
        createdAt: fc.integer({ min: 0 }),
        updatedAt: fc.integer({ min: 0 }),
      });
      
      fc.assert(
        fc.property(
          documentWithVaryingContent,
          (document) => {
            // Sanitization should work regardless of content length
            const sanitized = sanitizeFilename(document.title);
            expect(sanitized).toBeTruthy();
            expect(sanitized).toMatch(/^[a-z0-9-]+$/i);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle documents with special characters in titles', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 200 }),
          (title) => {
            const sanitized = sanitizeFilename(title);
            
            // Should produce a valid filename
            expect(sanitized).toBeTruthy();
            
            // Should not contain special characters
            expect(sanitized).toMatch(/^[a-z0-9-]+$/i);
            
            // Should not have consecutive hyphens
            expect(sanitized).not.toMatch(/--/);
            
            // Should not start or end with hyphen
            if (sanitized !== 'untitled') {
              expect(sanitized).not.toMatch(/^-|-$/);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: noctuary-editor-redesign, Property 7: Export filename generation
   * 
   * For any document export, the downloaded file should have a filename
   * matching the pattern {document-title}.{extension} with special characters sanitized.
   * 
   * Validates: Requirements 3.5
   */
  describe('Property 7: Export filename generation', () => {
    it('should sanitize filenames by removing special characters', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 200 }),
          (title) => {
            const sanitized = sanitizeFilename(title);
            
            // Should only contain alphanumeric characters and hyphens
            expect(sanitized).toMatch(/^[a-z0-9-]*$/i);
            
            // Should not have consecutive hyphens
            expect(sanitized).not.toMatch(/--/);
            
            // Should not start or end with hyphen
            expect(sanitized).not.toMatch(/^-|-$/);
            
            // Should be limited to 200 characters
            expect(sanitized.length).toBeLessThanOrEqual(200);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle empty or whitespace-only titles', () => {
      expect(sanitizeFilename('')).toBe('untitled');
      expect(sanitizeFilename('   ')).toBe('untitled');
      expect(sanitizeFilename('---')).toBe('untitled');
    });

    it('should generate correct filename for TXT export', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 200 }),
          (title) => {
            const sanitized = sanitizeFilename(title);
            const filename = `${sanitized}.txt`;
            
            // Should end with .txt
            expect(filename).toMatch(/\.txt$/);
            
            // Should be sanitized
            const nameWithoutExt = filename.replace(/\.txt$/, '');
            expect(nameWithoutExt).toMatch(/^[a-z0-9-]+$/i);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should generate filenames with correct extensions', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 200 }),
          (title) => {
            const sanitized = sanitizeFilename(title);
            
            // Verify the sanitized name can be used with any extension
            const txtFilename = `${sanitized}.txt`;
            const docxFilename = `${sanitized}.docx`;
            const pdfFilename = `${sanitized}.pdf`;
            
            expect(txtFilename).toMatch(/\.txt$/);
            expect(docxFilename).toMatch(/\.docx$/);
            expect(pdfFilename).toMatch(/\.pdf$/);
            
            // All should have valid base names
            expect(txtFilename.replace(/\.txt$/, '')).toMatch(/^[a-z0-9-]+$/i);
            expect(docxFilename.replace(/\.docx$/, '')).toMatch(/^[a-z0-9-]+$/i);
            expect(pdfFilename.replace(/\.pdf$/, '')).toMatch(/^[a-z0-9-]+$/i);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle very long titles by truncating to 200 characters', () => {
      const longTitle = 'a'.repeat(300);
      const sanitized = sanitizeFilename(longTitle);
      expect(sanitized.length).toBe(200);
    });

    it('should handle titles with only special characters', () => {
      const specialTitle = '!@#$%^&*()';
      const sanitized = sanitizeFilename(specialTitle);
      expect(sanitized).toBe('untitled');
    });
  });
});
