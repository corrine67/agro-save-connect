import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FaRocket, FaRobot } from "react-icons/fa6";
import PageHeader from "../components/PageHeader.jsx";
import { drones } from "../data/mockData.js";

const baseEtaByPriority = {
  Low: 18,
  Medium: 14,
  High: 10,
};

const SWARM_WEIGHT_THRESHOLD = 5.0; // kg

function CreateOrderPage() {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    customerName: "",
    deliveryAddress: "",
    parcelWeight: "",
    priority: "Medium",
  });
  const [result, setResult] = useState("");
  const [isSwarm, setIsSwarm] = useState(false);

  const availableDrones = useMemo(() => {
    return drones
      .filter((drone) => drone.status === "Idle")
      .sort((a, b) => b.batteryLevel - a.batteryLevel);
  }, []);

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleAssign = (event) => {
    event.preventDefault();
    const weight = parseFloat(form.parcelWeight);

    if (weight > SWARM_WEIGHT_THRESHOLD) {
      // Swarm Logic: Needs 2 drones
      if (availableDrones.length < 2) {
        setResult(t("order.noDronesAvailable"));
        setIsSwarm(false);
        return;
      }

      const drone1 = availableDrones[0];
      const drone2 = availableDrones[1];
      const eta =
        baseEtaByPriority[form.priority] + Math.floor(Math.random() * 3);

      setResult(
        t("order.swarmAssigned", {
          drone1: drone1.droneId,
          drone2: drone2.droneId,
          eta,
        })
      );
      setIsSwarm(true);
    } else {
      // Standard Logic: Needs 1 drone
      if (availableDrones.length < 1) {
        setResult(t("order.noDronesAvailable"));
        setIsSwarm(false);
        return;
      }

      const bestDrone = availableDrones[0];
      const eta =
        baseEtaByPriority[form.priority] + Math.floor(Math.random() * 4);
      setResult(t("order.droneAssigned", { droneId: bestDrone.droneId, eta }));
      setIsSwarm(false);
    }
  };

  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 1.5,
      backgroundColor: "rgba(255, 255, 255, 0.5)",
      transition: "all 0.3s ease",
      "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        boxShadow: "0 2px 8px rgba(15,118,110,0.08)",
      },
      "&.Mui-focused": {
        backgroundColor: "rgba(255, 255, 255, 1)",
        boxShadow: "0 0 0 2px rgba(20,184,166,0.15)",
      },
    },
    "& .MuiOutlinedInput-input": {
      fontSize: "0.95rem",
      fontWeight: 500,
    },
  };

  const selectSx = {
    borderRadius: 1.5,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    transition: "all 0.3s ease",
    "& .MuiOutlinedInput-root": {
      transition: "all 0.3s ease",
      "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        boxShadow: "0 2px 8px rgba(15,118,110,0.08)",
      },
      "&.Mui-focused": {
        backgroundColor: "rgba(255, 255, 255, 1)",
        boxShadow: "0 0 0 2px rgba(20,184,166,0.15)",
      },
    },
  };

  return (
    <Stack spacing={2.5}>
      <Box className="reveal-up">
        <PageHeader title={t("order.title")} subtitle={t("order.subtitle")} />
      </Box>

      <Box className="reveal-up delay-1">
        <Card
          className="hover-lift glow-card"
          sx={{
            borderRadius: 3,
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,253,250,0.95) 100%)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(20,184,166,0.1)",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Stack component="form" onSubmit={handleAssign} spacing={3}>
              {/* Row 1: Customer Name and Delivery Address */}
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={0.8}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        color: "#0f766e",
                        fontSize: "0.85rem",
                      }}
                    >
                      {t("order.customerName")}{" "}
                      <span style={{ color: "#ef4444" }}>*</span>
                    </Typography>
                    <TextField
                      placeholder="Enter customer name"
                      value={form.customerName}
                      onChange={handleChange("customerName")}
                      fullWidth
                      required
                      size="small"
                      variant="outlined"
                      sx={textFieldSx}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={0.8}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        color: "#0f766e",
                        fontSize: "0.85rem",
                      }}
                    >
                      {t("order.deliveryAddress")}{" "}
                      <span style={{ color: "#ef4444" }}>*</span>
                    </Typography>
                    <TextField
                      placeholder="Enter delivery address"
                      value={form.deliveryAddress}
                      onChange={handleChange("deliveryAddress")}
                      fullWidth
                      required
                      size="small"
                      variant="outlined"
                      sx={textFieldSx}
                    />
                  </Stack>
                </Grid>
              </Grid>

              {/* Row 2: Parcel Weight and Delivery Priority */}
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={0.8}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        color: "#0f766e",
                        fontSize: "0.85rem",
                      }}
                    >
                      {t("order.parcelWeight")}{" "}
                      <span style={{ color: "#ef4444" }}>*</span>
                    </Typography>
                    <TextField
                      placeholder="0.0 kg"
                      type="number"
                      value={form.parcelWeight}
                      onChange={handleChange("parcelWeight")}
                      inputProps={{ min: 0.1, step: 0.1 }}
                      fullWidth
                      required
                      size="small"
                      variant="outlined"
                      sx={textFieldSx}
                    />
                    {parseFloat(form.parcelWeight) > SWARM_WEIGHT_THRESHOLD && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#0f766e",
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        ✓ {t("order.heavyWeightAlert")}
                      </Typography>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={0.8}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        color: "#0f766e",
                        fontSize: "0.85rem",
                      }}
                    >
                      {t("order.deliveryPriority")}
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        value={form.priority}
                        onChange={handleChange("priority")}
                        variant="outlined"
                        sx={selectSx}
                      >
                        <MenuItem value="Low">
                          {t("order.priorityLow")}
                        </MenuItem>
                        <MenuItem value="Medium">
                          {t("order.priorityMedium")}
                        </MenuItem>
                        <MenuItem value="High">
                          {t("order.priorityHigh")}
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                </Grid>
              </Grid>

              {/* Row 3: Assign Drone Button (Full Width) */}
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                startIcon={
                  parseFloat(form.parcelWeight) > SWARM_WEIGHT_THRESHOLD ? (
                    <FaRobot />
                  ) : (
                    <FaRocket />
                  )
                }
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  borderRadius: 1.5,
                  px: 4,
                  py: 1.6,
                  fontSize: "1rem",
                  letterSpacing: "0.3px",
                  background:
                    parseFloat(form.parcelWeight) > SWARM_WEIGHT_THRESHOLD
                      ? "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)"
                      : "linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)",
                  boxShadow:
                    parseFloat(form.parcelWeight) > SWARM_WEIGHT_THRESHOLD
                      ? "0 4px 12px rgba(59,130,246,0.3)"
                      : "0 4px 12px rgba(15,118,110,0.3)",
                  transition: "all 0.3s ease",
                  marginTop: 1,
                  "&:hover": {
                    background:
                      parseFloat(form.parcelWeight) > SWARM_WEIGHT_THRESHOLD
                        ? "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)"
                        : "linear-gradient(135deg, #115e59 0%, #0f766e 100%)",
                    boxShadow:
                      parseFloat(form.parcelWeight) > SWARM_WEIGHT_THRESHOLD
                        ? "0 6px 20px rgba(59,130,246,0.4)"
                        : "0 6px 20px rgba(15,118,110,0.4)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                {t("order.assignDrone")}
              </Button>
            </Stack>

            {result && (
              <Alert
                severity={isSwarm ? "info" : "success"}
                sx={{
                  mt: 3,
                  borderRadius: 1.5,
                  border: isSwarm
                    ? "1px solid rgba(59,130,246,0.3)"
                    : "1px solid rgba(34,197,94,0.3)",
                  bgcolor: isSwarm
                    ? "rgba(59,130,246,0.08)"
                    : "rgba(34,197,94,0.08)",
                  "& .MuiAlert-icon": {
                    color: isSwarm ? "#3b82f6" : "#22c55e",
                  },
                  "& .MuiAlert-message": {
                    fontWeight: 500,
                    fontSize: "0.95rem",
                  },
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {result}
                </Typography>
              </Alert>
            )}
          </CardContent>
        </Card>
      </Box>
    </Stack>
  );
}

export default CreateOrderPage;
