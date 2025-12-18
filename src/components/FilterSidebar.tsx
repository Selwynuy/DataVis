'use client';

import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import type { AttackType, Severity, NetworkSegment } from '@/lib/mockData';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onFilterChange?: (filters: FilterState) => void;
}

export interface FilterState {
  attackTypes: AttackType[];
  severities: Severity[];
  networkSegments: NetworkSegment[];
  ipAddress: string;
}

export default function FilterSidebar({ isOpen, onClose, onFilterChange }: FilterSidebarProps) {
  const [filters, setFilters] = useState<FilterState>({
    attackTypes: [],
    severities: [],
    networkSegments: [],
    ipAddress: ''
  });

  const attackTypes: AttackType[] = ['DoS', 'Probe', 'R2L', 'U2R'];
  const severities: Severity[] = ['critical', 'high', 'medium', 'low'];
  const networkSegments: NetworkSegment[] = ['DMZ', 'Internal', 'External', 'Cloud'];

  const toggleFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K] extends Array<infer T> ? T : never
  ) => {
    setFilters(prev => {
      const currentArray = prev[key] as any[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];

      const newFilters = { ...prev, [key]: newArray };
      onFilterChange?.(newFilters);
      return newFilters;
    });
  };

  const handleIPChange = (ip: string) => {
    const newFilters = { ...filters, ipAddress: ip };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      attackTypes: [],
      severities: [],
      networkSegments: [],
      ipAddress: ''
    };
    setFilters(clearedFilters);
    onFilterChange?.(clearedFilters);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      ></div>

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl z-50 overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-700" />
              <h2 className="text-lg font-semibold text-slate-800">Filters</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* Attack Type Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Attack Type</h3>
            <div className="space-y-2">
              {attackTypes.map(type => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.attackTypes.includes(type)}
                    onChange={() => toggleFilter('attackTypes', type)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Severity Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Severity</h3>
            <div className="space-y-2">
              {severities.map(severity => (
                <label key={severity} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.severities.includes(severity)}
                    onChange={() => toggleFilter('severities', severity)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700 capitalize">{severity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Network Segment Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Network Segment</h3>
            <div className="space-y-2">
              {networkSegments.map(segment => (
                <label key={segment} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.networkSegments.includes(segment)}
                    onChange={() => toggleFilter('networkSegments', segment)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">{segment}</span>
                </label>
              ))}
            </div>
          </div>

          {/* IP Address Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">IP Address</h3>
            <input
              type="text"
              placeholder="e.g., 192.168.1.1"
              value={filters.ipAddress}
              onChange={(e) => handleIPChange(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Clear Filters Button */}
          <button
            onClick={clearFilters}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      </div>
    </>
  );
}
