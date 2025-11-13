import React from "react";
import { Download, FileText, Table } from 'lucide-react';

export default function ReportDownload({ title, data, filename }) {
  const downloadPDF = () => {
    alert('PDF report generation coming soon! This will download a detailed PDF report.');
  };

  const downloadExcel = () => {
    // Simple CSV download for now
    const csvContent = convertToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const convertToCSV = (data) => {
    if (!data || data.length === 0) return '';
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => 
      Object.values(row).map(value => 
        typeof value === 'string' && value.includes(',') ? `"${value}"` : value
      ).join(',')
    );
    
    return [headers, ...rows].join('\n');
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={downloadPDF}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 transition-colors"
      >
        <FileText size={18} />
        Download PDF
      </button>
      <button
        onClick={downloadExcel}
        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors"
      >
        <Table size={18} />
        Download Excel
      </button>
    </div>
  );
}
