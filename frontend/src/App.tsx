import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
// Public pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Protected User pages
import Dashboard from "./pages/Dashboard";       
import EventDetail from "./pages/EventDetail";  
import InvitePage from "./pages/Invite";
// Admin pages
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./pages/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminEvents from "./pages/AdminEvents";
import AdminGuests from "./pages/AdminGuest";

import UserProtectedRoute from "./routes/UserProtect";
import AdminProtectedRoute from "./routes/AdminProtect";

function App() {
  return (
    <>
     <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#18181b",
            color: "#fff",
            borderRadius: "16px",
            padding: "12px 16px",
          },
          success: {
            iconTheme: {
              primary: "#7c3aed", // violet
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
     <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/invite/:token" element={<InvitePage/>}/>

      {/* Protected User Routes */}
      <Route
        path="/dashboard"
        element={
          <UserProtectedRoute>
            <Dashboard />
          </UserProtectedRoute>
        }
      />

      <Route
        path="/event/:id"
        element={
          <UserProtectedRoute>
            <EventDetail />
          </UserProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="events" element={<AdminEvents />} />
        <Route path="guests" element={<AdminGuests />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
   
  );
}

export default App;