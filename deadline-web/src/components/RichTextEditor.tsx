import { useRef, forwardRef, useImperativeHandle } from 'react';
import clsx from 'clsx';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const RichTextEditor = forwardRef<HTMLTextAreaElement, RichTextEditorProps>(
  ({ value, onChange, placeholder, className, style }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement);

    return (
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={clsx(
          'w-full h-full resize-none',
          'bg-transparent',
          'focus:outline-none focus:ring-0',
          'selection:bg-purple-500/30',
          className
        )}
        style={style}
        spellCheck={false}
      />
    );
  }
);

RichTextEditor.displayName = 'RichTextEditor';
