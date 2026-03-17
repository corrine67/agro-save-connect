import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  LinearProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { FaLock, FaKey } from 'react-icons/fa6'
import { MdCheckCircle } from 'react-icons/md'
import PageHeader from '../components/PageHeader.jsx'

// Mock blockchain ledger data
const blockchainLedger = [
  {
    id: 'BLK-001',
    timestamp: '2026-03-17 14:32:15',
    event: 'Parcel Pickup',
    parcelId: 'P102',
    droneId: 'H3',
    location: 'Warehouse Alpha',
    hash: '0x7f3a9c2e1b5d8f4a6c9e2b1d3f5a7c9e',
    status: 'Confirmed',
  },
  {
    id: 'BLK-002',
    timestamp: '2026-03-17 14:45:22',
    event: 'Drone Handoff',
    parcelId: 'P102',
    droneId: 'H3 → H8',
    location: 'Midpoint Coordinates',
    hash: '0x2b4d6f8a1c3e5g7h9j1k3l5m7n9o1p3q',
    status: 'Confirmed',
  },
  {
    id: 'BLK-003',
    timestamp: '2026-03-17 15:12:48',
    event: 'Delivery Attempt',
    parcelId: 'P102',
    droneId: 'H8',
    location: 'Cheras, Kuala Lumpur',
    hash: '0x5c7e9g1i3k5m7o9q1r3s5t7u9v1w3x5y',
    status: 'Pending OTP',
  },
  {
    id: 'BLK-004',
    timestamp: '2026-03-17 15:18:33',
    event: 'OTP Verified',
    parcelId: 'P102',
    droneId: 'H8',
    location: 'Cheras, Kuala Lumpur',
    hash: '0x8f1h3j5l7n9p1r3t5v7w9x1y3z5a7b9c',
    status: 'Confirmed',
  },
  {
    id: 'BLK-005',
    timestamp: '2026-03-17 15:19:05',
    event: 'Parcel Released',
    parcelId: 'P102',
    droneId: 'H8',
    location: 'Cheras, Kuala Lumpur',
    hash: '0x1d3f5h7j9l1n3p5r7t9v1w3y5z7a9b1c',
    status: 'Confirmed',
  },
]

// Mock encrypted command data
const encryptedCommands = [
  {
    id: 'CMD-001',
    timestamp: '2026-03-17 14:30:00',
    command: 'Assign Parcel P102 to H3',
    encryption: 'AES-256',
    status: 'Encrypted',
    signalStrength: 95,
  },
  {
    id: 'CMD-002',
    timestamp: '2026-03-17 14:45:00',
    command: 'Initiate Handoff: H3 → H8',
    encryption: 'AES-256',
    status: 'Encrypted',
    signalStrength: 92,
  },
  {
    id: 'CMD-003',
    timestamp: '2026-03-17 15:12:00',
    command: 'Approach Delivery Location',
    encryption: 'AES-256',
    status: 'Encrypted',
    signalStrength: 88,
  },
]

function SecurityDashboard() {
  const { t } = useTranslation()
  const [otpDialog, setOtpDialog] = useState(false)
  const [selectedParcel, setSelectedParcel] = useState(null)
  const [otpInput, setOtpInput] = useState('')
  const [otpVerified, setOtpVerified] = useState(false)

  const handleOtpClick = (parcelId) => {
    setSelectedParcel(parcelId)
    setOtpDialog(true)
    setOtpInput('')
    setOtpVerified(false)
  }

  const handleVerifyOtp = () => {
    // Mock OTP verification (correct OTP is 123456)
    if (otpInput === '123456') {
      setOtpVerified(true)
    }
  }

  const handleCloseOtp = () => {
    setOtpDialog(false)
    setSelectedParcel(null)
  }

  return (
    <Stack spacing={3}>
      <Box className="reveal-up">
        <PageHeader
          title="Security & Blockchain Dashboard"
          subtitle="Monitor encrypted communications, blockchain ledger, and secure delivery verification"
        />
      </Box>

      {/* Encryption Status Overview */}
      <Grid container spacing={3} className="reveal-up delay-1">
        <Grid item xs={12} sm={6} md={3}>
          <Card className="hover-lift" sx={{ borderRadius: 2, background: 'linear-gradient(135deg, rgba(34,197,94,0.1) 0%, rgba(34,197,94,0.05) 100%)' }}>
            <CardContent>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FaLock style={{ color: '#22c55e', fontSize: '1.5rem' }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Encryption Status
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#22c55e' }}>
                  100%
                </Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  All commands encrypted
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card className="hover-lift" sx={{ borderRadius: 2, background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(59,130,246,0.05) 100%)' }}>
            <CardContent>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ color: '#3b82f6', fontSize: '1.5rem', fontWeight: 'bold' }}>⛓️</Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Blockchain Blocks
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#3b82f6' }}>
                  5
                </Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  Confirmed transactions
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card className="hover-lift" sx={{ borderRadius: 2, background: 'linear-gradient(135deg, rgba(168,85,247,0.1) 0%, rgba(168,85,247,0.05) 100%)' }}>
            <CardContent>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FaKey style={{ color: '#a855f7', fontSize: '1.5rem' }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    OTP Verifications
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#a855f7' }}>
                  1/5
                </Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  Verified deliveries
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card className="hover-lift" sx={{ borderRadius: 2, background: 'linear-gradient(135deg, rgba(249,115,22,0.1) 0%, rgba(249,115,22,0.05) 100%)' }}>
            <CardContent>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FaShieldAlt style={{ color: '#f97316', fontSize: '1.5rem' }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Signal Strength
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#f97316' }}>
                  92%
                </Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  Average signal quality
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Encrypted Command Links */}
      <Card className="reveal-up delay-2" sx={{ borderRadius: 2 }}>
        <CardContent>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FaLock style={{ color: '#0f766e', fontSize: '1.3rem' }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Encrypted Command Links
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#666' }}>
              All drone commands are encrypted using AES-256 encryption. Signal strength indicates the quality of the encrypted connection.
            </Typography>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'rgba(15,118,110,0.05)' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Command ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Timestamp</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Command</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Encryption</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Signal Strength</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {encryptedCommands.map((cmd) => (
                    <TableRow key={cmd.id} sx={{ '&:hover': { backgroundColor: 'rgba(15,118,110,0.03)' } }}>
                      <TableCell sx={{ fontWeight: 500, color: '#0f766e' }}>{cmd.id}</TableCell>
                      <TableCell>{cmd.timestamp}</TableCell>
                      <TableCell>{cmd.command}</TableCell>
                      <TableCell>
                        <Chip label={cmd.encryption} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LinearProgress variant="determinate" value={cmd.signalStrength} sx={{ flex: 1 }} />
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            {cmd.signalStrength}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip label={cmd.status} size="small" sx={{ backgroundColor: 'rgba(34,197,94,0.2)', color: '#22c55e' }} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        </CardContent>
      </Card>

      {/* Blockchain Ledger */}
      <Card className="reveal-up delay-3" sx={{ borderRadius: 2 }}>
        <CardContent>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ color: '#0f766e', fontSize: '1.3rem', fontWeight: 'bold' }}>⛓️</Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Blockchain Delivery Ledger
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Immutable record of all delivery events. Each block is cryptographically linked to the previous one, ensuring data integrity.
            </Typography>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'rgba(15,118,110,0.05)' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Block ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Timestamp</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Event</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Parcel ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Drone</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Hash</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {blockchainLedger.map((block) => (
                    <TableRow key={block.id} sx={{ '&:hover': { backgroundColor: 'rgba(15,118,110,0.03)' } }}>
                      <TableCell sx={{ fontWeight: 500, color: '#0f766e' }}>{block.id}</TableCell>
                      <TableCell sx={{ fontSize: '0.85rem' }}>{block.timestamp}</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{block.event}</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{block.parcelId}</TableCell>
                      <TableCell>{block.droneId}</TableCell>
                      <TableCell sx={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#666' }}>
                        {block.hash.substring(0, 16)}...
                      </TableCell>
                      <TableCell>
                        {block.status === 'Pending OTP' ? (
                          <Chip
                            label={block.status}
                            size="small"
                            sx={{ backgroundColor: 'rgba(249,115,22,0.2)', color: '#f97316' }}
                          />
                        ) : (
                          <Chip
                            label={block.status}
                            size="small"
                            sx={{ backgroundColor: 'rgba(34,197,94,0.2)', color: '#22c55e' }}
                            icon={<FaCheckCircle />}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {block.status === 'Pending OTP' && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleOtpClick(block.parcelId)}
                            sx={{ textTransform: 'none', fontSize: '0.8rem' }}
                          >
                            Verify OTP
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

      {/* OTP Verification Dialog */}
      <Dialog open={otpDialog} onClose={handleCloseOtp} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FaKey style={{ color: '#0f766e' }} />
            Verify OTP for Parcel {selectedParcel}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <Alert severity="info">
              A 6-digit OTP has been sent to the recipient's phone. Enter it below to verify the delivery.
            </Alert>
            <TextField
              label="6-Digit OTP"
              placeholder="000000"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
              inputProps={{ maxLength: 6, style: { fontSize: '2rem', letterSpacing: '0.5rem', textAlign: 'center' } }}
              fullWidth
            />
            {otpVerified && (
              <Alert severity="success" icon={<FaCheckCircle />}>
                OTP verified successfully! Parcel released to recipient.
              </Alert>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseOtp}>Cancel</Button>
          <Button
            onClick={handleVerifyOtp}
            variant="contained"
            disabled={otpInput.length !== 6 || otpVerified}
          >
            Verify OTP
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}

export default SecurityDashboard