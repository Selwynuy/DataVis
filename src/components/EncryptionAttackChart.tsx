'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface EncryptionData {
  encryption: string;
  sessionCount: number;
  attackCount: number;
  cleanCount: number;
  attackRate: number;
}

interface EncryptionAttackChartProps {
  data: EncryptionData[];
  selectedEncryptions?: string[];
  onEncryptionClick?: (encryption: string) => void;
}

export default function EncryptionAttackChart({ data, selectedEncryptions = [], onEncryptionClick }: EncryptionAttackChartProps) {
  const [hoveredEncryption, setHoveredEncryption] = useState<string | null>(null);
  return (
    <div className="flex flex-col">
      <h3 className="text-base font-semibold text-slate-200 mb-1">
        Encryption Type vs Attack Outcome
      </h3>
      <p className="text-xs text-slate-400 mb-2">
        Distribution of attacks and clean sessions by encryption
      </p>

      <div className="flex flex-col gap-2">
        {/* Scaled down for better viewport fit */}
        <div className="h-24 md:h-28 lg:h-32">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.25)" />
              <XAxis
                dataKey="encryption"
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
                  value: 'Session Count',
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
                        const name = entry.dataKey === 'attackCount' ? 'Attacks' : 'Clean Sessions';
                        const value = entry.value.toLocaleString();
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
                  if (value === 'attackCount') return 'Attacks';
                  if (value === 'cleanCount') return 'Clean Sessions';
                  return value;
                }}
              />
              <Bar 
                dataKey="attackCount" 
                stackId="a" 
                name="attackCount"
                onClick={(data: any) => {
                  if (data?.encryption) {
                    onEncryptionClick?.(data.encryption);
                  }
                }}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-attack-${index}`}
                    fill={
                      selectedEncryptions.includes(entry.encryption)
                        ? '#ef4444'
                        : hoveredEncryption === entry.encryption
                        ? '#f87171'
                        : '#ef4444'
                    }
                    opacity={
                      selectedEncryptions.length > 0 && !selectedEncryptions.includes(entry.encryption)
                        ? 0.3
                        : hoveredEncryption === entry.encryption
                        ? 1
                        : selectedEncryptions.includes(entry.encryption)
                        ? 1
                        : 0.7
                    }
                    style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
                    onMouseEnter={() => setHoveredEncryption(entry.encryption)}
                    onMouseLeave={() => setHoveredEncryption(null)}
                  />
                ))}
              </Bar>
              <Bar 
                dataKey="cleanCount" 
                stackId="a" 
                name="cleanCount"
                onClick={(data: any) => {
                  if (data?.encryption) {
                    onEncryptionClick?.(data.encryption);
                  }
                }}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-clean-${index}`}
                    fill={
                      selectedEncryptions.includes(entry.encryption)
                        ? '#22c55e'
                        : hoveredEncryption === entry.encryption
                        ? '#4ade80'
                        : '#22c55e'
                    }
                    opacity={
                      selectedEncryptions.length > 0 && !selectedEncryptions.includes(entry.encryption)
                        ? 0.3
                        : hoveredEncryption === entry.encryption
                        ? 1
                        : selectedEncryptions.includes(entry.encryption)
                        ? 1
                        : 0.7
                    }
                    style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
                    onMouseEnter={() => setHoveredEncryption(entry.encryption)}
                    onMouseLeave={() => setHoveredEncryption(null)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Attack Rate Summary */}
        <div className="pt-2 border-t border-slate-800/80 overflow-y-auto max-h-24">
          <div className="grid grid-cols-3 gap-2">
            {data.map(item => {
              const isSelected = selectedEncryptions.includes(item.encryption);
              return (
                <div 
                  key={item.encryption} 
                  onClick={() => onEncryptionClick?.(item.encryption)}
                  className={`flex flex-col p-1 rounded border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-red-950/40 border-red-500/60'
                      : 'hover:bg-slate-800/50 border-transparent'
                  }`}
                >
                  <span className={`text-[11px] font-medium ${isSelected ? 'text-red-200' : 'text-slate-300'}`}>
                    {item.encryption}
                  </span>
                  <span className={`text-xs font-semibold ${isSelected ? 'text-red-300' : 'text-orange-400'}`}>
                    {item.attackRate.toFixed(1)}% attack rate
                  </span>
                  {isSelected && (
                    <span className="text-[10px] text-red-400 mt-0.5">✓ Selected</span>
                  )}
                </div>
              );
            })}
          </div>
          {selectedEncryptions.length > 0 && (
            <div className="mt-2 text-center">
              <button
                onClick={() => selectedEncryptions.forEach(e => onEncryptionClick?.(e))}
                className="text-xs text-slate-400 hover:text-slate-300 underline"
              >
                Clear encryption filter
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
