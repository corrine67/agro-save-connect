import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Grid, Stack, Typography, Box } from '@mui/material'
import { FaBoxesStacked, FaClock, FaWeightHanging } from 'react-icons/fa6'
import { HiCheckBadge } from 'react-icons/hi2'
import { GiDeliveryDrone } from 'react-icons/gi'
import MetricCard from '../components/MetricCard.jsx'
import PageHeader from '../components/PageHeader.jsx'
import DeliveryTable from '../components/DeliveryTable.jsx'
import WeatherStatusCard from '../components/WeatherStatusCard.jsx'
import { deliveries } from '../data/mockData.js'
import { weatherScenarios } from '../data/operationsData.js'

const metricIcons = [
  <FaBoxesStacked key="deliveries" />,
  <GiDeliveryDrone key="drones" />,
  <HiCheckBadge key="done" />,
  <FaWeightHanging key="weight" />,
]

function nudge(value, max, min = 0) {
  const delta = Math.floor(Math.random() * 3) - 1
  return Math.min(max, Math.max(min, value + delta))
}

function DashboardPage() {
  const { t } = useTranslation()

  // Calculate total weight of all parcels
  const totalWeight = deliveries.reduce((sum, delivery) => sum + (delivery.weight || 0), 0)

  const initialMetrics = [
    { labelKey: 'dashboard.activeDeliveries', value: 24, trendKey: 'dashboard.vsYesterday' },
    { labelKey: 'dashboard.dronesAvailable', value: 17, trendKey: 'dashboard.charging' },
    { labelKey: 'dashboard.completedToday', value: 186, trendKey: 'dashboard.plusToday' },
    { labelKey: 'dashboard.totalParcelWeight', value: `${totalWeight.toFixed(1)} kg`, trendKey: 'dashboard.heavyParcels' },
  ]

  const [metrics, setMetrics] = useState(initialMetrics)
  const [weatherIndex, setWeatherIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setMetrics((prev) =>
        prev.map((m, i) => {
          if (i === 0) return { ...m, value: nudge(m.value, 40, 10) }
          if (i === 1) return { ...m, value: nudge(m.value, 25, 5) }
          if (i === 2) return { ...m, value: nudge(m.value, 300, 150) }
          return m
        }),
      )
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const weatherTimer = setInterval(() => {
      setWeatherIndex((prev) => (prev + 1) % weatherScenarios.length)
    }, 9000)

    return () => clearInterval(weatherTimer)
  }, [])

  return (
    <Stack spacing={2.5}>
      <Box className="reveal-up">
        <PageHeader
          title={t('dashboard.title')}
          subtitle={t('dashboard.subtitle')}
        />
      </Box>

      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Box className="reveal-up delay-1">
            <WeatherStatusCard weather={weatherScenarios[weatherIndex]} />
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={1.5}>
        {metrics.map((metric, index) => (
          <Grid key={metric.labelKey} size={{ xs: 12, sm: 6, lg: 3 }}>
            <Box className={`reveal-up delay-${index + 2}`}>
              <MetricCard
                title={t(metric.labelKey)}
                value={metric.value}
                trend={t(metric.trendKey)}
                icon={metricIcons[index]}
              />
            </Box>
          </Grid>
        ))}
      </Grid>

      <Box className="reveal-up delay-6">
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
          {t('dashboard.deliveryTable')}
        </Typography>
        <DeliveryTable rows={deliveries} />
      </Box>
    </Stack>
  )
}

export default DashboardPage
