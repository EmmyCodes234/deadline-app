# Modern Document Editor - Minimalist Halloween Theme

A sophisticated, minimalist document editor built with React, Tiptap, and Tailwind CSS, featuring a "Minimalist Halloween" aesthetic.

## Features

### Layout
- **Fixed 3-Column Holy Grail Layout** - Identical to modern IDEs but optimized for writers
- **Left Sidebar (250px)** - File explorer with collapsible functionality
- **Center Region** - Main editor with breadcrumb navigation and formatting toolbar
- **Right Sidebar (300px)** - AI companion chat interface

### File Management
- **File Tree Structure** - Hierarchical organization with folder nesting
- **Context Menu** - Right-click to rename, delete, or download files
- **New Document Button** - Prominent creation button in sidebar header

### Editor Features
- **Tiptap Rich Text Editor** - Headless editor with full formatting support
- **Floating Toolbar** - Bold, Italic, Strike, H1-H3, Lists, Quotes
- **Centered Canvas** - Max-width 65ch for optimal readability
- **Auto-save Indicator** - Real-time save status display
- **Word/Character Count** - Live statistics in status bar

### AI Companion
- **Chat Interface** - Messages from user (right) and AI (left)
- **Smart Responses** - Context-aware writing assistance
- **Input Area** - Multi-line text area with keyboard shortcuts

## Color Palette - Minimalist Halloween

### Backgrounds
- **App Background**: `#0a0a0a` (Deep Void)
- **Sidebar Backgrounds**: `#121212` (Slightly lighter separation)
- **Editor Paper**: `#000000` (Pure black writing surface)

### Typography
- **Primary Text**: `#e5e5e5` (Ghost White - high contrast)
- **Muted Text**: `#737373` (Ash Grey - timestamps, breadcrumbs)
- **Font**: Inter (clean sans-serif)

### Halloween Accents
- **Primary Accent**: `#f97316` (Pumpkin Spice/Burnt Orange)
  - Used for: Primary buttons, active file indicators, cursor caret
- **Secondary Accent**: `#dc2626` (Blood Red)
  - Used for: Delete actions, critical errors
- **Focus Rings**: Glowing orange rings on input focus

### UI Refinements
- **Borders**: Extremely subtle dark grey (`rgba(115, 115, 115, 0.2)`)
- **Buttons**: Rounded corners (`border-radius: 6px`)
- **New Document Button**: Outline style with orange accent
- **Hover Effects**: Subtle orange glow on interactive elements

## Technical Stack

- **React 19** - Modern React with hooks
- **Tiptap** - Headless rich text editor
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Minimalist icon system
- **TypeScript** - Type safety

## Usage

```tsx
import { DocumentEditor } from './components/DocumentEditor';

function App() {
  return <DocumentEditor />;
}
```

## Responsive Design

- **Desktop Optimized** - Primary target for professional writing
- **Mobile Adaptive** - Sidebars become overlays on smaller screens
- **Touch Friendly** - Appropriate touch targets and gestures

## Accessibility

- **Keyboard Navigation** - Full keyboard support
- **Focus Management** - Clear focus indicators
- **Screen Reader Support** - Semantic HTML structure
- **High Contrast** - WCAG compliant color ratios

## File Structure

```
src/components/
├── DocumentEditor.tsx      # Main layout component
├── FileExplorer.tsx       # Left sidebar file tree
├── EditorPane.tsx         # Center editor region
├── FormattingToolbar.tsx  # Rich text formatting
├── AICompanion.tsx        # Right sidebar AI chat
└── DocumentEditor.css     # Theme-specific styles
```

## Customization

The Halloween theme can be easily customized by modifying the color variables in the component styles. The design system is built to be maintainable and extensible.

## Performance

- **Lazy Loading** - Components load on demand
- **Optimized Rendering** - React.memo and useCallback optimizations
- **Efficient Updates** - Minimal re-renders on state changes