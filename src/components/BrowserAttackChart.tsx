'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface BrowserData {
  browser: string;
  sessionCount: number;
  attackCount: number;
  attackRate: number;
  offHoursAttackRate: number;
}

interface BrowserAttackChartProps {
  data: BrowserData[];
  selectedBrowsers?: string[];
  onBrowserClick?: (browser: string) => void;
}

export default function BrowserAttackChart({ data, selectedBrowsers = [], onBrowserClick }: BrowserAttackChartProps) {
  const [hoveredBrowser, setHoveredBrowser] = useState<string | null>(null);
  return (
    <div className="flex flex-col">
      <h3 className="text-base font-semibold text-slate-200 mb-1">
        Attack Rate by Browser Type
      </h3>
      <p className="text-xs text-slate-400 mb-2">
        Comparing attack rates across browsers and off-hours activity
      </p>

      <div className="flex flex-col gap-2">
        {/* Scaled down for better viewport fit */}
        <div className="h-48 md:h-56 lg:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.25)" />
              <XAxis
                dataKey="browser"
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                label={{
                  value: 'Attack Rate (%)',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fontSize: 11, fill: '#94a3b8' }
                }}
              />
              <Tooltip
                cursor={{ fill: 'rgba(148,163,184,0.08)' }}
                content={({ active, payload, label }) => {
                  if (!active || !payload || !payload.length) return null;
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-950 border border-slate-700 rounded px-2 py-1.5 text-xs">
                      <div className="font-semibold text-slate-100 mb-1">{label}</div>
                      {payload.map((entry: any, index: number) => {
                        const name = entry.dataKey === 'attackRate' 
                          ? 'Overall Attack Rate' 
                          : 'Off-Hours Attack Rate';
                        const value = `${entry.value.toFixed(1)}%`;
                        return (
                          <div key={index} className="text-slate-300 leading-tight">
                            {name}: {value}
                          </div>
                        );
                      })}
                    </div>
                  );
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: 12 }}
                formatter={(value: string) => {
                  if (value === 'attackRate') return 'Overall Attack Rate';
                  if (value === 'offHoursAttackRate') return 'Off-Hours Attack Rate';
                  return value;
                }}
              />
              <Bar 
                dataKey="attackRate" 
                name="attackRate"
                onClick={(data: any) => {
                  if (data?.browser) {
                    onBrowserClick?.(data.browser);
                  }
                }}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-attack-${index}`}
                    fill={
                      selectedBrowsers.includes(entry.browser)
                        ? '#f97316'
                        : hoveredBrowser === entry.browser
                        ? '#fb923c'
                        : '#f97316'
                    }
                    opacity={
                      selectedBrowsers.length > 0 && !selectedBrowsers.includes(entry.browser)
                        ? 0.3
                        : hoveredBrowser === entry.browser
                        ? 1
                        : selectedBrowsers.includes(entry.browser)
                        ? 1
                        : 0.7
                    }
                    style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
                    onMouseEnter={() => setHoveredBrowser(entry.browser)}
                    onMouseLeave={() => setHoveredBrowser(null)}
                  />
                ))}
              </Bar>
              <Bar 
                dataKey="offHoursAttackRate" 
                name="offHoursAttackRate"
                onClick={(data: any) => {
                  if (data?.browser) {
                    onBrowserClick?.(data.browser);
                  }
                }}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-offhours-${index}`}
                    fill={
                      selectedBrowsers.includes(entry.browser)
                        ? '#9333ea'
                        : hoveredBrowser === entry.browser
                        ? '#a855f7'
                        : '#9333ea'
                    }
                    opacity={
                      selectedBrowsers.length > 0 && !selectedBrowsers.includes(entry.browser)
                        ? 0.3
                        : hoveredBrowser === entry.browser
                        ? 1
                        : selectedBrowsers.includes(entry.browser)
                        ? 1
                        : 0.7
                    }
                    style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
                    onMouseEnter={() => setHoveredBrowser(entry.browser)}
                    onMouseLeave={() => setHoveredBrowser(null)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Browser Summary */}
        <div className="pt-3 pb-2 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {data.map(item => {
              const isSelected = selectedBrowsers.includes(item.browser);
              return (
                <div 
                  key={item.browser} 
                  onClick={() => onBrowserClick?.(item.browser)}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-orange-950/60 border-orange-500/60'
                      : 'bg-slate-900/50 border-slate-800/50 hover:bg-slate-800/70 hover:border-slate-700'
                  }`}
                >
                  <span className={`text-[11px] font-semibold ${isSelected ? 'text-orange-200' : 'text-slate-200'}`}>
                    {item.browser}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {item.sessionCount.toLocaleString()}
                  </span>
                  {isSelected && (
                    <span className="text-[10px] text-orange-400 ml-1">✓</span>
                  )}
                </div>
              );
            })}
          </div>
          {selectedBrowsers.length > 0 && (
            <div className="mt-2 text-center">
              <button
                onClick={() => selectedBrowsers.forEach(b => onBrowserClick?.(b))}
                className="text-xs text-slate-400 hover:text-slate-300 underline"
              >
                Clear browser filter
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
