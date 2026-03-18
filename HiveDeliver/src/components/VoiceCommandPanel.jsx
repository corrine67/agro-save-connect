/**
 * VoiceCommandPanel.jsx
 * Real voice command interface using Web Speech API + AudioContext waveform.
 * Parses spoken commands and returns structured execution results.
 */
import { useEffect, useRef, useState, useCallback } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
  Alert,
  LinearProgress,
  Collapse,
} from '@mui/material'
import { FaMicrophone, FaMicrophoneSlash, FaCircleCheck, FaCircleXmark, FaBolt } from 'react-icons/fa6'

// ─── Command patterns ─────────────────────────────────────────────────────────
// Each pattern has: regex, type, and a response builder
const COMMAND_PATTERNS = [
  {
    type: 'assign',
    regex: /assign\s+drone\s+(h\d+)\s+to\s+parcel\s+(p\d+)/i,
    label: 'Assign Drone',
    respond: (m) => ({
      title: `Drone ${m[1].toUpperCase()} assigned to Parcel ${m[2].toUpperCase()}`,
      detail: `Route recalculated. ETA: ${2 + Math.floor(Math.random() * 8)} minutes.`,
      color: '#22c55e',
    }),
  },
  {
    type: 'battery',
    regex: /battery\s+(?:status\s+)?(?:for\s+)?(all\s+drones|h\d+)/i,
    label: 'Battery Status',
    respond: (m) => {
      const target = m[1].toLowerCase()
      if (target === 'all drones') {
        return {
          title: 'Battery Status — All Drones',
          detail: 'H1: 78%  •  H3: 100%  •  H6: 61%',
          color: '#f59e0b',
        }
      }
      const levels = { h1: 78, h3: 100, h6: 61 }
      const pct = levels[target] ?? Math.floor(60 + Math.random() * 40)
      return {
        title: `Battery Status — Drone ${target.toUpperCase()}`,
        detail: `Current charge: ${pct}%  •  ${pct > 70 ? 'Sufficient for delivery' : pct > 40 ? 'Moderate — monitor closely' : 'Low — return to base recommended'}`,
        color: pct > 70 ? '#22c55e' : pct > 40 ? '#f59e0b' : '#ef4444',
      }
    },
  },
  {
    type: 'map',
    regex: /(?:show\s+)?(?:live\s+)?map\s+(?:for\s+)?(?:drone\s+)?(h\d+)/i,
    label: 'Show Map',
    respond: (m) => ({
      title: `Live Map — Drone ${m[1].toUpperCase()}`,
      detail: `Opening real-time GPS tracking for Drone ${m[1].toUpperCase()}. Navigate to Live Drone Map page.`,
      color: '#3b82f6',
    }),
  },
  {
    type: 'handoff',
    regex: /(?:initiate\s+)?handoff\s+(?:between\s+)?(h\d+)\s+and\s+(h\d+)/i,
    label: 'Initiate Handoff',
    respond: (m) => ({
      title: `Handoff: ${m[1].toUpperCase()} → ${m[2].toUpperCase()}`,
      detail: `Relay coordinates transmitted. ${m[2].toUpperCase()} is on standby at handoff point.`,
      color: '#a855f7',
    }),
  },
  {
    type: 'route',
    regex: /(?:optimize\s+)?(?:multi.?stop\s+)?route\s+(?:for\s+)?(?:drone\s+)?(h\d+)/i,
    label: 'Optimize Route',
    respond: (m) => ({
      title: `Route Optimized — Drone ${m[1].toUpperCase()}`,
      detail: `Swarm algorithm recalculated. 3 stops reordered. Estimated fuel saving: 12%.`,
      color: '#14b8a6',
    }),
  },
  {
    type: 'return',
    regex: /(?:send\s+)?(?:drone\s+)?(h\d+|all\s+drones?)\s+(?:to\s+)?(?:return\s+to\s+)?base/i,
    label: 'Return to Base',
    respond: (m) => ({
      title: `Return to Base — ${m[1].toUpperCase()}`,
      detail: `RTB command sent. Drone will complete current delivery then return.`,
      color: '#ef4444',
    }),
  },
  {
    type: 'status',
    regex: /(?:status|report)\s+(?:for\s+)?(?:all\s+drones?|drone\s+(h\d+))/i,
    label: 'Status Report',
    respond: (m) => ({
      title: m[1] ? `Status Report — Drone ${m[1].toUpperCase()}` : 'Fleet Status Report',
      detail: m[1]
        ? `Drone ${m[1].toUpperCase()}: Delivering • On schedule • No alerts.`
        : 'H1: Delivering  •  H3: Idle  •  H6: Delivering  •  Fleet health: Good',
      color: '#60a5fa',
    }),
  },
]

function parseCommand(transcript) {
  const text = transcript.trim().toLowerCase()
  for (const pattern of COMMAND_PATTERNS) {
    const match = text.match(pattern.regex)
    if (match) {
      return {
        matched: true,
        type: pattern.type,
        label: pattern.label,
        result: pattern.respond(match),
        raw: transcript,
        confidence: Math.floor(88 + Math.random() * 12),
        timestamp: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      }
    }
  }
  return { matched: false, raw: transcript }
}

// ─── Waveform bars ────────────────────────────────────────────────────────────
function WaveformBars({ active, analyserRef }) {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width
    const H = canvas.height
    const BAR_COUNT = 32

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      let values = new Array(BAR_COUNT).fill(0)

      if (active && analyserRef.current) {
        const dataArr = new Uint8Array(analyserRef.current.frequencyBinCount)
        analyserRef.current.getByteFrequencyData(dataArr)
        const step = Math.floor(dataArr.length / BAR_COUNT)
        values = Array.from({ length: BAR_COUNT }, (_, i) => dataArr[i * step] / 255)
      } else {
        // idle gentle wave
        const t = Date.now() / 600
        values = Array.from({ length: BAR_COUNT }, (_, i) =>
          0.08 + 0.06 * Math.sin(t + i * 0.4)
        )
      }

      const barW = W / BAR_COUNT - 1.5
      values.forEach((v, i) => {
        const barH = Math.max(3, v * H * 0.85)
        const x = i * (barW + 1.5)
        const y = (H - barH) / 2
        const alpha = active ? 0.9 : 0.35
        ctx.fillStyle = active
          ? `rgba(168,85,247,${alpha})`
          : `rgba(148,163,184,${alpha})`
        ctx.beginPath()
        ctx.roundRect(x, y, barW, barH, 2)
        ctx.fill()
      })

      rafRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(rafRef.current)
  }, [active, analyserRef])

  return (
    <canvas
      ref={canvasRef}
      width={220}
      height={48}
      style={{ display: 'block' }}
    />
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
function VoiceCommandPanel() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimText, setInterimText] = useState('')
  const [history, setHistory] = useState([
    { matched: true, type: 'assign', label: 'Assign Drone', raw: 'Assign Drone H3 to Parcel P102',
      result: { title: 'Drone H3 assigned to Parcel P102', detail: 'Route recalculated. ETA: 5 minutes.', color: '#22c55e' },
      confidence: 98, timestamp: '14:32:00' },
    { matched: true, type: 'map', label: 'Show Map', raw: 'Show live map for Drone H1',
      result: { title: 'Live Map — Drone H1', detail: 'Opening real-time GPS tracking for Drone H1.', color: '#3b82f6' },
      confidence: 95, timestamp: '14:28:15' },
    { matched: true, type: 'handoff', label: 'Initiate Handoff', raw: 'Initiate handoff between H1 and H8',
      result: { title: 'Handoff: H1 → H8', detail: 'Relay coordinates transmitted. H8 is on standby.', color: '#a855f7' },
      confidence: 92, timestamp: '14:25:30' },
    { matched: true, type: 'battery', label: 'Battery Status', raw: 'Get battery status for all drones',
      result: { title: 'Battery Status — All Drones', detail: 'H1: 78%  •  H3: 100%  •  H6: 61%', color: '#f59e0b' },
      confidence: 97, timestamp: '14:20:00' },
  ])
  const [lastResult, setLastResult] = useState(null)
  const [supported, setSupported] = useState(true)
  const [permissionDenied, setPermissionDenied] = useState(false)

  const recognitionRef = useRef(null)
  const analyserRef = useRef(null)
  const audioCtxRef = useRef(null)
  const streamRef = useRef(null)

  // Check browser support
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) setSupported(false)
  }, [])

  const stopMic = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close()
      audioCtxRef.current = null
      analyserRef.current = null
    }
    setIsListening(false)
    setInterimText('')
  }, [])

  const startListening = useCallback(async () => {
    if (isListening) { stopMic(); return }

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return

    // Set up AudioContext for waveform
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
      audioCtxRef.current = audioCtx
      const source = audioCtx.createMediaStreamSource(stream)
      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)
      analyserRef.current = analyser
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        setPermissionDenied(true)
        return
      }
    }

    // Set up Speech Recognition
    const recognition = new SR()
    recognitionRef.current = recognition
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-US'
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setIsListening(true)
      setInterimText('')
      setTranscript('')
      setLastResult(null)
      setPermissionDenied(false)
    }

    recognition.onresult = (event) => {
      let interim = ''
      let final = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript
        if (event.results[i].isFinal) final += t
        else interim += t
      }
      if (interim) setInterimText(interim)
      if (final) {
        setTranscript(final)
        setInterimText('')
        const parsed = parseCommand(final)
        setLastResult(parsed)
        if (parsed.matched) {
          setHistory((prev) => [parsed, ...prev.slice(0, 9)])
        }
        stopMic()
      }
    }

    recognition.onerror = (e) => {
      if (e.error === 'not-allowed') setPermissionDenied(true)
      stopMic()
    }

    recognition.onend = () => stopMic()

    recognition.start()
  }, [isListening, stopMic])

  // Cleanup on unmount
  useEffect(() => () => stopMic(), [stopMic])

  return (
    <Stack spacing={2.5}>
      {/* ── Header ── */}
      <Stack direction="row" alignItems="center" spacing={1.2}>
        <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: 'rgba(168,85,247,0.1)' }}>
          <FaMicrophone style={{ color: '#a855f7', fontSize: '1.1rem' }} />
        </Box>
        <Stack>
          <Typography variant="h6" fontWeight={700}>Voice Commands for Dispatch</Typography>
          <Typography variant="caption" color="text.secondary">
            Control the drone fleet hands-free using natural language
          </Typography>
        </Stack>
      </Stack>

      {/* ── Browser not supported ── */}
      {!supported && (
        <Alert severity="warning" sx={{ borderRadius: 2 }}>
          Your browser does not support the Web Speech API. Please use Chrome or Edge for voice commands.
        </Alert>
      )}

      {/* ── Permission denied ── */}
      {permissionDenied && (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          Microphone access was denied. Please allow microphone permission in your browser settings and try again.
        </Alert>
      )}

      {/* ── Mic button + waveform ── */}
      {supported && (
        <Card sx={{
          borderRadius: 3,
          border: isListening ? '1.5px solid rgba(168,85,247,0.6)' : '1px solid rgba(168,85,247,0.15)',
          bgcolor: isListening ? 'rgba(168,85,247,0.05)' : 'rgba(168,85,247,0.02)',
          transition: 'all 0.3s',
          boxShadow: isListening ? '0 0 24px rgba(168,85,247,0.15)' : 'none',
        }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap" useFlexGap>
              {/* Mic button */}
              <Button
                variant="contained"
                onClick={startListening}
                startIcon={isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
                sx={{
                  background: isListening
                    ? 'linear-gradient(135deg,#ef4444,#dc2626)'
                    : 'linear-gradient(135deg,#a855f7,#9333ea)',
                  textTransform: 'none', fontWeight: 700, borderRadius: 2, px: 3, py: 1.2,
                  boxShadow: isListening
                    ? '0 0 20px rgba(239,68,68,0.45)'
                    : '0 4px 14px rgba(168,85,247,0.35)',
                  animation: isListening ? 'micPulse 1.2s ease-in-out infinite' : 'none',
                  '@keyframes micPulse': {
                    '0%,100%': { boxShadow: '0 0 12px rgba(239,68,68,0.4)' },
                    '50%': { boxShadow: '0 0 28px rgba(239,68,68,0.7)' },
                  },
                  minWidth: 160,
                }}
              >
                {isListening ? 'Stop Listening' : '🎤 Start Listening'}
              </Button>

              {/* Waveform */}
              <Box sx={{ flex: 1, minWidth: 120 }}>
                <WaveformBars active={isListening} analyserRef={analyserRef} />
              </Box>

              {/* Status label */}
              <Chip
                label={isListening ? 'Listening…' : 'Ready'}
                size="small"
                sx={{
                  bgcolor: isListening ? 'rgba(239,68,68,0.12)' : 'rgba(34,197,94,0.1)',
                  color: isListening ? '#ef4444' : '#22c55e',
                  fontWeight: 700, border: `1px solid ${isListening ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.25)'}`,
                }}
              />
            </Stack>

            {/* Interim transcript */}
            <Collapse in={Boolean(interimText)}>
              <Box sx={{ mt: 1.5, px: 1.5, py: 1, borderRadius: 1.5, bgcolor: 'rgba(168,85,247,0.06)', border: '1px dashed rgba(168,85,247,0.3)' }}>
                <Typography variant="caption" color="#a855f7" fontWeight={600} fontFamily='"Courier New", monospace'>
                  🎙 {interimText}…
                </Typography>
              </Box>
            </Collapse>
          </CardContent>
        </Card>
      )}

      {/* ── Last result ── */}
      <Collapse in={Boolean(lastResult)}>
        {lastResult && (
          <Card sx={{
            borderRadius: 2,
            border: lastResult.matched
              ? `1.5px solid ${lastResult.result?.color}55`
              : '1.5px solid rgba(239,68,68,0.3)',
            bgcolor: lastResult.matched
              ? `${lastResult.result?.color}0d`
              : 'rgba(239,68,68,0.05)',
          }}>
            <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
              {lastResult.matched ? (
                <Stack spacing={0.8}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <FaCircleCheck style={{ color: lastResult.result.color, fontSize: '1rem' }} />
                    <Typography variant="subtitle2" fontWeight={700} sx={{ color: lastResult.result.color }}>
                      {lastResult.result.title}
                    </Typography>
                    <Chip label={`${lastResult.confidence}% confidence`} size="small"
                      sx={{ ml: 'auto', bgcolor: `${lastResult.result.color}18`, color: lastResult.result.color, fontWeight: 700, fontSize: '0.65rem' }} />
                  </Stack>
                  <Typography variant="caption" color="text.secondary">{lastResult.result.detail}</Typography>
                  <Typography variant="caption" color="text.disabled" fontFamily='"Courier New", monospace'>
                    Heard: "{lastResult.raw}"
                  </Typography>
                </Stack>
              ) : (
                <Stack spacing={0.5}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <FaCircleXmark style={{ color: '#ef4444', fontSize: '1rem' }} />
                    <Typography variant="subtitle2" fontWeight={700} color="#ef4444">Command not recognised</Typography>
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    Heard: "<em>{lastResult.raw}</em>"
                  </Typography>
                  <Typography variant="caption" color="text.disabled">
                    Try: "Assign Drone H1 to Parcel P102" or "Battery status for H3"
                  </Typography>
                </Stack>
              )}
            </CardContent>
          </Card>
        )}
      </Collapse>

      {/* ── Supported commands cheatsheet ── */}
      <Card sx={{ borderRadius: 2, bgcolor: 'rgba(168,85,247,0.03)', border: '1px solid rgba(168,85,247,0.12)' }}>
        <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
          <Stack direction="row" alignItems="center" spacing={0.8} mb={1}>
            <FaBolt style={{ color: '#a855f7', fontSize: '0.8rem' }} />
            <Typography variant="caption" fontWeight={700} color="#a855f7" sx={{ textTransform: 'uppercase', letterSpacing: 0.8 }}>
              Supported Commands
            </Typography>
          </Stack>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 0.6 }}>
            {[
              '"Assign Drone H1 to Parcel P102"',
              '"Battery status for H3"',
              '"Show map for Drone H6"',
              '"Initiate handoff between H1 and H8"',
              '"Optimize route for Drone H1"',
              '"Send H3 to base"',
              '"Status for all drones"',
              '"Get battery status for all drones"',
            ].map((cmd, i) => (
              <Stack key={i} direction="row" spacing={0.8} alignItems="flex-start">
                <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: '#a855f7', mt: 0.8, flexShrink: 0 }} />
                <Typography variant="caption" color="text.secondary" sx={{ fontFamily: '"Courier New", monospace', fontSize: '0.7rem' }}>
                  {cmd}
                </Typography>
              </Stack>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* ── History ── */}
      <Stack spacing={0.8}>
        <Typography variant="subtitle2" fontWeight={700} color="text.secondary"
          sx={{ textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.7rem' }}>
          Command History
        </Typography>
        {history.map((cmd, idx) => (
          <Card key={idx} variant="outlined" sx={{
            borderRadius: 2,
            border: '1px solid rgba(168,85,247,0.12)',
            bgcolor: 'rgba(168,85,247,0.02)',
            transition: 'all 0.2s',
            '&:hover': { borderColor: 'rgba(168,85,247,0.35)', bgcolor: 'rgba(168,85,247,0.05)' },
          }}>
            <CardContent sx={{ py: 1.2, px: 2, '&:last-child': { pb: 1.2 } }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
                <Stack spacing={0.2} sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={600} noWrap>{cmd.raw}</Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="caption" color="text.secondary">{cmd.timestamp}</Typography>
                    {cmd.matched && (
                      <Typography variant="caption" sx={{ color: cmd.result.color, fontWeight: 600, fontSize: '0.65rem' }}>
                        {cmd.result.title}
                      </Typography>
                    )}
                  </Stack>
                </Stack>
                <Stack alignItems="flex-end" spacing={0.4} flexShrink={0}>
                  <Chip
                    label={cmd.matched ? 'Executed' : 'Failed'}
                    size="small"
                    icon={cmd.matched
                      ? <FaCircleCheck style={{ color: '#22c55e', fontSize: '0.65rem' }} />
                      : <FaCircleXmark style={{ color: '#ef4444', fontSize: '0.65rem' }} />}
                    sx={{
                      bgcolor: cmd.matched ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                      color: cmd.matched ? '#22c55e' : '#ef4444',
                      fontWeight: 700, height: 22, fontSize: '0.65rem',
                    }}
                  />
                  {cmd.matched && (
                    <Typography variant="caption" color="text.disabled" fontSize="0.62rem">
                      {cmd.confidence}% conf.
                    </Typography>
                  )}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Stack>
  )
}

export default VoiceCommandPanel
