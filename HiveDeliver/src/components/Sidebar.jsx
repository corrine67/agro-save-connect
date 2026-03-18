import { NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
  Divider,
  Button,
} from '@mui/material'
import { HiCubeTransparent, HiMap, HiChartBarSquare, HiCpuChip, HiChatBubbleLeftRight } from 'react-icons/hi2'
import { FaHouse, FaClipboardList, FaLocationDot, FaLock, FaRoute, FaMicrophone, FaCamera, FaBoxOpen } from 'react-icons/fa6'
import { GiDeliveryDrone } from 'react-icons/gi'
import { MdHistory, MdLogout, MdNotificationsNone } from 'react-icons/md'
import { useAuth } from '../contexts/AuthContext.jsx'

export const drawerWidth = 270

const allNavItems = [
  { key: 'dashboard', label: 'Delivery Dashboard', path: '/dashboard', icon: <HiCubeTransparent />, roles: ['admin', 'manager', 'user'] },
  { key: 'order', label: 'Create Delivery Order', path: '/order', icon: <FaClipboardList />, roles: ['admin', 'manager', 'user'] },
  { key: 'map', label: 'Live Drone Map', path: '/map', icon: <HiMap />, roles: ['admin', 'manager', 'user'] },
  { key: 'history', label: 'Delivery History', path: '/history', icon: <MdHistory />, roles: ['user'] },
  { key: 'activeOrders', label: 'Active Orders', path: '/active-orders', icon: <FaBoxOpen />, roles: ['user'] },
  { key: 'parcelProof', label: 'Parcel Proof', path: '/parcel-proof', icon: <FaCamera />, roles: ['user'] },
  { key: 'managerHistory', label: 'Delivery History', path: '/manager-history', icon: <MdHistory />, roles: ['admin', 'manager'] },
  { key: 'addresses', label: 'Saved Addresses', path: '/addresses', icon: <FaLocationDot />, roles: ['user'] },

  { key: 'intelligence', label: 'Swarm Intelligence', path: '/intelligence', icon: <HiCpuChip />, roles: ['admin'] },
  { key: 'analytics', label: 'Analytics', path: '/analytics', icon: <HiChartBarSquare />, roles: ['admin', 'manager'] },
  { key: 'fleet', label: 'Fleet Management', path: '/fleet', icon: <GiDeliveryDrone />, roles: ['admin'] },
  { key: 'security', label: 'Security & Blockchain', path: '/security', icon: <FaLock />, roles: ['admin', 'manager'] },
  { key: 'optimization', label: 'Swarm Optimization', path: '/optimization', icon: <FaRoute />, roles: ['manager'] },
  { key: 'interactive', label: 'Interactive Features', path: '/interactive', icon: <FaMicrophone />, roles: ['manager'] },
  { key: 'support', label: 'AI Chat Support', path: '/support', icon: <HiChatBubbleLeftRight />, roles: ['admin', 'manager', 'user'] },
]

function Sidebar({ onNavigate }) {
  const { logout, user } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const brandLogo = '/hivedeliver-logo.svg'

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  // Filter nav items based on user role
  const userRole = user?.role || 'user'
  const navItems = allNavItems.filter((item) => item.roles.includes(userRole))

  return (
    <Box sx={{ height: '100%', p: 2.2, display: 'flex', flexDirection: 'column' }}>
      <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 2.2, px: 1 }}>
        <Box
          component="img"
          src={brandLogo}
          alt="HiveDeliver logo"
          sx={{
            width: 42,
            height: 42,
            borderRadius: 2,
            objectFit: 'cover',
            boxShadow: '0 6px 20px rgba(15,118,110,0.35)',
            border: '1px solid rgba(15,118,110,0.2)',
          }}
        />
        <Stack spacing={0}>
          <Typography variant="h6" sx={{ lineHeight: 1.1, fontWeight: 800, fontSize: '1.05rem' }}>
            {t('common.appName')}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, letterSpacing: '0.04em' }}>
            {t('common.tagline')}
          </Typography>
        </Stack>
      </Stack>

      <List sx={{ p: 0, flex: 1 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.path}
            component={NavLink}
            to={item.path}
            onClick={onNavigate}
            sx={{
              borderRadius: 2.5,
              mb: 0.4,
              py: 1,
              px: 1.5,
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                bgcolor: 'rgba(20, 184, 166, 0.06)',
                transform: 'translateX(4px)',
              },
              '&.active': {
                background: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
                color: '#ffffff',
                boxShadow: '0 4px 16px rgba(15,118,110,0.3)',
                '& .MuiListItemIcon-root': {
                  color: '#ffffff',
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: 'text.secondary', fontSize: '1.1rem' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.key === 'managerHistory' ? t('nav.history') : t(`nav.${item.key}`)}
              primaryTypographyProps={{
                fontWeight: 600,
                fontSize: '0.84rem',
              }}
            />
          </ListItemButton>
        ))}
      </List>

      <Divider sx={{ my: 2 }} />
      <Button
        fullWidth
        variant="outlined"
        color="error"
        startIcon={<MdLogout />}
        onClick={handleLogout}
        sx={{ fontWeight: 600 }}
      >
        {t('nav.logout')}
      </Button>
    </Box>
  )
}

export default Sidebar
