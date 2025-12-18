'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

interface AttackTypeChartProps {
  data: Array<{ name: string; value: number }>;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AttackTypeChart({ data }: AttackTypeChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          Protocol Distribution
        </CardTitle>
        <p className="text-sm text-slate-600 mt-1">Network protocol breakdown</p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                label={({ percent }) => `${((percent || 0) * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px',
                  color: '#fff'
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Custom Legend */}
          <div className="grid grid-cols-2 gap-3 mt-4 w-full">
            {data.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <span className="text-sm text-slate-700 font-medium">{entry.name}</span>
                <span className="text-xs text-slate-500 ml-auto">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
