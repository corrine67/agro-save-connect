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
    // Simulate voice recognition
    setTimeout(() => {
      setVoiceInput('Assign Drone H3 to Parcel P102')
      setIsListening(false)
      setVoiceDialog(true)
    }, 2000)
  }

  const handleExecuteVoiceCommand = () => {
    // Execute the voice command
    setVoiceDialog(false)
    setVoiceInput('')
  }

  return (
    <Stack spacing={3}>
      <Box className="reveal-up">
        <PageHeader
          title="Interactive Features"
          subtitle="Live Drone-Eye View and Voice Commands for Dispatch"
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
                    Live Drone-Eye View
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#3b82f6' }}>
                  3
                </Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  Active camera feeds
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
                    Voice Commands
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#a855f7' }}>
                  4
                </Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  Commands today
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
                Live Drone-Eye View
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Watch real-time video feeds from active delivery drones. Monitor altitude, speed, location, and delivery progress from the drone's perspective.
            </Typography>

            <Alert severity="info">
              📹 <strong>Camera Feed:</strong> Each drone is equipped with a high-resolution camera that streams live video to the dispatch center. Use this to verify delivery locations, monitor traffic conditions, and ensure safe operations.
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
                          View Full Feed
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
                Voice Commands for Dispatch
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Control the drone fleet hands-free using natural language voice commands. Perfect for busy dispatch managers who need to multitask.
            </Typography>

            <Alert severity="success">
              🎤 <strong>Voice Recognition:</strong> Powered by advanced speech-to-text AI. Supports commands like "Assign Drone H3 to Parcel P102", "Show battery status", "Initiate handoff", and more.
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
                {isListening ? '🔴 Listening...' : '🎤 Start Voice Command'}
              </Button>
              <Button variant="outlined" disabled>
                {isListening ? 'Recording...' : 'Ready for command'}
              </Button>
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 700, mt: 3 }}>
              Recent Voice Commands
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
                          {cmd.confidence}% confidence
                        </Typography>
                      </Stack>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>

            <Alert severity="info">
              💡 <strong>Supported Commands:</strong>
              <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                <li>"Assign Drone [ID] to Parcel [ID]"</li>
                <li>"Show battery status for [Drone ID]"</li>
                <li>"Initiate handoff between [Drone1] and [Drone2]"</li>
                <li>"Get live map for [Drone ID]"</li>
                <li>"Optimize multi-stop route for [Drone ID]"</li>
              </ul>
            </Alert>
          </Stack>
        </CardContent>
      </Card>

      {/* Full Feed Dialog */}
      <Dialog open={Boolean(selectedFeed)} onClose={() => setSelectedFeed(null)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FaCamera style={{ color: '#0f766e' }} />
            Live Feed - Drone {selectedFeed?.droneId}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <Box
              component="img"
              src={selectedFeed?.feedUrl}
              alt={`Drone ${selectedFeed?.droneId} full feed`}
              sx={{ width: '100%', borderRadius: 2 }}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Stack spacing={0.5}>
                  <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>
                    Location
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {selectedFeed?.location}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack spacing={0.5}>
                  <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>
                    Status
                  </Typography>
                  <Chip label={selectedFeed?.status} size="small" />
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack spacing={0.5}>
                  <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>
                    Altitude
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {selectedFeed?.altitude}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack spacing={0.5}>
                  <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>
                    Speed
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {selectedFeed?.speed}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedFeed(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Voice Command Confirmation Dialog */}
      <Dialog open={voiceDialog} onClose={() => setVoiceDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FaMicrophone style={{ color: '#0f766e' }} />
            Voice Command Detected
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <Alert severity="info">
              The system detected the following command. Click "Execute" to proceed.
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
          <Button onClick={() => setVoiceDialog(false)}>Cancel</Button>
          <Button onClick={handleExecuteVoiceCommand} variant="contained">
            Execute Command
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}

export default InteractiveFeaturesPage