import React from 'react';
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Type
} from 'lucide-react';

interface FormattingToolbarProps {
  onFormat?: (format: 'bold' | 'italic' | 'strikethrough' | 'highlight') => void;
  editor?: any; // Keep for backward compatibility
}

export const FormattingToolbar: React.FC<FormattingToolbarProps> = ({ onFormat, editor }) => {
  // If we have the old editor prop but no onFormat, return null (Tiptap mode)
  if (editor && !onFormat) return null;
  
  // If we don't have onFormat callback, return null
  if (!onFormat) return null;

  const ToolbarButton: React.FC<{
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title: string;
  }> = ({ onClick, isActive = false, disabled = false, children, title }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="p-2 rounded-md transition-colors"
      style={{
        backgroundColor: isActive ? '#f97316' : 'transparent',
        color: isActive ? '#000000' : disabled ? '#737373' : '#e5e5e5',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'Inter, sans-serif'
      }}
      onMouseEnter={(e) => {
        if (!disabled && !isActive) {
          e.currentTarget.style.backgroundColor = 'rgba(249, 115, 22, 0.1)';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !isActive) {
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
    >
      {children}
    </button>
  );

  return (
    <div className="flex items-center justify-between p-3" style={{ backgroundColor: '#121212' }}>
      <div className="flex items-center gap-1">
        {/* Text Formatting */}
        <div className="flex items-center gap-1 mr-3">
          <ToolbarButton
            onClick={() => onFormat('bold')}
            title="Bold (Markdown: **text**) - Ctrl+B"
          >
            <Bold size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => onFormat('italic')}
            title="Italic (Markdown: *text*) - Ctrl+I"
          >
            <Italic size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => onFormat('strikethrough')}
            title="Strikethrough (Markdown: ~~text~~)"
          >
            <Strikethrough size={16} />
          </ToolbarButton>
        </div>

        <div className="w-px h-6 mx-2" style={{ backgroundColor: 'rgba(115, 115, 115, 0.3)' }} />

        {/* Additional formatting */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => onFormat('highlight')}
            title="Highlight (Markdown: ==text==)"
          >
            <span className="text-sm font-bold" style={{ backgroundColor: '#f97316', color: '#000', padding: '2px 4px', borderRadius: '2px' }}>
              H
            </span>
          </ToolbarButton>
        </div>
      </div>

      {/* Info */}
      <div className="text-xs text-zinc-500">
        Select text and click buttons to format
      </div>
    </div>
  );
};