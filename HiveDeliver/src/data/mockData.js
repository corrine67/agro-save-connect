export const keyMetrics = [
  { label: 'Active Deliveries', value: 24, trend: '+8% vs yesterday' },
  { label: 'Drones Available', value: 17, trend: '3 charging' },
  { label: 'Completed Deliveries Today', value: 186, trend: '+14 today' },
  { label: 'Average Delivery Time', value: '14 min', trend: '-2 min improvement' },
]

export const deliveries = [
  { parcelId: 'HD-4101', destination: 'SME Hub - Downtown', assignedDrone: 'H1', status: 'Delivering', weight: 2.5 },
  { parcelId: 'HD-4102', destination: 'Tech Park Unit 7', assignedDrone: 'H3', status: 'Waiting', weight: 1.8 },
  { parcelId: 'HD-4103', destination: 'Riverside Retail Block', assignedDrone: 'H5', status: 'Delivered', weight: 3.2 },
  { parcelId: 'HD-4104', destination: 'Market Street Kiosk', assignedDrone: 'H2', status: 'Delivering', weight: 4.1 },
  { parcelId: 'HD-4105', destination: 'Old Town Distribution', assignedDrone: 'H8', status: 'Delivered', weight: 28.5 }, // Heavy parcel - 2 drones
  { parcelId: 'HD-4106', destination: 'North SME Cluster', assignedDrone: 'H4 & H9', status: 'Waiting', weight: 32.0 }, // Heavy parcel - 2 drones
  { parcelId: 'HD-4107', destination: 'Harbor Light Shops', assignedDrone: 'H6', status: 'Delivering', weight: 1.2 },
  { parcelId: 'HD-4108', destination: 'Innovation Quarter', assignedDrone: 'H7', status: 'Delivered', weight: 26.8 }, // Heavy parcel - 2 drones
  { parcelId: 'HD-4109', destination: 'City Mall Annex', assignedDrone: 'H10 & H11', status: 'Waiting', weight: 45.2 }, // Heavy parcel - 2 drones
  { parcelId: 'HD-4110', destination: 'Canal Point SMEs', assignedDrone: 'H12', status: 'Delivering', weight: 5.7 },
]

export const drones = [
  { droneId: 'H1', batteryLevel: 82, status: 'Delivering', currentLocation: 'Downtown Route A' },
  { droneId: 'H2', batteryLevel: 74, status: 'Delivering', currentLocation: 'Market Street' },
  { droneId: 'H3', batteryLevel: 95, status: 'Idle', currentLocation: 'Warehouse Alpha' },
  { droneId: 'H4', batteryLevel: 61, status: 'Idle', currentLocation: 'Warehouse Alpha' },
  { droneId: 'H5', batteryLevel: 33, status: 'Charging', currentLocation: 'Charging Bay 2' },
  { droneId: 'H6', batteryLevel: 69, status: 'Delivering', currentLocation: 'Harbor District' },
  { droneId: 'H7', batteryLevel: 44, status: 'Charging', currentLocation: 'Charging Bay 1' },
  { droneId: 'H8', batteryLevel: 88, status: 'Idle', currentLocation: 'Warehouse Alpha' },
]

export const benefits = [
  {
    title: 'Faster delivery for SMEs',
    description: 'Swarm coordination cuts idle travel and reduces wait times for small businesses.',
  },
  {
    title: 'Lower logistics costs',
    description: 'Autonomous assignment lowers manual dispatch overhead and fuel-equivalent spend.',
  },
  {
    title: 'AI swarm coordination',
    description: 'Hive-based intelligence balances tasks across drones in real time.',
  },
  {
    title: 'Smart route optimization',
    description: 'Dynamic rerouting avoids congestion and improves successful delivery rates.',
  },
]

export const swarmMetrics = [
  { label: 'Active Drone Swarm', value: 18 },
  { label: 'Collision Avoidance System', value: 'Active' },
  { label: 'Route Optimization', value: 'Running' },
  { label: 'Swarm Efficiency', value: '94%' },
]

export const deliveriesPerDay = [
  { day: 'Mon', deliveries: 132 },
  { day: 'Tue', deliveries: 148 },
  { day: 'Wed', deliveries: 157 },
  { day: 'Thu', deliveries: 171 },
  { day: 'Fri', deliveries: 189 },
  { day: 'Sat', deliveries: 164 },
  { day: 'Sun', deliveries: 142 },
]

export const utilizationRate = [
  { name: 'Delivering', value: 54 },
  { name: 'Idle', value: 28 },
  { name: 'Charging', value: 18 },
]

export const deliveryTimeDistribution = [
  { window: '08:00', minutes: 18 },
  { window: '10:00', minutes: 16 },
  { window: '12:00', minutes: 14 },
  { window: '14:00', minutes: 13 },
  { window: '16:00', minutes: 15 },
  { window: '18:00', minutes: 17 },
]

export const mapData = {
  warehouse: {
    name: 'HiveDeliver Warehouse Alpha',
    position: [1.3002, 103.8418],
  },
  destinations: [
    { id: 'D1', name: 'Downtown SME Hub', position: [1.3078, 103.8512] },
    { id: 'D2', name: 'Harbor Retail Block', position: [1.2925, 103.8311] },
    { id: 'D3', name: 'North Innovation Park', position: [1.3191, 103.8473] },
  ],
  droneRoutes: [
    {
      droneId: 'H1',
      color: '#0ea5e9',
      destinationId: 'D1',
      path: [
        [1.3002, 103.8418],
        [1.3032, 103.8456],
        [1.3055, 103.8487],
        [1.3078, 103.8512],
      ],
    },
    {
      droneId: 'H2',
      color: '#f97316',
      destinationId: 'D2',
      path: [
        [1.3002, 103.8418],
        [1.2979, 103.8391],
        [1.2951, 103.8354],
        [1.2925, 103.8311],
      ],
    },
    {
      droneId: 'H6',
      color: '#22c55e',
      destinationId: 'D3',
      path: [
        [1.3002, 103.8418],
        [1.3049, 103.8437],
        [1.3118, 103.8456],
        [1.3191, 103.8473],
      ],
    },
  ],
}
