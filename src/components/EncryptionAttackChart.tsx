'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900">
          Encryption Type vs Attack Outcome
        </CardTitle>
        <p className="text-sm text-slate-600">Distribution of attacks and clean sessions by encryption</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="encryption"
              stroke="#64748b"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#64748b"
              style={{ fontSize: '12px' }}
              label={{ value: 'Session Count', angle: -90, position: 'insideLeft', style: { fontSize: '12px' } }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '12px'
              }}
              formatter={(value: number, name: string) => {
                if (name === 'attackCount') return [value, 'Attacks'];
                if (name === 'cleanCount') return [value, 'Clean Sessions'];
                return [value, name];
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '12px' }}
              formatter={(value) => {
                if (value === 'attackCount') return 'Attacks';
                if (value === 'cleanCount') return 'Clean Sessions';
                return value;
              }}
            />
            <Bar dataKey="attackCount" stackId="a" fill="#ef4444" name="attackCount" />
            <Bar dataKey="cleanCount" stackId="a" fill="#22c55e" name="cleanCount" />
          </BarChart>
        </ResponsiveContainer>

        {/* Attack Rate Summary */}
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="grid grid-cols-3 gap-3">
            {data.map(item => (
              <div key={item.encryption} className="flex flex-col">
                <span className="text-xs font-medium text-slate-700">{item.encryption}</span>
                <span className="text-sm font-bold text-orange-600">{item.attackRate.toFixed(1)}% attack rate</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
