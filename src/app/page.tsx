'use client';

import { useState, useMemo, useCallback, use } from 'react';
import LeftSidebar, { FilterState } from '@/components/LeftSidebar';
import CSVUploadModal from '@/components/CSVUploadModal';
import KPICards from '@/components/KPICards';
import BehaviorHeatmap from '@/components/BehaviorHeatmap';
import ProtocolAttackChart from '@/components/ProtocolAttackChart';
import EncryptionAttackChart from '@/components/EncryptionAttackChart';
import BrowserAttackChart from '@/components/BrowserAttackChart';
import ReputationChart from '@/components/ReputationChart';
import SuspiciousSessionsTable from '@/components/SuspiciousSessionsTable';
import {
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
  const [loading, setLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    attackOutcome: 'all',
    timeOfAccess: 'all',
    loginAttemptsMin: 0,
    loginAttemptsMax: 99,
    failedLoginsMin: 0,
    failedLoginsMax: 99,
    behaviorCells: [],
    protocols: [],
    encryptions: [],
    browsers: [],
    reputationRisk: 'all'
  });

  // Chart-based filter handlers
  const handleProtocolClick = (protocol: string) => {
    const currentProtocols = filters.protocols;
    const newProtocols = currentProtocols.includes(protocol)
      ? currentProtocols.filter(p => p !== protocol)
      : [...currentProtocols, protocol];
    setFilters({ ...filters, protocols: newProtocols });
  };

  const handleBrowserClick = (browser: string) => {
    const currentBrowsers = filters.browsers;
    const newBrowsers = currentBrowsers.includes(browser)
      ? currentBrowsers.filter(b => b !== browser)
      : [...currentBrowsers, browser];
    setFilters({ ...filters, browsers: newBrowsers });
  };

  const handleEncryptionClick = (encryption: string) => {
    const currentEncryptions = filters.encryptions;
    const newEncryptions = currentEncryptions.includes(encryption)
      ? currentEncryptions.filter(e => e !== encryption)
      : [...currentEncryptions, encryption];
    setFilters({ ...filters, encryptions: newEncryptions });
  };

  const handleRiskLevelClick = (riskLevel: 'high' | 'medium' | 'low' | null) => {
    setFilters({ ...filters, reputationRisk: riskLevel || 'all' });
  };

  const handleBehaviorCellClick = useCallback((loginAttemptsLabel: string, failedLoginsLabel: string) => {
    // Parse the labels to get min/max values
    let loginMin = 0, loginMax = 99;
    let failedMin = 0, failedMax = 99;

    if (loginAttemptsLabel === '1') {
      loginMin = 1;
      loginMax = 1;
    } else if (loginAttemptsLabel === '2-3') {
      loginMin = 2;
      loginMax = 3;
    } else if (loginAttemptsLabel === '4-5') {
      loginMin = 4;
      loginMax = 5;
    } else if (loginAttemptsLabel === '6+') {
      loginMin = 6;
      loginMax = 99;
    }

    if (failedLoginsLabel === '0') {
      failedMin = 0;
      failedMax = 0;
    } else if (failedLoginsLabel === '1-2') {
      failedMin = 1;
      failedMax = 2;
    } else if (failedLoginsLabel === '3-4') {
      failedMin = 3;
      failedMax = 4;
    } else if (failedLoginsLabel === '5+') {
      failedMin = 5;
      failedMax = 99;
    }

    // Toggle: if already filtered to this range, clear it; otherwise set it
    const isAlreadyFiltered = 
      filters.loginAttemptsMin === loginMin &&
      filters.loginAttemptsMax === loginMax &&
      filters.failedLoginsMin === failedMin &&
      filters.failedLoginsMax === failedMax;

    if (isAlreadyFiltered) {
      setFilters({
        ...filters,
        loginAttemptsMin: 0,
        loginAttemptsMax: 99,
        failedLoginsMin: 0,
        failedLoginsMax: 99,
        behaviorCells: []
      });
    } else {
      setFilters({
        ...filters,
        loginAttemptsMin: loginMin,
        loginAttemptsMax: loginMax,
        failedLoginsMin: failedMin,
        failedLoginsMax: failedMax,
        behaviorCells: [{ loginAttemptsLabel, failedLoginsLabel }]
      });
    }
  }, [filters]);

  // Determine selected cells for behavior heatmap
  const selectedBehaviorCells = useMemo(() => {
    if (
      filters.loginAttemptsMin === 0 &&
      filters.loginAttemptsMax === 99 &&
      filters.failedLoginsMin === 0 &&
      filters.failedLoginsMax === 99
    ) {
      return [];
    }

    // Map filter ranges back to labels
    const loginLabel = 
      filters.loginAttemptsMin === 1 && filters.loginAttemptsMax === 1 ? '1' :
      filters.loginAttemptsMin === 2 && filters.loginAttemptsMax === 3 ? '2-3' :
      filters.loginAttemptsMin === 4 && filters.loginAttemptsMax === 5 ? '4-5' :
      filters.loginAttemptsMin >= 6 ? '6+' : null;

    const failedLabel =
      filters.failedLoginsMin === 0 && filters.failedLoginsMax === 0 ? '0' :
      filters.failedLoginsMin === 1 && filters.failedLoginsMax === 2 ? '1-2' :
      filters.failedLoginsMin === 3 && filters.failedLoginsMax === 4 ? '3-4' :
      filters.failedLoginsMin >= 5 ? '5+' : null;

    if (loginLabel && failedLabel) {
      return [{ loginAttemptsLabel: loginLabel, failedLoginsLabel: failedLabel }];
    }
    return [];
  }, [filters.loginAttemptsMin, filters.loginAttemptsMax, filters.failedLoginsMin, filters.failedLoginsMax]);

  // No automatic data loading - user must upload CSV

  const handleDataLoaded = useCallback((data: IntrusionData[]) => {
    setIntrusionData(data);
    setDataLoaded(true);
    setLoading(false);
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

  if (!dataLoaded || intrusionData.length === 0) {
    return (
      <>
        <CSVUploadModal
          open={uploadModalOpen}
          onOpenChange={setUploadModalOpen}
          onDataLoaded={handleDataLoaded}
          required={true}
        />
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-300 font-medium mb-4">No data loaded</p>
            <p className="text-slate-500 text-sm mb-4">Please upload a CSV file to get started</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* CSV Upload Modal */}
      <CSVUploadModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        onDataLoaded={handleDataLoaded}
      />

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
              <BehaviorHeatmap 
                data={behaviorBuckets} 
                selectedCells={selectedBehaviorCells}
                onCellClick={handleBehaviorCellClick}
              />
            </div>
            <div className="col-span-6 rounded-lg border border-slate-900 bg-slate-950/60 p-2 min-w-0">
              <EncryptionAttackChart 
                data={encryptionStats} 
                selectedEncryptions={filters.encryptions}
                onEncryptionClick={handleEncryptionClick}
              />
            </div>
            <div className="col-span-4 rounded-lg border border-slate-800 bg-slate-950/70 p-2 min-w-0 mb-2">
              <ProtocolAttackChart 
                data={protocolStats} 
                selectedProtocols={filters.protocols}
                onProtocolClick={handleProtocolClick}
              />
            </div>
            <div className="col-span-4 rounded-lg border border-slate-900 bg-slate-950/60 p-2 min-w-0 mb-2">
              <BrowserAttackChart 
                data={browserStats} 
                selectedBrowsers={filters.browsers}
                onBrowserClick={handleBrowserClick}
              />
            </div>
            <div className="col-span-4 rounded-lg border border-slate-900 bg-slate-950/60 p-2 min-w-0 mb-2">
              <ReputationChart 
                data={reputationBuckets} 
                selectedRiskLevel={filters.reputationRisk !== 'all' ? filters.reputationRisk : null}
                onRiskLevelClick={handleRiskLevelClick}
              />
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
