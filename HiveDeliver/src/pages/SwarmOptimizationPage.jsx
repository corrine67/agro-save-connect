import { useState } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
  const [selectedHandoff, setSelectedHandoff] = useState(null)

  const handleExecuteHandoff = (handoffId) => {
    setSelectedHandoff(handoffId)
    setTimeout(() => setSelectedHandoff(null), 2000)
  }

  return (
    <Stack spacing={3}>
      <Box className="reveal-up">
        <PageHeader
          title={t('swarm.title')}
          subtitle={t('swarm.subtitle')}
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
                    {t('swarm.batteryHandoffStatus')}
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#f97316' }}>
                  3
                </Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  {t('swarm.activeHandoffOps')}
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
                    {t('swarm.multiStopRoutes')}
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#22c55e' }}>
                  3
                </Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  {t('swarm.optimizedRoutes')}
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
                {t('swarm.batteryHandoffTitle')}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#666' }}>
              {t('swarm.batteryHandoffDesc')}
            </Typography>

            <Alert severity="info">
              💡 <strong>{t('swarm.howItWorks')}:</strong> {t('swarm.batteryHandoffHow')}
            </Alert>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'rgba(15,118,110,0.05)' }}>
                    <TableCell sx={{ fontWeight: 600 }}>{t('swarm.colHandoffId')}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{t('swarm.colParcel')}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{t('swarm.colPrimaryDrone')}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{t('swarm.colBattery')}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{t('swarm.colReliefDrone')}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{t('swarm.colBattery')}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{t('swarm.colHandoffLocation')}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{t('swarm.colEta')}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{t('swarm.colStatus')}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{t('swarm.colAction')}</TableCell>
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
                            {selectedHandoff === handoff.id ? t('swarm.executed') : t('swarm.execute')}
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
                {t('swarm.multiStopTitle')}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#666' }}>
              {t('swarm.multiStopDesc')}
            </Typography>

            <Alert severity="success">
              ✓ <strong>{t('swarm.benefits')}:</strong> {t('swarm.benefitsDesc')}
            </Alert>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'rgba(15,118,110,0.05)' }}>
                    <TableCell sx={{ fontWeight: 600 }}>{t('swarm.colRouteId')}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{t('swarm.colDrone')}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{t('swarm.colParcels')}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{t('swarm.colStops')}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{t('swarm.colTotalDistance')}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{t('swarm.colEstTime')}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{t('swarm.colRouteEfficiency')}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{t('swarm.colStatus')}</TableCell>
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
                  {t('swarm.avgBatterySaved')}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f766e' }}>
                  18%
                </Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  {t('swarm.perHandoffOp')}
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
                  {t('swarm.timeReduction')}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f766e' }}>
                  20%
                </Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  {t('swarm.multiStopRoutes')}
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
                  {t('swarm.fleetEfficiency')}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f766e' }}>
                  91%
                </Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  {t('swarm.overallOptimization')}
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
                  {t('swarm.dronesOptimized')}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f766e' }}>
                  6/8
                </Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  {t('swarm.activeFleet')}
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
