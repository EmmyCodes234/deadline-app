/**
 * Integration tests for MetadataPanel component
 * Tests the component rendering and user interactions
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MetadataPanel } from './MetadataPanel';
import type { Document } from '../types/noctuary';

describe('MetadataPanel - Integration Tests', () => {
  const mockDocument: Document = {
    id: '1',
    title: 'Test Document',
    content: 'This is a test document with some content.',
    folderId: null,
    tags: ['horror', 'gothic'],
    wordGoal: 1000,
    synopsis: 'A test synopsis',
    snapshots: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  it('renders statistics correctly', () => {
    const mockCallbacks = {
      onUpdateSynopsis: vi.fn(),
      onUpdateTags: vi.fn(),
      onUpdateWordGoal: vi.fn(),
    };

    render(<MetadataPanel document={mockDocument} {...mockCallbacks} />);

    // Check that statistics section is present
    expect(screen.getByText('Statistics')).toBeInTheDocument();
    expect(screen.getByText('Words')).toBeInTheDocument();
    expect(screen.getByText('Characters')).toBeInTheDocument();
    expect(screen.getByText('Reading Time')).toBeInTheDocument();
  });

  it('displays word goal progress when goal is set', () => {
    const mockCallbacks = {
      onUpdateSynopsis: vi.fn(),
      onUpdateTags: vi.fn(),
      onUpdateWordGoal: vi.fn(),
    };

    render(<MetadataPanel document={mockDocument} {...mockCallbacks} />);

    // Check that word goal section is present
    expect(screen.getByText('Word Goal')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays synopsis textarea', () => {
    const mockCallbacks = {
      onUpdateSynopsis: vi.fn(),
      onUpdateTags: vi.fn(),
      onUpdateWordGoal: vi.fn(),
    };

    render(<MetadataPanel document={mockDocument} {...mockCallbacks} />);

    // Check that synopsis section is present
    expect(screen.getByText('Synopsis')).toBeInTheDocument();
    expect(screen.getByLabelText('Document synopsis')).toBeInTheDocument();
  });

  it('displays tags list', () => {
    const mockCallbacks = {
      onUpdateSynopsis: vi.fn(),
      onUpdateTags: vi.fn(),
      onUpdateWordGoal: vi.fn(),
    };

    render(<MetadataPanel document={mockDocument} {...mockCallbacks} />);

    // Check that tags section is present
    expect(screen.getByText('Tags')).toBeInTheDocument();
    expect(screen.getByText('horror')).toBeInTheDocument();
    expect(screen.getByText('gothic')).toBeInTheDocument();
  });

  it('shows empty state when no document is selected', () => {
    const mockCallbacks = {
      onUpdateSynopsis: vi.fn(),
      onUpdateTags: vi.fn(),
      onUpdateWordGoal: vi.fn(),
    };

    render(<MetadataPanel document={null} {...mockCallbacks} />);

    expect(screen.getByText('No document selected')).toBeInTheDocument();
  });
});
