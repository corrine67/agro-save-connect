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
import AuthLayout from '../components/AuthLayout.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function LoginPage() {
  const { login, user, defaultRoute } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
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
      setError(err.message ?? 'Unable to sign in. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <Stack spacing={2}>
        <PageHeader
          title="Sign in to HiveDeliver"
          subtitle="Access your dashboard, create orders, and monitor live drone deliveries."
        />

        <Card className="hover-lift">
          <CardContent>
            <Stack spacing={2}>
              {registrationSuccess && (
                <Alert severity="success">
                  Account created successfully. Please sign in with your new credentials.
                </Alert>
              )}

              {error && <Alert severity="error">{error}</Alert>}

              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Stack spacing={2}>
                  <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                  />

                  <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  <Button type="submit" variant="contained" size="large" disabled={loading}>
                    {loading ? 'Signing in…' : 'Sign in'}
                  </Button>
                </Stack>
              </Box>

              <FormControl sx={{ mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Don’t have an account?{' '}
                  <Link component={RouterLink} to="/register">
                    Create one here
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
