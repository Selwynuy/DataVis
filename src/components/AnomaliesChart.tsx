'use client';

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, LineChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { IntrusionEvent } from '@/lib/mockData';

interface AnomaliesChartProps {
  events: IntrusionEvent[];
}

export default function AnomaliesChart({ events }: AnomaliesChartProps) {
  const scatterData = events.slice(0, 50).map((event, index) => ({
    x: index * 20,
    y: Math.random() * 300 + 50,
    type: Math.random() > 0.5 ? 'high' : 'low'
  }));

  const lineData = Array.from({ length: 10 }, (_, i) => ({
    x: i * 100,
    y1: Math.sin(i * 0.5) * 100 + 150,
    y2: Math.cos(i * 0.5) * 80 + 200,
    y3: Math.sin(i * 0.7) * 60 + 180,
  }));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Annomalies Detected</CardTitle>
        <button className="text-sm text-slate-600">⋮</button>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="x" stroke="#64748b" style={{ fontSize: '11px' }} />
            <YAxis stroke="#64748b" style={{ fontSize: '11px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: 'none',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Line type="monotone" dataKey="y1" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 3 }} />
            <Line type="monotone" dataKey="y2" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 3 }} />
            <Line type="monotone" dataKey="y3" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
