'use client';

import { useState, useEffect, useMemo, use } from 'react';
import LeftSidebar, { FilterState } from '@/components/LeftSidebar';
import KPICards from '@/components/KPICards';
import BehaviorHeatmap from '@/components/BehaviorHeatmap';
import ProtocolAttackChart from '@/components/ProtocolAttackChart';
import EncryptionAttackChart from '@/components/EncryptionAttackChart';
import BrowserAttackChart from '@/components/BrowserAttackChart';
import ReputationChart from '@/components/ReputationChart';
import SuspiciousSessionsTable from '@/components/SuspiciousSessionsTable';
import {
  loadIntrusionData,
  calculateKPIs,
  groupByProtocol,
  groupByEncryption,
  groupByBrowser,
  bucketByReputation,
  buildBehaviorBuckets,
  getSuspiciousSessions
} from '@/lib/dataLoader';
import type { IntrusionData } from '@/lib/dataLoader';

export default function Home({
  params,
  searchParams,
}: {
  params: Promise<Record<string, string | string[]>>;
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  // Unwrap params and searchParams (Next.js 15+ requirement)
  use(params);
  use(searchParams);
  const [intrusionData, setIntrusionData] = useState<IntrusionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    attackOutcome: 'all',
    timeOfAccess: 'all',
    loginAttemptsMin: 0,
    loginAttemptsMax: 99,
    failedLoginsMin: 0,
    failedLoginsMax: 99,
    protocols: [],
    encryptions: [],
    browsers: [],
    reputationRisk: 'all'
  });

  useEffect(() => {
    const loadData = async () => {
      const data = await loadIntrusionData();
      setIntrusionData(data);
      setLoading(false);
    };
    loadData();
  }, []);

  // Apply filters to data
  const filteredData = useMemo(() => {
    let filtered = [...intrusionData];

    // Attack outcome
    if (filters.attackOutcome === 'attacks') {
      filtered = filtered.filter(d => d.attackDetected);
    } else if (filters.attackOutcome === 'clean') {
      filtered = filtered.filter(d => !d.attackDetected);
    }

    // Time of access
    if (filters.timeOfAccess === 'business') {
      filtered = filtered.filter(d => !d.unusualTimeAccess);
    } else if (filters.timeOfAccess === 'off-hours') {
      filtered = filtered.filter(d => d.unusualTimeAccess);
    }

    // Login attempts range
    filtered = filtered.filter(
      d => d.loginAttempts >= filters.loginAttemptsMin && d.loginAttempts <= filters.loginAttemptsMax
    );

    // Failed logins range
    filtered = filtered.filter(
      d => d.failedLogins >= filters.failedLoginsMin && d.failedLogins <= filters.failedLoginsMax
    );

    // Protocol filter
    if (filters.protocols.length > 0) {
      filtered = filtered.filter(d => filters.protocols.includes(d.protocolType));
    }

    // Encryption filter
    if (filters.encryptions.length > 0) {
      filtered = filtered.filter(d => filters.encryptions.includes(d.encryptionUsed));
    }

    // Browser filter
    if (filters.browsers.length > 0) {
      filtered = filtered.filter(d => filters.browsers.includes(d.browserType));
    }

    // Reputation risk filter
    if (filters.reputationRisk === 'high') {
      filtered = filtered.filter(d => d.ipReputationScore < 0.3);
    } else if (filters.reputationRisk === 'medium') {
      filtered = filtered.filter(d => d.ipReputationScore >= 0.3 && d.ipReputationScore < 0.7);
    } else if (filters.reputationRisk === 'low') {
      filtered = filtered.filter(d => d.ipReputationScore >= 0.7);
    }

    return filtered;
  }, [intrusionData, filters]);

  // Calculate all derived data from filtered data
  const kpis = useMemo(() => calculateKPIs(filteredData), [filteredData]);
  const protocolStats = useMemo(() => groupByProtocol(filteredData), [filteredData]);
  const encryptionStats = useMemo(() => groupByEncryption(filteredData), [filteredData]);
  const browserStats = useMemo(() => groupByBrowser(filteredData), [filteredData]);
  const reputationBuckets = useMemo(() => bucketByReputation(filteredData), [filteredData]);
  const behaviorBuckets = useMemo(() => buildBehaviorBuckets(filteredData), [filteredData]);
  const suspiciousSessions = useMemo(() => getSuspiciousSessions(filteredData, 50), [filteredData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mb-4"></div>
          <p className="text-slate-300 font-medium">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Left Sidebar - global filters */}
      <LeftSidebar
        filters={filters}
        onFilterChange={setFilters}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content - 3-row banded layout: header with visible KPIs, analytic grid, footer */}
      <main className={`flex flex-col border-l border-slate-900 transition-all duration-300 ${sidebarCollapsed ? 'ml-12' : 'ml-64'}`}>
        {/* Band A: Header / KPIs - auto height to ensure visibility */}
        <header className="flex items-center justify-between gap-3 px-3 py-2 border-b border-slate-800 bg-slate-950/80 min-h-[80px] flex-shrink-0">
          <div className="flex-1 min-w-0">
            <KPICards
              totalSessions={kpis.totalSessions}
              detectedAttacks={kpis.detectedAttacks}
              attackRate={kpis.attackRate}
              offHoursAttackShare={kpis.offHoursAttackShare}
              highRiskSessions={kpis.highRiskSessions}
            />
          </div>
          {/* Simple status / description zone */}
          <div className="hidden xl:flex flex-col items-end gap-1 text-xs text-slate-400">
            <span className="font-semibold text-slate-200">Intrusion Operations Overview</span>
            <span className="text-slate-500">
              Filters apply to all visualizations. Focus on spikes and high‑risk sessions.
            </span>
          </div>
        </header>

        {/* Band A/B: Main analytic grid - true bento box layout, each card has independent height */}
        <section className="px-3 pt-1.5">
          <div className="grid grid-cols-12 gap-3" style={{ gridAutoRows: 'min-content', alignContent: 'start' }}>
            {/* Each card has its own height - no row stretching */}
            <div className="col-span-6 rounded-lg border border-slate-800 bg-slate-950/70 p-2 min-w-0">
              <BehaviorHeatmap data={behaviorBuckets} />
            </div>
            <div className="col-span-6 rounded-lg border border-slate-900 bg-slate-950/60 p-2 min-w-0">
              <EncryptionAttackChart data={encryptionStats} />
            </div>
            <div className="col-span-4 rounded-lg border border-slate-800 bg-slate-950/70 p-2 min-w-0 mb-2">
              <ProtocolAttackChart data={protocolStats} />
            </div>
            <div className="col-span-4 rounded-lg border border-slate-900 bg-slate-950/60 p-2 min-w-0 mb-2">
              <BrowserAttackChart data={browserStats} />
            </div>
            <div className="col-span-4 rounded-lg border border-slate-900 bg-slate-950/60 p-2 min-w-0 mb-2">
              <ReputationChart data={reputationBuckets} />
            </div>
          </div>
        </section>

        {/* Band C: triage & status */}
        <footer className="border-t border-slate-800 bg-slate-950/90 px-3 py-1.5 mt-2">
          <div className="pr-1">
            <SuspiciousSessionsTable data={suspiciousSessions} />
          </div>
          <div className="flex items-center justify-between gap-2 pt-1.5 text-[11px] text-slate-500">
            <span>
              Showing {suspiciousSessions.length.toLocaleString()} suspicious sessions after filters.
            </span>
            <span className="flex items-center gap-2">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              Data pipeline healthy • Last updated from local CSV load
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
}
