import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Box, Button, Card, CardContent, Grid, Stack, Typography, Chip, IconButton, Menu, MenuItem, Tooltip, ListItemText } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import TranslateIcon from '@mui/icons-material/Translate'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import { FaBoxOpen, FaWarehouse, FaArrowRight, FaShieldHalved, FaBolt, FaRoute } from 'react-icons/fa6'
import { GiDeliveryDrone } from 'react-icons/gi'
import { useAuth } from '../contexts/AuthContext.jsx'
import { useColorMode } from '../ColorModeContext.jsx'
import { languages } from '../i18n/i18n.js'

function LandingPage() {
  const navigate = useNavigate()
  const [langAnchor, setLangAnchor] = useState(null)
  const langMenuOpen = Boolean(langAnchor)
  const { isAuthenticated, defaultRoute } = useAuth()
  const theme = useTheme()
  const { mode, toggleColorMode } = useColorMode()
  const { t, i18n } = useTranslation()
  const isDarkMode = theme.palette.mode === 'dark'
  const brandLogo = '/hivedeliver-logo.png'

  const handleLangClick = (event) => {
    setLangAnchor(event.currentTarget)
  }

  const handleLangClose = () => {
    setLangAnchor(null)
  }

  const handleLangSelect = (code) => {
    i18n.changeLanguage(code)
    handleLangClose()
  }

  const currentLang = languages.find((l) => l.code === i18n.language) || languages[0]

  const scrollToSection = (sectionId) => {
    const target = document.getElementById(sectionId)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const localizedBenefits = [
    {
      title: t('benefits.fasterTitle'),
      description: t('benefits.fasterDesc'),
    },
    {
      title: t('benefits.lowerCostTitle'),
      description: t('benefits.lowerCostDesc'),
    },
    {
      title: t('benefits.aiSwarmTitle'),
      description: t('benefits.aiSwarmDesc'),
    },
    {
      title: t('benefits.smartRouteTitle'),
      description: t('benefits.smartRouteDesc'),
    },
    {
      title: t('benefits.resilientOpsTitle'),
      description: t('benefits.resilientOpsDesc'),
    },
    {
      title: t('benefits.ecoSmartTitle'),
      description: t('benefits.ecoSmartDesc'),
    },
  ]

  const functionHighlights = [
    {
      key: 'live-routing',
      icon: <FaRoute size={13} />,
      label: t('landing.functionLiveRouting'),
    },
    {
      key: 'smart-priority',
      icon: <FaArrowRight size={13} />,
      label: t('landing.functionSmartPriority'),
    },
    {
      key: 'flight-safety',
      icon: <FaShieldHalved size={13} />,
      label: t('landing.functionSafety'),
    },
    {
      key: 'insights',
      icon: <FaBolt size={13} />,
      label: t('landing.functionInstantInsights'),
    },
  ]

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          px: { xs: 2, md: 4 },
          py: 1.5,
          backdropFilter: 'blur(14px)',
          backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.72)' : 'rgba(255, 255, 255, 0.78)',
          borderBottom: isDarkMode ? '1px solid rgba(148, 163, 184, 0.16)' : '1px solid rgba(15, 118, 110, 0.08)',
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
          <Stack direction="row" spacing={1.2} alignItems="center" sx={{ cursor: 'pointer' }} onClick={() => navigate('/home')}>
            <Box
              component="img"
              src={brandLogo}
              alt="HiveDeliver logo"
              sx={{
                width: 40,
                height: 40,
                objectFit: 'cover',
              }}
            />
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
              HiveDeliver
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
            {/* Dark/Light Mode Toggle */}
            <Tooltip title={isDarkMode ? t('common.switchToLight') : t('common.switchToDark')}>
              <IconButton
                onClick={toggleColorMode}
                color="inherit"
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  height: 38,
                  minWidth: 38,
                  px: 1,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                {isDarkMode ? (
                  <LightModeOutlinedIcon fontSize="small" />
                ) : (
                  <DarkModeOutlinedIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>

            {/* Language Selector */}
            <Tooltip title={t('common.language')}>
              <IconButton
                onClick={handleLangClick}
                color="inherit"
                sx={{
                  border: '1px solid',
                  borderColor: langMenuOpen ? 'primary.main' : 'divider',
                  borderRadius: 2,
                  height: 38,
                  minWidth: 38,
                  px: 1,
                  gap: 0.5,
                  transition: 'all 0.3s ease',
                  bgcolor: langMenuOpen ? 'rgba(20,184,166,0.08)' : 'transparent',
                  '&:hover': {
                    bgcolor: 'rgba(20,184,166,0.08)',
                  },
                }}
              >
                <TranslateIcon fontSize="small" />
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    display: { xs: 'none', sm: 'block' },
                  }}
                >
                  {currentLang.code}
                </Typography>
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={langAnchor}
              open={langMenuOpen}
              onClose={handleLangClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              slotProps={{
                paper: {
                  sx: {
                    mt: 1,
                    minWidth: 180,
                    borderRadius: 2.5,
                    bgcolor: isDarkMode ? 'rgba(10,22,32,0.95)' : 'rgba(255,255,255,0.98)',
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${isDarkMode ? 'rgba(20,184,166,0.12)' : 'rgba(15,118,110,0.08)'}`,
                    boxShadow: isDarkMode
                      ? '0 8px 32px rgba(0,0,0,0.5)'
                      : '0 8px 32px rgba(0,0,0,0.1)',
                  },
                },
              }}
            >
              {languages.map((lang) => (
                <MenuItem
                  key={lang.code}
                  selected={i18n.language === lang.code}
                  onClick={() => handleLangSelect(lang.code)}
                  sx={{
                    py: 1.2,
                    px: 2,
                    borderRadius: 1.5,
                    mx: 0.5,
                    mb: 0.3,
                    transition: 'all 0.2s ease',
                    ...(i18n.language === lang.code && {
                      bgcolor: isDarkMode ? 'rgba(20,184,166,0.12)' : 'rgba(20,184,166,0.08)',
                      borderLeft: '3px solid',
                      borderColor: 'primary.main',
                    }),
                    '&:hover': {
                      bgcolor: isDarkMode ? 'rgba(20,184,166,0.08)' : 'rgba(20,184,166,0.05)',
                    },
                  }}
                >
                  <Typography sx={{ fontSize: '1.2rem', mr: 1.5, lineHeight: 1 }}>
                    {lang.flag}
                  </Typography>
                  <ListItemText
                    primary={lang.label}
                    primaryTypographyProps={{
                      fontWeight: i18n.language === lang.code ? 700 : 500,
                      fontSize: '0.88rem',
                    }}
                  />
                  {i18n.language === lang.code && (
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        ml: 1,
                      }}
                    />
                  )}
                </MenuItem>
              ))}
            </Menu>

            <Button onClick={() => scrollToSection('landing-top')} sx={{ textTransform: 'none', fontWeight: 700 }}>
              {t('landing.home')}
            </Button>
            <Button onClick={() => scrollToSection('landing-features')} sx={{ textTransform: 'none', fontWeight: 700 }}>
              {t('landing.features')}
            </Button>
            {isAuthenticated ? (
              <Button
                variant="contained"
                onClick={() => navigate(defaultRoute)}
                sx={{
                  textTransform: 'none',
                  fontWeight: 700,
                  borderRadius: '999px',
                  px: 2.2,
                  background: 'linear-gradient(135deg, #0f766e, #14b8a6)',
                }}
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button onClick={() => navigate('/login')} sx={{ textTransform: 'none', fontWeight: 700 }}>
                  {t('landing.signIn')}
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate('/signup')}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 700,
                    borderRadius: '999px',
                    px: 2.2,
                    background: isDarkMode
                      ? 'linear-gradient(135deg, #14b8a6, #06b6d4)'
                      : 'linear-gradient(135deg, #0f766e, #14b8a6)',
                  }}
                >
                  {t('landing.signUp')}
                </Button>
              </>
            )}
          </Stack>
        </Stack>
      </Box>

      {/* Hero Section - Apple Style */}
      <Box
        id="landing-top"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          py: { xs: 4, md: 8 },
          px: { xs: 2, md: 4 },
          background: isDarkMode
          ? 'linear-gradient(135deg, rgba(13, 148, 136, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)'
          : 'linear-gradient(135deg, rgba(15, 118, 110, 0.08) 0%, rgba(2, 132, 199, 0.06) 100%)',
        }}
      >
        {/* Logo/Icon */}
        <Box
          component="img"
          src={brandLogo}
          alt="HiveDeliver logo"
          sx={{
            width: 104,
            height: 104,
            objectFit: 'cover',
            mb: 3,
          }}
        />

        {/* Main Headline */}
        <Typography
          variant="h2"
          sx={{
            fontWeight: 800,
            mb: 2,
            maxWidth: 800,
            lineHeight: 1.1,
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
            background: isDarkMode
              ? 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)'
              : 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
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
          {t('landing.heroTitle')}
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
          {t('landing.heroDesc')}
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
              onClick={() => navigate('/signup')}
              sx={{
                px: 4,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '1rem',
                borderRadius: '12px',
                background: isDarkMode
                  ? 'linear-gradient(135deg, #14b8a6, #06b6d4)'
                  : 'linear-gradient(135deg, #0f766e, #14b8a6)',
                boxShadow: isDarkMode
                  ? '0 10px 30px rgba(20, 184, 166, 0.3)'
                  : '0 10px 30px rgba(15, 118, 110, 0.3)',
                transition: 'all 300ms ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: isDarkMode
                    ? '0 15px 40px rgba(20, 184, 166, 0.4)'
                    : '0 15px 40px rgba(15, 118, 110, 0.4)',
                },
              }}
            >
              {t('landing.getStarted')}
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/login')}
              sx={{
                px: 4,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '1rem',
                borderRadius: '12px',
                borderColor: isDarkMode ? '#14b8a6' : '#0f766e',
                color: isDarkMode ? '#14b8a6' : '#0f766e',
                transition: 'all 300ms ease',
                '&:hover': {
                  backgroundColor: isDarkMode ? 'rgba(20, 184, 166, 0.1)' : 'rgba(15, 118, 110, 0.05)',
                  borderColor: isDarkMode ? '#06b6d4' : '#14b8a6',
                  color: isDarkMode ? '#06b6d4' : '#14b8a6',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              {t('landing.signIn')}
            </Button>
          </Stack>
        )}

        {/* Drone Illustration */}
        <Box
          sx={{
            mb: 4,
            p: 3,
            borderRadius: '16px',
            background: isDarkMode
              ? 'rgba(20, 184, 166, 0.08)'
              : 'rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(8px)',
            border: isDarkMode
              ? '1px solid rgba(20, 184, 166, 0.2)'
              : '1px solid rgba(15, 118, 110, 0.1)',
          }}
        >
          <Stack direction="row" spacing={3} justifyContent="center" sx={{ mb: 2 }}>
            <Box sx={{ textAlign: 'center', opacity: 0.8 }}>
              <FaWarehouse style={{ fontSize: 32, color: isDarkMode ? '#14b8a6' : '#0f766e', marginBottom: 8 }} />
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                {t('landing.warehouse')}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <GiDeliveryDrone style={{ fontSize: 40, color: isDarkMode ? '#06b6d4' : '#14b8a6', marginBottom: 8 }} />
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                {t('landing.droneSwarm')}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', opacity: 0.8 }}>
              <FaBoxOpen style={{ fontSize: 32, color: isDarkMode ? '#14b8a6' : '#0f766e', marginBottom: 8 }} />
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                {t('landing.packages')}
              </Typography>
            </Box>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            {t('landing.illustrationDesc')}
          </Typography>
        </Box>
      </Box>

      {/* Benefits Section */}
      <Box id="landing-features" sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, md: 4 } }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 4,
            textAlign: 'center',
            fontSize: { xs: '1.5rem', md: '2rem' },
          }}
        >
          {t('landing.whyTitlePlain')}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            textAlign: 'center',
            mb: 2.2,
            color: 'text.secondary',
            maxWidth: 760,
            mx: 'auto',
            lineHeight: 1.75,
          }}
        >
          {t('landing.whyFunctionTitle')}
        </Typography>

        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          flexWrap="wrap"
          justifyContent="center"
          sx={{ mb: 3.2 }}
        >
          {functionHighlights.map((feature) => (
            <Chip
              key={feature.key}
              icon={feature.icon}
              label={feature.label}
              sx={{
                borderRadius: '999px',
                fontWeight: 700,
                px: 0.5,
                bgcolor: isDarkMode ? 'rgba(15, 118, 110, 0.2)' : 'rgba(20, 184, 166, 0.14)',
                color: isDarkMode ? 'rgba(226, 232, 240, 0.96)' : 'rgba(15, 23, 42, 0.9)',
                border: isDarkMode ? '1px solid rgba(45, 212, 191, 0.24)' : '1px solid rgba(13, 148, 136, 0.24)',
              }}
            />
          ))}
        </Stack>

        <Grid container spacing={3}>
          {localizedBenefits.map((benefit) => (
            <Grid key={benefit.title} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                className="hover-lift"
                sx={{
                  height: '100%',
                  background: isDarkMode
                    ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.88), rgba(30, 41, 59, 0.78))'
                    : 'linear-gradient(135deg, rgba(255,255,255,0.7), rgba(255,255,255,0.4))',
                  backdropFilter: 'blur(12px)',
                  border: isDarkMode
                    ? '1px solid rgba(148, 163, 184, 0.25)'
                    : '1px solid rgba(15, 118, 110, 0.1)',
                  transition: 'all 300ms ease',
                  '&:hover': {
                    borderColor: '#14b8a6',
                    boxShadow: '0 15px 40px rgba(15, 118, 110, 0.15)',
                  },
                }}
              >
                <CardContent>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 700,
                      mb: 0.8,
                      color: isDarkMode ? 'rgba(248, 250, 252, 0.96)' : 'text.primary',
                    }}
                  >
                    {benefit.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      lineHeight: 1.7,
                      color: isDarkMode ? 'rgba(226, 232, 240, 0.92)' : 'text.secondary',
                    }}
                  >
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
