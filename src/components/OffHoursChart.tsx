'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface OffHoursData {
  offHours: {
    sessions: number;
    attacks: number;
    attackRate: number;
  };
  businessHours: {
    sessions: number;
    attacks: number;
    attackRate: number;
  };
}

interface OffHoursChartProps {
  data: OffHoursData;
}

export default function OffHoursChart({ data }: OffHoursChartProps) {
  const chartData = [
    {
      name: 'Business Hours',
      attackRate: data.businessHours.attackRate,
      sessions: data.businessHours.sessions,
      attacks: data.businessHours.attacks
    },
    {
      name: 'Off-Hours',
      attackRate: data.offHours.attackRate,
      sessions: data.offHours.sessions,
      attacks: data.offHours.attacks
    }
  ];

  const colors = ['#3b82f6', '#9333ea'];

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-base font-semibold text-slate-200 mb-1">
        Off-Hours vs Business Hours Attack Rate
      </h3>
      <p className="text-xs text-slate-400 mb-2">
        Comparing attack likelihood by time of access
      </p>

      <div className="flex flex-col gap-2">
        {/* Slightly smaller fixed chart height so top row visuals don't dominate */}
        <div className="h-40 md:h-44 lg:h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.25)" />
              <XAxis
                dataKey="name"
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
                contentStyle={{
                  backgroundColor: '#020617',
                  border: '1px solid #1e293b',
                  borderRadius: 6,
                  fontSize: 12,
                  color: '#e2e8f0'
                }}
                formatter={(value: number | undefined, name: string | undefined) => {
                  if (value === undefined) return ['N/A', name || ''];
                  if (name === 'attackRate') return [`${value.toFixed(1)}%`, 'Attack Rate'];
                  if (name === 'sessions') return [value, 'Total Sessions'];
                  if (name === 'attacks') return [value, 'Attacks'];
                  return [value, name || ''];
                }}
              />
              <Bar dataKey="attackRate" name="attackRate">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Stats */}
        <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-3 text-[11px]">
          <div className="flex flex-col">
            <span className="font-medium text-slate-300">Business Hours</span>
            <span className="text-sm font-bold text-sky-400">
              {data.businessHours.attackRate.toFixed(1)}%
            </span>
            <span className="text-slate-400">
              {data.businessHours.attacks.toLocaleString()} attacks /{' '}
              {data.businessHours.sessions.toLocaleString()} sessions
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-slate-300">Off-Hours</span>
            <span className="text-sm font-bold text-purple-400">
              {data.offHours.attackRate.toFixed(1)}%
            </span>
            <span className="text-slate-400">
              {data.offHours.attacks.toLocaleString()} attacks /{' '}
              {data.offHours.sessions.toLocaleString()} sessions
            </span>
          </div>
        </div>

        {data.offHours.attackRate > data.businessHours.attackRate && (
          <div className="mt-1 p-2 bg-purple-950/40 border border-purple-500/40 rounded text-[11px] text-purple-200">
            <strong>
              Off-hours sessions are{' '}
              {(data.offHours.attackRate / data.businessHours.attackRate).toFixed(1)}x
              {' '}more likely to be malicious
            </strong>
          </div>
        )}
      </div>
    </div>
  );
}
