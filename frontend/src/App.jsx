import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import { isLoggedIn, getUser } from "./services/auth";

function ProtectedRoute({ children, role }) {
  if (!isLoggedIn()) return <Navigate to="/login" replace />;
  const user = getUser();
  if (role && user.role !== role) {
    return (
      <Navigate to={user.role === "ADMIN" ? "/admin" : "/dashboard"} replace />
    );
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🏠 LANDING — Homepage ibanza kuboneka */}
        <Route path="/" element={<Landing />} />

        {/* 🔐 Login */}
        <Route path="/login" element={<Login />} />

        {/* ✍️ Sign Up */}
        <Route path="/signup" element={<Signup />} />

        {/* 🛡️ Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* 👤 User Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}