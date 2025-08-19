import AdminDashboard from "./AdminDashboard";
import Home from "./Home";
import { Navigate } from "react-router-dom";

export default function RoleDashboard() {
  const userRole = getUserRole();

  // If no role is found, redirect to login
  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  // Render appropriate dashboard based on role
  switch (userRole) {
    case 'admin':
      return <AdminDashboard />;
    case 'user':
      return <Home />;
    default:
      // If role is not recognized, redirect to login
      return <Navigate to="/login" replace />;
  }
} 