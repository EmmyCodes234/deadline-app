/**
 * SettingsModal Component
 * Allows users to customize editor appearance and behavior
 * Settings are persisted to LocalStorage and applied immediately
 */

import { useEffect, useRef, useState } from 'react';
import { useNoctuary } from '../contexts/NoctuaryContext';
import type { EditorSettings } from '../types/noctuary';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FONT_FAMILIES = [
  'IM Fell English',
  'Crimson Text',
  'Georgia',
  'Times New Roman',
] as const;

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { settings, updateSettings } = useNoctuary();
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Local state for immediate preview
  const [localSettings, setLocalSettings] = useState<EditorSettings>(settings);

  // Sync local settings with context when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalSettings(settings);
    }
  }, [isOpen, settings]);

  // Focus trap implementation
  useEffect(() => {
    if (!isOpen) return;

    const modal = modalRef.current;
    if (!modal) return;

    // Focus first element when modal opens
    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element
    firstElement?.focus();

    // Trap focus within modal
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (window.document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (window.document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    modal.addEventListener('keydown', handleKeyDown);

    return () => {
      modal.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Apply settings immediately when changed
  const handleSettingChange = <K extends keyof EditorSettings>(
    key: K,
    value: EditorSettings[K]
  ) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    updateSettings({ [key]: value });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
    >
      <div
        ref={modalRef}
        className="bg-zinc-900 border border-red-900/30 rounded-lg p-8 max-w-2xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="settings-modal-title"
          className="text-2xl font-bold text-red-100 mb-6 text-center"
          style={{ fontFamily: 'IM Fell English' }}
        >
          Editor Settings
        </h2>

        <div className="space-y-6">
          {/* Font Family Selection */}
          <div>
            <label
              htmlFor="font-family"
              className="block text-sm font-semibold text-red-200/70 uppercase tracking-wider mb-2"
            >
              Font Family
            </label>
            <select
              id="font-family"
              value={localSettings.fontFamily}
              onChange={(e) => handleSettingChange('fontFamily', e.target.value)}
              className="w-full px-4 py-2 bg-zinc-800 border border-red-900/30 rounded text-red-100 focus:outline-none focus:ring-2 focus:ring-red-500/50"
              aria-label="Select font family"
            >
              {FONT_FAMILIES.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          {/* Font Size Slider */}
          <div>
            <label
              htmlFor="font-size"
              className="block text-sm font-semibold text-red-200/70 uppercase tracking-wider mb-2"
            >
              Font Size: {localSettings.fontSize}px
            </label>
            <input
              id="font-size"
              type="range"
              min="12"
              max="24"
              step="1"
              value={localSettings.fontSize}
              onChange={(e) => handleSettingChange('fontSize', Number(e.target.value))}
              onInput={(e) => handleSettingChange('fontSize', Number((e.target as HTMLInputElement).value))}
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-500"
              aria-label="Adjust font size"
              aria-valuemin={12}
              aria-valuemax={24}
              aria-valuenow={localSettings.fontSize}
            />
            <div className="flex justify-between text-xs text-red-200/50 mt-1">
              <span>12px</span>
              <span>24px</span>
            </div>
          </div>

          {/* Line Height Slider */}
          <div>
            <label
              htmlFor="line-height"
              className="block text-sm font-semibold text-red-200/70 uppercase tracking-wider mb-2"
            >
              Line Height: {localSettings.lineHeight.toFixed(1)}
            </label>
            <input
              id="line-height"
              type="range"
              min="1.2"
              max="2.0"
              step="0.1"
              value={localSettings.lineHeight}
              onChange={(e) => handleSettingChange('lineHeight', Number(e.target.value))}
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-500"
              aria-label="Adjust line height"
              aria-valuemin={1.2}
              aria-valuemax={2.0}
              aria-valuenow={localSettings.lineHeight}
            />
            <div className="flex justify-between text-xs text-red-200/50 mt-1">
              <span>1.2</span>
              <span>2.0</span>
            </div>
          </div>

          {/* Editor Width Slider */}
          <div>
            <label
              htmlFor="editor-width"
              className="block text-sm font-semibold text-red-200/70 uppercase tracking-wider mb-2"
            >
              Editor Width: {localSettings.editorWidth}ch
            </label>
            <input
              id="editor-width"
              type="range"
              min="60"
              max="80"
              step="1"
              value={localSettings.editorWidth}
              onChange={(e) => handleSettingChange('editorWidth', Number(e.target.value))}
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-500"
              aria-label="Adjust editor width"
              aria-valuemin={60}
              aria-valuemax={80}
              aria-valuenow={localSettings.editorWidth}
            />
            <div className="flex justify-between text-xs text-red-200/50 mt-1">
              <span>60ch</span>
              <span>80ch</span>
            </div>
          </div>

          {/* Theme Toggle */}
          <div>
            <label className="block text-sm font-semibold text-red-200/70 uppercase tracking-wider mb-2">
              Theme
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => handleSettingChange('theme', 'dark')}
                className={`flex-1 py-2 px-4 rounded border transition-colors ${
                  localSettings.theme === 'dark'
                    ? 'bg-zinc-800 border-red-500 text-red-100'
                    : 'bg-transparent border-red-900/30 text-red-200 hover:bg-zinc-800'
                }`}
                aria-label="Select dark theme"
                aria-pressed={localSettings.theme === 'dark'}
              >
                Dark
              </button>
              <button
                onClick={() => handleSettingChange('theme', 'light')}
                className={`flex-1 py-2 px-4 rounded border transition-colors ${
                  localSettings.theme === 'light'
                    ? 'bg-zinc-800 border-red-500 text-red-100'
                    : 'bg-transparent border-red-900/30 text-red-200 hover:bg-zinc-800'
                }`}
                aria-label="Select light theme"
                aria-pressed={localSettings.theme === 'light'}
              >
                Light
              </button>
            </div>
          </div>

          {/* Preview Text */}
          <div>
            <label className="block text-sm font-semibold text-red-200/70 uppercase tracking-wider mb-2">
              Preview
            </label>
            <div
              className="p-4 bg-zinc-800/50 border border-red-900/20 rounded"
              style={{
                fontFamily: localSettings.fontFamily,
                fontSize: `${localSettings.fontSize}px`,
                lineHeight: localSettings.lineHeight,
                maxWidth: `${localSettings.editorWidth}ch`,
              }}
            >
              <p className="text-red-100/90">
                The quick brown fox jumps over the lazy dog. This is a preview of your editor settings.
                Adjust the controls above to customize your writing experience.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-2 px-4 bg-transparent hover:bg-zinc-800 border border-red-900/30 text-red-200 rounded transition-colors"
          aria-label="Close settings modal"
        >
          Close
        </button>
      </div>
    </div>
  );
}
