import { useEffect, useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  Link,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import AuthLayout from '../components/AuthLayout.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function RegisterPage() {
  const { register, user, defaultRoute } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('user')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      navigate(defaultRoute, { replace: true })
    }
  }, [defaultRoute, navigate, user])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    if (password !== confirmPassword) {
      setError(t('register.passwordMismatch'))
      return
    }
    setLoading(true)
    try {
      await register({ email, password, role })
      navigate('/login', {
        replace: true,
        state: {
          registrationSuccess: true,
        },
      })
    } catch (err) {
      setError(err.message ?? t('register.errorCreate'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <Stack spacing={2}>
        <PageHeader
          title={t('register.title')}
          subtitle={t('register.subtitle')}
        />
        <Card className="hover-lift">
          <CardContent>
            <Stack spacing={2}>
              {error && <Alert severity="error">{error}</Alert>}
              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Stack spacing={2}>
                  <TextField
                    label={t('login.email')}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                  <TextField
                    label={t('login.password')}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <TextField
                    label={t('register.confirmPassword')}
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <FormControl>
                    <FormLabel>{t('register.role')}</FormLabel>
                    <RadioGroup
                      row
                      value={role}
                      onChange={(event) => setRole(event.target.value)}
                    >
                      <FormControlLabel
                        value="user"
                        control={<Radio />}
                        label={t('register.roleSME')}
                      />
                      <FormControlLabel
                        value="manager"
                        control={<Radio />}
                        label={t('register.roleManager')}
                      />
                    </RadioGroup>
                  </FormControl>
                  <Button type="submit" variant="contained" size="large" disabled={loading}>
                    {loading ? t('register.creating') : t('register.createAccount')}
                  </Button>
                </Stack>
              </Box>
              <FormControl sx={{ mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {t('register.haveAccount')}{' '}
                  <Link component={RouterLink} to="/login">
                    {t('register.signInHere')}
                  </Link>
                  .
                </Typography>
              </FormControl>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </AuthLayout>
  )
}
