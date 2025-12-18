'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface ProtocolData {
  protocol: string;
  sessionCount: number;
  attackCount: number;
  attackRate: number;
}

interface ProtocolAttackChartProps {
  data: ProtocolData[];
  selectedProtocols?: string[];
  onProtocolClick?: (protocol: string) => void;
}

export default function ProtocolAttackChart({ data, selectedProtocols = [], onProtocolClick }: ProtocolAttackChartProps) {
  const [hoveredProtocol, setHoveredProtocol] = useState<string | null>(null);
  return (
    <div className="flex flex-col">
      <h3 className="text-base font-semibold text-slate-200 mb-1">Attack Rate by Protocol</h3>
      <p className="text-xs text-slate-400 mb-2">Comparing malicious activity across network protocols</p>

      <div className="flex flex-col gap-2">
        {/* Scaled down for better viewport fit */}
        <div className="h-48 md:h-56 lg:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 20, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.25)" />
              <XAxis
                dataKey="protocol"
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                yAxisId="left"
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
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#3b82f6"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                label={{
                  value: 'Total Sessions',
                  angle: 90,
                  position: 'insideRight',
                  style: { fontSize: 11, fill: '#3b82f6' }
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
                        const name = entry.dataKey === 'attackRate' ? 'Attack Rate' : 'Total Sessions';
                        const value = entry.dataKey === 'attackRate' 
                          ? `${entry.value.toFixed(1)}%` 
                          : entry.value.toLocaleString();
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
                  if (value === 'attackRate') return 'Attack Rate (%)';
                  if (value === 'sessionCount') return 'Total Sessions';
                  return value;
                }}
              />
              <Bar 
                yAxisId="left" 
                dataKey="attackRate" 
                name="attackRate"
                onClick={(data: any) => {
                  if (data?.protocol) {
                    onProtocolClick?.(data.protocol);
                  }
                }}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-attack-${index}`}
                    fill={
                      selectedProtocols.includes(entry.protocol)
                        ? '#f97316'
                        : hoveredProtocol === entry.protocol
                        ? '#fb923c'
                        : '#f97316'
                    }
                    opacity={
                      selectedProtocols.length > 0 && !selectedProtocols.includes(entry.protocol)
                        ? 0.3
                        : hoveredProtocol === entry.protocol
                        ? 1
                        : selectedProtocols.includes(entry.protocol)
                        ? 1
                        : 0.7
                    }
                    style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
                    onMouseEnter={() => setHoveredProtocol(entry.protocol)}
                    onMouseLeave={() => setHoveredProtocol(null)}
                  />
                ))}
              </Bar>
              <Bar 
                yAxisId="right" 
                dataKey="sessionCount" 
                name="sessionCount"
                onClick={(data: any) => {
                  if (data?.protocol) {
                    onProtocolClick?.(data.protocol);
                  }
                }}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-session-${index}`}
                    fill={
                      selectedProtocols.includes(entry.protocol)
                        ? '#3b82f6'
                        : hoveredProtocol === entry.protocol
                        ? '#60a5fa'
                        : '#3b82f6'
                    }
                    opacity={
                      selectedProtocols.length > 0 && !selectedProtocols.includes(entry.protocol)
                        ? 0.3
                        : hoveredProtocol === entry.protocol
                        ? 1
                        : selectedProtocols.includes(entry.protocol)
                        ? 1
                        : 0.7
                    }
                    style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
                    onMouseEnter={() => setHoveredProtocol(entry.protocol)}
                    onMouseLeave={() => setHoveredProtocol(null)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Protocol Summary */}
        <div className="pt-3 pb-2 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {data.map(item => {
              const isSelected = selectedProtocols.includes(item.protocol);
              return (
                <div 
                  key={item.protocol} 
                  onClick={() => onProtocolClick?.(item.protocol)}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-orange-950/60 border-orange-500/60'
                      : 'bg-slate-900/50 border-slate-800/50 hover:bg-slate-800/70 hover:border-slate-700'
                  }`}
                >
                  <span className={`text-[11px] font-semibold ${isSelected ? 'text-orange-200' : 'text-slate-200'}`}>
                    {item.protocol}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {item.sessionCount.toLocaleString()} sessions
                  </span>
                  {isSelected && (
                    <span className="text-[10px] text-orange-400 ml-1">✓</span>
                  )}
                </div>
              );
            })}
          </div>
          {selectedProtocols.length > 0 && (
            <div className="mt-2 text-center">
              <button
                onClick={() => selectedProtocols.forEach(p => onProtocolClick?.(p))}
                className="text-xs text-slate-400 hover:text-slate-300 underline"
              >
                Clear protocol filter
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
