// Mock data generator for cybersecurity intrusion detection

export type AttackType = 'DoS' | 'Probe' | 'R2L' | 'U2R';
export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type NetworkSegment = 'DMZ' | 'Internal' | 'External' | 'Cloud';

export interface IntrusionEvent {
  id: string;
  timestamp: Date;
  attackType: AttackType;
  sourceIP: string;
  targetIP: string;
  severity: Severity;
  riskScore: number;
  networkSegment: NetworkSegment;
  blocked: boolean;
  description: string;
}

export interface KPIData {
  totalEvents: number;
  criticalIntrusions: number;
  uniqueAttackTypes: number;
  riskScoreTrend: number;
  anomalousDevices: number;
}

export interface SuspiciousIP {
  ip: string;
  attacks: number;
  lastSeen: Date;
  severity: Severity;
  country: string;
}

export interface TimeSeriesData {
  timestamp: Date;
  count: number;
  critical: number;
}

export interface AttackTypeDistribution {
  type: AttackType;
  count: number;
  percentage: number;
}

export interface RiskHeatmapData {
  hour: number;
  day: string;
  riskLevel: number;
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  timestamp: Date;
  acknowledged: boolean;
}

// Helper function to generate random IP
function generateRandomIP(): string {
  return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
}

// Helper function to generate random date within range
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Generate intrusion events
export function generateIntrusionEvents(count: number = 500): IntrusionEvent[] {
  const attackTypes: AttackType[] = ['DoS', 'Probe', 'R2L', 'U2R'];
  const severities: Severity[] = ['critical', 'high', 'medium', 'low'];
  const segments: NetworkSegment[] = ['DMZ', 'Internal', 'External', 'Cloud'];
  const descriptions = {
    DoS: 'Denial of Service attack detected',
    Probe: 'Port scanning activity observed',
    R2L: 'Remote to Local access attempt',
    U2R: 'User to Root privilege escalation attempt'
  };

  const events: IntrusionEvent[] = [];
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

  for (let i = 0; i < count; i++) {
    const attackType = attackTypes[Math.floor(Math.random() * attackTypes.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];

    events.push({
      id: `evt-${i + 1}`,
      timestamp: randomDate(startDate, endDate),
      attackType,
      sourceIP: generateRandomIP(),
      targetIP: generateRandomIP(),
      severity,
      riskScore: Math.floor(Math.random() * 100),
      networkSegment: segments[Math.floor(Math.random() * segments.length)],
      blocked: Math.random() > 0.3,
      description: descriptions[attackType]
    });
  }

  return events.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
}

// Generate KPI data from events
export function generateKPIData(events: IntrusionEvent[]): KPIData {
  const criticalEvents = events.filter(e => e.severity === 'critical');
  const uniqueTypes = new Set(events.map(e => e.attackType)).size;
  const uniqueIPs = new Set(events.map(e => e.sourceIP)).size;

  // Calculate risk score trend (comparing last 24h vs previous 24h)
  const now = new Date();
  const last24h = events.filter(e => now.getTime() - e.timestamp.getTime() < 24 * 60 * 60 * 1000);
  const prev24h = events.filter(e => {
    const diff = now.getTime() - e.timestamp.getTime();
    return diff >= 24 * 60 * 60 * 1000 && diff < 48 * 60 * 60 * 1000;
  });

  const avgLast = last24h.reduce((sum, e) => sum + e.riskScore, 0) / (last24h.length || 1);
  const avgPrev = prev24h.reduce((sum, e) => sum + e.riskScore, 0) / (prev24h.length || 1);
  const trend = ((avgLast - avgPrev) / avgPrev) * 100;

  return {
    totalEvents: events.length,
    criticalIntrusions: criticalEvents.length,
    uniqueAttackTypes: uniqueTypes,
    riskScoreTrend: isNaN(trend) ? 0 : Math.round(trend),
    anomalousDevices: uniqueIPs
  };
}

// Generate time series data for charts
export function generateTimeSeriesData(events: IntrusionEvent[]): TimeSeriesData[] {
  const hourlyData = new Map<number, { count: number; critical: number }>();

  events.forEach(event => {
    const hourKey = Math.floor(event.timestamp.getTime() / (60 * 60 * 1000));
    const existing = hourlyData.get(hourKey) || { count: 0, critical: 0 };
    existing.count++;
    if (event.severity === 'critical') existing.critical++;
    hourlyData.set(hourKey, existing);
  });

  return Array.from(hourlyData.entries())
    .map(([hourKey, data]) => ({
      timestamp: new Date(hourKey * 60 * 60 * 1000),
      count: data.count,
      critical: data.critical
    }))
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
}

// Generate attack type distribution
export function generateAttackTypeDistribution(events: IntrusionEvent[]): AttackTypeDistribution[] {
  const distribution = new Map<AttackType, number>();

  events.forEach(event => {
    distribution.set(event.attackType, (distribution.get(event.attackType) || 0) + 1);
  });

  const total = events.length;
  return Array.from(distribution.entries()).map(([type, count]) => ({
    type,
    count,
    percentage: Math.round((count / total) * 100)
  }));
}

// Generate top suspicious IPs
export function generateSuspiciousIPs(events: IntrusionEvent[], limit: number = 10): SuspiciousIP[] {
  const ipMap = new Map<string, { count: number; lastSeen: Date; severities: Severity[] }>();

  events.forEach(event => {
    const existing = ipMap.get(event.sourceIP);
    if (existing) {
      existing.count++;
      existing.severities.push(event.severity);
      if (event.timestamp > existing.lastSeen) {
        existing.lastSeen = event.timestamp;
      }
    } else {
      ipMap.set(event.sourceIP, {
        count: 1,
        lastSeen: event.timestamp,
        severities: [event.severity]
      });
    }
  });

  const countries = ['China', 'Russia', 'USA', 'Brazil', 'India', 'Iran', 'North Korea', 'Ukraine'];

  return Array.from(ipMap.entries())
    .map(([ip, data]) => {
      const hasCritical = data.severities.includes('critical');
      const hasHigh = data.severities.includes('high');
      const severity: Severity = hasCritical ? 'critical' : hasHigh ? 'high' : 'medium';

      return {
        ip,
        attacks: data.count,
        lastSeen: data.lastSeen,
        severity,
        country: countries[Math.floor(Math.random() * countries.length)]
      };
    })
    .sort((a, b) => b.attacks - a.attacks)
    .slice(0, limit);
}

// Generate heatmap data
export function generateRiskHeatmap(events: IntrusionEvent[]): RiskHeatmapData[] {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const heatmapData: RiskHeatmapData[] = [];

  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      const relevantEvents = events.filter(e => {
        const eventDay = e.timestamp.getDay();
        const eventHour = e.timestamp.getHours();
        return eventDay === day && eventHour === hour;
      });

      const avgRisk = relevantEvents.length > 0
        ? relevantEvents.reduce((sum, e) => sum + e.riskScore, 0) / relevantEvents.length
        : 0;

      heatmapData.push({
        hour,
        day: days[day],
        riskLevel: Math.round(avgRisk)
      });
    }
  }

  return heatmapData;
}

// Generate active alerts
export function generateAlerts(events: IntrusionEvent[]): Alert[] {
  const criticalEvents = events
    .filter(e => e.severity === 'critical' && !e.blocked)
    .slice(-5);

  return criticalEvents.map((event, idx) => ({
    id: `alert-${idx + 1}`,
    title: `${event.attackType} Attack Detected`,
    description: `${event.description} from ${event.sourceIP} targeting ${event.targetIP}`,
    severity: event.severity,
    timestamp: event.timestamp,
    acknowledged: false
  }));
}

// Main function to get all dashboard data
export function getDashboardData() {
  const events = generateIntrusionEvents(500);

  return {
    events,
    kpis: generateKPIData(events),
    timeSeries: generateTimeSeriesData(events),
    attackDistribution: generateAttackTypeDistribution(events),
    suspiciousIPs: generateSuspiciousIPs(events, 10),
    heatmap: generateRiskHeatmap(events),
    alerts: generateAlerts(events)
  };
}
