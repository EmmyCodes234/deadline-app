j# Implementation Plan

- [x] 1. Set up project structure and core types





  - Create new directory structure for unified Noctuary editor
  - Define TypeScript interfaces for Document, EditorSettings, Snapshot
  - Set up React Context for global state management
  - Install required dependencies (fast-check for property testing, docx, jspdf)
  - _Requirements: 1.1, 1.2_

- [x] 1.1 Write property test for document state management


  - **Property 1: Document consistency across switches**
  - **Validates: Requirements 1.3**

- [x] 2. Implement LocalStorage persistence layer





  - Create LocalStorage utility functions (save, load, delete)
  - Implement error handling for quota exceeded and unavailable storage
  - Add storage quota monitoring
  - Create migration function to import from old editor formats
  - _Requirements: 2.5_

- [x] 2.1 Write property test for LocalStorage round-trip


  - **Property 5: Document persistence round-trip**
  - **Validates: Requirements 2.5**

- [x] 3. Build EditorCanvas component





  - Create contenteditable element with proper ARIA attributes
  - Implement debounced auto-save (500ms)
  - Add save status indicator (Saving/Saved)
  - Handle focus/blur events for focus mode
  - Add keyboard shortcut handling
  - _Requirements: 1.4, 2.1, 2.2, 2.3, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [x] 3.1 Write property test for auto-save timing


  - **Property 2: Auto-save timing guarantee**
  - **Validates: Requirements 2.1**

- [x] 3.2 Write property test for save status indicator


  - **Property 3: Save status indicator accuracy**
  - **Validates: Requirements 2.2, 2.3**

- [x] 3.3 Write property test for unsaved changes protection


  - **Property 4: Unsaved changes protection**
  - **Validates: Requirements 2.4**

- [x] 3.4 Write property test for no disruptive effects


  - **Property 28: No disruptive typing effects**
  - **Validates: Requirements 10.2**

- [x] 3.5 Write property test for no popup interruptions


  - **Property 29: No popup interruptions during writing**
  - **Validates: Requirements 10.3**

- [x] 4. Build Sidebar component





  - Create document list with virtual scrolling (react-window)
  - Implement drag-and-drop reordering
  - Add folder support with nesting
  - Create search/filter functionality
  - Add keyboard navigation (arrow keys, Enter)
  - Implement collapsible behavior with Cmd+B
  - _Requirements: 1.2, 1.3, 4.1, 8.1, 8.2, 8.4, 8.5_

- [x] 4.1 Write property test for folder nesting


  - **Property 18: Folder nesting integrity**
  - **Validates: Requirements 8.1**

- [x] 4.2 Write property test for drag-and-drop order


  - **Property 19: Drag-and-drop order preservation**
  - **Validates: Requirements 8.2**

- [x] 4.3 Write property test for tag filtering


  - **Property 21: Tag filtering correctness**
  - **Validates: Requirements 8.4**

- [x] 4.4 Write property test for search comprehensiveness


  - **Property 22: Search comprehensiveness**
  - **Validates: Requirements 8.5**

- [x] 5. Build MetadataPanel component





  - Display real-time word count
  - Display real-time character count
  - Calculate and display reading time
  - Create word goal progress bar
  - Add synopsis textarea
  - Implement tag management UI
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 8.3_

- [x] 5.1 Write property test for word count accuracy


  - **Property 9: Word count accuracy**
  - **Validates: Requirements 5.1**

- [x] 5.2 Write property test for character count accuracy


  - **Property 10: Character count accuracy**
  - **Validates: Requirements 5.2**

- [x] 5.3 Write property test for reading time calculation


  - **Property 11: Reading time calculation**
  - **Validates: Requirements 5.3**

- [x] 5.4 Write property test for word goal progress


  - **Property 12: Word goal progress**
  - **Validates: Requirements 5.4**

- [x] 5.5 Write property test for tag storage


  - **Property 20: Tag storage round-trip**
  - **Validates: Requirements 8.3**

- [x] 6. Implement export functionality





  - Create ExportModal component with format selection
  - Implement TXT export with UTF-8 encoding
  - Implement DOCX export using docx library (lazy loaded)
  - Implement PDF export using jsPDF library (lazy loaded)
  - Add filename sanitization
  - Trigger browser download with correct MIME type
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 4.3_

- [x] 6.1 Write property test for export format correctness


  - **Property 6: Export format correctness**
  - **Validates: Requirements 3.2, 3.3, 3.4**

- [x] 6.2 Write property test for export filename generation


  - **Property 7: Export filename generation**
  - **Validates: Requirements 3.5**

- [x] 7. Build snapshot system





  - Create SnapshotsModal component
  - Implement snapshot creation with timestamp
  - Display snapshot list with timestamps and word counts
  - Add snapshot preview in read-only mode
  - Implement snapshot restoration
  - Add snapshot deletion with confirmation
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 7.1 Write property test for snapshot timestamp accuracy


  - **Property 23: Snapshot timestamp accuracy**
  - **Validates: Requirements 9.1**

- [x] 7.2 Write property test for snapshot list completeness


  - **Property 24: Snapshot list completeness**
  - **Validates: Requirements 9.2**

- [x] 7.3 Write property test for snapshot preview immutability


  - **Property 25: Snapshot preview immutability**
  - **Validates: Requirements 9.3**

- [x] 7.4 Write property test for snapshot restoration accuracy


  - **Property 26: Snapshot restoration accuracy**
  - **Validates: Requirements 9.4**

- [x] 7.5 Write property test for snapshot deletion confirmation


  - **Property 27: Snapshot deletion confirmation**
  - **Validates: Requirements 9.5**

- [x] 8. Implement focus mode





  - Add opacity transitions for sidebar and metadata panel
  - Implement cursor hiding after 30 seconds idle
  - Restore cursor on typing
  - Hide non-essential UI elements when editor focused
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 8.1 Write property test for sidebar opacity


  - **Property 17: Sidebar opacity during focus**
  - **Validates: Requirements 7.2**

- [x] 9. Implement accessibility features





  - Add ARIA labels to all interactive elements
  - Implement visible focus indicators (2px border)
  - Verify color contrast ratios (4.5:1 minimum)
  - Add ARIA live regions for status updates
  - Implement modal focus trapping
  - Test with screen readers (NVDA/JAWS)
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 9.1 Write property test for focus indicator visibility


  - **Property 13: Focus indicator visibility**
  - **Validates: Requirements 6.2**

- [x] 9.2 Write property test for color contrast compliance

  - **Property 14: Color contrast compliance**
  - **Validates: Requirements 6.3**

- [x] 9.3 Write property test for ARIA live region updates

  - **Property 15: ARIA live region updates**
  - **Validates: Requirements 6.4**

- [x] 9.4 Write property test for modal focus trap

  - **Property 16: Modal focus trap**
  - **Validates: Requirements 6.5**

- [x] 10. Implement keyboard shortcuts





  - Add Cmd+B / Ctrl+B for sidebar toggle
  - Add Cmd+S / Ctrl+S for manual save
  - Add Cmd+E / Ctrl+E for export modal
  - Add Cmd+K / Ctrl+K for quick document switcher
  - Add ? for keyboard shortcuts help modal
  - Add Escape for closing modals/panels
  - Create KeyboardShortcutsModal component
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [x] 10.1 Write property test for Escape key behavior


  - **Property 8: Keyboard shortcut consistency**
  - **Validates: Requirements 4.6**

- [x] 11. Implement responsive design





  - Hide sidebar by default on mobile (<768px)
  - Hide metadata panel on mobile (<768px)
  - Add mobile menu overlay for sidebar
  - Ensure touch-friendly button sizes (44x44px minimum)
  - Prevent horizontal scrolling on mobile
  - Test on various mobile devices and screen sizes
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [x] 11.1 Write property test for mobile button sizes


  - **Property 31: Mobile button size compliance**
  - **Validates: Requirements 11.4**



- [x] 12. Build settings system



  - Create SettingsModal component
  - Add font family selection dropdown
  - Add font size slider (12-24px)
  - Add line height slider (1.2-2.0)
  - Add editor width slider (60-80ch)
  - Add theme toggle (dark/light)
  - Persist settings to LocalStorage
  - Apply settings immediately without reload
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [x] 12.1 Write property test for theme persistence


  - **Property 30: Theme persistence round-trip**
  - **Validates: Requirements 10.5**

- [x] 12.2 Write property test for settings application immediacy


  - **Property 32: Settings application immediacy**
  - **Validates: Requirements 12.5**

- [x] 13. Apply horror theme styling





  - Add subtle parchment texture to editor background
  - Use IM Fell English and Crimson Text fonts
  - Implement dark color scheme with proper contrast
  - Add subtle vignette effect (non-animated)
  - Style scrollbars with gothic aesthetic
  - Ensure all styling is non-intrusive
  - _Requirements: 10.1, 10.4_

- [x] 14. Checkpoint - Ensure all tests pass





  - Ensure all tests pass, ask the user if questions arise.

- [x] 15. Remove old editor implementations
















  - Delete NoctuaryEditor.tsx (Monaco-based editor)
  - Delete GrimoireEditor.tsx (old contenteditable editor)
  - Remove unused imports and dependencies
  - Update routing to use new unified editor
  - Clean up commented-out code
  - _Requirements: 1.1_

- [ ] 16. Performance optimization
  - Implement virtual scrolling for document list
  - Lazy load export libraries (docx, jspdf)
  - Memoize statistics calculations
  - Optimize re-renders with React.memo
  - Add bundle size monitoring
  - _Requirements: 5.5_

- [ ] 16.1 Write unit tests for performance utilities
  - Test debounce function timing
  - Test memoization cache hits
  - Test virtual scrolling render count

- [ ] 17. Integration testing
  - Test full writing session flow
  - Test document organization workflow
  - Test snapshot workflow
  - Test keyboard-only navigation
  - Test mobile responsive behavior
  - _Requirements: All_

- [ ] 17.1 Write integration tests with Playwright
  - Create document → Write → Auto-save → Export
  - Create folders → Move documents → Reorder
  - Write → Snapshot → Modify → Restore
  - Navigate entire app with keyboard only
  - Test all features on mobile viewport

- [ ] 18. Accessibility audit
  - Run axe-core automated tests
  - Test with NVDA screen reader
  - Test with JAWS screen reader
  - Verify keyboard-only navigation
  - Check color contrast with tools
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 18.1 Write accessibility unit tests
  - Test ARIA attributes on all components
  - Test focus management in modals
  - Test keyboard navigation paths
  - Test screen reader announcements

- [ ] 19. Documentation
  - Write inline code comments for complex logic
  - Create user guide for keyboard shortcuts
  - Document LocalStorage schema
  - Add JSDoc comments to all public functions
  - Create README for the Noctuary editor
  - _Requirements: All_

- [ ] 20. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
