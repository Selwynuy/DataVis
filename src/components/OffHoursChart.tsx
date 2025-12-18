'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

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
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900">
          Off-Hours vs Business Hours Attack Rate
        </CardTitle>
        <p className="text-sm text-slate-600">Comparing attack likelihood by time of access</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="name"
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
                if (name === 'attackRate') return [`${value.toFixed(1)}%`, 'Attack Rate'];
                if (name === 'sessions') return [value, 'Total Sessions'];
                if (name === 'attacks') return [value, 'Attacks'];
                return [value, name];
              }}
            />
            <Bar dataKey="attackRate" name="attackRate">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Summary Stats */}
        <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-600">Business Hours</span>
            <span className="text-lg font-bold text-blue-600">{data.businessHours.attackRate.toFixed(1)}%</span>
            <span className="text-xs text-slate-500">{data.businessHours.attacks} attacks / {data.businessHours.sessions} sessions</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-600">Off-Hours</span>
            <span className="text-lg font-bold text-purple-600">{data.offHours.attackRate.toFixed(1)}%</span>
            <span className="text-xs text-slate-500">{data.offHours.attacks} attacks / {data.offHours.sessions} sessions</span>
          </div>
        </div>

        {data.offHours.attackRate > data.businessHours.attackRate && (
          <div className="mt-3 p-2 bg-purple-50 border border-purple-200 rounded text-xs text-purple-700">
            <strong>⚠ Off-hours sessions are {(data.offHours.attackRate / data.businessHours.attackRate).toFixed(1)}x more likely to be malicious</strong>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
