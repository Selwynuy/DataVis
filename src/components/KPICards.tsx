'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Shield, AlertTriangle, Activity, Clock, Lock } from 'lucide-react';

interface KPICardsProps {
  totalSessions: number;
  detectedAttacks: number;
  attackRate: number;
  offHoursAttackShare: number;
  highRiskSessions: number;
}

export default function KPICards({
  totalSessions,
  detectedAttacks,
  attackRate,
  offHoursAttackShare,
  highRiskSessions
}: KPICardsProps) {
  const kpis = [
    {
      title: 'Total Sessions',
      value: totalSessions.toLocaleString(),
      icon: Activity,
      iconBg: 'bg-blue-900/50',
      iconColor: 'text-blue-400',
      description: 'All recorded sessions in the dataset',
      derivation: 'data.length'
    },
    {
      title: 'Detected Intrusions',
      value: detectedAttacks.toLocaleString(),
      icon: AlertTriangle,
      iconBg: 'bg-red-900/50',
      iconColor: 'text-red-400',
      description: 'Sessions flagged as confirmed attacks',
      derivation: 'data.filter(d => d.attackDetected).length'
    },
    {
      title: 'Attack Rate',
      value: `${attackRate.toFixed(1)}%`,
      icon: Shield,
      iconBg: 'bg-orange-900/50',
      iconColor: 'text-orange-400',
      description: 'Percentage of sessions that are attacks',
      derivation: '(detectedAttacks / totalSessions) × 100'
    },
    {
      title: 'Off-Hours Attacks',
      value: `${offHoursAttackShare.toFixed(1)}%`,
      icon: Clock,
      iconBg: 'bg-purple-900/50',
      iconColor: 'text-purple-400',
      description: 'Attacks occurring during unusual hours',
      derivation: '(attacks with unusualTimeAccess / detectedAttacks) × 100'
    },
    {
      title: 'High-Risk Sessions',
      value: highRiskSessions.toLocaleString(),
      icon: Lock,
      iconBg: 'bg-yellow-900/50',
      iconColor: 'text-yellow-400',
      description: 'Sessions with low IP reputation scores',
      derivation: 'data.filter(d => d.ipReputationScore < 0.3).length'
    }
  ];

  return (
    <div className="grid grid-cols-5 gap-2">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <Card key={index} className="border-slate-800 bg-slate-900/60 group hover:z-50 relative">
            <CardContent className="px-2 py-1.5 flex items-center gap-2">
              <div className={`${kpi.iconBg} p-1.5 rounded flex-shrink-0`}>
                <Icon className={`w-4 h-4 ${kpi.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-50 leading-tight">
                  {kpi.value}
                </p>
                <p className="text-[11px] font-medium text-slate-400 leading-tight">
                  {kpi.title}
                </p>
              </div>
            </CardContent>
            {/* Dropdown overlay - appears below card */}
            <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded-md shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] transform translate-y-[-4px] group-hover:translate-y-0 p-3">
              <div className="space-y-2.5">
                <div>
                  <p className="text-xs font-semibold text-slate-100 mb-1.5">{kpi.title}</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{kpi.description}</p>
                </div>
                <div className="pt-2 border-t border-slate-600">
                  <p className="text-[10px] text-slate-500 mb-1.5 font-medium uppercase tracking-wide">Formula</p>
                  <p className="text-[11px] text-slate-200 font-mono leading-relaxed break-words">{kpi.derivation}</p>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
