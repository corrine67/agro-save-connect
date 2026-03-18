import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@mui/material/styles'
import {
  Box, Button, Card, CardContent, Chip, Dialog, DialogContent,
  DialogTitle, Divider, Grid, IconButton, Stack, Tab, Tabs, Typography,
} from '@mui/material'
import {
  FaCamera, FaCircleCheck, FaCircleXmark, FaDownload,
  FaLocationDot, FaXmark,
} from 'react-icons/fa6'
import { GiDeliveryDrone } from 'react-icons/gi'

// Simulated delivery proof records
const proofRecords = [
  {
    id: 'P101',
    recipient: 'Ali bin Ahmad',
    address: 'No. 12, Jalan Manis 3, Taman Segar, 56100 Cheras, Kuala Lumpur',
    drone: 'H1',
    weight: '1.8 kg',
    deliveredAt: '2026-03-17 14:32:15',
    coords: '3.1087° N, 101.7318° E',
    status: 'Delivered',
    note: 'Received by recipient',
    photoColor: ['#0f766e', '#134e4a'],
  },
  {
    id: 'P102',
    recipient: 'Lim Wei Jian',
    address: 'Jalan Pudu, Chow Kit, 50350 Kuala Lumpur',
    drone: 'H2',
    weight: '2.5 kg',
    deliveredAt: '2026-03-05 11:18:44',
    coords: '3.1478° N, 101.6953° E',
    status: 'Delivered',
    note: 'Signed on delivery',
    photoColor: ['#1e40af', '#1e3a8a'],
  },
  {
    id: 'P105',
    recipient: 'Tan Ah Kow',
    address: 'Residensi Puchong Jaya, 47100 Puchong, Selangor',
    drone: 'H1',
    weight: '3.0 kg',
    deliveredAt: '2026-03-08 09:55:02',
    coords: '3.0272° N, 101.6191° E',
    status: 'Delivered',
    note: 'Delivered to neighbour',
    photoColor: ['#7e22ce', '#581c87'],
  },
  {
    id: 'P106',
    recipient: 'Nurul Ain',
    address: 'Semenyih, Selangor',
    drone: 'H6',
    weight: '1.1 kg',
    deliveredAt: '2026-03-09 16:40:30',
    coords: '2.9382° N, 101.8443° E',
    status: 'Failed',
    note: 'Drone battery depleted mid-route',
    photoColor: ['#991b1b', '#7f1d1d'],
  },
  {
    id: 'P110',
    recipient: 'Faizal Hamdan',
    address: 'Wangsa Maju, Kuala Lumpur',
    drone: 'H2',
    weight: '0.9 kg',
    deliveredAt: '2026-03-10 13:22:08',
    coords: '3.2011° N, 101.7234° E',
    status: 'Delivered',
    note: 'Received by recipient',
    photoColor: ['#065f46', '#064e3b'],
  },
  {
    id: 'P113',
    recipient: 'Zainab Othman',
    address: 'Damansara, Selangor',
    drone: 'H3',
    weight: '2.2 kg',
    deliveredAt: '2026-03-13 10:08:55',
    coords: '3.1570° N, 101.6103° E',
    status: 'Delivered',
    note: 'Delivered on time',
    photoColor: ['#92400e', '#78350f'],
  },
]

const statusConfig = {
  Delivered: { color: '#22c55e', bg: 'rgba(34,197,94,0.12)', icon: <FaCircleCheck size={13} />, labelKey: 'parcelProof.delivered' },
  Failed: { color: '#ef4444', bg: 'rgba(239,68,68,0.12)', icon: <FaCircleXmark size={13} />, labelKey: 'parcelProof.failed' },
}

// Canvas-based simulated drone photo
function DronePhotoCanvas({ record, width = 400, height = 260 }) {
  const canvasRef = useRef(null)
  const [rendered, setRendered] = useState(false)

  const drawPhoto = () => {
    const canvas = canvasRef.current
    if (!canvas || rendered) return
    const ctx = canvas.getContext('2d')
    const w = canvas.width
    const h = canvas.height

    // Sky gradient background
    const sky = ctx.createLinearGradient(0, 0, 0, h * 0.55)
    sky.addColorStop(0, '#0c1a2e')
    sky.addColorStop(1, '#1a3a5c')
    ctx.fillStyle = sky
    ctx.fillRect(0, 0, w, h)

    // Ground gradient
    const ground = ctx.createLinearGradient(0, h * 0.55, 0, h)
    ground.addColorStop(0, record.photoColor[0])
    ground.addColorStop(1, record.photoColor[1])
    ctx.fillStyle = ground
    ctx.fillRect(0, h * 0.55, w, h * 0.45)

    // Grid lines on ground (perspective)
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'
    ctx.lineWidth = 1
    for (let i = 0; i <= 8; i++) {
      const x = (w / 8) * i
      ctx.beginPath()
      ctx.moveTo(w / 2, h * 0.55)
      ctx.lineTo(x, h)
      ctx.stroke()
    }
    for (let i = 0; i <= 4; i++) {
      const y = h * 0.55 + (h * 0.45 / 4) * i
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(w, y)
      ctx.stroke()
    }

    // Landing target circle
    const cx = w / 2, cy = h * 0.68
    ;[40, 28, 14].forEach((r, i) => {
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.strokeStyle = i === 0 ? 'rgba(20,184,166,0.6)' : i === 1 ? 'rgba(20,184,166,0.8)' : '#14b8a6'
      ctx.lineWidth = i === 2 ? 2 : 1
      ctx.stroke()
    })
    ctx.beginPath()
    ctx.arc(cx, cy, 4, 0, Math.PI * 2)
    ctx.fillStyle = '#14b8a6'
    ctx.fill()

    // Crosshair lines
    ctx.strokeStyle = 'rgba(20,184,166,0.5)'
    ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(cx - 55, cy); ctx.lineTo(cx + 55, cy); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(cx, cy - 55); ctx.lineTo(cx, cy + 55); ctx.stroke()

    // Parcel box at landing zone
    if (record.status === 'Delivered') {
      ctx.fillStyle = 'rgba(245,158,11,0.9)'
      ctx.fillRect(cx - 12, cy - 10, 24, 20)
      ctx.strokeStyle = '#92400e'
      ctx.lineWidth = 1.5
      ctx.strokeRect(cx - 12, cy - 10, 24, 20)
      ctx.strokeStyle = 'rgba(146,64,14,0.6)'
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(cx, cy - 10); ctx.lineTo(cx, cy + 10); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(cx - 12, cy); ctx.lineTo(cx + 12, cy); ctx.stroke()
    }

    // HUD overlays
    ctx.fillStyle = 'rgba(0,0,0,0.55)'
    ctx.fillRect(0, 0, w, 28)
    ctx.fillRect(0, h - 28, w, 28)

    ctx.fillStyle = '#14b8a6'
    ctx.font = 'bold 10px Courier New'
    ctx.fillText(`● REC  DRONE ${record.drone}`, 8, 18)
    ctx.fillStyle = '#ffffff'
    ctx.font = '9px Courier New'
    ctx.fillText(record.deliveredAt, w - 130, 18)

    ctx.fillStyle = '#94a3b8'
    ctx.font = '8px Courier New'
    ctx.fillText(`GPS: ${record.coords}`, 8, h - 10)
    ctx.fillStyle = record.status === 'Delivered' ? '#22c55e' : '#ef4444'
    ctx.font = 'bold 9px Courier New'
    ctx.fillText(record.status.toUpperCase(), w - 70, h - 10)

    // Scan line overlay
    ctx.fillStyle = 'rgba(255,255,255,0.015)'
    for (let y = 0; y < h; y += 3) {
      ctx.fillRect(0, y, w, 1)
    }

    setRendered(true)
  }

  return (
    <canvas
      ref={(el) => { if (el && !rendered) { canvasRef.current = el; drawPhoto() } }}
      width={width}
      height={height}
      style={{ width: '100%', borderRadius: 8, display: 'block' }}
    />
  )
}

function ParcelProofPage() {
  const { t } = useTranslation()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const [tab, setTab] = useState(0)
  const [selected, setSelected] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const delivered = proofRecords.filter((r) => r.status === 'Delivered')
  const failed = proofRecords.filter((r) => r.status === 'Failed')
  const shown = tab === 0 ? proofRecords : tab === 1 ? delivered : failed

  const handleView = (record) => {
    setSelected(record)
    setDialogOpen(true)
  }

  const handleDownloadReceipt = (record) => {
    const lines = [
      '================================================',
      '         HIVEDELIVER — DELIVERY RECEIPT         ',
      '================================================',
      '',
      `Parcel ID     : ${record.id}`,
      `Recipient     : ${record.recipient}`,
      `Address       : ${record.address}`,
      `Drone         : ${record.drone}`,
      `Weight        : ${record.weight}`,
      `Status        : ${record.status}`,
      `Delivered At  : ${record.deliveredAt}`,
      `GPS Coords    : ${record.coords}`,
      `Note          : ${record.note}`,
      '',
      '------------------------------------------------',
      'This receipt is auto-generated by HiveDeliver.',
      'For disputes, contact support@hivedeliver.com',
      '================================================',
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `HiveDeliver_Receipt_${record.id}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Box>
      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <FaCamera color="#14b8a6" />
          <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.5rem', md: '1.85rem' } }}>
            {t('parcelProof.title')}
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          {t('parcelProof.subtitle')}
        </Typography>
        <Box sx={{ borderBottom: '2px solid', borderColor: 'divider', mt: 1 }} />
      </Stack>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{ mb: 2.5, '& .MuiTab-root': { textTransform: 'none', fontWeight: 700 } }}
      >
        <Tab label={`${t('parcelProof.all')} (${proofRecords.length})`} />
        <Tab label={`${t('parcelProof.delivered')} (${delivered.length})`} />
        <Tab label={`${t('parcelProof.failed')} (${failed.length})`} />
      </Tabs>

      <Grid container spacing={2.5}>
        {shown.map((record) => {
          const cfg = statusConfig[record.status]
          return (
            <Grid item xs={12} sm={6} md={4} key={record.id}>
              <Card
                sx={{
                  borderRadius: 3,
                  border: `1px solid ${cfg.color}33`,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': { boxShadow: `0 4px 24px ${cfg.color}22`, transform: 'translateY(-2px)' },
                }}
                onClick={() => handleView(record)}
              >
                {/* Simulated photo thumbnail */}
                <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: '12px 12px 0 0' }}>
                  <DronePhotoCanvas record={record} width={400} height={200} />
                  <Chip
                    icon={cfg.icon}
                    label={t(cfg.labelKey)}
                    size="small"
                    sx={{
                      position: 'absolute', top: 8, right: 8,
                      fontWeight: 700, fontSize: '0.7rem',
                      color: cfg.color, bgcolor: 'rgba(0,0,0,0.65)',
                      border: `1px solid ${cfg.color}66`,
                    }}
                  />
                </Box>
                <CardContent sx={{ p: 2 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main' }}>
                      {record.id}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {record.drone}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.3 }}>
                    {record.recipient}
                  </Typography>
                  <Stack direction="row" spacing={0.5} alignItems="flex-start">
                    <FaLocationDot size={11} color="#14b8a6" style={{ marginTop: 2, flexShrink: 0 }} />
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {record.address}
                    </Typography>
                  </Stack>
                  <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 0.5 }}>
                    {record.deliveredAt}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      {/* Detail Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        {selected && (
          <>
            <DialogTitle sx={{ fontWeight: 800, pr: 6 }}>
              {t('parcelProof.proofTitle', { id: selected.id })}
              <IconButton
                onClick={() => setDialogOpen(false)}
                sx={{ position: 'absolute', right: 12, top: 12 }}
              >
                <FaXmark size={16} />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ pt: 0 }}>
              {/* Full photo */}
              <Box sx={{ mb: 2, borderRadius: 2, overflow: 'hidden' }}>
                <DronePhotoCanvas record={selected} width={560} height={300} />
              </Box>

              {/* Details */}
              <Stack spacing={1}>
                {[
                  { label: t('parcelProof.parcelId'), value: selected.id },
                  { label: t('parcelProof.recipient'), value: selected.recipient },
                  { label: t('parcelProof.address'), value: selected.address },
                  { label: t('parcelProof.drone'), value: selected.drone },
                  { label: t('parcelProof.weight'), value: selected.weight },
                  { label: t('parcelProof.deliveredAt'), value: selected.deliveredAt },
                  { label: t('parcelProof.gps'), value: selected.coords },
                  { label: t('parcelProof.note'), value: selected.note },
                ].map(({ label, value }) => (
                  <Stack key={label} direction="row" spacing={1.5}>
                    <Typography variant="caption" sx={{ fontWeight: 700, minWidth: 110, color: 'text.secondary' }}>
                      {label}
                    </Typography>
                    <Typography variant="caption" sx={{ flex: 1 }}>
                      {value}
                    </Typography>
                  </Stack>
                ))}
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Button
                fullWidth
                variant="contained"
                startIcon={<FaDownload />}
                onClick={() => handleDownloadReceipt(selected)}
                sx={{
                  textTransform: 'none',
                  fontWeight: 700,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #0f766e, #14b8a6)',
                }}
              >
                {t('parcelProof.downloadReceipt')}
              </Button>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  )
}

export default ParcelProofPage
