import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import {  useMemo } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { themeSettings } from "theme";
import Layout from "pages/layout";
import Dashboard from "pages/dashboard";
import Stock from "pages/stock";
import Income from "pages/income";
import PCSales from "pages/pcs";
import ArticleSales from "pages/article";
import Maintenance from "pages/maintenance";
import Shipements from "pages/shipment";
import Suppliers from "pages/supplier";
import History from "pages/history";
import Profile from "pages/profile";
import Login from "pages/login";

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<Layout />}>
              <Route path="*" exact element={<Navigate to="/" />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/stock" element={<Stock />} />
              <Route path="/revenu" element={<Income />} />
              <Route path="/pc" element={<PCSales />} />
              <Route path="/article" element={<ArticleSales />} />
              <Route path="/maintenance" element={<Maintenance />} />
              <Route path="/stock" element={<Stock />} />
              <Route path="/fournisseurs" element={<Suppliers />} />
              <Route path="/expeditions" element={<Shipements />} />
              <Route path="/history" element={<History />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
