import { useEffect, useState } from 'react'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import AuthLayout from '../components/AuthLayout.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function LoginPage() {
  const { login, user, defaultRoute } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()
  const registrationSuccess = Boolean(location.state?.registrationSuccess)

  useEffect(() => {
    if (user) {
      navigate(defaultRoute, { replace: true })
    }
  }, [defaultRoute, navigate, user])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await login({ email, password })
    } catch (err) {
      setError(err.message ?? t('login.errorSignIn'))
    } finally {
      setLoading(false)
    }
  }

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
                <Alert severity="success">
                  {t('login.registrationSuccess')}
                </Alert>
              )}

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

                  <Button type="submit" variant="contained" size="large" disabled={loading}>
                    {loading ? t('login.signingIn') : t('login.signIn')}
                  </Button>
                </Stack>
              </Box>

              <FormControl sx={{ mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {t('login.noAccount')}{' '}
                  <Link component={RouterLink} to="/register">
                    {t('login.createOne')}
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
