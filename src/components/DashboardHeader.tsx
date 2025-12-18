'use client';

import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';

interface DashboardHeaderProps {
  kpis: {
    totalSessions: number;
    detectedAttacks: number;
    attackRate: number;
    offHoursAttackShare: number;
    weakEncryptionAttackShare: number;
  };
}

export default function DashboardHeader({ kpis }: DashboardHeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="px-4 py-2 flex items-center justify-between gap-4">
        {/* Left: Title */}
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <h1 className="text-base font-bold text-slate-900 whitespace-nowrap">Network Intrusion Detection</h1>
        </div>

        {/* Right: Global KPI Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="px-2 py-0.5 bg-blue-50 border-blue-200">
            <span className="text-xs text-blue-700">
              <span className="font-semibold">{kpis.totalSessions.toLocaleString()}</span> Sessions
            </span>
          </Badge>

          <Badge variant="outline" className="px-2 py-0.5 bg-red-50 border-red-200">
            <span className="text-xs text-red-700">
              <span className="font-semibold">{kpis.detectedAttacks.toLocaleString()}</span> Attacks
            </span>
          </Badge>

          <Badge variant="outline" className="px-2 py-0.5 bg-orange-50 border-orange-200">
            <span className="text-xs text-orange-700">
              <span className="font-semibold">{kpis.attackRate.toFixed(1)}%</span> Attack Rate
            </span>
          </Badge>

          <Badge variant="outline" className="px-2 py-0.5 bg-purple-50 border-purple-200">
            <span className="text-xs text-purple-700">
              <span className="font-semibold">{kpis.offHoursAttackShare.toFixed(1)}%</span> Off-Hours
            </span>
          </Badge>

          <Badge variant="outline" className="px-2 py-0.5 bg-yellow-50 border-yellow-200">
            <span className="text-xs text-yellow-700">
              <span className="font-semibold">{kpis.weakEncryptionAttackShare.toFixed(1)}%</span> Weak Encryption
            </span>
          </Badge>
        </div>
      </div>
    </header>
  );
}
