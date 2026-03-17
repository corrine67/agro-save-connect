import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Alert,
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
  DialogActions,
} from '@mui/material'
import { FaCamera, FaMicrophone } from 'react-icons/fa6'
import { MdCheckCircle } from 'react-icons/md'
import PageHeader from '../components/PageHeader.jsx'
import CameraFeed from '../components/CameraFeed.jsx'

// Mock drone camera feeds
const droneFeeds = [
  {
    id: 'FEED-H1',
    droneId: 'H1',
    location: 'Downtown Route A',
    altitude: '45 m',
    speed: '12 km/h',
    status: 'Delivering',
    feedUrl: 'https://via.placeholder.com/400x300?text=Drone+H1+View',
    timestamp: '2026-03-17 14:32:15',
  },
  {
    id: 'FEED-H3',
    droneId: 'H3',
    location: 'Warehouse Alpha',
    altitude: '2 m',
    speed: '0 km/h',
    status: 'Idle',
    feedUrl: 'https://via.placeholder.com/400x300?text=Drone+H3+View',
    timestamp: '2026-03-17 14:30:00',
  },
  {
    id: 'FEED-H6',
    droneId: 'H6',
    location: 'Harbor District',
    altitude: '38 m',
    speed: '15 km/h',
    status: 'Delivering',
    feedUrl: 'https://via.placeholder.com/400x300?text=Drone+H6+View',
    timestamp: '2026-03-17 14:31:45',
  },
]

// Mock voice commands history
const voiceCommandsHistory = [
  {
    id: 'VC-001',
    timestamp: '2026-03-17 14:32:00',
    command: 'Assign Drone H3 to Parcel P102',
    status: 'Executed',
    confidence: 98,
  },
  {
    id: 'VC-002',
    timestamp: '2026-03-17 14:28:15',
    command: 'Show live map for Drone H1',
    status: 'Executed',
    confidence: 95,
  },
  {
    id: 'VC-003',
    timestamp: '2026-03-17 14:25:30',
    command: 'Initiate handoff between H1 and H8',
    status: 'Executed',
    confidence: 92,
  },
  {
    id: 'VC-004',
    timestamp: '2026-03-17 14:20:00',
    command: 'Get battery status for all drones',
    status: 'Executed',
    confidence: 97,
  },
]

function InteractiveFeaturesPage() {
  const { t } = useTranslation()
  const [selectedFeed, setSelectedFeed] = useState(null)
  const [isListening, setIsListening] = useState(false)
  const [voiceInput, setVoiceInput] = useState('')
  const [voiceDialog, setVoiceDialog] = useState(false)

  const handleStartListening = () => {
    setIsListening(true)
    setTimeout(() => {
      setVoiceInput('Assign Drone H3 to Parcel P102')
      setIsListening(false)
      setVoiceDialog(true)
    }, 2000)
  }

  const handleExecuteVoiceCommand = () => {
    setVoiceDialog(false)
    setVoiceInput('')
  }

  return (
    <Stack spacing={3}>
      <Box className="reveal-up">
        <PageHeader
          title={t('interactive.title')}
          subtitle={t('interactive.subtitle')}
        />
      </Box>

      {/* Feature Overview Cards */}
      <Grid container spacing={3} className="reveal-up delay-1">
        <Grid item xs={12} md={6}>
          <Card className="hover-lift" sx={{ borderRadius: 2, background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(59,130,246,0.05) 100%)' }}>
            <CardContent>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FaCamera style={{ color: '#3b82f6', fontSize: '1.5rem' }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {t('interactive.liveDroneView')}
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#3b82f6' }}>
                  3
                </Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  {t('interactive.activeCameraFeeds')}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card className="hover-lift" sx={{ borderRadius: 2, background: 'linear-gradient(135deg, rgba(168,85,247,0.1) 0%, rgba(168,85,247,0.05) 100%)' }}>
            <CardContent>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FaMicrophone style={{ color: '#a855f7', fontSize: '1.5rem' }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {t('interactive.voiceCommands')}
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#a855f7' }}>
                  4
                </Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  {t('interactive.commandsToday')}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Live Drone-Eye View Section */}
      <Card className="reveal-up delay-2" sx={{ borderRadius: 2 }}>
        <CardContent>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FaCamera style={{ color: '#0f766e', fontSize: '1.3rem' }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {t('interactive.liveDroneView')}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#666' }}>
              {t('interactive.liveDroneViewDesc')}
            </Typography>

            <Alert severity="info">
              📹 <strong>{t('interactive.cameraFeedLabel')}:</strong> {t('interactive.cameraFeedDesc')}
            </Alert>

            <Grid container spacing={2}>
              {droneFeeds.map((feed) => (
                <Grid item xs={12} md={6} lg={4} key={feed.id}>
                  <Card
                    className="hover-lift"
                    sx={{ borderRadius: 2, cursor: 'pointer', overflow: 'hidden' }}
                    onClick={() => setSelectedFeed(feed)}
                  >
                    <Box
                      component="img"
                      src={feed.feedUrl}
                      alt={`Drone ${feed.droneId} camera feed`}
                      sx={{ width: '100%', height: 200, objectFit: 'cover' }}
                    />
                    <CardContent>
                      <Stack spacing={1}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                            {feed.droneId}
                          </Typography>
                          <Chip
                            label={feed.status}
                            size="small"
                            sx={{
                              backgroundColor: feed.status === 'Delivering' ? 'rgba(34,197,94,0.2)' : 'rgba(59,130,246,0.2)',
                              color: feed.status === 'Delivering' ? '#22c55e' : '#3b82f6',
                            }}
                          />
                        </Box>
                        <Typography variant="caption" sx={{ color: '#666' }}>
                          📍 {feed.location}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666' }}>
                          ⬆️ {feed.altitude} | 🚀 {feed.speed}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#999', fontSize: '0.75rem' }}>
                          {feed.timestamp}
                        </Typography>
                        <Button
                          size="small"
                          variant="outlined"
                          fullWidth
                          onClick={() => setSelectedFeed(feed)}
                          sx={{ mt: 1, textTransform: 'none' }}
                        >
                          {t('interactive.viewFullFeed')}
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Stack>
        </CardContent>
      </Card>

      {/* Voice Commands Section */}
      <Card className="reveal-up delay-3" sx={{ borderRadius: 2 }}>
        <CardContent>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FaMicrophone style={{ color: '#0f766e', fontSize: '1.3rem' }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {t('interactive.voiceCommandsTitle')}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#666' }}>
              {t('interactive.voiceCommandsDesc')}
            </Typography>

            <Alert severity="success">
              🎤 <strong>{t('interactive.voiceRecognitionLabel')}:</strong> {t('interactive.voiceRecognitionDesc')}
            </Alert>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                onClick={handleStartListening}
                disabled={isListening}
                sx={{
                  background: isListening
                    ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                    : 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                {isListening ? t('interactive.listening') : t('interactive.startVoiceCommand')}
              </Button>
              <Button variant="outlined" disabled>
                {isListening ? t('interactive.recording') : t('interactive.readyForCommand')}
              </Button>
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 700, mt: 3 }}>
              {t('interactive.recentVoiceCommands')}
            </Typography>

            <Stack spacing={1}>
              {voiceCommandsHistory.map((cmd) => (
                <Card key={cmd.id} variant="outlined" sx={{ borderRadius: 1.5 }}>
                  <CardContent sx={{ py: 1.5, px: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
                      <Stack spacing={0.5} sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {cmd.command}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666' }}>
                          {cmd.timestamp}
                        </Typography>
                      </Stack>
                      <Stack spacing={0.5} sx={{ alignItems: 'flex-end' }}>
                        <Chip
                          label={cmd.status}
                          size="small"
                          icon={<MdCheckCircle />}
                          sx={{ backgroundColor: 'rgba(34,197,94,0.2)', color: '#22c55e' }}
                        />
                        <Typography variant="caption" sx={{ color: '#666' }}>
                          {cmd.confidence}% {t('interactive.confidence')}
                        </Typography>
                      </Stack>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>

            <Alert severity="info">
              💡 <strong>{t('interactive.supportedCommandsLabel')}:</strong>
              <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                <li>{t('interactive.cmd1')}</li>
                <li>{t('interactive.cmd2')}</li>
                <li>{t('interactive.cmd3')}</li>
                <li>{t('interactive.cmd4')}</li>
                <li>{t('interactive.cmd5')}</li>
              </ul>
            </Alert>
          </Stack>
        </CardContent>
      </Card>

      {/* Full Feed Dialog with CameraFeed Component */}
      <Dialog open={Boolean(selectedFeed)} onClose={() => setSelectedFeed(null)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FaCamera style={{ color: '#0f766e' }} />
            {t('interactive.liveFeedTitle')} {selectedFeed?.droneId}
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 2 }}>
          {selectedFeed && (
            <CameraFeed feed={selectedFeed} onClose={() => setSelectedFeed(null)} />
          )}
        </DialogContent>
      </Dialog>

      {/* Voice Command Confirmation Dialog */}
      <Dialog open={voiceDialog} onClose={() => setVoiceDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FaMicrophone style={{ color: '#0f766e' }} />
            {t('interactive.voiceCommandDetected')}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <Alert severity="info">
              {t('interactive.voiceCommandPrompt')}
            </Alert>
            <Card variant="outlined" sx={{ borderRadius: 1.5, backgroundColor: 'rgba(59,130,246,0.05)' }}>
              <CardContent>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#3b82f6' }}>
                  {voiceInput}
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVoiceDialog(false)}>{t('interactive.cancel')}</Button>
          <Button onClick={handleExecuteVoiceCommand} variant="contained">
            {t('interactive.executeCommand')}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}

export default InteractiveFeaturesPage
