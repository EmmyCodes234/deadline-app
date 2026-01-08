import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { EditorPane } from './EditorPane';

// Simple integration test without mocking
describe('EditorPane Integration Test', () => {
  let consoleErrors: any[];
  let consoleWarns: any[];

  beforeEach(() => {
    consoleErrors = [];
    consoleWarns = [];
    
    // Capture console errors and warnings
    const originalError = console.error;
    const originalWarn = console.warn;
    
    console.error = (...args) => {
      consoleErrors.push(args);
      originalError(...args);
    };
    
    console.warn = (...args) => {
      consoleWarns.push(args);
      originalWarn(...args);
    };
  });

  afterEach(() => {
    // Restore console
    console.error = console.error;
    console.warn = console.warn;
  });

  it('should render without crashing', async () => {
    const { container } = render(<EditorPane currentDocument={null} />);
    
    // Should render something
    expect(container.firstChild).not.toBeNull();
    
    // Wait for either loading state or editor
    await waitFor(() => {
      const hasLoading = screen.queryByText('Loading editor...');
      const hasEditor = container.querySelector('.ProseMirror');
      const hasContent = container.textContent && container.textContent.length > 0;
      
      expect(hasLoading || hasEditor || hasContent).toBeTruthy();
    }, { timeout: 10000 });
  });

  it('should not have critical console errors', async () => {
    render(<EditorPane currentDocument="test" />);
    
    // Wait a bit for initialization
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Filter out non-critical errors (like missing DOM methods in test environment)
    const criticalErrors = consoleErrors.filter(error => {
      const errorStr = error.join(' ').toLowerCase();
      return !errorStr.includes('scrollintoview') && 
             !errorStr.includes('jsdom') &&
             !errorStr.includes('not implemented');
    });
    
    expect(criticalErrors).toHaveLength(0);
  });

  it('should render breadcrumb correctly', () => {
    render(<EditorPane currentDocument="test-doc" />);
    
    expect(screen.getByText('My Documents')).toBeInTheDocument();
    expect(screen.getByText('Document test-doc')).toBeInTheDocument();
  });

  it('should render status bar', () => {
    render(<EditorPane currentDocument="test" />);
    
    expect(screen.getByText('Ready')).toBeInTheDocument();
    expect(screen.getByText(/characters/)).toBeInTheDocument();
    expect(screen.getByText(/words/)).toBeInTheDocument();
  });

  it('should handle null document', () => {
    render(<EditorPane currentDocument={null} />);
    
    expect(screen.getByText('Untitled Document')).toBeInTheDocument();
  });

  it('should render formatting toolbar', async () => {
    render(<EditorPane currentDocument="test" />);
    
    // Wait for editor to potentially load
    await waitFor(() => {
      // The toolbar should be present regardless of editor state
      const toolbar = document.querySelector('[style*="borderBottom"]');
      expect(toolbar).toBeInTheDocument();
    }, { timeout: 5000 });
  });
});