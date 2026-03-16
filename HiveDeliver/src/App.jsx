import { useMemo, useState } from "react";
import { Navigate, Route, Routes, Outlet } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext } from "./ColorModeContext.jsx";
import { createAppTheme } from "./theme.js";
import AppShell from "./components/AppShell.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import LiveMapPage from "./pages/LiveMapPage.jsx";
import CreateOrderPage from "./pages/CreateOrderPage.jsx";
import IntelligencePage from "./pages/IntelligencePage.jsx";
import AnalyticsPage from "./pages/AnalyticsPage.jsx";
import FleetPage from "./pages/FleetPage.jsx";
import DeliveryHistory from "./pages/DeliveryHistory.jsx";
import SavedAddresses from "./pages/SavedAddresses.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import RequireAuth from "./components/RequireAuth.jsx";

function AppLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

function App() {
  const [mode, setMode] = useState("light");

  const colorMode = useMemo(
    () => ({
      mode,
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    [mode]
  );

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<RegisterPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            element={
              <RequireAuth>
                <AppLayout />
              </RequireAuth>
            }
          >
            <Route path="/home" element={<LandingPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/map" element={<LiveMapPage />} />
            <Route path="/order" element={<CreateOrderPage />} />
            <Route path="/history" element={<DeliveryHistory />} />
            <Route path="/addresses" element={<SavedAddresses />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/intelligence" element={<IntelligencePage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/fleet" element={<FleetPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
