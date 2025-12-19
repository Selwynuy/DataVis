'use client';

import { useState } from 'react';
import { Home, ChevronDown, ChevronRight, ChevronLeft, Menu, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export interface FilterState {
  attackOutcome: 'all' | 'attacks' | 'clean';
  timeOfAccess: 'all' | 'business' | 'off-hours';
  loginAttemptsMin: number;
  loginAttemptsMax: number;
  failedLoginsMin: number;
  failedLoginsMax: number;
  behaviorCells: Array<{ loginAttemptsLabel: string; failedLoginsLabel: string }>;
  protocols: string[];
  encryptions: string[];
  browsers: string[];
  reputationRisk: 'all' | 'high' | 'medium' | 'low';
}

interface LeftSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function LeftSidebar({ filters, onFilterChange, isCollapsed, onToggleCollapse }: LeftSidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    outcome: true,
    time: false,
    auth: false,
    technical: false,
    risk: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key: 'protocols' | 'encryptions' | 'browsers', value: string) => {
    const currentArray = filters[key];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(v => v !== value)
      : [...currentArray, value];
    onFilterChange({ ...filters, [key]: newArray });
  };

  if (isCollapsed) {
    return (
      <div className="fixed left-0 top-0 h-screen w-12 bg-slate-900 border-r border-slate-800 flex flex-col items-center py-3 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="text-white hover:bg-slate-800 p-2"
          title="Expand sidebar"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col overflow-y-auto z-10">
      {/* Branding Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" />
            <h1 className="text-sm font-bold text-white">Network Intrusion Detection</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="text-white hover:bg-slate-800 p-1 h-auto"
            title="Collapse sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-slate-400">SOC Monitoring & Threat Analysis</p>
      </div>

      {/* Filters Header */}
      <div className="p-3 border-b border-slate-800">
        <div className="flex items-center gap-2 text-white">
          <Home className="w-4 h-4" />
          <span className="font-semibold text-sm">Filters</span>
        </div>
        <p className="text-xs text-slate-400 mt-1">Slice dataset by behavior & risk</p>
      </div>

      {/* Filter Sections */}
      <div className="flex-1">
        {/* Attack Outcome */}
        <div className="border-b border-slate-800">
          <button
            onClick={() => toggleSection('outcome')}
            className="w-full flex items-center justify-between p-3 hover:bg-slate-800/50 transition-colors"
          >
            <span className="text-xs font-medium text-slate-300">Attack Outcome</span>
            {expandedSections.outcome ? (
              <ChevronDown className="w-3 h-3 text-slate-400" />
            ) : (
              <ChevronRight className="w-3 h-3 text-slate-400" />
            )}
          </button>
          {expandedSections.outcome && (
            <div className="px-3 pb-3 space-y-1.5">
              {['all', 'attacks', 'clean'].map(option => (
                <label key={option} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="attackOutcome"
                    checked={filters.attackOutcome === option}
                    onChange={() => updateFilter('attackOutcome', option)}
                    className="w-3.5 h-3.5"
                  />
                  <span className="text-xs text-slate-300 capitalize">{option === 'all' ? 'All' : option === 'attacks' ? 'Attacks Only' : 'Clean Only'}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Time of Access */}
        <div className="border-b border-slate-800">
          <button
            onClick={() => toggleSection('time')}
            className="w-full flex items-center justify-between p-3 hover:bg-slate-800/50 transition-colors"
          >
            <span className="text-xs font-medium text-slate-300">Time of Access</span>
            {expandedSections.time ? (
              <ChevronDown className="w-3 h-3 text-slate-400" />
            ) : (
              <ChevronRight className="w-3 h-3 text-slate-400" />
            )}
          </button>
          {expandedSections.time && (
            <div className="px-3 pb-3 space-y-1.5">
              {['all', 'business', 'off-hours'].map(option => (
                <label key={option} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="timeOfAccess"
                    checked={filters.timeOfAccess === option}
                    onChange={() => updateFilter('timeOfAccess', option)}
                    className="w-3.5 h-3.5"
                  />
                  <span className="text-xs text-slate-300 capitalize">
                    {option === 'all' ? 'All' : option === 'business' ? 'Business Hours' : 'Off-Hours'}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Technical Filters */}
        <div className="border-b border-slate-800">
          <button
            onClick={() => toggleSection('technical')}
            className="w-full flex items-center justify-between p-3 hover:bg-slate-800/50 transition-colors"
          >
            <span className="text-xs font-medium text-slate-300">Technical</span>
            {expandedSections.technical ? (
              <ChevronDown className="w-3 h-3 text-slate-400" />
            ) : (
              <ChevronRight className="w-3 h-3 text-slate-400" />
            )}
          </button>
          {expandedSections.technical && (
            <div className="px-3 pb-3 space-y-2">
              <div>
                <p className="text-xs text-slate-400 mb-1.5 font-medium">Protocol</p>
                {['TCP', 'UDP', 'ICMP'].map(protocol => (
                  <label key={protocol} className="flex items-center gap-2 cursor-pointer mb-1">
                    <input
                      type="checkbox"
                      checked={filters.protocols.includes(protocol)}
                      onChange={() => toggleArrayFilter('protocols', protocol)}
                      className="w-3.5 h-3.5"
                    />
                    <span className="text-xs text-slate-300">{protocol}</span>
                  </label>
                ))}
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1.5 font-medium">Encryption</p>
                {['AES', 'DES', 'None'].map(encryption => (
                  <label key={encryption} className="flex items-center gap-2 cursor-pointer mb-1">
                    <input
                      type="checkbox"
                      checked={filters.encryptions.includes(encryption)}
                      onChange={() => toggleArrayFilter('encryptions', encryption)}
                      className="w-3.5 h-3.5"
                    />
                    <span className="text-xs text-slate-300">{encryption}</span>
                  </label>
                ))}
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1.5 font-medium">Browser</p>
                {['Chrome', 'Firefox', 'Edge', 'Safari', 'Unknown'].map(browser => (
                  <label key={browser} className="flex items-center gap-2 cursor-pointer mb-1">
                    <input
                      type="checkbox"
                      checked={filters.browsers.includes(browser)}
                      onChange={() => toggleArrayFilter('browsers', browser)}
                      className="w-3.5 h-3.5"
                    />
                    <span className="text-xs text-slate-300">{browser}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Risk Filters */}
        <div className="border-b border-slate-800">
          <button
            onClick={() => toggleSection('risk')}
            className="w-full flex items-center justify-between p-3 hover:bg-slate-800/50 transition-colors"
          >
            <span className="text-xs font-medium text-slate-300">IP Reputation</span>
            {expandedSections.risk ? (
              <ChevronDown className="w-3 h-3 text-slate-400" />
            ) : (
              <ChevronRight className="w-3 h-3 text-slate-400" />
            )}
          </button>
          {expandedSections.risk && (
            <div className="px-3 pb-3 space-y-1.5">
              {['all', 'high', 'medium', 'low'].map(risk => (
                <label key={risk} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="reputationRisk"
                    checked={filters.reputationRisk === risk}
                    onChange={() => updateFilter('reputationRisk', risk)}
                    className="w-3.5 h-3.5"
                  />
                  <span className="text-xs text-slate-300 capitalize">
                    {risk === 'all' ? 'All' : risk === 'high' ? 'High (0-0.3)' : risk === 'medium' ? 'Med (0.3-0.7)' : 'Low (0.7-1.0)'}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="p-3 border-t border-slate-800">
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-xs text-slate-300 hover:bg-slate-900/80 hover:text-slate-100 active:bg-slate-900 cursor-pointer transition-colors"
          onClick={() => onFilterChange({
            attackOutcome: 'all',
            timeOfAccess: 'all',
            loginAttemptsMin: 0,
            loginAttemptsMax: 99,
            failedLoginsMin: 0,
            failedLoginsMax: 99,
            behaviorCells: [],
            protocols: [],
            encryptions: [],
            browsers: [],
            reputationRisk: 'all'
          })}
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
