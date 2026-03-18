import { useEffect, useRef, useState, useCallback } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
  Chip,
} from '@mui/material'
import { FaPlay, FaPause, FaExpand, FaCircle } from 'react-icons/fa6'

// ─── Canvas drawing helpers ───────────────────────────────────────────────────
const PALETTE = {
  delivering: { sky: '#0f2942', ground: '#1a3a1a', accent: '#22c55e' },
  idle:       { sky: '#1e293b', ground: '#2d3748', accent: '#60a5fa' },
  returning:  { sky: '#1a1a2e', ground: '#2d1b4e', accent: '#a78bfa' },
}

function drawDroneFrame(ctx, w, h, feed, tick) {
  const palette = PALETTE[feed.status?.toLowerCase()] ?? PALETTE.delivering
  const t = tick / 60

  // ── Sky gradient ──
  const sky = ctx.createLinearGradient(0, 0, 0, h * 0.55)
  sky.addColorStop(0, palette.sky)
  sky.addColorStop(1, '#0c4a6e')
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, w, h)

  // ── Horizon glow ──
  const hGlow = ctx.createRadialGradient(w / 2, h * 0.55, 0, w / 2, h * 0.55, w * 0.6)
  hGlow.addColorStop(0, 'rgba(20,184,166,0.18)')
  hGlow.addColorStop(1, 'transparent')
  ctx.fillStyle = hGlow
  ctx.fillRect(0, 0, w, h)

  // ── Ground ──
  const ground = ctx.createLinearGradient(0, h * 0.55, 0, h)
  ground.addColorStop(0, palette.ground)
  ground.addColorStop(1, '#0a1a0a')
  ctx.fillStyle = ground
  ctx.fillRect(0, h * 0.55, w, h * 0.45)

  // ── Perspective grid on ground ──
  ctx.save()
  ctx.strokeStyle = 'rgba(20,184,166,0.18)'
  ctx.lineWidth = 1
  const vp = { x: w / 2, y: h * 0.55 }
  for (let i = -8; i <= 8; i++) {
    const x = w / 2 + i * 60
    ctx.beginPath()
    ctx.moveTo(vp.x, vp.y)
    ctx.lineTo(x, h)
    ctx.stroke()
  }
  for (let row = 0; row < 6; row++) {
    const y = h * 0.55 + (h * 0.45) * (row / 5)
    const spread = (row / 5) * w * 0.5
    ctx.beginPath()
    ctx.moveTo(w / 2 - spread, y)
    ctx.lineTo(w / 2 + spread, y)
    ctx.stroke()
  }
  ctx.restore()

  // ── Stars ──
  ctx.fillStyle = 'rgba(255,255,255,0.7)'
  const stars = [[0.1,0.05],[0.3,0.12],[0.55,0.08],[0.72,0.15],[0.88,0.04],[0.2,0.2],[0.65,0.22],[0.9,0.18]]
  stars.forEach(([sx, sy]) => {
    const flicker = 0.5 + 0.5 * Math.sin(t * 2.5 + sx * 10)
    ctx.globalAlpha = flicker * 0.8
    ctx.fillRect(sx * w, sy * h, 2, 2)
  })
  ctx.globalAlpha = 1

  // ── Animated delivery target circle ──
  if (feed.status === 'Delivering') {
    const cx = w * 0.5 + Math.sin(t * 0.4) * w * 0.06
    const cy = h * 0.62 + Math.cos(t * 0.3) * h * 0.03
    const pulse = 1 + 0.15 * Math.sin(t * 3)
    ;[40, 28, 16].forEach((r, i) => {
      ctx.beginPath()
      ctx.arc(cx, cy, r * pulse, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(34,197,94,${0.6 - i * 0.15})`
      ctx.lineWidth = 2 - i * 0.5
      ctx.stroke()
    })
    // crosshair
    ctx.strokeStyle = 'rgba(34,197,94,0.9)'
    ctx.lineWidth = 1.5
    ;[[-1,0],[1,0],[0,-1],[0,1]].forEach(([dx, dy]) => {
      ctx.beginPath()
      ctx.moveTo(cx + dx * 12, cy + dy * 12)
      ctx.lineTo(cx + dx * 22, cy + dy * 22)
      ctx.stroke()
    })
  }

  // ── Horizon line ──
  ctx.strokeStyle = 'rgba(20,184,166,0.5)'
  ctx.lineWidth = 1
  ctx.setLineDash([6, 4])
  ctx.beginPath()
  ctx.moveTo(0, h * 0.55)
  ctx.lineTo(w, h * 0.55)
  ctx.stroke()
  ctx.setLineDash([])

  // ── Center reticle ──
  const cx = w / 2, cy = h / 2
  ctx.strokeStyle = palette.accent
  ctx.lineWidth = 1.5
  ctx.globalAlpha = 0.85
  // outer corners
  const cs = 20
  ;[[-1,-1],[1,-1],[1,1],[-1,1]].forEach(([sx, sy]) => {
    ctx.beginPath()
    ctx.moveTo(cx + sx * cs, cy + sy * cs)
    ctx.lineTo(cx + sx * cs, cy + sy * (cs - 10))
    ctx.moveTo(cx + sx * cs, cy + sy * cs)
    ctx.lineTo(cx + sx * (cs - 10), cy + sy * cs)
    ctx.stroke()
  })
  // center dot
  ctx.beginPath()
  ctx.arc(cx, cy, 3, 0, Math.PI * 2)
  ctx.fillStyle = palette.accent
  ctx.fill()
  ctx.globalAlpha = 1

  // ── HUD: top-left telemetry ──
  const hudFont = 'bold 11px "Courier New", monospace'
  ctx.font = hudFont
  ctx.fillStyle = palette.accent
  const lines = [
    `ALT  ${feed.altitude}`,
    `SPD  ${feed.speed}`,
    `LOC  ${feed.location.slice(0, 16)}`,
  ]
  lines.forEach((line, i) => {
    ctx.fillText(line, 10, 18 + i * 16)
  })

  // ── HUD: top-right clock ──
  const now = new Date()
  const timeStr = now.toTimeString().slice(0, 8)
  ctx.textAlign = 'right'
  ctx.fillStyle = 'rgba(255,255,255,0.7)'
  ctx.font = '10px "Courier New", monospace'
  ctx.fillText(timeStr, w - 8, 16)
  ctx.fillText(`DRONE ${feed.droneId}`, w - 8, 30)
  ctx.textAlign = 'left'

  // ── HUD: bottom bar ──
  ctx.fillStyle = 'rgba(0,0,0,0.45)'
  ctx.fillRect(0, h - 28, w, 28)
  ctx.fillStyle = palette.accent
  ctx.font = '10px "Courier New", monospace'
  ctx.fillText(`● LIVE  |  ${feed.status?.toUpperCase()}  |  ${feed.timestamp}`, 10, h - 10)

  // ── Scan line effect ──
  const scanY = ((t * 80) % h)
  const scan = ctx.createLinearGradient(0, scanY - 6, 0, scanY + 6)
  scan.addColorStop(0, 'transparent')
  scan.addColorStop(0.5, 'rgba(20,184,166,0.06)')
  scan.addColorStop(1, 'transparent')
  ctx.fillStyle = scan
  ctx.fillRect(0, scanY - 6, w, 12)
}

// ─── Mini canvas thumbnail (for card preview) ────────────────────────────────
function MiniCameraCanvas({ feed }) {
  const canvasRef = useRef(null)
  const tickRef = useRef(0)
  const rafRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const loop = () => {
      tickRef.current += 1
      drawDroneFrame(ctx, canvas.width, canvas.height, feed, tickRef.current)
      rafRef.current = requestAnimationFrame(loop)
    }
    loop()
    return () => cancelAnimationFrame(rafRef.current)
  }, [feed])

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={225}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  )
}

// ─── Full-screen camera feed ──────────────────────────────────────────────────
function CameraFeed({ feed, onClose }) {
  const canvasRef = useRef(null)
  const tickRef = useRef(0)
  const rafRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)

  useEffect(() => {
    if (!isPlaying) {
      cancelAnimationFrame(rafRef.current)
      return
    }
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const loop = () => {
      tickRef.current += 1
      drawDroneFrame(ctx, canvas.width, canvas.height, feed, tickRef.current)
      rafRef.current = requestAnimationFrame(loop)
    }
    loop()
    return () => cancelAnimationFrame(rafRef.current)
  }, [isPlaying, feed])

  useEffect(() => {
    if (!isRecording) return
    const id = setInterval(() => setRecordingTime((p) => p + 1), 1000)
    return () => clearInterval(id)
  }, [isRecording])

  const fmt = (s) =>
    `${String(Math.floor(s / 3600)).padStart(2, '0')}:${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const statusColor = feed.status === 'Delivering' ? '#22c55e' : feed.status === 'Idle' ? '#60a5fa' : '#a78bfa'

  return (
    <Stack spacing={2}>
      {/* Canvas */}
      <Box sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden', bgcolor: '#000', aspectRatio: '16/9' }}>
        <canvas ref={canvasRef} width={800} height={450} style={{ width: '100%', height: '100%', display: 'block' }} />

        {/* LIVE badge */}
        <Box sx={{ position: 'absolute', top: 12, left: 12, display: 'flex', alignItems: 'center', gap: 0.8,
          bgcolor: 'rgba(239,68,68,0.9)', color: '#fff', px: 1.2, py: 0.5, borderRadius: 1, fontWeight: 700, fontSize: '0.8rem' }}>
          <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#fff',
            animation: 'livePulse 1s infinite', '@keyframes livePulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.3 } } }} />
          LIVE
        </Box>

        {/* REC badge */}
        {isRecording && (
          <Box sx={{ position: 'absolute', top: 12, right: 12, display: 'flex', alignItems: 'center', gap: 0.8,
            bgcolor: 'rgba(239,68,68,0.9)', color: '#fff', px: 1.2, py: 0.5, borderRadius: 1, fontWeight: 700, fontSize: '0.8rem' }}>
            <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#fff',
              animation: 'livePulse 0.5s infinite', '@keyframes livePulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.3 } } }} />
            REC {fmt(recordingTime)}
          </Box>
        )}

        {/* Paused overlay */}
        {!isPlaying && (
          <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            bgcolor: 'rgba(0,0,0,0.55)' }}>
            <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '1.2rem', letterSpacing: 2 }}>⏸ PAUSED</Typography>
          </Box>
        )}
      </Box>

      {/* Info bar */}
      <Card sx={{ borderRadius: 2, bgcolor: 'rgba(15,118,110,0.06)', border: '1px solid rgba(15,118,110,0.15)' }}>
        <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
            <Stack spacing={0.3}>
              <Typography variant="subtitle2" fontWeight={700}>Drone {feed.droneId}</Typography>
              <Typography variant="caption" color="text.secondary">📍 {feed.location}</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip label={`↑ ${feed.altitude}`} size="small" sx={{ bgcolor: 'rgba(15,118,110,0.1)', fontWeight: 600, fontSize: '0.72rem' }} />
              <Chip label={`⚡ ${feed.speed}`} size="small" sx={{ bgcolor: 'rgba(15,118,110,0.1)', fontWeight: 600, fontSize: '0.72rem' }} />
              <Chip label={feed.status} size="small" sx={{ bgcolor: `${statusColor}22`, color: statusColor, fontWeight: 700 }} />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Controls */}
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <Button variant="contained" size="small" startIcon={isPlaying ? <FaPause /> : <FaPlay />}
          onClick={() => setIsPlaying((p) => !p)}
          sx={{ background: 'linear-gradient(135deg,#0f766e,#14b8a6)', textTransform: 'none', fontWeight: 600 }}>
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
        <Button variant={isRecording ? 'contained' : 'outlined'} size="small"
          startIcon={<FaCircle style={{ color: isRecording ? '#ef4444' : undefined }} />}
          onClick={() => { setIsRecording((r) => !r); if (isRecording) setRecordingTime(0) }}
          sx={{ textTransform: 'none', fontWeight: 600,
            ...(isRecording ? { bgcolor: 'rgba(239,68,68,0.15)', borderColor: '#ef4444', color: '#ef4444' } : {}) }}>
          {isRecording ? `Stop REC (${fmt(recordingTime)})` : 'Record'}
        </Button>
        {onClose && (
          <Button variant="outlined" size="small" onClick={onClose} sx={{ textTransform: 'none', fontWeight: 600, ml: 'auto' }}>
            Close
          </Button>
        )}
      </Stack>
    </Stack>
  )
}

export { MiniCameraCanvas }
export default CameraFeed
