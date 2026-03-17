import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@mui/material/styles'
import { Box, Card, CardContent, Chip, Grid, Stack, Typography } from '@mui/material'
import { FaCloudRain, FaLocationDot, FaMountainSun, FaWarehouse, FaNetworkWired } from 'react-icons/fa6'
import { GiDeliveryDrone } from 'react-icons/gi'
import { MdBlock, MdPriorityHigh } from 'react-icons/md'
import PageHeader from '../components/PageHeader.jsx'
import EnhancedDroneMap from '../components/EnhancedDroneMap.jsx'
import SimulationControls from '../components/SimulationControls.jsx'
import SwarmAlertPanel from '../components/SwarmAlertPanel.jsx'
import SwarmStatusPanel from '../components/SwarmStatusPanel.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'

function LiveMapPage() {
  const { t } = useTranslation()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const { user } = useAuth()
  const userRole = user?.role || 'user'
  const isSME = userRole === 'user'
  const isManager = userRole === 'manager'
  const desktopSidebarHeight = 'calc(clamp(680px, 78vh, 820px) + 72px)'
  const [isRunning, setIsRunning] = useState(true)
  const [droneCount, setDroneCount] = useState(isSME ? 2 : 8)
  const [speed, setSpeed] = useState(1)
  const [showHeatmap, setShowHeatmap] = useState(false)
  const [priorityMode, setPriorityMode] = useState(false)
  const [showNoFlyZones, setShowNoFlyZones] = useState(true)
  const [swarmState, setSwarmState] = useState({
    activeDroneCount: 0,
    communicationEnabled: false,
    communicationLinks: 0,
    collisionAvoidanceActive: true,
    routeOptimizationRunning: true,
    taskRedistributionEnabled: false,
    activeAlerts: 0,
  })
  const [swarmAlerts, setSwarmAlerts] = useState([])
  const [dronePositions, setDronePositions] = useState([])

  const handleSwarmAlertsChange = useCallback((alerts) => {
    if (isSME) {
      // For SME, only show alerts related to their drones (assume H1, H2 for demo)
      const userDroneIds = ['H1', 'H2']
      const filtered = alerts.filter(alert => {
        // Check if alert mentions a user drone
        return alert.lines.some(line => userDroneIds.some(id => line.includes(id)))
      })
      setSwarmAlerts(filtered)
    } else {
      setSwarmAlerts(alerts)
    }
  }, [isSME])

  const handleReset = () => {
    setIsRunning(false)
    if (window.__droneMapReset) {
      window.__droneMapReset()
    }
    setTimeout(() => setIsRunning(true), 100)
  }

  return (
    <Stack spacing={2.5}>
      <Box className="reveal-up">
        <PageHeader
          title={t('map.title')}
          subtitle={t('map.subtitle')}
        />
      </Box>

      <Grid container spacing={1.5}>
        {/* Main Map Area */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Box className="reveal-up delay-1">
            <EnhancedDroneMap
              droneCount={droneCount}
              speed={speed}
              isRunning={isRunning}
              showHeatmap={showHeatmap}
              priorityMode={priorityMode}
              showNoFlyZones={showNoFlyZones}
              onSwarmStateChange={setSwarmState}
              onSwarmAlertsChange={handleSwarmAlertsChange}
              onDronePositionsChange={setDronePositions}
            />
          </Box>
        </Grid>

        {/* Right Sidebar */}
        <Grid size={{ xs: 12, lg: 4 }} sx={{ display: 'flex' }}>
          <Stack
            spacing={isManager ? 1 : (isSME ? 1 : 1.2)}
            sx={{
              width: '100%',
              height: { xs: 'auto', lg: isManager || isSME ? desktopSidebarHeight : '100%' },
            }}
          >
            {/* Swarm Alerts - Hidden for SME */}
            {!isSME && (
              <Box className="reveal-up delay-2" sx={{ flex: isManager ? 1.08 : 1.08, minHeight: 0 }}>
                <Card className="hover-lift glow-card" sx={{ borderRadius: 3, height: '100%' }}>
                  <CardContent sx={{ p: isManager ? 1.4 : 1.8, height: '100%', overflow: 'auto' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: isManager ? 0.8 : 1 }}>
                      {t('map.swarmAdjustment')}
                    </Typography>
                    <SwarmAlertPanel alerts={swarmAlerts} placement="sidebar" />
                  </CardContent>
                </Card>
              </Box>
            )}

            {/* Map Legend */}
            <Box className="reveal-up delay-3" sx={{ flex: isManager ? 1 : (isSME ? 1.1 : 0.5), minHeight: 0 }}>
              <Card className="hover-lift glow-card" sx={{ borderRadius: 2, height: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <CardContent sx={{ p: isManager ? 1.2 : (isSME ? 1.3 : 1.5), height: '100%', overflow: 'auto' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: isManager ? 1 : (isSME ? 1.15 : 1.5), color: isDark ? 'text.primary' : 'black' }}>
                    {t('map.mapLegend')}
                  </Typography>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: isManager ? '1fr 1fr' : '1fr' },
                      gap: isManager ? 0.7 : (isSME ? 0.85 : 1),
                    }}
                  >
                    {[
                      { key: 'warehouse', icon: <FaWarehouse />, className: 'legend-warehouse', label: t('map.warehouseHub') },
                      { key: 'drone', icon: <GiDeliveryDrone />, className: 'legend-drone', label: t('map.activeDrone') },
                      { key: 'urban', icon: <FaLocationDot />, className: 'legend-point', label: t('map.urbanDest') },
                      { key: 'rural', icon: <FaMountainSun />, className: 'legend-rural', label: t('map.ruralDest') },
                      { key: 'critical', icon: <MdPriorityHigh />, className: 'legend-critical', label: t('map.criticalDel') },
                      { key: 'weather', icon: <FaCloudRain />, className: 'legend-weather', label: t('map.weatherIndicator') },
                      { key: 'network', icon: <FaNetworkWired />, className: 'legend-weather', label: t('map.communicationLine') },
                      { key: 'nofly', icon: <MdBlock />, className: 'legend-nofly', label: t('map.noFlyZone') },
                    ].map((item) => (
                      <Box
                        key={item.key}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          p: isManager ? 0.65 : (isSME ? 0.72 : 0.8),
                          borderRadius: 1.5,
                          bgcolor: 'background.paper',
                          border: '1px solid',
                          borderColor: 'divider',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                          transition: 'all 0.2s',
                          '&:hover': {
                            bgcolor: 'action.hover',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: isManager ? 28 : 32,
                            height: isManager ? 28 : 32,
                            borderRadius: 1,
                            mr: isManager ? 0.7 : 1,
                            bgcolor: 'primary.light',
                            color: 'primary.contrastText',
                          }}
                        >
                          <span
                            className={`legend-icon ${item.className}`}
                            style={{ width: isManager ? 17 : 20, height: isManager ? 17 : 20, borderRadius: 4, fontSize: isManager ? 10 : 12 }}
                          >
                            {item.icon}
                          </span>
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: isManager ? 1.2 : 1.3, fontSize: isManager ? '0.78rem' : '0.875rem' }}>
                          {item.label}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  {showHeatmap && (
                    <Stack sx={{ mt: 1.5 }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.5 }}>
                        {t('map.heatmapLegend')}
                      </Typography>
                      <div className="heatmap-gradient-bar" />
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="caption" color="text.secondary">{t('map.lowCoverage')}</Typography>
                        <Typography variant="caption" color="text.secondary">{t('map.highCoverage')}</Typography>
                      </Stack>
                    </Stack>
                  )}
                </CardContent>
              </Card>
            </Box>

            {/* Priority Info */}
            <Box className="reveal-up delay-4" sx={{ flex: isManager ? 0.84 : (isSME ? 0.82 : 0.42), minHeight: 0 }}>
              <Card className="hover-lift glow-card" sx={{ borderRadius: 2, height: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <CardContent sx={{ p: isManager ? 1.2 : (isSME ? 1.3 : 1.5), height: '100%', overflow: 'auto' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: isManager ? 1 : (isSME ? 1.15 : 1.5), color: isDark ? 'text.primary' : 'black' }}>
                    {t('map.priorityLevels')}
                  </Typography>
                  <Stack spacing={isManager ? 0.75 : (isSME ? 0.85 : 1)}>
                    {[
                      { label: t('map.critical'), color: '#ef4444', desc: t('map.medicalSupplies') },
                      { label: t('map.high'), color: '#f97316', desc: t('map.remoteDeliveries') },
                      { label: t('map.medium'), color: '#eab308', desc: t('map.standardSME') },
                      { label: t('map.low'), color: '#22c55e', desc: t('map.nonUrgent') },
                    ].map((p) => (
                      <Box
                        key={p.label}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          p: isManager ? 0.75 : (isSME ? 0.85 : 1),
                          borderRadius: 1.5,
                          bgcolor: 'background.paper',
                          border: '1px solid',
                          borderColor: 'divider',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                          transition: 'all 0.2s',
                          '&:hover': {
                            bgcolor: 'action.hover',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                          },
                        }}
                      >
                        <Chip
                          label={p.label}
                          size="small"
                          sx={{
                            bgcolor: p.color,
                            color: '#fff',
                            fontWeight: 800,
                            fontSize: isManager ? '0.64rem' : '0.7rem',
                            letterSpacing: '0.05em',
                            minWidth: isManager ? 52 : 60,
                            height: isManager ? 21 : 24,
                            mr: isManager ? 0.75 : 1,
                          }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: isManager ? 1.2 : 1.3, flex: 1, fontSize: isManager ? '0.78rem' : '0.875rem' }}>
                          {p.desc}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Box>

            {/* Delivery ETA - For SME */}
            {isSME && (
              <Box className="reveal-up delay-5" sx={{ flex: 0.82, minHeight: 0 }}>
                <Card className="hover-lift glow-card" sx={{ borderRadius: 2, height: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                  <CardContent sx={{ p: 1.3, height: '100%', overflow: 'auto' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5, color: isDark ? 'text.primary' : 'black' }}>
                      {t('map.deliveryEta')}
                    </Typography>
                    <Stack spacing={0.85}>
                      {dronePositions.slice(0, 2).map((drone) => (
                        <Box
                          key={drone.droneId}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            p: 0.85,
                            borderRadius: 1.5,
                            bgcolor: 'background.paper',
                            border: '1px solid',
                            borderColor: 'divider',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            transition: 'all 0.2s',
                            '&:hover': {
                              bgcolor: 'action.hover',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                            },
                          }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {t('map.parcel')} {drone.droneId}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: isDark ? 'text.primary' : 'black' }}>
                            {drone.eta} {t('map.minShort')}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Box>
            )}
          </Stack>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Box className="reveal-up delay-5">
            {!isSME && <SwarmStatusPanel swarmState={swarmState} />}
          </Box>
        </Grid>

        {/* Lower Row */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Box className="reveal-up delay-6">
            {!isSME && (
              <SimulationControls
                isRunning={isRunning}
                onToggleRunning={() => setIsRunning((prev) => !prev)}
                onReset={handleReset}
                droneCount={droneCount}
                onDroneCountChange={setDroneCount}
                speed={speed}
                onSpeedChange={setSpeed}
                showHeatmap={showHeatmap}
                onToggleHeatmap={() => setShowHeatmap((prev) => !prev)}
                priorityMode={priorityMode}
                onTogglePriority={() => setPriorityMode((prev) => !prev)}
                showNoFlyZones={showNoFlyZones}
                onToggleNoFlyZones={() => setShowNoFlyZones((prev) => !prev)}
              />
            )}
          </Box>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <Box className="reveal-up delay-6">
            {!isSME && (
              <Card className="hover-lift glow-card" sx={{ borderRadius: 3, height: '100%' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                    {t('map.coordSnapshot')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, lineHeight: 1.7 }}>
                    {t('map.coordDesc1')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {t('map.coordDesc2')}
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Box>
        </Grid>
      </Grid>
    </Stack>
  )
}

export default LiveMapPage
