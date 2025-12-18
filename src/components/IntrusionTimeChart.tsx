'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import type { TimeSeriesData } from '@/lib/mockData';

interface IntrusionTimeChartProps {
  data: TimeSeriesData[];
}

export default function IntrusionTimeChart({ data }: IntrusionTimeChartProps) {
  const chartData = data.map(item => ({
    time: format(item.timestamp, 'HH:mm'),
    'Total Events': item.count,
    'Critical Events': item.critical
  }));

  return (
    <Card className="border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Intrusion Events Over Time
          </CardTitle>
          <p className="text-sm text-slate-600 mt-1">Hourly event detection trends</p>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="#94a3b8"
              style={{ fontSize: '12px' }}
              tickLine={false}
            />
            <YAxis
              stroke="#94a3b8"
              style={{ fontSize: '12px' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: 'none',
                borderRadius: '8px',
                padding: '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
              labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
            />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
            <Line
              type="monotone"
              dataKey="Total Events"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="Critical Events"
              stroke="#ef4444"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
