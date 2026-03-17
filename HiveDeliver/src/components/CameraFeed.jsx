import { useEffect, useRef, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material'
import { FaCamera, FaPlay, FaPause, FaExpand } from 'react-icons/fa6'

function CameraFeed({ feed, onClose }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const recordingIntervalRef = useRef(null)

  // Simulate video stream with canvas animation
  useEffect(() => {
    if (!canvasRef.current || !isPlaying) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationId

    const drawFrame = () => {
      // Create a gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, '#1a472a')
      gradient.addColorStop(0.5, '#0f766e')
      gradient.addColorStop(1, '#164e63')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw drone perspective elements
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.fillRect(50, 50, canvas.width - 100, canvas.height - 100)

      // Draw crosshair
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.5)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(canvas.width / 2, canvas.height / 2 - 30)
      ctx.lineTo(canvas.width / 2, canvas.height / 2 + 30)
      ctx.moveTo(canvas.width / 2 - 30, canvas.height / 2)
      ctx.lineTo(canvas.width / 2 + 30, canvas.height / 2)
      ctx.stroke()

      // Draw circle around crosshair
      ctx.beginPath()
      ctx.arc(canvas.width / 2, canvas.height / 2, 40, 0, Math.PI * 2)
      ctx.stroke()

      // Draw grid
      ctx.strokeStyle = 'rgba(20, 184, 166, 0.15)'
      ctx.lineWidth = 1
      for (let i = 0; i < canvas.width; i += 50) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, canvas.height)
        ctx.stroke()
      }
      for (let i = 0; i < canvas.height; i += 50) {
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(canvas.width, i)
        ctx.stroke()
      }

      // Draw altitude indicator
      ctx.fillStyle = 'rgba(34, 197, 94, 0.8)'
      ctx.font = 'bold 14px Arial'
      ctx.fillText(`ALT: ${feed.altitude}`, 20, 30)
      ctx.fillText(`SPD: ${feed.speed}`, 20, 50)

      // Draw timestamp
      const now = new Date()
      ctx.fillText(`${now.toLocaleTimeString()}`, canvas.width - 150, 30)

      // Draw animated elements
      const time = Date.now() / 1000
      ctx.fillStyle = 'rgba(59, 130, 246, 0.3)'
      ctx.beginPath()
      ctx.arc(
        canvas.width / 2 + Math.sin(time) * 60,
        canvas.height / 2 + Math.cos(time) * 60,
        20,
        0,
        Math.PI * 2
      )
      ctx.fill()

      animationId = requestAnimationFrame(drawFrame)
    }

    drawFrame()

    return () => {
      if (animationId) cancelAnimationFrame(animationId)
    }
  }, [isPlaying, feed])

  // Handle recording timer
  useEffect(() => {
    if (isRecording) {
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } else {
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current)
    }

    return () => {
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current)
    }
  }, [isRecording])

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleRecording = () => {
    if (isRecording) {
      setRecordingTime(0)
    }
    setIsRecording(!isRecording)
  }

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  return (
    <Stack spacing={2}>
      {/* Live Feed Canvas */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          borderRadius: 2,
          overflow: 'hidden',
          backgroundColor: '#000',
          aspectRatio: '16 / 9',
        }}
      >
        <canvas
          ref={canvasRef}
          width={800}
          height={450}
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
          }}
        />

        {/* Live Indicator */}
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            backgroundColor: 'rgba(239, 68, 68, 0.9)',
            color: 'white',
            px: 1.5,
            py: 0.75,
            borderRadius: 1,
            fontWeight: 700,
            fontSize: '0.875rem',
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: 'white',
              animation: 'pulse 1s infinite',
              '@keyframes pulse': {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.5 },
              },
            }}
          />
          LIVE
        </Box>

        {/* Recording Indicator */}
        {isRecording && (
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              backgroundColor: 'rgba(239, 68, 68, 0.9)',
              color: 'white',
              px: 1.5,
              py: 0.75,
              borderRadius: 1,
              fontWeight: 700,
              fontSize: '0.875rem',
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: 'white',
                animation: 'pulse 0.5s infinite',
              }}
            />
            REC {formatTime(recordingTime)}
          </Box>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <CircularProgress sx={{ color: 'white' }} />
            <Typography sx={{ color: 'white', fontWeight: 600 }}>
              Connecting to drone...
            </Typography>
          </Box>
        )}
      </Box>

      {/* Feed Info */}
      <Card sx={{ borderRadius: 2, backgroundColor: 'rgba(15, 118, 110, 0.05)' }}>
        <CardContent>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Stack spacing={0.5}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Drone {feed.droneId}
                </Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  📍 {feed.location}
                </Typography>
              </Stack>
              <Chip
                label={feed.status}
                size="small"
                sx={{
                  backgroundColor: feed.status === 'Delivering' ? 'rgba(34,197,94,0.2)' : 'rgba(59,130,246,0.2)',
                  color: feed.status === 'Delivering' ? '#22c55e' : '#3b82f6',
                }}
              />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
              <Box>
                <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>
                  Altitude
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {feed.altitude}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>
                  Speed
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {feed.speed}
                </Typography>
              </Box>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Controls */}
      <Stack spacing={2}>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={isPlaying ? <FaPause /> : <FaPlay />}
            onClick={togglePlayPause}
            sx={{
              background: 'linear-gradient(135deg, #0f766e, #14b8a6)',
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </Button>

          <Button
            variant={isRecording ? 'contained' : 'outlined'}
            onClick={toggleRecording}
            sx={{
              backgroundColor: isRecording ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
              borderColor: isRecording ? '#ef4444' : 'inherit',
              color: isRecording ? '#ef4444' : 'inherit',
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            {isRecording ? `⏹️ Stop Recording (${formatTime(recordingTime)})` : '⏺️ Record Feed'}
          </Button>

          <Button
            variant="outlined"
            startIcon={<FaExpand />}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Fullscreen
          </Button>
        </Box>

        <Alert severity="info" sx={{ borderRadius: 1.5 }}>
          💡 <strong>Live Feed:</strong> Real-time video stream from drone camera. Use this to verify delivery locations and monitor flight conditions.
        </Alert>

        {onClose && (
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Close Feed
          </Button>
        )}
      </Stack>
    </Stack>
  )
}

export default CameraFeed
