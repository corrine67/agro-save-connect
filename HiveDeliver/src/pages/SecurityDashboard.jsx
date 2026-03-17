import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
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
    timestamp: '2026-03-17 15:12:45',
    event: 'Delivery Complete',
    parcelId: 'P102',
    droneId: 'H8',
    location: 'Customer Address',
    hash: '0x9r2s3t4u5v6w7x8y9z0a1b2c3d4e5f6g',
    status: 'Confirmed',
  },
]

function SecurityDashboard() {
  const { t } = useTranslation()
  const [otpDialog, setOtpDialog] = useState(false)
  const [selectedParcel, setSelectedParcel] = useState(null)
  const [otpInput, setOtpInput] = useState('')
  const [otpVerified, setOtpVerified] = useState(false)
  const [otpError, setOtpError] = useState('')
  const [verifiedParcels, setVerifiedParcels] = useState([])

  const handleOtpClick = (parcelId) => {
    setSelectedParcel(parcelId)
    setOtpDialog(true)
    setOtpInput('')
    setOtpVerified(false)
    setOtpError('')
  }

  const handleVerifyOtp = () => {
    // Generate a random 6-digit OTP for demo purposes
    const correctOtp = '123456' // In real app, this would come from backend

    if (otpInput.length !== 6) {
      setOtpError('Please enter a 6-digit OTP')
      return
    }

    if (otpInput === correctOtp) {
      setOtpVerified(true)
      setOtpError('')
      setVerifiedParcels(prev => [...prev, selectedParcel])
    } else {
      setOtpError('Invalid OTP. Please try again.')
    }
  }

  const handleCloseOtp = () => {
    setOtpDialog(false)
    setSelectedParcel(null)
    setOtpInput('')
    setOtpVerified(false)
    setOtpError('')
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
                  All communications encrypted
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
                  <FaKey style={{ color: '#3b82f6', fontSize: '1.5rem' }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Blockchain Blocks
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#3b82f6' }}>
                  {blockchainLedger.length}
                </Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  Immutable ledger entries
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card className="hover-lift" sx={{ borderRadius: 2, background: 'linear-gradient(135deg, rgba(249,115,22,0.1) 0%, rgba(249,115,22,0.05) 100%)' }}>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  OTP Verifications
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#f97316' }}>
                  8
                </Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  Secure releases today
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card className="hover-lift" sx={{ borderRadius: 2, background: 'linear-gradient(135deg, rgba(168,85,247,0.1) 0%, rgba(168,85,247,0.05) 100%)' }}>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Security Score
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#a855f7' }}>
                  98/100
                </Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  Enterprise grade
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Blockchain Ledger */}
      <Card className="reveal-up delay-2" sx={{ borderRadius: 2 }}>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              🔗 Blockchain Delivery Ledger
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Immutable record of all delivery events. Each block is cryptographically linked to ensure no tampering.
            </Typography>

            <Alert severity="info">
              ✓ <strong>How it works:</strong> Every delivery milestone (pickup, handoff, delivery) is recorded as a block. Each block contains a hash of the previous block, creating an unbreakable chain of custody.
            </Alert>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'rgba(15,118,110,0.05)' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Block ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Timestamp</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Event</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Parcel</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Drone</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Hash</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {blockchainLedger.map((block) => (
                    <TableRow key={block.id} sx={{ '&:hover': { backgroundColor: 'rgba(15,118,110,0.03)' } }}>
                      <TableCell sx={{ fontWeight: 500, color: '#0f766e' }}>{block.id}</TableCell>
                      <TableCell sx={{ fontSize: '0.85rem' }}>{block.timestamp}</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{block.event}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{block.parcelId}</TableCell>
                      <TableCell>{block.droneId}</TableCell>
                      <TableCell sx={{ fontSize: '0.85rem' }}>{block.location}</TableCell>
                      <TableCell sx={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>{block.hash.substring(0, 12)}...</TableCell>
                      <TableCell>
                        <Chip
                          label={block.status}
                          size="small"
                          icon={<MdCheckCircle />}
                          sx={{ backgroundColor: 'rgba(34,197,94,0.2)', color: '#22c55e' }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        </CardContent>
      </Card>

      {/* OTP Secure Release */}
      <Card className="reveal-up delay-3" sx={{ borderRadius: 2 }}>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              🔐 OTP Secure Release
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Parcels can only be released after the recipient enters a 6-digit OTP sent to their phone. This ensures secure delivery.
            </Typography>

            <Alert severity="success">
              ✓ <strong>Test OTP:</strong> 123456 (Use this code to verify the secure release mechanism)
            </Alert>

            <Stack spacing={2}>
              {['P102', 'P105', 'P108'].map((parcelId) => {
                const isVerified = verifiedParcels.includes(parcelId)
                return (
                  <Box
                    key={parcelId}
                    sx={{
                      p: 2,
                      border: `1px solid ${isVerified ? 'rgba(34,197,94,0.3)' : 'rgba(15,118,110,0.2)'}`,
                      borderRadius: 1,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      bgcolor: isVerified ? 'rgba(34,197,94,0.05)' : 'transparent',
                    }}
                  >
                    <Stack spacing={0.5}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Parcel {parcelId}
                      </Typography>
                      <Typography variant="caption" sx={{ color: isVerified ? '#22c55e' : '#666' }}>
                        {isVerified ? '✓ OTP verified - Ready for pickup' : 'Awaiting OTP verification for secure release'}
                      </Typography>
                    </Stack>
                    <Button
                      variant={isVerified ? "outlined" : "contained"}
                      size="small"
                      onClick={() => handleOtpClick(parcelId)}
                      disabled={isVerified}
                      sx={{
                        backgroundColor: isVerified ? 'transparent' : '#0f766e',
                        borderColor: isVerified ? '#22c55e' : '#0f766e',
                        color: isVerified ? '#22c55e' : 'white',
                        '&:hover': {
                          backgroundColor: isVerified ? 'rgba(34,197,94,0.1)' : '#115e59',
                          borderColor: isVerified ? '#22c55e' : '#115e59',
                        },
                      }}
                    >
                      {isVerified ? 'Verified' : 'Verify OTP'}
                    </Button>
                  </Box>
                )
              })}
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* OTP Verification Dialog */}
      <Dialog open={otpDialog} onClose={handleCloseOtp} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          Enter OTP for Parcel {selectedParcel}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ color: '#666' }}>
              A 6-digit OTP has been sent to the recipient's phone. Enter it below to verify secure release.
            </Typography>
            <TextField
              fullWidth
              label="6-Digit OTP"
              placeholder="000000"
              value={otpInput}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                setOtpInput(value)
                if (otpError) setOtpError('')
              }}
              disabled={otpVerified}
              type="text"
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              error={!!otpError}
              helperText={otpError}
            />
            {otpVerified && (
              <Alert severity="success">
                ✓ OTP verified successfully! Parcel {selectedParcel} is now released and ready for pickup.
              </Alert>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseOtp}>Close</Button>
          {!otpVerified && (
            <Button onClick={handleVerifyOtp} variant="contained" sx={{ backgroundColor: '#0f766e' }}>
              Verify OTP
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Stack>
  )
}

export default SecurityDashboard