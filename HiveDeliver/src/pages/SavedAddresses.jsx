import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import {
  FaLocationDot,
  FaPlus,
  FaMagnifyingGlass,
  FaHouse,
  FaBriefcase,
  FaLocationArrow,
} from 'react-icons/fa6'
import { MdDeleteOutline, MdEdit } from 'react-icons/md'
import PageHeader from '../components/PageHeader.jsx'
import { savedAddressesInitial } from '../data/clientFeaturesData.js'

// ─── Address type config ──────────────────────────────────────────────────────
const ADDRESS_TYPES = ['home', 'work', 'other']

const typeConfig = {
  home:  { icon: <FaHouse size={11} />,          color: '#0f766e', bg: 'rgba(15,118,110,0.12)'  },
  work:  { icon: <FaBriefcase size={11} />,       color: '#3b82f6', bg: 'rgba(59,130,246,0.12)'  },
  other: { icon: <FaLocationArrow size={11} />,   color: '#a855f7', bg: 'rgba(168,85,247,0.12)'  },
}

const emptyForm = {
  label:   '',
  name:    '',
  phone:   '',
  address: '',
  type:    'home',
}

// ─── Address Card ─────────────────────────────────────────────────────────────
function AddressCard({ item, onEdit, onDelete, t }) {
  const cfg = typeConfig[item.type] || typeConfig.other

  return (
    <Card
      className="hover-lift glow-card"
      sx={{
        borderRadius: 3,
        height: '100%',
        border: `1px solid ${cfg.color}28`,
        transition: 'all 0.25s',
        '&:hover': { borderColor: `${cfg.color}55` },
      }}
    >
      <CardContent sx={{ p: 2.2 }}>
        {/* Header row */}
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1.4 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ color: cfg.color, flexShrink: 0 }}>
              <FaLocationDot size={16} />
            </Box>
            <Typography variant="subtitle1" fontWeight={800} noWrap sx={{ flex: 1 }}>
              {item.label}
            </Typography>
            <Chip
              icon={<Box sx={{ color: cfg.color, display: 'flex', alignItems: 'center' }}>{cfg.icon}</Box>}
              label={t(`addresses.type_${item.type || 'other'}`)}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.65rem',
                fontWeight: 700,
                bgcolor: cfg.bg,
                color: cfg.color,
                border: `1px solid ${cfg.color}30`,
                flexShrink: 0,
                '& .MuiChip-icon': { ml: '4px', mr: '-2px' },
              }}
            />
          </Stack>

          <Stack direction="row" spacing={0.3} sx={{ ml: 0.5, flexShrink: 0 }}>
            <Tooltip title={t('addresses.edit')}>
              <IconButton size="small" onClick={() => onEdit(item)} sx={{ color: 'text.secondary' }}>
                <MdEdit size={16} />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('addresses.delete')}>
              <IconButton size="small" color="error" onClick={() => onDelete(item)}>
                <MdDeleteOutline size={16} />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        {/* Details */}
        <Stack spacing={0.6}>
          <Stack direction="row" spacing={0.8} alignItems="flex-start">
            <Typography variant="caption" color="text.disabled" fontWeight={700} sx={{ minWidth: 80, pt: 0.1 }}>
              {t('addresses.contactName')}
            </Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>{item.name}</Typography>
          </Stack>
          <Stack direction="row" spacing={0.8} alignItems="flex-start">
            <Typography variant="caption" color="text.disabled" fontWeight={700} sx={{ minWidth: 80, pt: 0.1 }}>
              {t('addresses.contactPhone')}
            </Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>{item.phone}</Typography>
          </Stack>
          <Stack direction="row" spacing={0.8} alignItems="flex-start">
            <Typography variant="caption" color="text.disabled" fontWeight={700} sx={{ minWidth: 80, pt: 0.1 }}>
              {t('addresses.fullAddress')}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.6 }}>{item.address}</Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ t, onAdd }) {
  return (
    <Card sx={{ borderRadius: 3, border: '1px dashed rgba(15,118,110,0.3)', bgcolor: 'rgba(15,118,110,0.02)' }}>
      <CardContent>
        <Stack alignItems="center" spacing={2} sx={{ py: 4 }}>
          <Box sx={{
            width: 72, height: 72, borderRadius: '50%',
            bgcolor: 'rgba(15,118,110,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <FaLocationDot size={32} color="#0f766e" />
          </Box>
          <Stack alignItems="center" spacing={0.5}>
            <Typography variant="h6" fontWeight={700} color="text.primary">
              {t('addresses.emptyTitle')}
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ maxWidth: 320 }}>
              {t('addresses.emptyDesc')}
            </Typography>
          </Stack>
          <Button
            variant="contained"
            startIcon={<FaPlus />}
            onClick={onAdd}
            sx={{
              textTransform: 'none',
              borderRadius: 99,
              px: 2.5,
              fontWeight: 700,
              background: 'linear-gradient(135deg, #0f766e, #14b8a6)',
            }}
          >
            {t('addresses.addNew')}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
function SavedAddresses() {
  const { t } = useTranslation()
  const [addresses, setAddresses] = useState(
    savedAddressesInitial.map((a) => ({ ...a, type: a.type || 'home' }))
  )
  const [dialogOpen, setDialogOpen]     = useState(false)
  const [deleteDialog, setDeleteDialog] = useState(null)   // item to delete
  const [editingId, setEditingId]       = useState(null)
  const [form, setForm]                 = useState(emptyForm)
  const [search, setSearch]             = useState('')
  const [filterType, setFilterType]     = useState('all')

  const isEditing = useMemo(() => Boolean(editingId), [editingId])

  // ── Filtered list ──
  const filtered = useMemo(() => {
    return addresses.filter((a) => {
      const q = search.toLowerCase()
      const matchSearch = !q || [a.label, a.name, a.phone, a.address].some((v) => v.toLowerCase().includes(q))
      const matchType   = filterType === 'all' || a.type === filterType
      return matchSearch && matchType
    })
  }, [addresses, search, filterType])

  // ── Handlers ──
  const handleAddClick = () => {
    setEditingId(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  const handleEditClick = (item) => {
    setEditingId(item.id)
    setForm({ label: item.label, name: item.name, phone: item.phone, address: item.address, type: item.type || 'home' })
    setDialogOpen(true)
  }

  const handleDeleteClick = (item) => setDeleteDialog(item)

  const confirmDelete = () => {
    if (deleteDialog) {
      setAddresses((prev) => prev.filter((a) => a.id !== deleteDialog.id))
      setDeleteDialog(null)
    }
  }

  const handleSave = () => {
    if (!form.label || !form.name || !form.phone || !form.address) return
    if (editingId) {
      setAddresses((prev) => prev.map((a) => (a.id === editingId ? { ...a, ...form } : a)))
    } else {
      setAddresses((prev) => [...prev, { id: `ADDR-${Date.now()}`, ...form }])
    }
    setDialogOpen(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  const handleClose = () => {
    setDialogOpen(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  const updateField = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  return (
    <Stack spacing={2.5}>
      <Box className="reveal-up">
        <PageHeader title={t('addresses.title')} subtitle={t('addresses.subtitle')} />
      </Box>

      {/* ── Toolbar ── */}
      <Box className="reveal-up delay-1">
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ sm: 'center' }} justifyContent="space-between" sx={{ mb: 2 }}>
          {/* Search */}
          <TextField
            size="small"
            placeholder={t('addresses.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ minWidth: 220, flex: 1, maxWidth: 360 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaMagnifyingGlass size={14} color="#9ca3af" />
                </InputAdornment>
              ),
            }}
          />

          {/* Type filter chips */}
          <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap>
            {['all', ...ADDRESS_TYPES].map((type) => {
              const cfg = typeConfig[type]
              const active = filterType === type
              return (
                <Chip
                  key={type}
                  label={t(`addresses.type_${type}`)}
                  size="small"
                  onClick={() => setFilterType(type)}
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    bgcolor: active ? (cfg?.bg || 'rgba(15,118,110,0.12)') : 'transparent',
                    color: active ? (cfg?.color || '#0f766e') : 'text.secondary',
                    border: active
                      ? `1px solid ${cfg?.color || '#0f766e'}40`
                      : '1px solid rgba(0,0,0,0.12)',
                    transition: 'all 0.2s',
                  }}
                />
              )
            })}
          </Stack>

          {/* Count + Add button */}
          <Stack direction="row" spacing={1.5} alignItems="center" flexShrink={0}>
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              {t('addresses.totalSaved', { count: addresses.length })}
            </Typography>
            <Button
              variant="contained"
              startIcon={<FaPlus />}
              onClick={handleAddClick}
              sx={{
                textTransform: 'none',
                borderRadius: 99,
                px: 2.2,
                fontWeight: 700,
                background: 'linear-gradient(135deg, #0f766e, #14b8a6)',
                whiteSpace: 'nowrap',
              }}
            >
              {t('addresses.addNew')}
            </Button>
          </Stack>
        </Stack>

        {/* No results banner */}
        <Collapse in={filtered.length === 0 && addresses.length > 0}>
          <Card sx={{ borderRadius: 2, bgcolor: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.15)', mb: 2 }}>
            <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                {t('addresses.noResults')}
              </Typography>
            </CardContent>
          </Card>
        </Collapse>

        {/* Address grid */}
        {addresses.length === 0 ? (
          <EmptyState t={t} onAdd={handleAddClick} />
        ) : (
          <Grid container spacing={1.5}>
            {filtered.map((item, index) => (
              <Grid key={item.id} xs={12} md={6} xl={4}>
                <Box className={`reveal-up delay-${Math.min(index + 2, 5)}`}>
                  <AddressCard item={item} onEdit={handleEditClick} onDelete={handleDeleteClick} t={t} />
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* ── Add / Edit Dialog ── */}
      <Dialog open={dialogOpen} onClose={handleClose} fullWidth maxWidth="sm"
        PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box sx={{ p: 0.8, borderRadius: 1.5, bgcolor: 'rgba(15,118,110,0.1)' }}>
              <FaLocationDot color="#0f766e" size={16} />
            </Box>
            <Typography fontWeight={700}>
              {isEditing ? t('addresses.editAddress') : t('addresses.addAddress')}
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={1.8} sx={{ pt: 0.5 }}>
            {/* Address type selector */}
            <Stack spacing={0.6}>
              <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.8 }}>
                {t('addresses.addressType')}
              </Typography>
              <Stack direction="row" spacing={1}>
                {ADDRESS_TYPES.map((type) => {
                  const cfg = typeConfig[type]
                  const active = form.type === type
                  return (
                    <Chip
                      key={type}
                      icon={<Box sx={{ color: active ? cfg.color : 'text.secondary', display: 'flex' }}>{cfg.icon}</Box>}
                      label={t(`addresses.type_${type}`)}
                      onClick={() => setForm((p) => ({ ...p, type }))}
                      sx={{
                        fontWeight: 700,
                        cursor: 'pointer',
                        bgcolor: active ? cfg.bg : 'transparent',
                        color: active ? cfg.color : 'text.secondary',
                        border: active ? `1px solid ${cfg.color}50` : '1px solid rgba(0,0,0,0.15)',
                        transition: 'all 0.2s',
                        '& .MuiChip-icon': { ml: '6px', mr: '-4px' },
                      }}
                    />
                  )
                })}
              </Stack>
            </Stack>

            <TextField
              label={t('addresses.addressLabel')}
              placeholder={t('addresses.addressLabelHint')}
              value={form.label}
              onChange={updateField('label')}
              fullWidth
              required
              inputProps={{ maxLength: 40 }}
              helperText={`${form.label.length}/40`}
            />
            <TextField
              label={t('addresses.contactName')}
              value={form.name}
              onChange={updateField('name')}
              fullWidth
              required
            />
            <TextField
              label={t('addresses.contactPhone')}
              value={form.phone}
              onChange={updateField('phone')}
              fullWidth
              required
              placeholder="+60 12-345 6789"
            />
            <TextField
              label={t('addresses.fullAddress')}
              value={form.address}
              onChange={updateField('address')}
              fullWidth
              required
              multiline
              minRows={3}
              placeholder={t('addresses.addressHint')}
              inputProps={{ maxLength: 300 }}
              helperText={`${form.address.length}/300`}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 1.5, gap: 1 }}>
          <Button onClick={handleClose} sx={{ textTransform: 'none' }}>{t('addresses.cancel')}</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!form.label || !form.name || !form.phone || !form.address}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #0f766e, #14b8a6)',
            }}
          >
            {isEditing ? t('addresses.saveChanges') : t('addresses.saveAddress')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Delete Confirm Dialog ── */}
      <Dialog open={Boolean(deleteDialog)} onClose={() => setDeleteDialog(null)} maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700, color: '#ef4444' }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <MdDeleteOutline size={20} />
            <Typography fontWeight={700} color="#ef4444">{t('addresses.deleteTitle')}</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            {t('addresses.deleteConfirm', { label: deleteDialog?.label || '' })}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 1.5, gap: 1 }}>
          <Button onClick={() => setDeleteDialog(null)} sx={{ textTransform: 'none' }}>{t('addresses.cancel')}</Button>
          <Button
            variant="contained"
            color="error"
            onClick={confirmDelete}
            sx={{ textTransform: 'none', fontWeight: 700 }}
          >
            {t('addresses.deleteConfirmBtn')}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}

export default SavedAddresses
