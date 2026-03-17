import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import QRCode from 'qrcode'
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { FaClockRotateLeft, FaQrcode } from 'react-icons/fa6'
import PageHeader from '../components/PageHeader.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'
import { deliveryHistoryRecords } from '../data/clientFeaturesData.js'

const statusPalette = {
  Delivered: { color: "#22c55e", bg: "rgba(34,197,94,0.14)" },
  Cancelled: { color: "#ef4444", bg: "rgba(239,68,68,0.14)" },
  Failed: { color: "#f97316", bg: "rgba(249,115,22,0.14)" },
};

// Placeholder Google Form URL - user can replace this
const FEEDBACK_FORM_URL = "https://forms.gle/placeholder";

function DeliveryHistory() {
  const { t } = useTranslation()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [date, setDate] = useState('')
  const [qrCodeUrl, setQrCodeUrl] = useState('')

  useEffect(() => {
    let isMounted = true

    QRCode.toDataURL(FEEDBACK_FORM_URL, {
      width: 320,
      margin: 1,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#111827',
        light: '#ffffff',
      },
    })
      .then((url) => {
        if (isMounted) {
          setQrCodeUrl(url)
        }
      })
      .catch(() => {
        if (isMounted) {
          setQrCodeUrl('')
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  const filteredRows = useMemo(() => {
    const normalized = search.trim().toLowerCase()

    return deliveryHistoryRecords.filter((row) => {
      // SME users (role: 'user') can only see their own parcels
      // Managers can see all parcels
      const isOwnedByUser = user.role === 'manager' || row.userId === user.id;

      const matchesSearch = !normalized
        || row.id.toLowerCase().includes(normalized)
        || row.address.toLowerCase().includes(normalized)
        || row.drone.toLowerCase().includes(normalized)

      const matchesStatus = status === "all" || row.status === status;
      const matchesDate = !date || row.date === date;

      return isOwnedByUser && matchesSearch && matchesStatus && matchesDate
    })
  }, [search, status, date, user.id, user.role])

  return (
    <Stack spacing={2.5}>
      <Box className="reveal-up">
        <PageHeader
          title={t("history.title")}
          subtitle={t("history.subtitle")}
        />
      </Box>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={8}>
          <Box className="reveal-up delay-1">
            <Card className="hover-lift glow-card" sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: { xs: 2.2, md: 2.8 } }}>
                <Grid container spacing={1.5} sx={{ mb: 2.2 }}>
                  <Grid item xs={12} md={5}>
                    <TextField
                      fullWidth
                      size="small"
                      label={t("history.searchLabel")}
                      placeholder={t("history.searchPlaceholder")}
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3.5}>
                    <TextField
                      fullWidth
                      select
                      size="small"
                      label={t("history.statusFilter")}
                      value={status}
                      onChange={(event) => setStatus(event.target.value)}
                    >
                      <MenuItem value="all">{t("history.statusAll")}</MenuItem>
                      <MenuItem value="Delivered">
                        {t("history.delivered")}
                      </MenuItem>
                      <MenuItem value="Cancelled">
                        {t("history.cancelled")}
                      </MenuItem>
                      <MenuItem value="Failed">{t("history.failed")}</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3.5}>
                    <TextField
                      fullWidth
                      size="small"
                      label={t("history.dateFilter")}
                      type="date"
                      value={date}
                      onChange={(event) => setDate(event.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </Grid>

                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1.1}
                  sx={{ mb: 1.5 }}
                >
                  <FaClockRotateLeft color="#14b8a6" />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 600 }}
                  >
                    {t("history.resultsCount", { count: filteredRows.length })}
                  </Typography>
                </Stack>

                <TableContainer>
                  <Table size="small" sx={{ minWidth: 600 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>
                          {t("history.parcelId")}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>
                          {t("history.destinationAddress")}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>
                          {t("history.assignedDrone")}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>
                          {t("history.deliveryDate")}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>
                          {t("history.deliveryStatus")}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredRows.map((row) => (
                        <TableRow key={row.id} hover>
                          <TableCell sx={{ fontWeight: 700 }}>
                            {row.id}
                          </TableCell>
                          <TableCell>{row.address}</TableCell>
                          <TableCell>{row.drone}</TableCell>
                          <TableCell>{row.date}</TableCell>
                          <TableCell>
                            <Chip
                              label={t(`history.${row.status.toLowerCase()}`)}
                              size="small"
                              sx={{
                                fontWeight: 700,
                                color: statusPalette[row.status].color,
                                backgroundColor: statusPalette[row.status].bg,
                                border: `1px solid ${
                                  statusPalette[row.status].color
                                }55`,
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}

                      {filteredRows.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                            <Typography variant="body2" color="text.secondary">
                              {t("history.noResults")}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box className="reveal-up delay-2">
            <Card
              className="hover-lift glow-card"
              sx={{
                borderRadius: 3,
                height: "100%",
                background: isDark 
                  ? "linear-gradient(135deg, rgba(16,24,40,0.8) 0%, rgba(22,39,44,0.8) 100%)"
                  : "linear-gradient(135deg, #ffffff 0%, #f0fdfa 100%)",
              }}
            >
              <CardContent
                sx={{
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: "50%",
                    bgcolor: "rgba(20,184,166,0.1)",
                    mb: 2,
                  }}
                >
                  <FaQrcode size={24} color="#14b8a6" />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  {t("history.feedbackTitle")}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  {t("history.feedbackSubtitle")}
                </Typography>

                <Box
                  sx={{
                    p: 2,
                    bgcolor: isDark ? "rgba(255,255,255,0.1)" : "#fff",
                    borderRadius: 3,
                    boxShadow: isDark ? "0 4px 12px rgba(0,0,0,0.3)" : "0 4px 12px rgba(0,0,0,0.05)",
                    mb: 3,
                    cursor: "pointer",
                    transition: "transform 0.2s",
                    border: isDark ? "1px solid rgba(20,184,166,0.2)" : "none",
                    "&:hover": { transform: "scale(1.05)" },
                  }}
                  onClick={() => window.open(FEEDBACK_FORM_URL, "_blank")}
                >
                  {qrCodeUrl ? (
                    <img
                      src={qrCodeUrl}
                      alt="Feedback QR Code"
                      style={{
                        width: "160px",
                        height: "160px",
                        display: "block",
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: 160,
                        height: 160,
                        display: 'grid',
                        placeItems: 'center',
                        color: 'text.secondary',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                      }}
                    >
                      Generating QR...
                    </Box>
                  )}
                </Box>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 600 }}
                >
                  {t("history.scanPrompt")}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Stack>
  );
}

export default DeliveryHistory;
