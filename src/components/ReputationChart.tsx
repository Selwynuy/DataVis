'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, ComposedChart } from 'recharts';

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
}

export default function ReputationChart({ data }: ReputationChartProps) {
  return (
    <div className="flex flex-col h-full">
      <h3 className="text-base font-semibold text-slate-200 mb-1">
        Attack Rate vs IP Reputation Score
      </h3>
      <p className="text-xs text-slate-400 mb-2">
        Lower reputation scores correlate with higher attack rates
      </p>

      <div className="flex flex-col gap-2">
        {/* Fixed but responsive chart height for lower row */}
        <div className="h-36 md:h-40 lg:h-44">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
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
                  position: 'insideBottom',
                  offset: -5,
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
                  position: 'insideLeft',
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
                  value: 'Sessions',
                  angle: 90,
                  position: 'insideRight',
                  style: { fontSize: 11, fill: '#94a3b8' }
                }}
              />
              <Tooltip
                cursor={{ fill: 'rgba(148,163,184,0.08)' }}
                contentStyle={{
                  backgroundColor: '#020617',
                  border: '1px solid #1e293b',
                  borderRadius: 6,
                  fontSize: 12,
                  color: '#e2e8f0'
                }}
                formatter={(value: number, name: string) => {
                  if (name === 'attackRate') return [`${value.toFixed(1)}%`, 'Attack Rate'];
                  if (name === 'sessionCount') return [value, 'Sessions'];
                  return [value, name];
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
                dot={{ fill: '#ef4444', r: 3 }}
                name="attackRate"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Bands */}
        <div className="pt-2 border-t border-slate-800/80 text-[11px] grid grid-cols-3 gap-2">
          <div className="flex flex-col p-2 bg-red-950/40 border border-red-500/40 rounded">
            <span className="font-medium text-red-200">High Risk (0.0-0.3)</span>
            <span className="text-xs font-bold text-red-300">
              {data
                .filter(d => d.min < 0.3)
                .reduce((sum, d) => sum + d.attackCount, 0)
                .toLocaleString()}{' '}
              attacks
            </span>
          </div>
          <div className="flex flex-col p-2 bg-yellow-950/40 border border-yellow-500/40 rounded">
            <span className="font-medium text-yellow-200">Medium Risk (0.3-0.7)</span>
            <span className="text-xs font-bold text-yellow-200">
              {data
                .filter(d => d.min >= 0.3 && d.min < 0.7)
                .reduce((sum, d) => sum + d.attackCount, 0)
                .toLocaleString()}{' '}
              attacks
            </span>
          </div>
          <div className="flex flex-col p-2 bg-emerald-950/40 border border-emerald-500/40 rounded">
            <span className="font-medium text-emerald-200">Low Risk (0.7-1.0)</span>
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
