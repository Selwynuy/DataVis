'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, MapPin } from 'lucide-react';

interface SuspiciousIPsTableProps {
  data: Array<{
    ip: string;
    riskScore: number;
    failedLogins: number;
    protocol: string;
    score: number;
  }>;
}

export default function SuspiciousIPsTable({ data }: SuspiciousIPsTableProps) {
  const displayData = data.slice(0, 6);

  const getRiskBadge = (score: number) => {
    if (score >= 70) return { label: 'Critical', color: 'bg-red-100 text-red-700' };
    if (score >= 50) return { label: 'High', color: 'bg-orange-100 text-orange-700' };
    if (score >= 30) return { label: 'Medium', color: 'bg-yellow-100 text-yellow-700' };
    return { label: 'Low', color: 'bg-green-100 text-green-700' };
  };

  return (
    <Card className="border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            Suspicious IP Addresses
          </CardTitle>
          <p className="text-sm text-slate-600 mt-1">Top threat sources by risk score</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {displayData.map((row, index) => {
            const risk = getRiskBadge(row.riskScore);
            return (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-mono font-semibold text-slate-900">
                      {row.ip}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-500">
                        {row.protocol} • {row.failedLogins} failed logins
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">
                      {row.riskScore}%
                    </p>
                    <p className="text-xs text-slate-500">risk</p>
                  </div>
                  <Badge className={`${risk.color} border-0`}>
                    {risk.label}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
