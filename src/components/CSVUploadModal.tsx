'use client';

import { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { IntrusionData } from '@/lib/dataLoader';

interface CSVUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDataLoaded: (data: IntrusionData[]) => void;
  required?: boolean; // If true, modal cannot be closed without uploading data
}

export default function CSVUploadModal({ open, onOpenChange, onDataLoaded, required = false }: CSVUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseCSV = (csvText: string): IntrusionData[] => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('CSV file must have at least a header row and one data row');
    }

    // Skip header row and parse data
    const data: IntrusionData[] = lines.slice(1).map((line, index) => {
      const values = line.split(',').map(v => v.trim());
      
      if (values.length < 11) {
        throw new Error(`Row ${index + 2} has insufficient columns. Expected 11 columns.`);
      }

      return {
        sessionId: values[0] || `session-${index}`,
        networkPacketSize: parseFloat(values[1]) || 0,
        protocolType: values[2] || 'Unknown',
        loginAttempts: parseInt(values[3]) || 0,
        sessionDuration: parseFloat(values[4]) || 0,
        encryptionUsed: values[5] || 'None',
        ipReputationScore: parseFloat(values[6]) || 0.5,
        failedLogins: parseInt(values[7]) || 0,
        browserType: values[8] || 'Unknown',
        unusualTimeAccess: parseInt(values[9]) === 1,
        attackDetected: parseInt(values[10]) === 1
      };
    });

    return data.filter(row => row.sessionId); // Filter out empty rows
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv')) {
        setError('Please select a CSV file');
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const text = await file.text();
      const data = parseCSV(text);
      
      if (data.length === 0) {
        throw new Error('No valid data rows found in CSV file');
      }

      onDataLoaded(data);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse CSV file');
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith('.csv')) {
      setFile(droppedFile);
      setError(null);
    } else {
      setError('Please drop a CSV file');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <Dialog open={open} onOpenChange={required ? undefined : onOpenChange}>
      <DialogContent 
        className={`sm:max-w-md ${required ? '[&>button]:hidden' : ''}`}
        onInteractOutside={required ? (e) => e.preventDefault() : undefined} 
        onEscapeKeyDown={required ? (e) => e.preventDefault() : undefined}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-blue-400" />
            Upload CSV Dataset
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Drop zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              file
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-slate-700 hover:border-slate-600 bg-slate-900/50'
            }`}
          >
            {file ? (
              <div className="flex flex-col items-center gap-2">
                <CheckCircle2 className="w-8 h-8 text-blue-400" />
                <p className="text-sm font-medium text-slate-200">{file.name}</p>
                <p className="text-xs text-slate-400">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <FileText className="w-12 h-12 text-slate-400" />
                <div className="flex flex-col items-center gap-2">
                  <p className="text-sm text-slate-300">
                    Drag and drop your CSV file here
                  </p>
                  <p className="text-xs text-slate-500">or</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="csv-upload"
                  />
                  <Button
                    variant="outline"
                    size="default"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-1 border-slate-700 bg-slate-900/50 text-slate-300 hover:bg-slate-800 hover:text-slate-100 hover:border-blue-500/50 font-medium"
                  >
                    <Upload className="w-4 h-4 mr-2 text-blue-400" />
                    Browse Files
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            {!required && (
              <Button
                variant="ghost"
                onClick={() => {
                  onOpenChange(false);
                  setFile(null);
                  setError(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
              >
                Cancel
              </Button>
            )}
            <Button
              onClick={handleUpload}
              disabled={!file || loading}
              className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
            >
              {loading ? 'Uploading...' : 'Load'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

