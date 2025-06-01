import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Login from "@/pages/Login";
import AdminDashboard from "@/pages/Dashboard"; 
import UserDashboard from "@/pages/UserDashboard";
import Accounts from "@/pages/Accounts";
import AccountDetails from "@/pages/AccountDetails";
import Loans from "@/pages/Loans";
import Credits from "@/pages/Credits";
import { AuthProvider, useAuth } from "@/contexts/AuthContext"; // Moved useAuth import here
import { BankProvider } from "@/contexts/BankContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminLayout from "@/components/Layout"; 
import UserLayout from "@/components/UserLayout";

function App() {
  return (
    <Router>
      <AuthProvider>
        <BankProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
              <Route path="/admin/accounts" element={<AdminLayout><Accounts /></AdminLayout>} />
              <Route path="/admin/accounts/:id" element={<AdminLayout><AccountDetails /></AdminLayout>} />
              <Route path="/admin/loans" element={<AdminLayout><Loans /></AdminLayout>} />
              <Route path="/admin/credits" element={<AdminLayout><Credits /></AdminLayout>} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['client']} />}>
              <Route path="/client/dashboard" element={<UserLayout><UserDashboard /></UserLayout>} />
              {/* Add more client-specific routes here if needed */}
            </Route>
            
            {/* Fallback for /dashboard to redirect based on role */}
            <Route path="/dashboard" element={<DashboardRedirector />} />

          </Routes>
          <Toaster />
        </BankProvider>
      </AuthProvider>
    </Router>
  );
}

// Helper component to redirect from /dashboard based on user role
const DashboardRedirector = () => {
  const { user } = useAuth(); // useAuth is now correctly imported at the top
  if (user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  } else if (user?.role === 'client') {
    return <Navigate to="/client/dashboard" replace />;
  }
  return <Navigate to="/login" replace />; 
};

export default App;