'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface RiskSeverityTableProps {
  data: Array<{
    ipoir: string;
    fone: number;
    riswe: number;
    scores: number;
    score: number;
  }>;
}

export default function RiskSeverityTable({ data }: RiskSeverityTableProps) {
  const displayData = data.slice(0, 4);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Risk Severity Heatmap</CardTitle>
        <select className="text-sm border rounded px-2 py-1">
          <option>Severi</option>
        </select>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Ipoir</TableHead>
              <TableHead>Fone</TableHead>
              <TableHead>Riswe</TableHead>
              <TableHead>Scores</TableHead>
              <TableHead>Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>
                  <input type="checkbox" className="rounded border-slate-300" />
                </TableCell>
                <TableCell className="font-medium">
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    {row.ipoir}
                  </span>
                </TableCell>
                <TableCell>{row.fone}</TableCell>
                <TableCell>{row.riswe}</TableCell>
                <TableCell>{row.scores}</TableCell>
                <TableCell className={row.score < 0 ? 'text-red-600' : 'text-slate-900'}>
                  {row.score}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
