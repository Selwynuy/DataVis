'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900">
          Attack Rate vs IP Reputation Score
        </CardTitle>
        <p className="text-sm text-slate-600">Lower reputation scores correlate with higher attack rates</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="bucket"
              stroke="#64748b"
              style={{ fontSize: '12px' }}
              label={{ value: 'IP Reputation Score', position: 'insideBottom', offset: -5, style: { fontSize: '12px' } }}
            />
            <YAxis
              yAxisId="left"
              stroke="#64748b"
              style={{ fontSize: '12px' }}
              label={{ value: 'Attack Rate (%)', angle: -90, position: 'insideLeft', style: { fontSize: '12px' } }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#94a3b8"
              style={{ fontSize: '12px' }}
              label={{ value: 'Sessions', angle: 90, position: 'insideRight', style: { fontSize: '12px' } }}
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
                if (name === 'sessionCount') return [value, 'Sessions'];
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
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="sessionCount"
              fill="#e0e7ff"
              stroke="#818cf8"
              fillOpacity={0.3}
              name="sessionCount"
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="attackRate"
              stroke="#ef4444"
              strokeWidth={3}
              dot={{ fill: '#ef4444', r: 4 }}
              name="attackRate"
            />
          </ComposedChart>
        </ResponsiveContainer>

        {/* Risk Bands */}
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col p-2 bg-red-50 border border-red-200 rounded">
              <span className="text-xs font-medium text-red-700">High Risk (0.0-0.3)</span>
              <span className="text-sm font-bold text-red-600">
                {data
                  .filter(d => d.min < 0.3)
                  .reduce((sum, d) => sum + d.attackCount, 0)
                  .toLocaleString()}{' '}
                attacks
              </span>
            </div>
            <div className="flex flex-col p-2 bg-yellow-50 border border-yellow-200 rounded">
              <span className="text-xs font-medium text-yellow-700">Medium Risk (0.3-0.7)</span>
              <span className="text-sm font-bold text-yellow-600">
                {data
                  .filter(d => d.min >= 0.3 && d.min < 0.7)
                  .reduce((sum, d) => sum + d.attackCount, 0)
                  .toLocaleString()}{' '}
                attacks
              </span>
            </div>
            <div className="flex flex-col p-2 bg-green-50 border border-green-200 rounded">
              <span className="text-xs font-medium text-green-700">Low Risk (0.7-1.0)</span>
              <span className="text-sm font-bold text-green-600">
                {data
                  .filter(d => d.min >= 0.7)
                  .reduce((sum, d) => sum + d.attackCount, 0)
                  .toLocaleString()}{' '}
                attacks
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
