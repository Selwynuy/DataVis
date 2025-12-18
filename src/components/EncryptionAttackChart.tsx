'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface EncryptionData {
  encryption: string;
  sessionCount: number;
  attackCount: number;
  cleanCount: number;
  attackRate: number;
}

interface EncryptionAttackChartProps {
  data: EncryptionData[];
}

export default function EncryptionAttackChart({ data }: EncryptionAttackChartProps) {
  return (
    <div className="flex flex-col h-full">
      <h3 className="text-base font-semibold text-slate-200 mb-1">
        Encryption Type vs Attack Outcome
      </h3>
      <p className="text-xs text-slate-400 mb-2">
        Distribution of attacks and clean sessions by encryption
      </p>

      <div className="flex flex-col gap-2">
        {/* Fixed but responsive chart height so content stays visible */}
        <div className="h-36 md:h-40 lg:h-44">
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
                contentStyle={{
                  backgroundColor: '#020617',
                  border: '1px solid #1e293b',
                  borderRadius: 6,
                  fontSize: 12,
                  color: '#e2e8f0'
                }}
                formatter={(value: number, name: string) => {
                  if (name === 'attackCount') return [value, 'Attacks'];
                  if (name === 'cleanCount') return [value, 'Clean Sessions'];
                  return [value, name];
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
              <Bar dataKey="attackCount" stackId="a" fill="#ef4444" name="attackCount" />
              <Bar dataKey="cleanCount" stackId="a" fill="#22c55e" name="cleanCount" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Attack Rate Summary */}
        <div className="pt-2 border-t border-slate-800/80 overflow-y-auto max-h-24">
          <div className="grid grid-cols-3 gap-2">
            {data.map(item => (
              <div key={item.encryption} className="flex flex-col">
                <span className="text-[11px] font-medium text-slate-300">
                  {item.encryption}
                </span>
                <span className="text-xs font-semibold text-orange-400">
                  {item.attackRate.toFixed(1)}% attack rate
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
