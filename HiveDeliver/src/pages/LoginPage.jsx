import { useEffect, useState, useCallback } from 'react'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Collapse,
  FormControl,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { FaLock, FaShieldHalved, FaRobot } from 'react-icons/fa6'
import { useTranslation } from 'react-i18next'
import AuthLayout from '../components/AuthLayout.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'

// ─── Constants ────────────────────────────────────────────────────────────────
const MAX_ATTEMPTS = 3
const LOCKOUT_SECONDS = 300 // 5 minutes
const LOCKOUT_KEY = 'hiveDeliver_loginLockout'

// ─── Helpers ──────────────────────────────────────────────────────────────────
function generateCaptcha() {
  const a = Math.floor(Math.random() * 9) + 1
  const b = Math.floor(Math.random() * 9) + 1
  const ops = ['+', '-', '×']
  const op = ops[Math.floor(Math.random() * ops.length)]
  let answer
  if (op === '+') answer = a + b
  else if (op === '-') answer = Math.max(a, b) - Math.min(a, b)
  else answer = a * b
  const q = op === '-' ? `${Math.max(a, b)} - ${Math.min(a, b)}` : `${a} ${op} ${b}`
  return { question: q, answer }
}

function getLockoutData() {
  try {
    const raw = localStorage.getItem(LOCKOUT_KEY)
    return raw ? JSON.parse(raw) : { attempts: 0, lockedUntil: null }
  } catch {
    return { attempts: 0, lockedUntil: null }
  }
}

function saveLockoutData(data) {
  localStorage.setItem(LOCKOUT_KEY, JSON.stringify(data))
}

function clearLockoutData() {
  localStorage.removeItem(LOCKOUT_KEY)
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const { login, user, defaultRoute } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()
  const registrationSuccess = Boolean(location.state?.registrationSuccess)

  // Form state
  const [email, setEmail] = useState(location.state?.prefillEmail ?? '')
  const [password, setPassword] = useState(location.state?.prefillPassword ?? '')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  // Security: Lockout
  const [attempts, setAttempts] = useState(() => getLockoutData().attempts)
  const [lockedUntil, setLockedUntil] = useState(() => {
    const d = getLockoutData()
    return d.lockedUntil ? new Date(d.lockedUntil) : null
  })
  const [countdown, setCountdown] = useState(0)

  // Security: CAPTCHA
  const [captcha, setCaptcha] = useState(() => generateCaptcha())
  const [captchaInput, setCaptchaInput] = useState('')
  const [captchaVerified, setCaptchaVerified] = useState(false)
  const [captchaError, setCaptchaError] = useState(false)
  const [notRobot, setNotRobot] = useState(false)
  const [showMathChallenge, setShowMathChallenge] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate(defaultRoute, { replace: true })
  }, [defaultRoute, navigate, user])

  // Countdown timer for lockout
  useEffect(() => {
    if (!lockedUntil) return
    const tick = () => {
      const remaining = Math.ceil((lockedUntil - Date.now()) / 1000)
      if (remaining <= 0) {
        setLockedUntil(null)
        setAttempts(0)
        clearLockoutData()
        setCountdown(0)
        resetCaptcha()
      } else {
        setCountdown(remaining)
      }
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [lockedUntil])

  const resetCaptcha = useCallback(() => {
    setCaptcha(generateCaptcha())
    setCaptchaInput('')
    setCaptchaVerified(false)
    setCaptchaError(false)
    setNotRobot(false)
    setShowMathChallenge(false)
  }, [])

  // Handle "I am not a robot" checkbox
  const handleNotRobot = useCallback((e) => {
    const checked = e.target.checked
    setNotRobot(checked)
    if (checked) {
      setShowMathChallenge(true)
      setCaptchaVerified(false)
      setCaptchaInput('')
      setCaptchaError(false)
    } else {
      setShowMathChallenge(false)
      setCaptchaVerified(false)
    }
  }, [])

  // Verify CAPTCHA answer
  const handleCaptchaVerify = useCallback(() => {
    if (parseInt(captchaInput, 10) === captcha.answer) {
      setCaptchaVerified(true)
      setCaptchaError(false)
    } else {
      setCaptchaError(true)
      setCaptchaInput('')
      setCaptcha(generateCaptcha())
    }
  }, [captchaInput, captcha.answer])

  const formatCountdown = (secs) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)

    // Check lockout
    if (lockedUntil && lockedUntil > new Date()) {
      setError(t('login.lockedError', { time: formatCountdown(countdown) }))
      return
    }

    // Check CAPTCHA
    if (!captchaVerified) {
      setError(t('login.captchaRequired'))
      return
    }

    setLoading(true)
    try {
      await login({ email, password })
      clearLockoutData()
      setAttempts(0)
    } catch (err) {
      const newAttempts = attempts + 1
      setAttempts(newAttempts)

      if (newAttempts >= MAX_ATTEMPTS) {
        const lockUntil = new Date(Date.now() + LOCKOUT_SECONDS * 1000)
        setLockedUntil(lockUntil)
        saveLockoutData({ attempts: newAttempts, lockedUntil: lockUntil.toISOString() })
        setError(t('login.tooManyAttempts'))
      } else {
        saveLockoutData({ attempts: newAttempts, lockedUntil: null })
        const remaining = MAX_ATTEMPTS - newAttempts
        setError(t('login.attemptsRemaining', { count: remaining, message: err.message ?? t('login.errorSignIn') }))
      }

      // Reset CAPTCHA after each failed attempt
      resetCaptcha()
    } finally {
      setLoading(false)
    }
  }

  const isLocked = lockedUntil && lockedUntil > new Date()

  return (
    <AuthLayout>
      <Stack spacing={2}>
        <PageHeader
          title={t('login.title')}
          subtitle={t('login.subtitle')}
        />

        <Card className="hover-lift">
          <CardContent>
            <Stack spacing={2}>
              {registrationSuccess && (
                <Alert severity="success">{t('login.registrationSuccess')}</Alert>
              )}

              {/* Lockout Alert */}
              {isLocked && (
                <Alert severity="error" icon={<FaLock />}>
                  <Typography variant="body2" fontWeight={700}>
                    {t('login.lockedTitle')}
                  </Typography>
                  <Typography variant="body2">
                    {t('login.lockedMessage')}{' '}
                    <strong>{formatCountdown(countdown)}</strong>
                  </Typography>
                </Alert>
              )}

              {/* Attempts warning */}
              {!isLocked && attempts > 0 && (
                <Alert severity="warning" icon={<FaShieldHalved />}>
                  <Typography variant="body2">
                    {t('login.attemptsWarning', { count: MAX_ATTEMPTS - attempts })}
                  </Typography>
                </Alert>
              )}

              {error && !isLocked && <Alert severity="error">{error}</Alert>}

              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Stack spacing={2}>
                  {/* Email */}
                  <TextField
                    label={t('login.email')}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                    disabled={isLocked}
                  />

                  {/* Password */}
                  <TextField
                    label={t('login.password')}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLocked}
                  />

                  {/* CAPTCHA Section */}
                  <Box
                    sx={{
                      border: '1px solid',
                      borderColor: captchaVerified ? 'success.main' : 'divider',
                      borderRadius: '8px',
                      p: 1.5,
                      backgroundColor: captchaVerified
                        ? 'rgba(34, 197, 94, 0.05)'
                        : 'rgba(0,0,0,0.02)',
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: showMathChallenge ? 1.5 : 0 }}>
                      <FaRobot style={{ color: captchaVerified ? '#16a34a' : '#64748b', fontSize: 18 }} />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={notRobot}
                            onChange={handleNotRobot}
                            disabled={isLocked || captchaVerified}
                            sx={{
                              color: '#0f766e',
                              '&.Mui-checked': { color: '#0f766e' },
                            }}
                          />
                        }
                        label={
                          <Typography variant="body2" fontWeight={600}>
                            {captchaVerified
                              ? t('login.captchaVerified')
                              : t('login.notRobot')}
                          </Typography>
                        }
                      />
                    </Stack>

                    {/* Math Challenge */}
                    <Collapse in={showMathChallenge && !captchaVerified}>
                      <Stack spacing={1}>
                        <Typography variant="body2" color="text.secondary" fontWeight={600}>
                          {t('login.captchaChallenge', { question: captcha.question })}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <TextField
                            size="small"
                            type="number"
                            placeholder={t('login.captchaPlaceholder')}
                            value={captchaInput}
                            onChange={(e) => setCaptchaInput(e.target.value)}
                            error={captchaError}
                            helperText={captchaError ? t('login.captchaWrong') : ''}
                            sx={{ width: 140 }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                handleCaptchaVerify()
                              }
                            }}
                          />
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={handleCaptchaVerify}
                            sx={{
                              borderColor: '#0f766e',
                              color: '#0f766e',
                              textTransform: 'none',
                              fontWeight: 600,
                            }}
                          >
                            {t('login.captchaVerifyBtn')}
                          </Button>
                        </Stack>
                      </Stack>
                    </Collapse>
                  </Box>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading || isLocked || !captchaVerified}
                    sx={{
                      background: isLocked
                        ? undefined
                        : 'linear-gradient(135deg, #0f766e, #14b8a6)',
                      textTransform: 'none',
                      fontWeight: 700,
                      borderRadius: '10px',
                      py: 1.4,
                    }}
                  >
                    {isLocked
                      ? t('login.lockedBtn', { time: formatCountdown(countdown) })
                      : loading
                      ? t('login.signingIn')
                      : t('login.signIn')}
                  </Button>
                </Stack>
              </Box>

              <FormControl sx={{ mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {t('login.noAccount')}{' '}
                  <RouterLink to="/register" style={{ color: '#0f766e', fontWeight: 600 }}>
                    {t('login.createOne')}
                  </RouterLink>
                  .
                </Typography>
              </FormControl>
            </Stack>
          </CardContent>
        </Card>

        {/* Security Info Card */}
        <Card sx={{ bgcolor: 'rgba(15, 118, 110, 0.04)', border: '1px solid rgba(15, 118, 110, 0.12)' }}>
          <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
            <Stack spacing={0.5}>
              <Typography variant="caption" fontWeight={700} color="#0f766e">
                {t('login.securityTitle')}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t('login.securityPoint1', { count: MAX_ATTEMPTS })}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t('login.securityPoint2')}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </AuthLayout>
  )
}
