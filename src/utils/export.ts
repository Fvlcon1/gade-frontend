import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Converts an array of objects to CSV format and triggers a download
 * @param data Array of objects to export
 * @param filename Name of the file to download (without extension)
 */
export const exportToCSV = (data: Record<string, any>[], filename: string) => {
  if (!data.length) return;

  // Get headers from the first object
  const headers = Object.keys(data[0]);

  // Convert data to CSV rows
  const csvRows = [
    headers.join(','), // Header row
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle values that contain commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ];

  // Create CSV content
  const csvContent = csvRows.join('\n');

  // Create blob and download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  // Set up download link
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';

  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Converts an array of objects to PDF format and triggers a download
 * @param data Array of objects to export
 * @param filename Name of the file to download (without extension)
 */
export const exportToPDF = (data: Record<string, any>[], filename: string) => {
  if (!data.length) return;

  // Create new PDF document
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(16);
  doc.text('Reports Export', 14, 15);
  
  // Add date
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);

  // Prepare table data
  const headers = Object.keys(data[0]);
  const rows = data.map(row => headers.map(header => row[header]));

  // Add table using autoTable
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 30,
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontSize: 9,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    columnStyles: {
      0: { cellWidth: 25 }, // Report ID
      1: { cellWidth: 40 }, // Title
      2: { cellWidth: 50 }, // Description
      3: { cellWidth: 35 }, // Location
      4: { cellWidth: 20 }, // Status
      5: { cellWidth: 20 }, // Priority
      6: { cellWidth: 30 }, // Created At
      7: { cellWidth: 30 }, // Last Updated
    },
  });

  // Save the PDF
  doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
}; 