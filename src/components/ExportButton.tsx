'use client';

import { Download } from 'lucide-react';

interface ExportButtonProps {
  data: any;
  filename?: string;
}

export default function ExportButton({ data, filename = 'security-report' }: ExportButtonProps) {
  const exportToJSON = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    if (!data.events || data.events.length === 0) return;

    const headers = ['ID', 'Timestamp', 'Attack Type', 'Source IP', 'Target IP', 'Severity', 'Risk Score', 'Network Segment', 'Blocked', 'Description'];
    const csvRows = [headers.join(',')];

    data.events.forEach((event: any) => {
      const row = [
        event.id,
        new Date(event.timestamp).toISOString(),
        event.attackType,
        event.sourceIP,
        event.targetIP,
        event.severity,
        event.riskScore,
        event.networkSegment,
        event.blocked,
        `"${event.description}"`
      ];
      csvRows.push(row.join(','));
    });

    const csvString = csvRows.join('\n');
    const csvBlob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(csvBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
        <Download className="w-4 h-4" />
        Export Report
      </button>

      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
        <button
          onClick={exportToJSON}
          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-t-lg transition-colors"
        >
          Export as JSON
        </button>
        <button
          onClick={exportToCSV}
          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-b-lg transition-colors"
        >
          Export as CSV
        </button>
      </div>
    </div>
  );
}
