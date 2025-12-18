'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ProtocolData {
  protocol: string;
  sessionCount: number;
  attackCount: number;
  attackRate: number;
}

interface ProtocolAttackChartProps {
  data: ProtocolData[];
}

export default function ProtocolAttackChart({ data }: ProtocolAttackChartProps) {
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
                contentStyle={{
                  backgroundColor: '#020617',
                  border: '1px solid #1e293b',
                  borderRadius: 6,
                  fontSize: 12,
                  color: '#e2e8f0'
                }}
                formatter={(value: number | undefined, name: string | undefined) => {
                  if (value === undefined || name === undefined) return ['', name || ''];
                  if (name === 'attackRate') return [`${value.toFixed(1)}%`, 'Attack Rate'];
                  if (name === 'sessionCount') return [value.toLocaleString(), 'Total Sessions'];
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
              <Bar yAxisId="left" dataKey="attackRate" fill="#f97316" name="attackRate" />
              <Bar yAxisId="right" dataKey="sessionCount" fill="#3b82f6" name="sessionCount" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Protocol Summary */}
        <div className="pt-3 pb-2 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {data.map(item => (
              <div key={item.protocol} className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900/50 border border-slate-800/50">
                <span className="text-[11px] font-semibold text-slate-200">
                  {item.protocol}
                </span>
                <span className="text-[10px] text-slate-400">
                  {item.sessionCount.toLocaleString()} sessions
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
