'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BrowserData {
  browser: string;
  sessionCount: number;
  attackCount: number;
  attackRate: number;
  offHoursAttackRate: number;
}

interface BrowserAttackChartProps {
  data: BrowserData[];
}

export default function BrowserAttackChart({ data }: BrowserAttackChartProps) {
  return (
    <div className="flex flex-col h-full">
      <h3 className="text-base font-semibold text-slate-200 mb-1">
        Attack Rate by Browser Type
      </h3>
      <p className="text-xs text-slate-400 mb-2">
        Comparing attack rates across browsers and off-hours activity
      </p>

      <div className="flex flex-col gap-2">
        {/* Fixed but responsive chart height for better visibility in short rows */}
        <div className="h-36 md:h-40 lg:h-44">
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
                contentStyle={{
                  backgroundColor: '#020617',
                  border: '1px solid #1e293b',
                  borderRadius: 6,
                  fontSize: 12,
                  color: '#e2e8f0'
                }}
                formatter={(value: number, name: string) => {
                  if (name === 'attackRate') return [`${value.toFixed(1)}%`, 'Overall Attack Rate'];
                  if (name === 'offHoursAttackRate') {
                    return [`${value.toFixed(1)}%`, 'Off-Hours Attack Rate'];
                  }
                  return [value, name];
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
              <Bar dataKey="attackRate" fill="#f97316" name="attackRate" />
              <Bar dataKey="offHoursAttackRate" fill="#9333ea" name="offHoursAttackRate" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Browser Summary */}
        <div className="pt-2 border-t border-slate-800/80 overflow-y-auto max-h-20">
          <div className="grid grid-cols-3 gap-2">
            {data.map(item => (
              <div key={item.browser} className="flex flex-col text-center">
                <span className="text-[11px] font-medium text-slate-300">
                  {item.browser}
                </span>
                <span className="text-[11px] text-slate-400">
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
