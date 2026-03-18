import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Badge, Box, Button, Chip, Divider, IconButton,
  Menu, Stack, Tab, Tabs, Tooltip, Typography,
} from '@mui/material'
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined'
import {
  FaCircleCheck, FaTruckFast, FaTriangleExclamation,
  FaCircleXmark, FaPlaneArrival, FaPlaneDeparture,
} from 'react-icons/fa6'
import { GiDeliveryDrone } from 'react-icons/gi'
import { notificationsInitial } from '../data/clientFeaturesData.js'

const deliveryAlertsInitial = [
  { id: 'DA1', type: 'dispatched', parcelId: 'P201', drone: 'H3', message: 'notifications.alert_dispatched', params: { parcel: 'P201', drone: 'H3' }, time: '2026-03-18 14:20', read: false },
  { id: 'DA2', type: 'inflight', parcelId: 'P201', drone: 'H3', message: 'notifications.alert_inflight', params: { parcel: 'P201', drone: 'H3', distance: '500m' }, time: '2026-03-18 14:28', read: false },
  { id: 'DA3', type: 'arrived', parcelId: 'P203', drone: 'H6', message: 'notifications.alert_arrived', params: { parcel: 'P203', drone: 'H6' }, time: '2026-03-18 14:32', read: false },
  { id: 'DA4', type: 'delivered', parcelId: 'P116', drone: 'H1', message: 'notifications.alert_delivered', params: { parcel: 'P116', drone: 'H1' }, time: '2026-03-18 13:55', read: true },
  { id: 'DA5', type: 'failed', parcelId: 'P106', drone: 'H6', message: 'notifications.alert_failed', params: { parcel: 'P106', drone: 'H6', reason: 'Battery depleted mid-route' }, time: '2026-03-17 16:40', read: true },
  { id: 'DA6', type: 'dispatched', parcelId: 'P202', drone: 'H1', message: 'notifications.alert_dispatched', params: { parcel: 'P202', drone: 'H1' }, time: '2026-03-18 14:30', read: false },
]

const alertTypeConfig = {
  dispatched: { color: '#0ea5e9', bg: 'rgba(14,165,233,0.12)', icon: <FaPlaneDeparture size={12} /> },
  inflight:   { color: '#a855f7', bg: 'rgba(168,85,247,0.12)', icon: <GiDeliveryDrone size={13} /> },
  arrived:    { color: '#f97316', bg: 'rgba(249,115,22,0.12)', icon: <FaPlaneArrival size={12} /> },
  delivered:  { color: '#22c55e', bg: 'rgba(34,197,94,0.12)',  icon: <FaCircleCheck size={12} /> },
  failed:     { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',  icon: <FaCircleXmark size={12} /> },
}

const systemTypeConfig = {
  info:    { color: '#0ea5e9', bg: 'rgba(14,165,233,0.12)', icon: <FaTruckFast size={13} /> },
  warning: { color: '#f97316', bg: 'rgba(249,115,22,0.13)', icon: <FaTriangleExclamation size={13} /> },
  success: { color: '#22c55e', bg: 'rgba(34,197,94,0.13)',  icon: <FaCircleCheck size={13} /> },
}

function interpolate(template, params = {}) {
  return Object.entries(params).reduce(
    (str, [k, v]) => str.replace(new RegExp(`{{${k}}}`, 'g'), v),
    template
  )
}

function NotificationPanel() {
  const { t } = useTranslation()
  const [anchorEl, setAnchorEl] = useState(null)
  const [tab, setTab] = useState(0)
  const [deliveryAlerts, setDeliveryAlerts] = useState(deliveryAlertsInitial)
  const [systemNotifs, setSystemNotifs] = useState(notificationsInitial)
  const open = Boolean(anchorEl)

  const unreadDelivery = useMemo(() => deliveryAlerts.filter((a) => !a.read).length, [deliveryAlerts])
  const unreadSystem = useMemo(() => systemNotifs.filter((n) => !n.read).length, [systemNotifs])
  const totalUnread = unreadDelivery + unreadSystem

  const handleOpen = (e) => setAnchorEl(e.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const markAllRead = () => {
    if (tab === 0) setDeliveryAlerts((prev) => prev.map((a) => ({ ...a, read: true })))
    else setSystemNotifs((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const markOneRead = (id) => {
    if (tab === 0) setDeliveryAlerts((prev) => prev.map((a) => a.id === id ? { ...a, read: true } : a))
    else setSystemNotifs((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n))
  }

  return (
    <>
      <Tooltip title={t('notifications.panelTitle')}>
        <IconButton
          onClick={handleOpen}
          sx={{
            border: '1px solid',
            borderColor: open ? 'primary.main' : 'divider',
            borderRadius: 2,
            width: 38,
            height: 38,
            bgcolor: open ? 'rgba(20,184,166,0.08)' : 'transparent',
            transition: 'all 0.2s',
          }}
        >
          <Badge color="error" badgeContent={totalUnread > 9 ? '9+' : totalUnread} invisible={totalUnread === 0}>
            <NotificationsOutlinedIcon fontSize="small" />
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              mt: 1, width: 360, maxHeight: 500,
              borderRadius: 2.8, border: '1px solid', borderColor: 'divider',
              overflow: 'hidden', display: 'flex', flexDirection: 'column',
            },
          },
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 1.8, pt: 1.2, pb: 0.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
            {t('notifications.panelTitle')}
          </Typography>
          <Button size="small" onClick={markAllRead} sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.75rem' }}>
            {t('notifications.markAllRead')}
          </Button>
        </Stack>

        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{ px: 1.5, minHeight: 36, '& .MuiTab-root': { textTransform: 'none', fontWeight: 700, fontSize: '0.78rem', minHeight: 36, py: 0.5 } }}
        >
          <Tab label={
            <Stack direction="row" spacing={0.5} alignItems="center">
              <span>{t('notifications.tabDelivery')}</span>
              {unreadDelivery > 0 && <Chip label={unreadDelivery} size="small" color="error" sx={{ height: 16, fontSize: '0.65rem', '& .MuiChip-label': { px: 0.6 } }} />}
            </Stack>
          } />
          <Tab label={
            <Stack direction="row" spacing={0.5} alignItems="center">
              <span>{t('notifications.tabSystem')}</span>
              {unreadSystem > 0 && <Chip label={unreadSystem} size="small" color="warning" sx={{ height: 16, fontSize: '0.65rem', '& .MuiChip-label': { px: 0.6 } }} />}
            </Stack>
          } />
        </Tabs>
        <Divider />

        <Box sx={{ overflowY: 'auto', flex: 1 }}>
          {tab === 0 && deliveryAlerts.map((alert) => {
            const cfg = alertTypeConfig[alert.type] || alertTypeConfig.inflight
            const msg = interpolate(t(alert.message), alert.params)
            return (
              <Box key={alert.id} onClick={() => markOneRead(alert.id)} sx={{ px: 2, py: 1.2, cursor: 'pointer', borderBottom: '1px solid', borderColor: 'divider', opacity: alert.read ? 0.65 : 1, bgcolor: alert.read ? 'transparent' : `${cfg.color}08`, '&:hover': { bgcolor: `${cfg.color}10` } }}>
                <Stack direction="row" spacing={1.2} alignItems="flex-start">
                  <Box sx={{ mt: 0.3, flexShrink: 0, width: 28, height: 28, borderRadius: '50%', bgcolor: cfg.bg, color: cfg.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {cfg.icon}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Chip label={alert.parcelId} size="small" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 800, color: cfg.color, bgcolor: cfg.bg, '& .MuiChip-label': { px: 0.8 } }} />
                      {!alert.read && <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: cfg.color }} />}
                    </Stack>
                    <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.5, mt: 0.3, fontSize: '0.82rem' }}>
                      {msg}
                    </Typography>
                    <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.3 }}>
                      <GiDeliveryDrone size={10} color="#94a3b8" />
                      <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.7rem' }}>
                        {alert.drone} · {alert.time}
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>
              </Box>
            )
          })}

          {tab === 1 && systemNotifs.map((item) => {
            const cfg = systemTypeConfig[item.type]
            return (
              <Box key={item.id} onClick={() => markOneRead(item.id)} sx={{ px: 2, py: 1.2, cursor: 'pointer', borderBottom: '1px solid', borderColor: 'divider', opacity: item.read ? 0.65 : 1, bgcolor: item.read ? 'transparent' : `${cfg.color}08`, '&:hover': { bgcolor: `${cfg.color}10` } }}>
                <Stack direction="row" spacing={1.2} alignItems="flex-start">
                  <Box sx={{ mt: 0.3, flexShrink: 0, width: 28, height: 28, borderRadius: '50%', bgcolor: cfg.bg, color: cfg.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {cfg.icon}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.5, fontSize: '0.82rem', flex: 1 }}>
                        {t(item.messageKey)}
                      </Typography>
                      {!item.read && <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: cfg.color, mt: 0.5, ml: 1, flexShrink: 0 }} />}
                    </Stack>
                    <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.7rem' }}>
                      {t(item.timeKey)}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            )
          })}
        </Box>
      </Menu>
    </>
  )
}

export default NotificationPanel
