import { useNavigate } from 'react-router-dom'
import { Box, Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material'
import { FaBoxOpen, FaWarehouse } from 'react-icons/fa6'
import { GiDeliveryDrone } from 'react-icons/gi'
import { useAuth } from '../contexts/AuthContext.jsx'
import { benefits } from '../data/mockData.js'

function LandingPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Hero Section - Apple Style */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          py: { xs: 4, md: 8 },
          px: { xs: 2, md: 4 },
          background: 'linear-gradient(135deg, rgba(15, 118, 110, 0.08) 0%, rgba(2, 132, 199, 0.06) 100%)',
        }}
      >
        {/* Logo/Icon */}
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #0f766e, #14b8a6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 40,
            color: 'white',
            fontWeight: 700,
            mb: 3,
            boxShadow: '0 20px 50px rgba(15, 118, 110, 0.25)',
          }}
        >
          H
        </Box>

        {/* Main Headline */}
        <Typography
          variant="h2"
          sx={{
            fontWeight: 800,
            mb: 2,
            maxWidth: 800,
            lineHeight: 1.1,
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
            background: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: '#0f766e',
          }}
        >
          HiveDeliver
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            mb: 3,
            maxWidth: 700,
            fontSize: { xs: '1.25rem', md: '1.75rem' },
            color: 'text.primary',
          }}
        >
          AI-Powered Autonomous Drone Delivery
        </Typography>

        {/* Description */}
        <Typography
          variant="body1"
          sx={{
            mb: 4,
            maxWidth: 600,
            color: 'text.secondary',
            fontSize: { xs: '1rem', md: '1.125rem' },
            lineHeight: 1.6,
          }}
        >
          Experience the future of last-mile logistics. Our intelligent drone swarms deliver packages 
          to SMEs with unprecedented speed, efficiency, and reliability. Built for scale.
        </Typography>

        {/* CTA Buttons */}
        {!isAuthenticated && (
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ mb: 6 }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/login')}
              sx={{
                px: 4,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '1rem',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0f766e, #14b8a6)',
                boxShadow: '0 10px 30px rgba(15, 118, 110, 0.3)',
                transition: 'all 300ms ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 15px 40px rgba(15, 118, 110, 0.4)',
                },
              }}
            >
              Sign In
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/register')}
              sx={{
                px: 4,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '1rem',
                borderRadius: '12px',
                borderColor: '#0f766e',
                color: '#0f766e',
                transition: 'all 300ms ease',
                '&:hover': {
                  backgroundColor: 'rgba(15, 118, 110, 0.05)',
                  borderColor: '#14b8a6',
                  color: '#14b8a6',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Create Account
            </Button>
          </Stack>
        )}

        {/* Drone Illustration */}
        <Box
          sx={{
            mb: 4,
            p: 3,
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(15, 118, 110, 0.1)',
          }}
        >
          <Stack direction="row" spacing={3} justifyContent="center" sx={{ mb: 2 }}>
            <Box sx={{ textAlign: 'center', opacity: 0.8 }}>
              <FaWarehouse style={{ fontSize: 32, color: '#0f766e', marginBottom: 8 }} />
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                Warehouse
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <GiDeliveryDrone style={{ fontSize: 40, color: '#14b8a6', marginBottom: 8 }} />
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                Smart Swarm
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', opacity: 0.8 }}>
              <FaBoxOpen style={{ fontSize: 32, color: '#0f766e', marginBottom: 8 }} />
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                Delivery
              </Typography>
            </Box>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            Real-time autonomous coordination from warehouse to destination
          </Typography>
        </Box>
      </Box>

      {/* Benefits Section */}
      <Box sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, md: 4 } }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 4,
            textAlign: 'center',
            fontSize: { xs: '1.5rem', md: '2rem' },
          }}
        >
          Why Choose HiveDeliver
        </Typography>
        <Grid container spacing={3}>
          {benefits.map((benefit) => (
            <Grid key={benefit.title} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                className="hover-lift"
                sx={{
                  height: '100%',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.7), rgba(255,255,255,0.4))',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(15, 118, 110, 0.1)',
                  transition: 'all 300ms ease',
                  '&:hover': {
                    borderColor: '#14b8a6',
                    boxShadow: '0 15px 40px rgba(15, 118, 110, 0.15)',
                  },
                }}
              >
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.8 }}>
                    {benefit.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {benefit.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  )
}

export default LandingPage
