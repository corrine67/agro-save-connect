import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { FaRoute } from 'react-icons/fa6'
import { FaCheckCircle } from 'react-icons/fa'
import { MdCheckCircle } from 'react-icons/md'
import PageHeader from '../components/PageHeader.jsx'

// Mock data for battery-aware handoff
const batteryHandoffData = [
  {
    id: 'BH-001',
    parcelId: 'P102',
    primaryDrone: 'H1',
    primaryBattery: 18,
    secondaryDrone: 'H3',
    secondaryBattery: 95,
    handoffLocation: 'Downtown Route A - Midpoint',
    eta: '14:32',
    status: 'Handoff Triggered',
  },
  {
    id: 'BH-002',
    parcelId: 'P105',
    primaryDrone: 'H2',
    primaryBattery: 22,
    secondaryDrone: 'H8',
    secondaryBattery: 88,
    handoffLocation: 'Market Street - Checkpoint',
    eta: '15:45',
    status: 'Handoff Pending',
  },
  {
    id: 'BH-003',
    parcelId: 'P108',
    primaryDrone: 'H6',
    primaryBattery: 19,
    secondaryDrone: 'H4',
    secondaryBattery: 61,
    handoffLocation: 'Harbor District - Waypoint',
    eta: '16:20',
    status: 'Handoff Triggered',
  },
]

// Mock data for multi-stop optimization
const multiStopRoutes = [
  {
    id: 'MSR-001',
    droneId: 'H3',
    parcels: ['P201', 'P202', 'P203'],
    stops: 3,
    totalDistance: '8.5 km',
    estimatedTime: '22 minutes',
    efficiency: '94%',
    status: 'Active',
  },
  {
    id: 'MSR-002',
    droneId: 'H5',
    parcels: ['P204', 'P205'],
    stops: 2,
    totalDistance: '5.2 km',
    estimatedTime: '14 minutes',
    efficiency: '91%',
    status: 'Optimizing',
  },
  {
    id: 'MSR-003',
    droneId: 'H7',
    parcels: ['P206', 'P207', 'P208', 'P209'],
    stops: 4,
    totalDistance: '12.3 km',
    estimatedTime: '28 minutes',
    efficiency: '88%',
    status: 'Planning',
  },
]

function SwarmOptimizationPage() {
  const [selectedHandoff, setSelectedHandoff] = useState(null)

  const handleExecuteHandoff = (handoffId) => {
    setSelectedHandoff(handoffId)
    setTimeout(() => setSelectedHandoff(null), 2000)
  }

  return (
    <Stack spacing={3}>
      <Box className="reveal-up">
        <PageHeader
          title="Advanced Swarm Optimization"
          subtitle="Battery-Aware Handoff and Multi-Stop Route Optimization"
        />
      </Box>

      {/* Battery-Aware Handoff Section */}
      <Grid container spacing={3} className="reveal-up delay-1">
        <Grid item xs={12} md={6}>
          <Card className="hover-lift" sx={{ borderRadius: 2, background: 'linear-gradient(135deg, rgba(249,115,22,0.1) 0%, rgba(249,115,22,0.05) 100%)' }}>
            <CardContent>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ color: '#f97316', fontSize: '1.5rem', fontWeight: 'bold' }}>🔋</Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Battery-Aware Handoff Status
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#f97316' }}>
                  3
                </Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  Active handoff operations
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card className="hover-lift" sx={{ borderRadius: 2, background: 'linear-gradient(135deg, rgba(34,197,94,0.1) 0%, rgba(34,197,94,0.05) 100%)' }}>
            <CardContent>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FaRoute style={{ color: '#22c55e', fontSize: '1.5rem' }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Multi-Stop Routes
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#22c55e' }}>
                  3
                </Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  Optimized delivery routes
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Battery-Aware Handoff Details */}
      <Card className="reveal-up delay-2" sx={{ borderRadius: 2 }}>
        <CardContent>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ color: '#0f766e', fontSize: '1.3rem', fontWeight: 'bold' }}>↕️</Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Battery-Aware Drone Handoff
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#666' }}>
              When a drone's battery drops below 20% during delivery, a relief drone is automatically dispatched to meet it at a midpoint and take over the parcel. This ensures uninterrupted service and maximizes fleet efficiency.
            </Typography>

            <Alert severity="info">
              💡 <strong>How it works:</strong> Primary drone continues to delivery point until battery reaches 20%. At that moment, a secondary drone with sufficient battery is dispatched to meet it. The parcel is transferred, and the primary drone returns to base for charging.
            </Alert>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'rgba(15,118,110,0.05)' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Handoff ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Parcel</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Primary Drone</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Battery</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Relief Drone</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Battery</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Handoff Location</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>ETA</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {batteryHandoffData.map((handoff) => (
                    <TableRow key={handoff.id} sx={{ '&:hover': { backgroundColor: 'rgba(15,118,110,0.03)' } }}>
                      <TableCell sx={{ fontWeight: 500, color: '#0f766e' }}>{handoff.id}</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{handoff.parcelId}</TableCell>
                      <TableCell>{handoff.primaryDrone}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <LinearProgress variant="determinate" value={handoff.primaryBattery} sx={{ flex: 1, height: 6, borderRadius: 3 }} />
                          <Typography variant="caption" sx={{ fontWeight: 600, color: '#ef4444' }}>
                            {handoff.primaryBattery}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{handoff.secondaryDrone}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <LinearProgress variant="determinate" value={handoff.secondaryBattery} sx={{ flex: 1, height: 6, borderRadius: 3 }} />
                          <Typography variant="caption" sx={{ fontWeight: 600, color: '#22c55e' }}>
                            {handoff.secondaryBattery}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.85rem' }}>{handoff.handoffLocation}</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{handoff.eta}</TableCell>
                      <TableCell>
                        <Chip
                          label={handoff.status}
                          size="small"
                          sx={{
                            backgroundColor: handoff.status === 'Handoff Triggered' ? 'rgba(249,115,22,0.2)' : 'rgba(59,130,246,0.2)',
                            color: handoff.status === 'Handoff Triggered' ? '#f97316' : '#3b82f6',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {handoff.status === 'Handoff Triggered' && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleExecuteHandoff(handoff.id)}
                            sx={{ textTransform: 'none', fontSize: '0.8rem' }}
                          >
                            {selectedHandoff === handoff.id ? '✓ Executed' : 'Execute'}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        </CardContent>
      </Card>

      {/* Multi-Stop Optimization Section */}
      <Card className="reveal-up delay-3" sx={{ borderRadius: 2 }}>
        <CardContent>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FaRoute style={{ color: '#0f766e', fontSize: '1.3rem' }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Multi-Stop Route Optimization (Milk Run)
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Instead of assigning one drone per delivery, the system now bundles multiple small parcels into a single optimized route. Each drone calculates the most efficient path to visit all stops, reducing total flight time and energy consumption.
            </Typography>

            <Alert severity="success">
              ✓ <strong>Benefits:</strong> Reduced flight time by 15-25%, Lower energy consumption, Fewer drones needed, Faster overall delivery completion
            </Alert>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'rgba(15,118,110,0.05)' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Route ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Drone</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Parcels</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Stops</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Total Distance</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Est. Time</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Route Efficiency</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {multiStopRoutes.map((route) => (
                    <TableRow key={route.id} sx={{ '&:hover': { backgroundColor: 'rgba(15,118,110,0.03)' } }}>
                      <TableCell sx={{ fontWeight: 500, color: '#0f766e' }}>{route.id}</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{route.droneId}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.5}>
                          {route.parcels.map((p) => (
                            <Chip key={p} label={p} size="small" variant="outlined" />
                          ))}
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{route.stops}</TableCell>
                      <TableCell>{route.totalDistance}</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{route.estimatedTime}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <LinearProgress variant="determinate" value={parseInt(route.efficiency)} sx={{ flex: 1 }} />
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            {route.efficiency}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={route.status}
                          size="small"
                          icon={route.status === 'Active' ? <FaCheckCircle /> : undefined}
                          sx={{
                            backgroundColor:
                              route.status === 'Active'
                                ? 'rgba(34,197,94,0.2)'
                                : route.status === 'Optimizing'
                                  ? 'rgba(59,130,246,0.2)'
                                  : 'rgba(168,85,247,0.2)',
                            color:
                              route.status === 'Active'
                                ? '#22c55e'
                                : route.status === 'Optimizing'
                                  ? '#3b82f6'
                                  : '#a855f7',
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <Grid container spacing={3} className="reveal-up delay-4">
        <Grid item xs={12} sm={6} md={3}>
          <Card className="hover-lift" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>
                  Avg. Battery Saved
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f766e' }}>
                  18%
                </Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  Per handoff operation
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card className="hover-lift" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>
                  Time Reduction
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f766e' }}>
                  20%
                </Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  Multi-stop routes
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card className="hover-lift" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>
                  Fleet Efficiency
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f766e' }}>
                  91%
                </Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  Overall optimization
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card className="hover-lift" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>
                  Drones Optimized
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f766e' }}>
                  6/8
                </Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  Active fleet
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  )
}

export default SwarmOptimizationPage