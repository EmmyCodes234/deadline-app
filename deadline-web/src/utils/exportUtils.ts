import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  PageBreak,
} from 'docx';
import { saveAs } from 'file-saver';

export async function exportToDocx(text: string, wordCount: number): Promise<void> {
  try {
    // Split text into paragraphs
    const paragraphs = text.split('\n').filter((p) => p.trim().length > 0);

    // Create the document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            // Title Page
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: {
                before: 2000,
                after: 400,
              },
              children: [
                new TextRun({
                  text: 'DEADLINE DRAFT',
                  bold: true,
                  size: 48, // 24pt (size is in half-points)
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
                  text: `Word Count: ${wordCount}`,
                  size: 24, // 12pt
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
                  size: 24, // 12pt
                  font: 'Times New Roman',
                  italics: true,
                }),
              ],
            }),

            // Page Break
            new Paragraph({
              children: [new PageBreak()],
            }),

            // Body - User's text
            ...paragraphs.map(
              (para) =>
                new Paragraph({
                  spacing: {
                    line: 480, // Double spacing (240 = single, 480 = double)
                    after: 240,
                  },
                  children: [
                    new TextRun({
                      text: para,
                      size: 24, // 12pt
                      font: 'Times New Roman',
                    }),
                  ],
                })
            ),
          ],
        },
      ],
    });

    // Generate the blob
    const blob = await Packer.toBlob(doc);

    // Trigger download
    saveAs(blob, 'deadline_manuscript.docx');
  } catch (error) {
    console.error('Error exporting to DOCX:', error);
    throw error;
  }
}
