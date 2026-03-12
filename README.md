# HiveDeliver

HiveDeliver is a hackathon frontend demo for an AI-powered swarm drone delivery platform focused on SME last-mile logistics.

The UI simulates how coordinated drone swarms can optimize routes, avoid collisions, and reduce delivery costs.

## What This Project Includes

- Modern SaaS-style dashboard UI built with React and Material UI
- Multi-page navigation with a responsive sidebar
- Dark/light mode toggle
- Live-updating dashboard metrics with animated counters
- Interactive live drone map using React Leaflet
- Logistics analytics charts with Recharts
- Delivery order simulation with AI-style drone assignment message
- Drone fleet management and swarm intelligence views
- Mock data only (no backend required)

## Pages

- Home (Landing)
- Delivery Dashboard
- Live Drone Map
- Create Delivery Order
- Hive Swarm Intelligence Panel
- Analytics
- Drone Fleet Management

## Tech Stack

- React (Vite)
- Material UI
- Recharts
- React Leaflet + Leaflet
- React Icons
- React Router

## Project Structure

The frontend app lives in the nested folder below:

```text
HiveDeliver/
	src/
		components/
		data/
		hooks/
		pages/
```

## Getting Started

1. Install dependencies

```bash
cd HiveDeliver
npm install
```

2. Start development server

```bash
npm run dev
```

3. Build for production

```bash
npm run build
```

4. Run lint checks

```bash
npm run lint
```

## Notes

- This is a frontend-only simulation for demo purposes.
- Map movement and metrics are simulated with mock data and timed updates.
- The default Vite port may auto-shift (for example, from `5173` to `5174`) if the port is already in use.