'use client';

import { Server, Wifi, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { IntrusionEvent } from '@/lib/mockData';

interface NetworkMapProps {
  events: IntrusionEvent[];
}

export default function NetworkMap({ events }: NetworkMapProps) {
  const recentEvents = events.slice(-10);
  const criticalEvents = recentEvents.filter(e => e.severity === 'critical');

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Attack Source & Target</CardTitle>
        <button className="text-sm text-slate-600">⋮</button>
      </CardHeader>
      <CardContent>

      <div className="relative h-[300px] bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-6">
        {/* Network Segments */}
        <div className="absolute inset-0 flex items-center justify-around p-6">
          {/* External Threats */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <div className="absolute -inset-2 bg-red-200 rounded-full animate-ping opacity-75"></div>
              <AlertCircle className="w-12 h-12 text-red-600 relative z-10" />
            </div>
            <p className="text-xs font-medium text-slate-600">External</p>
            <p className="text-xs text-red-600 font-semibold">{criticalEvents.length} threats</p>
          </div>

          {/* DMZ */}
          <div className="flex flex-col items-center gap-2">
            <Wifi className="w-12 h-12 text-orange-600" />
            <p className="text-xs font-medium text-slate-600">DMZ</p>
            <p className="text-xs text-slate-500">
              {recentEvents.filter(e => e.networkSegment === 'DMZ').length} events
            </p>
          </div>

          {/* Internal Network */}
          <div className="flex flex-col items-center gap-2">
            <Server className="w-12 h-12 text-blue-600" />
            <p className="text-xs font-medium text-slate-600">Internal</p>
            <p className="text-xs text-slate-500">
              {recentEvents.filter(e => e.networkSegment === 'Internal').length} events
            </p>
          </div>

          {/* Cloud */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 text-purple-600 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-12 h-12"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z"
                />
              </svg>
            </div>
            <p className="text-xs font-medium text-slate-600">Cloud</p>
            <p className="text-xs text-slate-500">
              {recentEvents.filter(e => e.networkSegment === 'Cloud').length} events
            </p>
          </div>
        </div>

        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <line x1="20%" y1="50%" x2="40%" y2="50%" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5">
            <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite" />
          </line>
          <line x1="40%" y1="50%" x2="60%" y2="50%" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,5">
            <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite" />
          </line>
          <line x1="60%" y1="50%" x2="80%" y2="50%" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5">
            <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite" />
          </line>
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-slate-600">I-Hestinent</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-slate-600">Lectincads</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-slate-600">Severity</span>
        </div>
      </div>
      </CardContent>
    </Card>
  );
}
