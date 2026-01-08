/**
 * Utility functions for document operations and statistics
 */

import type { DocumentStatistics } from '../types/noctuary';

/**
 * Calculate word count from document content
 * Words are defined as non-empty strings separated by whitespace
 */
export function calculateWordCount(content: string): number {
  if (!content || content.trim().length === 0) {
    return 0;
  }
  return content.trim().split(/\s+/).filter(w => w.length > 0).length;
}

/**
 * Calculate character count from document content
 */
export function calculateCharacterCount(content: string): number {
  return content.length;
}

/**
 * Calculate estimated reading time in minutes
 * Based on average reading speed of 200 words per minute
 */
export function calculateReadingTime(wordCount: number): number {
  return Math.ceil(wordCount / 200);
}

/**
 * Calculate all document statistics at once
 */
export function calculateStatistics(content: string): DocumentStatistics {
  const wordCount = calculateWordCount(content);
  const characterCount = calculateCharacterCount(content);
  const readingTime = calculateReadingTime(wordCount);

  return {
    wordCount,
    characterCount,
    readingTime,
  };
}

/**
 * Calculate word goal progress percentage
 * Returns a value between 0 and 100, capped at 100
 */
export function calculateWordGoalProgress(currentWordCount: number, wordGoal: number | null): number {
  if (!wordGoal || wordGoal <= 0) {
    return 0;
  }
  return Math.min(100, (currentWordCount / wordGoal) * 100);
}

/**
 * Sanitize filename for export
 * Removes special characters and limits length
 */
export function sanitizeFilename(filename: string, maxLength: number = 200): string {
  return filename
    .replace(/[^a-z0-9]/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, maxLength);
}

/**
 * Debounce function for auto-save
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}
