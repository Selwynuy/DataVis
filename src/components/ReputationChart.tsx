'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, ComposedChart, Dot } from 'recharts';

interface ReputationBucket {
  bucket: string;
  min: number;
  max: number;
  sessionCount: number;
  attackCount: number;
  attackRate: number;
}

interface ReputationChartProps {
  data: ReputationBucket[];
  selectedRiskLevel?: 'high' | 'medium' | 'low' | null;
  onRiskLevelClick?: (riskLevel: 'high' | 'medium' | 'low' | null) => void;
}

export default function ReputationChart({ data, selectedRiskLevel = null, onRiskLevelClick }: ReputationChartProps) {
  const [hoveredBucket, setHoveredBucket] = useState<string | null>(null);
  return (
    <div className="flex flex-col">
      <h3 className="text-base font-semibold text-slate-200 mb-1">
        Attack Rate vs IP Reputation Score
      </h3>
      <p className="text-xs text-slate-400 mb-2">
        Lower reputation scores correlate with higher attack rates
      </p>

      <div className="flex flex-col gap-2">
        {/* Scaled down for better viewport fit */}
        <div className="h-48 md:h-56 lg:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 5, right: 20, left: 10, bottom: 85 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.25)" />
              <XAxis
                dataKey="bucket"
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                label={{
                  value: 'IP Reputation Score',
                  position: 'bottom',
                  offset: 28,
                  style: { fontSize: 11, fill: '#94a3b8' }
                }}
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
                  position: 'left',
                  offset: 5,
                  style: { fontSize: 11, fill: '#94a3b8' }
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                label={{
                  value: 'Total Sessions',
                  angle: 90,
                  position: 'right',
                  offset: 5,
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
                        const name = entry.dataKey === 'attackRate' ? 'Attack Rate' : 'Sessions';
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
                wrapperStyle={{ fontSize: 12, paddingTop: '8px', paddingBottom: '15px', display: 'flex', justifyContent: 'center', gap: '20px' }}
                iconType="line"
                formatter={(value: string) => {
                  if (value === 'attackRate') return 'Attack Rate (%)';
                  if (value === 'sessionCount') return 'Total Sessions';
                  return value;
                }}
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                iconSize={12}
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="sessionCount"
                fill="#1d4ed8"
                stroke="#60a5fa"
                fillOpacity={0.25}
                name="sessionCount"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="attackRate"
                stroke="#ef4444"
                strokeWidth={3}
                dot={(props: any) => {
                  const bucket = props.payload?.bucket || '';
                  const isHighRisk = props.payload?.min < 0.3;
                  const isMediumRisk = props.payload?.min >= 0.3 && props.payload?.min < 0.7;
                  const isLowRisk = props.payload?.min >= 0.7;
                  const isSelected = 
                    (selectedRiskLevel === 'high' && isHighRisk) ||
                    (selectedRiskLevel === 'medium' && isMediumRisk) ||
                    (selectedRiskLevel === 'low' && isLowRisk);
                  const isHovered = hoveredBucket === bucket;
                  
                  return (
                    <Dot
                      {...props}
                      fill={isSelected ? '#f87171' : '#ef4444'}
                      r={isHovered || isSelected ? 5 : 3}
                      style={{ cursor: 'pointer', transition: 'r 0.2s' }}
                      onClick={() => {
                        if (isHighRisk) onRiskLevelClick?.('high');
                        else if (isMediumRisk) onRiskLevelClick?.('medium');
                        else if (isLowRisk) onRiskLevelClick?.('low');
                      }}
                      onMouseEnter={() => setHoveredBucket(bucket)}
                      onMouseLeave={() => setHoveredBucket(null)}
                    />
                  );
                }}
                name="attackRate"
                onMouseEnter={(data: any) => setHoveredBucket(data?.payload?.bucket || null)}
                onMouseLeave={() => setHoveredBucket(null)}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Bands */}
        <div className="pt-2 border-t border-slate-800/80 text-[11px] grid grid-cols-3 gap-2">
          <div 
            onClick={() => onRiskLevelClick?.(selectedRiskLevel === 'high' ? null : 'high')}
            className={`flex flex-col p-2 border rounded cursor-pointer transition-all ${
              selectedRiskLevel === 'high'
                ? 'bg-red-950/60 border-red-500/80'
                : 'bg-red-950/40 border-red-500/40 hover:bg-red-950/50 hover:border-red-500/60'
            }`}
          >
            <span className="font-medium text-red-200 flex items-center gap-1">
              High Risk (0.0-0.3)
              {selectedRiskLevel === 'high' && <span className="text-xs">✓</span>}
            </span>
            <span className="text-xs font-bold text-red-300">
              {data
                .filter(d => d.min < 0.3)
                .reduce((sum, d) => sum + d.attackCount, 0)
                .toLocaleString()}{' '}
              attacks
            </span>
          </div>
          <div 
            onClick={() => onRiskLevelClick?.(selectedRiskLevel === 'medium' ? null : 'medium')}
            className={`flex flex-col p-2 border rounded cursor-pointer transition-all ${
              selectedRiskLevel === 'medium'
                ? 'bg-yellow-950/60 border-yellow-500/80'
                : 'bg-yellow-950/40 border-yellow-500/40 hover:bg-yellow-950/50 hover:border-yellow-500/60'
            }`}
          >
            <span className="font-medium text-yellow-200 flex items-center gap-1">
              Medium Risk (0.3-0.7)
              {selectedRiskLevel === 'medium' && <span className="text-xs">✓</span>}
            </span>
            <span className="text-xs font-bold text-yellow-200">
              {data
                .filter(d => d.min >= 0.3 && d.min < 0.7)
                .reduce((sum, d) => sum + d.attackCount, 0)
                .toLocaleString()}{' '}
              attacks
            </span>
          </div>
          <div 
            onClick={() => onRiskLevelClick?.(selectedRiskLevel === 'low' ? null : 'low')}
            className={`flex flex-col p-2 border rounded cursor-pointer transition-all ${
              selectedRiskLevel === 'low'
                ? 'bg-emerald-950/60 border-emerald-500/80'
                : 'bg-emerald-950/40 border-emerald-500/40 hover:bg-emerald-950/50 hover:border-emerald-500/60'
            }`}
          >
            <span className="font-medium text-emerald-200 flex items-center gap-1">
              Low Risk (0.7-1.0)
              {selectedRiskLevel === 'low' && <span className="text-xs">✓</span>}
            </span>
            <span className="text-xs font-bold text-emerald-200">
              {data
                .filter(d => d.min >= 0.7)
                .reduce((sum, d) => sum + d.attackCount, 0)
                .toLocaleString()}{' '}
              attacks
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
