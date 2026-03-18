import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@mui/material/styles'
import {
  Box, Button, Card, CardContent, Chip, Dialog, DialogActions,
  DialogContent, DialogTitle, Grid, LinearProgress, Stack, Typography,
} from '@mui/material'
import {
  FaClockRotateLeft, FaBatteryFull, FaBatteryHalf, FaBatteryQuarter,
  FaCircleXmark, FaLocationDot, FaWeightHanging,
} from 'react-icons/fa6'
import { GiDeliveryDrone } from 'react-icons/gi'
import { MdOutlineCancel } from 'react-icons/md'

// Simulated active orders for the SME user
const initialActiveOrders = [
  {
    id: 'P201',
    recipient: 'Ahmad Faris',
    address: 'No. 5, Jalan Bunga Raya, Cheras, Kuala Lumpur',
    weight: '1.2 kg',
    drone: 'H3',
    battery: 78,
    status: 'In Flight',
    eta: 8,
    distance: '3.2 km',
    coords: '3.1234° N, 101.6789° E',
    dispatchedAt: '2026-03-18 14:20:00',
  },
  {
    id: 'P202',
    recipient: 'Siti Norzahra',
    address: 'Unit 12-A, Residensi Harmoni, Puchong, Selangor',
    weight: '0.8 kg',
    drone: 'H1',
    battery: 91,
    status: 'Dispatched',
    eta: 22,
    distance: '7.5 km',
    coords: '3.0891° N, 101.6201° E',
    dispatchedAt: '2026-03-18 14:30:00',
  },
  {
    id: 'P203',
    recipient: 'Tan Boon Huat',
    address: 'Lot 8, Jalan Industri 4, Shah Alam, Selangor',
    weight: '3.5 kg',
    drone: 'H6',
    battery: 45,
    status: 'Landing',
    eta: 2,
    distance: '0.4 km',
    coords: '3.0738° N, 101.5183° E',
    dispatchedAt: '2026-03-18 13:55:00',
  },
  {
    id: 'P204',
    recipient: 'Priya Devi',
    address: 'No. 22, Taman Melati, Setapak, Kuala Lumpur',
    weight: '2.0 kg',
    drone: 'H8',
    battery: 62,
    status: 'In Flight',
    eta: 14,
    distance: '5.1 km',
    coords: '3.2011° N, 101.7234° E',
    dispatchedAt: '2026-03-18 14:10:00',
  },
]

const statusConfig = {
  Dispatched: { color: '#0ea5e9', bg: 'rgba(14,165,233,0.12)', label: 'activeOrders.statusDispatched' },
  'In Flight': { color: '#a855f7', bg: 'rgba(168,85,247,0.12)', label: 'activeOrders.statusInFlight' },
  Landing: { color: '#f97316', bg: 'rgba(249,115,22,0.12)', label: 'activeOrders.statusLanding' },
  Arrived: { color: '#22c55e', bg: 'rgba(34,197,94,0.12)', label: 'activeOrders.statusArrived' },
}

function BatteryIcon({ level }) {
  if (level >= 60) return <FaBatteryFull size={14} color="#22c55e" />
  if (level >= 30) return <FaBatteryHalf size={14} color="#f97316" />
  return <FaBatteryQuarter size={14} color="#ef4444" />
}

function ActiveOrdersPage() {
  const { t } = useTranslation()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const [orders, setOrders] = useState(initialActiveOrders)
  const [cancelTarget, setCancelTarget] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  // Simulate ETA countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setOrders((prev) =>
        prev.map((o) => ({
          ...o,
          eta: o.eta > 0 ? o.eta - 1 : 0,
          status: o.eta === 1 ? 'Arrived' : o.status,
        }))
      )
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  const handleCancelClick = (order) => {
    setCancelTarget(order)
    setConfirmOpen(true)
  }

  const handleConfirmCancel = () => {
    setOrders((prev) => prev.filter((o) => o.id !== cancelTarget.id))
    setConfirmOpen(false)
    setCancelTarget(null)
  }

  const canCancel = (status) => status === 'Dispatched'

  return (
    <Box>
      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <FaClockRotateLeft color="#14b8a6" />
          <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.5rem', md: '1.85rem' } }}>
            {t('activeOrders.title')}
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          {t('activeOrders.subtitle')}
        </Typography>
        <Box sx={{ borderBottom: '2px solid', borderColor: 'divider', mt: 1 }} />
      </Stack>

      {orders.length === 0 ? (
        <Card sx={{ borderRadius: 3, textAlign: 'center', py: 6 }}>
          <GiDeliveryDrone size={56} color={isDark ? '#334155' : '#cbd5e1'} />
          <Typography variant="h6" sx={{ mt: 2, fontWeight: 700, color: 'text.secondary' }}>
            {t('activeOrders.noOrders')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {t('activeOrders.noOrdersHint')}
          </Typography>
        </Card>
      ) : (
        <Grid container spacing={2.5}>
          {orders.map((order) => {
            const cfg = statusConfig[order.status] || statusConfig['In Flight']
            const battColor = order.battery >= 60 ? '#22c55e' : order.battery >= 30 ? '#f97316' : '#ef4444'
            return (
              <Grid item xs={12} md={6} key={order.id}>
                <Card
                  sx={{
                    borderRadius: 3,
                    border: `1px solid ${cfg.color}33`,
                    transition: 'box-shadow 0.2s',
                    '&:hover': { boxShadow: `0 4px 24px ${cfg.color}22` },
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    {/* Header row */}
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.main' }}>
                          {order.id}
                        </Typography>
                        <Chip
                          label={t(cfg.label)}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            fontSize: '0.72rem',
                            color: cfg.color,
                            bgcolor: cfg.bg,
                            border: `1px solid ${cfg.color}55`,
                          }}
                        />
                      </Stack>
                      {canCancel(order.status) && (
                        <Button
                          size="small"
                          color="error"
                          startIcon={<MdOutlineCancel />}
                          onClick={() => handleCancelClick(order)}
                          sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.78rem' }}
                        >
                          {t('activeOrders.cancel')}
                        </Button>
                      )}
                    </Stack>

                    {/* Recipient + Address */}
                    <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.3 }}>
                      {order.recipient}
                    </Typography>
                    <Stack direction="row" spacing={0.5} alignItems="flex-start" sx={{ mb: 1.5 }}>
                      <FaLocationDot size={12} color="#14b8a6" style={{ marginTop: 3, flexShrink: 0 }} />
                      <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                        {order.address}
                      </Typography>
                    </Stack>

                    {/* ETA Progress */}
                    <Box sx={{ mb: 1.5 }}>
                      <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                          {t('activeOrders.eta')}
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: cfg.color }}>
                          {order.eta === 0
                            ? t('activeOrders.arrived')
                            : `${order.eta} ${t('activeOrders.mins')}`}
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={order.eta === 0 ? 100 : Math.max(5, 100 - order.eta * 4)}
                        sx={{
                          borderRadius: 4,
                          height: 6,
                          bgcolor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                          '& .MuiLinearProgress-bar': { bgcolor: cfg.color, borderRadius: 4 },
                        }}
                      />
                    </Box>

                    {/* Info row */}
                    <Stack direction="row" spacing={2} flexWrap="wrap">
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <GiDeliveryDrone size={13} color="#14b8a6" />
                        <Typography variant="caption" sx={{ fontWeight: 700 }}>
                          {order.drone}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <BatteryIcon level={order.battery} />
                        <Typography variant="caption" sx={{ fontWeight: 700, color: battColor }}>
                          {order.battery}%
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <FaWeightHanging size={11} color="#94a3b8" />
                        <Typography variant="caption" color="text.secondary">
                          {order.weight}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <FaLocationDot size={11} color="#94a3b8" />
                        <Typography variant="caption" color="text.secondary">
                          {order.distance}
                        </Typography>
                      </Stack>
                    </Stack>

                    {/* GPS coords */}
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        mt: 1,
                        fontFamily: 'monospace',
                        color: 'text.disabled',
                        fontSize: '0.68rem',
                      }}
                    >
                      GPS: {order.coords}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      )}

      {/* Cancel Confirm Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>
          {t('activeOrders.cancelTitle')}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            {t('activeOrders.cancelConfirm', { id: cancelTarget?.id })}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmOpen(false)} sx={{ textTransform: 'none' }}>
            {t('activeOrders.keepOrder')}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmCancel}
            sx={{ textTransform: 'none', fontWeight: 700 }}
          >
            {t('activeOrders.confirmCancel')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ActiveOrdersPage
