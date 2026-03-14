import { NavLink, useNavigate } from 'react-router-dom'
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
import { HiCubeTransparent, HiMap, HiChartBarSquare, HiCpuChip } from 'react-icons/hi2'
import { FaHouse, FaClipboardList } from 'react-icons/fa6'
import { GiDeliveryDrone } from 'react-icons/gi'
import { MdLogout } from 'react-icons/md'
import { useAuth } from '../contexts/AuthContext.jsx'

export const drawerWidth = 276

const allNavItems = [
  { label: 'Home', path: '/home', icon: <FaHouse />, roles: ['admin', 'manager', 'user'] },
  { label: 'Delivery Dashboard', path: '/dashboard', icon: <HiCubeTransparent />, roles: ['admin', 'manager'] },
  { label: 'Live Drone Map', path: '/map', icon: <HiMap />, roles: ['admin', 'manager', 'user'] },
  { label: 'Create Delivery Order', path: '/order', icon: <FaClipboardList />, roles: ['admin', 'manager', 'user'] },
  { label: 'Swarm Intelligence', path: '/intelligence', icon: <HiCpuChip />, roles: ['admin'] },
  { label: 'Analytics', path: '/analytics', icon: <HiChartBarSquare />, roles: ['admin', 'manager'] },
  { label: 'Fleet Management', path: '/fleet', icon: <GiDeliveryDrone />, roles: ['admin'] },
]

function Sidebar({ onNavigate }) {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

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
          sx={{
            width: 38,
            height: 38,
            borderRadius: 2,
            background: 'linear-gradient(140deg, #0f766e, #14b8a6)',
            display: 'grid',
            placeItems: 'center',
            color: 'white',
            fontWeight: 700,
            boxShadow: '0 8px 20px rgba(15,118,110,0.35)',
          }}
        >
          H
        </Box>
        <Stack spacing={0}>
          <Typography variant="h6" sx={{ lineHeight: 1.1 }}>
            HiveDeliver
          </Typography>
          <Typography variant="caption" color="text.secondary">
            AI Swarm Logistics
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
              borderRadius: 2,
              mb: 0.55,
              '&.active': {
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                '& .MuiListItemIcon-root': {
                  color: 'inherit',
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 34, color: 'text.secondary' }}>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontWeight: 600,
                fontSize: 14,
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
        Logout
      </Button>
    </Box>
  )
}

export default Sidebar
