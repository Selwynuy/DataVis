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
    <>
      <h3 className="text-base font-semibold text-slate-200 mb-1">Attack Rate by Protocol</h3>
      <p className="text-xs text-slate-400 mb-2">Comparing malicious activity across network protocols</p>
      <div className="flex-grow min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
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
            />
             <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#f97316"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}
              contentStyle={{
                backgroundColor: '#1e293b',
                borderColor: '#334155',
                color: '#e2e8f0',
                fontSize: '12px',
                borderRadius: '4px'
              }}
              formatter={(value: number, name: string) => {
                if (name === 'Attack Rate') return [`${value.toFixed(1)}%`, 'Attack Rate'];
                if (name === 'Total Sessions') return [value.toLocaleString(), 'Total Sessions'];
                return [value, name];
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '12px' }}
              formatter={(value) => {
                if (value === 'attackRate') return 'Attack Rate (%)';
                if (value === 'sessionCount') return 'Total Sessions';
                return value;
              }}
            />
            <Bar yAxisId="left" dataKey="sessionCount" fill="#3b82f6" name="Total Sessions" />
            <Bar yAxisId="right" dataKey="attackRate" fill="#f97316" name="Attack Rate" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
