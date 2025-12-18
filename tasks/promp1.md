## Cybersecurity Intrusion Detection Dashboard – Comprehensive Plan

This plan defines the story, UX, and technical breakdown for the dashboard based on `public/cybersecurity_intrusion_data.csv`. Each section explains what we want the user (SOC analyst) to see and how it connects to the underlying data.

---

## 1. Narrative & User Goals

- **Primary story**: Show how user behavior, technical configurations, and IP reputation combine into successful or attempted intrusions.
- **Audience**: SOC analysts / security engineers monitoring web/network sessions.
- **Key questions the dashboard must answer**:
  - How much attack pressure are we under right now?
  - Which behaviors and conditions most strongly correlate with attacks?
  - Which protocols, encryption types, and client types are being abused?
  - Which sessions / patterns should we investigate or block immediately?

The high‑level user journey: **Overview → Behavior & Authentication → Network & Protocols → Clients & Reputation → Investigate Sessions**.

---

## 2. Global Layout (App Shell)

- **Navbar (`DashboardHeader`)**
  - Title: **“Network Intrusion Detection Dashboard”**.
  - Scope controls:
    - Environment selector (even if single env for now): `All | Production | VPN`.
    - “Cohort” selector: `All Sessions | Attacks Only | Clean Sessions`.
  - Time/cohort chips (logical slices since CSV has no timestamps):
    - `All Data`, `High-Risk IPs Only (rep < 0.3)`, `Off-Hours Only (unusual_time_access=1)`.
  - Global KPIs (small pills in header):
    - **Total Sessions** = count of rows.
    - **Detected Attacks** = sum(attack_detected).
    - **Attack Rate** = Detected Attacks / Total Sessions.
    - **Off-Hours Attack Share** = % of attacks with unusual_time_access=1.
    - **Weak/No Encryption Attack Share** = % of attacks where encryption_used ∈ {DES, None}.

- **Left Sidebar (`LeftSidebar`)**
  - Filter groups (all bind to central state):
    - Attack outcome: `All | Attacks Only | Clean Only`.
    - Time of access: `All | Business Hours | Off-Hours (unusual_time_access=1)`.
    - Authentication behavior:
      - Ranges for `login_attempts` and `failed_logins`.
      - Quick presets: “Brute-force pattern (failed_logins ≥ 3)”, “Single-shot access (login_attempts=1)`”.
    - Technical filters:
      - `protocol_type`: TCP / UDP / ICMP / Other.
      - `encryption_used`: AES / DES / None.
      - `browser_type`: Chrome / Firefox / Edge / Safari / Unknown.
    - Risk filters:
      - IP reputation buckets by `ip_reputation_score`:
        - High Risk (0–0.3), Medium (0.3–0.7), Low (0.7–1.0).
  - Sidebar story: “Let me slice the dataset down to specific behaviors, channels, and risk bands.”

- **Main Content (`page.tsx` layout)**
  - Stacked vertical sections:
    1. KPI bar (overview of current slice).
    2. Behavior & authentication section.
    3. Network & protocol section.
    4. Client & reputation section.
    5. Investigation tables/anomalies.

---

## 3. Data Model & Loader (`dataLoader.ts`)

- **Source**: `public/cybersecurity_intrusion_data.csv`.
- **IntrusionData shape**:
  - `sessionId: string`
  - `networkPacketSize: number`
  - `protocolType: 'TCP' | 'UDP' | 'ICMP' | string`
  - `loginAttempts: number`
  - `sessionDuration: number`
  - `encryptionUsed: 'AES' | 'DES' | 'None' | string`
  - `ipReputationScore: number` (0–1)
  - `failedLogins: number`
  - `browserType: 'Chrome' | 'Firefox' | 'Edge' | 'Safari' | 'Unknown' | string`
  - `unusualTimeAccess: boolean`
  - `attackDetected: boolean`

- **Loader functions**:
  - `loadIntrusionData(): Promise<IntrusionData[]>`
    - Client-side `fetch('/cybersecurity_intrusion_data.csv')`, parse CSV, map to `IntrusionData`.
  - `calculateKPIs(data: IntrusionData[])`
    - `totalSessions`
    - `detectedAttacks`
    - `attackRate`
    - `offHoursAttackShare`
    - `weakEncryptionAttackShare`
  - `groupByProtocol(data: IntrusionData[])`
    - For each `protocol_type`:
      - `sessionCount`
      - `attackCount`
      - `attackRate`
  - `groupByEncryption(data: IntrusionData[])`
    - AES/DES/None + sessions, attacks, attackRate.
  - `groupByBrowser(data: IntrusionData[])`
    - `browser_type` + attackRate, offHoursAttackRate.
  - `bucketByReputation(data: IntrusionData[])`
    - Buckets (0–0.1, 0.1–0.2, … 0.9–1.0) with:
      - `sessionCount`, `attackCount`, `attackRate`.
  - `buildBehaviorBuckets(data: IntrusionData[])`
    - 2D grid: `login_attempts` buckets × `failed_logins` buckets with attackRate.
  - `getTopSuspiciousIPs(data: IntrusionData[], limit = 10)`
    - (If IP existed; since CSV doesn’t include IP column, **we will skip IP-based grouping and use “session-level” suspiciousness instead**, but keep the API name for future extension.)
  - `computeRiskScore(session: IntrusionData)`
    - Synthetic score combining:
      - low `ipReputationScore`
      - many `failedLogins`
      - `unusualTimeAccess`
      - weak/no encryption (`DES`/`None`)

---

## 4. Section-by-Section Dashboard Story

### 4.1 Overview KPI Bar (`KPICards`)

- **Inputs**: result of `calculateKPIs(filteredData)`.
- **Displayed cards**:
  - Total Sessions.
  - Detected Intrusions.
  - Attack Rate (%).
  - Off-Hours Attacks (% of attacks).
  - High-Risk Sessions (sessions where `ipReputationScore < 0.3`).
- **UX goal**: Instantly answer “How big is the problem in this current slice?”.

### 4.2 Behavior & Authentication Section

- **Heatmap: Failed Logins vs Login Attempts**  
  - Data: from `buildBehaviorBuckets` on current filtered slice.
  - X-axis: buckets of `loginAttempts` (1, 2–3, 4–5, 6+).
  - Y-axis: buckets of `failedLogins` (0, 1–2, 3–4, 5+).
  - Cell color: attack rate in bucket.
  - Story: Show that high failed logins + high attempts strongly correlates with attacks.

- **Distribution: Session Duration vs Attack Outcome**  
  - Split data into `attackDetected=true` and `false`.
  - Render histograms or boxplots of `sessionDuration` for both groups.
  - Story: Attack sessions are typically short/bursty or unusually long compared to normal use.

- **Bar: Off-Hours vs Business-Hours Attack Rate**  
  - Two bars: `unusualTimeAccess=false` vs `true` with attackRate.
  - Story: Off-hours sessions are X times more likely to be malicious.

### 4.3 Network & Protocol Section

- **Bar: Attack Rate by Protocol (`AttackTypeChart` repurposed)**  
  - Use `groupByProtocol(filteredData)`.
  - X-axis: protocol (TCP/UDP/ICMP).
  - Y-axis: attackRate.
  - Story: Highlight riskier protocols (e.g., UDP/ICMP).

- **Stacked Bar: Encryption vs Attack Outcome**  
  - Use `groupByEncryption`.
  - For each encryption type, show percentage of attacks vs clean sessions.
  - Story: Sessions with DES or None are disproportionately represented in attacks.

- **Distribution: Packet Size for Attacks vs Clean**  
  - Compare `networkPacketSize` distributions by `attackDetected` flag.
  - Story: Certain packet size ranges may be characteristic of scanners/floods.

### 4.4 Client & Reputation Section

- **Bar: Attack Rate by Browser Type**  
  - Use `groupByBrowser`.
  - X-axis: `browser_type` (Chrome, Firefox, Edge, Safari, Unknown).
  - Y-axis: attackRate.
  - Story: “Unknown” or non-standard clients show higher attack rates than normal browsers.

- **Grouped Bar: Browser × Off-Hours Attack Rate**  
  - For each browser type, two bars: normal hours vs off-hours attackRate.
  - Story: Show combinations like “Unknown browser at off-hours” as especially risky.

- **Line/Step Chart: Attack Rate vs IP Reputation Bucket**  
  - Use `bucketByReputation`.
  - X-axis: reputation bucket (0–0.1, …).
  - Y-axis: attackRate.
  - Story: Visualize monotonic increase in risk toward low reputation.

### 4.5 Investigation & Anomalies Section

- **Anomalies Chart (`AnomaliesChart`)**
  - Use synthetic anomaly score per session (e.g., top percentile of `computeRiskScore`).
  - Aggregate by protocol, browser, or behavior pattern to show “where anomalies cluster”.

- **Suspicious Sessions Table (`SuspiciousIPsTable` repurposed)**
  - Table rows represent **sessions**, not IPs (since dataset lacks explicit IPs).
  - Columns:
    - `sessionId`
    - `protocolType`
    - `browserType`
    - `loginAttempts`
    - `failedLogins`
    - `sessionDuration`
    - `encryptionUsed`
    - `ipReputationScore` (with colored badge)
    - `unusualTimeAccess` (icon)
    - `attackDetected` (Attack / Clean label)
    - `riskScore` (derived).
  - Default sort by `riskScore` desc, then `attackDetected=true` first.
  - Row click opens a drawer with detailed “mini-story”:
    - Behavior summary (attempts, fails, off-hours).
    - Technical summary (protocol, encryption, browser, reputation).

---

## 5. State Management & Data Flow

- **State (in `page.tsx`)**
  - `intrusionData: IntrusionData[]` – raw data from CSV.
  - `loading: boolean` – loader state.
  - `filters` – derived from `LeftSidebar`:
    - attack outcome, time of access, protocol, encryption, browser, reputation bucket, login/failed ranges.

- **Derived data (via hooks/utils)**
  - `filteredData` = `intrusionData` run through all active filters.
  - `kpis` = `calculateKPIs(filteredData)`.
  - `protocolStats` = `groupByProtocol(filteredData)`.
  - `encryptionStats` = `groupByEncryption(filteredData)`.
  - `browserStats` = `groupByBrowser(filteredData)`.
  - `reputationBuckets` = `bucketByReputation(filteredData)`.
  - `behaviorBuckets` = `buildBehaviorBuckets(filteredData)`.
  - `suspiciousSessions` = `filteredData` sorted by `computeRiskScore`.

---

## 6. Visual & UX Style

- **Visual language**
  - Tailwind-based, soft slate background, white cards with subtle borders and shadows.
  - Use consistent iconography for attacks, off-hours, weak encryption, and risk.
  - Tooltips on all charts explaining what “attack rate” and “risk” mean.

- **Responsive behavior**
  - On desktop: three-column grids for charts, sidebar always visible.
  - On mobile: sidebar collapses to a drawer, charts stack vertically.

---

## 7. Future Enhancements (optional)

- Replace CSV loader with real API endpoint.
- Add timestamp to sessions and drive real date pickers.
- Add authentication and per-tenant data views.
- Add “Playbook” suggestions on high-risk patterns (e.g., automatic block rules).

This plan should be used as the blueprint for wiring the existing components (`DashboardHeader`, `LeftSidebar`, `KPICards`, charts, tables) to the real intrusion CSV data and for guiding future iterations of the dashboard.
