# Network Intrusion Detection Dashboard

A modern, interactive cybersecurity intrusion detection dashboard built with Next.js, React, and Tailwind CSS.

## Features

### Dashboard Components

1. **Header Section**
   - Dashboard title and description
   - Date range picker (Last 24 Hours, 7 Days, 30 Days, Custom)
   - Network segment filter (All, DMZ, Internal, External, Cloud)

2. **KPI Cards** (5 key metrics)
   - Total intrusion events detected
   - Number of critical intrusions
   - Count of unique attack types
   - Risk score trend summary
   - Count of anomalous devices/users detected

3. **Visualizations**
   - **Line Chart**: Intrusion events over time showing total and critical events
   - **Pie Chart**: Attack types distribution (DoS, Probe, R2L, U2R)
   - **Network Map**: Visual representation of attack sources and target assets
   - **Heatmap**: Risk severity levels across days and hours
   - **Suspicious IPs Table**: Top 10 suspicious IP addresses with details
   - **Anomalies Chart**: Behavioral anomalies by network segment
   - **Alert Panel**: Active critical threat notifications

4. **Interactive Features**
   - **Filter Sidebar**: Filter by attack type, severity, network segment, and IP address
   - **Export Reports**: Download data as JSON or CSV
   - **Responsive Design**: Works on desktop and mobile devices
   - **Real-time Updates**: Dynamic data visualization

## Tech Stack

- **Framework**: Next.js 16.0.4 with App Router
- **UI Library**: React 19.2.0
- **Styling**: Tailwind CSS 4
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Language**: TypeScript 5

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm or yarn

### Installation

Dependencies are already installed. If you need to reinstall:

```bash
npm install
```

### Running the Development Server

The server is currently running at:
- Local: http://localhost:3000
- Network: http://192.168.56.1:3000

To start it manually:

```bash
npm run dev
```

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main dashboard page
│   └── globals.css         # Global styles and Tailwind config
├── components/
│   ├── DashboardHeader.tsx       # Header with filters
│   ├── KPICards.tsx              # Key metrics cards
│   ├── IntrusionTimeChart.tsx    # Time series line chart
│   ├── AttackTypeChart.tsx       # Pie chart for attack types
│   ├── NetworkMap.tsx            # Network visualization
│   ├── RiskHeatmap.tsx           # Risk severity heatmap
│   ├── SuspiciousIPsTable.tsx    # IP leaderboard table
│   ├── AnomaliesChart.tsx        # Anomalies bar chart
│   ├── AlertPanel.tsx            # Critical alerts panel
│   ├── FilterSidebar.tsx         # Filtering sidebar
│   └── ExportButton.tsx          # Data export functionality
└── lib/
    └── mockData.ts         # Mock data generator

public/
├── Mockup.png              # Dashboard mockup reference
└── cybersecurity_intrusion_data.csv  # Sample data (optional)
```

## Data Model

The dashboard uses simulated data with the following structure:

- **Intrusion Events**: Timestamp, attack type, source/target IPs, severity, risk score, network segment
- **Attack Types**: DoS, Probe, R2L, U2R
- **Severity Levels**: Critical, High, Medium, Low
- **Network Segments**: DMZ, Internal, External, Cloud

## Customization

### Adding Real Data

Replace the mock data generator in `src/lib/mockData.ts` with your actual data source:

```typescript
// Example: Fetch from API
export async function getDashboardData() {
  const response = await fetch('/api/security-data');
  return response.json();
}
```

### Styling

Tailwind CSS classes can be customized in `src/app/globals.css` and component files.

### Adding Authentication

The dashboard currently has no authentication. For production deployment, add authentication using:
- NextAuth.js
- Clerk
- Auth0
- Custom JWT implementation

## Features Implemented

- ✅ Modern responsive design
- ✅ Interactive charts and visualizations
- ✅ Real-time data filtering
- ✅ Export functionality (JSON/CSV)
- ✅ Network segment filtering
- ✅ Date range selection
- ✅ Alert management
- ✅ KPI tracking
- ✅ Mobile-friendly interface
- ✅ TypeScript support
- ✅ Server-side rendering (Next.js)

## Performance

- Static generation for optimal performance
- Turbopack for fast development builds
- Memoized computations for filtered data
- Responsive charts with proper sizing

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project was created as part of the ITD112 coursework.
