import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  PageBreak,
  HeadingLevel,
} from 'docx';
import { saveAs } from 'file-saver';
import { type CryptItem } from '@/hooks/useCrypt';

export interface ExportOptions {
  fileName: string;
  includeTitlePage: boolean;
  includeTableOfContents: boolean;
  mausoleumPageBreak: boolean;
  tombstonePageBreak: boolean;
  excludedItemIds: Set<string>;
}

export async function exportProjectToDocx(
  items: CryptItem[],
  projectTitle: string,
  options: ExportOptions
): Promise<void> {
  try {
    const children: Paragraph[] = [];

    // Title Page
    if (options.includeTitlePage) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: {
            before: 2000,
            after: 400,
          },
          children: [
            new TextRun({
              text: projectTitle.toUpperCase(),
              bold: true,
              size: 48,
              font: 'Times New Roman',
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: {
            after: 400,
          },
          children: [
            new TextRun({
              text: `Word Count: ${calculateTotalWords(items, options.excludedItemIds)}`,
              size: 24,
              font: 'Times New Roman',
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: {
            after: 400,
          },
          children: [
            new TextRun({
              text: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }),
              size: 24,
              font: 'Times New Roman',
              italics: true,
            }),
          ],
        }),
        new Paragraph({
          children: [new PageBreak()],
        })
      );
    }

    // TODO: Table of Contents (placeholder)
    if (options.includeTableOfContents) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: {
            before: 400,
            after: 400,
          },
          children: [
            new TextRun({
              text: 'TABLE OF CONTENTS',
              bold: true,
              size: 28,
              font: 'Times New Roman',
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: {
            after: 400,
          },
          children: [
            new TextRun({
              text: '(To be implemented)',
              size: 20,
              font: 'Times New Roman',
              italics: true,
            }),
          ],
        }),
        new Paragraph({
          children: [new PageBreak()],
        })
      );
    }

    // Build hierarchical structure
    const rootItems = items.filter((item) => !item.parentId);
    
    function processItem(item: CryptItem, depth: number = 0) {
      // Skip excluded items
      if (options.excludedItemIds.has(item.id)) {
        return;
      }

      if (item.type === 'mausoleum') {
        // Add mausoleum title as heading
        children.push(
          new Paragraph({
            heading: depth === 0 ? HeadingLevel.HEADING_1 : HeadingLevel.HEADING_2,
            spacing: {
              before: 400,
              after: 200,
            },
            children: [
              new TextRun({
                text: item.title,
                bold: true,
                size: depth === 0 ? 32 : 28,
                font: 'Times New Roman',
              }),
            ],
          })
        );

        // Process children
        if (item.children) {
          item.children.forEach((childId) => {
            const childItem = items.find((i) => i.id === childId);
            if (childItem) {
              processItem(childItem, depth + 1);
            }
          });
        }

        // Page break after mausoleum if option enabled
        if (options.mausoleumPageBreak) {
          children.push(
            new Paragraph({
              children: [new PageBreak()],
            })
          );
        }
      } else if (item.type === 'tombstone') {
        // Add tombstone title as heading
        children.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: {
              before: 400,
              after: 200,
            },
            children: [
              new TextRun({
                text: item.title,
                bold: true,
                size: 28,
                font: 'Times New Roman',
              }),
            ],
          })
        );

        // Add content paragraphs
        const paragraphs = item.content.split('\n').filter((p) => p.trim().length > 0);
        paragraphs.forEach((para) => {
          children.push(
            new Paragraph({
              spacing: {
                line: 480,
                after: 240,
              },
              children: [
                new TextRun({
                  text: para,
                  size: 24,
                  font: 'Times New Roman',
                }),
              ],
            })
          );
        });

        // Page break after tombstone if option enabled
        if (options.tombstonePageBreak) {
          children.push(
            new Paragraph({
              children: [new PageBreak()],
            })
          );
        }
      }
    }

    // Process all root items
    rootItems.forEach((item) => processItem(item, 0));

    // Create the document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children,
        },
      ],
    });

    // Generate the blob
    const blob = await Packer.toBlob(doc);

    // Trigger download
    saveAs(blob, `${options.fileName}.docx`);
  } catch (error) {
    console.error('Error exporting to DOCX:', error);
    throw error;
  }
}

function calculateTotalWords(items: CryptItem[], excludedIds: Set<string>): number {
  return items
    .filter((item) => item.type === 'tombstone' && !excludedIds.has(item.id))
    .reduce((sum, item) => sum + item.wordCount, 0);
}
