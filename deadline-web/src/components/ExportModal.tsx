/**
 * ExportModal Component
 * 
 * Provides export functionality for documents in TXT, DOCX, and PDF formats.
 * Implements lazy loading for DOCX and PDF libraries to optimize bundle size.
 */

import React, { useState, useEffect, useRef } from 'react';
import type { Document } from '../types/noctuary';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document;
}

type ExportFormat = 'txt' | 'docx' | 'pdf';

/**
 * Sanitizes filename by removing special characters and limiting length
 */
export function sanitizeFilename(title: string): string {
  // Replace non-alphanumeric characters with hyphens
  const sanitized = title.replace(/[^a-z0-9]/gi, '-');
  // Remove consecutive hyphens
  const cleaned = sanitized.replace(/-+/g, '-');
  // Remove leading/trailing hyphens
  const trimmed = cleaned.replace(/^-|-$/g, '');
  // Limit to 200 characters
  return trimmed.slice(0, 200) || 'untitled';
}

/**
 * Exports document as plain text with UTF-8 encoding
 */
export function exportToTxt(document: Document): void {
  const content = `${document.title}\n\n${document.content}`;
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = window.document.createElement('a');
  link.href = url;
  link.download = `${sanitizeFilename(document.title)}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Exports document as DOCX using docx library (lazy loaded)
 */
export async function exportToDocx(document: Document): Promise<void> {
  // Lazy load docx library
  const { Document: DocxDocument, Packer, Paragraph, TextRun, AlignmentType } = await import('docx');

  // Split content into paragraphs
  const paragraphs = document.content.split('\n').map(para =>
    new Paragraph({
      spacing: {
        line: 360, // 1.5 line spacing
        after: 200,
      },
      children: [
        new TextRun({
          text: para || ' ', // Empty paragraphs need at least a space
          size: 24, // 12pt (size is in half-points)
          font: 'Times New Roman',
        }),
      ],
    })
  );

  // Create title page
  const titleParagraph = new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: {
      before: 2000,
      after: 400,
    },
    children: [
      new TextRun({
        text: document.title,
        bold: true,
        size: 48, // 24pt
        font: 'Times New Roman',
      }),
    ],
  });

  // Create document
  const doc = new DocxDocument({
    sections: [
      {
        properties: {},
        children: [titleParagraph, ...paragraphs],
      },
    ],
  });

  // Generate blob and trigger download
  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const link = window.document.createElement('a');
  link.href = url;
  link.download = `${sanitizeFilename(document.title)}.docx`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Exports document as PDF using jsPDF library (lazy loaded)
 */
export async function exportToPdf(document: Document): Promise<void> {
  // Lazy load jsPDF library
  const { jsPDF } = await import('jspdf');

  const doc = new jsPDF();

  // Add title
  doc.setFontSize(24);
  doc.setFont('times', 'bold');
  doc.text(document.title, 105, 20, { align: 'center' });

  // Add content
  doc.setFontSize(12);
  doc.setFont('times', 'normal');

  // Split content into lines that fit the page width
  const pageWidth = doc.internal.pageSize.getWidth();
  const margins = 20;
  const maxWidth = pageWidth - (margins * 2);

  const lines = doc.splitTextToSize(document.content, maxWidth);

  let y = 40; // Start position after title
  const lineHeight = 7;
  const pageHeight = doc.internal.pageSize.getHeight();

  lines.forEach((line: string) => {
    if (y + lineHeight > pageHeight - margins) {
      doc.addPage();
      y = margins;
    }
    doc.text(line, margins, y);
    y += lineHeight;
  });

  // Save the PDF
  doc.save(`${sanitizeFilename(document.title)}.pdf`);
}

export function ExportModal({ isOpen, onClose, document }: ExportModalProps) {
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

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

  if (!isOpen) return null;

  const handleExport = async (format: ExportFormat) => {
    setExporting(true);
    setError(null);

    try {
      switch (format) {
        case 'txt':
          exportToTxt(document);
          break;
        case 'docx':
          await exportToDocx(document);
          break;
        case 'pdf':
          await exportToPdf(document);
          break;
      }

      // Close modal after successful export
      setTimeout(() => {
        onClose();
        setExporting(false);
      }, 500);
    } catch (err) {
      console.error('Export failed:', err);
      setError('Export failed. Please try again.');
      setExporting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
    >
      <div
        ref={modalRef}
        className="bg-zinc-900 border border-red-900/30 rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="export-modal-title"
          className="text-2xl font-bold text-red-100 mb-6 text-center"
          style={{ fontFamily: 'IM Fell English' }}
        >
          Publish Document
        </h2>

        <div className="space-y-4">
          <button
            ref={firstFocusableRef}
            onClick={() => handleExport('txt')}
            disabled={exporting}
            className="w-full py-3 px-4 bg-zinc-800 hover:bg-zinc-700 border border-red-900/30 text-red-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Publish as plain text file"
          >
            <div className="text-left">
              <div className="font-semibold">Plain Text (.txt)</div>
              <div className="text-sm text-red-200/70">UTF-8 encoded text file</div>
            </div>
          </button>

          <button
            onClick={() => handleExport('docx')}
            disabled={exporting}
            className="w-full py-3 px-4 bg-zinc-800 hover:bg-zinc-700 border border-red-900/30 text-red-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Publish as Microsoft Word document"
          >
            <div className="text-left">
              <div className="font-semibold">Microsoft Word (.docx)</div>
              <div className="text-sm text-red-200/70">Formatted Word document</div>
            </div>
          </button>

          <button
            onClick={() => handleExport('pdf')}
            disabled={exporting}
            className="w-full py-3 px-4 bg-zinc-800 hover:bg-zinc-700 border border-red-900/30 text-red-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Publish as PDF document"
          >
            <div className="text-left">
              <div className="font-semibold">PDF (.pdf)</div>
              <div className="text-sm text-red-200/70">Portable Document Format</div>
            </div>
          </button>
        </div>

        {error && (
          <div
            className="mt-4 p-3 bg-red-900/20 border border-red-900/50 rounded text-red-200 text-sm"
            role="alert"
          >
            {error}
          </div>
        )}

        {exporting && (
          <div className="mt-4 text-center text-red-200/70 text-sm">
            Publishing...
          </div>
        )}

        <button
          onClick={onClose}
          disabled={exporting}
          className="w-full mt-6 py-2 px-4 bg-transparent hover:bg-zinc-800 border border-red-900/30 text-red-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Close publish modal"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
