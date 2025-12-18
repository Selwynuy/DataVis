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
      description: 'All recorded sessions'
    },
    {
      title: 'Detected Intrusions',
      value: detectedAttacks.toLocaleString(),
      icon: AlertTriangle,
      iconBg: 'bg-red-900/50',
      iconColor: 'text-red-400',
      description: 'Confirmed attacks'
    },
    {
      title: 'Attack Rate',
      value: `${attackRate.toFixed(1)}%`,
      icon: Shield,
      iconBg: 'bg-orange-900/50',
      iconColor: 'text-orange-400',
      description: 'Percentage of malicious sessions'
    },
    {
      title: 'Off-Hours Attacks',
      value: `${offHoursAttackShare.toFixed(1)}%`,
      icon: Clock,
      iconBg: 'bg-purple-900/50',
      iconColor: 'text-purple-400',
      description: 'Attacks during unusual hours'
    },
    {
      title: 'High-Risk Sessions',
      value: highRiskSessions.toLocaleString(),
      icon: Lock,
      iconBg: 'bg-yellow-900/50',
      iconColor: 'text-yellow-400',
      description: 'IP reputation < 0.3'
    }
  ];

  return (
    <div className="grid grid-cols-5 gap-3">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <Card key={index} className="border-slate-800 bg-slate-900/50">
            <CardContent className="p-2 flex items-center gap-3">
              <div className={`${kpi.iconBg} p-2 rounded-md`}>
                <Icon className={`w-5 h-5 ${kpi.iconColor}`} />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-50">{kpi.value}</p>
                <p className="text-xs font-medium text-slate-400">{kpi.title}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
