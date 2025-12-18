// Data model matching the CSV structure
export interface IntrusionData {
  sessionId: string;
  networkPacketSize: number;
  protocolType: 'TCP' | 'UDP' | 'ICMP' | string;
  loginAttempts: number;
  sessionDuration: number;
  encryptionUsed: 'AES' | 'DES' | 'None' | string;
  ipReputationScore: number; // 0-1
  failedLogins: number;
  browserType: 'Chrome' | 'Firefox' | 'Edge' | 'Safari' | 'Unknown' | string;
  unusualTimeAccess: boolean;
  attackDetected: boolean;
}

// Load CSV data
export async function loadIntrusionData(): Promise<IntrusionData[]> {
  try {
    const response = await fetch('/cybersecurity_intrusion_data.csv');
    const csvText = await response.text();

    const lines = csvText.trim().split('\n');
    const data: IntrusionData[] = lines.slice(1).map(line => {
      const values = line.split(',');
      return {
        sessionId: values[0],
        networkPacketSize: parseFloat(values[1]),
        protocolType: values[2],
        loginAttempts: parseInt(values[3]),
        sessionDuration: parseFloat(values[4]),
        encryptionUsed: values[5],
        ipReputationScore: parseFloat(values[6]),
        failedLogins: parseInt(values[7]),
        browserType: values[8],
        unusualTimeAccess: parseInt(values[9]) === 1,
        attackDetected: parseInt(values[10]) === 1
      };
    });

    return data;
  } catch (error) {
    console.error('Error loading CSV data:', error);
    return [];
  }
}

// Calculate global KPIs
export function calculateKPIs(data: IntrusionData[]) {
  const totalSessions = data.length;
  const detectedAttacks = data.filter(d => d.attackDetected).length;
  const attackRate = totalSessions > 0 ? (detectedAttacks / totalSessions) * 100 : 0;

  const offHoursAttacks = data.filter(d => d.attackDetected && d.unusualTimeAccess).length;
  const offHoursAttackShare = detectedAttacks > 0 ? (offHoursAttacks / detectedAttacks) * 100 : 0;

  const weakEncryptionAttacks = data.filter(d =>
    d.attackDetected && (d.encryptionUsed === 'DES' || d.encryptionUsed === 'None')
  ).length;
  const weakEncryptionAttackShare = detectedAttacks > 0 ? (weakEncryptionAttacks / detectedAttacks) * 100 : 0;

  const highRiskSessions = data.filter(d => d.ipReputationScore < 0.3).length;

  return {
    totalSessions,
    detectedAttacks,
    attackRate,
    offHoursAttackShare,
    weakEncryptionAttackShare,
    highRiskSessions
  };
}

// Group by protocol
export function groupByProtocol(data: IntrusionData[]) {
  const protocols = ['TCP', 'UDP', 'ICMP'];
  return protocols.map(protocol => {
    const sessions = data.filter(d => d.protocolType === protocol);
    const attacks = sessions.filter(d => d.attackDetected);
    return {
      protocol,
      sessionCount: sessions.length,
      attackCount: attacks.length,
      attackRate: sessions.length > 0 ? (attacks.length / sessions.length) * 100 : 0
    };
  }).filter(p => p.sessionCount > 0);
}

// Group by encryption
export function groupByEncryption(data: IntrusionData[]) {
  const types = ['AES', 'DES', 'None'];
  return types.map(encryption => {
    const sessions = data.filter(d => d.encryptionUsed === encryption);
    const attacks = sessions.filter(d => d.attackDetected);
    return {
      encryption,
      sessionCount: sessions.length,
      attackCount: attacks.length,
      cleanCount: sessions.length - attacks.length,
      attackRate: sessions.length > 0 ? (attacks.length / sessions.length) * 100 : 0
    };
  }).filter(e => e.sessionCount > 0);
}

// Group by browser
export function groupByBrowser(data: IntrusionData[]) {
  const browsers = ['Chrome', 'Firefox', 'Edge', 'Safari', 'Unknown'];
  return browsers.map(browser => {
    const sessions = data.filter(d => d.browserType === browser);
    const attacks = sessions.filter(d => d.attackDetected);
    const offHoursAttacks = sessions.filter(d => d.attackDetected && d.unusualTimeAccess);
    return {
      browser,
      sessionCount: sessions.length,
      attackCount: attacks.length,
      attackRate: sessions.length > 0 ? (attacks.length / sessions.length) * 100 : 0,
      offHoursAttackRate: sessions.length > 0 ? (offHoursAttacks.length / sessions.length) * 100 : 0
    };
  }).filter(b => b.sessionCount > 0);
}

// Bucket by IP reputation
export function bucketByReputation(data: IntrusionData[]) {
  const buckets = [];
  for (let i = 0; i < 10; i++) {
    const min = i / 10;
    const max = (i + 1) / 10;
    const sessions = data.filter(d => d.ipReputationScore >= min && d.ipReputationScore < max);
    const attacks = sessions.filter(d => d.attackDetected);
    buckets.push({
      bucket: `${min.toFixed(1)}-${max.toFixed(1)}`,
      min,
      max,
      sessionCount: sessions.length,
      attackCount: attacks.length,
      attackRate: sessions.length > 0 ? (attacks.length / sessions.length) * 100 : 0
    });
  }
  return buckets.filter(b => b.sessionCount > 0);
}

// Build behavior buckets (login attempts vs failed logins)
export function buildBehaviorBuckets(data: IntrusionData[]) {
  const attemptsBuckets = [
    { label: '1', min: 1, max: 1 },
    { label: '2-3', min: 2, max: 3 },
    { label: '4-5', min: 4, max: 5 },
    { label: '6+', min: 6, max: 99 }
  ];

  const failedBuckets = [
    { label: '0', min: 0, max: 0 },
    { label: '1-2', min: 1, max: 2 },
    { label: '3-4', min: 3, max: 4 },
    { label: '5+', min: 5, max: 99 }
  ];

  const result = [];
  for (const attemptBucket of attemptsBuckets) {
    for (const failedBucket of failedBuckets) {
      const sessions = data.filter(d =>
        d.loginAttempts >= attemptBucket.min &&
        d.loginAttempts <= attemptBucket.max &&
        d.failedLogins >= failedBucket.min &&
        d.failedLogins <= failedBucket.max
      );
      const attacks = sessions.filter(d => d.attackDetected);

      if (sessions.length > 0) {
        result.push({
          loginAttemptsLabel: attemptBucket.label,
          failedLoginsLabel: failedBucket.label,
          sessionCount: sessions.length,
          attackCount: attacks.length,
          attackRate: (attacks.length / sessions.length) * 100
        });
      }
    }
  }
  return result;
}

// Compute risk score for a session
export function computeRiskScore(session: IntrusionData): number {
  let score = 0;

  // Low IP reputation (0-40 points)
  score += (1 - session.ipReputationScore) * 40;

  // Failed logins (0-25 points)
  score += Math.min(session.failedLogins * 5, 25);

  // Unusual time access (15 points)
  if (session.unusualTimeAccess) score += 15;

  // Weak/no encryption (15 points)
  if (session.encryptionUsed === 'DES' || session.encryptionUsed === 'None') {
    score += 15;
  }

  // High login attempts (0-5 points)
  if (session.loginAttempts > 5) score += 5;

  return Math.min(score, 100);
}

// Get suspicious sessions sorted by risk
export function getSuspiciousSessions(data: IntrusionData[], limit: number = 50) {
  return data
    .map(session => ({
      ...session,
      riskScore: computeRiskScore(session)
    }))
    .sort((a, b) => {
      // First sort by attack detected
      if (a.attackDetected && !b.attackDetected) return -1;
      if (!a.attackDetected && b.attackDetected) return 1;
      // Then by risk score
      return b.riskScore - a.riskScore;
    })
    .slice(0, limit);
}

// Off-hours vs business hours attack rate
export function getOffHoursStats(data: IntrusionData[]) {
  const offHours = data.filter(d => d.unusualTimeAccess);
  const businessHours = data.filter(d => !d.unusualTimeAccess);

  return {
    offHours: {
      sessions: offHours.length,
      attacks: offHours.filter(d => d.attackDetected).length,
      attackRate: offHours.length > 0 ? (offHours.filter(d => d.attackDetected).length / offHours.length) * 100 : 0
    },
    businessHours: {
      sessions: businessHours.length,
      attacks: businessHours.filter(d => d.attackDetected).length,
      attackRate: businessHours.length > 0 ? (businessHours.filter(d => d.attackDetected).length / businessHours.length) * 100 : 0
    }
  };
}
