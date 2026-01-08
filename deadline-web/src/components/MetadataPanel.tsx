/**
 * MetadataPanel Component - Dark Arts Toolkit
 * 
 * A tabbed interface providing writers with:
 * - Séance: Ambient sound controls (Rain, Fireplace, White Noise, Whispers)
 * - Lexicon: Horror vocabulary search with cursed synonyms
 * - Anatomy: Document synopsis and notes
 */

import React, { useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import type { Document } from '../types/noctuary';
import { calculateStatistics } from '../utils/documentUtils';
import { SENSORY_LEXICON } from '../data/sensoryLexicon';
import './MetadataPanel.css';

/**
 * Calculate word goal progress percentage
 */
function calculateWordGoalProgress(currentWords: number, goalWords: number | null): number {
  if (!goalWords || goalWords <= 0) return 0;
  return Math.min(100, (currentWords / goalWords) * 100);
}

type TabType = 'seance' | 'lexicon' | 'anatomy';

interface MetadataPanelProps {
  document: Document | null;
  onUpdateSynopsis: (synopsis: string) => void;
  onUpdateTags: (tags: string[]) => void;
  onUpdateWordGoal: (goal: number | null) => void;
  className?: string;
}

export function MetadataPanel({
  document,
  onUpdateSynopsis,
  onUpdateTags,
  onUpdateWordGoal,
  className = '',
}: MetadataPanelProps) {
  const [newTag, setNewTag] = useState('');
  const [wordGoalInput, setWordGoalInput] = useState('');

  // Calculate statistics in real-time
  const statistics = useMemo(() => {
    if (!document) {
      return { wordCount: 0, characterCount: 0, readingTime: 0 };
    }
    return calculateStatistics(document.content);
  }, [document?.content]);

  // Calculate word goal progress
  const wordGoalProgress = useMemo(() => {
    if (!document) return 0;
    return calculateWordGoalProgress(statistics.wordCount, document.wordGoal);
  }, [statistics.wordCount, document?.wordGoal]);

  if (!document) {
    return (
      <div className={`metadata-panel ${className}`}>
        <div className="metadata-empty">
          <p>No document selected</p>
        </div>
      </div>
    );
  }

  const handleSynopsisChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 1000) {
      onUpdateSynopsis(value);
    }
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTag = newTag.trim();
    if (trimmedTag && !document.tags.includes(trimmedTag)) {
      onUpdateTags([...document.tags, trimmedTag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onUpdateTags(document.tags.filter(tag => tag !== tagToRemove));
  };

  const handleWordGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const goal = parseInt(wordGoalInput, 10);
    if (!isNaN(goal) && goal > 0) {
      onUpdateWordGoal(goal);
      setWordGoalInput('');
    } else if (wordGoalInput === '') {
      onUpdateWordGoal(null);
    }
  };

  return (
    <div className={`metadata-panel ${className}`} role="complementary" aria-label="Document metadata">
      {/* Statistics Section */}
      <section className="metadata-section" aria-labelledby="statistics-heading">
        <h2 id="statistics-heading" className="metadata-heading">Statistics</h2>

        <div className="statistics-grid">
          <div className="stat-item">
            <span className="stat-label">Words</span>
            <span className="stat-value" aria-label={`${statistics.wordCount} words`}>
              {statistics.wordCount.toLocaleString()}
            </span>
          </div>

          <div className="stat-item">
            <span className="stat-label">Characters</span>
            <span className="stat-value" aria-label={`${statistics.characterCount} characters`}>
              {statistics.characterCount.toLocaleString()}
            </span>
          </div>

          <div className="stat-item">
            <span className="stat-label">Reading Time</span>
            <span className="stat-value" aria-label={`${statistics.readingTime} minutes`}>
              {statistics.readingTime} min
            </span>
          </div>
        </div>
      </section>

      {/* Word Goal Section */}
      <section className="metadata-section" aria-labelledby="word-goal-heading">
        <h2 id="word-goal-heading" className="metadata-heading">Word Goal</h2>

        {document.wordGoal ? (
          <div className="word-goal-display">
            <div className="word-goal-info">
              <span className="word-goal-current">{statistics.wordCount}</span>
              <span className="word-goal-separator">/</span>
              <span className="word-goal-target">{document.wordGoal}</span>
              <button
                onClick={() => onUpdateWordGoal(null)}
                className="word-goal-clear"
                aria-label="Clear word goal"
              >
                ×
              </button>
            </div>
            <div
              className="word-goal-progress-bar"
              role="progressbar"
              aria-valuenow={wordGoalProgress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Word goal progress: ${Math.round(wordGoalProgress)}%`}
            >
              <div
                className="word-goal-progress-fill"
                style={{ width: `${wordGoalProgress}%` }}
              />
            </div>
            <span className="word-goal-percentage">
              {Math.round(wordGoalProgress)}%
            </span>
          </div>
        ) : (
          <form onSubmit={handleWordGoalSubmit} className="word-goal-form">
            <input
              type="number"
              value={wordGoalInput}
              onChange={(e) => setWordGoalInput(e.target.value)}
              placeholder="Set word goal"
              className="word-goal-input"
              min="1"
              aria-label="Word goal"
            />
            <button type="submit" className="word-goal-submit" aria-label="Set word goal">
              Set
            </button>
          </form>
        )}
      </section>

      {/* Synopsis Section */}
      <section className="metadata-section" aria-labelledby="synopsis-heading">
        <h2 id="synopsis-heading" className="metadata-heading">Synopsis</h2>
        <textarea
          value={document.synopsis}
          onChange={handleSynopsisChange}
          placeholder="Write a brief synopsis of your document..."
          className="synopsis-textarea"
          maxLength={1000}
          rows={4}
          aria-label="Document synopsis"
          aria-describedby="synopsis-counter"
        />
        <span id="synopsis-counter" className="synopsis-counter">
          {document.synopsis.length} / 1000
        </span>
      </section>

      {/* Tags Section */}
      <section className="metadata-section" aria-labelledby="tags-heading">
        <h2 id="tags-heading" className="metadata-heading">Tags</h2>

        <div className="tags-list" role="list" aria-label="Document tags">
          {document.tags.map((tag) => (
            <div key={tag} className="tag-item" role="listitem">
              <span className="tag-text">{tag}</span>
              <button
                onClick={() => handleRemoveTag(tag)}
                className="tag-remove"
                aria-label={`Remove tag ${tag}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddTag} className="tag-form">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add tag..."
            className="tag-input"
            aria-label="New tag"
          />
          <button type="submit" className="tag-submit" aria-label="Add tag">
            Add
          </button>
        </form>
      </section>
    </div>
  );
}
