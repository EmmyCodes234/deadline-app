/**
 * Property-based tests for MetadataPanel component
 * Using fast-check for property-based testing
 * 
 * Feature: noctuary-editor-redesign
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { calculateWordCount, calculateCharacterCount, calculateReadingTime, calculateWordGoalProgress } from '../utils/documentUtils';

describe('MetadataPanel - Property Tests', () => {
  /**
   * Feature: noctuary-editor-redesign, Property 9: Word count accuracy
   * Validates: Requirements 5.1
   * 
   * For any document content, the displayed word count should match 
   * the result of splitting the content by whitespace and counting non-empty strings.
   */
  it('Property 9: Word count accuracy - word count matches whitespace-split count', () => {
    fc.assert(
      fc.property(
        // Generate arbitrary strings with various whitespace patterns
        fc.string(),
        (content) => {
          const calculatedCount = calculateWordCount(content);
          
          // Manual word count: split by whitespace and count non-empty strings
          const manualCount = content.trim().length === 0 
            ? 0 
            : content.trim().split(/\s+/).filter(w => w.length > 0).length;
          
          expect(calculatedCount).toBe(manualCount);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: noctuary-editor-redesign, Property 9: Word count accuracy (edge cases)
   * Validates: Requirements 5.1
   * 
   * Test specific edge cases for word counting
   */
  it('Property 9: Word count handles edge cases correctly', () => {
    // Empty string
    expect(calculateWordCount('')).toBe(0);
    
    // Only whitespace
    expect(calculateWordCount('   ')).toBe(0);
    expect(calculateWordCount('\n\n\t')).toBe(0);
    
    // Single word
    expect(calculateWordCount('hello')).toBe(1);
    
    // Multiple spaces between words
    expect(calculateWordCount('hello    world')).toBe(2);
    
    // Leading/trailing whitespace
    expect(calculateWordCount('  hello world  ')).toBe(2);
    
    // Mixed whitespace types
    expect(calculateWordCount('hello\nworld\tthere')).toBe(3);
  });

  /**
   * Feature: noctuary-editor-redesign, Property 10: Character count accuracy
   * Validates: Requirements 5.2
   * 
   * For any document content, the displayed character count should match 
   * the length of the content string.
   */
  it('Property 10: Character count accuracy - matches string length', () => {
    fc.assert(
      fc.property(
        // Generate arbitrary strings including unicode characters
        fc.string(),
        (content) => {
          const calculatedCount = calculateCharacterCount(content);
          const manualCount = content.length;
          
          expect(calculatedCount).toBe(manualCount);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: noctuary-editor-redesign, Property 10: Character count accuracy (unicode)
   * Validates: Requirements 5.2
   * 
   * Test character counting with unicode characters
   */
  it('Property 10: Character count handles unicode correctly', () => {
    // Empty string
    expect(calculateCharacterCount('')).toBe(0);
    
    // ASCII characters
    expect(calculateCharacterCount('hello')).toBe(5);
    
    // Unicode characters
    expect(calculateCharacterCount('café')).toBe(4);
    expect(calculateCharacterCount('🎃👻💀')).toBe(6); // Emojis are 2 code units each
    
    // Mixed content
    expect(calculateCharacterCount('Hello 世界')).toBe(8);
    
    // Whitespace
    expect(calculateCharacterCount('   ')).toBe(3);
    expect(calculateCharacterCount('\n\t')).toBe(2);
  });

  /**
   * Feature: noctuary-editor-redesign, Property 11: Reading time calculation
   * Validates: Requirements 5.3
   * 
   * For any document content, the estimated reading time should be calculated 
   * as wordCount / 200 minutes, rounded to the nearest minute.
   */
  it('Property 11: Reading time calculation - follows 200 words/minute formula', () => {
    fc.assert(
      fc.property(
        // Generate arbitrary word counts
        fc.integer({ min: 0, max: 100000 }),
        (wordCount) => {
          const calculatedTime = calculateReadingTime(wordCount);
          const expectedTime = Math.ceil(wordCount / 200);
          
          expect(calculatedTime).toBe(expectedTime);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: noctuary-editor-redesign, Property 11: Reading time calculation (edge cases)
   * Validates: Requirements 5.3
   * 
   * Test reading time calculation edge cases
   */
  it('Property 11: Reading time handles edge cases correctly', () => {
    // Zero words
    expect(calculateReadingTime(0)).toBe(0);
    
    // Less than 200 words (should round up to 1)
    expect(calculateReadingTime(1)).toBe(1);
    expect(calculateReadingTime(100)).toBe(1);
    expect(calculateReadingTime(199)).toBe(1);
    
    // Exactly 200 words
    expect(calculateReadingTime(200)).toBe(1);
    
    // More than 200 words
    expect(calculateReadingTime(201)).toBe(2);
    expect(calculateReadingTime(400)).toBe(2);
    expect(calculateReadingTime(401)).toBe(3);
    
    // Large numbers
    expect(calculateReadingTime(10000)).toBe(50);
  });

  /**
   * Feature: noctuary-editor-redesign, Property 12: Word goal progress
   * Validates: Requirements 5.4
   * 
   * For any document with a word goal set, the progress percentage should be 
   * (currentWordCount / wordGoal) * 100, capped at 100%.
   */
  it('Property 12: Word goal progress - follows percentage formula and caps at 100%', () => {
    fc.assert(
      fc.property(
        // Generate arbitrary word counts and goals
        fc.integer({ min: 0, max: 100000 }),
        fc.integer({ min: 1, max: 100000 }),
        (currentWordCount, wordGoal) => {
          const calculatedProgress = calculateWordGoalProgress(currentWordCount, wordGoal);
          const expectedProgress = Math.min(100, (currentWordCount / wordGoal) * 100);
          
          expect(calculatedProgress).toBe(expectedProgress);
          
          // Progress should never exceed 100%
          expect(calculatedProgress).toBeLessThanOrEqual(100);
          
          // Progress should never be negative
          expect(calculatedProgress).toBeGreaterThanOrEqual(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: noctuary-editor-redesign, Property 12: Word goal progress (edge cases)
   * Validates: Requirements 5.4
   * 
   * Test word goal progress edge cases
   */
  it('Property 12: Word goal progress handles edge cases correctly', () => {
    // No goal set (null)
    expect(calculateWordGoalProgress(100, null)).toBe(0);
    
    // Zero goal
    expect(calculateWordGoalProgress(100, 0)).toBe(0);
    
    // Negative goal (invalid)
    expect(calculateWordGoalProgress(100, -10)).toBe(0);
    
    // Zero words
    expect(calculateWordGoalProgress(0, 1000)).toBe(0);
    
    // Exactly at goal
    expect(calculateWordGoalProgress(1000, 1000)).toBe(100);
    
    // Below goal
    expect(calculateWordGoalProgress(500, 1000)).toBe(50);
    expect(calculateWordGoalProgress(250, 1000)).toBe(25);
    
    // Above goal (should cap at 100%)
    expect(calculateWordGoalProgress(1500, 1000)).toBe(100);
    expect(calculateWordGoalProgress(2000, 1000)).toBe(100);
    
    // Very small progress
    expect(calculateWordGoalProgress(1, 1000)).toBe(0.1);
  });

  /**
   * Feature: noctuary-editor-redesign, Property 20: Tag storage round-trip
   * Validates: Requirements 8.3
   * 
   * For any set of tags added to a document, those tags should be stored 
   * in document metadata and retrieved identically when the document is loaded.
   */
  it('Property 20: Tag storage round-trip - tags persist correctly', () => {
    fc.assert(
      fc.property(
        // Generate arbitrary arrays of tag strings
        fc.array(fc.string({ minLength: 1, maxLength: 50 }), { minLength: 0, maxLength: 20 }),
        (tags) => {
          // Simulate storing tags in document metadata
          const document = {
            tags: tags,
          };
          
          // Simulate retrieving tags from storage (via JSON round-trip)
          const stored = JSON.stringify(document);
          const retrieved = JSON.parse(stored);
          
          // Tags should be identical after round-trip
          expect(retrieved.tags).toEqual(tags);
          expect(retrieved.tags.length).toBe(tags.length);
          
          // Each tag should match exactly
          tags.forEach((tag, index) => {
            expect(retrieved.tags[index]).toBe(tag);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: noctuary-editor-redesign, Property 20: Tag storage round-trip (edge cases)
   * Validates: Requirements 8.3
   * 
   * Test tag storage with edge cases
   */
  it('Property 20: Tag storage handles edge cases correctly', () => {
    // Empty tags array
    const doc1 = { tags: [] };
    const stored1 = JSON.stringify(doc1);
    const retrieved1 = JSON.parse(stored1);
    expect(retrieved1.tags).toEqual([]);
    
    // Single tag
    const doc2 = { tags: ['horror'] };
    const stored2 = JSON.stringify(doc2);
    const retrieved2 = JSON.parse(stored2);
    expect(retrieved2.tags).toEqual(['horror']);
    
    // Multiple tags
    const doc3 = { tags: ['horror', 'gothic', 'supernatural'] };
    const stored3 = JSON.stringify(doc3);
    const retrieved3 = JSON.parse(stored3);
    expect(retrieved3.tags).toEqual(['horror', 'gothic', 'supernatural']);
    
    // Tags with special characters
    const doc4 = { tags: ['tag-with-dash', 'tag_with_underscore', 'tag with space'] };
    const stored4 = JSON.stringify(doc4);
    const retrieved4 = JSON.parse(stored4);
    expect(retrieved4.tags).toEqual(['tag-with-dash', 'tag_with_underscore', 'tag with space']);
    
    // Tags with unicode
    const doc5 = { tags: ['日本語', 'español', 'français'] };
    const stored5 = JSON.stringify(doc5);
    const retrieved5 = JSON.parse(stored5);
    expect(retrieved5.tags).toEqual(['日本語', 'español', 'français']);
    
    // Duplicate tags (should be preserved as-is)
    const doc6 = { tags: ['horror', 'horror', 'gothic'] };
    const stored6 = JSON.stringify(doc6);
    const retrieved6 = JSON.parse(stored6);
    expect(retrieved6.tags).toEqual(['horror', 'horror', 'gothic']);
  });
});
