import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import PageHeader from "../components/PageHeader.jsx";
import SwarmNetworkMini from "../components/SwarmNetworkMini.jsx";

const feedColors = {
  success: {
    dot: "#22c55e",
    bg: "rgba(34,197,94,0.06)",
    border: "rgba(34,197,94,0.12)",
  },
  warning: {
    dot: "#eab308",
    bg: "rgba(234,179,8,0.06)",
    border: "rgba(234,179,8,0.12)",
  },
  info: {
    dot: "#0ea5e9",
    bg: "rgba(14,165,233,0.06)",
    border: "rgba(14,165,233,0.12)",
  },
};

const feedItems = [
  { key: "feed1", type: "success" },
  { key: "feed2", type: "warning" },
  { key: "feed3", type: "info" },
  { key: "feed4", type: "success" },
  { key: "feed5", type: "info" },
];

function IntelligencePage() {
  const { t } = useTranslation();

  const swarmMetrics = [
    { labelKey: "intelligence.activeDroneSwarm", value: 18 },
    {
      labelKey: "intelligence.collisionAvoidance",
      value: t("intelligence.active"),
    },
    {
      labelKey: "intelligence.routeOptimization",
      value: t("intelligence.running"),
    },
    { labelKey: "intelligence.swarmEfficiency", value: "94%" },
    {
      labelKey: "intelligence.cooperativeDelivery",
      value: t("intelligence.enabled"),
      tone: "success",
    },
  ];

  return (
    <Stack spacing={2.5}>
      <Box className="reveal-up">
        <PageHeader
          title={t("intelligence.title")}
          subtitle={t("intelligence.subtitle")}
        />
      </Box>

      <Grid container spacing={1.5}>
        {swarmMetrics.map((metric, i) => (
          <Grid key={metric.labelKey} size={{ xs: 12, sm: 6, lg: 3 }}>
            <Box className={`reveal-up delay-${i + 1}`}>
              <Card
                className="hover-lift glow-card"
                sx={{ height: "100%", borderRadius: 3 }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      fontSize: "0.68rem",
                    }}
                  >
                    {t(metric.labelKey)}
                  </Typography>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ mt: 0.8 }}
                  >
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>
                      {metric.value}
                    </Typography>
                    {typeof metric.value === "number" && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          bgcolor: "#22c55e",
                          animation: "livePulse 2s ease-in-out infinite",
                          boxShadow: "0 0 8px rgba(34,197,94,0.5)",
                        }}
                      />
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Box className="reveal-up delay-5">
            <SwarmNetworkMini />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Box className="reveal-up delay-6">
            <Card
              className="hover-lift glow-card"
              sx={{ height: "100%", borderRadius: 3 }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {t("intelligence.aiHealthFeed")}
                  </Typography>
                  <Chip
                    label={t("common.live")}
                    size="small"
                    icon={
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          bgcolor: "#22c55e",
                          ml: 1,
                          animation: "livePulse 2s ease-in-out infinite",
                        }}
                      />
                    }
                    sx={{
                      bgcolor: "rgba(34,197,94,0.08)",
                      color: "#22c55e",
                      fontWeight: 800,
                      fontSize: "0.6rem",
                      letterSpacing: "0.1em",
                      border: "1px solid rgba(34,197,94,0.15)",
                    }}
                  />
                </Stack>
                <Stack spacing={1}>
                  {feedItems.map((log, i) => {
                    const colors = feedColors[log.type];
                    return (
                      <Box
                        key={i}
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 1.2,
                          p: 1.2,
                          borderRadius: 2.5,
                          bgcolor: colors.bg,
                          border: `1px solid ${colors.border}`,
                          transition: "all 0.2s ease",
                          "&:hover": {
                            borderColor: colors.dot,
                            transform: "translateX(4px)",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: colors.dot,
                            mt: 0.7,
                            flexShrink: 0,
                          }}
                        />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: "0.82rem", lineHeight: 1.5 }}
                        >
                          {t(`intelligence.${log.key}`)}
                        </Typography>
                      </Box>
                    );
                  })}
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Stack>
  );
}

export default IntelligencePage;
