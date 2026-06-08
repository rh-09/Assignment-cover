import * as htmlToImage from 'html-to-image';
import { jsPDF } from 'jspdf';

/**
 * Exports a DOM element as a highly refined PDF in A4 Portrait aspect ratio.
 */
export const exportToPdf = async (elementId: string, fileName: string): Promise<boolean> => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error('Target element not found for PDF export:', elementId);
      return false;
    }

    // Capture the element directly. (We intentionally include block selection outlines/blue boxes in the PDF output as requested)
    const imgData = await htmlToImage.toPng(element, {
      pixelRatio: 2.2,
      backgroundColor: '#ffffff',
      style: {
        transform: 'none',
        left: '0',
        top: '0',
        position: 'relative'
      },
      cacheBust: true,
    });

    if (!imgData) {
      throw new Error('Image conversion yielded an empty result.');
    }

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();   // 210mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
    pdf.save(fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`);
    return true;
  } catch (error) {
    console.error('Failed to export PDF:', error);
    return false;
  }
};
