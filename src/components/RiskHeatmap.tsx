'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { RiskHeatmapData } from '@/lib/mockData';

interface RiskHeatmapProps {
  data: RiskHeatmapData[];
}

export default function RiskHeatmap({ data }: RiskHeatmapProps) {
  const gridSize = 12;
  const colors = [
    '#fef3c7', '#fde68a', '#fcd34d', '#fbbf24', '#f59e0b',
    '#f97316', '#ea580c', '#dc2626', '#b91c1c', '#991b1b',
    '#7f1d1d', '#1e40af', '#1e3a8a', '#312e81', '#4c1d95',
    '#5b21b6', '#6b21a8', '#7c2d12', '#292524', '#171717'
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Risk Severity Heatmap</CardTitle>
        <button className="text-sm text-slate-600">⋮</button>
      </CardHeader>
      <CardContent>

        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
          {Array.from({ length: gridSize * gridSize }).map((_, index) => {
            const colorIndex = Math.floor(Math.random() * colors.length);
            return (
              <div
                key={index}
                className="aspect-square rounded-sm"
                style={{ backgroundColor: colors[colorIndex] }}
              ></div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
