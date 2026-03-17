import { useTranslation } from 'react-i18next'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, Grid, Stack, Typography, Box, Chip } from '@mui/material'
import PageHeader from '../components/PageHeader.jsx'
import EnvironmentalImpactCard from '../components/EnvironmentalImpactCard.jsx'
import {
  deliveriesPerDay,
  deliveryTimeDistribution,
  utilizationRate,
} from '../data/mockData.js'
import { environmentalImpactData } from '../data/operationsData.js'

const utilizationColors = ['#0ea5e9', '#14b8a6', '#f97316']

const CustomTooltip = ({ active, payload, label, nameMap, labelMap }) => {
  if (!active || !payload?.length) return null
  return (
    <Box
      sx={{
        bgcolor: 'rgba(12,26,36,0.92)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(20,184,166,0.2)',
        borderRadius: 2,
        px: 1.5,
        py: 1,
        color: '#e8f4f8',
      }}
    >
      <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.3 }}>
        {labelMap?.[label] ?? label}
      </Typography>
      {payload.map((entry, i) => (
        <Typography key={i} variant="caption" sx={{ display: 'block', color: entry.color }}>
          {nameMap?.[entry.name] ?? entry.name}: <strong>{entry.value}</strong>
        </Typography>
      ))}
    </Box>
  )
}

function AnalyticsPage() {
  const { t } = useTranslation()

  // Map utilization names to translated labels
  const utilizationNameMap = {
    Delivering: t('analytics.delivering'),
    Idle: t('analytics.idle'),
    Charging: t('analytics.charging'),
  }

  const dayMap = {
    Mon: t('analytics.mon'),
    Tue: t('analytics.tue'),
    Wed: t('analytics.wed'),
    Thu: t('analytics.thu'),
    Fri: t('analytics.fri'),
    Sat: t('analytics.sat'),
    Sun: t('analytics.sun'),
  }

  return (
    <Stack spacing={2.5}>
      <Box className="reveal-up">
        <PageHeader
          title={t('analytics.title')}
          subtitle={t('analytics.subtitle')}
        />
      </Box>

      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Box className="reveal-up delay-1">
            <Card className="hover-lift glow-card" sx={{ height: '100%', borderRadius: 3 }}>
              <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {t('analytics.deliveriesPerDay')}
                  </Typography>
                  <Chip
                    label={t('analytics.weekly')}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(20,184,166,0.08)',
                      color: 'primary.main',
                      fontWeight: 700,
                      fontSize: '0.65rem',
                      border: '1px solid rgba(20,184,166,0.15)',
                    }}
                  />
                </Stack>
                <ResponsiveContainer width="100%" height={270}>
                  <BarChart data={deliveriesPerDay} barCategoryGap="20%">
                    <defs>
                      <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#14b8a6" stopOpacity={1} />
                        <stop offset="100%" stopColor="#0f766e" stopOpacity={0.8} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                    <XAxis dataKey="day" tick={{ fontSize: 12, fontWeight: 600 }} tickFormatter={(v) => dayMap[v] ?? v} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip labelMap={dayMap} />} />
                    <Bar dataKey="deliveries" name={t('analytics.deliveries')} fill="url(#barGrad)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <Box className="reveal-up delay-2">
            <Card className="hover-lift glow-card" sx={{ height: '100%', borderRadius: 3 }}>
              <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {t('analytics.droneUtilization')}
                  </Typography>
                  <Chip
                    label={t('analytics.realTime')}
                    size="small"
                    icon={
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          bgcolor: '#22c55e',
                          ml: 1,
                          animation: 'livePulse 2s ease-in-out infinite',
                        }}
                      />
                    }
                    sx={{
                      bgcolor: 'rgba(34,197,94,0.08)',
                      color: '#22c55e',
                      fontWeight: 700,
                      fontSize: '0.65rem',
                      border: '1px solid rgba(34,197,94,0.15)',
                    }}
                  />
                </Stack>
                <ResponsiveContainer width="100%" height={270}>
                  <PieChart>
                    <Pie
                      data={utilizationRate}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={92}
                      innerRadius={50}
                      paddingAngle={3}
                      label={({ name, value }) => `${utilizationNameMap[name] || name} ${value}%`}
                      labelLine={{ stroke: '#94a3b8', strokeWidth: 1 }}
                    >
                      {utilizationRate.map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={utilizationColors[index % utilizationColors.length]}
                          stroke="none"
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip nameMap={utilizationNameMap} />} />
                    <Legend
                      formatter={(value) => (
                        <span style={{ fontWeight: 600, fontSize: '0.8rem' }}>
                          {utilizationNameMap[value] || value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, lg: 8 }}>
          <Box className="reveal-up delay-3">
            <Card className="hover-lift glow-card" sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {t('analytics.deliveryTimeDist')}
                  </Typography>
                  <Chip
                    label={t('analytics.today')}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(249,115,22,0.08)',
                      color: '#f97316',
                      fontWeight: 700,
                      fontSize: '0.65rem',
                      border: '1px solid rgba(249,115,22,0.15)',
                    }}
                  />
                </Stack>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={deliveryTimeDistribution}>
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f97316" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#f97316" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                    <XAxis dataKey="window" tick={{ fontSize: 12, fontWeight: 600 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="minutes"
                      name={t('analytics.minutes')}
                      stroke="#f97316"
                      strokeWidth={3}
                      fill="url(#areaGrad)"
                      dot={{ r: 5, fill: '#f97316', stroke: '#fff', strokeWidth: 2 }}
                      activeDot={{ r: 7, fill: '#f97316', stroke: '#fff', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Box className="reveal-up delay-4">
            <EnvironmentalImpactCard impact={environmentalImpactData} />
          </Box>
        </Grid>
      </Grid>
    </Stack>
  )
}

export default AnalyticsPage
