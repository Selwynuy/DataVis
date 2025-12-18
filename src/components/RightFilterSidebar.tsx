'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

interface FilterSection {
  title: string;
  expanded: boolean;
  items?: string[];
}

export default function RightFilterSidebar() {
  const [tollFilters, setTollFilters] = useState({
    toll1: true,
    toll2: false,
    toll3: false
  });

  const [sections, setSections] = useState<FilterSection[]>([
    { title: 'Interactive Filters', expanded: true },
    { title: 'IP State Firearms', expanded: false },
    { title: 'Peaks Innovations', expanded: false },
    { title: 'Play', expanded: false },
    { title: 'Tunnels', expanded: false }
  ]);

  const toggleSection = (index: number) => {
    setSections(prev =>
      prev.map((section, i) =>
        i === index ? { ...section, expanded: !section.expanded } : section
      )
    );
  };

  return (
    <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-800">
        <h2 className="text-xl font-bold text-white">Interactive Filters</h2>
      </div>

      {/* Filteroove Section */}
      <div className="p-6 border-b border-slate-800">
        <h3 className="text-sm font-semibold text-slate-300 mb-4">Filteroove</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-slate-800/50 rounded-lg px-4 py-3">
            <span className="text-sm text-white">toll</span>
            <Switch
              checked={tollFilters.toll1}
              onCheckedChange={(checked) =>
                setTollFilters(prev => ({ ...prev, toll1: checked }))
              }
              className="data-[state=checked]:bg-blue-500"
            />
          </div>
          <div className="flex items-center justify-between bg-slate-800/50 rounded-lg px-4 py-3">
            <span className="text-sm text-white">toll</span>
            <Switch
              checked={tollFilters.toll2}
              onCheckedChange={(checked) =>
                setTollFilters(prev => ({ ...prev, toll2: checked }))
              }
              className="data-[state=checked]:bg-red-500"
            />
          </div>
          <div className="flex items-center justify-between bg-slate-800/50 rounded-lg px-4 py-3">
            <span className="text-sm text-white">toll</span>
            <Switch
              checked={tollFilters.toll3}
              onCheckedChange={(checked) =>
                setTollFilters(prev => ({ ...prev, toll3: checked }))
              }
              className="data-[state=checked]:bg-red-500"
            />
          </div>
        </div>
      </div>

      {/* Expandable Sections */}
      <div className="flex-1 overflow-y-auto">
        {sections.map((section, index) => (
          <div key={index} className="border-b border-slate-800">
            <button
              onClick={() => toggleSection(index)}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors"
            >
              <span className="text-sm font-medium text-slate-300">{section.title}</span>
              {section.expanded ? (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-400" />
              )}
            </button>
            {section.expanded && (
              <div className="px-4 pb-4 text-sm text-slate-400">
                <p>Filter options coming soon...</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
