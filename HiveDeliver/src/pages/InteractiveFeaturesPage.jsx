import { useState } from 'react'
import VoiceCommandPanel from '../components/VoiceCommandPanel.jsx'
import { useTranslation } from 'react-i18next'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  LinearProgress,
} from '@mui/material'
import { FaCamera, FaMicrophone, FaCircle, FaWifi } from 'react-icons/fa6'
import { MdCheckCircle } from 'react-icons/md'
import PageHeader from '../components/PageHeader.jsx'
import CameraFeed, { MiniCameraCanvas } from '../components/CameraFeed.jsx'

// ─── Mock data ────────────────────────────────────────────────────────────────
const droneFeeds = [
  {
    id: 'FEED-H1',
    droneId: 'H1',
    location: 'Downtown Route A',
    altitude: '45 m',
    speed: '12 km/h',
    status: 'Delivering',
    battery: 78,
    signal: 92,
    timestamp: '2026-03-17 14:32:15',
  },
  {
    id: 'FEED-H3',
    droneId: 'H3',
    location: 'Warehouse Alpha',
    altitude: '2 m',
    speed: '0 km/h',
    status: 'Idle',
    battery: 100,
    signal: 99,
    timestamp: '2026-03-17 14:30:00',
  },
  {
    id: 'FEED-H6',
    droneId: 'H6',
    location: 'Harbor District',
    altitude: '38 m',
    speed: '15 km/h',
    status: 'Delivering',
    battery: 61,
    signal: 85,
    timestamp: '2026-03-17 14:31:45',
  },
]

const voiceCommandsHistory = [
  { id: 'VC-001', timestamp: '14:32:00', command: 'Assign Drone H3 to Parcel P102', confidence: 98 },
  { id: 'VC-002', timestamp: '14:28:15', command: 'Show live map for Drone H1', confidence: 95 },
  { id: 'VC-003', timestamp: '14:25:30', command: 'Initiate handoff between H1 and H8', confidence: 92 },
  { id: 'VC-004', timestamp: '14:20:00', command: 'Get battery status for all drones', confidence: 97 },
]

// ─── Status helpers ───────────────────────────────────────────────────────────
function statusColor(status) {
  if (status === 'Delivering') return { bg: 'rgba(34,197,94,0.15)', text: '#22c55e' }
  if (status === 'Idle') return { bg: 'rgba(96,165,250,0.15)', text: '#60a5fa' }
  return { bg: 'rgba(167,139,250,0.15)', text: '#a78bfa' }
}

function batteryColor(pct) {
  if (pct >= 70) return '#22c55e'
  if (pct >= 40) return '#f59e0b'
  return '#ef4444'
}

// ─── Drone Feed Card ──────────────────────────────────────────────────────────
function DroneFeedCard({ feed, onOpen }) {
  const sc = statusColor(feed.status)
  return (
    <Card
      className="hover-lift"
      onClick={() => onOpen(feed)}
      sx={{
        borderRadius: 3,
        cursor: 'pointer',
        overflow: 'hidden',
        border: '1px solid rgba(15,118,110,0.15)',
        transition: 'all 0.25s ease',
        '&:hover': {
          borderColor: '#14b8a6',
          boxShadow: '0 8px 32px rgba(15,118,110,0.2)',
          transform: 'translateY(-3px)',
        },
      }}
    >
      {/* Live canvas thumbnail */}
      <Box sx={{ position: 'relative', width: '100%', aspectRatio: '16/9', bgcolor: '#000', overflow: 'hidden' }}>
        <MiniCameraCanvas feed={feed} />

        {/* LIVE badge */}
        <Box sx={{
          position: 'absolute', top: 8, left: 8,
          display: 'flex', alignItems: 'center', gap: 0.6,
          bgcolor: 'rgba(239,68,68,0.9)', color: '#fff',
          px: 1, py: 0.4, borderRadius: 0.8,
          fontWeight: 700, fontSize: '0.7rem', letterSpacing: 1,
        }}>
          <Box sx={{
            width: 6, height: 6, borderRadius: '50%', bgcolor: '#fff',
            animation: 'livePulse 1s infinite',
            '@keyframes livePulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.3 } },
          }} />
          LIVE
        </Box>

        {/* Status badge */}
        <Box sx={{
          position: 'absolute', top: 8, right: 8,
          bgcolor: sc.bg, color: sc.text,
          px: 1, py: 0.4, borderRadius: 0.8,
          fontWeight: 700, fontSize: '0.7rem',
          backdropFilter: 'blur(4px)',
          border: `1px solid ${sc.text}44`,
        }}>
          {feed.status.toUpperCase()}
        </Box>

        {/* Drone ID overlay */}
        <Box sx={{
          position: 'absolute', bottom: 8, left: 8,
          bgcolor: 'rgba(0,0,0,0.6)', color: '#14b8a6',
          px: 1, py: 0.3, borderRadius: 0.8,
          fontWeight: 800, fontSize: '0.85rem', fontFamily: '"Courier New", monospace',
          backdropFilter: 'blur(4px)',
        }}>
          H{feed.droneId.replace('H', '')}
        </Box>

        {/* Click to expand hint */}
        <Box sx={{
          position: 'absolute', bottom: 8, right: 8,
          bgcolor: 'rgba(0,0,0,0.5)', color: 'rgba(255,255,255,0.7)',
          px: 1, py: 0.3, borderRadius: 0.8, fontSize: '0.65rem',
        }}>
          Click to expand
        </Box>
      </Box>

      {/* Card info */}
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Stack spacing={1}>
          {/* Location */}
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: sc.text, flexShrink: 0 }} />
            <Typography variant="caption" fontWeight={600} noWrap sx={{ flex: 1 }}>
              {feed.location}
            </Typography>
          </Stack>

          {/* Telemetry row */}
          <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap>
            <Chip
              label={`↑ ${feed.altitude}`}
              size="small"
              sx={{ height: 20, fontSize: '0.65rem', fontWeight: 600,
                bgcolor: 'rgba(15,118,110,0.1)', color: '#0f766e' }}
            />
            <Chip
              label={`⚡ ${feed.speed}`}
              size="small"
              sx={{ height: 20, fontSize: '0.65rem', fontWeight: 600,
                bgcolor: 'rgba(15,118,110,0.1)', color: '#0f766e' }}
            />
          </Stack>

          {/* Battery */}
          <Stack spacing={0.3}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" color="text.secondary" fontSize="0.65rem">Battery</Typography>
              <Typography variant="caption" fontWeight={700} fontSize="0.65rem" sx={{ color: batteryColor(feed.battery) }}>
                {feed.battery}%
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={feed.battery}
              sx={{
                height: 4, borderRadius: 2,
                bgcolor: 'rgba(0,0,0,0.1)',
                '& .MuiLinearProgress-bar': { bgcolor: batteryColor(feed.battery), borderRadius: 2 },
              }}
            />
          </Stack>

          {/* Signal */}
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={0.4}>
              <FaWifi style={{ fontSize: 10, color: '#0f766e' }} />
              <Typography variant="caption" color="text.secondary" fontSize="0.65rem">Signal</Typography>
            </Stack>
            <Typography variant="caption" fontWeight={700} fontSize="0.65rem" color="#0f766e">
              {feed.signal}%
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
function InteractiveFeaturesPage() {
  const { t } = useTranslation()
  const [selectedFeed, setSelectedFeed] = useState(null)


  return (
    <Stack spacing={3}>
      <Box className="reveal-up">
        <PageHeader title={t('interactive.title')} subtitle={t('interactive.subtitle')} />
      </Box>

      {/* ── Stat cards ── */}
      <Grid container spacing={2} className="reveal-up delay-1">
        <Grid item xs={12} sm={6}>
          <Card className="hover-lift" sx={{
            borderRadius: 3,
            background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(59,130,246,0.04))',
            border: '1px solid rgba(59,130,246,0.2)',
          }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(59,130,246,0.15)' }}>
                  <FaCamera style={{ color: '#3b82f6', fontSize: '1.4rem' }} />
                </Box>
                <Stack>
                  <Typography variant="h4" fontWeight={800} color="#3b82f6">3</Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    {t('interactive.activeCameraFeeds')}
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card className="hover-lift" sx={{
            borderRadius: 3,
            background: 'linear-gradient(135deg, rgba(168,85,247,0.12), rgba(168,85,247,0.04))',
            border: '1px solid rgba(168,85,247,0.2)',
          }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(168,85,247,0.15)' }}>
                  <FaMicrophone style={{ color: '#a855f7', fontSize: '1.4rem' }} />
                </Box>
                <Stack>
                  <Typography variant="h4" fontWeight={800} color="#a855f7">4</Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    {t('interactive.commandsToday')}
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ── Live Drone Camera Feeds ── */}
      <Card className="reveal-up delay-2" sx={{ borderRadius: 3, border: '1px solid rgba(15,118,110,0.12)' }}>
        <CardContent>
          <Stack spacing={2.5}>
            {/* Section header */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
              <Stack direction="row" alignItems="center" spacing={1.2}>
                <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: 'rgba(15,118,110,0.1)' }}>
                  <FaCamera style={{ color: '#0f766e', fontSize: '1.1rem' }} />
                </Box>
                <Stack>
                  <Typography variant="h6" fontWeight={700}>{t('interactive.liveDroneView')}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('interactive.liveDroneViewDesc')}
                  </Typography>
                </Stack>
              </Stack>
              <Chip
                icon={<FaCircle style={{ fontSize: 8, color: '#ef4444' }} />}
                label="3 feeds active"
                size="small"
                sx={{ bgcolor: 'rgba(239,68,68,0.1)', color: '#ef4444', fontWeight: 700, border: '1px solid rgba(239,68,68,0.2)' }}
              />
            </Stack>

            {/* Feed grid */}
            <Grid container spacing={2}>
              {droneFeeds.map((feed) => (
                <Grid item xs={12} sm={6} md={4} key={feed.id}>
                  <DroneFeedCard feed={feed} onOpen={setSelectedFeed} />
                </Grid>
              ))}
            </Grid>

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
              📹 {t('interactive.cameraFeedDesc')}
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      {/* ── Voice Commands ── */}
      <Card className="reveal-up delay-3" sx={{ borderRadius: 3, border: '1px solid rgba(168,85,247,0.15)' }}>
        <CardContent>
          <VoiceCommandPanel />
        </CardContent>
      </Card>

      {/* ── Full Feed Dialog ── */}
      <Dialog open={Boolean(selectedFeed)} onClose={() => setSelectedFeed(null)} maxWidth="md" fullWidth
        PaperProps={{ sx: { borderRadius: 3, bgcolor: 'background.paper' } }}>
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box sx={{ p: 0.8, borderRadius: 1.5, bgcolor: 'rgba(15,118,110,0.1)' }}>
              <FaCamera style={{ color: '#0f766e', fontSize: '1rem' }} />
            </Box>
            <Typography fontWeight={700}>{t('interactive.liveFeedTitle')} {selectedFeed?.droneId}</Typography>
            <Chip label="LIVE" size="small" sx={{ bgcolor: 'rgba(239,68,68,0.15)', color: '#ef4444', fontWeight: 700, ml: 'auto' }} />
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ p: 2 }}>
          {selectedFeed && <CameraFeed feed={selectedFeed} onClose={() => setSelectedFeed(null)} />}
        </DialogContent>
      </Dialog>


    </Stack>
  )
}

export default InteractiveFeaturesPage
