// src/utils/exportUtils.js
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // This extends jsPDF with the autoTable method

/**
 * Generic function to trigger a file download in the browser.
 * @param {BlobPart} content - The content to be downloaded (e.g., CSV string, Blob).
 * @param {string} filename - The name of the file (e.g., 'data.csv').
 * @param {string} type - The MIME type of the file (e.g., 'text/csv', 'application/pdf').
 */
export const downloadFile = (content, filename, type) => {
  const blob = new Blob([content], { type: type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url); // Clean up the object URL
};

/**
 * Exports data to a CSV file.
 * Assumes data is an array of objects where keys are headers.
 * @param {Array<Object>} data - The array of data objects to export.
 * @param {string} filename - The name of the CSV file (e.g., 'users.csv').
 */
export const exportToCSV = (data, filename = 'export.csv') => {
  if (!data || data.length === 0) {
    console.warn('No data provided for CSV export.');
    return;
  }

  const ws = XLSX.utils.json_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(ws);
  downloadFile(csv, filename, 'text/csv;charset=utf-8;');
};

/**
 * Exports data to an Excel (.xlsx) file.
 * Assumes data is an array of objects where keys are headers.
 * @param {Array<Object>} data - The array of data objects to export.
 * @param {string} filename - The name of the Excel file (e.g., 'users.xlsx').
 * @param {string} sheetName - The name of the sheet within the Excel file.
 */
export const exportToExcel = (data, filename = 'export.xlsx', sheetName = 'Sheet1') => {
  if (!data || data.length === 0) {
    console.warn('No data provided for Excel export.');
    return;
  }

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

  downloadFile(excelBuffer, filename, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
};

/**
 * Exports data to a PDF file using jspdf-autotable.
 * Assumes data is an array of objects. Headers are derived from object keys or provided.
 * @param {Array<Object>} data - The array of data objects to export.
 * @param {string} filename - The name of the PDF file (e.g., 'report.pdf').
 * @param {string} title - The title for the PDF document.
 * @param {Array<string> | null} [headers=null] - Optional array of header strings. If null, derived from data keys.
 */
export const exportToPDF = (data, filename = 'report.pdf', title = 'Report', headers = null) => {
  if (!data || data.length === 0) {
    console.warn('No data provided for PDF export.');
    return;
  }

  const doc = new jsPDF();
  doc.text(title, 14, 20); // Add title to the PDF

  // If headers are not provided, derive them from the keys of the first data object
  const tableHeaders = headers || Object.keys(data[0]);

  // Convert data objects to an array of arrays for autoTable
  const tableData = data.map(row => tableHeaders.map(header => row[header]));

  doc.autoTable({
    head: [tableHeaders],
    body: tableData,
    startY: 30, // Start table below the title
    theme: 'striped', // Optional: 'striped', 'grid', 'plain'
    headStyles: {
      fillColor: [48, 63, 159], // Example: Indigo color for header
      textColor: 255,
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    margin: { top: 10, right: 10, bottom: 10, left: 10 }
  });

  downloadFile(doc.output('blob'), filename, 'application/pdf');
};