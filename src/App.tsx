import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import { OverviewPage } from "./pages/dashboard/OverviewPage";
import { TransactionsPage } from "./pages/dashboard/TransactionsPage";
import { GoalsPage } from "./pages/dashboard/GoalsPage";
import { InvestmentsPage } from "./pages/dashboard/InvestmentsPage";
import { AssistantPage } from "./pages/dashboard/AssistantPage";
import { SettingsPage } from "./pages/dashboard/SettingsPage";
import { BankConnectionsPage } from "./pages/dashboard/BankConnectionsPage";
import { NetWorthPage } from "./pages/dashboard/NetWorthPage";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { ThemeProvider } from "@/components/theme-provider";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<OverviewPage />} />
              <Route path="transactions" element={<TransactionsPage />} />
              <Route path="goals" element={<GoalsPage />} />
              <Route path="investments" element={<InvestmentsPage />} />
              <Route path="connections" element={<BankConnectionsPage />} />
              <Route path="assistant" element={<AssistantPage />} />
              <Route path="net-worth" element={<NetWorthPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
