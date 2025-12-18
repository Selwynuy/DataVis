'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900">
          Attack Rate by Browser Type
        </CardTitle>
        <p className="text-sm text-slate-600">Comparing attack rates across browsers and off-hours activity</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="browser"
              stroke="#64748b"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#64748b"
              style={{ fontSize: '12px' }}
              label={{ value: 'Attack Rate (%)', angle: -90, position: 'insideLeft', style: { fontSize: '12px' } }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '12px'
              }}
              formatter={(value: number, name: string) => {
                if (name === 'attackRate') return [`${value.toFixed(1)}%`, 'Overall Attack Rate'];
                if (name === 'offHoursAttackRate') return [`${value.toFixed(1)}%`, 'Off-Hours Attack Rate'];
                return [value, name];
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '12px' }}
              formatter={(value) => {
                if (value === 'attackRate') return 'Overall Attack Rate';
                if (value === 'offHoursAttackRate') return 'Off-Hours Attack Rate';
                return value;
              }}
            />
            <Bar dataKey="attackRate" fill="#f97316" name="attackRate" />
            <Bar dataKey="offHoursAttackRate" fill="#9333ea" name="offHoursAttackRate" />
          </BarChart>
        </ResponsiveContainer>

        {/* Browser Summary */}
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="grid grid-cols-5 gap-2">
            {data.map(item => (
              <div key={item.browser} className="flex flex-col text-center">
                <span className="text-xs font-medium text-slate-700">{item.browser}</span>
                <span className="text-xs text-slate-600">{item.sessionCount} sessions</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
