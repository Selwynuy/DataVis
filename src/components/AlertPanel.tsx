'use client';

import { format } from 'date-fns';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Alert } from '@/lib/mockData';

interface AlertPanelProps {
  alerts: Alert[];
}

export default function AlertPanel({ alerts }: AlertPanelProps) {
  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          Recent Alerts
        </CardTitle>
        <p className="text-sm text-slate-600 mt-1">Critical security notifications</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.slice(0, 5).map((alert) => (
            <div
              key={alert.id}
              className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
            >
              <div
                className={`p-2 rounded-lg ${
                  alert.severity === 'critical'
                    ? 'bg-red-100'
                    : alert.severity === 'high'
                    ? 'bg-orange-100'
                    : 'bg-yellow-100'
                }`}
              >
                <AlertTriangle
                  className={`w-4 h-4 ${
                    alert.severity === 'critical'
                      ? 'text-red-600'
                      : alert.severity === 'high'
                      ? 'text-orange-600'
                      : 'text-yellow-600'
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 mb-0.5 truncate">
                  {alert.title}
                </p>
                <p className="text-xs text-slate-600 line-clamp-2">{alert.description}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {format(alert.timestamp, 'MMM dd, HH:mm')}
                </p>
              </div>
            </div>
          ))}

          {alerts.length === 0 && (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
              <p className="text-sm text-slate-600">All clear, no active alerts</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
